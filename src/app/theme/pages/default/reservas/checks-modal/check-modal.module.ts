import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '../../../../layouts/layout.module';
import { HttpClientModule } from '@angular/common/http';
import { AndaimeModule } from '../../../../../_andaime/andaime.module';
import { CheckFormComponent } from './check/check-form.component';
import { CheckModalService } from './check-modal.service';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    LayoutModule,
    HttpClientModule,
    AndaimeModule,
    ReactiveFormsModule
  ],
  exports: [
    CheckFormComponent
  ],
  declarations: [
    CheckFormComponent
  ],
  providers: [
    CheckModalService
  ],
  entryComponents: [  
    CheckFormComponent
  ]
})
export class CheckModalModule { }