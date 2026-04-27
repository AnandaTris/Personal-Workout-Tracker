export const WORKOUT_DAYS = [
  {
    day: 'A',
    label: 'Chest + Back',
    exercises: [
      { id: 'incline-smith-press',      name: 'Incline Smith Press',      sets: 2, repsTarget: '6-8',  type: 'compound' },
      { id: 'single-hand-seated-row',   name: 'Single-Hand Seated Row',   sets: 2, repsTarget: '6-8',    type: 'compound' },
      { id: 'low-to-high-cable-fly',    name: 'Low-to-High Cable Fly',    sets: 2, repsTarget: '10',   type: 'isolation' },
      { id: 't-bar-row',                name: 'T-Bar Row',                sets: 2, repsTarget: '6-8',    type: 'compound' },
      { id: 'lateral-raise',            name: 'Lateral Raise',            sets: 3, repsTarget: '12',   type: 'isolation' },
    ],
  },
  {
    day: 'B',
    label: 'Arms + Shoulders',
    exercises: [
      { id: 'shoulder-press',           name: 'Shoulder Press',           sets: 2, repsTarget: '6-8',    type: 'compound' },
      { id: 'lateral-raise',            name: 'Lateral Raise',            sets: 3, repsTarget: '12', type: 'isolation' },
      { id: 'rear-delt-fly',            name: 'Rear Delt Fly',            sets: 3, repsTarget: '12',   type: 'isolation' },
      { id: 'hammer-curl',              name: 'Hammer Curl',              sets: 2, repsTarget: '6-8',    type: 'isolation' },
      { id: 'bayesian-curl',            name: 'Bayesian Curl',            sets: 2, repsTarget: '6-8',   type: 'isolation' },
      { id: 'overhead-tricep-extension',name: 'Overhead Tricep Extension',sets: 2, repsTarget: '6-8',    type: 'isolation' },
      { id: 'single-hand-tricep-pushdown',          name: 'Tricep Pushdown',          sets: 2, repsTarget: '8-10',   type: 'isolation' },
    ],
  },
  {
    day: 'C',
    label: 'Chest + Back (version 2)',
    exercises: [
      { id: 'incline-dumbbell-press',   name: 'Incline Dumbbell Press',   sets: 2, repsTarget: '6-8',    type: 'compound' },
      { id: 'single-hand-lat-pulldown', name: 'Single-Hand Lat Pulldown', sets: 2, repsTarget: '6-8',    type: 'compound' },
      { id: 'pec-dec-fly',              name: 'Pec Dec Fly',              sets: 2, repsTarget: '6-8',   type: 'isolation' },
      { id: 't-bar-row',                name: 'T-Bar Row',                sets: 2, repsTarget: '6-8',    type: 'compound' },
      { id: 'rear-delt-fly',            name: 'Rear Delt Fly',            sets: 2, repsTarget: '12',   type: 'isolation' },
    ],
  },
  {
    day: 'D',
    label: 'Lower + Abs',
    exercises: [
      { id: 'leg-press',                name: 'Leg Press',                sets: 3, repsTarget: '6-8',    type: 'compound' },
      { id: 'romanian-deadlift',        name: 'Romanian Deadlift',        sets: 2, repsTarget: '6-8',    type: 'compound' },
      { id: 'walking-lunges',           name: 'Walking Lunges',           sets: 2, repsTarget: '10', type: 'compound' },
      { id: 'standing-calf-raise',      name: 'Standing Calf Raise',      sets: 3, repsTarget: '10',   type: 'isolation' },
      { id: 'hanging-leg-raise',        name: 'Hanging Leg Raise',        sets: 2, repsTarget: '10',   type: 'isolation'},
    ],
  },
]

export function getDayConfig(day) {
  return WORKOUT_DAYS.find(d => d.day === day)
}
