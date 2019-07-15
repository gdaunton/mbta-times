const BASE_URL = 'http://localhost:8000';

export const openTrainPredictionEventStream = (routeId, stopId, callback) => {
  const source = new EventSource(
    `${BASE_URL}/predictions/${routeId}/${stopId}`,
  );
  source.onmessage = function(event) {
    callback(event.data);
  };
};

export const openBusPredictionEventStream = (
  routeId,
  { inboundStopId, outboundStopId },
  callback,
) => {
  const source = new EventSource(
    `${BASE_URL}/predictions/${routeId}/${inboundStopId}/${outboundStopId}`,
  );
  source.onmessage = function(event) {
    callback(event.data);
  };
};
