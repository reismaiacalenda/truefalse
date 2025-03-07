import { Component, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { Helpers } from '../../../helpers';
import { globals } from '../../../globals';
import { WorkspaceService } from '../../../_services/workspace.service';
import { LoadingService } from '../../../_services/loading.service';

@Component({
  selector: 'tf-form-simples',
  templateUrl: './tf-form-simples.component.html',
  standalone: false
})

export class TfFormSimplesComponent {
  @Input() autorizar_excluir: any[];
  @Input() activeModal: NgbActiveModal;
  @Input() formGroup: FormGroup;
  @Input() title: string;
  @Input() titlePersonalizado: string;
  @Input() disableTitle = false;
  @Input() disableHeader = false;
  @Input() cancelar = true;
  @Input() salvar = "Salvar";
  @Input() titleCancelar = "Cancelar";  
  @Input() rowId: number;
  @Input() id: boolean;
  @Input() habilitarExcluir: boolean = true;
  @Input() habilitarSalvar: boolean = true;
  @Input() textoBotaoAlternativo: string = "";
  @Output() submeter = new EventEmitter();
  @Output() excluir = new EventEmitter();
  @Output() botaoAlternativo = new EventEmitter();
  public preTitle: string;
  private currentUser;

  constructor(public formBuilder: FormBuilder,
    public workspaceService: WorkspaceService,
    public loadingService: LoadingService
    ){
    this.currentUser = this.workspaceService.currentUser;
  }

  verificarPreTitle(){
    if (!this.disableTitle){
      if(this.formGroup.value.id == undefined || this.formGroup.value.id == 0 || this.formGroup.value.id == "0"){
        this.preTitle = "Criar";
      }
      else {
        this.preTitle = "Editar"; 
      }
      return this.preTitle;
    }
    return this.titlePersonalizado;
  }

  autorizarExcluir(){
    var flagRetorno:boolean = false;
    if (this.autorizar_excluir != undefined){
      (<any[]>this.autorizar_excluir).forEach(pf => {
        if (this.workspaceService.autorizar(pf) == true){
          flagRetorno = true;
        }
      })
    }
    return flagRetorno;
  }

  debugGlobal = globals.debug;

}