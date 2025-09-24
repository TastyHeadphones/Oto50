import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <nav className="nav">
      <div className="nav-content">
        <Link to="/" className="nav-title">
          音50
        </Link>
        <div className="nav-links">
          <Link to="/" className={isActive('/')}>
            練習
          </Link>
          <Link to="/dictionary" className={isActive('/dictionary')}>
            辞書
          </Link>
          <Link to="/errors" className={isActive('/errors')}>
            復習
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;