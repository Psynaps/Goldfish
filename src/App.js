import React, { useState, useEffect, useRef } from 'react';
import Collapsible from 'react-collapsible';
import { BrowserRouter as Routes, Route } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import goldfishLogo from './images/logo.png';
import profilePic from './images/profile.png';
import QuestionBank from "./QuestionBank";
import { useAuth0 } from "@auth0/auth0-react";
import './App.css';

function LoginButton() {
    const { loginWithRedirect } = useAuth0();

    // useEffect(() => {
    //     if (isAuthenticated) {
    //         navigate(location.pathname); // Redirect to the current page
    //     }
    // }, [isAuthenticated, navigate, location]);

    return (
        <button className="LoginButton" onClick={() => loginWithRedirect({ appState: { returnTo: window.location.href } })}>
            Log In
        </button>
    );
}

function LogoutButton() {
    const { logout } = useAuth0();

    return <button className="LogoutButton" onClick={() => logout({ returnTo: window.location.href })}>Log Out</button>;
}

function Callback() {
    const { isLoading } = useAuth0();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading) {
            navigate('/');
        }
    }, [isLoading, navigate]);

    return <div>Loading...</div>;
}

// TODO: Make ... component to display inplace of profile icon (and profile icon + saved jobs button for employer page) untiil login returns yes or no.

function Home() {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const { isAuthenticated, isLoading } = useAuth0();

    const toggleDropdown = (event) => {
        setDropdownOpen(!isDropdownOpen);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        const handleWindowClick = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                handleClickOutside(event);
            }
        };

        window.addEventListener("mousedown", handleWindowClick);
        return () => {
            window.removeEventListener("mousedown", handleWindowClick);
        };
    }, []);

    return (
        <div className="Home">
            <header className="Banner">
                <div className="LogoContainer">
                    <img src={goldfishLogo} alt="Logo" className="Logo" />
                    <div className="TitleLinkBox">
                        <h1 className="Title">Goldfish AI</h1>
                    </div>
                </div>
                {isLoading ? <div>Loading ...</div> : <></>}
                {(!isLoading && isAuthenticated) ? (
                    <>
                        <div className="ProfileDropdown" ref={dropdownRef}>
                            <button className="ProfileButton" onClick={toggleDropdown}>
                                <img src={profilePic} alt="Profile" className="ProfileIcon" />
                            </button>
                            {isDropdownOpen && (
                                <div className="DropdownContent">
                                    <ul className="DropdownMenu">
                                        <button>Profile</button>
                                        <button>Settings</button>
                                        <LogoutButton />
                                    </ul>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <LoginButton />
                )}

            </header>

            <div className="Body">
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
    const [searchTerm, setSearchTerm] = useState('');

    const { isAuthenticated } = useAuth0();

    const toggleDropdown = (event) => {
        setDropdownOpen(!isDropdownOpen);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        const handleWindowClick = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                handleClickOutside(event);
            }
        };

        window.addEventListener("mousedown", handleWindowClick);
        return () => {
            window.removeEventListener("mousedown", handleWindowClick);
        };
    }, []);

    return (
        <div className="Employer">
            <header className="Banner">
                <div className="LogoContainer">
                    <img src={goldfishLogo} alt="Logo" className="Logo" />
                    <div className="TitleLinkBox">
                        <h1 className="Title">Goldfish AI</h1>
                    </div>
                </div>
                <div className="PortalText">Employer Portal: Company X</div>
                {isAuthenticated ? (
                    <>
                        <div className="ProfileDropdown">
                            <div className="ProfileAndSavedJobs">
                                <button className="ProfileButton" onClick={toggleDropdown}>
                                    <img src={profilePic} alt="Profile" className="ProfileIcon" />
                                </button>
                                <button className="savedJobs">Saved Jobs</button>
                            </div>
                            {isDropdownOpen && (
                                <div className="DropdownContent" ref={dropdownRef}>
                                    <ul className="DropdownMenu">
                                        <button>Profile</button>
                                        <button>Settings</button>
                                        <LogoutButton />
                                    </ul>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <LoginButton />
                )}

            </header>
            <div className="Body">
                <div className="FilterSection">
                    <h2>Question Bank Filters</h2>
                    <div className="SearchBox">
                        <input
                            className="SearchInput"
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="FilterGrid">
                        <button className="FilterButton Button1">Text 1</button>
                        <button className="FilterButton Button2">Text 2</button>
                        <button className="FilterButton Button3">Text 3</button>
                        <button className="FilterButton Button4">Text 4</button>
                        <button className="FilterButton Button5">Text 5</button>
                        <button className="FilterButton Button6">Text 6</button>
                        <button className="FilterButton Button7">Text 7</button>
                        <button className="FilterButton Button8">Text 8</button>
                    </div>
                </div>

                <div className="ContentSection">
                    <div className="QuestionBank">
                        <div className="TitleAndButton">
                            <h2>Question Bank</h2>
                            <button className="AddButton">Add</button>
                        </div>
                        <QuestionBank />
                    </div>

                    <div className="JobPostingBuilder">
                        <div className="TitleAndButton">
                            <h2>Job Posting Builder</h2>
                            <button className="RemoveButton">Remove</button>
                        </div>
                        <div className="ScrollableContent">
                            <Collapsible trigger="Some Question for the Job">
                                <div className="answerSection">
                                    <hr />
                                    <div className="GridOfButtons">
                                        <button>Choice 1</button>
                                        <button>Choice 2</button>
                                        <button>Choice 3</button>
                                        <button>Choice 4</button>
                                    </div>
                                </div>
                            </Collapsible>
                            <Collapsible trigger="Another Question for the Job">
                                <div className="answerSection">
                                    <hr />
                                    <div className="GridOfButtons">
                                        <button>Choice 1</button>
                                        <button>Choice 2</button>
                                        <button>Choice 3</button>
                                        <button>Choice 4</button>
                                    </div>
                                </div>
                            </Collapsible>
                            <Collapsible trigger="Third Question for the Job">
                                <div className="answerSection">
                                    <hr />
                                    <div className="GridOfButtons">
                                        <button>Choice 1</button>
                                        <button>Choice 2</button>
                                        <button>Choice 3</button>
                                        <button>Choice 4</button>
                                    </div>
                                </div>
                            </Collapsible>
                        </div>
                        <button className="saveButton">Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
}




function App() {
    // const [page, setPage] = useState("home");

    return (
        // <Router>
        <div className="App">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/employer" element={<EmployerPage />} />
                {/* <Route path="/callback" element={<Callback />} /> */}
            </Routes>
        </div>
        // </Router>
    );
}

export default App;
