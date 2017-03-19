import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { THREAD_MANAGEMENT_URLS, ENV}  from '../../../app.constant';
import { $WebSocket } from 'angular2-websocket/angular2-websocket';
import { SessionService } from '../common/sessionService';

@Component({
  selector: 'footer',
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss']
})
export class FooterComponent implements OnInit {
    private ENV:any;
    private THREAD_MANAGEMENT_URLS:any;

    constructor(
        private http: Http,
        private session: SessionService 
    ){};

    ngOnInit(): void {
        this.ENV = ENV;
        this.THREAD_MANAGEMENT_URLS = THREAD_MANAGEMENT_URLS;
    }

    
}

 


