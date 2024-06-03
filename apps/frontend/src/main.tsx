// import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import '../styles/globals.css';
import { QueueViewer } from './components/QueueViewer';
import { StrictMode } from 'react';

const root = ReactDOM.createRoot(
  document.getElementById('root') ?? document.body

);
root.render(
  <StrictMode>
    <QueueViewer/>
  </StrictMode>
);
