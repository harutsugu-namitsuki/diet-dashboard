// common/index.js

export const DIET_CONSTANTS = {
  START_WEIGHT: 86.0,
  GOAL_WEIGHT: 75.0,
  TOTAL_DAYS: 92, // 3 months from 6/17
  START_DATE_STR: '2026-06-17',
  DAILY_MAINTENANCE_KCAL: 2805,
  DAILY_DEFICIT_TARGET: 743,
  KCAL_PER_KG: 7200
};

export const calculateDiffDays = (dateStr1, dateStr2) => {
  const d1 = new Date(dateStr1);
  const d2 = new Date(dateStr2);
  d1.setHours(0,0,0,0);
  d2.setHours(0,0,0,0);
  return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
};

export const formatDate = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const isMonOrThu = (dateStr) => {
  const day = new Date(dateStr).getDay();
  return day === 1 || day === 4;
};

export const getWeekRange = (dateStr) => {
  const d = new Date(dateStr);
  const day = d.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day; // 0 is Sunday
  
  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMonday);
  
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  
  return {
    monday: formatDate(monday),
    sunday: formatDate(sunday)
  };
};

export const WEEKLY_EXERCISE_TARGET = 800;
