// import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import '../styles/globals.css';
// import { StrictMode } from 'react';
import { App } from './App';
import { QueueProvider } from './contexts/queueContext';
import * as Toast from '@radix-ui/react-toast';
import { StrictMode } from 'react';

const root = ReactDOM.createRoot(
  document.getElementById('root') ?? document.body

);
root.render(
  <StrictMode>
  <Toast.Provider swipeDirection="right">

    <QueueProvider>
      <App />
    </QueueProvider>
  </Toast.Provider>
  </StrictMode>
);
