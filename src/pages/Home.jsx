import { useState } from 'react'
import { WORKOUT_DAYS } from '../data/workoutDays'
import { getCustomDays, getHiddenDays, hideDay } from '../lib/storage'
import './Home.css'

export default function Home({ navigate }) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  const customDays = getCustomDays()
  const [hiddenDays, setHiddenDays] = useState(() => getHiddenDays())

  const visibleStaticDays = WORKOUT_DAYS.filter(d => !hiddenDays.includes(d.day))

  function handleDeleteStaticDay(e, day) {
    e.stopPropagation()
    if (!window.confirm(`Remove Day ${day} from your home screen?\n\nYour past sessions won't be deleted.`)) return
    hideDay(day)
    setHiddenDays(getHiddenDays())
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

          {visibleStaticDays.map(({ day, label }) => (
            <div key={day} className="day-static-wrap">
              <button
                className="day-btn"
                data-day={day}
                onClick={() => navigate('log', { day })}
              >
                <span className="day-letter">Day {day}</span>
                <span className="day-label">{label}</span>
              </button>
              <button
                className="day-remove-strip"
                onClick={e => handleDeleteStaticDay(e, day)}
                aria-label={`Remove Day ${day}`}
              >
                Remove
              </button>
            </div>
          ))}

          {customDays.map((customDay) => (
            <div key={customDay.day} className="day-btn-wrap">
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
