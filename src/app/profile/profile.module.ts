import { NgModule,  CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { ProfileComponent }    from './profile.component';
import { ProfileService } from './profile.service';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    ProfileComponent
  ],
  providers: [ ProfileService ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ProfileModule {}