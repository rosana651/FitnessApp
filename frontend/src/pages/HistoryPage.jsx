import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWorkoutHistory, deleteWorkout } from "../api/workout";

const EXERCISE_LABELS = {
  squat: "Приседания",
  plank: "Планка",
  wide_pushup: "Отжимания (широкий хват)",
  close_grip_pushup: "Отжимания (узкий хват)",
};

const STATUS_LABELS = {
  processing: "Обрабатывается",
  done: "Готово",
  failed: "Ошибка",
};

const STATUS_COLORS = {
  processing: "text-amber-400 bg-amber-500/10 border-amber-400/10",
  done: "text-emerald-400 bg-emerald-500/10 border-emerald-400/10",
  failed: "text-red-400 bg-red-500/10 border-red-400/10",
};

export default function HistoryPage() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getWorkoutHistory()
      .then((data) => setSessions(data))
      .catch((err) => {
        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          setError("Не удалось загрузить историю");
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  async function handleDelete(id) {
    try {
      await deleteWorkout(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch {
      setError("Не удалось удалить тренировку");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#08080c]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-purple-400" />
          <p className="text-sm text-slate-500">
            Загрузка истории…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#08080c] px-4 py-10 text-white sm:py-16">

      {/* Background glow */}
      <div className="pointer-events-none absolute -left-40 top-0 h-125 w-125 rounded-full bg-purple-700/10 blur-[120px]" />

      <div className="pointer-events-none absolute -bottom-40 right-0 h-125 w-125 rounded-full bg-violet-700/10 blur-[120px]" />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-8">

        {/* Header */}
        <div className="flex items-center justify-between gap-4">

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-purple-400">
              Fitness App
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
              История тренировок
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Все результаты ваших предыдущих анализов
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-purple-400/20 hover:bg-purple-500/10 hover:text-white cursor-pointer"
          >
            ← Главная
          </button>

        </div>

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-red-400/10 bg-red-500/10 px-5 py-4">
            <p className="text-sm text-red-400">
              {error}
            </p>
          </div>
        )}

        {/* Empty history */}
        {sessions.length === 0 && !error && (
          <div className="flex flex-col items-center rounded-3xl border border-white/10 bg-[#101016] px-6 py-16 text-center shadow-2xl shadow-purple-950/10">

            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/5 bg-white/5 text-2xl text-slate-500">
              ◷
            </div>

            <h2 className="text-lg font-semibold text-white">
              История пока пуста
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-5 text-slate-500">
              Загрузите первое видео, чтобы здесь появились результаты анализа
              ваших тренировок.
            </p>

            <button
              type="button"
              onClick={() => navigate("/workouts")}
              className="mt-6 rounded-xl bg-purple-600 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-purple-500/10 transition hover:bg-purple-500 hover:shadow-purple-500/20 cursor-pointer"
            >
              Загрузить первое видео →
            </button>

          </div>
        )}

        {/* Count */}
        {sessions.length > 0 && (
          <div className="flex items-center justify-between">

            <p className="text-sm font-medium text-slate-300">
              Ваши тренировки
            </p>

            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-400">
              {sessions.length}
            </span>

          </div>
        )}

        {/* List */}
        <div className="flex flex-col gap-4">

          {sessions.map((session) => (
            <div
              key={session.id}
              className="rounded-2xl border border-white/10 bg-[#101016] p-5 shadow-lg shadow-black/10 transition-all hover:border-purple-400/20 hover:shadow-purple-950/10 sm:p-6"
            >

              {/* Top */}
              <div className="flex items-start justify-between gap-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-white/5 text-lg">
                    {session.exercise_type === "squat"
                      ? "🏋️"
                      : session.exercise_type === "plank"
                        ? "🧘"
                        : "💪"}
                  </div>

                  <div>

                    <h2 className="font-semibold text-white">
                      {EXERCISE_LABELS[session.exercise_type] ??
                        session.exercise_type}
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      {new Date(session.created_at).toLocaleString("ru-RU")}
                    </p>

                  </div>

                </div>

                <span
                  className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${
                    STATUS_COLORS[session.status] ??
                    "border-white/10 bg-white/5 text-slate-500"
                  }`}
                >
                  {STATUS_LABELS[session.status] ?? session.status}
                </span>

              </div>

              {/* Squat */}
              {session.status === "done" &&
                session.exercise_type === "squat" &&
                session.result && (
                  <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/5 pt-5 sm:grid-cols-3">

                    <div className="rounded-xl border border-white/5 bg-white/[0.025] p-4">
                      <p className="text-xs text-slate-500">
                        Повторения
                      </p>

                      <p className="mt-1 text-xl font-bold text-white">
                        {session.result.total_reps}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/5 bg-white/[0.025] p-4">
                      <p className="text-xs text-slate-500">
                        Средний угол
                      </p>

                      <p className="mt-1 text-xl font-bold text-white">
                        {session.result.avg_angle?.toFixed(1)}°
                      </p>
                    </div>

                    <div className="col-span-2 rounded-xl border border-white/5 bg-white/[0.025] p-4 sm:col-span-1">

                      <p className="text-xs text-slate-500">
                        Качество
                      </p>

                      <div className="mt-2 flex flex-wrap gap-1.5">

                        {session.result.verdict_counts &&
                          Object.entries(session.result.verdict_counts).map(
                            ([verdict, count]) => (
                              <span
                                key={verdict}
                                className="rounded-lg border border-white/5 bg-white/5 px-2 py-1 text-xs text-slate-400"
                              >
                                {verdict}: {count}
                              </span>
                            )
                          )}

                      </div>

                    </div>

                  </div>
                )}

              {/* Plank */}
              {session.status === "done" &&
                session.exercise_type === "plank" &&
                session.result && (
                  <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/5 pt-5">

                    <div className="rounded-xl border border-white/5 bg-white/[0.025] p-4">
                      <p className="text-xs text-slate-500">
                        Общее время
                      </p>

                      <p className="mt-1 text-xl font-bold text-white">
                        {session.result.total_seconds?.toFixed(1)} сек
                      </p>
                    </div>

                    <div className="rounded-xl border border-emerald-400/10 bg-emerald-500/5 p-4">
                      <p className="text-xs text-emerald-400">
                        Хорошая техника
                      </p>

                      <p className="mt-1 text-xl font-bold text-emerald-400">
                        {session.result.good_form_seconds?.toFixed(1)} сек
                      </p>
                    </div>

                    <div className="rounded-xl border border-red-400/10 bg-red-500/5 p-4">
                      <p className="text-xs text-red-400">
                        Таз провисает
                      </p>

                      <p className="mt-1 text-xl font-bold text-red-400">
                        {session.result.hips_sagging_seconds?.toFixed(1)} сек
                      </p>
                    </div>

                    <div className="rounded-xl border border-amber-400/10 bg-amber-500/5 p-4">
                      <p className="text-xs text-amber-400">
                        Таз слишком высоко
                      </p>

                      <p className="mt-1 text-xl font-bold text-amber-400">
                        {session.result.hips_too_high_seconds?.toFixed(1)} сек
                      </p>
                    </div>

                  </div>
                )}

              {/* Wide / Close grip pushups */}
              {session.status === "done" &&
                (session.exercise_type === "wide_pushup" ||
                  session.exercise_type === "close_grip_pushup") &&
                session.result && (
                  <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/5 pt-5 sm:grid-cols-3">

                    <div className="rounded-xl border border-white/5 bg-white/[0.025] p-4">
                      <p className="text-xs text-slate-500">
                        Повторения
                      </p>

                      <p className="mt-1 text-xl font-bold text-white">
                        {session.result.total_reps}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/5 bg-white/[0.025] p-4">
                      <p className="text-xs text-slate-500">
                        Средний угол
                      </p>

                      <p className="mt-1 text-xl font-bold text-white">
                        {session.result.avg_angle?.toFixed(1)}°
                      </p>
                    </div>

                    <div className="col-span-2 rounded-xl border border-white/5 bg-white/[0.025] p-4 sm:col-span-1">

                      <p className="text-xs text-slate-500">
                        Качество
                      </p>

                      <div className="mt-2 flex flex-wrap gap-1.5">

                        {session.result.verdict_counts &&
                          Object.entries(session.result.verdict_counts).map(
                            ([verdict, count]) => (
                              <span
                                key={verdict}
                                className="rounded-lg border border-white/5 bg-white/5 px-2 py-1 text-xs text-slate-400"
                              >
                                {verdict}: {count}
                              </span>
                            )
                          )}

                      </div>

                    </div>

                  </div>
                )}

              {/* Failed */}
              {session.status === "failed" && (
                <div className="mt-5 rounded-xl border border-red-400/10 bg-red-500/5 px-4 py-3">
                  <p className="text-sm text-red-400">
                    Не удалось обработать видео
                  </p>
                </div>
              )}

              {/* Delete */}
              <div className="mt-5 flex justify-end border-t border-white/5 pt-4">

                <button
                  type="button"
                  onClick={() => handleDelete(session.id)}
                  className="rounded-lg px-3 py-2 text-xs font-medium text-slate-500 transition hover:bg-red-500/10 hover:text-red-400 cursor-pointer"
                >
                  Удалить
                </button>

              </div>

            </div>
          ))}

        </div>

        {/* New workout */}
        {sessions.length > 0 && (
          <button
            type="button"
            onClick={() => navigate("/workouts")}
            className="flex h-12 items-center justify-center rounded-xl bg-purple-600 text-sm font-semibold text-white shadow-lg shadow-purple-500/10 transition hover:bg-purple-500 hover:shadow-purple-500/20 cursor-pointer"
          >
            + Новый анализ
          </button>
        )}

      </div>
    </div>
  );
}