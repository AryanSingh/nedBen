import { NgModule, CUSTOM_ELEMENTS_SCHEMA  }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentsComponent }    from './payments.component';
import { PaymentsService } from './payments.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [
    PaymentsComponent
  ],
  providers: [ PaymentsService ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class PaymentsModule {}