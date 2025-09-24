import { useState } from 'react';
import { kanaData, getKanaByType } from '../data/kanaData';
import { useJapaneseAudio } from '../hooks/useJapaneseAudio';

const Dictionary = () => {
  const [selectedType, setSelectedType] = useState('清音');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { speak, isSupported } = useJapaneseAudio();

  const currentKanaList = getKanaByType(selectedType);
  
  const filteredKana = currentKanaList.filter(kana =>
    kana.romaji.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kana.hiragana.includes(searchTerm) ||
    kana.katakana.includes(searchTerm)
  );

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

      {/* Kana Grid */}
      <div className="card">
        <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>
          {selectedType} ({filteredKana.length}文字)
        </h3>
        
        {filteredKana.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
            見つかりません
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: '16px',
            padding: '0'
          }}>
            {filteredKana.map((kana, index) => (
              <div
                key={`${kana.romaji}-${index}`}
                style={{
                  background: '#f8f9fa',
                  border: '1px solid #e9ecef',
                  borderRadius: '12px',
                  padding: '16px',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onClick={() => playKanaAudio(kana)}
              >
                {isSupported() && (
                  <div style={{ 
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    fontSize: '0.8rem'
                  }}>
                    🔊
                  </div>
                )}
                
                <div className="hiragana" style={{ fontSize: '2rem', marginBottom: '8px' }}>
                  {kana.hiragana}
                </div>
                
                <div className="katakana" style={{ fontSize: '1.5rem', marginBottom: '8px', color: '#666' }}>
                  {kana.katakana}
                </div>
                
                <div className="romaji" style={{ fontSize: '1rem', color: '#007bff', fontWeight: 'bold' }}>
                  {kana.romaji}
                </div>
              </div>
            ))}
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