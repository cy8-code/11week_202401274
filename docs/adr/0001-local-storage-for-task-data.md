# Store task data in localStorage

This is a single-user app with no current need for accounts, a server, or cross-device synchronization, so we use browser `localStorage` rather than adding database infrastructure. This keeps the first version simple while the asynchronous storage module provides a boundary for replacing the implementation later; data remains limited to the current browser profile and can be lost when its site data is cleared.
