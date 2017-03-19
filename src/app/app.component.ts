import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ApiService } from './common/services/api.service';
import { SearchService } from './common/services/search.service';
import { AppService } from './app.service';
import { ConstantsApi } from './app.constant';


@Component({
  selector: 'my-app',
  template: `<router-outlet></router-outlet>`,
  styleUrls: ['./app.scss'],
  providers: [ApiService, SearchService, AppService]
})
export class AppComponent implements OnInit  {
  public name = 'Tenant Dashboard for Grexter Customers';

  constructor(
    public apiService: ApiService,
    public searchService: SearchService,
    public http: Http,
    public appService: AppService
  ) {}

  public ngOnInit(): void {
   }   
}
