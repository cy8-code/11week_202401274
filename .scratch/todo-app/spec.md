Status: ready-for-agent

# 개인용 할 일 관리 웹앱

## 목적

개인 할 일을 간단히 기록하고 완료 상태와 남은 할 일 개수를 관리한다. 첫 버전은 서버나 계정 없이 제공하되, 추후 저장소를 교체할 수 있도록 한다.

## 사용자

- 할 일 목록을 혼자 관리하는 사용자 1명
- 한국어 웹 화면을 데스크톱이나 모바일 브라우저에서 이용하는 사용자

## 할 수 있는 것

- 제목이 있는 할 일을 추가한다. 앞뒤 공백은 제거하며 제목은 1~200자다. 같은 제목의 항목도 각각 추가할 수 있다.
- 새 할 일은 목록 맨 위에 표시한다.
- 할 일을 완료 또는 미완료로 바꾸며, 상태를 바꾸어도 목록 순서는 유지한다.
- 완료된 항목을 포함해 전체 목록을 보고, 원하는 항목을 즉시 삭제한다.
- 미완료 항목 개수를 확인하고, 현재 브라우저 프로필에 저장된 할 일을 다시 불러온다.
- 같은 브라우저에서 여러 탭을 열었을 때 다른 탭의 저장 변경을 자동 반영한다.

## 하지 않는 것

- 계정, 로그인, 서버 데이터베이스, 다른 브라우저나 기기 간 동기화 및 백업
- 동시 편집 충돌 병합
- 제목 수정, 검색, 필터, 정렬 설정, 분류, 기한, 우선순위
- 삭제 확인 및 삭제 되돌리기
- 샘플 할 일, 다크 테마, 사용자 지정 테마

## 완료 기준

아래 기준 **10개 모두 통과(10/10)** 하면 완료로 판정한다.

1. 빈 제목과 공백만 입력한 제목은 **0개** 저장되고, 앞뒤 공백이 있는 제목은 저장 시 제거된다.
2. 길이 **1자**와 **200자** 제목은 각각 추가되고, **201자** 입력은 허용되지 않는다.
3. 같은 제목으로 **2개** 추가하면 목록에 서로 구분되는 항목 **2개**가 표시된다.
4. 추가 직후 입력 칸은 비어 있고, 새 항목은 기존 목록보다 위에 표시된다.
5. 한 항목의 완료 상태를 켜면 남은 개수가 **1 감소**하고, 다시 끄면 **1 증가**하며 항목 순서는 유지된다.
6. 완료/미완료 항목을 각각 삭제하면 해당 항목이 즉시 사라지고 남은 개수도 정확히 갱신된다.
7. 모든 항목을 삭제한 후 예시 항목은 **0개**이며 한국어 빈 목록 안내가 표시된다.
8. 새로고침 후 저장에 성공한 항목의 제목과 완료 상태가 이전과 동일하게 복원된다.
9. 동일 브라우저의 탭 **2개**에서 한 탭의 변경을 저장하면 다른 탭에도 자동 반영된다.
10. 저장 공간 접근/쓰기 오류 및 손상된 데이터 상황을 각각 재현했을 때 명시적 오류 안내가 표시되고, 실패한 추가 입력은 유지되며, 손상된 데이터는 **0회** 조용히 덮어써진다.

## Problem Statement

혼자 사용할 간단한 할 일 관리 앱이 필요하다. 사용자는 할 일을 빠르게 적고, 완료 여부를 표시하고, 삭제하고, 아직 끝내지 않은 할 일의 개수를 확인하고 싶다. 데이터베이스나 계정 시스템을 준비하지 않고 시작하되, 나중에 저장 방식을 바꿀 때 화면 전체를 다시 만들지 않기를 원한다.

## Solution

한국어로 된 반응형 웹 화면에서 사용자가 할 일을 추가하고, 완료 상태를 바꾸고, 삭제할 수 있게 한다. 전체 할 일은 항상 표시하며, 남은 할 일 개수는 미완료 상태인 항목의 수로 보여준다. 데이터를 현재 브라우저 프로필의 localStorage에 저장하고, 저장 구현은 비동기 인터페이스를 가진 별도 모듈로 분리해 향후 데이터베이스로 교체할 수 있게 한다.

## User Stories

1. As a single-user app user, I want to see a clear Korean heading and a concise explanation, so that I immediately understand the app's purpose.
2. As a user, I want to enter a title for a 할 일, so that I can record something I need to do.
3. As a user, I want to add a 할 일 with the add button, so that I can save it without needing a keyboard shortcut.
4. As a keyboard user, I want to submit a 할 일 by pressing Enter, so that I can add it without leaving the keyboard.
5. As a user, I want the input to clear only after a successful save, so that I do not lose text when storage fails.
6. As a user, I want leading and trailing whitespace removed from a title, so that saved titles are tidy.
7. As a user, I want an empty or whitespace-only title rejected, so that the list does not contain meaningless entries.
8. As a user, I want a title limited to 200 characters, so that a single entry remains readable and manageable.
9. As a user, I want to add two 할 일 with the same title as separate entries, so that repeated activities can be tracked independently.
10. As a user, I want newly added 할 일 to appear at the top, so that I can find the item I just entered.
11. As a user, I want to see every 할 일 together without a filter, so that I can review completed and unfinished items in one place.
12. As a user, I want to mark a 할 일 complete, so that I can record that I have finished it.
13. As a user, I want to unmark a completed 할 일, so that I can correct an accidental check or resume work.
14. As a user, I want a completed 할 일 to remain in the list, so that I can see what I have finished until I choose to delete it.
15. As a user, I want changing completion status not to reorder the list, so that checking an item does not move it unexpectedly.
16. As a user, I want completed titles to look visually distinct, so that I can tell completed work from remaining work.
17. As a user, I want to delete a 할 일 immediately without a confirmation dialog, so that removing an item is quick.
18. As a user, I want the remaining count to equal the number of incomplete 할 일, so that I can understand how much work is left.
19. As a user, I want the remaining count to update after adding, completing, uncompleting, or deleting a 할 일, so that it reflects the current list.
20. As a first-time user, I want a helpful empty-state message and no seeded examples, so that I know how to start without mistaking sample data for my own.
21. As a user, I want my 할 일 to persist after a reload in the same browser profile, so that my list is available when I return.
22. As a user, I want the app to explain that data is stored only in this browser, so that I understand the limits of local storage.
23. As a user, I want the app to make clear that data is not synchronized or backed up across browsers or devices, so that I do not assume my list is available elsewhere.
24. As a user, I want an explicit error when browser storage cannot be read or written, so that a failed operation is not presented as successful.
25. As a user, I want entered text to remain available when saving fails, so that I can retry rather than retype it.
26. As a user, I want malformed stored data reported without silently replacing it with an empty list, so that a storage problem does not destroy my existing data.
27. As a user, I want a way to retry loading after a storage error, so that I can recover after a temporary browser storage issue is resolved.
28. As a user with the app open in multiple tabs, I want changes made in another tab to appear automatically, so that the tabs reflect the same stored list.
29. As a user editing from multiple tabs at nearly the same time, I want the most recently saved list to be used, so that the app follows a simple last-write-wins rule rather than claiming to merge concurrent edits.
30. As a mobile user, I want the layout and controls to fit a narrow screen, so that I can manage 할 일 comfortably on a phone.
31. As a keyboard or assistive-technology user, I want inputs and controls to have clear labels and visible focus, so that I can operate the app without relying on visual position alone.
32. As a user, I want a light-only interface for the first version, so that the visual design stays focused and predictable.

## Implementation Decisions

- The application is a single-context, single-user Next.js and TypeScript web app.
- The user-facing terminology is `할 일`, `완료`, and `남은 할 일`, as defined in the project glossary.
- A 할 일 consists of an identifier, a trimmed title, and a completion state. Identical titles are allowed; identifiers distinguish entries.
- Titles are required and limited to 200 characters.
- New items are prepended. Toggling completion preserves the current order.
- The list has no filter in this version. Completed items remain visible until explicitly deleted.
- Deletion is immediate and has no confirmation or undo.
- The remaining count is the count of items whose completion state is false.
- The first-use state contains no sample entries and presents Korean guidance.
- The UI is Korean, responsive, and light-theme only.
- localStorage is the initial persistence mechanism. Data is scoped to the current browser profile and may be lost if the browser's site data is cleared; there is no account, remote backup, or cross-device synchronization.
- Storage reads and writes are exposed through a separate asynchronous module. The UI depends on that boundary rather than directly accessing localStorage, leaving room to replace the persistence implementation later.
- Invalid or corrupt stored data is surfaced as an explicit error; it is not silently discarded or overwritten. A failed save does not clear the user's input.
- Storage changes from another tab are reflected automatically. Concurrent changes are not merged; the most recently saved value wins.
- The rationale for using localStorage and its trade-offs is recorded in ADR 0001.

## Testing Decisions

- Tests should exercise observable behavior through the highest practical seam: the rendered app in a real browser, rather than asserting internal component state or storage helper implementation details.
- The primary integration flow should add an item by Enter and by button, verify input clearing only after a successful save, complete and uncomplete items, delete items, and verify the list and remaining count after each action.
- The browser flow should reload the page and verify that the stored list and completion state persist.
- Test title boundaries: whitespace is trimmed, empty input is rejected, 200 characters are accepted, overlong input is prevented, and duplicate titles remain separate items.
- Verify the empty state has explanatory Korean text and no seeded items.
- Verify storage read/write failures are presented as errors and do not produce success-shaped UI; verify corrupt data is not silently overwritten.
- Open two tabs in the same browser context and verify changes in one tab appear in the other. Verify the documented last-write-wins behavior for competing updates.
- Verify responsive layout and keyboard accessibility for the form, completion checkbox, and delete control.
- The current codebase has no existing automated test suite or testing-tool precedent. Use a browser integration test as the primary seam; add the smallest suitable test setup if automation is introduced.

## Out of Scope

- User accounts, authentication, server-side storage, and remote database integration.
- Synchronization or backup across devices or browser profiles.
- Conflict-free merging of simultaneous edits across tabs.
- Editing an existing title, sorting controls, categories, due dates, priorities, search, or list filters.
- Delete confirmation, undo, bulk deletion, and completed-item cleanup.
- Dark theme or user-selectable themes.
- Prepopulated sample data.

## Further Notes

- The feature has already been implemented in the current codebase; this spec records the agreed behavior and provides an acceptance and testing reference.
- Storage behavior and its rationale are documented in ADR 0001.
