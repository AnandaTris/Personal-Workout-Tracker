import { useState } from 'react'
import { WORKOUT_DAYS } from '../data/workoutDays'
import { getCustomDays, deleteCustomDay, getHiddenDays, hideDay } from '../lib/storage'
import './Home.css'

export default function Home({ navigate }) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  const [hiddenDays, setHiddenDays] = useState(() => getHiddenDays())
  const [customDays, setCustomDays] = useState(() => getCustomDays())

  const visibleStaticDays = WORKOUT_DAYS.filter(d => !hiddenDays.includes(d.day))

  const customOverrides = Object.fromEntries(
    customDays
      .filter(d => ['A', 'B', 'C', 'D'].includes(d.day))
      .map(d => [d.day, d])
  )

  const trueCustomDays = customDays.filter(d => !['A', 'B', 'C', 'D'].includes(d.day))

  function handleRemoveStatic(e, day) {
    e.stopPropagation()
    if (!window.confirm(`Remove Day ${day} from your home screen?\n\nYour past sessions won't be deleted.`)) return
    hideDay(day)
    setHiddenDays(getHiddenDays())
  }

  function handleRemoveCustom(e, dayId, label) {
    e.stopPropagation()
    if (!window.confirm(`Delete "${label}"?\n\nYour past sessions won't be deleted.`)) return
    deleteCustomDay(dayId)
    setCustomDays(getCustomDays())
  }

  return (
    <div className="home">
      <header className="home-header">
        <h1 className="home-title">Workout Tracker</h1>
        <p className="home-date">{today}</p>
      </header>

      <main className="home-main">
        <p className="home-prompt">Select today's session</p>
        <div className="day-grid">

          {visibleStaticDays.map(({ day, label, exercises }) => {
            const override = customOverrides[day]
            const displayLabel = override?.label ?? label
            const editPayload = override ?? { day, label, exercises }
            return (
              <div key={day} className="day-static-wrap">
                <div className="day-card-inner">
                  <button
                    className="day-btn"
                    data-day={day}
                    onClick={() => navigate('log', { day })}
                  >
                    <span className="day-letter">Day {day}</span>
                    <span className="day-label">{displayLabel}</span>
                  </button>
                  <button
                    className="day-edit-btn"
                    onClick={e => { e.stopPropagation(); navigate('editDay', { existingDay: editPayload }) }}
                    aria-label={`Edit Day ${day}`}
                  >
                    ✎
                  </button>
                </div>
                <button
                  className="day-remove-strip"
                  onClick={e => handleRemoveStatic(e, day)}
                  aria-label={`Remove Day ${day}`}
                >
                  Remove
                </button>
              </div>
            )
          })}

          {trueCustomDays.map((customDay) => (
            <div key={customDay.day} className="day-static-wrap">
              <div className="day-card-inner">
                <button
                  className="day-btn day-btn--custom"
                  onClick={() => navigate('log', { day: customDay.day })}
                >
                  <span className="day-letter day-letter--custom">Custom</span>
                  <span className="day-label">{customDay.label}</span>
                </button>
                <button
                  className="day-edit-btn"
                  onClick={e => { e.stopPropagation(); navigate('editDay', { existingDay: customDay }) }}
                  aria-label="Edit day"
                >
                  ✎
                </button>
              </div>
              <button
                className="day-remove-strip"
                onClick={e => handleRemoveCustom(e, customDay.day, customDay.label)}
                aria-label={`Remove ${customDay.label}`}
              >
                Remove
              </button>
            </div>
          ))}

          <button
            className="day-btn day-btn--add"
            onClick={() => navigate('editDay', {})}
          >
            <span className="day-add-icon">+</span>
            <span className="day-label">New Day</span>
          </button>

        </div>
      </main>

      <nav className="home-nav">
        <button className="nav-btn" onClick={() => navigate('history')}>
          <span className="nav-icon">📋</span>
          History
        </button>
        <button className="nav-btn" onClick={() => navigate('progression')}>
          <span className="nav-icon">📈</span>
          Progression
        </button>
      </nav>
    </div>
  )
}
