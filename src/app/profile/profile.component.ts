import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { ApiService } from '../common/services/api.service';
import { SearchService } from '../common/services/search.service';
import { ProfileService } from './profile.service';
import { ConstantsApi } from '../app.constant';
import { AppService } from '../app.service';

@Component({
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class ProfileComponent implements OnInit {
	constructor(
    public apiService: ApiService,
    public searchService: SearchService,
    public profileService: ProfileService,
    public http: Http,
    public appService: AppService,
    private router: Router
  ) {}

  
	

	ngOnInit(): void {
    
	}
  
}
