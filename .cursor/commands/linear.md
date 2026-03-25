---
name: linear-ticket-from-staged-files
description: Generate a Linear ticket title and description by analyzing git staged files and diffs. Use when the user wants to create a new Linear issue based on their current staged changes.
---

# Linear Ticket from Staged Files

This skill helps generate a **Linear ticket title and description** based on the current **staged git changes** in this repository.

The goal is to:
- Infer the main intent of the change set (feature, fix, refactor, chore, etc.)
- Produce an **imperative, one-line title** suitable for a Linear issue
- Produce a **concise, single-paragraph description** summarizing what is changing and why

The user prefers:
- **Scope**: This project only (project skill)
- **Title style**: Imperative, e.g. “Fix booking search filters”
- **Description style**: A single freeform paragraph (no strict sections)
- **Metadata**: No additional Linear metadata; only plain title and description

## When to Use

Use this skill when:
- The user asks for a **Linear ticket title** and/or **description** based on current changes
- The user mentions creating a **Linear issue** or **Linear ticket** for the staged work
- The user is about to push/merge a change and wants an issue to track it

Do **not** use this skill for:
- Generating git commit messages (use a dedicated commit helper instead)
- Describing untracked or unstaged work (this skill is focused on **staged** changes)

## Workflow

Follow this workflow whenever you apply this skill.

### 1. Inspect staged changes

1. Get a high-level summary of staged files:
   - Run `git diff --cached --stat`
2. Get the detailed staged diff:
   - Run `git diff --cached`

From these outputs, identify:
- **Main area(s)** of the codebase being touched (e.g. booking flow, checkout, dashboard, auth)
- **Type of change**:
  - Feature / enhancement
  - Bug fix
  - Refactor / cleanup
  - Chore / tooling / config
- **User-facing impact**, if any:
  - New capability or behavior
  - Fixed incorrect or broken behavior
  - Performance or UX improvement
  - Internal-only change (e.g. logging, typing, CI)

### 2. Draft the Linear title

Produce a **single, imperative sentence** that captures the main intent.

Guidelines:
- Start with a **verb in imperative form**, e.g. “Add”, “Fix”, “Improve”, “Refactor”, “Update”, “Align”, “Support”
- Mention the **primary feature or area** touched
- Be specific enough to distinguish this ticket from others
- Avoid technical noise (file names, IDs) unless crucial to understanding

Patterns:
- `Add [feature] to [area]`
- `Fix [problem] in [area]`
- `Improve [aspect] of [area]`
- `Refactor [scope] for [purpose]`
- `Update [config/dependency] for [reason]`

If multiple unrelated areas are changed, focus the title on **the highest impact** change and leave the rest for the description.

### 3. Draft the Linear description

Write **one concise paragraph** (2–5 sentences) that:
- Names the **user-facing behavior** or business outcome first
- Briefly summarizes **what changed** at a high level
- Optionally mentions **why** the change is needed (bug, requirement, improvement)
- Avoids implementation detail unless essential

Checklist:
- Keep it **short and readable**; this is a ticket description, not full documentation
- Prefer plain language over code-oriented jargon
- Mention important constraints, feature flags, or dependencies if present in the diff

Example sentence structures:
- “This change [adds/improves/fixes] [behavior] in the [area] so that [user/business outcome].”
- “It updates [component/module] to [new behavior] and cleans up [related concern].”
- “It also adjusts [secondary detail] to keep behavior consistent across the app.”

### 4. Output format

Return the result in this minimal format:

```markdown
Title: <one-line Linear issue title>

Description: <single-paragraph description>
```

Do **not** include any extra sections (no checklists, metadata, or headers) unless the user explicitly asks for them.

## Examples

### Example 1 – Bug fix

**Context (staged changes)**
- `git diff --cached --stat` shows changes in `src/app/bookings/page.tsx` and `src/lib/search.ts`
- `git diff --cached` reveals:
  - Fixing an off-by-one error in date range search
  - Ensuring timezone-safe comparisons
  - Adding a basic unit test for the search function

**Output**

```markdown
Title: Fix date range filtering for bookings search

Description: This change corrects the date range filtering logic used in the bookings search so that results respect the selected start and end dates across timezones. It updates the search utility to use timezone-safe comparisons and adds a basic test to guard against regressions in date handling.
```

### Example 2 – Feature / enhancement

**Context (staged changes)**
- `git diff --cached --stat` shows new components under `src/app/dashboard/` and updates to `src/components/Sidebar.tsx`
- `git diff --cached` reveals:
  - New summary cards for upcoming trips
  - A link from the sidebar into the new dashboard section

**Output**

```markdown
Title: Add upcoming trips overview to dashboard

Description: This change introduces an upcoming trips overview section on the dashboard so users can quickly see their next reservations at a glance. It adds new summary cards to the dashboard view and wires a navigation link from the sidebar to the new section.
```

### Example 3 – Internal refactor

**Context (staged changes)**
- `git diff --cached --stat` shows changes across `src/lib/supabase/client.ts` and `src/types/database.ts`
- `git diff --cached` reveals:
  - Centralizing Supabase client creation
  - Updating generated types and tidying unused fields

**Output**

```markdown
Title: Refactor Supabase client setup for shared usage

Description: This change refactors the Supabase client setup to centralize configuration and ensure consistent usage across the app. It updates the shared client utility, refreshes the generated database types, and removes unused fields to keep the integration maintainable.
```

## Summary

When applying this skill:
1. Inspect **staged** changes with `git diff --cached --stat` and `git diff --cached`.
2. Identify the **primary area** and **intent** of the change.
3. Write a **single, imperative title** focused on that intent.
4. Write a **concise, single-paragraph description** that explains what changed and why, in plain language.
5. Output exactly in the `Title:` / `Description:` format unless the user asks for something different.

