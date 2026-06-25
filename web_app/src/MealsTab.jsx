import React from 'react';
import { Flame, Activity } from 'lucide-react';

export const MealsTab = ({ 
  mealDate, setMealDate, totalIntake, intakeTarget, remainingKcal, theoreticalDrop, deficit,
  meals, handleMealChange, isWeekday, 
  dailyExercise, handleAddExercise, exerciseRecords, setDailyExercise, setExerciseRecords, 
  weekRange, weeklyExerciseTotal, WEEKLY_EXERCISE_TARGET 
}) => {
  const pct = Math.min(100, Math.max(0, (totalIntake / intakeTarget) * 100));

  return (
    <div className="content-area">
      <header className="header" style={{marginBottom: '0'}}>
        <h1 className="text-gradient" style={{fontSize: '1.5rem'}}>CALORIE LOG</h1>
      </header>

      <div className="glass-panel" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px'}}>
        <input 
          type="date" 
          value={mealDate} 
          onChange={(e) => setMealDate(e.target.value)}
          style={{background: 'rgba(255,255,255,0.1)', border: 'none', fontSize: '1rem'}}
        />
      </div>

      <div className="glass-panel">
        <div className="balance-ring-container">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
            <circle 
              cx="80" cy="80" r="70" fill="none" 
              stroke={totalIntake > intakeTarget ? "var(--accent-red)" : "url(#grad)"} 
              strokeWidth="12" 
              strokeDasharray="439.8" 
              strokeDashoffset={439.8 - (439.8 * pct) / 100}
              strokeLinecap="round"
              transform="rotate(-90 80 80)"
              style={{transition: 'stroke-dashoffset 1s ease-out'}}
            />
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--accent-cyan)" />
                <stop offset="100%" stopColor="var(--accent-blue)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="balance-text">
            <span className="label">本日残り</span>
            <span className="value" style={{color: totalIntake > intakeTarget ? 'var(--accent-red)' : ''}}>
              {totalIntake > intakeTarget ? '0' : remainingKcal}
            </span>
            <span className="label">kcal</span>
          </div>
        </div>
        
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontSize: '0.85rem', color: 'var(--text-muted)'}}>
          <div>摂取: {totalIntake} kcal</div>
          <div>目標: {intakeTarget} kcal</div>
        </div>
      </div>

      <div className="glass-panel">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
          <div className="kpi-title"><Flame size={16} color="var(--accent-green)"/> 理論上の減量</div>
          <div className="kpi-value" style={{fontSize: '1.2rem', color: theoreticalDrop > 0 ? 'var(--accent-green)' : 'var(--accent-red)'}}>
            {theoreticalDrop > 0 ? '-' : '+'}{Math.abs(theoreticalDrop)} <span className="kpi-unit">kg</span>
          </div>
        </div>
        <p style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>
          本日のカロリー赤字 ({deficit} kcal) から計算。1kg = 7200kcalで換算。
        </p>
      </div>

      <div className="meal-card">
        <div className="meal-header">
          <span>🌅 朝食 (Morning)</span>
          {isWeekday() && (
            <button className="quick-btn recommended" onClick={() => handleMealChange('morning', '1000')}>
              平日定番 1000kcal
            </button>
          )}
        </div>
        <div className="meal-input-row">
          <input 
            type="number" 
            placeholder="0" 
            value={meals.morning} 
            onChange={(e) => handleMealChange('morning', e.target.value)} 
          />
          <span>kcal</span>
        </div>
      </div>

      <div className="meal-card">
        <div className="meal-header">
          <span>☀️ 昼食 (Noon)</span>
        </div>
        <div className="meal-input-row">
          <input 
            type="number" 
            placeholder="0" 
            value={meals.noon} 
            onChange={(e) => handleMealChange('noon', e.target.value)} 
          />
          <span>kcal</span>
        </div>
      </div>

      <div className="meal-card">
        <div className="meal-header">
          <span>🌙 夕食 (Evening)</span>
          <div style={{display: 'flex', gap: '8px'}}>
            <button className="quick-btn" onClick={() => handleMealChange('evening', '300')}>
              軽め 300kcal
            </button>
            <button className="quick-btn" onClick={() => handleMealChange('evening', '500')}>
              重め 500kcal
            </button>
          </div>
        </div>
        <div className="meal-input-row">
          <input 
            type="number" 
            placeholder="0" 
            value={meals.evening} 
            onChange={(e) => handleMealChange('evening', e.target.value)} 
          />
          <span>kcal</span>
        </div>
      </div>

      <div className="glass-panel" style={{marginTop: '16px'}}>
        <h2 className="section-title" style={{fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px'}}>
          <Activity size={16}/> 運動記録
        </h2>
        <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px'}}>
          <button className="quick-btn" style={{background: 'rgba(59, 130, 246, 0.2)'}} onClick={() => handleAddExercise(100)}>🏃 ラン 1km (+100)</button>
          <button className="quick-btn" style={{background: 'rgba(59, 130, 246, 0.2)'}} onClick={() => handleAddExercise(260)}>🏃 ラン 3km (+260)</button>
          <button className="quick-btn" style={{background: 'rgba(16, 185, 129, 0.2)'}} onClick={() => handleAddExercise(100)}>🤸 体操 (+100)</button>
          <button className="quick-btn" style={{background: 'rgba(245, 158, 11, 0.2)'}} onClick={() => handleAddExercise(300)}>⚽ サッカー (+300)</button>
        </div>
        
        <div className="meal-input-row" style={{marginBottom: '16px'}}>
          <span style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>本日の運動消費:</span>
          <input 
            type="number" 
            placeholder="0" 
            value={dailyExercise || ''} 
            onChange={(e) => {
              const val = Number(e.target.value) || 0;
              setDailyExercise(val);
              const updated = { ...exerciseRecords, [mealDate]: val };
              setExerciseRecords(updated);
              localStorage.setItem('diet_exercise_v2', JSON.stringify(updated));
            }} 
          />
          <span>kcal</span>
        </div>

        <div style={{borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px'}}>
            <span>今週の運動目標 ({weekRange.monday.substring(5)}〜)</span>
            <span>{weeklyExerciseTotal} / {WEEKLY_EXERCISE_TARGET} kcal</span>
          </div>
          <div style={{width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden'}}>
            <div style={{
              height: '100%', 
              width: \%, 
              background: weeklyExerciseTotal >= WEEKLY_EXERCISE_TARGET ? 'var(--accent-green)' : 'var(--accent-blue)',
              transition: 'width 0.5s'
            }}></div>
          </div>
        </div>
      </div>

    </div>
  );
};