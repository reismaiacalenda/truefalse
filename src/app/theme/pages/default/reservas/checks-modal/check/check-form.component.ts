import { Component } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../_andaime/tf-forms/tf-form-base.component';
import { CheckModalService } from '../check-modal.service';

@Component({
  selector: 'check-form',
  templateUrl: 'check-form.component.html'
})
export class CheckFormComponent extends TfFormBaseComponent {
  
  entidade="checks";
  checkModalService:CheckModalService;
  
  formulario = this.formBuilder.group({
  })

  childInit(){
  }

}