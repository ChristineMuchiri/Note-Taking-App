import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Amplify } from '@aws-amplify/core';
import { Authenticator } from '@aws-amplify/ui-react';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Authenticator>
      {({ signOut, user }) => (
        <App signOut={signOut} user={user}/>
      )}
      </Authenticator>
  </StrictMode>,
)
