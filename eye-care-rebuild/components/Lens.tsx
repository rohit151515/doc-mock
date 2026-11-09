export default function Lens() {
  return (
    <svg className="lens" viewBox="0 0 520 520" aria-hidden="true">
      <circle cx="260" cy="260" r="237" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="260" cy="260" r="199" fill="none" stroke="currentColor" strokeWidth="1" />
      {Array.from({length: 72}, (_, n) => (
        <path key={n} d={n % 6 === 0 ? "M260 24v18" : "M260 24v6"}
          transform={`rotate(${n * 5} 260 260)`} stroke="currentColor" strokeWidth={n % 6 === 0 ? 2 : 1}/>
      ))}
    </svg>
  );
}
