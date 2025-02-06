import { Validators, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../../_andaime/tf-forms/tf-form-base.component';
import { consoleLog } from '../../../../../../../globals';

@Component({
  selector: 'amenities-installed-form',
  templateUrl:'amenities-installed-form.component.html'
})
export class AmenitiesInstalledFormComponent extends TfFormBaseComponent  {
  entidade= "amenities"
  listDadosSelect = {
  }
  listSelectAmenities: any[];

  istDadosSelect = {
    'list_amenities': [],
  }

  formulario= this.formBuilder.group({
    id: [null],
    recurso_id: [null],
    recurso_nome: [null],
    quantity: [null]
  })

  childInit(){
    this.listAmenities();
  }

  listAmenities() {
    this.webService.get(`recursos/list_amenities`)
      .subscribe(dados => {
        consoleLog(dados)
        this.listSelectAmenities = (<any>dados).recursos
        consoleLog("listSelectAmenities")
        consoleLog(this.listSelectAmenities)
      });    
  }

  onSubmit() {
    let recurso_nome =  this.listSelectAmenities[0]['children'].find(a => a['id'] === parseInt(this.formulario.get('recurso_id').value))['text']
    this.formulario.get('recurso_nome').setValue(recurso_nome)
    this.activeModal.close(this.formulario);
  }
}