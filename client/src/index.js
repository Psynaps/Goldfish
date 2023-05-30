import React from 'react';
import ReactDOM from 'react-dom/client';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from '@auth0/auth0-react';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import './index.css';

// console.log('redir: ' + window.location.origin);
// console.log('href1: ' + window.location.href);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Auth0Provider
    domain='dev-zk5m1bwyoje0vcbj.us.auth0.com'
    clientId='WzugzMdTqCYYGtoKmoxUhgRYuND6gASj'
    audience='https://dev-zk5m1bwyoje0vcbj.us.auth0.com/api/v2/'
    scope='update:current_user_metadata'
    authorizationParams={{
      redirect_uri: window.location.href
    }}
  >
    <React.StrictMode>
      <ChakraProvider>
        <ColorModeScript initialColorMode='light' />

        <App />
      </ChakraProvider>
    </React.StrictMode>
  </Auth0Provider>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();