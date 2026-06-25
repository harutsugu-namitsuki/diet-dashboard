import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import Target from 'lucide-react/dist/esm/icons/target';
import TrendingDown from 'lucide-react/dist/esm/icons/trending-down';
import Calendar from 'lucide-react/dist/esm/icons/calendar';
import Flame from 'lucide-react/dist/esm/icons/flame';
import Activity from 'lucide-react/dist/esm/icons/activity';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import Home from 'lucide-react/dist/esm/icons/home';
import Utensils from 'lucide-react/dist/esm/icons/utensils';
import User from 'lucide-react/dist/esm/icons/user';
import CheckCircle2 from 'lucide-react/dist/esm/icons/check-circle-2';
import BarChart2 from 'lucide-react/dist/esm/icons/bar-chart-2';
import { DIET_CONSTANTS, calculateDiffDays, formatDate, getWeekRange, isMonOrThu, WEEKLY_EXERCISE_TARGET } from 'common';
import './index.css';

const { START_WEIGHT, GOAL_WEIGHT, TOTAL_DAYS, START_DATE_STR, DAILY_MAINTENANCE_KCAL, DAILY_DEFICIT_TARGET, KCAL_PER_KG } = DIET_CONSTANTS;

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [records, setRecords] = useState([]);
  const [weightInput, setWeightInput] = useState('');
  const [dateInput, setDateInput] = useState(formatDate(new Date()));
  const [showConfetti, setShowConfetti] = useState(false);

  // Meal states
  const [mealRecords, setMealRecords] = useState({});
  const [mealDate, setMealDate] = useState(formatDate(new Date()));
  const [meals, setMeals] = useState({ morning: '', noon: '', evening: '' });

  // Exercise states
  const [exerciseRecords, setExerciseRecords] = useState({});
  const [dailyExercise, setDailyExercise] = useState(0);

  // Initialize data
  useEffect(() => {
    const stored = localStorage.getItem('diet_records_v2');
    if (stored) {
      setRecords(JSON.parse(stored));
    } else {
      const seed = [
        { date: '2026-06-17', weight: 86.0 }
      ];
      setRecords(seed);
      localStorage.setItem('diet_records_v2', JSON.stringify(seed));
    }

    const storedMeals = localStorage.getItem('diet_meals_v2');
    if (storedMeals) {
      setMealRecords(JSON.parse(storedMeals));
    }

    const storedExercise = localStorage.getItem('diet_exercise_v2');
    if (storedExercise) {
      setExerciseRecords(JSON.parse(storedExercise));
    }
  }, []);

  // Update current meals when mealDate changes
  useEffect(() => {
    if (mealRecords[mealDate]) {
      setMeals(mealRecords[mealDate]);
    } else {
      setMeals({ morning: '', noon: '', evening: '' });
    }

    if (exerciseRecords[mealDate]) {
      setDailyExercise(exerciseRecords[mealDate]);
    } else {
      setDailyExercise(0);
    }
  }, [mealDate, mealRecords, exerciseRecords]);

  const handleSaveWeight = (e) => {
    e.preventDefault();
    const w = parseFloat(weightInput);
    if (!w || isNaN(w)) return;

    const sorted = [...records].sort((a,b) => new Date(a.date) - new Date(b.date));
    if (sorted.length > 0) {
      const last = sorted[sorted.length - 1];
      if (w < last.weight && new Date(dateInput) >= new Date(last.date)) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }

    const newRecord = { date: dateInput, weight: w };
    const filtered = records.filter(r => r.date !== dateInput);
    const updated = [...filtered, newRecord].sort((a,b) => new Date(a.date) - new Date(b.date));
    
    setRecords(updated);
    localStorage.setItem('diet_records_v2', JSON.stringify(updated));
    setWeightInput('');
  };

  const handleDeleteWeight = (dateToDelete) => {
    if (window.confirm(`${dateToDelete} の記録を削除してもよろしいですか？`)) {
      const updated = records.filter(r => r.date !== dateToDelete).sort((a,b) => new Date(a.date) - new Date(b.date));
      setRecords(updated);
      localStorage.setItem('diet_records_v2', JSON.stringify(updated));
    }
  };

  const handleMealChange = (type, val) => {
    const newMeals = { ...meals, [type]: val };
    setMeals(newMeals);
    const updatedRecords = { ...mealRecords, [mealDate]: newMeals };
    setMealRecords(updatedRecords);
    localStorage.setItem('diet_meals_v2', JSON.stringify(updatedRecords));
  };

  const handleAddExercise = (kcal) => {
    const newVal = dailyExercise + kcal;
    setDailyExercise(newVal);
    const updated = { ...exerciseRecords, [mealDate]: newVal };
    setExerciseRecords(updated);
    localStorage.setItem('diet_exercise_v2', JSON.stringify(updated));
  };

  // Calculations for Home Tab
  const chartData = useMemo(() => {
    const data = [];
    const startDate = new Date(START_DATE_STR);
    const weightDropPerDay = (START_WEIGHT - GOAL_WEIGHT) / TOTAL_DAYS;

    for (let i = 0; i <= TOTAL_DAYS; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        const dateStr = formatDate(d);
        const targetWt = START_WEIGHT - (weightDropPerDay * i);
        const actualRecord = records.find(r => r.date === dateStr);

        data.push({
            date: dateStr,
            displayDate: `${d.getMonth()+1}/${d.getDate()}`,
            target: parseFloat(targetWt.toFixed(2)),
            actual: actualRecord ? actualRecord.weight : null
        });
    }
    return data;
  }, [records]);

  const sortedRecords = [...records].sort((a,b) => new Date(a.date) - new Date(b.date));
  const currentWeight = sortedRecords.length > 0 ? sortedRecords[sortedRecords.length - 1].weight : START_WEIGHT;
  const currentTotalLost = START_WEIGHT - currentWeight;

  const todayStr = formatDate(new Date());
  const todayObj = chartData.find(d => d.date === todayStr);
  const todaysTarget = todayObj ? todayObj.target : null;
  const isOffTrack = todaysTarget && currentWeight > todaysTarget;

  const daysPassed = calculateDiffDays(START_DATE_STR, todayStr);
  const daysRemaining = TOTAL_DAYS - daysPassed;

  // Calculations for Meal Tab
  const isWeekday = () => {
    const day = new Date(mealDate).getDay();
    return day >= 1 && day <= 5;
  };

  const weekRange = useMemo(() => getWeekRange(mealDate), [mealDate]);
  const weeklyExerciseTotal = useMemo(() => {
    let total = 0;
    let curr = new Date(weekRange.monday);
    const end = new Date(weekRange.sunday);
    while (curr <= end) {
      total += (exerciseRecords[formatDate(curr)] || 0);
      curr.setDate(curr.getDate() + 1);
    }
    return total;
  }, [weekRange, exerciseRecords]);

  const m = Number(meals.morning) || 0;
  const n = Number(meals.noon) || 0;
  const e = Number(meals.evening) || 0;
  const totalIntake = m + n + e;
  const deficit = DAILY_MAINTENANCE_KCAL + dailyExercise - totalIntake;
  const theoreticalDrop = (deficit / KCAL_PER_KG).toFixed(2);
  const intakeTarget = DAILY_MAINTENANCE_KCAL - DAILY_DEFICIT_TARGET + dailyExercise;
  const remainingKcal = Math.max(0, intakeTarget - totalIntake);

  const renderHomeTab = () => (
    <div className="content-area">
      <header className="header">
        <h1 className="text-gradient" style={{fontSize: '1.8rem'}}>DIET DASHBOARD</h1>
        <p style={{fontSize: '0.9rem'}}>行動を称賛し、明日への活力を生む</p>
      </header>

      <div className="glass-panel" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>
          <div className="kpi-title"><Activity size={14}/> 現在の体重</div>
          <div className="kpi-value" style={{fontSize: '2rem'}}>
            {currentWeight.toFixed(1)} <span className="kpi-unit">kg</span>
          </div>
          <div className={`kpi-trend ${currentTotalLost >= 0 ? 'positive' : 'negative'}`}>
            <TrendingDown size={14}/> {Math.abs(currentTotalLost).toFixed(1)}kg
          </div>
        </div>
        <div style={{textAlign: 'right'}}>
          <div className="kpi-title" style={{justifyContent: 'flex-end'}}><Target size={14}/> 残り</div>
          <div className="kpi-value" style={{fontSize: '1.5rem'}}>
            {Math.max(0, currentWeight - GOAL_WEIGHT).toFixed(1)} <span className="kpi-unit">kg</span>
          </div>
          <div className="kpi-trend neutral" style={{fontSize: '0.75rem'}}>目標: {GOAL_WEIGHT}kg</div>
        </div>
      </div>

      <div className="glass-panel kpi-card">
        <div className="kpi-title"><Flame size={16} color={isOffTrack ? "#ef4444" : "#10b981"}/> 本日の目標ライン</div>
        <div className="kpi-value" style={{ color: isOffTrack ? "var(--accent-red)" : "var(--accent-green)", fontSize: '1.8rem' }}>
          {todaysTarget ? todaysTarget.toFixed(1) : '-'} <span className="kpi-unit">kg</span>
        </div>
        <div className="kpi-trend neutral">
          {todaysTarget 
            ? (currentWeight <= todaysTarget ? "オンスケジュール！🔥" : `目標まであと ${(currentWeight - todaysTarget).toFixed(1)}kg`) 
            : "期間外"
            }
        </div>
      </div>

      <div className="glass-panel" style={{ height: '300px', padding: '16px 16px 24px 8px' }}>
        <h2 className="section-title" style={{fontSize: '1rem', marginLeft: '8px'}}><TrendingDown size={16}/> 進捗グラフ</h2>
        <ResponsiveContainer width="100%" height="85%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="displayDate" stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)', fontSize: 10}} />
            <YAxis domain={[70, 88]} stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)', fontSize: 10}} />
            <Tooltip contentStyle={{ backgroundColor: 'var(--panel-bg)', borderRadius: '8px', border: 'none', color: '#fff' }} />
            <ReferenceLine y={GOAL_WEIGHT} stroke="var(--accent-green)" strokeDasharray="3 3" />
            <Line type="monotone" dataKey="target" stroke="var(--accent-purple)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="actual" stroke="var(--accent-cyan)" strokeWidth={3} dot={{ r: 3, fill: 'var(--accent-cyan)', strokeWidth: 0 }} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-panel">
        <h2 className="section-title" style={{fontSize: '1rem'}}>体重を記録</h2>
        <form onSubmit={handleSaveWeight}>
          <div className="form-group" style={{marginBottom: '12px'}}>
            <input type="date" value={dateInput} onChange={(e) => setDateInput(e.target.value)} required />
          </div>
          <div className="form-group" style={{marginBottom: '12px'}}>
            <input type="number" step="0.1" placeholder="体重 (例: 82.2)" value={weightInput} onChange={(e) => setWeightInput(e.target.value)} required />
          </div>
          <button type="submit" className="primary-btn" style={{padding: '10px'}}>更新 🚀</button>
        </form>
      </div>
    </div>
  );

  const renderMealsTab = () => {
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
            {/* Simple SVG Ring */}
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
                width: `${Math.min(100, (weeklyExerciseTotal / WEEKLY_EXERCISE_TARGET) * 100)}%`, 
                background: weeklyExerciseTotal >= WEEKLY_EXERCISE_TARGET ? 'var(--accent-green)' : 'var(--accent-blue)',
                transition: 'width 0.5s'
              }}></div>
            </div>
          </div>
        </div>

      </div>
    );
  };

  const renderAnalyticsTab = () => {
    // Calculate averages
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const getStats = (daysBack) => {
      let sumIntake = 0;
      let sumDeficit = 0;
      let count = 0;
      for (let i = 0; i < daysBack; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
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
      return {
        avgIntake: Math.round(sumIntake / count),
        avgDeficit: Math.round(sumDeficit / count),
        count
      };
    };

    const weekly = getStats(7);
    const monthly = getStats(30);

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
          <p style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'right'}}>
            記録日数: {weekly.count}日 / 7日
          </p>
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
          <p style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'right'}}>
            記録日数: {monthly.count}日 / 30日
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      {activeTab === 'home' && renderHomeTab()}
      {activeTab === 'meals' && renderMealsTab()}
      {activeTab === 'analytics' && renderAnalyticsTab()}

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
          <Home size={24} />
          <span>ホーム</span>
        </button>
        <button className={`nav-item ${activeTab === 'meals' ? 'active' : ''}`} onClick={() => setActiveTab('meals')}>
          <Utensils size={24} />
          <span>食事記録</span>
        </button>
        <button className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
          <BarChart2 size={24} />
          <span>分析</span>
        </button>
        <button className={`nav-item`} onClick={() => alert('プロファイル/設定機能は準備中です')}>
          <User size={24} />
          <span>設定</span>
        </button>
      </nav>

      {showConfetti && (
        <div className="confetti-overlay" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <h1 style={{ fontSize: '3rem', color: 'var(--accent-green)', textShadow: '0 0 20px rgba(16,185,129,0.5)', animation: 'fadeInUp 0.5s ease-out' }}>
            NICE DROP! 🎉
          </h1>
        </div>
      )}
    </div>
  );
}

export default App;
