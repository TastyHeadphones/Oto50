import { useState, useEffect, useCallback } from 'react';
import { getRandomKana } from '../data/kanaData';
import { addMistake, updateStats, getStats } from '../utils/localStorage';
import { useJapaneseAudio } from '../hooks/useJapaneseAudio';

const Practice = () => {
  const [currentKana, setCurrentKana] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [stats, setStats] = useState(getStats());
  const [practiceMode, setPracticeMode] = useState('both'); // 'hiragana', 'katakana', 'both'
  const [kanaTypes, setKanaTypes] = useState(['清音', '濁音', '拗音']);
  
  const { speak, isSupported } = useJapaneseAudio();

  const loadNewKana = useCallback(() => {
    const newKana = getRandomKana(kanaTypes);
    if (newKana) {
      setCurrentKana(newKana);
      setShowAnswer(false);
    }
  }, [kanaTypes]);

  useEffect(() => {
    loadNewKana();
  }, [loadNewKana]);

  const handleAnswer = (isCorrect) => {
    if (!currentKana || showAnswer) return;

    const newStats = updateStats(isCorrect);
    setStats(newStats);

    if (!isCorrect) {
      addMistake(currentKana);
    }

    setShowAnswer(true);
    
    // Auto-advance to next question after 2 seconds
    setTimeout(() => {
      loadNewKana();
    }, 2000);
  };

  const playAudio = () => {
    if (currentKana && isSupported()) {
      speak(currentKana.hiragana);
    }
  };

  const toggleKanaType = (type) => {
    setKanaTypes(prev => {
      const newTypes = prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type];
      
      // Ensure at least one type is selected
      return newTypes.length > 0 ? newTypes : prev;
    });
  };

  if (!currentKana) {
    return (
      <div className="container">
        <div className="card">
          <p>問題を読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Stats Display */}
      <div className="card">
        <div className="stats">
          <div className="stat-item">
            <div className="stat-number">{stats.correct}</div>
            <div className="stat-label">正解</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.streak}</div>
            <div className="stat-label">連続</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{Math.round((stats.correct / Math.max(stats.totalAnswered, 1)) * 100)}%</div>
            <div className="stat-label">正解率</div>
          </div>
        </div>
      </div>

      {/* Practice Settings */}
      <div className="card">
        <h3>練習設定</h3>
        <div style={{ marginBottom: '16px' }}>
          <label>表示モード:</label>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
            <button
              className={practiceMode === 'hiragana' ? 'btn btn-primary' : 'btn btn-secondary'}
              onClick={() => setPracticeMode('hiragana')}
            >
              ひらがなのみ
            </button>
            <button
              className={practiceMode === 'katakana' ? 'btn btn-primary' : 'btn btn-secondary'}
              onClick={() => setPracticeMode('katakana')}
            >
              カタカナのみ
            </button>
            <button
              className={practiceMode === 'both' ? 'btn btn-primary' : 'btn btn-secondary'}
              onClick={() => setPracticeMode('both')}
            >
              両方
            </button>
          </div>
        </div>
        
        <div>
          <label>文字種類:</label>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
            {['清音', '濁音', '拗音'].map(type => (
              <button
                key={type}
                className={kanaTypes.includes(type) ? 'btn btn-primary' : 'btn btn-secondary'}
                onClick={() => toggleKanaType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Practice Card */}
      <div className="card practice-card">
        <div className="romaji">{currentKana.romaji}</div>
        
        <div className="kana-display">
          {showAnswer && (
            <>
              {(practiceMode === 'hiragana' || practiceMode === 'both') && (
                <div className="hiragana">{currentKana.hiragana}</div>
              )}
              {(practiceMode === 'katakana' || practiceMode === 'both') && (
                <div className="katakana">{currentKana.katakana}</div>
              )}
            </>
          )}
          {isSupported() && (
            <button className="audio-btn" onClick={playAudio} title="音声を再生">
              🔊
            </button>
          )}
        </div>

        {!showAnswer ? (
          <div className="answer-buttons">
            <button 
              className="btn btn-correct"
              onClick={() => handleAnswer(true)}
            >
              ✅
            </button>
            <button 
              className="btn btn-incorrect"
              onClick={() => handleAnswer(false)}
            >
              ❌
            </button>
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#666' }}>
            次の問題まで待機中...
          </div>
        )}
      </div>
    </div>
  );
};

export default Practice;