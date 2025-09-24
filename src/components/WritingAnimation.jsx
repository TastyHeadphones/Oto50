import { useState } from 'react';
import { getGojuonChart } from '../data/kanaData';
import { useJapaneseAudio } from '../hooks/useJapaneseAudio';

// Function to get GIF path for a kana
const getKanaGifPath = (kana, script) => {
  try {
    if (script === 'hiragana') {
      return new URL(`../images/hiragana/Hiragana_${kana.romaji}.gif`, import.meta.url).href;
    } else if (script === 'katakana') {
      return new URL(`../images/katakana/Katakana_${kana.romaji}.gif`, import.meta.url).href;
    }
  } catch (error) {
    console.warn(`GIF not found for ${script} ${kana.romaji}:`, error);
    return null;
  }
  return null;
};

const WritingAnimation = () => {
  const [selectedType, setSelectedType] = useState('清音');
  const [selectedKana, setSelectedKana] = useState(null);
  const [scriptType, setScriptType] = useState('hiragana');
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
      const textToSpeak = scriptType === 'hiragana' ? kana.hiragana : kana.katakana;
      speak(textToSpeak);
    }
  };

  const handleKanaClick = (kana) => {
    setSelectedKana(kana);
    playKanaAudio(kana);
  };

  const gifPath = selectedKana ? getKanaGifPath(selectedKana, scriptType) : null;

  return (
    <div className="container">
      {/* Main Animation Display */}
      {selectedKana && (
        <div className="card">
          <div className="writing-animation-display">
            <div className="animation-header">
              <h2 style={{ margin: '0 0 16px 0', color: '#333' }}>
                {scriptType === 'hiragana' ? selectedKana.hiragana : selectedKana.katakana}
                <span style={{ fontSize: '1rem', color: '#666', marginLeft: '12px' }}>
                  ({selectedKana.romaji})
                </span>
              </h2>
            </div>
            
            <div className="animation-content">
              {gifPath ? (
                <div className="gif-container">
                  <img 
                    src={gifPath}
                    alt={`${scriptType} ${selectedKana.romaji} stroke animation`}
                    className="kana-gif"
                    onError={(e) => {
                      console.warn(`Failed to load GIF: ${gifPath}`);
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              ) : (
                <div className="no-animation">
                  <p>アニメーションが見つかりません</p>
                </div>
              )}
              
              <div className="kana-info">
                <div className="script-toggle">
                  <button
                    className={scriptType === 'hiragana' ? 'btn btn-primary' : 'btn btn-secondary'}
                    onClick={() => setScriptType('hiragana')}
                  >
                    ひらがな
                  </button>
                  <button
                    className={scriptType === 'katakana' ? 'btn btn-primary' : 'btn btn-secondary'}
                    onClick={() => setScriptType('katakana')}
                  >
                    カタカナ
                  </button>
                </div>
                
                <div className="kana-details">
                  <div className="kana-display-large">
                    <div className="hiragana" style={{ fontSize: '3rem' }}>
                      {selectedKana.hiragana}
                    </div>
                    <div className="katakana" style={{ fontSize: '3rem' }}>
                      {selectedKana.katakana}
                    </div>
                  </div>
                  <div className="romaji" style={{ fontSize: '1.5rem', marginTop: '8px' }}>
                    {selectedKana.romaji}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="card">
        <div style={{ marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="🔍 ひらがな、カタカナ、またはローマ字で検索"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '1rem'
            }}
          />
        </div>
      </div>

      {/* Type Selection */}
      <div className="card">
        <h3 style={{ marginBottom: '16px', textAlign: 'center' }}>文字種類</h3>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {['清音', '濁音', '拗音'].map(type => (
            <button
              key={type}
              className={selectedType === type ? 'btn btn-primary' : 'btn btn-secondary'}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Kana Grid */}
      <div className="card">
        {filteredChartData.rows.length > 0 ? (
          <div className="table-container">
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
                            className={`kana-item ${selectedKana?.romaji === kana.romaji ? 'selected' : ''}`}
                            onClick={() => handleKanaClick(kana)}
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
        ) : (
          <p style={{ textAlign: 'center', color: '#666' }}>
            検索条件に一致する文字が見つかりません
          </p>
        )}
      </div>

      {/* Instructions */}
      <div className="card">
        <h3 style={{ textAlign: 'center', marginBottom: '16px' }}>使い方</h3>
        <div style={{ fontSize: '0.9rem', color: '#666', textAlign: 'center' }}>
          <p style={{ marginBottom: '8px' }}>📱 文字をタップすると書き順アニメーションが表示されます</p>
          <p style={{ marginBottom: '8px' }}>🔊 文字をタップすると音が再生されます</p>
          <p style={{ marginBottom: '8px' }}>🔄 ひらがな・カタカナを切り替えてアニメーションを見比べられます</p>
          <p>🔍 検索バーで特定の文字をすばやく見つけられます</p>
        </div>
      </div>
    </div>
  );
};

export default WritingAnimation;