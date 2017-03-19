import { NgModule, CUSTOM_ELEMENTS_SCHEMA }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { DetailsComponent }    from './details.component';
import { DetailsService } from './details.service';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    DetailsComponent
  ],
  providers: [DetailsService],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class DetailsModule {}