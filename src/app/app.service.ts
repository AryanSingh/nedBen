import { Injectable, OnInit, OnChanges, Input } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { ApiService } from './common/services/api.service';
import { SearchService } from './common/services/search.service';
import { ConstantsApi }  from './app.constant';



@Injectable()
export class AppService {
  constructor(
    public http: Http,
    public apiService: ApiService,
    public searchService: SearchService,
  ) {};

  public getData( url: any, callback:any): void {
      this.http.get(url)
         .map(res => res.json())
         .subscribe(
            data => callback(data),
            err => console.log(err),
            () => console.log('api call completed')
          );
      console.log("we are reaching getData method of AppService");
  }

  public postData( url: any, postBody: any, callback: any): void {
    this.http.post(url, postBody,callback)
       .map(res => res.json())
       .subscribe(
          data => callback(data),
          err => console.log(err),
          () => console.log('api call completed')
        );
    console.log("we are reaching postData method of appService");
  }

}

