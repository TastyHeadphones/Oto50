// LocalStorage utility functions for tracking mistakes and progress

const STORAGE_KEYS = {
  MISTAKES: 'oto50_mistakes',
  STATS: 'oto50_stats',
  PREFERENCES: 'oto50_preferences'
};

// Mistake tracking
export const getMistakes = () => {
  try {
    const mistakes = localStorage.getItem(STORAGE_KEYS.MISTAKES);
    return mistakes ? JSON.parse(mistakes) : {};
  } catch (error) {
    console.error('Error loading mistakes:', error);
    return {};
  }
};

export const addMistake = (kana) => {
  try {
    const mistakes = getMistakes();
    const key = `${kana.romaji}_${kana.hiragana}_${kana.katakana}`;
    
    if (!mistakes[key]) {
      mistakes[key] = {
        ...kana,
        count: 0,
        lastMistake: null
      };
    }
    
    mistakes[key].count += 1;
    mistakes[key].lastMistake = new Date().toISOString();
    
    localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(mistakes));
    return mistakes;
  } catch (error) {
    console.error('Error saving mistake:', error);
    return getMistakes();
  }
};

export const getMostMistakenKana = (limit = 10) => {
  const mistakes = getMistakes();
  return Object.values(mistakes)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

export const clearMistakes = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.MISTAKES);
    return true;
  } catch (error) {
    console.error('Error clearing mistakes:', error);
    return false;
  }
};

// Statistics tracking
export const getStats = () => {
  try {
    const stats = localStorage.getItem(STORAGE_KEYS.STATS);
    return stats ? JSON.parse(stats) : {
      totalAnswered: 0,
      correct: 0,
      incorrect: 0,
      streak: 0,
      bestStreak: 0,
      startDate: new Date().toISOString(),
      lastPlayedDate: null
    };
  } catch (error) {
    console.error('Error loading stats:', error);
    return {
      totalAnswered: 0,
      correct: 0,
      incorrect: 0,
      streak: 0,
      bestStreak: 0,
      startDate: new Date().toISOString(),
      lastPlayedDate: null
    };
  }
};

export const updateStats = (isCorrect) => {
  try {
    const stats = getStats();
    
    stats.totalAnswered += 1;
    stats.lastPlayedDate = new Date().toISOString();
    
    if (isCorrect) {
      stats.correct += 1;
      stats.streak += 1;
      if (stats.streak > stats.bestStreak) {
        stats.bestStreak = stats.streak;
      }
    } else {
      stats.incorrect += 1;
      stats.streak = 0;
    }
    
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    return stats;
  } catch (error) {
    console.error('Error updating stats:', error);
    return getStats();
  }
};

export const resetStats = () => {
  try {
    const newStats = {
      totalAnswered: 0,
      correct: 0,
      incorrect: 0,
      streak: 0,
      bestStreak: 0,
      startDate: new Date().toISOString(),
      lastPlayedDate: null
    };
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(newStats));
    return newStats;
  } catch (error) {
    console.error('Error resetting stats:', error);
    return getStats();
  }
};

// User preferences
export const getPreferences = () => {
  try {
    const prefs = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    return prefs ? JSON.parse(prefs) : {
      practiceTypes: ['清音', '濁音', '拗音'],
      kanaTypes: ['hiragana', 'katakana'],
      audioEnabled: true
    };
  } catch (error) {
    console.error('Error loading preferences:', error);
    return {
      practiceTypes: ['清音', '濁音', '拗音'],
      kanaTypes: ['hiragana', 'katakana'],
      audioEnabled: true
    };
  }
};

export const updatePreferences = (newPrefs) => {
  try {
    const currentPrefs = getPreferences();
    const updatedPrefs = { ...currentPrefs, ...newPrefs };
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updatedPrefs));
    return updatedPrefs;
  } catch (error) {
    console.error('Error updating preferences:', error);
    return getPreferences();
  }
};