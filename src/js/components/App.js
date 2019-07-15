import React from 'react';
import styled from 'styled-components';
import TransitRow from './transitRow/TransitRow';

const AppContent = styled.div`
  width: 75%;
  max-width: 1100px;
  min-width: 550px;
  margin: 0 auto;
  padding-top: 200px;
`;

const TransitList = styled.div`
  > * {
    margin-top: 12px;
    margin-bottom: 12px;
  }

  > :first-child {
    margin-top: 0;
  }

  > :last-child {
    margin-bottom: 0;
  }
`;

function App() {
  return (
    <AppContent>
      <TransitList>
        <TransitRow routeId="69" />
        <TransitRow routeId="91" />
        <TransitRow routeId="Red" />
      </TransitList>
    </AppContent>
  );
}

export default App;
