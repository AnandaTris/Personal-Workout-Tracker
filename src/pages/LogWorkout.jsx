import { useState, useMemo } from 'react'
import { getDayConfig } from '../data/workoutDays'
import { getLastSetsForExercise, saveSession, createSessionId, getExerciseNames, getCustomDays } from '../lib/storage'
import ExerciseCard from '../components/ExerciseCard'
import './LogWorkout.css'

function initSets(exercise) {
  return Array.from({ length: exercise.sets }, () => ({ weight: '', reps: '' }))
}

export default function LogWorkout({ day, navigate }) {
  const dayConfig = getDayConfig(day) ?? getCustomDays().find(d => d.day === day)

  // Load last session data and custom names once on mount
  const lastSessions = useMemo(() =>
    Object.fromEntries(
      dayConfig.exercises.map(ex => [ex.id, getLastSetsForExercise(ex.id)])
    ),
    []
  )

  const customNames = useMemo(() => getExerciseNames(), [])

  // Merge custom names into exercise definitions
  const exercises = useMemo(() =>
    dayConfig.exercises.map(ex => ({
      ...ex,
      name: customNames[ex.id] ?? ex.name,
    })),
    []
  )

  const [sessionExercises, setSessionExercises] = useState(() =>
    dayConfig.exercises.map(ex => ({
      exerciseId: ex.id,
      sets: initSets(ex),
    }))
  )

  function hasAnyData() {
    return sessionExercises.some(ex =>
      ex.sets.some(s => s.weight !== '' || s.reps !== '')
    )
  }

  function goBack() {
    if (hasAnyData() && !window.confirm('Go back? Your logged sets will be lost.')) return
    navigate('home')
  }

  function updateSets(exerciseId, newSets) {
    setSessionExercises(prev =>
      prev.map(e => e.exerciseId === exerciseId ? { ...e, sets: newSets } : e)
    )
  }

  function finishWorkout() {
    const filledExercises = sessionExercises
      .map(ex => ({
        ...ex,
        sets: ex.sets
          .filter(s => s.weight !== '' || s.reps !== '')
          .map((s, i, arr) => ({
            weight: parseFloat(s.weight) || 0,
            reps: parseInt(s.reps) || 0,
            toFailure: i === arr.length - 1,
          })),
      }))
      .filter(ex => ex.sets.length > 0)

    if (filledExercises.length === 0) {
      if (window.confirm('No sets logged. Discard session?')) {
        navigate('home')
      }
      return
    }

    const session = {
      id: createSessionId(),
      day,
      date: new Date().toISOString().split('T')[0],
      exercises: filledExercises,
    }

    saveSession(session)
    navigate('home')
  }

  return (
    <div className="log-workout">
      <header className="log-header">
        <button className="log-back" onClick={goBack} aria-label="Back">
          ←
        </button>
        <div className="log-title">
          <span className="log-day-badge">{['A','B','C','D'].includes(day) ? `Day ${day}` : 'Custom'}</span>
          <span className="log-day-label">{dayConfig.label}</span>
        </div>
      </header>

      <main className="log-main">
        {exercises.map((exercise, i) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            lastSession={lastSessions[exercise.id]}
            sets={sessionExercises[i].sets}
            onSetsChange={newSets => updateSets(exercise.id, newSets)}
          />
        ))}

        <div className="log-spacer" />
      </main>

      <footer className="log-footer">
        <button className="finish-btn" onClick={finishWorkout}>
          Finish Workout
        </button>
      </footer>
    </div>
  )
}
