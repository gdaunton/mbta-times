import { get } from '../lib/requestor';

export const getRoute = id =>
  get(`/routes/${id}`).then(response => {
    return {
      name: response.data.attributes.short_name,
      destinations: response.data.attributes.direction_destinations,
    };
  });
