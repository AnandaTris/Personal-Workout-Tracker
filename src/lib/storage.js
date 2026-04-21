const SESSIONS_KEY = 'wt_sessions'

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
