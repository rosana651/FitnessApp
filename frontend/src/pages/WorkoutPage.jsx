import { useState } from "react";
import { uploadSquatVideo, uploadPlankVideo, uploadWidePushupVideo } from "../api/workout";

const EXERCISES = [
  { id: "squat", label: "Приседания" },
  { id: "plank", label: "Планка" },
  { id: "wide_pushup", label: "Отжимания (широкий хват)" },
];

const UPLOAD_FUNC = {
  squat: uploadSquatVideo,
  plank: uploadPlankVideo,
  wide_pushup: uploadWidePushupVideo,
};

export default function WorkoutPage() {
  const [exercise, setExercise] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [jobId, setJobId] = useState(null);

async function handleSubmit(e) {
    e.preventDefault();
    if (!file || !exercise) return;

    setError("");
    setResult(null);
    setLoading(true);

    try {
      const uploadFn = UPLOAD_FUNC[exercise];
      const data = await uploadFn(file);
      
      setJobId(data.id);

      const interval = setInterval(async () => {
        try {
          const { getWorkoutById } = await import("../api/workout");
          const session = await getWorkoutById(data.id);

          if (session.status === "done") {
            clearInterval(interval);
            setResult(session);
            setLoading(false);
          } else if (session.status === "failed") {
            clearInterval(interval);
            setError("Ошибка обработки видео");
            setLoading(false);
          }
        } catch {
          clearInterval(interval);
          setError("Не удалось получить результат");
          setLoading(false);
        }
      }, 3000);

    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Ошибка загрузки видео");
      setLoading(false);
    }
}

  function handleReset() {
    setExercise(null);
    setFile(null);
    setResult(null);
    setJobId(null);
    setError("");
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 sm:py-20">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">

        {/* Заголовок */}
        <div className="text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-xl text-white shadow-lg">
            AI
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Анализ упражнения
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Загрузите видео, а система автоматически оценит технику выполнения
          </p>
        </div>

        {/* Основная карточка */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">

          {/* Прогресс */}
          {!result && (
            <div className="mb-8 flex items-center justify-center gap-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                  exercise
                    ? "bg-slate-900 text-white"
                    : "bg-slate-900 text-white"
                }`}>
                1
              </div>

              <div className="h-px w-10 bg-slate-200 sm:w-16" />

              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                  file
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-400"
                }`}>
                  2
                </div>

              <div className="h-px w-10 bg-slate-200 sm:w-16" />

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-400">3</div>
            </div>
          )}

          {!result && (
            <>
              {/* Шаг 1 */}
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-base font-semibold text-slate-900">
                    Выберите упражнение
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Что будем анализировать?
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {EXERCISES.map((ex) => (
                    <button
                      key={ex.id}
                      type="button"
                      onClick={() => {
                        setExercise(ex.id);
                        setFile(null);
                        setError("");
                      }}
                      className={`group flex items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-200 hover:cursor-pointer ${
                        exercise === ex.id
                          ? "border-slate-900 bg-slate-900 text-white shadow-md"
                          : "border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm"
                      }`}
                    >
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ${
                          exercise === ex.id
                            ? "bg-white/10"
                            : "bg-slate-100"
                        }`}
                      >
                        {ex.id === "squat" ? "🏋️" : "🧘"}
                      </div>

                      <div>
                        <p className="font-medium">{ex.label}</p>
                        <p
                          className={`mt-0.5 text-xs ${
                            exercise === ex.id
                              ? "text-slate-300"
                              : "text-slate-400"
                          }`}
                        >
                          Анализ техники
                        </p>
                      </div>

                      <div className="ml-auto text-lg opacity-50">
                        →
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Шаг 2 */}
              {exercise && (
                <form
                  onSubmit={handleSubmit}
                  className="mt-8 flex flex-col gap-5"
                >
                  <div>
                    <p className="text-base font-semibold text-slate-900">
                      Загрузите видео
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Лучше использовать видео хорошего качества
                    </p>
                  </div>

                  <label
                    className={`group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
                      file
                        ? "border-slate-900 bg-slate-50"
                        : "border-slate-200 bg-slate-50/50 hover:border-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                      {file ? "✓" : "↑"}
                    </div>

                    {file ? (
                      <>
                        <p className="max-w-full truncate px-4 text-sm font-medium text-slate-800">
                          {file.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Файл выбран
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-slate-700">
                          Нажмите, чтобы выбрать видео
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          MP4, MOV, AVI и другие форматы
                        </p>
                      </>
                    )}

                    <input
                      type="file"
                      accept="video/*"
                      required
                      onChange={(e) => setFile(e.target.files[0])}
                      className="hidden"
                    />
                  </label>

                  {error && (
                    <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !file}
                    className="flex h-12 items-center justify-center rounded-xl bg-slate-900 px-5 text-sm hover:cursor-pointer font-medium text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2 
                      ">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Анализируем видео…
                      </span>
                    ) : (
                      "Анализировать видео →"
                    )}
                  </button>
                </form>
              )}
            </>
          )}

          {/* Шаг 3 */}
          {result && (
            <div className="flex flex-col gap-6">

              <div className="text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl text-emerald-600">
                  ✓
                </div>

                <h2 className="text-2xl font-bold text-slate-900">
                  Анализ завершён
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Результаты анализа вашего упражнения
                </p>
              </div>

              {/* Результат приседаний */}
              {exercise === "squat" && result.result && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Повторения
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {result.result.total_reps}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Средний угол
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {result.result.avg_angle?.toFixed(1)}°
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Минимальный угол
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {result.result.min_angle?.toFixed(1)}°
                    </p>
                  </div>

                  {result.result.verdict_counts && (
                    <div className="rounded-2xl border border-slate-200 p-5 sm:col-span-3">
                      <p className="mb-4 text-sm font-semibold text-slate-800">
                        Распределение по качеству
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {Object.entries(result.result.verdict_counts).map(
                          ([verdict, count]) => (
                            <div
                              key={verdict}
                              className="rounded-xl bg-slate-100 px-4 py-2 text-sm text-slate-700"
                            >
                              <span className="font-medium">{verdict}</span>
                              <span className="ml-2 text-slate-400">
                                {count}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Результат планки */}
              {exercise === "plank" && result.result && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Общее время
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {result.result.total_seconds?.toFixed(1)} сек
                    </p>
                  </div>

                  <div className="rounded-2xl bg-emerald-50 p-5">
                    <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">
                      Хорошая техника
                    </p>
                    <p className="mt-2 text-2xl font-bold text-emerald-700">
                      {result.result.good_form_seconds?.toFixed(1)} сек
                    </p>
                  </div>

                  <div className="rounded-2xl bg-red-50 p-5">
                    <p className="text-xs font-medium uppercase tracking-wide text-red-500">
                      Таз провисает
                    </p>
                    <p className="mt-2 text-2xl font-bold text-red-700">
                      {result.result.hips_sagging_seconds?.toFixed(1)} сек
                    </p>
                  </div>

                  <div className="rounded-2xl bg-amber-50 p-5">
                    <p className="text-xs font-medium uppercase tracking-wide text-amber-600">
                      Таз слишком высоко
                    </p>
                    <p className="mt-2 text-2xl font-bold text-amber-700">
                      {result.result.hips_too_high_seconds?.toFixed(1)} сек
                    </p>
                  </div>
                </div>
              )}

              {exercise === "wide_pushup" && result.result && (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-slate-50 p-5">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Повторения
                      </p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">
                        {result.result.total_reps}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-5">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Средний угол
                      </p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">
                        {result.result.avg_angle?.toFixed(1)}°
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-5">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Минимальный угол
                      </p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">
                        {result.result.min_angle?.toFixed(1)}°
                      </p>
                    </div>

                    {result.result.verdict_counts && (
                      <div className="rounded-2xl border border-slate-200 p-5 sm:col-span-3">
                        <p className="mb-4 text-sm font-semibold text-slate-800">
                          Распределение по качеству
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {Object.entries(result.result.verdict_counts).map(
                            ([verdict, count]) => (
                              <div
                                key={verdict}
                                className="rounded-xl bg-slate-100 px-4 py-2 text-sm text-slate-700"
                              >
                                <span className="font-medium">{verdict}</span>
                                <span className="ml-2 text-slate-400">
                                  {count}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              
              <button
                type="button"
                onClick={handleReset}
                className="h-12 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:cursor-pointer"
              >
                ← Загрузить другое видео
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

