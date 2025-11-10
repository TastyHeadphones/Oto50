import { useEffect, useMemo, useState } from 'react';
import { kanaData, getGojuonChart } from '../data/kanaData';
import { getAnimationUrl } from '../utils/kanaAnimations';

const WritingAnimation = () => {
  const [selectedType, setSelectedType] = useState('清音');
  const [kanaType, setKanaType] = useState('hiragana');
  const [selectedKana, setSelectedKana] = useState(null);

  const chartData = useMemo(() => getGojuonChart(selectedType), [selectedType]);

  const availableKanaList = useMemo(() => {
    const list = kanaData[selectedType] || [];
    return list.filter(kana => getAnimationUrl(kanaType, kana.romaji));
  }, [kanaType, selectedType]);

  useEffect(() => {
    if (availableKanaList.length === 0) {
      setSelectedKana(null);
      return;
    }

    const currentHasAnimation = selectedKana && getAnimationUrl(kanaType, selectedKana.romaji);
    if (!currentHasAnimation) {
      setSelectedKana(availableKanaList[0]);
    }
  }, [availableKanaList, kanaType, selectedKana]);

  const filteredChartData = useMemo(() => ({
    ...chartData,
    rows: chartData.rows.map(row => ({
      ...row,
      cells: row.cells.map(kana => {
        if (!kana) return null;
        return getAnimationUrl(kanaType, kana.romaji) ? kana : null;
      })
    }))
  }), [chartData, kanaType]);

  const handleKanaClick = (kana) => {
    if (!getAnimationUrl(kanaType, kana.romaji)) {
      return;
    }
    setSelectedKana(kana);
  };

  const getKanaTypeLabel = (type) => {
    return type === 'hiragana' ? '平假名' : '片假名';
  };

  const selectedAnimationUrl = selectedKana ? getAnimationUrl(kanaType, selectedKana.romaji) : null;

  return (
    <div className="container">
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '16px' }}>書き順練習</h2>
        <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
          文字をタップして書き順を確認しましょう
        </p>
      </div>

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

      <div className="card">
        <h3 style={{ textAlign: 'center', marginBottom: '16px' }}>
          {getKanaTypeLabel(kanaType)} プロモーションビュー
        </h3>
        {selectedAnimationUrl && selectedKana ? (
          <div className="selected-animation">
            <div className="selected-animation-preview">
              <img
                src={selectedAnimationUrl}
                alt={`${getKanaTypeLabel(kanaType)} ${selectedKana.romaji} 書き順`}
              />
            </div>
            <div className="selected-animation-caption">
              <div className="selected-kana">
                {kanaType === 'hiragana' ? selectedKana.hiragana : selectedKana.katakana}
              </div>
              <div className="selected-romaji">{selectedKana.romaji}</div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#666', padding: '24px' }}>
            この種類のアニメーションは準備中です
          </div>
        )}
      </div>

      <div className="card">
        <h3 style={{ textAlign: 'center', marginBottom: '16px' }}>アニメーション一覧</h3>
        {availableKanaList.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666', padding: '24px' }}>
            利用できるアニメーションが見つかりません
          </div>
        ) : (
          <div className="animation-grid">
            {availableKanaList.map(kana => {
              const url = getAnimationUrl(kanaType, kana.romaji);
              return (
                <button
                  type="button"
                  key={`${kanaType}-${kana.romaji}`}
                  className={`animation-item ${selectedKana?.romaji === kana.romaji ? 'selected' : ''}`}
                  onClick={() => handleKanaClick(kana)}
                >
                  <div className="animation-thumb">
                    <img src={url} alt={`${kana.romaji} 書き順`} />
                  </div>
                  <div className="animation-label">
                    <span className="animation-kana">
                      {kanaType === 'hiragana' ? kana.hiragana : kana.katakana}
                    </span>
                    <span className="animation-romaji">{kana.romaji}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

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
