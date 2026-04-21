import { useState } from 'react'
import SetRow from './SetRow'
import { saveExerciseName } from '../lib/storage'
import './ExerciseCard.css'

function formatDate(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric',
  })
}

export default function ExerciseCard({ exercise, lastSession, sets, onSetsChange }) {
  const [displayName, setDisplayName] = useState(exercise.name)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(exercise.name)

  function startEdit() {
    setDraft(displayName)
    setEditing(true)
  }

  function commitEdit() {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== displayName) {
      setDisplayName(trimmed)
      saveExerciseName(exercise.id, trimmed)
    }
    setEditing(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') e.target.blur()
    if (e.key === 'Escape') setEditing(false)
  }

  function updateSet(index, newSet) {
    onSetsChange(sets.map((s, i) => (i === index ? newSet : s)))
  }

  function addSet() {
    const last = sets[sets.length - 1]
    onSetsChange([...sets, { weight: last?.weight ?? '', reps: '' }])
  }

  function removeSet(index) {
    if (sets.length <= 1) return
    onSetsChange(sets.filter((_, i) => i !== index))
  }

  return (
    <div className="exercise-card">
      <div className="exercise-header">
        <div className="exercise-name-row">
          {editing ? (
            <input
              className="exercise-name-input"
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          ) : (
            <h3 className="exercise-name" onClick={startEdit}>
              {displayName}
              {exercise.optional && <span className="optional-tag">optional</span>}
              <span className="edit-hint">✎</span>
            </h3>
          )}
        </div>
        <span className="exercise-meta">
          {exercise.sets} × {exercise.repsTarget} &middot; {exercise.type}
        </span>
      </div>

      {lastSession ? (
        <div className="last-session">
          <span className="last-label">Last · {formatDate(lastSession.date)}</span>
          <span className="last-sets">
            {lastSession.sets.map((s, i) => (
              <span key={i}>
                {s.weight}kg×{s.reps}
                {i < lastSession.sets.length - 1 && <span className="last-sep">, </span>}
              </span>
            ))}
          </span>
        </div>
      ) : (
        <div className="last-session last-session--empty">
          <span className="last-label">No previous data</span>
        </div>
      )}

      <div className="sets-list">
        {sets.map((set, i) => (
          <SetRow
            key={i}
            set={set}
            setNumber={i + 1}
            isLastSet={i === sets.length - 1}
            onChange={newSet => updateSet(i, newSet)}
            onRemove={() => removeSet(i)}
            canRemove={sets.length > 1}
          />
        ))}
      </div>

      <button className="add-set-btn" onClick={addSet}>
        + Add set
      </button>
    </div>
  )
}
