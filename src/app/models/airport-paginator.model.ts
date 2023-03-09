import {AirportPaginationMeta} from './airport-pagination-meta.model';
import {Airport} from './airport.model';

export class AirportPaginator {
  pagination!: AirportPaginationMeta;
  data!: Airport[];
}
