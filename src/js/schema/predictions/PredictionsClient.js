import { Map } from 'immutable';
const BASE_URL = 'http://localhost:8000';

const parseDataItem = data => {
  const tripId = data.relationships.trip.data.id;
  const routeId = data.relationships.route.data.id;
  const direction = data.attributes.direction_id;
  const arrivalTime = new Date(data.attributes.arrival_time);
  const departureTime = new Date(data.attributes.departure_time);
  return Map().set(tripId, {
    id: tripId,
    routeId,
    direction,
    arrivalTime,
    departureTime,
  });
};

const parsePredictionsIntoList = data => {
  return data.reduce((acc, value) => {
    const tripId = value.relationships.trip.data.id;
    const arrivalTime = new Date(value.attributes.arrival_time);
    if (!acc.has(tripId) || acc.getIn([tripId, 'arrivalTime']) < arrivalTime) {
      return acc.set(tripId, parseDataItem(value).get(tripId));
    }
    return acc;
  }, Map());
};

export const openTrainPredictionEventStream = (routeId, stopId, callback) => {
  let errorCount = 0;
  const source = new EventSource(
    `${BASE_URL}/predictions?filter[route]=${routeId}&filter[stop]=${stopId}`,
  );
  source.addEventListener('update', event => {
    callback(parseDataItem(JSON.parse(event.data)));
  });
  source.addEventListener('add', event => {
    callback(parseDataItem(JSON.parse(event.data)));
  });
  source.addEventListener('reset', event => {
    callback(parsePredictionsIntoList(JSON.parse(event.data)));
  });
  source.onerror = () => {
    if (errorCount > 2) {
      source.close();
    }
    errorCount++;
  };
  return source.close;
};

export const openBusPredictionEventStream = (
  routeId,
  { inboundStopId, outboundStopId },
  callback,
) => {
  let errorCount = 0;
  const source = new EventSource(
    `${BASE_URL}/predictions?filter[route]=${routeId}&filter[stop]=${inboundStopId},${outboundStopId}`,
  );
  source.addEventListener('update', event => {
    callback(parseDataItem(JSON.parse(event.data)));
  });
  source.addEventListener('add', event => {
    callback(parseDataItem(JSON.parse(event.data)));
  });
  source.addEventListener('reset', event => {
    callback(parsePredictionsIntoList(JSON.parse(event.data)));
  });
  source.onerror = () => {
    if (errorCount > 2) {
      source.close();
    }
    errorCount++;
  };

  return source.close;
};
