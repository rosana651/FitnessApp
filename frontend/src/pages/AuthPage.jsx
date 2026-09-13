import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../api/auth.js";
import logo from "../assets/logo.png"
import { Eye } from "lucide-react";
import { ScanEye } from "lucide-react";

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
    <div className="min-h-screen bg-[#08080c] px-4 py-10 text-white ">

      
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center justify-center">

        <div className="grid w-full overflow-hidden rounded-4xl border border-white/10 bg-[#101016] shadow-2xl shadow-purple-950/30 lg:grid-cols-2">

          {/* Левая часть */}
          <div className="relative hidden min-h-[650px] overflow-hidden bg-linear-to-br from-[#171126] via-[#0d0d13] to-[#08080c] p-12 lg:flex lg:flex-col lg:justify-between">

            <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl" />
            <div className="absolute -bottom-20 right-0 h-80 w-80 rounded-full bg-violet-700/20 blur-3xl" />

            <div className="relative z-10">
              <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-500/10 text-xl text-purple-300">
                <ScanEye size={20}/>
              </div>

              <p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-purple-400">
                Fitness Analysis
              </p>

              <h1 className="max-w-md text-5xl font-bold leading-tight tracking-tight">
                Анализируй.
                <br />
                Тренируйся.
                <br />
                <span className="text-purple-400">Становись лучше.</span>
              </h1>

              <p className="mt-6 max-w-md text-base leading-7 text-slate-400">
                Загружай видео своих тренировок и получай автоматический
                анализ техники выполнения упражнений
              </p>
            </div>
          </div>

          {/* Правая часть */}
          <div className="flex min-h-[650px] items-center justify-center p-6 sm:p-10 lg:p-12">

            <div className="w-full max-w-md">

              {/* Логотип для мобильной версии */}
              <div className="mb-8 flex items-center gap-3 lg:hidden">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-600 text-lg font-bold shadow-lg shadow-purple-900/30">
                  ✦
                </div>

                <span className="text-lg font-semibold">
                  Fitness App
                </span>
              </div>

              <div className="mb-8">
                <p className="mb-3 text-sm font-medium text-purple-400">
                  Добро пожаловать
                </p>

                <h2 className="text-3xl font-bold tracking-tight text-white">
                  {mode === "login"
                    ? "С возвращением!"
                    : "Создайте аккаунт"}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {mode === "login"
                    ? "Введите данные для входа в аккаунт"
                    : "Заполните данные, чтобы начать тренировки"}
                </p>
              </div>

              {/* Переключатель */}
              <div className="mb-7 grid grid-cols-2 rounded-2xl border border-white/10 bg-[#0b0b10] p-1.5">
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className={`rounded-xl py-3 text-sm font-medium transition-all cursor-pointer ${
                    mode === "login"
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-900/30"
                      : "text-slate-500 hover:text-white"
                  }`}
                >
                  Войти
                </button>

                <button
                  type="button"
                  onClick={() => switchMode("register")}
                  className={`rounded-xl py-3 text-sm font-medium transition-all cursor-pointer ${
                    mode === "register"
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-900/30"
                      : "text-slate-500 hover:text-white"
                  }`}
                >
                  Регистрация
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                {mode === "register" && (
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-slate-300">
                      Username
                    </span>

                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Введите username"
                      className="h-12 w-full rounded-xl border border-white/10 bg-[#0b0b10] px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    />
                  </label>
                )}

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-300">
                    Email
                  </span>

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-12 w-full rounded-xl border border-white/10 bg-[#0b0b10] px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  />
                </label>

                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-300">
                    Password
                  </span>

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
                      className="h-12 w-full rounded-xl border border-white/10 bg-[#0b0b10] px-4 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-purple-400 cursor-pointer"
                    >
                      <Eye size={20}/>
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                    <p className="text-sm text-red-400">
                      {error}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex h-12 items-center justify-center rounded-xl bg-purple-600 px-4 text-sm font-semibold text-white shadow-lg shadow-purple-900/30 transition-all hover:bg-purple-500 hover:shadow-purple-900/50 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Загрузка...
                    </span>
                  ) : mode === "login" ? (
                    "Войти в аккаунт"
                  ) : (
                    "Создать аккаунт"
                  )}
                </button>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

