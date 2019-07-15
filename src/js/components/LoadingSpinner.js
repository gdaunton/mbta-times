import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const dash = keyframes`
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -50;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -140;
  }
`;

const SpinnerWrapper = styled.div`
  animation: ${spin} 2s linear infinite;
`;

const SpinnerRing = styled.svg`
  display: block;
  max-width: 100%;
`;

const SpinnerRingPath = styled.circle`
  stroke-dasharray: 50, 150;
  stroke-dashoffset: 0;
  stroke-linecap: round;
  transform-origin: center;
  animation: ${dash} 2s cubic-bezier(0.42, 0, 0.58, 1) infinite,
    ${spin} 2s linear infinite;
`;

export default () => {
  return (
    <SpinnerWrapper className="private-spinner-wrapper">
      <SpinnerRing height={50} viewBox="0 0 50 50" width={50}>
        <circle cx="25" cy="25" r="22.5" fill="none" strokeWidth="5" />
        <SpinnerRingPath cx="25" cy="25" r="22.5" fill="none" strokeWidth="5" />
      </SpinnerRing>
    </SpinnerWrapper>
  );
};
