import React from 'react';
import styled from 'styled-components';
import { getRoute } from '../../schema/routes/RouteClient';
import {
  UNINITIALIZED,
  STARTED,
  SUCCEEDED,
  FAILED,
} from '../../schema/lib/fetchStatus';
import LoadingSpinner from '../LoadingSpinner';
import {
  openTrainPredictionEventStream,
  openBusPredictionEventStream,
} from '../../schema/predictions/PredictionsClient';

const TrasitRowWrapper = styled.div`
  width: 100%;
  background-color: #f2f3f5;
  border: 1px solid #e9eaed;
  height: 100px;
  border-radius: 8px;
  display: inline-flex;
`;

const LineName = styled.h1`
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
`;

const ExtraInfoWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const TimeUntilArrival = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-right: 1px solid #ccc;
  padding-left: 32px;
  padding-right: 32px;
  :last-child {
    border-right: none;
  }

  * {
    margin: 0;
  }
`;

export default class TransitRow extends React.Component {
  state = {
    name: null,
    destinations: [],
    routeFetchStatus: UNINITIALIZED,
    predictionFetchStatus: UNINITIALIZED,
  };

  componentDidMount() {
    const { routeId, stopId, outboundStopId, inboundStopId } = this.props;
    this.setState({
      routeFetchStatus: STARTED,
      predictionFetchStatus: STARTED,
    });
    getRoute(routeId)
      .then(response => {
        this.setState({
          routeFetchStatus: SUCCEEDED,
          destinations: response.destinations,
          name: response.name,
        });
      })
      .catch(e => {
        console.error(e);
        this.setState({
          routeFetchStatus: FAILED,
        });
      });
    if (stopId) {
      // openTrainPredictionEventStream(routeId, stopId, data => {});
    } else if (outboundStopId && inboundStopId) {
      // openBusPredictionEventStream(
      //   routeId,
      //   { inboundStopId, outboundStopId },
      //   data => {},
      // );
    }
  }

  renderDestinationContent() {
    const { routeFetchStatus, destinations } = this.state;
    if (routeFetchStatus === STARTED || routeFetchStatus === UNINITIALIZED) {
      return <LoadingSpinner />;
    }

    if (routeFetchStatus === FAILED) {
      return <span>failed</span>;
    }

    return destinations.map((destination, directionId) => (
      <TimeUntilArrival>
        <p>{destination}</p>
        <h1>7</h1>
      </TimeUntilArrival>
    ));
  }

  render() {
    const { routeId } = this.props;
    const { name } = this.state;

    return (
      <TrasitRowWrapper>
        <LineName>{name || routeId}</LineName>
        <ExtraInfoWrapper>{this.renderDestinationContent()}</ExtraInfoWrapper>
      </TrasitRowWrapper>
    );
  }
}
