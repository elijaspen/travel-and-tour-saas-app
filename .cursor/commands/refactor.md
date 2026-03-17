## Refactor Command – DRY & Typed Values

Use this command when you want to systematically refactor the **currently unstaged files** to:
- **Enforce DRY (Don't Repeat Yourself)**: remove duplicated logic, configuration, and structures.
- **Replace arbitrary text values** with **types/enums/constants** so we avoid "magic strings" in the codebase.

### How this command should behave

When invoked on unstaged files, the agent should:

- **1. Enforce DRY**
  - Scan staged files for **repeated logic or structures** (functions, hooks, components, utility code, validation, query building, mapping/transforms, config constants).
  - When the same (or very similar) logic appears **3+ times**, extract it into:
    - a shared helper in an appropriate `utils`/service module, or
    - a reusable React component or custom hook.
  - When complex logic appears **2 times** and is hard to reason about or test, consider extracting it as well if it improves clarity.
  - Prefer **small, focused abstractions** over large "god" helpers; keep naming based on **what the abstraction does**, not where it is used.

- **2. Remove magic strings and magic numbers (enforce constant usage)**
  - Identify **any string or number literals** that carry semantic meaning (e.g. statuses, roles, types, feature flags, route names, table/column names, error codes, query keys), especially when they appear more than once.
  - **Strongly prefer typed constants over raw literals**:
    - use **TypeScript `enum`**, `as const` objects with derived union types, or
    - well-named **string/number literal types** backed by shared constants.
  - Ensure all usages are updated to reference the new enum/type/constant instead of raw strings/numbers, **even for single-use values when a domain constant/enum already exists**.
  - Where a constant/enum/type for a given concept already exists, **always use it** rather than introducing a new raw string/number.
  - Keep enums and shared types in **centralized, domain-appropriate modules** (e.g. `types/`, `models/`, `constants/`) rather than scattering them across features.

- **3. Preserve behavior and typing**
  - Run TypeScript checks and ensure **no type safety is lost** as a result of refactors.
  - Keep public APIs stable unless the caller code is also staged and updated in the same refactor.
  - Add or update minimal tests when refactors touch non-trivial business logic.

### When NOT to over-abstract

- Do **not** extract helpers for:
  - trivial one-liners where reuse would hurt readability, or
  - one-off logic that is unlikely to be reused and is clearer inline.
- Prefer clarity over cleverness: if a proposed abstraction makes the code harder to understand than the duplication, keep the simpler version.

