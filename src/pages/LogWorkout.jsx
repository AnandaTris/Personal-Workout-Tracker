import { useState, useMemo } from 'react'
import { getDayConfig } from '../data/workoutDays'
import {
  getLastSetsForExercise, saveSession, createSessionId, getExerciseNames, getCustomDays,
  getDraft, saveDraft, clearDraft,
} from '../lib/storage'
import ExerciseCard from '../components/ExerciseCard'
import './LogWorkout.css'

function initSets(exercise) {
  return Array.from({ length: exercise.sets }, () => ({ weight: '', reps: '' }))
}

export default function LogWorkout({ day, navigate }) {
  const dayConfig = getCustomDays().find(d => d.day === day) ?? getDayConfig(day)

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

  // Resume an unfinished workout for this day if one was saved
  const [draft] = useState(() => getDraft(day))
  const [startedDate] = useState(() =>
    draft?.startedDate ?? new Date().toISOString().split('T')[0]
  )

  const [sessionExercises, setSessionExercises] = useState(() =>
    dayConfig.exercises.map(ex => ({
      exerciseId: ex.id,
      sets: draft?.exercises.find(e => e.exerciseId === ex.id)?.sets ?? initSets(ex),
    }))
  )

  const [saveStatus, setSaveStatus] = useState(draft ? 'saved' : 'idle')

  function hasAnyData() {
    return sessionExercises.some(ex =>
      ex.sets.some(s => s.weight !== '' || s.reps !== '')
    )
  }

  function persistDraft(exercises = sessionExercises) {
    saveDraft(day, { startedDate, exercises })
  }

  function saveProgress() {
    try {
      persistDraft()
      setSaveStatus('saved')
    } catch {
      setSaveStatus('error')
      window.alert(
        "Couldn't save your progress — your device storage may be full or disabled."
      )
    }
  }

  function goBack() {
    if (hasAnyData()) {
      try {
        persistDraft()
      } catch {
        if (!window.confirm("Couldn't save your sets. Go back anyway and lose them?")) return
      }
    }
    navigate('home')
  }

  function discardWorkout() {
    if (!window.confirm('Discard this workout? All sets logged so far will be deleted.')) return
    clearDraft(day)
    navigate('home')
  }

  function updateSets(exerciseId, newSets) {
    const next = sessionExercises.map(e =>
      e.exerciseId === exerciseId ? { ...e, sets: newSets } : e
    )
    setSessionExercises(next)
    // Autosave every change so a reload never loses logged sets
    try {
      persistDraft(next)
      setSaveStatus('saved')
    } catch {
      setSaveStatus('error')
    }
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
        clearDraft(day)
        navigate('home')
      }
      return
    }

    const session = {
      id: createSessionId(),
      day,
      date: startedDate,
      exercises: filledExercises,
    }

    try {
      saveSession(session)
    } catch {
      window.alert(
        "Couldn't save this workout — your device storage may be full or " +
        'disabled. Nothing has been lost; please free up space and tap ' +
        'Finish Workout again.'
      )
      return
    }
    clearDraft(day)
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
        {(draft || hasAnyData()) && (
          <button className="log-discard" onClick={discardWorkout}>
            Discard
          </button>
        )}
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
        <button className="save-btn" onClick={saveProgress}>
          {saveStatus === 'saved' ? 'Saved ✓' : saveStatus === 'error' ? 'Retry Save' : 'Save'}
        </button>
        <button className="finish-btn" onClick={finishWorkout}>
          Finish Workout
        </button>
      </footer>
    </div>
  )
}
