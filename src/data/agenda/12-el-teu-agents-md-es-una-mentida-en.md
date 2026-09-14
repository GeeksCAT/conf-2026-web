---
type: session
slug: el-teu-agents-md-es-una-mentida
title: "Your AGENTS.md is a lie (and here is how to fix it)"
speakerSlug: dario-castane
time: "16:25"
end: "17:05"
day: 1
draft: false
lang: ca
locale: en
---

You wrote the AGENTS.md. You documented error handling conventions, package structure, interface patterns. And then the agent ignored you.

Instruction files are inferential steering: the agent interprets them probabilistically, trades them off against everything else in the context window, and makes a judgment call. That judgment call is wrong often enough to matter, and degrades further as tasks get complex. A better AGENTS.md only moves the ceiling.

The fix is understanding harness. Agent = Model + Harness: the harness combines steering (what directs before the agent acts) and sensors (what observes and corrects after), both across a spectrum from inferential to computational.

We'll explore best practices: wiring agent hooks to enforce linting on every file write, writing custom AST analyzers that turn conventions into build errors, structuring table-driven tests as specs the agent must satisfy, and more.

Your AGENTS.md is a lie. Your harness isn't.
