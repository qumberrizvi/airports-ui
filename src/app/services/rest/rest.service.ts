import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {endpoints} from '../../constants/endpoints.constant';
import {AirportPaginator} from '../../models/airport-paginator.model';
import {catchError, map, Observable, of, throwError} from 'rxjs';
import {LocalService} from '../local/local.service';

@Injectable()
export class RestService {

  constructor(
    private readonly httpClient: HttpClient,
    private readonly localService: LocalService,
  ) {
  }

  airports(page = 1, limit = 100): Observable<AirportPaginator> {
    const a = this.localService.getAirports(page);
    if (a) {
      return of(a);
    }

    return this.httpClient.get<AirportPaginator>(
      `${environment.baseUrl}${endpoints.airports}?page=${page}&limit=${limit}`
    ).pipe(
      map((airportPaginator) => {
        this.localService.setAirports(airportPaginator, page);
        return airportPaginator;
      }),
      catchError((err) => {
        console.error('error', err);
        return throwError(err);
      }),
    );
  }
}
