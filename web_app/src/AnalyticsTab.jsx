import React from 'react';
import { formatDate, DIET_CONSTANTS } from 'common';
const { DAILY_MAINTENANCE_KCAL } = DIET_CONSTANTS;
export const AnalyticsTab = ({ mealRecords, exerciseRecords }) => {
  const today = new Date();
  today.setHours(0,0,0,0);
  const getStats = (daysBack) => {
    let sumIntake = 0; let sumDeficit = 0; let count = 0;
    for (let i = 0; i < daysBack; i++) {
      const d = new Date(today); d.setDate(d.getDate() - i);
      const dateStr = formatDate(d);
      if (mealRecords[dateStr] || exerciseRecords[dateStr]) {
        const m = Number(mealRecords[dateStr]?.morning) || 0;
        const n = Number(mealRecords[dateStr]?.noon) || 0;
        const ev = Number(mealRecords[dateStr]?.evening) || 0;
        const ex = Number(exerciseRecords[dateStr]) || 0;
        const intake = m + n + ev;
        sumIntake += intake;
        sumDeficit += (DAILY_MAINTENANCE_KCAL + ex - intake);
        count++;
      }
    }
    if (count === 0) return { avgIntake: 0, avgDeficit: 0, count: 0 };
    return { avgIntake: Math.round(sumIntake / count), avgDeficit: Math.round(sumDeficit / count), count };
  };
  const weekly = getStats(7); const monthly = getStats(30);
  return (
    <div className="content-area">
      <header className="header">
        <h1 className="text-gradient" style={{fontSize: '1.5rem'}}>ANALYTICS</h1>
        <p style={{fontSize: '0.9rem'}}>週・月単位のサマリー</p>
      </header>
      <div className="glass-panel">
        <h2 className="section-title" style={{fontSize: '1rem'}}>直近 7日間 (Weekly)</h2>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '16px'}}>
          <div>
            <div className="kpi-title">平均摂取カロリー</div>
            <div className="kpi-value" style={{fontSize: '1.5rem'}}>{weekly.avgIntake} <span className="kpi-unit">kcal</span></div>
          </div>
          <div style={{textAlign: 'right'}}>
            <div className="kpi-title" style={{justifyContent: 'flex-end'}}>平均カロリー赤字</div>
            <div className="kpi-value" style={{fontSize: '1.5rem', color: weekly.avgDeficit > 0 ? 'var(--accent-green)' : 'var(--accent-red)'}}>
              {weekly.avgDeficit > 0 ? '+' : ''}{weekly.avgDeficit} <span className="kpi-unit">kcal</span>
            </div>
          </div>
        </div>
        <p style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'right'}}>記録日数: {weekly.count}日 / 7日</p>
      </div>
      <div className="glass-panel">
        <h2 className="section-title" style={{fontSize: '1rem'}}>直近 30日間 (Monthly)</h2>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '16px'}}>
          <div>
            <div className="kpi-title">平均摂取カロリー</div>
            <div className="kpi-value" style={{fontSize: '1.5rem'}}>{monthly.avgIntake} <span className="kpi-unit">kcal</span></div>
          </div>
          <div style={{textAlign: 'right'}}>
            <div className="kpi-title" style={{justifyContent: 'flex-end'}}>平均カロリー赤字</div>
            <div className="kpi-value" style={{fontSize: '1.5rem', color: monthly.avgDeficit > 0 ? 'var(--accent-green)' : 'var(--accent-red)'}}>
              {monthly.avgDeficit > 0 ? '+' : ''}{monthly.avgDeficit} <span className="kpi-unit">kcal</span>
            </div>
          </div>
        </div>
        <p style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'right'}}>記録日数: {monthly.count}日 / 30日</p>
      </div>
    </div>
  );
};
