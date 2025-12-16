---
title: Quests
description: Learn about Cartridge's Quest system that allows games to create time-based challenges with rewards and progress tracking for players.
---

# Quests

The Cartridge Quest system enables games to create time-based challenges and objectives for players with built-in progress tracking, rewards, and completion mechanics.

## Key Features

- **Time-based Quests**: Define quest intervals, durations, and deadlines
- **Task Management**: Break down quests into multiple trackable tasks  
- **Progress Tracking**: Real-time advancement monitoring for each task
- **Reward System**: Configurable rewards for quest completion
- **Conditional Quests**: Prerequisites and dependencies between quests
- **Real-time Updates**: Live quest status via Torii subscriptions

## Benefits for Game Developers

- **Player Engagement**: Keep players active with time-sensitive objectives
- **Progression Systems**: Create structured advancement paths
- **Community Events**: Coordinate time-based community challenges  
- **Retention**: Recurring quest intervals for ongoing engagement
- **Analytics**: Track player participation and completion rates

## How It Works

The quest system operates through on-chain definitions and off-chain progress tracking:

### Quest Structure

Each quest consists of:
- **Quest Definition**: Core quest parameters (timing, tasks, conditions)
- **Quest Metadata**: Display information (name, description, icon, rewards)
- **Tasks**: Individual objectives that must be completed
- **Advancement**: Player progress tracking for each task
- **Completion**: Final quest completion state and reward claiming

### Time Management

Quests support flexible timing:
- **Start/End Times**: Define when quests are available
- **Intervals**: Recurring quest availability (daily, weekly, etc.)
- **Duration**: How long each quest instance remains active
- **Countdown Timers**: Visual countdown for active quests

### Progress Tracking

Players advance through quests by:
1. **Task Progression**: Games emit events for task advancement
2. **Real-time Updates**: Controller subscribes to progress events
3. **Completion Detection**: Automatic quest completion when all tasks done
4. **Reward Claiming**: Players can claim rewards via the interface

## Integration Overview

For detailed implementation and usage, refer to the setup and integration guides.

The quest system integrates with:
- **Dojo World**: On-chain quest definitions and events
- **Torii Indexer**: Real-time quest data subscriptions
- **Controller UI**: Built-in quest display and claiming interface
- **Profile Pages**: Quest progress visible in player profiles