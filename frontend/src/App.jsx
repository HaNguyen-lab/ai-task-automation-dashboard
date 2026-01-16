
import React, { useState } from 'react'
import { suggestTasks, automateTasks } from './api'

export default function App() {
  const [tasks, setTasks] = useState([
    { title: 'Prepare report', urgency: 3, impact: 4 },
    { title: 'Customer meeting', urgency: 5, impact: 5 }
  ])
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const addTask = () => setTasks(t => [...t, { title: '', urgency: 3, impact: 3 }])
  const updateTask = (i, key, value) =>
    setTasks(arr => arr.map((t, idx) => (idx === i ? { ...t, [key]: value } : t)))
  const removeTask = (i) => setTasks(arr => arr.filter((_, idx) => idx !== i))

  const runSuggest = async () => {
    setLoading(true); setError(''); setResult('')
    try {
      const out = await suggestTasks(tasks)
      setResult(out.suggestion ?? JSON.stringify(out, null, 2))
    } catch (e) { setError(String(e)) } finally { setLoading(false) }
  }

  const runAutomate = async () => {
    setLoading(true); setError(''); setResult('')
    try {
      const out = await automateTasks(tasks)
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
              aria-label="Urgency"
              min="1" max="5"
              value={t.urgency}
              onChange={e => updateTask(i, 'urgency', Number(e.target.value))}
            />
          </label>

          <label className="field">
            <span className="label">Impact (1–5)</span>
            <input
              type="number"
              aria-label="Impact"
              min="1" max="5"
              value={t.impact}
              onChange={e => updateTask(i, 'impact', Number(e.target.value))}
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
        <button onClick={runAutomate} disabled={loading}>🤖 Automate (LLM)</button>
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

          {/* Use <pre> with no max-height and allow scrolling, or a <textarea readOnly> */}
          <pre className="output-pre">{result}</pre>
        </section>
      )}
    </div>
  )
}
