import { useState } from 'react'
import { saveCustomDay, deleteCustomDay } from '../lib/storage'
import './EditDay.css'

function newExercise() {
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString() + Math.random(),
    name: '',
    sets: 3,
    repsTarget: '8',
    type: 'compound',
    optional: false,
  }
}

export default function EditDay({ existingDay, navigate }) {
  const isNew = !existingDay
  const [label, setLabel] = useState(existingDay?.label ?? '')
  const [exercises, setExercises] = useState(
    existingDay?.exercises.map(ex => ({ ...ex })) ?? [newExercise()]
  )

  function updateExercise(index, updates) {
    setExercises(prev => prev.map((ex, i) => i === index ? { ...ex, ...updates } : ex))
  }

  function addExercise() {
    setExercises(prev => [...prev, newExercise()])
  }

  function removeExercise(index) {
    if (exercises.length <= 1) return
    setExercises(prev => prev.filter((_, i) => i !== index))
  }

  function moveExercise(index, direction) {
    const next = index + direction
    if (next < 0 || next >= exercises.length) return
    setExercises(prev => {
      const arr = [...prev]
      ;[arr[index], arr[next]] = [arr[next], arr[index]]
      return arr
    })
  }

  function save() {
    if (!label.trim()) return alert('Please enter a day name.')
    const validExercises = exercises.filter(ex => ex.name.trim())
    if (validExercises.length === 0) return alert('Add at least one exercise.')

    saveCustomDay({
      day: existingDay?.day ?? (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString()),
      label: label.trim(),
      exercises: validExercises.map(ex => ({
        ...ex,
        name: ex.name.trim(),
        sets: Math.max(1, parseInt(ex.sets) || 3),
      })),
    })
    navigate('home')
  }

  function handleDelete() {
    if (window.confirm(`Delete "${existingDay.label}"?\n\nPast sessions using this day won't be deleted.`)) {
      deleteCustomDay(existingDay.day)
      navigate('home')
    }
  }

  return (
    <div className="edit-day">
      <header className="edit-header">
        <button className="edit-back" onClick={() => navigate('home')} aria-label="Back">←</button>
        <h2 className="edit-title">{isNew ? 'New Day' : 'Edit Day'}</h2>
      </header>

      <main className="edit-main">
        <div className="field-group">
          <label className="field-label">Day Name</label>
          <input
            className="field-input"
            value={label}
            onChange={e => setLabel(e.target.value)}
            placeholder="e.g. PPL — Push Day"
          />
        </div>

        <div className="section-header">
          <span className="section-label">Exercises</span>
        </div>

        {exercises.map((ex, i) => (
          <div key={ex.id} className="ex-card">
            <div className="ex-card-top">
              <input
                className="field-input"
                value={ex.name}
                onChange={e => updateExercise(i, { name: e.target.value })}
                placeholder="Exercise name"
              />
              <div className="ex-card-actions">
                <button className="ex-reorder-btn" onClick={() => moveExercise(i, -1)} disabled={i === 0}>↑</button>
                <button className="ex-reorder-btn" onClick={() => moveExercise(i, 1)} disabled={i === exercises.length - 1}>↓</button>
                {exercises.length > 1 && (
                  <button className="ex-remove-btn" onClick={() => removeExercise(i)} aria-label="Remove">×</button>
                )}
              </div>
            </div>

            <div className="ex-card-fields">
              <div className="ex-field">
                <label className="ex-field-label">Sets</label>
                <input
                  type="number"
                  className="ex-field-input"
                  value={ex.sets}
                  onChange={e => updateExercise(i, { sets: e.target.value })}
                  inputMode="numeric"
                  min="1"
                />
              </div>
              <div className="ex-field">
                <label className="ex-field-label">Reps</label>
                <input
                  className="ex-field-input"
                  value={ex.repsTarget}
                  onChange={e => updateExercise(i, { repsTarget: e.target.value })}
                  placeholder="8"
                />
              </div>
              <div className="ex-field ex-field--type">
                <label className="ex-field-label">Type</label>
                <select
                  className="ex-field-select"
                  value={ex.type}
                  onChange={e => updateExercise(i, { type: e.target.value })}
                >
                  <option value="compound">Compound</option>
                  <option value="isolation">Isolation</option>
                </select>
              </div>
            </div>
          </div>
        ))}

        <button className="add-ex-btn" onClick={addExercise}>+ Add exercise</button>

        {!isNew && (
          <button className="delete-day-btn" onClick={handleDelete}>Delete Day</button>
        )}
      </main>

      <footer className="edit-footer">
        <button className="save-btn" onClick={save}>
          {isNew ? 'Create Day' : 'Save Changes'}
        </button>
      </footer>
    </div>
  )
}
