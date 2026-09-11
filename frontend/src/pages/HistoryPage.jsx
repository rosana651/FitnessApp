
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWorkoutHistory, deleteWorkout } from "../api/workout";

const EXERCISE_LABELS = {
  squat: "Приседания",
  plank: "Планка",
};

const STATUS_LABELS = {
  processing: "Обрабатывается",
  done: "Готово",
  failed: "Ошибка",
};

const STATUS_COLORS = {
  processing: "text-amber-600 bg-amber-50 border-amber-100",
  done: "text-emerald-600 bg-emerald-50 border-emerald-100",
  failed: "text-red-600 bg-red-50 border-red-100",
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
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
          <p className="text-sm text-slate-400">Загрузка истории…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:py-16">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Fitness App
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              История тренировок
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Все результаты ваших предыдущих анализов
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-100 hover:text-slate-800 cursor-pointer"
          >
            ← Главная
          </button>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* Пустая история */}
        {sessions.length === 0 && !error && (
          <div className="flex flex-col items-center rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl text-slate-500">
              ◷
            </div>

            <h2 className="text-lg font-semibold text-slate-900">
              История пока пуста
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-5 text-slate-500">
              Загрузите первое видео, чтобы здесь появились результаты анализа
              ваших тренировок.
            </p>

            <button
              type="button"
              onClick={() => navigate("/workouts")}
              className="mt-6 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 hover:shadow-md cursor-pointer"
            >
              Загрузить первое видео →
            </button>
          </div>
        )}

        {/* Количество тренировок */}
        {sessions.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-700">
              Ваши тренировки
            </p>

            <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
              {sessions.length}
            </span>
          </div>
        )}

        {/* Список */}
        <div className="flex flex-col gap-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md sm:p-6">
              {/* Верх карточки */}
              <div className="flex items-start justify-between gap-4">

                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-lg">
                    {session.exercise_type === "squat" ? "🏋️" : "🧘"}
                  </div>

                  <div>
                    <h2 className="font-semibold text-slate-900">
                      {EXERCISE_LABELS[session.exercise_type] ??
                        session.exercise_type}
                    </h2>

                    <p className="mt-1 text-xs text-slate-400">
                      {new Date(session.created_at).toLocaleString("ru-RU")}
                    </p>
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${
                    STATUS_COLORS[session.status] ??
                    "border-slate-200 bg-slate-50 text-slate-500"
                  }`}>
                  {STATUS_LABELS[session.status] ?? session.status}
                </span>
              </div>

              {/* Результат для приседаний */}
              {session.status === "done" &&
                session.exercise_type === "squat" &&
                session.result && (
                  <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5 sm:grid-cols-3">

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-400">
                        Повторения
                      </p>

                      <p className="mt-1 text-xl font-bold text-slate-900">
                        {session.result.total_reps}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-400">
                        Средний угол
                      </p>

                      <p className="mt-1 text-xl font-bold text-slate-900">
                        {session.result.avg_angle?.toFixed(1)}°
                      </p>
                    </div>

                    <div className="col-span-2 rounded-xl bg-slate-50 p-4 sm:col-span-1">
                      <p className="text-xs text-slate-400">
                        Качество
                      </p>

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {session.result.verdict_counts &&
                          Object.entries(session.result.verdict_counts).map(
                            ([verdict, count]) => (
                              <span
                                key={verdict}
                                className="rounded-lg bg-white px-2 py-1 text-xs text-slate-600"
                              >
                                {verdict}: {count}
                              </span>
                            )
                          )}
                      </div>
                    </div>
                  </div>
                )}

              {/* Результат для планки */}
              {session.status === "done" &&
                session.exercise_type === "plank" &&
                session.result && (
                  <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5">

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-400">
                        Общее время
                      </p>

                      <p className="mt-1 text-xl font-bold text-slate-900">
                        {session.result.total_seconds?.toFixed(1)} сек
                      </p>
                    </div>

                    <div className="rounded-xl bg-emerald-50 p-4">
                      <p className="text-xs text-emerald-600">
                        Хорошая техника
                      </p>

                      <p className="mt-1 text-xl font-bold text-emerald-700">
                        {session.result.good_form_seconds?.toFixed(1)} сек
                      </p>
                    </div>

                    <div className="rounded-xl bg-red-50 p-4">
                      <p className="text-xs text-red-500">
                        Таз провисает
                      </p>

                      <p className="mt-1 text-xl font-bold text-red-700">
                        {session.result.hips_sagging_seconds?.toFixed(1)} сек
                      </p>
                    </div>

                    <div className="rounded-xl bg-amber-50 p-4">
                      <p className="text-xs text-amber-600">
                        Таз слишком высоко
                      </p>

                      <p className="mt-1 text-xl font-bold text-amber-700">
                        {session.result.hips_too_high_seconds?.toFixed(1)} сек
                      </p>
                    </div>
                  </div>
                )}

              {/* Ошибка обработки */}
              {session.status === "failed" && (
                <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                  <p className="text-sm text-red-600">
                    Не удалось обработать видео
                  </p>
                </div>
              )}

              {/* Удаление */}
              <div className="mt-5 flex justify-end border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => handleDelete(session.id)}
                  className="rounded-lg px-3 py-2 text-xs font-medium text-slate-400 transition hover:bg-red-50 hover:text-red-600 cursor-pointer"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Кнопка новой тренировки */}
        {sessions.length > 0 && (
          <button
            type="button"
            onClick={() => navigate("/workouts")}
            className="flex h-12 items-center justify-center rounded-xl bg-slate-900 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 hover:shadow-md cursor-pointer"
          >
            + Новый анализ
          </button>
        )}

      </div>
    </div>
  );
}

