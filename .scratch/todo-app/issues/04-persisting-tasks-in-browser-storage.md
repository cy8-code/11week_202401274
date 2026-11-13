# 04: Persisting tasks in browser storage

**What to build:** A user can return to the same browser profile and find previously saved tasks and completion states restored, while receiving honest feedback when storage fails.

**Blocked by:** 01: Adding and listing tasks; 02: Tracking completion and remaining count; 03: Deleting tasks.

**Status:** ready-for-agent

- [ ] (Spec completion criterion 8) Successful task additions, completion changes, and deletions persist in the current browser profile; reloading restores titles, completion states, order, and remaining count.
- [ ] The interface communicates that data is stored only in this browser and is not backed up or synchronized across devices.
- [ ] Storage reads and writes use the single asynchronous storage module established by ticket 01, keeping localStorage access out of the UI.
- [ ] Storage read/write failures are clearly reported and are not presented as successful operations.
- [ ] A failed save keeps the user's unsaved input available for retry.
- [ ] Malformed stored data is reported and is not silently discarded or overwritten.
- [ ] A user can retry loading after resolving a storage access problem.
- [ ] (Spec completion criterion 10) Storage access/write failures and corrupt data are reported; failed input remains available; corrupt data is never silently overwritten.
