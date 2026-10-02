// Talk and workshop topics for /talks. Add a topic by adding one entry.
// Keep each description to one or two short sentences, and claims to what the
// CV supports.
export interface TalkTopic {
  title: string;
  description: string;
}

export const talkTopics: TalkTopic[] = [
  {
    title: 'From anti-AI to an autonomous workflow',
    description:
      "A year ago I was anti-AI, sure that no machine would tell me how to write code I had to think through myself. Now an autonomous workflow delivers what's needed.",
  },
  {
    title: 'Think first, then delegate',
    description:
      'The nuances of coding with AI agents. The best results come when a person thinks first, then delegates and talks the work through with AI.',
  },
  {
    title: 'AI failure modes and dedicated auditors',
    description:
      'Where AI agents commonly go wrong, and how dedicated auditors came out of it. The fidelity auditor was added after an AI silently cut a 491-line spec to 122 lines.',
  },
  {
    title: "Gates agents can't talk their way past",
    description:
      'Deterministic gates, like custom static-analysis and dependency rules or shrink-only baselines, and how an agent games a gate that measures only one thing. Behind such gates, a 15-day refactor went through 51 pull requests with no post-merge reverts.',
  },
  {
    title: 'A/B testing models on real work',
    description:
      "Blind A/B tests on real work items, with hidden tests and blind cross-vendor judges. It's how I pick which model implements and which one reviews.",
  },
  {
    title: 'Getting started with Claude Design',
    description:
      'How I use Claude Design and how to start with it. Its screens reach coding agents through my open-source Claude Design Playbook.',
  },
  {
    title: 'Contracts for repeatable work',
    description:
      'Anything repeatable in my workflow becomes a contract, for example for tests or for writing a plan.',
  },
  {
    title: "Tests an AI can't fake",
    description:
      'Every test has to fail against deliberately broken code first. A meaningless test is worse than none.',
  },
  {
    title: 'MCP for AI work, and MCP vs CLI',
    description:
      'Using MCP to support the work AI agents do, and how it compares with a CLI. My orchestration runs on a PostgreSQL MCP server.',
  },
  {
    title: 'How I stopped compacting',
    description:
      "State lives outside the session: MCP stores what other agents discovered, and tracker tasks are the shared source of truth. Every session starts from there, so compaction isn't needed (Agentic Jams, 17.06.2026).",
  },
  {
    title: 'Specialist agents',
    description:
      'Agents built for one job each, like implementers, reviewers and auditors, and how they fit together.',
  },
  {
    title: 'Setting up autonomous orchestration',
    description:
      'Creating and setting up a workflow that orchestrates itself. In mine, agents supervise agents and escalate by my rules.',
  },
  {
    title: 'Parallel agents on worktrees',
    description:
      "Running several agents at once on separate worktrees without them corrupting each other's state.",
  },
  {
    title: 'Temporary workflows for one-off jobs',
    description:
      'Setting up a short-lived workflow for a single need. I did it to migrate Twig macros to components.',
  },
];
