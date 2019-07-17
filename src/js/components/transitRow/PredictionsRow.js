import React from 'react';
import styled from 'styled-components';
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

export default class PredictionsRow extends React.Component {
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

  render() {
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
}
