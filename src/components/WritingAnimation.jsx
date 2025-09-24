import { useState } from 'react';
import { kanaData, getGojuonChart } from '../data/kanaData';

const WritingAnimation = () => {
  const [selectedType, setSelectedType] = useState('清音');
  const [kanaType, setKanaType] = useState('hiragana'); // 'hiragana' or 'katakana'
  const [selectedKana, setSelectedKana] = useState(null);

  const chartData = getGojuonChart(selectedType);

  // Filter chart data to only show kana that have GIFs available
  const filteredChartData = {
    ...chartData,
    rows: chartData.rows.map(row => ({
      ...row,
      cells: row.cells.map(kana => {
        if (!kana) return null;
        // Check if GIF exists for this kana
        return kana;
      })
    }))
  };

  const getGifPath = (romaji, type) => {
    const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
    return new URL(`../images/${type}/${capitalizedType}_${romaji}.gif`, import.meta.url).href;
  };

  const handleKanaClick = (kana) => {
    setSelectedKana(kana);
  };

  const getKanaTypeLabel = (type) => {
    return type === 'hiragana' ? '平假名' : '片假名';
  };

  return (
    <div className="container">
      {/* Title */}
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '16px' }}>書き順練習</h2>
        <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
          文字をタップして書き順を確認しましょう
        </p>
      </div>

      {/* Kana Type Selection */}
      <div className="card">
        <h3 style={{ textAlign: 'center', marginBottom: '16px' }}>文字種類</h3>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '16px' }}>
          <button
            className={kanaType === 'hiragana' ? 'btn btn-primary' : 'btn btn-secondary'}
            onClick={() => {
              setKanaType('hiragana');
              setSelectedKana(null);
            }}
          >
            平假名
          </button>
          <button
            className={kanaType === 'katakana' ? 'btn btn-primary' : 'btn btn-secondary'}
            onClick={() => {
              setKanaType('katakana');
              setSelectedKana(null);
            }}
          >
            片假名
          </button>
        </div>
      </div>

      {/* Type Selection */}
      <div className="card">
        <h3 style={{ textAlign: 'center', marginBottom: '16px' }}>音の種類</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {Object.keys(kanaData).map(type => (
            <button
              key={type}
              className={selectedType === type ? 'btn btn-primary' : 'btn btn-secondary'}
              onClick={() => {
                setSelectedType(type);
                setSelectedKana(null);
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Animation Display */}
      {selectedKana && (
        <div className="card">
          <h3 style={{ textAlign: 'center', marginBottom: '16px' }}>
            {getKanaTypeLabel(kanaType)} - {selectedKana.romaji}
          </h3>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
              {kanaType === 'hiragana' ? selectedKana.hiragana : selectedKana.katakana}
            </div>
            <div style={{ fontSize: '1.2rem', color: '#007bff', fontWeight: 'bold' }}>
              {selectedKana.romaji}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <img
              src={getGifPath(selectedKana.romaji, kanaType)}
              alt={`${getKanaTypeLabel(kanaType)} ${selectedKana.romaji} 書き順`}
              style={{
                maxWidth: '300px',
                maxHeight: '300px',
                width: '100%',
                height: 'auto',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                background: '#f8f9fa'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div 
              style={{
                display: 'none',
                padding: '40px',
                textAlign: 'center',
                color: '#666',
                border: '2px dashed #dee2e6',
                borderRadius: '8px',
                maxWidth: '300px',
                width: '100%'
              }}
            >
              アニメーションが見つかりません
            </div>
          </div>
        </div>
      )}

      {/* Gojūon Chart */}
      <div className="card">
        <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>
          {getKanaTypeLabel(kanaType)} {selectedType} - 五十音表
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
                            className={`kana-item ${selectedKana?.romaji === kana.romaji ? 'selected' : ''}`}
                            onClick={() => handleKanaClick(kana)}
                          >
                            <div className="kana-display">
                              {kanaType === 'hiragana' ? kana.hiragana : kana.katakana}
                            </div>
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

      {/* Instructions */}
      <div className="card">
        <h3 style={{ textAlign: 'center', marginBottom: '16px' }}>使い方</h3>
        <div style={{ fontSize: '0.9rem', color: '#666', textAlign: 'center' }}>
          <p style={{ marginBottom: '8px' }}>📝 上の表から文字をタップして書き順を見てください</p>
          <p style={{ marginBottom: '8px' }}>🎯 平假名と片假名を切り替えできます</p>
          <p>📚 清音、濁音、拗音の種類を選択できます</p>
        </div>
      </div>
    </div>
  );
};

export default WritingAnimation;