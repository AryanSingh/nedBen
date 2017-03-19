import { Injectable, Input } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { ApiService } from '../common/services/api.service';
import { ConstantsApi }  from '../app.constant';

@Injectable()
export class PaymentsService {
  constructor(
    private http: Http,
    private apiService: ApiService
  ) {};

}
