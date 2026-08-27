import { useEffect, useState } from 'react'
import { db } from '../lib/db.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { dateFromKey } from '../lib/dates.js'
import { urgencyStatus, sortProjects } from '../lib/projects.js'

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

export default function WorkPage() {
  const { t, lang } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState([])
  const [title, setTitle] = useState('')
  const [deadline, setDeadline] = useState('')
  const [priority, setPriority] = useState('medium')

  useEffect(() => {
    let cancelled = false
    db.getProjects().then((p) => {
      if (!cancelled) {
        setProjects(p)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  function persist(next) {
    setProjects(next)
    db.setProjects(next).catch(() => {})
  }

  function addProject(e) {
    e.preventDefault()
    if (!title.trim()) return
    const project = {
      id: uid(),
      title: title.trim(),
      deadline: deadline || null,
      priority,
      tasks: [],
      createdAt: new Date().toISOString(),
    }
    persist([project, ...projects])
    setTitle('')
    setDeadline('')
    setPriority('medium')
  }

  function deleteProject(id) {
    if (!confirm(t('work.delete') + '?')) return
    persist(projects.filter((p) => p.id !== id))
  }

  function addTask(projectId, text) {
    if (!text.trim()) return
    persist(
      projects.map((p) =>
        p.id !== projectId ? p : { ...p, tasks: [...p.tasks, { id: uid(), text: text.trim(), done: false }] }
      )
    )
  }

  function toggleTask(projectId, taskId) {
    persist(
      projects.map((p) =>
        p.id !== projectId
          ? p
          : { ...p, tasks: p.tasks.map((tk) => (tk.id === taskId ? { ...tk, done: !tk.done } : tk)) }
      )
    )
  }

  function deleteTask(projectId, taskId) {
    persist(
      projects.map((p) => (p.id !== projectId ? p : { ...p, tasks: p.tasks.filter((tk) => tk.id !== taskId) }))
    )
  }

  const sorted = sortProjects(projects)

  if (loading) return <div className="text-center text-muted py-16">…</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold brand">{t('work.title')}</h1>
        <p className="text-muted mt-1 text-sm">{t('work.subtitle')}</p>
      </div>

      <form onSubmit={addProject} className="card p-5 space-y-3">
        <div>
          <label className="label">{t('work.projectTitleLabel')}</label>
          <input
            className="input"
            placeholder={t('work.projectTitlePlaceholder')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">{t('work.deadlineLabel')}</label>
            <input type="date" className="input" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </div>
          <div>
            <label className="label">{t('work.priorityLabel')}</label>
            <select className="input" value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="high">{t('work.priority.high')}</option>
              <option value="medium">{t('work.priority.medium')}</option>
              <option value="low">{t('work.priority.low')}</option>
            </select>
          </div>
        </div>
        <button type="submit" className="btn-primary" disabled={!title.trim()}>
          {t('work.addProject')}
        </button>
      </form>

      <div className="space-y-4">
        {sorted.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            t={t}
            lang={lang}
            onDelete={() => deleteProject(project.id)}
            onAddTask={(text) => addTask(project.id, text)}
            onToggleTask={(taskId) => toggleTask(project.id, taskId)}
            onDeleteTask={(taskId) => deleteTask(project.id, taskId)}
          />
        ))}
        {projects.length === 0 && <div className="text-center text-muted py-10">{t('work.empty')}</div>}
      </div>
    </div>
  )
}

function ProjectCard({ project, t, lang, onDelete, onAddTask, onToggleTask, onDeleteTask }) {
  const [newTask, setNewTask] = useState('')
  const status = urgencyStatus(project.deadline)
  const doneCount = project.tasks.filter((tk) => tk.done).length

  const formattedDeadline = project.deadline
    ? new Intl.DateTimeFormat(lang, { month: 'short', day: 'numeric' }).format(dateFromKey(project.deadline))
    : null

  const statusBadge = {
    overdue: { label: t('work.overdue'), cls: 'bg-warnSoft text-warn' },
    soon: { label: formattedDeadline, cls: 'bg-accentSoft text-accent' },
    normal: { label: formattedDeadline, cls: 'bg-surfaceMuted text-muted' },
    none: { label: t('work.noDeadline'), cls: 'bg-surfaceMuted text-muted' },
  }[status]

  const priorityCls =
    project.priority === 'high'
      ? 'bg-warnSoft text-warn'
      : project.priority === 'medium'
        ? 'bg-accentSoft text-accent'
        : 'bg-surfaceMuted text-muted'

  function submitTask(e) {
    e.preventDefault()
    onAddTask(newTask)
    setNewTask('')
  }

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold text-accent">{project.title}</h3>
        <button type="button" className="text-muted hover:text-warn text-sm" onClick={onDelete}>
          {t('work.delete')}
        </button>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className={`text-xs px-2 py-1 rounded-lg ${statusBadge.cls}`}>{statusBadge.label}</span>
        <span className={`text-xs px-2 py-1 rounded-lg ${priorityCls}`}>{t(`work.priority.${project.priority}`)}</span>
        {project.tasks.length > 0 && (
          <span className="text-xs text-muted ms-auto">
            {t('work.tasksDone', { done: doneCount, total: project.tasks.length })}
          </span>
        )}
      </div>

      {project.tasks.length > 0 && (
        <div className="h-1.5 rounded-full bg-accentSoft mb-3 overflow-hidden">
          <div
            className="h-full bg-accent transition-all"
            style={{ width: `${(doneCount / project.tasks.length) * 100}%` }}
          />
        </div>
      )}

      <ul className="space-y-2 mb-2">
        {project.tasks.map((tk) => (
          <li key={tk.id} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleTask(tk.id)}
              className={`flex-1 text-start flex items-center gap-3 rounded-xl border px-3 py-2 text-sm transition-colors ${
                tk.done ? 'border-accent/30 bg-accentSoft text-muted line-through' : 'border-border hover:bg-surfaceMuted'
              }`}
            >
              <span className={`h-4 w-4 rounded-full border-2 flex-shrink-0 ${tk.done ? 'bg-accent border-accent' : 'border-border'}`} />
              {tk.text}
            </button>
            <button type="button" className="text-muted hover:text-warn px-1" onClick={() => onDeleteTask(tk.id)} aria-label="Remove">
              ✕
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={submitTask} className="flex gap-2">
        <input className="input" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder={t('work.addTask')} />
        <button type="submit" className="btn-secondary whitespace-nowrap" disabled={!newTask.trim()}>
          {t('work.addTask')}
        </button>
      </form>
    </div>
  )
}
