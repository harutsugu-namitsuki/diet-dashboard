import React from 'react';
import { Activity, TrendingDown, Target, Flame } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export const HomeTab = ({ currentWeight, currentTotalLost, GOAL_WEIGHT, todaysTarget, isOffTrack, chartData, dateInput, setDateInput, weightInput, setWeightInput, handleSaveWeight }) => {
  return (
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
          <div className={kpi-trend \}>
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
            ? (currentWeight <= todaysTarget ? "オンスケジュール！🔥" : 目標まであと \kg) 
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
};