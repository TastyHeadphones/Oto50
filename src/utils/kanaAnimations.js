import { getAllKana } from '../data/kanaData';

const buildCommonsUrl = (script, character) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${script}_${encodeURIComponent(
    character
  )}_stroke_order_animation.gif`;

const allKana = getAllKana();

const createAnimationMap = (scriptKey, scriptLabel) =>
  allKana.reduce((map, kana) => {
    const symbol = kana[scriptKey];
    if (symbol) {
      map[kana.romaji] = buildCommonsUrl(scriptLabel, symbol);
    }
    return map;
  }, {});

const HIRAGANA_ANIMATIONS = createAnimationMap('hiragana', 'Hiragana');

const KATAKANA_ANIMATIONS = createAnimationMap('katakana', 'Katakana');

const animationMap = {
  hiragana: HIRAGANA_ANIMATIONS,
  katakana: KATAKANA_ANIMATIONS
};

export const getAnimationUrl = (type, romaji) => {
  if (!type || !romaji) {
    return null;
  }
  return animationMap[type]?.[romaji.toLowerCase()] || null;
};

export const getAvailableAnimations = (type) => {
  if (!type || !animationMap[type]) {
    return {};
  }
  return animationMap[type];
};
