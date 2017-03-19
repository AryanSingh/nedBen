import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule }    from '@angular/http';
import 'hammerjs';
import { AppComponent }  from './app.component';
import { AppService } from './app.service';
import { ConstantsApi } from './app.constant';
import { ApiService } from './common/services/api.service';
import { SearchService } from './common/services/search.service';
import { ContactModule } from './contact/contact.module';
import { DetailsModule } from './details/details.module';
import { PaymentsModule } from './payments/payments.module';
import { ProfileModule } from './profile/profile.module';
import { RequestsModule } from './requests/requests.module';
import { RouterModule, Routes } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { PaymentsComponent } from './payments/payments.component';
import { ProfileComponent } from './profile/profile.component';
import { RequestsComponent } from './requests/requests.component';


import { PathLocationStrategy, LocationStrategy, HashLocationStrategy } from '@angular/common';
import '../styles/styles.scss';

const Allroutes: Routes = [
  { path: '', redirectTo: 'details', pathMatch: 'full'},
  { 
    path: 'details',
    component: DetailsComponent 
  },
  { path: 'payments', component: PaymentsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'requests', component: RequestsComponent },
  { path: '**', component: DetailsComponent }

  
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
                  ReactiveFormsModule,
                  HttpModule,
                  DetailsModule,
                  PaymentsModule,
                  ProfileModule,
                  RequestsModule,
                  RouterModule.forRoot(Allroutes)
                ],

  declarations: [
                  AppComponent
                ],
  providers: [ ApiService, SearchService, AppService, {provide: LocationStrategy, useClass: HashLocationStrategy}, { 
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
