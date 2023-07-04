import React, { useState, useEffect, useRef, } from 'react';
import goldfishLogo from './images/logo.png';
import { useAuth0 } from '@auth0/auth0-react';
import { Spinner, Text, SimpleGrid, Avatar, } from '@chakra-ui/react';
import { LoginButton, LogoutButton } from './LoginButton';

function Home() {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const { isAuthenticated, isLoading, user } = useAuth0();

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

        window.addEventListener('mousedown', handleWindowClick);
        return () => {
            window.removeEventListener('mousedown', handleWindowClick);
        };
    }, []);

    return (
        <div className='Home'>
            <header className='Banner'>
                <div className='LogoContainer'>
                    <img src={goldfishLogo} alt='Logo' className='Logo' />
                    <div className='TitleLinkBox'>
                        <h1 className='Title'>Goldfish AI</h1>
                    </div>
                </div>
                {isLoading ? <Spinner /> :
                    ((isAuthenticated) ? <>
                        <div className='ProfileDropdown' ref={dropdownRef}>
                            <button className='ProfileButton' onClick={toggleDropdown}>
                                <Avatar src={user.picture} name={user.name} alt='Profile' borderRadius='full' boxSize='90%' />
                            </button>
                            {isDropdownOpen && (
                                <div className='DropdownContent'>
                                    <SimpleGrid columns={1} spacing={3} >
                                        <button>Profile</button>
                                        <button>Settings</button>
                                        <LogoutButton />
                                    </SimpleGrid>
                                </div>
                            )}
                        </div>
                    </> : <LoginButton />)
                }
            </header>

            <div className='Body'>
                {/* <h2 className='BodyTitle'>Always swim in the job market.</h2> */}
                <Text fontSize='24px' color='white' mt='30px'>Always swim in the job market.</Text>
                <div className='QuestionContainer'>
                    <div className='QuestionBox'>
                        <p className='QuestionText'>How familiar are you with the job market?</p>
                    </div>
                    <div className='AnswerBox'>
                        <select className='Dropdown'>
                            <option value='very'>Very</option>
                            <option value='somewhat'>Somewhat</option>
                            <option value='not'>Not</option>
                        </select>
                    </div>
                </div>
                <div className='MatchesBox'>
                    <div className='BasedOnBox'>
                        <div className='BasedOnText'>Based on: 12 Q's</div>
                    </div>
                    <div className='Content'>
                        <p>Sample jobs matching your criteria:</p>
                        <div className='JobRow'>
                            <div className='MatchedJobIcon1'></div>
                            <p>Senior solutions architect, Midwest</p>
                        </div>
                        <div className='JobRow'>
                            <div className='MatchedJobIcon2'></div>
                            <p>Product manager, East Coast</p>
                        </div>
                        <div className='JobRow'>
                            <div className='MatchedJobIcon3'></div>
                            <p>Data scientist, West Coast</p>
                        </div>
                    </div>
                    <div className='GoButton'>Go!</div>

                </div>
            </div>
        </div>
    );
}

export default Home;