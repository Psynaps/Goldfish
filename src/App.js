import React, { useState, useEffect, useRef } from 'react';
import Collapsible from 'react-collapsible';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import goldfishLogo from './images/logo.png';
import profilePic from './images/profile.png';
import './App.css';

function Answer({ answerID, answer, questionID, setQuestionsAnswered }) {
  const [selected, setSelected] = useState(false);

  const handleAnswerClick = () => {
    setSelected(!selected);

    setQuestionsAnswered((prevAnswers) => {
      const newAnswer = { questionID: questionID, answerID: [answerID] };
      if (selected) {
        // remove the answer if it is already selected
        return prevAnswers.filter(
          (answer) =>
            answer.questionID !== questionID || answer.answerID !== answerID
        );
      } else {
        // add the new answer
        return [...prevAnswers, newAnswer];
      }
    });
  };

  return (
    <button
      className={`answerButton ${selected ? "selected" : ""}`}
      onClick={handleAnswerClick}
    >
      {answer}
    </button>
  );
}

function Home() {
  // document.getElementById("HomeLink").style.display = "none";
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = (event) => {
    // if (isDropdownOpen && (dropdownRef.current === event.target || dropdownRef.current.contains(event.target))) {
    //   return;
    // }
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
        <div className="ProfileDropdown" ref={dropdownRef}>
          <button className="ProfileButton" onClick={toggleDropdown}>
            <img src={profilePic} alt="Profile" className="ProfileIcon" />
          </button>
          {isDropdownOpen && (
            // <div className="DropdownContent" ref={dropdownRef}>
            <div className="DropdownContent">
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
  const [searchTerm, setSearchTerm] = useState('');
  const [questions, setQuestions] = useState([
    {
      questionID: 1,
      category: "Category1",
      tags: ["tag1", "tag2"],
      question: "How would you describe your level of experience with X?",
      answers: [
        {answerID: 1, answer: "Answer1"},
        {answerID: 2, answer: "Answer2"},
        {answerID: 3, answer: "Answer3"},
        {answerID: 4, answer: "Answer4"}
      ]
    },
    {
      questionID: 2,
      category: "Category2",
      tags: ["tag3", "tag4"],
      question: "What are your thoughts on A?",
      answers: [
        {answerID: 1, answer: "Answer1"},
        {answerID: 2, answer: "Answer2"},
        {answerID: 3, answer: "Answer3"},
        {answerID: 4, answer: "Answer4"}
      ]
    },
    {
      questionID: 3,
      category: "Category3",
      tags: ["tag3", "tag4"],
      question: "What are your thoughts on B?",
      answers: [
        {answerID: 1, answer: "Answer1"},
        {answerID: 2, answer: "Answer2"},
        {answerID: 3, answer: "Answer3"},
        {answerID: 4, answer: "Answer4"}
      ]
    },
    {
      questionID: 4,
      category: "Category4",
      tags: ["tag2", "tag3"],
      question: "What are your thoughts on C?",
      answers: [
        {answerID: 1, answer: "Answer1"},
        {answerID: 2, answer: "Answer2"},
        {answerID: 3, answer: "Answer3"},
        {answerID: 4, answer: "Answer4"}
      ]
    },
    {
      questionID: 5,
      category: "Category1",
      tags: ["tag3", "tag5"],
      question: "What are your thoughts on D?",
      answers: [
        {answerID: 1, answer: "Answer1"},
        {answerID: 2, answer: "Answer2"},
        {answerID: 3, answer: "Answer3"},
        {answerID: 4, answer: "Answer4"}
      ]
    },
  ]);

  const [questionsAnswered, setQuestionsAnswered] = useState([]);
  

  const toggleDropdown = (event) => {
    // if (isDropdownOpen && (dropdownRef.current === event.target || dropdownRef.current.contains(event.target))) {
    //   return;
    // }
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
          <button>Signout</button>
        </ul>
      </div>
    )}
  </div>
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
            <div className="ScrollableContent">
              {questions.map((question) => (
                <Collapsible trigger={question.question}>
                  <div className="answerSection">
                  <hr />
                    <div className="GridOfButtons">
                    {question.answers.map((answer) => (
                      <Answer
                        key={answer.answerID}
                        answerID={answer.answerID}
                        answer={answer.answer}
                        questionID={question.questionID}
                        setQuestionsAnswered={setQuestionsAnswered}
                      />
                    ))}
                    </div>
                  </div>

                </Collapsible>
              ))}
            </div>
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
