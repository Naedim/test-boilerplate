import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import styled from 'styled-components';
import '../styles/globals.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') ?? document.body
);

// @INFO: styled-components is installed, you can use it if you want ;)
const Container = styled.div``;

root.render(
  <StrictMode>
    <p className = "text-red-500">coucou</p>
    <Container>Good luck !</Container>
  </StrictMode>
);
