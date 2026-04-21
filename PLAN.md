# Personal Workout Tracker — Build Plan

## Stack

- **React + Vite** — component-based UI, fast dev server, simple build
- **vite-plugin-pwa** — service worker + manifest, enables "Add to Home Screen" + offline
- **localStorage** — all data stored client-side, no backend
- **CSS Modules or plain CSS** — no UI library (keeps bundle small, full control over mobile layout)

---

## Data Model

```ts
interface LoggedSet {
  weight: number;     // kg
  reps: number;
  toFailure: boolean; // true for the last set of each exercise
}

interface SessionExercise {
  exerciseId: string; // e.g. "incline-smith-press"
  sets: LoggedSet[];
}

interface WorkoutSession {
  id: string;         // crypto.randomUUID() or Date.now().toString()
  day: "A" | "B" | "C" | "D";
  date: string;       // ISO 8601, e.g. "2026-04-21"
  exercises: SessionExercise[];
}
```

### localStorage keys

| Key | Value |
|-----|-------|
| `wt_sessions` | `WorkoutSession[]` (append-only, sorted by date) |

### Static config (not stored, bundled in code)

```ts
interface ExerciseDefinition {
  id: string;
  name: string;
  sets: number;
  repsTarget: string; // e.g. "6-8" or "10"
  type: "compound" | "isolation"; // drives rest timer labels later
}

interface DayDefinition {
  day: "A" | "B" | "C" | "D";
  label: string;
  exercises: ExerciseDefinition[];
}
```

---

## Feature Build Order

### 1. Project Setup
- [ ] Scaffold with `npm create vite@latest` (React + JS or TS)
- [ ] Install `vite-plugin-pwa`
- [ ] Set up folder structure
- [ ] Basic mobile viewport meta, root CSS reset

### 2. Data Layer
- [ ] `src/data/workoutDays.js` — static config for all 4 days
- [ ] `src/lib/storage.js` — thin wrappers: `getSessions()`, `saveSession()`, `getLastSetForExercise(exerciseId)`
- [ ] `getLastSetForExercise` queries all sessions, finds most recent entry for that exerciseId

### 3. Home Screen — Select a Day
- [ ] Four buttons: Day A / Day B / Day C / Day D
- [ ] Each shows the day label (e.g. "Upper — Chest + Back")
- [ ] Tap → navigate to Log Workout screen

### 4. Log Workout Screen (core feature)
- [ ] Shows exercises for selected day in order
- [ ] For each exercise:
  - Name + target sets × reps range
  - **Last session reference** — pulled via `getLastSetForExercise`, shown as "Last: 60kg × 8, 60kg × 8, 62.5kg × 6"
  - Set rows: weight input + reps input, one row per set
  - "Add set" button if they want an extra set
  - Last set marked with a "to failure" indicator
- [ ] "Finish Workout" button → saves session to localStorage, returns to home

### 5. Session History View
- [ ] List of past sessions, newest first
- [ ] Each entry: date + day label + exercise names
- [ ] Tap to expand → see all sets logged for that session

### 6. Progression View
- [ ] Select an exercise from a list
- [ ] Shows history: date → top set weight for that exercise
- [ ] Display as a simple list (date | weight | reps) — graph can come later

### 7. PWA Finalization
- [ ] `vite-plugin-pwa` config: name, short_name, icons, theme color
- [ ] Offline fallback page
- [ ] Test "Add to Home Screen" on iOS Safari and Android Chrome

---

## Folder Structure

```
src/
  data/
    workoutDays.js      # static 4-day split config
  lib/
    storage.js          # localStorage read/write helpers
  components/
    SetRow.jsx          # weight + reps inputs for one set
    ExerciseCard.jsx    # exercise name, last session, set rows
  pages/
    Home.jsx            # day selector
    LogWorkout.jsx      # active session logging
    History.jsx         # past sessions
    Progression.jsx     # per-exercise progress
  App.jsx
  main.jsx
```

---

## Design Principles

- **Mobile-first** — touch targets min 44px, large number inputs, no hover-dependent UI
- **Speed** — open app → start logging in 2 taps
- **Last session always visible** — this is the primary motivator, never hidden behind a tap

---

## Nice-to-Haves (post-MVP)

- Rest timer (auto-start after logging a set)
- Notes field per exercise
- Body weight tracking
- Export sessions as CSV
- Graph view for progression (e.g. Recharts)

---

## Commit Checkpoints

Commit after each completed section above. Suggested tags:
1. `feat: project setup`
2. `feat: data layer`
3. `feat: home screen`
4. `feat: log workout screen`
5. `feat: session history`
6. `feat: progression view`
7. `feat: pwa config`
