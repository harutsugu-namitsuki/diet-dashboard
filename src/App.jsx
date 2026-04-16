import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Target, TrendingDown, Calendar, Flame, Activity, Trash2 } from 'lucide-react';
import './index.css';

// Constants based on the plan
const START_WEIGHT = 85.0;
const GOAL_WEIGHT = 73.1;
const TOTAL_DAYS = 84;
const START_DATE_STR = '2026-03-23';

const calculateDiffDays = (dateStr1, dateStr2) => {
  const d1 = new Date(dateStr1);
  const d2 = new Date(dateStr2);
  d1.setHours(0,0,0,0);
  d2.setHours(0,0,0,0);
  return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
};

const formatDate = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

function App() {
  const [records, setRecords] = useState([]);
  const [weightInput, setWeightInput] = useState('');
  const [dateInput, setDateInput] = useState(formatDate(new Date()));
  const [showConfetti, setShowConfetti] = useState(false);

  // Initialize data
  useEffect(() => {
    const stored = localStorage.getItem('diet_records');
    if (stored) {
      setRecords(JSON.parse(stored));
    } else {
      // Create initial seed data up to day 25
      const seed = [
        { date: '2026-03-23', weight: 85.0 },
        { date: '2026-04-16', weight: 82.2 } // User's stated data
      ];
      setRecords(seed);
      localStorage.setItem('diet_records', JSON.stringify(seed));
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    const w = parseFloat(weightInput);
    if (!w || isNaN(w)) return;

    // Check if yesterday was higher and we dropped weight today
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
    localStorage.setItem('diet_records', JSON.stringify(updated));
    setWeightInput('');
  };

  const handleDelete = (dateToDelete) => {
    if (window.confirm(`${dateToDelete} の記録を削除してもよろしいですか？`)) {
      const updated = records.filter(r => r.date !== dateToDelete).sort((a,b) => new Date(a.date) - new Date(b.date));
      setRecords(updated);
      localStorage.setItem('diet_records', JSON.stringify(updated));
    }
  };

  // Calculations
  const chartData = useMemo(() => {
    const data = [];
    const startDate = new Date(START_DATE_STR);
    const weightDropPerDay = (START_WEIGHT - GOAL_WEIGHT) / TOTAL_DAYS;

    // Build the 84-day array
    for (let i = 0; i <= TOTAL_DAYS; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        const dateStr = formatDate(d);
        const targetWt = START_WEIGHT - (weightDropPerDay * i);
        
        // Find if we have an actual record
        const actualRecord = records.find(r => r.date === dateStr);

        data.push({
            date: dateStr,
            displayDate: `${d.getMonth()+1}/${d.getDate()}`,
            target: parseFloat(targetWt.toFixed(2)),
            actual: actualRecord ? actualRecord.weight : null
        });
    }

    // Fill in gaps for "actual" conditionally so the line connects properly
    // Simple approach: Only show actual dots that exist, Recharts connects them (connectNulls)
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

  return (
    <div className="app-container">
      {/* Motivation Header */}
      <header className="header">
        <h1 className="text-gradient">NEON DIET DASHBOARD</h1>
        <p>行動を称賛し、明日への活力を生むコックピット</p>
      </header>

      {/* Hero KPIs */}
      <div className="kpi-grid">
        <div className="glass-panel kpi-card">
          <div className="kpi-title"><Activity size={16}/> 現在の体重</div>
          <div className="kpi-value">
            {currentWeight.toFixed(1)} <span className="kpi-unit">kg</span>
          </div>
          <div className={`kpi-trend ${currentTotalLost >= 0 ? 'positive' : 'negative'}`}>
            <TrendingDown size={14}/> {Math.abs(currentTotalLost).toFixed(1)}kg
          </div>
        </div>

        <div className="glass-panel kpi-card">
          <div className="kpi-title"><Target size={16}/> 目標まで残り</div>
          <div className="kpi-value">
            {Math.max(0, currentWeight - GOAL_WEIGHT).toFixed(1)} <span className="kpi-unit">kg</span>
          </div>
          <div className="kpi-trend neutral">目標: {GOAL_WEIGHT}kg</div>
        </div>

        <div className="glass-panel kpi-card">
          <div className="kpi-title"><Flame size={16} color={isOffTrack ? "#ef4444" : "#10b981"}/> 本日の目標ライン</div>
          <div className="kpi-value" style={{ color: isOffTrack ? "var(--accent-red)" : "var(--accent-green)" }}>
            {todaysTarget ? todaysTarget.toFixed(1) : '-'} <span className="kpi-unit">kg</span>
          </div>
          <div className="kpi-trend neutral">
            {todaysTarget 
              ? (currentWeight <= todaysTarget ? "オンスケジュール！🔥" : `目標まであと ${(currentWeight - todaysTarget).toFixed(1)}kg`) 
              : "期間外"
             }
          </div>
        </div>

        <div className="glass-panel kpi-card">
          <div className="kpi-title"><Calendar size={16}/> 残り日数</div>
          <div className="kpi-value">
            {Math.max(0, daysRemaining)} <span className="kpi-unit">日</span>
          </div>
          <div className="kpi-trend neutral">全{TOTAL_DAYS}日間 (現在{daysPassed}日目)</div>
        </div>
      </div>

      <div className="main-content">
        {/* Chart Area */}
        <div className="chart-section">
          <div className="glass-panel" style={{ height: '400px', padding: '16px 24px 24px' }}>
            <h2 className="section-title"><TrendingDown size={20}/> 進捗グラフ</h2>
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="displayDate" 
                  stroke="var(--text-muted)" 
                  tick={{fill: 'var(--text-muted)'}}
                  tickMargin={10}
                />
                <YAxis 
                  domain={[70, 88]} 
                  stroke="var(--text-muted)"
                  tick={{fill: 'var(--text-muted)'}}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--panel-bg)', borderRadius: '8px', border: 'none', backdropFilter: 'blur(10px)', color: '#fff' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <ReferenceLine y={GOAL_WEIGHT} stroke="var(--accent-green)" strokeDasharray="3 3" label={{ position: 'top', value: 'GOAL', fill: 'var(--accent-green)' }} />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="var(--accent-purple)" 
                  strokeWidth={2}
                  dot={false}
                  name="理想ライン" 
                />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="var(--accent-cyan)" 
                  strokeWidth={4}
                  dot={{ r: 4, fill: 'var(--accent-cyan)', strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                  connectNulls
                  name="実績体重" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Input Area & History */}
        <div className="input-section">
          <div className="glass-panel">
            <h2 className="section-title">記録する</h2>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>日付</label>
                <input 
                  type="date" 
                  value={dateInput} 
                  onChange={(e) => setDateInput(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>体重 (kg)</label>
                <input 
                  type="number" 
                  step="0.1" 
                  placeholder="例: 82.2" 
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="primary-btn">
                更新してぶち上げる！ 🚀
              </button>
            </form>
          </div>

          <div className="glass-panel" style={{ flexGrow: 1 }}>
            <h2 className="section-title">最近の履歴</h2>
            <div className="history-list">
              {[...records].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 5).map((r, i) => (
                <div key={i} className="history-item">
                  <div className="history-date">{r.date}</div>
                  <div className="history-weight text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {Number(r.weight).toFixed(1)} kg
                    <button 
                      onClick={() => handleDelete(r.date)} 
                      style={{ background: 'transparent', border: 'none', color: 'rgba(239, 68, 68, 0.7)', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-red)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(239, 68, 68, 0.7)'}
                      title="この記録を削除"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showConfetti && (
        <div className="confetti-overlay" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <h1 style={{ fontSize: '4rem', color: 'var(--accent-green)', textShadow: '0 0 20px rgba(16,185,129,0.5)', animation: 'fadeInUp 0.5s ease-out' }}>
            NICE DROP! 🎉
          </h1>
        </div>
      )}
    </div>
  );
}

export default App;
