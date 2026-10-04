---
title: "I haven't hit /compact in months"
published: 2026-10-04
cover:
  src: /memos/handoff-instead-of-compact/cover.webp
  width: 1672
  height: 941
  alt: "Illustration: a session ring near full hands a document to a fresh session, which fans out to three smaller agents."
---

In 02.2026 I wrote on a Claude Code GitHub issue (https://github.com/anthropics/claude-code/issues/6354#issuecomment-3849990217) that a SessionStart hook works after /clear, but after /compact the summary wins and the agent ignores the reminder the hook injects. Today I honestly couldn't tell you if that still happens, because I haven't hit a compact in months. This is how that happened.

When Opus still had 200k context, planning a single task didn't fit in one session. So I made checkpoints: save the current state of the work, start a new session, finish the planning there, and keep the old one open in case I needed to reach back for earlier data. That was the era of my /pipe skill.

In 03.2026 I had Opus 4.6 with 1M context, and that approach wasn't needed anymore. I wrote a new skill, /deliver, which ran the whole task as one workflow. The problem was that a lot of context was still taken by planning itself, by discussing the whole task. So I kept splitting it. Business context went to the tracker or a file, research from other agents went to MCP, and once the task was fully documented I started a new session that delivered it in one run, still with specialist sub-agents.

The other problem with context is that from what I see, at around 450-500k a session starts losing information and isn't as precise as before. And there is cost. Every request writes and reads the cache, so the more context a session holds, the more each turn costs. My main session used to be the orchestrator, often running autonomously, and after an overnight run it could collect almost 900k. That isn't healthy, and I knew every task should run as a completely separate session, I just didn't know yet how to do it.

That's what the current setup solves. It works on four levels. I talk to a coordinator, it passes my decisions down to a supervisor, and the supervisor starts one orchestrator per task, as many as the work needs. Orchestrators run the implementers, and the plan is chunked so an implementer finishes its part within about 500k. Some tasks are small enough that the supervisor and the orchestrator are one session, and then it's three levels instead of four.

The management sessions are the ones that live long, so they are the ones that hand over. With herdr (https://herdr.dev/) a session can read its own terminal, including the context counter in the status line, so it knows how much it has used. The skill gives each level a threshold, 400k, and 500k for the coordinator. Past it, the session writes a handoff with how the session went, what's left, open questions for me and any blockers, and a new session takes over. Right now that's Opus 5.5 with effort on high. I also have a spec and a draft for doing the same with a hook, which I plan to test, but it needs more setup and testing, and herdr gave me this out of the box, so it was faster to get and fits me better for now.

Questions go up the same way decisions come down, and that's what lets a run go on for hours without me. An orchestrator that gets stuck asks the supervisor. If the supervisor knows the answer, it logs it and passes it back. If not, it goes to the coordinator, which also has notes on how I make decisions, so it can handle more sensitive ones. If the coordinator isn't sure either, it parks the question and shows it in the chat, and whenever I'm at the computer I go through them one by one to unblock the work.

The supervisor and the coordinator also check every 55 minutes whether another session needs unblocking or something is off plan. Why 55? The prompt cache lives for one hour, so a check at 55 minutes costs mostly a cache read. A coordinator that only supervised for about 12 hours, with no serious decisions coming its way, ended at around $5-6, and in that time it unblocked a few orchestrators that were stuck on a decision.

So a run like this is limited by how much work was planned ahead of the start and by cost or session limits, not by context, and compact never comes. It ran for about four days at the end of 09.2026 and has been running again since 03.10.2026, but it's not in its final form yet. Right now /deliver and the levels run on prose instructions. I'm building a “graph walker” that turns /deliver into small, defined steps it executes one by one, and then every session's state can live in MCP. Talking to a parent session becomes a CLI call that knows each session's address and delivers to the right door, and I get a better overview of the whole run. That part is still in build. And whether the hook still loses to the summary after /compact, I still can't say.
