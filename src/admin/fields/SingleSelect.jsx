export default function SingleSelect({ label, value, options=[], onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <select
        className="asb-input"
        value={value || ""}
        onChange={(e)=>onChange(e.target.value)}
      >
        <option value="">— Select —</option>
        {options.map((opt)=>(
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
