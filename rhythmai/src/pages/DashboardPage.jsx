import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { storage } from '../lib/storage.js'

const WEEKDAYS_AR = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']

export default function DashboardPage() {
  const [profile] = useState(() => storage.getProfile())
  const [plan] = useState(() => storage.getPlan())
  const [done, setDone] = useState(() => storage.getTasks())

  useEffect(() => {
    storage.setTasks(done)
  }, [done])

  const todayName = WEEKDAYS_AR[new Date().getDay()]
  const todayPlan = plan?.days?.find((d) => d.day === todayName)

  function toggle(task) {
    setDone((d) => (d.includes(task) ? d.filter((t) => t !== task) : [...d, task]))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          أهلاً {profile?.name ? `يا ${profile.name}` : ''} 👋
        </h1>
        <p className="text-ink/50 mt-1">اليوم {todayName}. لنر ما الذي يهمك اليوم.</p>
      </div>

      {!plan && (
        <div className="card p-6 text-center space-y-3">
          <p className="text-ink/60">لم تنشئ خطتك الأسبوعية بعد.</p>
          <Link to="/plan" className="btn-primary inline-flex">
            أنشئ خطتك الآن
          </Link>
        </div>
      )}

      {plan && !todayPlan && (
        <div className="card p-6 text-center text-ink/60">لا توجد مهام محددة لهذا اليوم في خطتك.</div>
      )}

      {todayPlan && (
        <div className="card p-6">
          <h2 className="font-semibold mb-4">مهام اليوم</h2>
          <ul className="space-y-2">
            {todayPlan.tasks.map((task) => (
              <li key={task}>
                <button
                  type="button"
                  onClick={() => toggle(task)}
                  className={`w-full text-right flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                    done.includes(task)
                      ? 'border-sage-200 bg-sage-50 text-ink/40 line-through'
                      : 'border-black/10 hover:bg-black/5'
                  }`}
                >
                  <span
                    className={`h-5 w-5 rounded-full border-2 flex-shrink-0 ${
                      done.includes(task) ? 'bg-sage-500 border-sage-500' : 'border-black/20'
                    }`}
                  />
                  {task}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-3">
        <Link to="/plan" className="btn-secondary flex-1 justify-center">
          عرض الخطة الأسبوعية
        </Link>
        <Link to="/research" className="btn-secondary flex-1 justify-center">
          اسألني شيئًا
        </Link>
      </div>
    </div>
  )
}
