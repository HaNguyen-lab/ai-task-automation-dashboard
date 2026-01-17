import axios from 'axios'

const API_BASE = 'https://ngha1024-ai-task-automation-dashboard.hf.space'

// optional: create a single axios instance with a default base URL
const http = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
})

export async function suggestTasks(tasks, mode = 'hybrid') {
  const res = await http.post(`/suggest`, { tasks }, { params: { mode } })
  return res.data
}

export async function automateTasks(tasks, mode = 'hybrid') {
  const res = await http.post(`/auto`, { tasks }, { params: { mode } })
  return res.data
}
