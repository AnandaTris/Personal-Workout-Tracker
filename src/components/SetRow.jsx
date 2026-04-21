import './SetRow.css'

export default function SetRow({ set, setNumber, isLastSet, onChange, onRemove, canRemove }) {
  return (
    <div className="set-row">
      <span className="set-number">{setNumber}</span>

      <div className="set-inputs">
        <input
          type="number"
          className="set-input"
          value={set.weight}
          onChange={e => onChange({ ...set, weight: e.target.value })}
          placeholder="0"
          inputMode="decimal"
          aria-label="Weight in kg"
        />
        <span className="set-unit">kg</span>
        <span className="set-sep">×</span>
        <input
          type="number"
          className="set-input"
          value={set.reps}
          onChange={e => onChange({ ...set, reps: e.target.value })}
          placeholder="0"
          inputMode="numeric"
          aria-label="Reps"
        />
        <span className="set-unit">reps</span>
      </div>

      {isLastSet && <span className="failure-tag">F</span>}

      {canRemove && (
        <button className="set-remove" onClick={onRemove} aria-label="Remove set">
          ×
        </button>
      )}
    </div>
  )
}
