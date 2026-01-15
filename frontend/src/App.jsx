
import React, { useState } from 'react'
import { suggestTasks, automateTasks } from './api'

export default function App() {
  const [tasks, setTasks] = useState([
    { title: 'Prepare report', urgency: 3, impact: 4 },
    { title: 'Customer meeting', urgency: 5, impact: 5 }
  ])
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const addTask = () => setTasks([...tasks, { title: '', urgency: 3, impact: 3 }])
  const updateTask = (i, key, value) => {
    const newTasks = [...tasks]
    newTasks[i][key] = value
    setTasks(newTasks)
  }

  const runSuggest = async () => {
    setLoading(true)
    const out = await suggestTasks(tasks)
    setResult(out.suggestion)
    setLoading(false)
  }

  const runAutomate = async () => {
    setLoading(true)
    const out = await automateTasks(tasks)
    setResult(out.result)
    setLoading(false)
  }

  return (
    <div className="container">
      <h1>AI Task Automation Dashboard</h1>
      {tasks.map((t, i) => (
        <div key={i} className="task-row">
          <input value={t.title} onChange={e => updateTask(i, 'title', e.target.value)} placeholder="Task title" />
          <input type="number" value={t.urgency} onChange={e => updateTask(i, 'urgency', Number(e.target.value))} />
          <input type="number" value={t.impact} onChange={e => updateTask(i, 'impact', Number(e.target.value))} />
        </div>
      ))}
      <button onClick={addTask}>+ Add Task</button>
      <div className="actions">
        <button onClick={runSuggest} disabled={loading}>🔥 Suggest</button>
        <button onClick={runAutomate} disabled={loading}>🤖 Automate</button>
      </div>
      {loading && <p>Working...</p>}
      {result && <pre>{result}</pre>}
    </div>
  )
}
