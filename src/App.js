import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import goldfishLogo from './images/logo.png';
import profilePic from './images/profile.png';
import './App.css';

function Home() {
  // document.getElementById("HomeLink").style.display = "none";
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
    <div className="Home">
      <header className="Banner">
        <div className="LogoContainer">
          <img src={goldfishLogo} alt="Logo" className="Logo" />
          <div className="TitleLinkBox">
            <h1 className="Title">Goldfish AI</h1>
            {/* <nav>
              <ul className="PageLinks">
                {/* <li className="HomeLink" style={{display: page === "home" ? 'none' : 'grid' }}> */}
                {/* <li className="HomeLink" style={{display: page === "home" ? 'none' : 'grid' }} onClick={()=>{setPage("home")}}> */}
                  {/* <Link to="/">Home</Link> */}
                {/* </li> */}
                {/* <li className="EmployerLink" style={{display: page === "employer" ? 'none' : 'grid' }}> */}
                {/* <li className="EmployerLink" style={{display: page === "employer" ? 'none' : 'grid' }}onClick={()=>{setPage("employer")}}> */}
                  {/* <Link to="/employer">Employer</Link> */}
                {/* </li> */}
              {/* </ul> */}
            {/* </nav> */}
          </div>
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
        {/* <Outlet /> */}
        {/* <div className="CreateProfileContainer">
          <button className="CreateProfileButton">Create Basic Profile</button>
        </div> */}
        <h2 className="BodyTitle">Always swim in the job market.</h2>
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
    </div>
  );
}

function EmployerPage() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  // const [searchTerm, setSearchTerm] = useState('');

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
    <div className="Employer">
      <header className="Banner">
        <div className="LogoContainer">
          <img src={goldfishLogo} alt="Logo" className="Logo" />
          <div className="TitleLinkBox">
            <h1 className="Title">Goldfish AI</h1>
            {/* <nav> */}
              {/* <ul className="PageLinks"> */}
                {/* <li className="HomeLink" style={{display: page === "home" ? 'none' : 'grid' }}> */}
                {/* <li className="HomeLink" style={{display: page === "home" ? 'none' : 'grid' }} onClick={()=>{setPage("home")}}> */}
                  {/* <Link to="/">Home</Link> */}
                {/* </li> */}
                {/* <li className="EmployerLink" style={{display: page === "employer" ? 'none' : 'grid' }}> */}
                {/* <li className="EmployerLink" style={{display: page === "employer" ? 'none' : 'grid' }}onClick={()=>{setPage("employer")}}> */}
                  {/* <Link to="/employer">Employer</Link> */}
                {/* </li> */}
              {/* </ul> */}
            {/* </nav> */}
          </div>
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
        <h2>Welcome to the Employer page!</h2>
      </div>
    </div>
    
  );
}

function App() {
  // const [page, setPage] = useState("home");


  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/employer" element={<EmployerPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
