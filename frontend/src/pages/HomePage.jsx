import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { me } from "../api/auth";

export default function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    me()
      .then((data) => setUser(data))
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
          <p className="text-sm text-slate-400">Загрузка…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:py-16">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white shadow-sm">
              AI
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">
                Fitness App
              </p>
              <p className="text-xs text-slate-400">
                AI Workout Analysis
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("access_token");
              navigate("/login");
            }}
            className="rounded-xl hover:cursor-pointer border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:text-slate-800 hover:bg-red-400"
          >
            Выйти
          </button>
        </div>

        {/* Приветствие */}
        <div className="rounded-3xl bg-slate-900 p-7 text-white shadow-lg sm:p-9">
          <div className="max-w-xl">
            <p className="mb-3 text-sm font-medium text-slate-400">
              Добро пожаловать 
            </p>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Привет, {user?.username}
            </h1>

            <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300">
              Загрузи видео с упражнением и получи автоматический анализ
              техники выполнения.
            </p>

            <button
              type="button"
              onClick={() => navigate("/workouts")}
              className="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 hover:cursor-pointer"
            >
              Начать тренировку →
            </button>
          </div>
        </div>

        {/* Заголовок секции */}
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Что хотите сделать?
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Выберите действие
          </p>
        </div>

        {/* Карточки действий */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          {/* Новый анализ */}
          <button
            type="button"
            onClick={() => navigate("/workouts")}
            className="group flex min-h-52 flex-col rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md hover:cursor-pointer"
          >
            <div className="flex items-start justify-between ">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-xl transition group-hover:bg-slate-900 group-hover:text-white">
                +
              </div>

              <span className="text-xl text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-600">
                →
              </span>
            </div>

            <div className="mt-auto pt-8">
              <h3 className="font-semibold text-slate-900">
                Новый анализ
              </h3>

              <p className="mt-2 text-sm leading-5 text-slate-500">
                Загрузить видео с приседаниями или планкой и проверить технику
              </p>
            </div>
          </button>

          {/* История */}
          <button
            type="button"
            onClick={() => navigate("/history")}
            className="group flex min-h-52 flex-col rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md hover:cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-xl transition group-hover:bg-slate-900 group-hover:text-white">
                ◷
              </div>

              <span className="text-xl text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-600">
                →
              </span>
            </div>

            <div className="mt-auto pt-8">
              <h3 className="font-semibold text-slate-900">
                История тренировок
              </h3>

              <p className="mt-2 text-sm leading-5 text-slate-500">
                Посмотреть результаты прошлых анализов и отслеживать прогресс
              </p>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
}

