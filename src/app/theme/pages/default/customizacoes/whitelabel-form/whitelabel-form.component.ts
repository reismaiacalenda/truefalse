import { Component } from '@angular/core';
import { consoleLog } from '../../../../../globals';
import { TfFormBaseComponent } from '../../../../../_andaime/tf-forms/tf-form-base.component';


@Component({
  selector: 'whitelabel-form',
  templateUrl:'whitelabel-form.component.html'
})

export class WhitelabelFormComponent extends TfFormBaseComponent  {
  entidade= "clientes"
  listDadosSelect = {
  }
  listCarousel = {
    'carousel_logo': {
      'fileList': {},
      'fileHolder': {}
    }
  }

  formulario= this.formBuilder.group({
    id: [null],
    primary_color: [null],
    logotipo: [null],
    carousel_logo: [null]
  })
  
  changeColor(event){
    this.formulario.controls.primary_color.setValue(event);
    
    
    this.workspaceService.workspace.primary_color = event;
    // setarCarouselSituacao('cor_livre')
    // https://sass-lang.com/documentation/breaking-changes/css-vars
  }
}