import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule }    from '@angular/http';
import 'hammerjs';
import { AppComponent }  from './app.component';
import { AppService } from './app.service';
import { HomeModule } from './home/home.module';
import { HomeComponent } from './home/home.component';
import { forumService } from './common/forumService';
import { sessionService } from './common/sessionService';
import { timeService } from './common/timeService';

import { PathLocationStrategy, LocationStrategy, HashLocationStrategy } from '@angular/common';
import '../styles/styles.scss';

const Allroutes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full'},
  { 
    path: 'home',
    component: HomeComponent 
  },
  { path: '**', component: HomeComponent }
];

export class MyHammerConfig extends HammerGestureConfig  {
  overrides = <any>{
      // override hammerjs default configuration
      'pan': {threshold: 5},
      'swipe': {
           velocity: 0.4,
           threshold: 20,
           direction: 31 // /!\ ugly hack to allow swipe in all direction
      }
  }
}

@NgModule({
  imports:      [ BrowserModule,
                  HomeModule,
                  RouterModule.forRoot(Allroutes)
                ],

  declarations: [
                  AppComponent
                ],
  providers: [ forumService , sessionService , timeService, {provide: LocationStrategy, useClass: HashLocationStrategy}, { 
                    provide: HAMMER_GESTURE_CONFIG, 
                    useClass: MyHammerConfig 
                } ],
  bootstrap:    [ AppComponent ],
  exports:[
    RouterModule
  ]
})

export class AppModule {
  constructor(
      private appService: AppService
    ) {}
}
