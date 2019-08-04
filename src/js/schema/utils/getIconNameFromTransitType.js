import { BUS, TRAIN } from '../constants/TransitType';
import { faBus, faSubway } from '@fortawesome/free-solid-svg-icons';

export const getIconNameFromTransitType = transitType => {
  switch (transitType) {
    case BUS:
      return faBus;
    case TRAIN:
      return faSubway;
    default:
      return null;
  }
};
