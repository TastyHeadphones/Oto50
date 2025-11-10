import { useEffect, useMemo, useState } from 'react';
import { kanaData } from '../data/kanaData';
import { getAnimationUrl } from '../utils/kanaAnimations';

const WritingAnimation = () => {
  const [selectedType, setSelectedType] = useState('清音');
  const [kanaType, setKanaType] = useState('hiragana');
  const [selectedKana, setSelectedKana] = useState(null);

  const availableKanaList = useMemo(() => {
    const list = kanaData[selectedType] || [];
    return list.filter(kana => getAnimationUrl(kanaType, kana.romaji));
  }, [kanaType, selectedType]);

  const chunkedKanaMatrix = useMemo(() => {
    const chunkSize = 5;
    const rows = [];
    let currentRow = [];

    availableKanaList.forEach(kana => {
      currentRow.push(kana);

      if (currentRow.length === chunkSize) {
        rows.push(currentRow);
        currentRow = [];
      }
    });

    if (currentRow.length > 0) {
      while (currentRow.length < chunkSize) {
        currentRow.push(null);
      }
      rows.push(currentRow);
    }

    return rows;
  }, [availableKanaList]);

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
    <div className="container writing-page">
      <div className="card writing-hero">
        <div className="writing-hero-header">
          <div>
            <p className="writing-subtitle">書き順アニメーション</p>
            <h2 className="writing-title">しなやかな筆致で学ぶ</h2>
          </div>
          <div className="writing-switchers">
            <div className="segmented-control">
              <button
                type="button"
                className={`segment ${kanaType === 'hiragana' ? 'active' : ''}`}
                onClick={() => {
                  setKanaType('hiragana');
                  setSelectedKana(null);
                }}
              >
                平假名
              </button>
              <button
                type="button"
                className={`segment ${kanaType === 'katakana' ? 'active' : ''}`}
                onClick={() => {
                  setKanaType('katakana');
                  setSelectedKana(null);
                }}
              >
                片假名
              </button>
            </div>
            <div className="segmented-control soft">
              {Object.keys(kanaData).map(type => (
                <button
                  type="button"
                  key={type}
                  className={`segment ${selectedType === type ? 'active' : ''}`}
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
        </div>

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
          <div className="empty-state">
            この種類のアニメーションは準備中です
          </div>
        )}
      </div>

      <div className="card animation-collection">
        <div className="animation-collection-header">
          <div>
            <h3>{getKanaTypeLabel(kanaType)} {selectedType}</h3>
            <p>ごじゅうおんの流れで、タップしてアニメーションを再生しましょう。</p>
          </div>
        </div>

        {chunkedKanaMatrix.length === 0 ? (
          <div className="empty-state">
            利用できるアニメーションが見つかりません
          </div>
        ) : (
          <div className="animation-matrix">
            {chunkedKanaMatrix.map((row, rowIndex) => (
              <div className="animation-row" key={`row-${rowIndex}`}>
                {row.map((kana, cellIndex) => {
                  if (!kana) {
                    return <div className="animation-placeholder" key={`placeholder-${rowIndex}-${cellIndex}`} />;
                  }

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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WritingAnimation;
