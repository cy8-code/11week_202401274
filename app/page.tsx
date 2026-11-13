"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  loadTasks,
  saveTasks,
  subscribeToTaskChanges,
  Task,
  TaskStorageError,
} from "../lib/task-storage";

const MAX_TITLE_LENGTH = 200;

function getErrorMessage(error: unknown) {
  if (error instanceof TaskStorageError) {
    return error.message;
  }

  return "예기치 않은 오류가 발생했습니다. 다시 시도해 주세요.";
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [storageBlocked, setStorageBlocked] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const unsubscribe = subscribeToTaskChanges(
      (nextTasks) => {
        if (!active) {
          return;
        }

        setTasks(nextTasks);
        setIsReady(true);
        setIsLoading(false);
        setStorageBlocked(false);
        setLoadError(null);
        setSaveError(null);
      },
      (error) => {
        if (!active) {
          return;
        }

        setIsReady(true);
        setIsLoading(false);
        setStorageBlocked(true);
        setLoadError(error.message);
      },
    );

    void loadTasks()
      .then((loadedTasks) => {
        if (active) {
          setTasks(loadedTasks);
          setIsReady(true);
          setIsLoading(false);
          setStorageBlocked(false);
          setLoadError(null);
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setIsReady(true);
          setIsLoading(false);
          setStorageBlocked(true);
          setLoadError(getErrorMessage(error));
        }
      });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const remainingCount = tasks.filter((task) => !task.completed).length;
  const canEdit = isReady && !isLoading && !isSaving && !storageBlocked;

  async function persistTasks(nextTasks: Task[]) {
    setIsSaving(true);
    setSaveError(null);

    try {
      await saveTasks(nextTasks);
      setTasks(nextTasks);
      return true;
    } catch (error: unknown) {
      setSaveError(getErrorMessage(error));
      if (error instanceof TaskStorageError && error.kind === "corrupt") {
        setStorageBlocked(true);
        setLoadError(error.message);
      }
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanedTitle = title.trim();

    if (
      !canEdit ||
      cleanedTitle.length === 0 ||
      cleanedTitle.length > MAX_TITLE_LENGTH
    ) {
      return;
    }

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: cleanedTitle,
      completed: false,
    };

    if (await persistTasks([newTask, ...tasks])) {
      setTitle("");
    }
  }

  async function toggleTask(taskId: string) {
    if (!canEdit) {
      return;
    }

    const nextTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task,
    );
    await persistTasks(nextTasks);
  }

  async function deleteTask(taskId: string) {
    if (!canEdit) {
      return;
    }

    const nextTasks = tasks.filter((task) => task.id !== taskId);
    await persistTasks(nextTasks);
  }

  async function retryLoading() {
    setIsLoading(true);
    setLoadError(null);

    try {
      const loadedTasks = await loadTasks();
      setTasks(loadedTasks);
      setStorageBlocked(false);
      setIsReady(true);
    } catch (error: unknown) {
      setStorageBlocked(true);
      setLoadError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="page-shell">
      <div className="todo-app">
        <header className="page-header">
          <p className="page-kicker">MY TODO</p>
          <h1>오늘의 할 일</h1>
          <p className="page-description">
            해야 할 일을 적고 하나씩 완료해 보세요.
          </p>
        </header>

        <section className="todo-panel" aria-labelledby="list-heading">
          <div className="list-heading-row">
            <div>
              <h2 id="list-heading">할 일 목록</h2>
              <p className="list-caption">
                {tasks.length === 0
                  ? "나만의 작은 계획을 시작해 보세요."
                  : `모두 ${tasks.length}개의 할 일이 있어요.`}
              </p>
            </div>
            <div className="remaining-count" aria-live="polite">
              <span>남은 할 일</span>
              <strong>{remainingCount}</strong>
            </div>
          </div>

          {loadError && (
            <div className="error-message" role="alert">
              <p>{loadError}</p>
              <button
                className="retry-button"
                type="button"
                onClick={retryLoading}
                disabled={isLoading}
              >
                {isLoading ? "확인 중..." : "다시 불러오기"}
              </button>
            </div>
          )}

          {saveError && !loadError && (
            <p className="error-message" role="alert">
              {saveError}
            </p>
          )}

          <form className="add-form" onSubmit={handleSubmit}>
            <label className="visually-hidden" htmlFor="new-task">
              새 할 일
            </label>
            <input
              id="new-task"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="새로운 할 일을 입력하세요"
              maxLength={MAX_TITLE_LENGTH}
              disabled={!canEdit}
              autoComplete="off"
            />
            <button
              className="add-button"
              type="submit"
              disabled={!canEdit || title.trim().length === 0}
            >
              <span aria-hidden="true">+</span>
              추가
            </button>
          </form>
          <p className="input-hint">최대 {MAX_TITLE_LENGTH}자 · Enter로 추가</p>

          {isLoading ? (
            <p className="loading-message" role="status">
              할 일을 불러오는 중...
            </p>
          ) : tasks.length === 0 && !loadError ? (
            <div className="empty-state">
              <div className="empty-icon" aria-hidden="true">
                <svg viewBox="0 0 40 40" fill="none">
                  <path
                    d="M12 20.5 17.5 26 29 14"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
              <h3>아직 할 일이 없어요</h3>
              <p>새로운 할 일을 추가해 보세요.</p>
            </div>
          ) : (
            <ul className="task-list" aria-label="할 일">
              {tasks.map((task) => (
                <li className="task-row" key={task.id}>
                  <label className="task-label">
                    <input
                      className="task-checkbox"
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => void toggleTask(task.id)}
                      disabled={!canEdit}
                    />
                    <span
                      className={
                        task.completed
                          ? "task-title task-title-completed"
                          : "task-title"
                      }
                    >
                      {task.title}
                    </span>
                  </label>
                  <button
                    className="delete-button"
                    type="button"
                    onClick={() => void deleteTask(task.id)}
                    disabled={!canEdit}
                    aria-label={`${task.title} 삭제`}
                    title="삭제"
                  >
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M4.5 6h11M8 6V4.5h4V6m2.5 0-.6 9.2a1 1 0 0 1-1 .9H7.1a1 1 0 0 1-1-.9L5.5 6m2.8 2.5v5m3.4-5v5"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {isReady && tasks.length > 0 && remainingCount === 0 && !loadError && (
            <p className="all-done-message" role="status">
              모든 할 일을 완료했어요.
            </p>
          )}
        </section>

        <footer className="page-footer">
          <span className="privacy-dot" aria-hidden="true" />
          이 브라우저에만 저장돼요
        </footer>
      </div>
    </main>
  );
}
