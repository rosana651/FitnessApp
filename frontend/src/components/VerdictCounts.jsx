import React from 'react'

const VerdictCounts = ({ result }) => {
   return (
    <div className="rounded-3xl border border-white/10 bg-white/2 p-6 sm:col-span-3">

      <div className="mb-5">
        <p className="text-sm font-semibold text-white">
          Качество выполнения
        </p>

      </div>

      <div className="flex flex-wrap gap-3">

        {Object.entries(result.verdict_counts).map(
          ([verdict, count]) => (
            <div
              key={verdict}
              className="rounded-2xl border border-white/10 bg-white/3 px-5 py-3"
            >
              <span className="text-sm text-slate-300">
                {verdict}
              </span>

              <span className="ml-3 font-semibold text-purple-400">
                {count}
              </span>
            </div>
          )
        )}

      </div>

    </div>
  )
}

export default VerdictCounts
