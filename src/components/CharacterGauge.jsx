import { LINKEDIN_LIMIT, getZone } from '../utils/constants';

export default function CharacterGauge({ count }) {
  const zone = getZone(count);
  const pct = Math.min(count / LINKEDIN_LIMIT, 1) * 100;
  const overBy = count - LINKEDIN_LIMIT;

  // Ticks every 500 chars for a dashboard-instrumentation feel.
  const ticks = [500, 1000, 1500, 2000, 2500];

  return (
    <div className="gauge">
      <div className="gauge__readout">
        <span className="gauge__count" style={{ color: zone.color }}>
          {count.toLocaleString()}
        </span>
        <span className="gauge__limit">/ {LINKEDIN_LIMIT.toLocaleString()}</span>
        <span className="gauge__label" style={{ color: zone.color }}>
          {overBy > 0 ? `${overBy} over` : zone.label}
        </span>
      </div>
      <div className="gauge__track">
        <div
          className="gauge__fill"
          style={{ width: `${pct}%`, background: zone.color }}
        />
        {ticks.map((t) => (
          <div key={t} className="gauge__tick" style={{ left: `${(t / LINKEDIN_LIMIT) * 100}%` }} />
        ))}
      </div>
    </div>
  );
}
