import React from 'react';
import { Map } from 'immutable';
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
import DestinationRow from './DestinationRow';

const TrasitRowWrapper = styled.div`
  width: 100%;
  background-color: #f2f3f5;
  border: 1px solid #e9eaed;
  height: 100px;
  border-radius: 8px;
  display: inline-flex;
`;

const LineName = styled.h1`
  position: relative;
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ color }) => color || '#fff'};
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
`;

const ExtraInfoWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export default class TransitRow extends React.Component {
  state = {
    name: null,
    destinations: [],
    routeFetchStatus: UNINITIALIZED,
    predictionFetchStatus: UNINITIALIZED,
    predictionData: Map(),
    type: null,
    color: null,
  };

  componentDidMount() {
    const { routeId } = this.props;

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
          color: response.color,
          type: response.type,
        });
      })
      .catch(e => {
        console.error(e);
        this.setState({
          routeFetchStatus: FAILED,
        });
      });
    this.openPredictionStream();
  }

  componentWillUnmount() {
    if (this.closeStream) this.closeStream();
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
  }

  openPredictionStream = () => {
    const { routeId, stopId, outboundStopId, inboundStopId } = this.props;

    if (stopId) {
      this.closeStream = openTrainPredictionEventStream(
        routeId,
        stopId,
        this.updatePredictionData,
        predictionId => {
          this.removePrediction(predictionId);
        },
      );
    } else if (outboundStopId && inboundStopId) {
      this.closeStream = openBusPredictionEventStream(
        routeId,
        { inboundStopId, outboundStopId },
        this.updatePredictionData,
        predictionId => {
          this.removePrediction(predictionId);
        },
      );
    }
  };

  resetReconnectionTimeout() {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    this.reconnectTimeout = setTimeout(this.openPredictionStream, 180000);
  }

  updatePredictionData = data => {
    this.resetReconnectionTimeout();
    this.setState(prevState => ({
      predictionData: prevState.predictionData.merge(data),
    }));
  };

  removePrediction = id => {
    this.resetReconnectionTimeout();
    this.setState(prevState => {
      const predictionKey = prevState.predictionData.findKey(
        prediction => prediction.predictionId === id,
      );
      return {
        predictionData: prevState.predictionData.remove(predictionKey),
      };
    });
  };

  renderDestinationContent() {
    const { routeFetchStatus, destinations, predictionData } = this.state;
    if (routeFetchStatus === STARTED || routeFetchStatus === UNINITIALIZED) {
      return <LoadingSpinner />;
    }

    if (routeFetchStatus === FAILED) {
      return <span>failed</span>;
    }

    return destinations.map((destination, directionId) => {
      const predictionsForDestination = predictionData.filter(
        prediction => prediction.direction === directionId,
      );
      return (
        <DestinationRow
          key={directionId}
          destination={destination}
          removePrediction={this.removePrediction}
          predictionData={predictionsForDestination}
        />
      );
    });
  }

  render() {
    const { routeId } = this.props;
    const { name, color } = this.state;

    return (
      <TrasitRowWrapper>
        <LineName color={color}>{name || routeId}</LineName>
        <ExtraInfoWrapper>{this.renderDestinationContent()}</ExtraInfoWrapper>
      </TrasitRowWrapper>
    );
  }
}
