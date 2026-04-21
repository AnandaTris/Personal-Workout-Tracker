import { WORKOUT_DAYS } from '../data/workoutDays'
import { getCustomDays } from '../lib/storage'
import './Home.css'

export default function Home({ navigate }) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  const customDays = getCustomDays()

  return (
    <div className="home">
      <header className="home-header">
        <h1 className="home-title">Workout Tracker</h1>
        <p className="home-date">{today}</p>
      </header>

      <main className="home-main">
        <p className="home-prompt">Select today's session</p>
        <div className="day-grid">
          {WORKOUT_DAYS.map(({ day, label }) => (
            <button
              key={day}
              className="day-btn"
              onClick={() => navigate('log', { day })}
            >
              <span className="day-letter">Day {day}</span>
              <span className="day-label">{label}</span>
            </button>
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
