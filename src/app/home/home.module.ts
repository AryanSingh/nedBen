import { NgModule, CUSTOM_ELEMENTS_SCHEMA }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { HomeComponent }    from './home.component';



@NgModule({
  imports: [
    
  ],
  declarations: [
    HomeComponent
  ],
  providers: [],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class HomeModule {}