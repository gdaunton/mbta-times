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
        <TransitRow routeId={69} inboundStopId={1404} outboundStopId={1425} />
        <TransitRow routeId={91} inboundStopId={12767} outboundStopId={2768} />
        <TransitRow routeId="Red" stopId="place-cntsq" />
      </TransitList>
    </AppContent>
  );
}

export default App;
