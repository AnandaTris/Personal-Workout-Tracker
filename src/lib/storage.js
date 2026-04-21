const SESSIONS_KEY = 'wt_sessions'
const EXERCISE_NAMES_KEY = 'wt_exercise_names'

export function getExerciseNames() {
  try {
    return JSON.parse(localStorage.getItem(EXERCISE_NAMES_KEY)) ?? {}
  } catch {
    return {}
  }
}

export function saveExerciseName(exerciseId, name) {
  const names = getExerciseNames()
  names[exerciseId] = name.trim()
  localStorage.setItem(EXERCISE_NAMES_KEY, JSON.stringify(names))
}

export function getSessions() {
  try {
    return JSON.parse(localStorage.getItem(SESSIONS_KEY)) ?? []
  } catch {
    return []
  }
}

export function saveSession(session) {
  const sessions = getSessions()
  const existing = sessions.findIndex(s => s.id === session.id)
  if (existing !== -1) {
    sessions[existing] = session
  } else {
    sessions.push(session)
  }
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))
}

/**
 * Returns the sets array from the most recent session that includes exerciseId.
 * Searches across all days — Lateral Raise on Day A and Day B share history.
 */
export function getLastSetsForExercise(exerciseId) {
  const sessions = getSessions()
  // sessions are stored in insertion order (oldest first), so iterate in reverse
  for (let i = sessions.length - 1; i >= 0; i--) {
    const exercise = sessions[i].exercises.find(e => e.exerciseId === exerciseId)
    if (exercise && exercise.sets.length > 0) {
      return { sets: exercise.sets, date: sessions[i].date }
    }
  }
  return null
}

export function createSessionId() {
  return crypto.randomUUID ? crypto.randomUUID() : Date.now().toString()
}

const CUSTOM_DAYS_KEY = 'wt_custom_days'

export function getCustomDays() {
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_DAYS_KEY)) ?? []
  } catch {
    return []
  }
}

export function saveCustomDay(day) {
  const days = getCustomDays()
  const idx = days.findIndex(d => d.day === day.day)
  if (idx !== -1) {
    days[idx] = day
  } else {
    days.push(day)
  }
  localStorage.setItem(CUSTOM_DAYS_KEY, JSON.stringify(days))
}

export function deleteCustomDay(dayId) {
  const days = getCustomDays().filter(d => d.day !== dayId)
  localStorage.setItem(CUSTOM_DAYS_KEY, JSON.stringify(days))
}
