const SESSIONS_KEY = 'wt_sessions'
const EXERCISE_NAMES_KEY = 'wt_exercise_names'
const CUSTOM_DAYS_KEY = 'wt_custom_days'
const HIDDEN_DAYS_KEY = 'wt_hidden_days'

/**
 * Thrown when a value can't be persisted (storage full, disabled, or in a
 * private-browsing context that rejects writes). Callers can catch this to
 * tell the user their data wasn't saved instead of assuming it was.
 */
export class StorageWriteError extends Error {
  constructor(key, cause) {
    super(`Could not save "${key}"`)
    this.name = 'StorageWriteError'
    this.key = key
    this.cause = cause
  }
}

/**
 * Read and parse a JSON value from localStorage.
 *
 * If the stored value exists but can't be parsed, we do NOT silently pretend
 * it's empty — that used to let the next write overwrite unreadable-but-real
 * data, permanently destroying it. Instead we preserve the raw bytes under a
 * backup key (so they can be recovered) and only then fall back.
 */
function readJSON(key, fallback) {
  let raw
  try {
    raw = localStorage.getItem(key)
  } catch {
    // localStorage entirely unavailable (disabled/blocked) — degrade quietly.
    return fallback
  }
  if (raw == null) return fallback
  try {
    const parsed = JSON.parse(raw)
    return parsed ?? fallback
  } catch {
    quarantineCorruptValue(key, raw)
    return fallback
  }
}

/**
 * Preserve a corrupt raw value under a one-off backup key so it survives the
 * next write and can be recovered manually, rather than being obliterated.
 */
function quarantineCorruptValue(key, raw) {
  const backupKey = `${key}__corrupt_backup`
  try {
    if (localStorage.getItem(backupKey) == null) {
      localStorage.setItem(backupKey, raw)
    }
    console.error(
      `[storage] "${key}" was unreadable. Its raw value was preserved in ` +
      `"${backupKey}" so no history is lost permanently.`
    )
  } catch {
    // Even the backup failed (e.g. quota) — nothing safe left to do.
  }
}

/**
 * Persist a JSON value. Throws StorageWriteError on failure so the caller can
 * surface it instead of silently losing the write.
 */
function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    throw new StorageWriteError(key, err)
  }
}

/**
 * Ask the browser to keep this origin's storage from being evicted under
 * pressure. Mobile browsers (notably iOS Safari) will otherwise clear
 * localStorage for sites they consider inactive — a common cause of a PWA's
 * history "just disappearing". Best-effort; safe to call on every startup.
 */
export async function requestPersistentStorage() {
  try {
    if (!navigator.storage?.persist) return false
    if (await navigator.storage.persisted?.()) return true
    return await navigator.storage.persist()
  } catch {
    return false
  }
}

export function getExerciseNames() {
  const value = readJSON(EXERCISE_NAMES_KEY, {})
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {}
}

export function saveExerciseName(exerciseId, name) {
  const names = getExerciseNames()
  names[exerciseId] = name.trim()
  writeJSON(EXERCISE_NAMES_KEY, names)
}

export function getSessions() {
  const value = readJSON(SESSIONS_KEY, [])
  return Array.isArray(value) ? value : []
}

export function saveSession(session) {
  const sessions = getSessions()
  const existing = sessions.findIndex(s => s.id === session.id)
  if (existing !== -1) {
    sessions[existing] = session
  } else {
    sessions.push(session)
  }
  writeJSON(SESSIONS_KEY, sessions)
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

export function getCustomDays() {
  const value = readJSON(CUSTOM_DAYS_KEY, [])
  return Array.isArray(value) ? value : []
}

export function saveCustomDay(day) {
  const days = getCustomDays()
  const idx = days.findIndex(d => d.day === day.day)
  if (idx !== -1) {
    days[idx] = day
  } else {
    days.push(day)
  }
  writeJSON(CUSTOM_DAYS_KEY, days)
}

export function deleteCustomDay(dayId) {
  const days = getCustomDays().filter(d => d.day !== dayId)
  writeJSON(CUSTOM_DAYS_KEY, days)
}

export function getHiddenDays() {
  const value = readJSON(HIDDEN_DAYS_KEY, [])
  return Array.isArray(value) ? value : []
}

export function hideDay(dayId) {
  const hidden = getHiddenDays()
  if (!hidden.includes(dayId)) {
    hidden.push(dayId)
    writeJSON(HIDDEN_DAYS_KEY, hidden)
  }
}

export function deleteSession(sessionId) {
  const sessions = getSessions().filter(s => s.id !== sessionId)
  writeJSON(SESSIONS_KEY, sessions)
}
