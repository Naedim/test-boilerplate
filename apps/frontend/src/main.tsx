// import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import '../styles/globals.css';
// import { StrictMode } from 'react';
import { App } from './App';
import { QueueProvider } from './contexts/queueContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') ?? document.body

);
root.render(
  // <StrictMode>
    <QueueProvider>
      <App />
    </QueueProvider>
  // </StrictMode>
);
