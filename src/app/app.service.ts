import { Injectable, OnInit, OnChanges, Input } from '@angular/core';
import { Http } from '@angular/http';



@Injectable()
export class AppService {
  constructor(
    public http: Http
  ) {};

}

