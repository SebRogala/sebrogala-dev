// Past talks, newest first. One source for the home Speaking section and the
// /talks page. `href` is optional: talks without a public event page omit it.
export interface PastTalk {
  event: string;
  href?: string;
  /** Numeric, DD.MM.YYYY or MM.YYYY (Rule 14: no month names). */
  date: string;
  title: string;
}

export const pastTalks: PastTalk[] = [
  {
    event: 'rg-dev Meetup #67',
    href: 'https://www.meetup.com/rg-dev/events/316407562',
    date: '23.09.2026',
    title: 'From Directing Agents to Autonomous Delivery: mini-deliver — One Skill, the Whole Loop',
  },
  {
    event: 'Agentic Jams (Rzeszów, first edition)',
    href: 'https://agenticjams.com/',
    date: '17.06.2026',
    title: 'How I Stopped Compacting — MCP as durable memory for an AI delivery pipeline',
  },
  {
    event: 'rg-dev Meetup #66',
    href: 'https://www.meetup.com/rg-dev/events/314750399',
    date: '27.05.2026',
    title: 'From Prompting to Directing Agents: Practical AI-Native Development',
  },
  {
    event: 'Xebia Internal Conference',
    date: '11.2023',
    title: 'GitHub Actions & Continuous Delivery on Shared Hosting',
  },
];
