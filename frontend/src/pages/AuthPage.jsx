import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../api/auth.js";

export default function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const switchMode = (newMode) => {
    setMode(newMode);
    setError("");
    setUsername("");
    setEmail("");
    setPassword("");
    setShowPassword(false);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(username, email, password);
      }
      navigate("/");
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 sm:py-20">
      <div className="mx-auto flex w-full max-w-md flex-col justify-center">

        {/* Логотип и заголовок */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-lg font-bold text-white shadow-lg">
            &#10022;
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Fitness App
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Анализируй свои тренировки с помощью AI
          </p>
        </div>

        {/* Карточка */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          <div className="mb-7 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`rounded-lg py-2.5 text-sm font-medium transition-all hover:cursor-pointer ${
                mode === "login"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Войти
            </button>

            <button
              type="button"
              onClick={() => switchMode("register")}
              className={`rounded-lg py-2.5 text-sm font-medium transition-all hover:cursor-pointer ${
                mode === "register"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Регистрация
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900">
              {mode === "login" ? "С возвращением!" : "Создайте аккаунт"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {mode === "login"
                ? "Введите данные для входа в аккаунт"
                : "Заполните данные, чтобы начать тренировки"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {mode === "register" && (
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-slate-700">
                  Username
                </span>

                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Введите username"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10"
                />
              </label>
            )}

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-700">
                Email
              </span>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10"
              />
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={mode === "register" ? 8 : 1}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={
                  mode === "register"
                    ? "Минимум 8 символов"
                    : "Введите пароль"
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700 cursor-pointer">
                {showPassword ? "👁" : "👁"}
              </button>
          </div>

            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                <span className="text-sm text-red-500">!</span>

                <p className="text-sm text-red-600">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex h-11 items-center justify-center rounded-xl bg-slate-900 px-4 text-sm font-medium text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 hover:cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Загрузка...
                </span>
              ) : mode === "login" ? (
                "Войти в аккаунт →"
              ) : (
                "Создать аккаунт →"
              )}
            </button>
          </form>
        </div>      
      </div>
    </div>
  );
}

