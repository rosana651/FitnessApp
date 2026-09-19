const COLORS = {
  success: {
    dot: "bg-emerald-400",
    title: "text-emerald-400",
    border: "border-emerald-400/10",
    bg: "bg-emerald-500/5",
  },

  warning: {
    dot: "bg-amber-400",
    title: "text-amber-400",
    border: "border-amber-400/10",
    bg: "bg-amber-500/5",
  },

  danger: {
    dot: "bg-red-400",
    title: "text-red-400",
    border: "border-red-400/10",
    bg: "bg-red-500/5",
  },
};

export default function TechniqueExplanation({ exercise, result }) {
  if (!result) return null;

  let data;

  if (exercise === "plank") {
    data = {
      title: "Как оценивается планка",

      description:
        "Система отслеживает угол положения тела во время выполнения планки и разделяет время выполнения на три состояния",

      results: [
        {
          type: "success",
          title: `Хорошая техника: ${result.good_form_seconds?.toFixed(1)} сек`,
          text:
            "Угол находился в диапазоне от 160° до 175°. Это соответствовало допустимому положению тела во время выполнения планки",
        },

        {
          type: "warning",
          title: `Таз поднят высоко: ${result.hips_too_high_seconds?.toFixed(1)} сек`,
          text:
            "Угол превышал 175°, поэтому положение тела определялось как слишком высокое",
        },

        {
          type: "danger",
          title: `Таз провисает: ${result.hips_sagging_seconds?.toFixed(1)} сек`,
          text:
            "Угол опускался ниже 160°, поэтому положение тела определялось как провисание таза",
        },
      ],
    };
  }

  if (exercise === "squat") {
    data = {
      title: "Как оцениваются приседания",

      description:
        "Для каждого повторения система определяет минимальный угол в коленном суставе и по нему оценивает глубину приседания",

      results: [
        {
          type: "success",
          title: "Глубина в норме",
          text:
            "Минимальный угол во время повторения находился от 65° до 90°. Такое повторение считается выполненным с нормальной глубиной",
        },

        {
          type: "warning",
          title: "Недостаточная глубина",
          text:
            "Минимальный угол был больше 100°. Это означает, что повторение было недостаточно глубоким",
        },

        {
          type: "danger",
          title: "Слишком глубокое",
          text:
            "Минимальный угол был меньше 65°. Повторение было определено как слишком глубокое",
        },
      ],
    };
  }

  if (
    exercise === "close_grip_pushup" ||
    exercise === "wide_pushup"
  ) {
    data = {
      title:
        exercise === "close_grip_pushup"
          ? "Как оцениваются отжимания узким хватом"
          : "Как оцениваются отжимания широким хватом",

      description:
        "Для каждого повторения система определяет минимальный угол в локтевом суставе и по нему оценивает глубину отжимания",

      results: [
        {
          type: "success",
          title: "good_depth",
          text:
            "Минимальный угол находился от 70° до 90°. Такое повторение считается выполненным с нормальной глубиной",
        },

        {
          type: "warning",
          title: "too_shallow",
          text:
            "Минимальный угол был больше 90°. Это означает, что локоть согнулся недостаточно сильно",
        },

        {
          type: "danger",
          title: "too_deep",
          text:
            "Минимальный угол был меньше 70°. Поэтому повторение было определено как слишком глубокое",
        },
      ],
    };
  }

  if (!data) return null;

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/2 p-5 sm:p-6">

      <h3 className="text-base font-semibold text-white">
        {data.title}
      </h3>

      <p className="mt-2 text-md leading-6 text-slate-400">
        {data.description}
      </p>

      <div className="mt-5 flex flex-col gap-3">

        {data.results.map((item) => {
          const colors = COLORS[item.type];

          return (
            <div
              key={item.title}
              className={`rounded-xl border ${colors.border} ${colors.bg} p-4`}
            >

              <div className="flex items-center gap-2">

                {/* <span
                  className={`h-1.5 w-1.5 rounded-full ${colors.dot}`}
                /> */}

                <p className={`text-sm font-medium ${colors.title}`}>
                  {item.title}
                </p>

              </div>

              <p className="mt-2 pl-3.5 text-sm leading-6 text-slate-400">
                {item.text}
              </p>

            </div>
          );
        })}

      </div>
    </div>
  );
}