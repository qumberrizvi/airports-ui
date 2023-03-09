import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {RestService} from './rest.service';
import {LocalModule} from '../local/local.module';


@NgModule({
  imports: [
    HttpClientModule,
    LocalModule,
  ],
  providers: [RestService],
})
export class RestModule {
}
