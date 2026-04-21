import { useState } from 'react'
import { getSessions, getCustomDays, getExerciseNames } from '../lib/storage'
import { getDayConfig, WORKOUT_DAYS } from '../data/workoutDays'
import './History.css'

function resolveDayLabel(dayId, customDays) {
  if (['A', 'B', 'C', 'D'].includes(dayId)) {
    return getDayConfig(dayId)?.label ?? `Day ${dayId}`
  }
  return customDays.find(d => d.day === dayId)?.label ?? 'Custom Day'
}

function formatDate(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

export default function History({ navigate }) {
  const sessions = getSessions().slice().reverse()
  const customDays = getCustomDays()
  const customNames = getExerciseNames()
  const [expanded, setExpanded] = useState(null)

  function getExerciseName(exerciseId) {
    if (customNames[exerciseId]) return customNames[exerciseId]
    for (const day of [...WORKOUT_DAYS, ...customDays]) {
      const ex = day.exercises.find(e => e.id === exerciseId)
      if (ex) return ex.name
    }
    return exerciseId
  }

  function toggle(id) {
    setExpanded(prev => prev === id ? null : id)
  }

  return (
    <div className="history">
      <header className="history-header">
        <button className="history-back" onClick={() => navigate('home')} aria-label="Back">←</button>
        <h2 className="history-title">History</h2>
      </header>

      <main className="history-main">
        {sessions.length === 0 ? (
          <div className="history-empty">
            <p className="history-empty-icon">🏋️</p>
            <p className="history-empty-text">No sessions logged yet.</p>
            <p className="history-empty-sub">Finish a workout to see it here.</p>
          </div>
        ) : (
          sessions.map(session => {
            const isOpen = expanded === session.id
            const dayLabel = resolveDayLabel(session.day, customDays)
            const dayBadge = ['A', 'B', 'C', 'D'].includes(session.day)
              ? `Day ${session.day}`
              : 'Custom'

            return (
              <div key={session.id} className={`session-card ${isOpen ? 'session-card--open' : ''}`}>
                <button className="session-summary" onClick={() => toggle(session.id)}>
                  <div className="session-summary-left">
                    <span className="session-date">{formatDate(session.date)}</span>
                    <span className="session-day-label">
                      <span className="session-day-badge">{dayBadge}</span>
                      {dayLabel}
                    </span>
                    {!isOpen && (
                      <span className="session-exercises-preview">
                        {session.exercises.map(e => getExerciseName(e.exerciseId)).join(', ')}
                      </span>
                    )}
                  </div>
                  <span className="session-chevron">{isOpen ? '▲' : '▼'}</span>
                </button>

                {isOpen && (
                  <div className="session-detail">
                    {session.exercises.map(ex => (
                      <div key={ex.exerciseId} className="detail-exercise">
                        <h4 className="detail-exercise-name">{getExerciseName(ex.exerciseId)}</h4>
                        <div className="detail-sets">
                          {ex.sets.map((set, i) => (
                            <div key={i} className="detail-set-row">
                              <span className="detail-set-num">{i + 1}</span>
                              <span className="detail-set-weight">{set.weight} kg</span>
                              <span className="detail-set-sep">×</span>
                              <span className="detail-set-reps">{set.reps} reps</span>
                              {set.toFailure && <span className="detail-failure">F</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })
        )}
      </main>
    </div>
  )
}
