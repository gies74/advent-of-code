# Mining Puzzle Answer

## Question
What day of what year had a puzzle about mining various minerals?

## Answer
**2022 Day 19**

## Evidence
The puzzle in `src/2022/day19/code.ts` is about mining various minerals using robots. The puzzle involves:

### Minerals/Resources
- **ore** - basic mineral resource
- **clay** - another mineral resource  
- **obsidian** - advanced mineral requiring other minerals to access
- **geode** - most valuable mineral/crystal (the goal)

### Puzzle Mechanics
- Build different types of robots to mine different minerals
- Each robot type costs specific minerals to construct
- Optimize blueprint execution to maximize geode production
- Time-limited resource management and planning

### Code Evidence
```typescript
const RESOURCES = ["geode", "obsidian", "clay", "ore"];
```

The puzzle includes blueprints like:
```
Blueprint 30: Each ore robot costs 4 ore. Each clay robot costs 3 ore. 
Each obsidian robot costs 2 ore and 17 clay. Each geode robot costs 3 ore and 16 obsidian.
```

This is the only puzzle in the entire repository that involves mining multiple types of minerals.