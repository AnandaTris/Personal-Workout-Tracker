import { useState, useMemo } from 'react'
import { getSessions, getCustomDays, getExerciseNames } from '../lib/storage'
import { WORKOUT_DAYS } from '../data/workoutDays'
import './Progression.css'

function formatDate(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric',
  })
}

function bestSet(sets) {
  return sets.reduce((best, s) => (s.weight > best.weight ? s : best), sets[0])
}

export default function Progression({ navigate }) {
  const customDays = getCustomDays()
  const customNames = getExerciseNames()

  // Build a deduplicated list of all exercises across all days
  const allExercises = useMemo(() => {
    const seen = new Set()
    const result = []
    for (const day of [...WORKOUT_DAYS, ...customDays]) {
      for (const ex of day.exercises) {
        if (!seen.has(ex.id)) {
          seen.add(ex.id)
          result.push({
            id: ex.id,
            name: customNames[ex.id] ?? ex.name,
            dayLabel: day.label,
          })
        }
      }
    }
    return result.sort((a, b) => a.name.localeCompare(b.name))
  }, [])

  const [selectedId, setSelectedId] = useState(allExercises[0]?.id ?? '')

  // Sessions that include the selected exercise, newest first
  const history = useMemo(() => {
    if (!selectedId) return []
    return getSessions()
      .filter(s => s.exercises.some(e => e.exerciseId === selectedId))
      .map(s => {
        const ex = s.exercises.find(e => e.exerciseId === selectedId)
        return { date: s.date, sets: ex.sets, best: bestSet(ex.sets) }
      })
      .reverse()
  }, [selectedId])

  const selectedExercise = allExercises.find(e => e.id === selectedId)

  return (
    <div className="progression">
      <header className="progression-header">
        <button className="progression-back" onClick={() => navigate('home')} aria-label="Back">←</button>
        <h2 className="progression-title">Progression</h2>
      </header>

      <div className="progression-selector">
        <label className="selector-label">Exercise</label>
        <select
          className="selector-select"
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
        >
          {allExercises.map(ex => (
            <option key={ex.id} value={ex.id}>{ex.name}</option>
          ))}
        </select>
      </div>

      <main className="progression-main">
        {allExercises.length === 0 ? (
          <div className="progression-empty">
            <p>No exercises found.</p>
          </div>
        ) : history.length === 0 ? (
          <div className="progression-empty">
            <p className="progression-empty-icon">📉</p>
            <p className="progression-empty-text">No data yet for</p>
            <p className="progression-empty-name">{selectedExercise?.name}</p>
            <p className="progression-empty-sub">Log a session to start tracking.</p>
          </div>
        ) : (
          <>
            <div className="prog-table-header">
              <span>Date</span>
              <span>Best set</span>
              <span>All sets</span>
            </div>
            {history.map((entry, i) => (
              <div key={i} className="prog-row">
                <span className="prog-date">{formatDate(entry.date)}</span>
                <span className="prog-best">
                  {entry.best.weight}kg × {entry.best.reps}
                </span>
                <span className="prog-sets">
                  {entry.sets.map((s, j) => (
                    <span key={j} className="prog-set-chip">
                      {s.weight}×{s.reps}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </>
        )}
      </main>
    </div>
  )
}
