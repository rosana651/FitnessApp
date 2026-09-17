import { useState } from "react";
import { uploadSquatVideo, uploadPlankVideo, uploadWidePushupVideo, uploadCloseGripPushupVideo, getWorkoutById,} from "../api/workout";
import { CircleCheck, ScanEye, MoveRight, FileUp } from "lucide-react";
import ResultCard from "../components/ResultCard";
import VerdictCounts from "../components/VerdictCounts";
import VideoRequirementsPopUp from "../components/VideoRequirementsPopUp";
import pushups from "../assets/pushups.png";
import squat from "../assets/squat.png";
import plank from "../assets/plank.png";

const EXERCISES = [
  {
    id: "squat",
    label: "Приседания",
    icon: squat,
  },
  {
    id: "plank",
    label: "Планка",
    icon: plank,
  },
  {
    id: "close_grip_pushup",
    label: "Узкий хват",
    icon: pushups,
  },
  {
    id: "wide_pushup",
    label: "Широкий хват",
    icon: pushups,
  },
];

const UPLOAD_FUNC = {
  squat: uploadSquatVideo,
  plank: uploadPlankVideo,
  wide_pushup: uploadWidePushupVideo,
  close_grip_pushup: uploadCloseGripPushupVideo,
};

export default function WorkoutPage() {
  const [exercise, setExercise] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [showRequirements, setShowRequirements] = useState(false);

  async function handleUpload() {
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const uploadFn = UPLOAD_FUNC[exercise];
      const data = await uploadFn(file);

      const interval = setInterval(async () => {
        try {
          const session = await getWorkoutById(data.id);

          if (session.status === "done") {
            clearInterval(interval);
            setResult(session);
            setLoading(false);
          }

          if (session.status === "failed") {
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

      setError(
        typeof detail === "string"
          ? detail
          : "Ошибка загрузки видео"
      );

      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!file || !exercise) return;

    const hideRequirements =
      localStorage.getItem("hide_video_requirements") === "true";

    if (!hideRequirements) {
      setShowRequirements(true);
      return;
    }

    handleUpload();
  }

  function handleReset() {
    setExercise(null);
    setFile(null);
    setResult(null);
    setError("");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#08080c] px-4 py-12 text-white sm:py-16">

      {/* Background glow */}
      <div className="pointer-events-none absolute -left-40 top-0 h-125 w-125 rounded-full bg-purple-700/10 blur-[120px]" />

      <div className="pointer-events-none absolute -bottom-40 right-0 h-125 w-125 rounded-full bg-violet-700/10 blur-[120px]" />

      <div className="relative z-10 mx-auto w-full max-w-5xl">

        {/* Header */}
        <div className="mb-10 text-center">

          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-500/10 text-xl text-purple-300 shadow-[0_0_35px_rgba(168,85,247,0.12)]">
              <ScanEye size={20}/>
          </div>

          <p className="mb-2 text-xs font-medium uppercase tracking-[0.3em] text-purple-400">
            Fitness App
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Анализ техники
          </h1>

        </div>

        {!result ? (
          <>

            {/* Exercise section */}
            <div className="mb-6 flex items-end justify-between">

              <div>
                <h2 className="text-lg font-semibold text-white">
                  Выберите упражнение
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Доступно 4 вида анализа
                </p>
              </div>

              {exercise && (
                <button
                  type="button"
                  onClick={() => {
                    setExercise(null);
                    setFile(null);
                    setError("");
                  }}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:border-purple-400/25 hover:bg-purple-500/25 hover:text-purple-400 hover:cursor-pointer"
                >
                  Изменить
                </button>
              )}

            </div>

            {/* Exercise cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              {EXERCISES.map((ex) => {
                const selected = exercise === ex.id;

                return (
                  <button
                    key={ex.id}
                    type="button"
                    onClick={() => {
                      setExercise(ex.id);
                      setFile(null);
                      setError("");
                    }}
                    className={`group relative overflow-hidden rounded-3xl border p-6 text-left transition-all duration-300 hover:cursor-pointer ${
                      selected
                        ? "border-purple-400/40 bg-purple-500/10 shadow-[0_0_35px_rgba(168,85,247,0.10)]"
                        : "border-white/10 bg-[#101016] hover:-translate-y-1 hover:border-purple-400/25 hover:bg-[#13131b]"
                    }`}
                  >

                    {/* Decorative glow */}
                    <div
                      className={`absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl transition-opacity ${
                        selected
                          ? "bg-purple-500/20 opacity-100"
                          : "bg-purple-500/10 opacity-0 group-hover:opacity-100"
                      }`}
                    />

                    <div className="relative">

                      <div className="mb-8 flex items-start justify-between">

                        <div
                          className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl transition-all ${
                            selected
                              ? "bg-purple-500/20 shadow-[0_0_25px_rgba(168,85,247,0.15)]"
                              : "bg-white/50 group-hover:bg-purple-500/45"
                          }`}
                        >
                          <img
                            src={ex.icon}
                            alt={ex.label}
                            className="h-10 w-10 object-contain"
                          />
                        </div>

                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
                            selected
                              ? "border-purple-400/40 bg-purple-500 text-white"
                              : "border-white/10 text-slate-600 group-hover:border-purple-400/30 group-hover:text-purple-400"
                          }`}
                        >
                          <MoveRight size={15}/>
                        </div>

                      </div>

                      <h3 className="text-lg font-semibold text-white">
                        {ex.label}
                      </h3>

                    </div>

                  </button>
                );
              })}

            </div>

            {/* Upload */}
            {exercise && (
              <form
                onSubmit={handleSubmit}
                className="mt-6"
              >

                <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#101016]">

                  <div className="border-b border-white/5 px-6 py-5">
                    <p className="text-sm font-semibold text-white">
                      Загрузите видео
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      MP4, MOV, AVI и другие видеоформаты
                    </p>
                  </div>

                  <div className="p-6">

                    <label
                      className={`group flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed transition-all ${
                        file
                          ? "border-purple-400/40 bg-purple-500/5"
                          : "border-white/10 bg-white/2 hover:border-purple-400/30 hover:bg-purple-500/3"
                      }`}
                    >

                      <div
                        className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-all ${
                          file
                            ? "bg-purple-500/15 text-purple-300"
                            : "bg-white/5 text-slate-500 group-hover:bg-purple-500/10 group-hover:text-purple-300"
                        }`}
                      >
                        {file ? <CircleCheck size={25}/> : <FileUp size={25}/>}
                      </div>

                      {file ? (
                        <>
                          <p className="max-w-md truncate px-4 text-sm font-medium text-white">
                            {file.name}
                          </p>

                          <p className="mt-2 text-xs text-purple-400">
                            Видео готово к анализу
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-medium text-slate-300">
                            Нажмите, чтобы выбрать видео
                          </p>

                          <p className="mt-2 text-xs text-slate-500">
                            Загрузите видео с хорошим освещением и
                            видимым телом
                          </p>
                        </>
                      )}

                      <input
                        type="file"
                        accept="video/*"
                        required
                        onChange={(e) =>
                          setFile(e.target.files[0])
                        }
                        className="hidden"
                      />

                    </label>

                    {error && (
                      <div className="mt-4 rounded-2xl border border-red-400/10 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading || !file}
                      className="mt-5 flex h-13 w-full items-center justify-center rounded-2xl bg-purple-500 px-5 text-sm font-semibold text-white shadow-lg shadow-purple-500/10 transition-all hover:cursor-pointer hover:bg-purple-400 hover:shadow-purple-500/20 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Анализируем видео
                        </span>
                      ) : (
                        "Запустить анализ "
                      )}
                    </button>

                  </div>
                </div>

              </form>
            )}

          </>
        ) : (

          /* ================= RESULT ================= */

          <div className="rounded-3xl border border-white/10 bg-[#101016] p-6 shadow-2xl sm:p-8">

            <div className="mb-8 flex flex-col items-center text-center">

              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-500/10 text-2xl text-emerald-400">
                <CircleCheck size={25}/>
              </div>

              <p className="text-xs font-medium uppercase tracking-[0.25em] text-emerald-400">
                Анализ выполнен
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                Результат анализа
              </h2>
            </div>

            {/* SQUAT */}
            {exercise === "squat" && result.result && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                <ResultCard
                  title="Повторения"
                  value={result.result.total_reps}
                />

                <ResultCard
                  title="Средний угол"
                  value={`${result.result.avg_angle?.toFixed(1)}°`}
                />

                <ResultCard
                  title="Минимальный угол"
                  value={`${result.result.min_angle?.toFixed(1)}°`}
                />

                <VerdictCounts result={result.result} />

              </div>
            )}

            {/* PLANK */}
            {exercise === "plank" && result.result && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <ResultCard
                  title="Общее время"
                  value={`${result.result.total_seconds?.toFixed(1)} сек`}
                />

                <ResultCard
                  title="Хорошая техника"
                  value={`${result.result.good_form_seconds?.toFixed(1)} сек`}
                  type="success"
                />

                <ResultCard
                  title="Таз провисает"
                  value={`${result.result.hips_sagging_seconds?.toFixed(1)} сек`}
                  type="danger"
                />

                <ResultCard
                  title="Таз слишком высоко"
                  value={`${result.result.hips_too_high_seconds?.toFixed(1)} сек`}
                  type="warning"
                />

              </div>
            )}

            {/* WIDE PUSHUP */}
            {exercise === "wide_pushup" && result.result && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                <ResultCard
                  title="Повторения"
                  value={result.result.total_reps}
                />

                <ResultCard
                  title="Средний угол"
                  value={`${result.result.avg_angle?.toFixed(1)}°`}
                />

                <ResultCard
                  title="Минимальный угол"
                  value={`${result.result.min_angle?.toFixed(1)}°`}
                />

                <VerdictCounts result={result.result} />

              </div>
            )}

            {/* CLOSE PUSHUP */}
            {exercise === "close_grip_pushup" && result.result && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                <ResultCard
                  title="Повторения"
                  value={result.result.total_reps}
                />

                <ResultCard
                  title="Средний угол"
                  value={`${result.result.avg_angle?.toFixed(1)}°`}
                />

                <ResultCard
                  title="Минимальный угол"
                  value={`${result.result.min_angle?.toFixed(1)}°`}
                />

                <VerdictCounts result={result.result} />

              </div>
            )}

            <button
              type="button"
              onClick={handleReset}
              className="mt-7 h-12 w-full rounded-2xl border border-white/10 bg-white/3 text-sm font-medium text-slate-300 transition hover:cursor-pointer hover:border-purple-400/20 hover:bg-purple-500/5 hover:text-white"
            >
              Новый анализ
            </button>

          </div>
        )}

      </div>

      {showRequirements && (
        <VideoRequirementsPopUp
          onClose={() => setShowRequirements(false)}
          onContinue={() => {
            setShowRequirements(false);
            handleUpload();
          }}
        />
      )}

    </div>
  );
}