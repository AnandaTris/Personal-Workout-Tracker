import { useState } from 'react'
import Home from './pages/Home'
import LogWorkout from './pages/LogWorkout'
import History from './pages/History'
import Progression from './pages/Progression'
import EditDay from './pages/EditDay'
import { getDayConfig } from './data/workoutDays'
import { getActiveDraftDay, getCustomDays } from './lib/storage'

// If the app reloaded mid-workout, reopen that workout instead of Home
function initialPage() {
  const day = getActiveDraftDay()
  const exists = day && (getCustomDays().some(d => d.day === day) || getDayConfig(day))
  return exists ? { name: 'log', day } : { name: 'home' }
}

export default function App() {
  const [page, setPage] = useState(initialPage)

  function navigate(name, params = {}) {
    setPage({ name, ...params })
  }

  if (page.name === 'log') return <LogWorkout day={page.day} navigate={navigate} />
  if (page.name === 'history') return <History navigate={navigate} />
  if (page.name === 'progression') return <Progression navigate={navigate} />
  if (page.name === 'editDay') return <EditDay existingDay={page.existingDay} navigate={navigate} />

  return <Home navigate={navigate} />
}
