import React from 'react';
import styled from 'styled-components';
import Calculator from './components/Calculator';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

function App() {
  return (
    <AppContainer>
      <Calculator />
    </AppContainer>
  );
}

export default App; 