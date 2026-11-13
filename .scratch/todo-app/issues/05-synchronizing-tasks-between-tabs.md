# 05: Synchronizing tasks between tabs

**What to build:** When the user has the app open in multiple tabs in the same browser, a saved task change in one tab appears in the other tab.

**Blocked by:** 04: Persisting tasks in browser storage.

**Status:** done

- [x] (Spec completion criterion 9) A task added, completed, uncompleted, or deleted in one of two tabs in the same browser is reflected automatically in the other tab.
- [x] The task list and remaining count stay consistent with the latest saved value.
- [x] Concurrent edits are not merged; the most recently saved list wins.
