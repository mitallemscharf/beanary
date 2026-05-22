# CLAUDE.md — AI Development Workflow for Beanery

This file documents how Claude Code (Anthropic) was used to design, build, and iterate on the Beanery project. It is intended for graders and collaborators who want to understand the AI-assisted development process.

---

## Tools Used

| Tool | Purpose |
|------|---------|
| **Claude Code** (claude.ai/code) | Primary AI coding assistant — architecture, implementation, debugging |
| **Claude Sonnet 4.6** | Model used for all code generation in this project |
| **GitHub Copilot** | Not used — Claude Code was the sole AI tool |

---

## Workflow

The development followed an iterative, conversation-driven workflow:

1. **Design Brief** — A detailed design system specification (colors, typography, components, 5 pages) was provided as a single prompt.
2. **Scaffold** — Claude Code generated the full SvelteKit project from scratch, including Tailwind config, stores, and all 5 pages.
3. **Debug Loop** — Each error (build errors, runtime errors, Svelte 5 rune violations) was fed back to Claude, which diagnosed and fixed it.
4. **Feature Additions** — Bonus features (PWA, shot comparison, QR codes, PDF export, dark mode) were requested one at a time, each in a focused prompt.
5. **Commit After Each Feature** — Every feature was committed separately to maintain a clean git history.

---

## Prompt Strategy

### What worked well

- **Highly specific prompts**: Including exact color hex values, font names, CSS class names, and component requirements produced near-perfect first-pass output.
- **Constraint-first**: Stating technical constraints up front (SvelteKit 2 + Svelte 5 runes, Tailwind v4, TypeScript) prevented Claude from defaulting to older patterns.
- **One feature at a time**: Asking for one feature per conversation turn reduced errors and made reviewing diffs easier.
- **Error context**: Pasting the full terminal error (not just a summary) allowed Claude to diagnose root causes correctly on the first try.

### What to avoid

- Asking for multiple unrelated changes in a single prompt — leads to merge conflicts and hard-to-review diffs.
- Vague requests like "make it look better" — Claude needs explicit, measurable requirements.

---

## Example Prompts

### Initial scaffold prompt (condensed)
```
Build a complete SvelteKit app called "Beanery". Design system:
- Primary font: Libre Caslon Text, body: Hanken Grotesk, mono: JetBrains Mono
- Colors: background #FBF9F4, primary #000, accent crema-gold #C5A059
- 5 pages: Home, Shot Logger, History, Dashboard, Bean Library
- Tailwind v4, Svelte 5 runes, TypeScript, localStorage-backed stores
[... full spec ...]
```

### Feature addition prompt
```
FEATURE 2 — SHOT COMPARISON:
Add a Compare button in Shot History. Users can select 2 shots, then see a modal
showing both side-by-side with differing fields highlighted in crema-gold.
Show a winner banner for the higher-rated shot. Commit: "feat: shot comparison mode"
```

### Bug fix prompt
```
The history page throws: "{@const} must be an immediate child of {#if}, {#each}, ..."
The {@const rows = [...]} is inside a <div>. Move the computation to a function
in the script block called compareRows(a, b) and call it from the template.
```

---

## Architecture Decisions Influenced by AI

| Decision | Rationale |
|----------|-----------|
| Svelte 5 runes (`$state`, `$derived`, `$effect`) | Claude recommended runes over legacy reactive stores for new Svelte 5 projects |
| `{@const}` only inside blocks | Claude caught and fixed illegal `{@const}` placement in component templates |
| Dynamic `import('jspdf')` | Claude suggested lazy-loading jsPDF to avoid SSR issues |
| `sharp` for icon generation | Claude chose `sharp` over Canvas API (unavailable in Node) for PNG icon generation |
| HttpOnly JWT cookies | Claude flagged localStorage JWT storage as a security risk and recommended HttpOnly cookies |
| MongoDB SRV connection string | Claude diagnosed that port 27017 was blocked by work WiFi and advised using a hotspot |

---

## Lessons Learned

1. **AI excels at boilerplate** — Generating repetitive structure (Tailwind class strings, form fields, table rows) was where Claude added the most value.
2. **Domain knowledge still required** — Claude needed the Beanery-specific design tokens; it does not invent them.
3. **Review every diff** — Claude occasionally over-engineered solutions. Reviewing each change prevented unnecessary complexity.
4. **Commit granularity matters** — Small, focused commits (one per feature) made it easy to revert if a Claude-generated change introduced a bug.
5. **Context window management** — For a large project, starting a new conversation per feature (rather than one long session) kept responses fast and accurate.

---

## GitHub Issues

All 10 GitHub issues on this repository were created via the Claude Code `gh` CLI integration as part of Feature 5. Issues cover implemented features (#1–4, #7–10) and known bugs (#5–6).

Repository: https://github.com/mitallemscharf/beanary/issues
