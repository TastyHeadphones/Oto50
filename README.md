# 音50 - Japanese 50 Sounds Memorization App

A mobile-first React web application designed to help users memorize the Japanese 50 sounds (ひらがな・カタカナ) through interactive practice and review.

## 🌟 Features

- **📱 Mobile-First Design**: Optimized for smartphones and tablets
- **🔤 Complete Kana Coverage**: All 50 sounds including 清音, 濁音, 拗音
- **🎯 Interactive Practice**: Show romaji, recall hiragana/katakana with ✅/❌ buttons
- **💾 Progress Tracking**: LocalStorage-based mistake tracking and statistics
- **📚 Interactive Dictionary**: Browse all kana with audio pronunciation
- **🔊 Audio Support**: Text-to-speech for Japanese pronunciation
- **📊 Error Review**: Dedicated page for reviewing frequently forgotten characters
- **🇯🇵 Japanese UI**: Interface uses only Japanese text and emoji (no English)
- **⚛️ Modern React**: Built with React Hooks, React Router, and Vite

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/TastyHeadphones/Oto50.git
cd Oto50

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── Navigation.jsx   # Main navigation
│   ├── Practice.jsx     # Practice page with Q&A
│   ├── Dictionary.jsx   # Interactive kana dictionary
│   └── ErrorReview.jsx  # Review mistakes page
├── data/
│   └── kanaData.js     # Japanese kana data (清音, 濁音, 拗音)
├── hooks/
│   └── useJapaneseAudio.js  # Text-to-speech hook
├── utils/
│   └── localStorage.js  # LocalStorage utilities
└── styles/
    ├── index.css       # Global styles
    └── App.css         # App-specific styles
```

## 📊 Pages & Features

### 🏃‍♂️ Practice (練習)
- Random kana selection from chosen categories
- Show romaji → recall hiragana/katakana
- ✅/❌ buttons for self-assessment
- Real-time statistics tracking
- Configurable practice modes and character types

### 📖 Dictionary (辞書)
- Complete kana reference with audio
- Organized by 清音 (46), 濁音 (25), 拗音 (33)
- Search functionality
- Click-to-hear pronunciation
- Grid layout optimized for mobile

### 🔄 Error Review (復習)
- Most frequently mistaken characters
- Mistake count and timestamps
- Audio playback for review
- Learning tips and strategies
- Clear progress option

## 🛠️ Technology Stack

- **Frontend**: React 18, React Router 6
- **Build Tool**: Vite
- **Styling**: Vanilla CSS with mobile-first approach
- **Audio**: Web Speech API (speechSynthesis)
- **Storage**: Browser LocalStorage
- **Linting**: ESLint

## 🎨 Design Philosophy

- **Mobile-First**: Designed primarily for mobile devices
- **Japanese-Only UI**: No English text in the interface
- **Clean & Minimal**: Focus on learning without distractions
- **Responsive**: Works on all screen sizes
- **Accessible**: Touch-friendly buttons and clear typography

## 📱 Browser Support

- Modern browsers with ES2020+ support
- Speech synthesis API support recommended
- LocalStorage support required

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.