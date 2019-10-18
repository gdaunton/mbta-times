import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import TransitRow from './transitRow/TransitRow';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
`;

const AppContent = styled.div`
  width: 75%;
  max-width: 1100px;
  min-width: 550px;
  margin: 0 auto;
  padding-top: 200px;
  position: relative;
`;

const TransitList = styled.div`
  display: flex;
  flex-wrap: wrap;

  > * {
    margin-top: 12px;
    margin-bottom: 12px;
  }

  > :nth-child(odd) {
    margin-right: 12px;
  }
`;

function App() {
  return (
    <AppContent>
      <GlobalStyle />
      <TransitList>
        <TransitRow routeId={69} inboundStopId={1404} outboundStopId={1425} />
        <TransitRow routeId="Red" stopId="place-cntsq" />
      </TransitList>
    </AppContent>
  );
}

export default App;
