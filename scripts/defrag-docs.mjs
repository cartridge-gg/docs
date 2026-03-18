#!/usr/bin/env node

/**
 * Phase 2: Content defragmentation (LLM-powered).
 *
 * Two-stage flow:
 *   1. Analysis: Read all pages in each section together, produce a report
 *      of cross-page issues (redundancy, terminology drift, missing links).
 *   2. Editing: For each file that needs changes, send the file + the
 *      relevant report + style guide, get back the complete corrected file.
 *
 * Size guard: if a file's diff exceeds MAX_REMOVED_LINES net removed lines,
 * the change is skipped and logged for manual review.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-... node scripts/defrag-docs.mjs
 *   ANTHROPIC_API_KEY=sk-... node scripts/defrag-docs.mjs --dry-run
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, relative, dirname } from "path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const DOCS_DIR = join(ROOT, "src", "pages");
const STYLE_GUIDE_PATH = join(ROOT, "STYLE_GUIDE_AGENT.md");
const MODEL = "claude-sonnet-4-20250514";
const API_URL = "https://api.anthropic.com/v1/messages";
const DRY_RUN = process.argv.includes("--dry-run");
const MAX_REMOVED_LINES = 10;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function loadTextFile(path) {
    return readFileSync(path, "utf-8");
}

function collectDocFiles(dir, base = dir) {
    const results = [];
    for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        const rel = relative(base, full);
        const stat = statSync(full);
        if (stat.isDirectory()) {
            results.push(...collectDocFiles(full, base));
        } else if (/\.(md|mdx)$/.test(entry)) {
            results.push({ path: full, rel });
        }
    }
    return results;
}

function groupBySection(files) {
    const groups = {};
    for (const f of files) {
        const section = dirname(f.rel).split("/")[0] || "_root";
        if (!groups[section]) groups[section] = [];
        groups[section].push(f);
    }
    return groups;
}

function countNetRemovedLines(original, corrected) {
    const origLines = original.split("\n").length;
    const corrLines = corrected.split("\n").length;
    return origLines - corrLines;
}

async function callClaude(system, userContent, maxTokens = 16000) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        throw new Error("ANTHROPIC_API_KEY environment variable is required");
    }

    const body = {
        model: MODEL,
        max_tokens: maxTokens,
        system,
        messages: [{ role: "user", content: userContent }],
    };

    const res = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Claude API error ${res.status}: ${text}`);
    }

    const data = await res.json();
    return data.content[0].text;
}

// ---------------------------------------------------------------------------
// Style guide
// ---------------------------------------------------------------------------

let styleGuide;
try {
    styleGuide = loadTextFile(STYLE_GUIDE_PATH);
} catch {
    console.warn("Warning: STYLE_GUIDE_AGENT.md not found, running without style guide");
    styleGuide = "";
}

// ---------------------------------------------------------------------------
// Stage 1: Analysis — produce a report per section
// ---------------------------------------------------------------------------

const ANALYSIS_SYSTEM = `You are a documentation editor for Cartridge, a high-performance infrastructure platform for provable games and applications on Starknet.

You will receive all documentation pages from one section of the docs.
Analyze them for cross-page issues and produce a structured report.

${styleGuide ? `## Style guide\n\n${styleGuide}\n\n` : ""}Focus on:
1. **Redundancy**: Content duplicated or substantially repeated across pages. Identify which page has the best version and which pages should defer to it.
2. **Terminology inconsistency**: The same concept referred to with different terms across pages. Use the style guide as the source of truth for canonical terms.
3. **Missing cross-references**: Pages that discuss related topics but don't link to each other. Mark uncertain links with [TODO: link to X].
4. **Structural issues**: Pages that overlap in scope or whose boundaries are unclear.

Do NOT flag:
- Issues that are purely within a single page (formatting, sentence structure) — these are handled by the formatting pass
- Minor stylistic preferences
- Code block content

Output format — a plain text report with sections:

## Redundancy
- [description of duplicated content, which files, which version to keep]

## Terminology
- [inconsistent term]: used as "[X]" in file A, "[Y]" in file B. Prefer "[Z]" per style guide.

## Missing cross-references
- file A should link to file B when discussing [topic]

## Structural issues
- [description]

If a category has no issues, write "None found." under it.`;

function buildAnalysisPrompt(section, files) {
    const fileContents = files
        .map((f) => `--- FILE: ${f.rel} ---\n${loadTextFile(f.path)}`)
        .join("\n\n");

    return `Analyze these ${files.length} documentation pages from the "${section}" section:\n\n${fileContents}`;
}

// ---------------------------------------------------------------------------
// Stage 2: Editing — rewrite files based on the report
// ---------------------------------------------------------------------------

const EDIT_SYSTEM = `You are a documentation editor for Cartridge, a high-performance infrastructure platform for provable games and applications on Starknet.

You will receive:
1. A style guide with canonical terminology and formatting rules.
2. An editorial report describing cross-page issues found in a documentation section.
3. A single documentation file to edit.

Your job is to return the COMPLETE corrected file content, addressing:
- Issues from the report that apply to this file
- Terminology corrections per the style guide

${styleGuide ? `## Style guide\n\n${styleGuide}\n\n` : ""}## Rules
- Return ONLY the corrected file content — no commentary, no wrapping, no code fences.
- Preserve all frontmatter and code blocks exactly.
- Do not change formatting (whitespace, line breaks, EOF) — this is handled by a separate formatting pass.
- Do not invent new content or add explanations that weren't there.
- Do not remove more than ${MAX_REMOVED_LINES} lines from a file. If the report suggests a larger removal, add a TODO comment instead: <!-- TODO: deduplicate with /controller/sessions -->
- When the report says to replace duplicated content with a cross-reference, use a brief mention with a markdown link to the canonical page. Use [TODO: link to X] if you cannot verify the target.
- Do not add or change links unless the report specifically recommends it and you can verify the target path exists in the file listing. When uncertain, use [TODO: link to X].
- If the file needs no changes, return it exactly as-is.
- Preserve the original voice and technical accuracy.
- Use single asterisks for italics and double asterisks for bold. Do not use underscores for emphasis.`;

function buildEditPrompt(report, file, allFiles) {
    const content = loadTextFile(file.path);
    const fileListing = allFiles.map((f) => f.rel).join("\n");

    return `## Editorial report for this section

${report}

## Files in this section (for verifying link targets)

${fileListing}

## File to edit: ${file.rel}

${content}`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
    console.log("=== Phase 2: Content Defragmentation ===");
    console.log(`Mode: ${DRY_RUN ? "DRY RUN" : "LIVE"}`);
    console.log(`Max net removed lines per file: ${MAX_REMOVED_LINES}`);
    console.log();

    const allFiles = collectDocFiles(DOCS_DIR);
    const sections = groupBySection(allFiles);

    console.log(
        `Found ${allFiles.length} doc files across ${Object.keys(sections).length} sections`
    );
    console.log();

    let filesChanged = 0;
    let filesUnchanged = 0;
    let filesErrored = 0;
    let filesSkipped = 0;
    const changeLog = [];
    const skipLog = [];

    for (const [section, files] of Object.entries(sections)) {
        console.log(`\n=== Section: ${section} (${files.length} files) ===`);

        // Stage 1: Analyze the section
        let report = "No cross-page issues (single-file section).";
        if (files.length >= 2) {
            console.log("  Analyzing cross-page issues...");
            try {
                report = await callClaude(
                    ANALYSIS_SYSTEM,
                    buildAnalysisPrompt(section, files)
                );
                console.log("  Report generated.");
            } catch (err) {
                console.error(`  Analysis failed: ${err.message}`);
                report =
                    "Analysis unavailable due to error. Focus on terminology corrections per style guide only.";
            }
        }

        // Stage 2: Edit each file with the report as context
        for (const file of files) {
            const original = loadTextFile(file.path);
            console.log(`  Editing ${file.rel}...`);

            try {
                const corrected = await callClaude(
                    EDIT_SYSTEM,
                    buildEditPrompt(report, file, allFiles),
                    Math.max(16000, Math.ceil(original.length / 3))
                );

                // Normalize trailing newline before comparing
                const normalizedCorrected = corrected.replace(/\n*$/, "\n");

                if (normalizedCorrected === original) {
                    console.log(`    No changes.`);
                    filesUnchanged++;
                    continue;
                }

                // Size guard: reject large removals
                const netRemoved = countNetRemovedLines(original, normalizedCorrected);
                if (netRemoved > MAX_REMOVED_LINES) {
                    console.log(
                        `    SKIPPED: ${netRemoved} net lines removed (limit: ${MAX_REMOVED_LINES})`
                    );
                    filesSkipped++;
                    skipLog.push({
                        file: file.rel,
                        netRemoved,
                    });
                    continue;
                }

                if (!DRY_RUN) {
                    writeFileSync(file.path, normalizedCorrected, "utf-8");
                }
                filesChanged++;
                changeLog.push(file.rel);
                console.log(`    Updated (${netRemoved > 0 ? `-${netRemoved}` : `+${-netRemoved}`} net lines).`);
            } catch (err) {
                console.error(`    Error: ${err.message}`);
                filesErrored++;
            }
        }
    }

    // Summary
    console.log("\n=== Summary ===");
    console.log(`Files changed:   ${filesChanged}`);
    console.log(`Files unchanged: ${filesUnchanged}`);
    console.log(`Files skipped:   ${filesSkipped}`);
    console.log(`Files errored:   ${filesErrored}`);

    if (changeLog.length > 0) {
        console.log("\n=== Changed files ===");
        for (const f of changeLog) {
            console.log(`- ${f}`);
        }
    }

    if (skipLog.length > 0) {
        console.log("\n=== Skipped files (large removals — needs manual review) ===");
        for (const { file, netRemoved } of skipLog) {
            console.log(`- ${file} (${netRemoved} net lines removed)`);
        }
    }

    if (filesChanged === 0 && filesSkipped === 0) {
        console.log("\nNo changes needed — docs are clean!");
    }
}

main().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
});
