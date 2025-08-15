# Cerify Toolpage

---

## ⚠️ Branch Workflow & Protection Policy

🚫 **DO NOT push directly to `dev` or `prod`**  
These branches are protected and managed by the maintainers.  
Direct commits to them are strictly prohibited.

---

### 🔒 Rules

- **Never** commit or push directly to `dev` or `prod`.
- All work must be done in a **feature branch** created from `dev`.
  - **Branch name format:**
    ```
    name-dev
    ```
    _Examples:_ `alex-dev`, `sam-dev`, `ravi-dev`
- Merge Requests (MRs) / Pull Requests (PRs) must **target `dev`** — never `prod`.
- `prod` merges happen **only** from `dev` and **only** by maintainers.
- Every MR/PR must be **approved** before merge.

---

### ✅ Process

1. Create a branch from `dev` using the `name-dev` format.
2. Complete your changes.
3. Open an MR/PR targeting **`dev`** (never `prod`).
4. Tag the required reviewers for approval (see list below).
5. Merge only after all approvals and checks pass.
6. Maintainers will promote tested changes from `dev` to `prod`.

---

### 👥 Approvals

- All MRs/PRs **must** be approved before merging.
- **Required reviewers:** @BitByNIK, @Phaneesh-Katti or @subodhvsharma.

`prod` merges happen only by maintainers.

---

### ❌ Common Violations

- Opening an MR/PR with `prod` as the target branch.
- Pushing commits directly to `dev` or `prod`.
- Using any branch name not following the `name-dev` format.
- Merging without the required number of approvals.

---

### ⚠️ Consequences

Bypassing this workflow can:

- Introduce breaking changes to production.
- Cause deployment failures.
- Delay releases due to unplanned rollbacks.

Always follow the process to keep `dev` and `prod` stable.
