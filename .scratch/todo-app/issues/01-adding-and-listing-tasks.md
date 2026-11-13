# 01: Adding and listing tasks

**What to build:** A user can add titled tasks and see them in a useful list, including a helpful first-use state when there are no tasks.

**Blocked by:** None (can start immediately).

**Status:** done

- [x] (Spec completion criteria 1–4) Submitting by the add button or Enter adds a task and clears the input only after success; new tasks appear at the top.
- [x] (Spec completion criteria 1–3) Leading and trailing whitespace is removed; empty titles are rejected; 1- and 200-character titles are accepted, 201-character titles are rejected; duplicate titles are allowed as distinct tasks.
- [x] (Spec completion criterion 7) An empty list shows Korean guidance and contains no sample tasks.
- [x] Task storage is accessed through one separate asynchronous storage module; the UI does not access localStorage directly.
