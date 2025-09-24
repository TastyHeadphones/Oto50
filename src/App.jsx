import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Practice from './components/Practice';
import Dictionary from './components/Dictionary';
import ErrorReview from './components/ErrorReview';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navigation />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Practice />} />
          <Route path="/dictionary" element={<Dictionary />} />
          <Route path="/errors" element={<ErrorReview />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;