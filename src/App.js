import React, { useState, useEffect, useRef } from 'react';
import goldfishLogo from './images/logo.png';
import profilePic from './images/profile.png';
import './App.css';

function App() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="App">
      <header className="Banner">
        <div className="LogoContainer">
          <img src={goldfishLogo} alt="Logo" className="Logo" />
          <h1 className="Title">Goldfish AI</h1>
        </div>
        <div className="ProfileDropdown">
          <button className="ProfileButton" onClick={toggleDropdown}>
            <img src={profilePic} alt="Profile" className="ProfileIcon" />
          </button>
          {isDropdownOpen && (
            <div className="DropdownContent" ref={dropdownRef}>
              <ul className="DropdownMenu">
                <button>Profile</button>
                <button>Settings</button>
                <button>Signout</button>
              </ul>
            </div>
          )}
        </div>
      </header>
      <div className="Body">
        <div className="CreateProfileContainer">
          <button className="CreateProfileButton">Create Basic Profile</button>
        </div>
        <h2 className="BodyTitle">Always swim in the job market</h2>
        <div className="QuestionContainer">
          <div className="QuestionBox">
            <p className="QuestionText">How familiar are you with the job market?</p>
          </div>
          <div className="AnswerBox">
            <select className="Dropdown">
              <option value="very">Very</option>
              <option value="somewhat">Somewhat</option>
              <option value="not">Not</option>
            </select>
          </div>
        </div>
        {/* <div className="MatchesContainer"> */}
        <div className="MatchesBox">
          <div className="BasedOnBox">
            <div className="BasedOnText">Based on: 12 Q's</div>
          </div>
          <div className="Content">
            <p>Sample jobs matching your criteria:</p>
            <div className="JobRow">
              <div className="MatchedJobIcon1"></div>
              <p>Senior solutions architect, Midwest</p>
            </div>
            <div className="JobRow">
              <div className="MatchedJobIcon2"></div>
              <p>Product manager, East Coast</p>
            </div>
            <div className="JobRow">
              <div className="MatchedJobIcon3"></div>
              <p>Data scientist, West Coast</p>
            </div>
          </div>
          <div className="GoButton">Go!</div>

          </div>
        </div>
      {/* </div> */}
    </div>
  );
}

export default App;
