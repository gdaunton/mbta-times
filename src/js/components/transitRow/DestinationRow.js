import React from 'react';
import styled from 'styled-components';

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
`;

const PredictionRowWrapper = styled.div`
  display: flex;
  align-items: center;
  > * {
    margin-right: 8px;
    margin-left: 8px;
  }

  > :last-child {
    margin-right: 0;
  }

  > :first-child {
    margin-left: 0;
  }
`;

export default class DestinationRow extends React.Component {
  state = {
    currentTime: new Date(),
  };

  componentDidMount() {
    setTimeout(() => {
      this.updateTime();
      this.clockInterval = setInterval(this.updateTime, 1000);
    }, new Date().getMilliseconds());
  }

  componentWillUnmount() {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
    }
  }

  updateTime = () => {
    this.setState({
      currentTime: new Date(),
    });
  };

  getMinDiff(prediction) {
    const { removePrediction } = this.props;
    const { currentTime } = this.state;
    const diffTime = prediction.departureTime.getTime() - currentTime.getTime();
    const diffMin = Math.ceil(diffTime / (1000 * 60));

    if (diffMin < 0) removePrediction(prediction.predictionId);

    return diffMin;
  }

  renderPredictions() {
    const { predictionData } = this.props;
    return (
      <PredictionRowWrapper>
        {predictionData
          .toList()
          .sort(
            (predictionA, predictionB) =>
              predictionB.departureTime - predictionA.departureTime,
          )
          .slice(-3, predictionData.size)
          .map((prediction, index, original) => {
            if (index === original.size - 1) {
              return <h1 key={prediction.id}>{this.getMinDiff(prediction)}</h1>;
            }
            return (
              <span key={prediction.id}>{this.getMinDiff(prediction)}</span>
            );
          })
          .toJS()}
      </PredictionRowWrapper>
    );
  }

  render() {
    const { destination } = this.props;
    return (
      <TimeUntilArrival>
        <p>{destination}</p>
        {this.renderPredictions()}
      </TimeUntilArrival>
    );
  }
}
