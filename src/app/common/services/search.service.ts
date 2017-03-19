import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { ApiService } from './api.service';

@Injectable()
export class SearchService {
  areas: any;
  constructor(
    private http: Http,
    private apiService: ApiService
  ) { };


  public sendContactUsDetails(formData: any, callback: any): void {
     let url = 'contactUsApi';
     this.apiService.getData(url, formData, function(result: any){
         console.log(result);
         callback(result);
     });
  }

  setAreas(items: any): void {
     this.areas = items;
  }

  getAreas(): any {
     return this.areas;
  }

}
