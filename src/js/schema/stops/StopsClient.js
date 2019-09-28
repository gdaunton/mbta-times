import { get } from '../lib/requestor';

export const getStopName = id =>
  get(`/stops/${id}`).then(response => {
    return {
      name: response.data.attributes.name,
    };
  });
