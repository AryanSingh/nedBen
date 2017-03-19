import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ApiService } from '../common/services/api.service';
import { ConstantsApi }  from '../app.constant' 

@Injectable()
export class ProfileService {
  constructor(
    private http: Http,
    private apiService: ApiService
  ) {};
}

