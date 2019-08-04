import { get } from '../lib/requestor';
import { BUS, TRAIN } from '../constants/TransitType';

const descriptionToTransitType = description => {
  if (description.toLowerCase().includes('bus')) {
    return BUS;
  }
  return TRAIN;
};

export const getRoute = id =>
  get(`/routes/${id}`).then(response => {
    return {
      name: response.data.attributes.short_name,
      destinations: response.data.attributes.direction_destinations,
      type: descriptionToTransitType(response.data.attributes.description),
      color: `#${response.data.attributes.color.toLowerCase()}`,
    };
  });
