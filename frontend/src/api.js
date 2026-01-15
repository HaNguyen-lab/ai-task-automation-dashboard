import axios from 'axios'

const API_BASE = 'https://ngha1024-ai-task-automation-dashboard.hf.space'

export async function suggestTasks(tasks) {
  const res = await axios.post(`${API_BASE}/suggest`, { tasks })
  return res.data
}

export async function automateTasks(tasks) {
  const res = await axios.post(`${API_BASE}/auto`, { tasks })
  return res.data
}
