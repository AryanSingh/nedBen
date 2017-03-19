import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LocationStrategy } from '@angular/common';
import { Http, Response } from '@angular/http';
import { ApiService } from '../common/services/api.service';
import { SearchService } from '../common/services/search.service';
import { PaymentsService } from './payments.service';
import { ConstantsApi }  from '../app.constant';
import { AppService } from '../app.service';
import { FormsModule } from '@angular/forms';



@Component({
  templateUrl: './payments.html',
  styleUrls: ['./payments.scss'],
  providers: [PaymentsService]
})
export class PaymentsComponent implements OnInit {

	constructor(
    public apiService: ApiService,
    public searchService: SearchService,
    public paymentsService: PaymentsService,
    private http: Http,
    public route: ActivatedRoute,
    private router: Router,
    public location: LocationStrategy,
    public appService: AppService,
   
  ) {}

  
	ngOnInit(): void {
	}
}
