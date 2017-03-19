import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Http } from '@angular/http';
import { ApiService } from '../common/services/api.service';
import { SearchService } from '../common/services/search.service';
import { DetailsService } from './details.service';
import { Observable } from 'rxjs/Observable';
import { Router, Resolve, RouterStateSnapshot,
         ActivatedRoute, RouterModule, Routes } from '@angular/router';
import 'rxjs/add/operator/pluck';
import { AppService } from '../app.service';
import cloneDeep from 'lodash/cloneDeep';
import forEach from 'lodash/forEach';
import { ConstantsApi } from '../app.constant';

@Component({
  templateUrl: './details.html',
  styleUrls: ['./details.scss']
})

export class DetailsComponent implements OnInit{
  

	constructor(
    public apiService: ApiService,
    public searchService: SearchService,
    public detailsService: DetailsService,
    public appService: AppService,
    public http: Http,
    public route: ActivatedRoute,
  ) {}

 
 
	ngOnInit(){
    
	}
}
