import React, { useState } from 'react'
import { suggestTasks, automateTasks } from './api'
import { marked } from 'marked'

export default function App() {
  const [tasks, setTasks] = useState([
    { title: 'Prepare report', urgency: 3, impact: 4, effort_hours: 1.5 },
    { title: 'Customer meeting', urgency: 5, impact: 5, effort_hours: 3 }
  ])
  const [mode, setMode] = useState('hybrid') // 'heuristic' | 'llm' | 'hybrid'
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const addTask = () => setTasks(t => [...t, { title: '', urgency: 3, impact: 3, effort_hours: 1 }])
  const updateTask = (i, key, value) =>
    setTasks(arr => arr.map((t, idx) => (idx === i ? { ...t, [key]: value } : t)))
  const removeTask = (i) => setTasks(arr => arr.filter((_, idx) => idx !== i))

  const runSuggest = async () => {
    setLoading(true); setError(''); setResult('')
    try {
      const out = await suggestTasks(tasks, mode)
      setResult(out.suggestion ?? JSON.stringify(out, null, 2))
    } catch (e) { setError(String(e)) } finally { setLoading(false) }
  }

  const runAutomate = async () => {
    setLoading(true); setError(''); setResult('')
    try {
      const out = await automateTasks(tasks, mode)
      setResult(out.result ?? JSON.stringify(out, null, 2))
    } catch (e) { setError(String(e)) } finally { setLoading(false) }
  }

  const copyToClipboard = async () => {
    try { await navigator.clipboard.writeText(result) } catch {}
  }

  const downloadTxt = () => {
    const blob = new Blob([result], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ai-suggestions.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container">
      <h1>AI Task Automation Dashboard</h1>

      <div className="controls">
        <label>
          <span className="label">Mode</span>
          <select value={mode} onChange={e => setMode(e.target.value)}>
            <option value="hybrid">Hybrid (LLM with heuristic fallback)</option>
            <option value="llm">LLM only</option>
            <option value="heuristic">Heuristic only</option>
          </select>
        </label>
      </div>

      {tasks.map((t, i) => (
        <fieldset key={i} className="task-row">
          <legend>Task {i + 1}</legend>

          <label className="field">
            <span className="label">Task name</span>
            <input
              aria-label="Task name"
              placeholder="e.g., Prepare Q1 deck"
              value={t.title}
              onChange={e => updateTask(i, 'title', e.target.value)}
            />
          </label>

          <label className="field">
            <span className="label">Urgency (1–5)</span>
            <input
              type="number"
              min="1" max="5"
              value={t.urgency}
              onChange={e => updateTask(i, 'urgency', Number(e.target.value))}
            />
          </label>

          <label className="field">
            <span className="label">Impact (1–5)</span>
            <input
              type="number"
              min="1" max="5"
              value={t.impact}
              onChange={e => updateTask(i, 'impact', Number(e.target.value))}
            />
          </label>

          <label className="field">
            <span className="label">Effort (hours)</span>
            <input
              type="number"
              step="0.5" min="0.1"
              value={t.effort_hours}
              onChange={e => updateTask(i, 'effort_hours', Number(e.target.value))}
            />
          </label>

          <button className="danger" onClick={() => removeTask(i)} aria-label={`Remove Task ${i+1}`}>🗑 Remove</button>
        </fieldset>
      ))}

      <div className="row-actions">
        <button onClick={addTask}>＋ Add Task</button>
      </div>

      <div className="actions">
        <button onClick={runSuggest} disabled={loading}>🔥 Suggest (Prioritize)</button>
        <button onClick={runAutomate} disabled={loading}>🤖 Automate</button>
      </div>

      {loading && <p>Working...</p>}
      {error && <p className="error">{error}</p>}

      {result && (
        <section className="output">
          <div className="output-header">
            <h2>Output</h2>
            <div className="output-tools">
              <button onClick={copyToClipboard} title="Copy to clipboard">Copy</button>
              <button onClick={downloadTxt} title="Download as .txt">Download</button>
            </div>
          </div>

          {/* Markdown rendering with marked */}
          <div
            className="output-md"
            dangerouslySetInnerHTML={{ __html: marked.parse(result) }}
          />
        </section>
      )}
    </div>
  )
}
