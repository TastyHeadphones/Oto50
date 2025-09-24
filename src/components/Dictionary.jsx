import { useState } from 'react';
import { kanaData, getGojuonChart } from '../data/kanaData';
import { useJapaneseAudio } from '../hooks/useJapaneseAudio';

const Dictionary = () => {
  const [selectedType, setSelectedType] = useState('清音');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { speak, isSupported } = useJapaneseAudio();

  const chartData = getGojuonChart(selectedType);
  
  // Filter chart data based on search term
  const filteredChartData = {
    ...chartData,
    rows: chartData.rows.map(row => ({
      ...row,
      cells: row.cells.map(kana => {
        if (!kana) return null;
        
        const matchesSearch = searchTerm === '' ||
          kana.romaji.toLowerCase().includes(searchTerm.toLowerCase()) ||
          kana.hiragana.includes(searchTerm) ||
          kana.katakana.includes(searchTerm);
        
        return matchesSearch ? kana : null;
      })
    })).filter(row => row.cells.some(cell => cell !== null))
  };

  const playKanaAudio = (kana) => {
    if (isSupported()) {
      speak(kana.hiragana);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>
          日本語辞書
        </h2>
        
        {/* Search */}
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '1.1rem',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              outline: 'none',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#007bff';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e9ecef';
            }}
          />
        </div>

        {/* Type Selection */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {Object.keys(kanaData).map(type => (
              <button
                key={type}
                className={selectedType === type ? 'btn btn-primary' : 'btn btn-secondary'}
                onClick={() => setSelectedType(type)}
              >
                {type} ({kanaData[type].length})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gojūon Chart */}
      <div className="card">
        <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>
          {selectedType} - 五十音表
        </h3>
        
        {filteredChartData.rows.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
            見つかりません
          </div>
        ) : (
          <div className="gojuon-chart">
            <table className="gojuon-table">
              <thead>
                <tr>
                  <th></th>
                  {chartData.headers.map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredChartData.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="row-header">{row.name}</td>
                    {row.cells.map((kana, cellIndex) => (
                      <td key={cellIndex} className="kana-cell">
                        {kana ? (
                          <div
                            className="kana-item"
                            onClick={() => playKanaAudio(kana)}
                          >
                            {isSupported() && (
                              <div className="audio-indicator">🔊</div>
                            )}
                            
                            <div className="hiragana">{kana.hiragana}</div>
                            <div className="katakana">{kana.katakana}</div>
                            <div className="romaji">{kana.romaji}</div>
                          </div>
                        ) : (
                          <div className="empty-cell"></div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="card">
        <h3 style={{ textAlign: 'center', marginBottom: '16px' }}>説明</h3>
        <div style={{ fontSize: '0.9rem', color: '#666', textAlign: 'center' }}>
          <p style={{ marginBottom: '8px' }}>📱 文字をタップすると音が再生されます</p>
          <p style={{ marginBottom: '8px' }}>🔍 上の検索バーで文字を探せます</p>
          <p>📝 清音: 基本音、濁音: 濁点付き、拗音: 小さい「ゃ」「ゅ」「ょ」</p>
        </div>
      </div>
    </div>
  );
};

export default Dictionary;