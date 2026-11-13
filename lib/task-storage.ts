export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export type TaskStorageErrorKind = "unavailable" | "corrupt" | "write";

export class TaskStorageError extends Error {
  constructor(
    message: string,
    public readonly kind: TaskStorageErrorKind,
  ) {
    super(message);
    this.name = "TaskStorageError";
  }
}

const STORAGE_KEY = "my-todo:tasks:v1";
const MAX_TITLE_LENGTH = 200;

function isTask(value: unknown): value is Task {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const task = value as Record<string, unknown>;
  return (
    typeof task.id === "string" &&
    task.id.length > 0 &&
    typeof task.title === "string" &&
    task.title.length > 0 &&
    task.title === task.title.trim() &&
    task.title.length <= MAX_TITLE_LENGTH &&
    typeof task.completed === "boolean"
  );
}

function isTaskList(value: unknown): value is Task[] {
  if (!Array.isArray(value) || !value.every(isTask)) {
    return false;
  }

  const ids = new Set(value.map((task) => task.id));
  return ids.size === value.length;
}

function getLocalStorage(): Storage {
  if (typeof window === "undefined") {
    throw new TaskStorageError(
      "브라우저 저장 공간을 사용할 수 없습니다.",
      "unavailable",
    );
  }

  try {
    return window.localStorage;
  } catch {
    throw new TaskStorageError(
      "브라우저 저장 공간에 접근할 수 없습니다. 브라우저 설정을 확인해 주세요.",
      "unavailable",
    );
  }
}

function parseTasks(value: string): Task[] {
  let parsed: unknown;

  try {
    parsed = JSON.parse(value);
  } catch {
    throw new TaskStorageError(
      "저장된 할 일 데이터가 손상되어 불러올 수 없습니다. 기존 데이터는 덮어쓰지 않았습니다.",
      "corrupt",
    );
  }

  if (!isTaskList(parsed)) {
    throw new TaskStorageError(
      "저장된 할 일 데이터 형식이 올바르지 않습니다. 기존 데이터는 덮어쓰지 않았습니다.",
      "corrupt",
    );
  }

  return parsed;
}

function readTasks(): Task[] {
  const storage = getLocalStorage();
  let storedValue: string | null;

  try {
    storedValue = storage.getItem(STORAGE_KEY);
  } catch {
    throw new TaskStorageError(
      "브라우저 저장 공간에서 할 일을 읽지 못했습니다.",
      "unavailable",
    );
  }

  return storedValue === null ? [] : parseTasks(storedValue);
}

export async function loadTasks(): Promise<Task[]> {
  return readTasks();
}

export async function saveTasks(tasks: Task[]): Promise<void> {
  if (!isTaskList(tasks)) {
    throw new TaskStorageError(
      "할 일 목록을 저장할 수 없습니다. 항목을 확인해 주세요.",
      "write",
    );
  }

  readTasks();
  const storage = getLocalStorage();

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    throw new TaskStorageError(
      "할 일을 저장하지 못했습니다. 브라우저 저장 공간을 확인한 뒤 다시 시도해 주세요.",
      "write",
    );
  }
}

export function subscribeToTaskChanges(
  onTasksChanged: (tasks: Task[]) => void,
  onError: (error: TaskStorageError) => void,
): () => void {
  if (typeof window === "undefined") {
    throw new TaskStorageError(
      "브라우저 저장 공간을 사용할 수 없습니다.",
      "unavailable",
    );
  }

  function handleStorageChange(event: StorageEvent) {
    if (event.key !== STORAGE_KEY && event.key !== null) {
      return;
    }

    if (event.newValue === null) {
      onTasksChanged([]);
      return;
    }

    try {
      onTasksChanged(parseTasks(event.newValue));
    } catch (error: unknown) {
      if (error instanceof TaskStorageError) {
        onError(error);
        return;
      }

      onError(
        new TaskStorageError(
          "다른 탭에서 저장된 할 일 데이터를 읽지 못했습니다.",
          "corrupt",
        ),
      );
    }
  }

  window.addEventListener("storage", handleStorageChange);
  return () => window.removeEventListener("storage", handleStorageChange);
}
