import {Component, OnInit, OnDestroy} from "@angular/core";
import {RestService} from '../../services/rest/rest.service';
import {AirportPaginationMeta} from '../../models/airport-pagination-meta.model';
import {Airport} from '../../models/airport.model';
import {TabDirective} from 'ngx-bootstrap/tabs';

@Component({
  selector: "app-index",
  templateUrl: "index.component.html"
})
export class IndexComponent implements OnInit, OnDestroy {
  page = 1;
  pagination!: AirportPaginationMeta;
  airports!: Airport[];
  allAirports!: Airport[];
  loader = true;
  query!: string;
  shouldFetchMore = true;

  constructor(
    private readonly airportsService: RestService,
  ) {
  }

  ngOnInit() {
    const body = document.getElementsByTagName("body")[0];
    body.classList.add("index-page");
    this.getAirports();
  }

  searchAirports(): void {
    if (this.query) {
      this.airports = this.allAirports
        .filter(airport => airport.airport_name
          .toLowerCase()
          .includes(this.query.toLowerCase()));
    } else {
      this.setInitialAirports();
    }
  }

  tabChange(tab: TabDirective, airport: Airport): void {
    const tabName = tab.heading?.toLowerCase();
    const isMapTab = tabName === 'map';
    const foundAirport = this.airports.find((a) => a.id == airport.id);
    if (!foundAirport) return;
    foundAirport.isMapActive = isMapTab;
    if (!isMapTab) {
      airport.mapLoaded = false;
    }
  }

  mapLoaded(airport: Airport): void {
    airport.mapLoaded = true;
  }

  getAirports(): void {
    this.airportsService.airports().subscribe({
      next: ({data: airports, pagination}) => {
        this.allAirports = airports;
        this.setInitialAirports();
        this.pagination = pagination;
        this.loader = false;
        this.checkShouldFetchMore();
        this.fetchFiveMoreAirports();
      },
      error: (err) => {
        console.error('error', err);
      }
    })
  }

  setInitialAirports(): void {
    this.airports = this.allAirports.slice(0, 12);
  }

  fetchFiveMoreAirports() {
    if (this.page < 5 && this.shouldFetchMore) {
      this.page++;

      this.airportsService.airports(this.page)
        .subscribe({
          next: ({data: airports, pagination}) => {
            this.allAirports.push(...airports);
            this.pagination = pagination;
            this.checkShouldFetchMore();
          }
        });
      this.fetchFiveMoreAirports();
    }
  }

  checkShouldFetchMore(): void {
    this.shouldFetchMore = this.pagination.count == this.pagination.limit;
  }

  ngOnDestroy() {
    const body = document.getElementsByTagName("body")[0];
    body.classList.remove("index-page");
  }
}
