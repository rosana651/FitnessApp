import { useState } from "react";
import { CircleCheck, X } from "lucide-react";

export default function VideoRequirementsPopUp({ onClose, onContinue }) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

    function handleContinue() {
    if (dontShowAgain) {
        localStorage.setItem("hide_video_requirements", "true");
    }

    onContinue();
    }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#101016] p-6 shadow-2xl shadow-purple-950/30">

        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-purple-400">
              Внимание!
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              Требования к видео перед загрузкой
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 transition hover:text-white cursor-pointer"
          >
            <X size={30} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex gap-3">
            <CircleCheck
              size={20}
              className="mt-0.5 shrink-0 text-purple-400"
            />

            <p className="text-sm leading-6 text-slate-300">
              Человек должен быть полностью виден в кадре
            </p>
          </div>

          <div className="flex gap-3">
            <CircleCheck
              size={20}
              className="mt-0.5 shrink-0 text-purple-400"
            />

            <p className="text-sm leading-6 text-slate-300">
              Для точного анализа рекомендуется снимать сбоку
            </p>
          </div>

          <div className="flex gap-3">
            <CircleCheck
              size={20}
              className="mt-0.5 shrink-0 text-purple-400"
            />

            <p className="text-sm leading-6 text-slate-300">
              Убедитесь, что освещение позволяет хорошо видеть тело
            </p>
          </div>

          <div className="flex gap-3">
            <CircleCheck
              size={20}
              className="mt-0.5 shrink-0 text-purple-400"
            />

            <p className="text-sm leading-6 text-slate-300">
              Камера должна оставаться неподвижной во время выполнения упражнения
            </p>
          </div>
        </div>

        <label className="mt-6 flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
            className="h-4 w-4 accent-purple-500 cursor-pointer"
          />

          <span className="text-sm text-slate-400 cursor-pointer">
            Больше не показывать
          </span>
        </label>

        <button
          type="button"
          onClick={handleContinue}
          className="mt-6 w-full rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-500 cursor-pointer"
        >
          Ок
        </button>

      </div>
    </div>
  );
}