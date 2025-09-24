import { useState, useEffect } from 'react';
import { getMostMistakenKana, clearMistakes, getStats } from '../utils/localStorage';
import { useJapaneseAudio } from '../hooks/useJapaneseAudio';

const ErrorReview = () => {
  const [mistakes, setMistakes] = useState([]);
  const [stats, setStats] = useState(getStats());
  
  const { speak, isSupported } = useJapaneseAudio();

  useEffect(() => {
    loadMistakes();
    setStats(getStats());
  }, []);

  const loadMistakes = () => {
    const mistakeList = getMostMistakenKana(20);
    setMistakes(mistakeList);
  };

  const handleClearMistakes = () => {
    if (window.confirm('すべてのエラー記録を削除しますか？')) {
      clearMistakes();
      loadMistakes();
    }
  };

  const playKanaAudio = (kana) => {
    if (isSupported()) {
      speak(kana.hiragana);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '不明';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '今日';
    if (diffDays === 1) return '昨日';
    if (diffDays < 7) return `${diffDays}日前`;
    
    return date.toLocaleDateString('ja-JP');
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '16px' }}>
          復習ページ
        </h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>
          間違えやすい文字を復習しましょう
        </p>
        
        <div className="stats">
          <div className="stat-item">
            <div className="stat-number">{stats.totalAnswered}</div>
            <div className="stat-label">総回答数</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.incorrect}</div>
            <div className="stat-label">間違い</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{mistakes.length}</div>
            <div className="stat-label">要復習</div>
          </div>
        </div>
      </div>

      {mistakes.length === 0 ? (
        <div className="card">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎉</div>
            <h3 style={{ marginBottom: '8px' }}>素晴らしい！</h3>
            <p style={{ color: '#666' }}>
              復習が必要な文字はありません。<br />
              練習を続けて記録を作ってみましょう！
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Clear Button */}
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <button 
              className="btn btn-secondary"
              onClick={handleClearMistakes}
            >
              🗑️ 記録をクリア
            </button>
          </div>

          {/* Mistakes List */}
          <div className="card">
            <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>
              間違いやすい文字 (上位{mistakes.length}個)
            </h3>
            
            <div className="error-list">
              {mistakes.map((mistake, index) => (
                <div
                  key={`${mistake.romaji}-${index}`}
                  className="error-item"
                  onClick={() => playKanaAudio(mistake)}
                  style={{ cursor: isSupported() ? 'pointer' : 'default' }}
                >
                  <div className="error-kana">
                    <div style={{ marginRight: '16px' }}>
                      <span style={{ color: '#999', fontSize: '0.9rem' }}>
                        #{index + 1}
                      </span>
                    </div>
                    <div style={{ textAlign: 'center', minWidth: '80px' }}>
                      <div className="hiragana" style={{ fontSize: '1.8rem', marginBottom: '4px' }}>
                        {mistake.hiragana}
                      </div>
                      <div className="katakana" style={{ fontSize: '1.2rem', color: '#666' }}>
                        {mistake.katakana}
                      </div>
                      <div className="romaji" style={{ fontSize: '0.9rem', color: '#007bff' }}>
                        {mistake.romaji}
                      </div>
                    </div>
                    {isSupported() && (
                      <div style={{ marginLeft: '16px', fontSize: '1.2rem' }}>
                        🔊
                      </div>
                    )}
                  </div>
                  
                  <div style={{ textAlign: 'right', minWidth: '100px' }}>
                    <div className="error-count">
                      {mistake.count}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '4px' }}>
                      {formatDate(mistake.lastMistake)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips Card */}
          <div className="card">
            <h3 style={{ textAlign: 'center', marginBottom: '16px' }}>
              学習のコツ
            </h3>
            <div style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.6' }}>
              <p style={{ marginBottom: '12px' }}>
                📝 <strong>書いて覚える:</strong> 手で書くと記憶に残りやすくなります
              </p>
              <p style={{ marginBottom: '12px' }}>
                🔊 <strong>音で覚える:</strong> 文字をタップして音を聞いてみましょう
              </p>
              <p style={{ marginBottom: '12px' }}>
                🔄 <strong>繰り返し練習:</strong> 毎日少しずつでも継続が大切です
              </p>
              <p>
                🎯 <strong>集中学習:</strong> 間違いやすい文字を重点的に練習しましょう
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ErrorReview;