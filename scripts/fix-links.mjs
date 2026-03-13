#!/usr/bin/env node

/**
 * Phase 3: Link repair with build verification.
 *
 * 1. Scan all markdown/mdx source files for internal links
 * 2. Validate each link against the build output (src/dist/)
 * 3. For broken links, attempt to find the correct target
 * 4. Also resolve [TODO: link to X] markers left by phase 2
 *
 * Requires a build to have been run first (pnpm build).
 *
 * Usage:
 *   node scripts/fix-links.mjs
 *   node scripts/fix-links.mjs --dry-run
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "fs";
import { join, relative, dirname } from "path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const DOCS_DIR = join(ROOT, "src", "pages");
const DIST_DIR = join(ROOT, "src", "dist");
const DRY_RUN = process.argv.includes("--dry-run");

// ---------------------------------------------------------------------------
// File collection
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Build a map of valid pages and their heading anchors
// ---------------------------------------------------------------------------

function collectDistPages(dir, base = dir) {
    const pages = new Map(); // path → Set of anchor ids
    for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        const rel = "/" + relative(base, full);
        const stat = statSync(full);
        if (stat.isDirectory()) {
            // Check for index.html → this is a valid page
            const indexPath = join(full, "index.html");
            if (existsSync(indexPath)) {
                const html = readFileSync(indexPath, "utf-8");
                const anchors = new Set();
                // Extract all id attributes
                const idRegex = /\bid=["']([^"']+)["']/g;
                let match;
                while ((match = idRegex.exec(html)) !== null) {
                    anchors.add(match[1]);
                }
                pages.set(rel, anchors);
            }
            // Recurse into subdirectories
            for (const [k, v] of collectDistPages(full, base)) {
                pages.set(k, v);
            }
        }
    }
    return pages;
}

// ---------------------------------------------------------------------------
// Build a map of source pages (for suggesting fixes)
// ---------------------------------------------------------------------------

function buildSourcePageMap(files) {
    const map = new Map();
    for (const f of files) {
        // Convert "controller/sessions.md" → "/controller/sessions"
        const pagePath = "/" + f.rel.replace(/\.(md|mdx)$/, "").replace(/\/index$/, "");
        map.set(pagePath, f);
    }
    return map;
}

// ---------------------------------------------------------------------------
// Extract links from markdown
// ---------------------------------------------------------------------------

function extractLinks(content, filePath) {
    const links = [];
    const lines = content.split("\n");
    let inCodeBlock = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.trimStart().startsWith("```")) {
            inCodeBlock = !inCodeBlock;
            continue;
        }
        if (inCodeBlock) continue;

        // Match markdown links: [text](url)
        const linkRegex = /\[([^\]]*)\]\(([^)]+)\)/g;
        let match;
        while ((match = linkRegex.exec(line)) !== null) {
            const [full, text, url] = match;

            // Skip external links, images, mailto, anchors-only
            if (url.startsWith("http") || url.startsWith("mailto:") || url.startsWith("#")) continue;

            // Skip image file references
            if (/\.(png|svg|jpg|jpeg|gif|webp|ico)$/i.test(url)) continue;

            links.push({
                text,
                url,
                line: i + 1,
                full,
            });
        }

        // Match TODO markers: [TODO: link to X]
        const todoRegex = /\[TODO:\s*link\s+to\s+([^\]]+)\]/gi;
        while ((match = todoRegex.exec(line)) !== null) {
            links.push({
                text: match[0],
                url: null, // No URL — needs resolution
                line: i + 1,
                full: match[0],
                isTodo: true,
                todoTarget: match[1].trim(),
            });
        }
    }

    return links;
}

// ---------------------------------------------------------------------------
// Validate and fix links
// ---------------------------------------------------------------------------

function validateLink(url, pages, sourceFile) {
    // Strip .md/.mdx extension if present
    let cleanUrl = url.replace(/\.(md|mdx)$/, "").replace(/\.(md|mdx)(#)/, "$2");

    // Split path and anchor
    const [path, anchor] = cleanUrl.split("#");

    // Resolve relative paths
    let absolutePath = path;
    if (path.startsWith("./") || path.startsWith("../")) {
        const sourceDir = "/" + dirname(sourceFile.rel).replace(/\.(md|mdx)$/, "");
        absolutePath = resolveRelative(sourceDir, path);
    }

    // Normalize: remove trailing slash
    absolutePath = absolutePath.replace(/\/$/, "");

    // Check if page exists
    const pageAnchors = pages.get(absolutePath);
    if (!pageAnchors) {
        return { valid: false, reason: "page not found", path: absolutePath, anchor };
    }

    // Check anchor if present
    if (anchor && !pageAnchors.has(anchor)) {
        return { valid: false, reason: "anchor not found", path: absolutePath, anchor };
    }

    // Check for unnecessary extension
    if (/\.(md|mdx)/.test(url)) {
        return { valid: false, reason: "has extension", path: absolutePath, anchor };
    }

    return { valid: true };
}

function resolveRelative(base, rel) {
    const parts = base.split("/").filter(Boolean);
    for (const segment of rel.split("/")) {
        if (segment === "..") parts.pop();
        else if (segment !== "." && segment !== "") parts.push(segment);
    }
    return "/" + parts.join("/");
}

function suggestFix(result, url, pages) {
    if (result.reason === "has extension") {
        // Just strip the extension
        return url.replace(/\.(md|mdx)/, "");
    }

    if (result.reason === "anchor not found" && result.path) {
        // Page exists but anchor doesn't — drop the anchor
        return result.path;
    }

    if (result.reason === "page not found") {
        // Try to find a close match
        const target = result.path.split("/").pop();
        for (const [pagePath] of pages) {
            if (pagePath.endsWith("/" + target)) {
                let fix = pagePath;
                if (result.anchor) {
                    const anchors = pages.get(pagePath);
                    if (anchors && anchors.has(result.anchor)) {
                        fix += "#" + result.anchor;
                    }
                }
                return fix;
            }
        }
    }

    return null;
}

// ---------------------------------------------------------------------------
// Apply fixes to a file
// ---------------------------------------------------------------------------

function applyFixes(content, fixes) {
    let result = content;
    // Apply fixes in reverse order to preserve line positions
    for (const fix of fixes.reverse()) {
        result = result.replace(fix.original, fix.replacement);
    }
    return result;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
    console.log("=== Phase 3: Link Repair ===");
    console.log(`Mode: ${DRY_RUN ? "DRY RUN" : "LIVE"}`);
    console.log();

    // Check build output exists
    if (!existsSync(DIST_DIR)) {
        console.error("Error: Build output not found at src/dist/. Run 'pnpm build' first.");
        process.exit(1);
    }

    // Collect valid pages from build
    const pages = collectDistPages(DIST_DIR);
    console.log(`Found ${pages.size} pages in build output`);

    // Collect source files
    const sourceFiles = collectDocFiles(DOCS_DIR);
    console.log(`Found ${sourceFiles.length} source files`);
    console.log();

    let totalBroken = 0;
    let totalFixed = 0;
    let totalTodos = 0;
    let totalExtensionFixes = 0;
    let filesModified = 0;
    const unfixable = [];

    for (const file of sourceFiles) {
        const content = readFileSync(file.path, "utf-8");
        const links = extractLinks(content, file.path);
        const fixes = [];

        for (const link of links) {
            if (link.isTodo) {
                totalTodos++;
                console.log(`  ${file.rel}:${link.line} — TODO: ${link.todoTarget}`);
                continue;
            }

            const result = validateLink(link.url, pages, file);
            if (result.valid) continue;

            totalBroken++;
            const suggestion = suggestFix(result, link.url, pages);

            if (suggestion) {
                fixes.push({
                    original: link.full,
                    replacement: link.full.replace(link.url, suggestion),
                    line: link.line,
                });

                if (result.reason === "has extension") {
                    totalExtensionFixes++;
                } else {
                    console.log(
                        `  ${file.rel}:${link.line} — ${result.reason}: ${link.url} → ${suggestion}`
                    );
                }
                totalFixed++;
            } else {
                console.log(
                    `  ${file.rel}:${link.line} — ${result.reason}: ${link.url} (no fix found)`
                );
                unfixable.push({ file: file.rel, line: link.line, url: link.url, reason: result.reason });
            }
        }

        if (fixes.length > 0) {
            const fixed = applyFixes(content, fixes);
            if (!DRY_RUN) {
                writeFileSync(file.path, fixed, "utf-8");
            }
            filesModified++;
        }
    }

    // Summary
    console.log("\n=== Summary ===");
    console.log(`Broken links found:    ${totalBroken}`);
    console.log(`Links fixed:           ${totalFixed}`);
    if (totalExtensionFixes > 0) {
        console.log(`  (extension removals: ${totalExtensionFixes})`);
    }
    console.log(`TODO markers found:    ${totalTodos}`);
    console.log(`Files modified:        ${filesModified}`);

    if (unfixable.length > 0) {
        console.log(`\n=== Unfixable links (need manual review) ===`);
        for (const { file, line, url, reason } of unfixable) {
            console.log(`- ${file}:${line} — ${url} (${reason})`);
        }
    }

    if (totalBroken === 0 && totalTodos === 0) {
        console.log("\nAll links are valid!");
    }
}

main();
