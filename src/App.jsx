import { useState } from 'react'
import Home from './pages/Home'
import LogWorkout from './pages/LogWorkout'
import History from './pages/History'
import Progression from './pages/Progression'
import EditDay from './pages/EditDay'

export default function App() {
  const [page, setPage] = useState({ name: 'home' })

  function navigate(name, params = {}) {
    setPage({ name, ...params })
  }

  if (page.name === 'log') return <LogWorkout day={page.day} navigate={navigate} />
  if (page.name === 'history') return <History navigate={navigate} />
  if (page.name === 'progression') return <Progression navigate={navigate} />
  if (page.name === 'editDay') return <EditDay existingDay={page.existingDay} navigate={navigate} />

  return <Home navigate={navigate} />
}
