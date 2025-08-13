import './header.css'
import { Link } from 'react-router-dom';
import corgiHeader from '/assets/corgi/corgi-header.webp';
import Button from '../Button';
import { useEffect, useState } from 'react';

const themes = ["default", "green", "dark", "west"];

function Header({ onMenuToggle, menuBtnRef}) {
  const [themeIndex, setThemeIndex] = useState(0);

  useEffect(() => {
    const savedTheme = localStorage.getItem("selectedTheme");
    const index = themes.indexOf(savedTheme);
    if (index !== -1) {
      setThemeIndex(index);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      document.documentElement.setAttribute("data-theme", themes[0]);
    }
  }, []);

  const cycleTheme = () => {
    const nextIndex = (themeIndex + 1) % themes.length;
    setThemeIndex(nextIndex);
    const nextTheme = themes[nextIndex];
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("selectedTheme", nextTheme);
  };

  return (
    <header className="header-container no-select">
      <div className="top-section">
        <img className="corgi-header-img" src={corgiHeader} alt="corgi face" />
        <div className="header-title">
        <Link to="/">
          <h1>Doggo</h1>
        </Link>
        <Link to="/">
          <h1>Diary</h1>
        </Link>
        </div>
      </div>

      <nav>
        <ul>
          <div className="left-side-nav">
            <li>
              <button 
                onClick={onMenuToggle} 
                className='menu-toggle-btn nav-links'
                ref={menuBtnRef}
                >☰ Menu
              </button>
            </li>
            <li>
              <Button onClick={cycleTheme} className='theme-btn nav-links' text="Theme"/>
            </li>
          </div>
          <div className="right-side-nav">
            <Link to="create"><li className='nav-links'>Create Post</li></Link>
            <Link to="library"><li className='nav-links'>Articles</li></Link>
            <Link to="about"><li className='nav-links'>About</li></Link>
          </div>
        </ul>
      </nav>
    </header>
  );
}


export default Header;