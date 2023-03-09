import { Injectable } from '@angular/core';
import {AirportPaginator} from '../../models/airport-paginator.model';

@Injectable({
  providedIn: 'root'
})
export class LocalService {
  constructor() { }

  private get airportList(): AirportPaginator[] {
    const l = localStorage.getItem('airports');
    const al: AirportPaginator[] | undefined = (l) ? JSON.parse(l) : undefined;
    return al || [];
  }

  getAirports(page: number): AirportPaginator | null {
    const i = page - 1;
    const l = localStorage.getItem('airports');
    const airportsList: AirportPaginator[] = (l) ? JSON.parse(l) : [];
    if (airportsList?.length) {
      return airportsList[i];
    } else return null;
  }

  setAirports(airportPaginator: AirportPaginator, page: number) {
    const i = page - 1;
    const a = this.airportList;
    a[i] = airportPaginator;
    localStorage.setItem('airports', JSON.stringify(a));
  }
}
