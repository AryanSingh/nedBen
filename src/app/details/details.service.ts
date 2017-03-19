import { Injectable, Input } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { ApiService } from '../common/services/api.service';
import { ConstantsApi }  from '../app.constant' ;
import { AppService } from '../app.service';

@Injectable()
export class DetailsService {
  constructor(
    private http: Http,
    public apiService: ApiService,
    public appService: AppService
  ) {};
}

