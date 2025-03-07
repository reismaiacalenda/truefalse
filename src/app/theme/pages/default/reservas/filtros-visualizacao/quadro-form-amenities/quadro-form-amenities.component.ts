import { Helpers } from '../../../../../../helpers';
import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../_andaime/tf-forms/tf-form-base.component';
import { FileHolder } from 'angular2-image-upload';
// import { LayoutPortaFormComponent } from '../../../cadastro/layout/layout-porta/layout-porta-form/layout-porta-form.component';
import { consoleLog } from '../../../../../../globals';

@Component({
  selector: 'quadro-form-amenities',
  templateUrl: 'quadro-form-amenities.component.html'
})

export class QuadroFormAmenitiesComponent extends TfFormBaseComponent implements OnInit {
  @ViewChild('selectAmenities', {static: false}) public selectAmenities: ElementRef;
  
  listAmenities() {
    this.webService.get(`amenities/list_andaime`)
    .subscribe(dados => {
      consoleLog(dados)
      this.listSelectAmenities = (<any>dados).amenities
      consoleLog("listSelectAmenities no listAmenities")
      consoleLog(this.listSelectAmenities)
    });    
  }
  
  listSelectAmenities: any[];

  formulario= this.formBuilder.group({
    amenities_attributes: this.initFormArrayName('amenities_attributes'),
  })

  aplicarFiltroAmenity(){
    this.activeModal.close(this.formulario);
  }
  initItemRows(){
    return this.formBuilder.group({
      id: [null],
      quantity: [1]    
    })
  }

  childInit(){
    consoleLog("child init")
    this.listAmenities();
  }
}
