import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Helpers } from '../../../../../../helpers';
import { ReservaModalService } from '../../reserva-modal/reserva-modal.service';
import { Subscription } from 'rxjs';
import { ModalService } from '../../../modal/modal.service';
import { WebService } from '../../../../../../_services/web.service';
import moment from 'moment';
import { AdicionarCalendarioPessoaComponent } from '../adicionar-calendario-pessoa/adicionar-calendario-pessoa.component';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AdicionarCalendarioSalaComponent } from '../adicionar-calendario-sala/adicionar-calendario-sala.component';
import { AdicionarCalendarioMesaComponent } from '../adicionar-calendario-mesa/adicionar-calendario-mesa.component';
import { WorkspaceService } from '../../../../../../_services/workspace.service';

@Component({
  selector: 'selecao-agendas',
  templateUrl: './selecao-agendas.component.html',
  // styleUrls: ['./selecao-agendas.component.scss']
})
export class SelecaoAgendasComponent implements OnInit {
  private subscriptions: Subscription = new Subscription();
  expandido1: boolean = true;
  expandido2: boolean = true;
  expandido3: boolean = true;
  expandido4: boolean = true;
  expandido5: boolean = true;
  listAgendasSelecionadas: any[];
  agendaIdsHabilitados:any[] = [];
  @Output() refreshCalendario = new EventEmitter();
  
  constructor(public modalService: ModalService,
    public webService: WebService,
    public workspaceService: WorkspaceService,
    public modalNgb: NgbModal) {

  }

  ngOnInit(){
    this.montarSelecao();
  }

  montarSelecao(){
    this.webService.get(`agendas`)
      .subscribe(
        (response) => {
          Helpers.setLoading(false);
          this.listAgendasSelecionadas = response.agendas;
          this.agendaIdsHabilitados = response.agenda_ids_habilitados
          this.refreshCalendario.emit(this.agendaIdsHabilitados);
        },
        (error: any) => {
          this.modalService.tratarError(error);
          Helpers.setLoading(false);
        }
      );
  }

  adicionarCalendarioPessoa(){
    Helpers.setLoading(true);
    let ngbModalOptions: NgbModalOptions={
      backdrop: 'static',
      keyboard: false
    }
    let modal = this.modalNgb.open(AdicionarCalendarioPessoaComponent, ngbModalOptions);
    modal.result.then(
      (response)=>{
        this.montarSelecao();
      }
    );
  }
  
  adicionarCalendarioSala(){
    Helpers.setLoading(true);
    let ngbModalOptions: NgbModalOptions={
      backdrop: 'static',
      keyboard: false
    }
    let modal = this.modalNgb.open(AdicionarCalendarioSalaComponent, ngbModalOptions);
    modal.result.then(
      (response)=>{
        this.montarSelecao();
      }
    );
  }

  adicionarCalendarioMesa(){
    Helpers.setLoading(true);
    let ngbModalOptions: NgbModalOptions={
      backdrop: 'static',
      keyboard: false
    }
    let modal = this.modalNgb.open(AdicionarCalendarioMesaComponent, ngbModalOptions);
    modal.result.then(
      (response)=>{
        this.montarSelecao();
      }
    );
  }

  adicionarCalendarioRecurso(){
    Helpers.setLoading(true);
    let ngbModalOptions: NgbModalOptions={
      backdrop: 'static',
      keyboard: false
    }
    // let modal = this.modalNgb.open(AdicionarCalendarioRecursoComponent, ngbModalOptions);
    // modal.result.then(
    //   (response)=>{
    //     this.montarSelecao();
    //   }
    // );
  }

  checklistAlterado(valor, agenda_id){
    this.webService.put(`agendas/${agenda_id}`, {habilitado: valor})
    .subscribe(
      (response) => {
        Helpers.setLoading(false);
        // this.listAgendasSelecionadas = response.agendas;
        this.agendaIdsHabilitados = response.agenda_ids_habilitados
        this.refreshCalendario.emit(this.agendaIdsHabilitados);
      },
      (error: any) => {
        this.modalService.tratarError(error);
        Helpers.setLoading(false);
      }
    );
  }
}