import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ForumService } from './common/forumService';
import { SessionService } from './common/sessionService';
import { TimeService } from './common/timeService';
import { ConstantsApi } from './app.constant';


@Component({
  selector: 'my-app',
  template: `<router-outlet></router-outlet>`,
  styleUrls: ['./app.scss'],
  providers: []
})
export class AppComponent implements OnInit  {
  public name = 'NedBen';

  constructor(
    public sessionService: SessionService ,
    public timeService: TimeService,
    public forumService: ForumService,
    public http: Http
  ) {}

  public ngOnInit(): void {
   }   
}
