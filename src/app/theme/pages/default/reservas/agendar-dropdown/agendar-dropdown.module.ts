import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgendarDropdownComponent } from './agendar-dropdown.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    InlineSVGModule.forRoot(),
    NgbModule,
    RouterModule
  ],
  declarations: [
    AgendarDropdownComponent
  ],
  exports: [
    AgendarDropdownComponent
  ],
  entryComponents: [
    AgendarDropdownComponent
  ]
})
export class AgendarDropdownModule { }
