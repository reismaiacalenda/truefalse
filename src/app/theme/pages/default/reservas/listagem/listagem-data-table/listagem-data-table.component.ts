import { Component } from '@angular/core';
// import { ReservaFormComponent } from '../espaco-form/espaco-form.component';
import { TfDatatableBase } from '../../../../../../_andaime/tf-datatable/tf-datatable-base';
import { Helpers } from '../../../../../../helpers';
import { consoleLog, globals } from '../../../../../../globals';
import { Subscription } from 'rxjs';
import { ReservaModalService } from '../../reserva-modal/reserva-modal.service';
import { DomainService } from '../../../../../../_services/domain.service';
import { DatatableService } from '../../../../../../_services/datatable.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WebService } from '../../../../../../_services/web.service';
import { ModalService } from '../../../modal/modal.service';
import { WorkspaceService } from '../../../../../../_services/workspace.service';
import { CheckModalService } from '../../checks-modal/check-modal.service';
import { ActivatedRoute } from '@angular/router';
import { GerarQrCodeModalService } from '../../../gerar-qrcode/gerar-qrcode.service';
import { ImportarAgendaService } from '../../../../../../_services/importar-agenda.service';
import { LoadingService } from '../../../../../../_services/loading.service';

@Component({
  selector: 'listagem-data-table',
  templateUrl:'listagem-data-table.component.html'
})
export class ListagemDataTableComponent extends TfDatatableBase {
  entidade= "reservas";
  contentFormModal = {}
  datatableMultipla = true;
  listFiltros = {};
  isMobile: boolean = Helpers.isMobile();
  
  constructor(public datatableService: DatatableService,
    public modalNgb: NgbModal,
    public webService: WebService,
    public modalService: ModalService,
    public workspaceService: WorkspaceService,
    public gerarQrCodeService: GerarQrCodeModalService,
    public route: ActivatedRoute,
    public reservaModalService: ReservaModalService,
    public checkModalService: CheckModalService,
    public loadingService: LoadingService,
    private importarAgendaService: ImportarAgendaService){
    super(datatableService, modalNgb, webService, modalService, workspaceService, gerarQrCodeService, route, loadingService);
  }  

  childInit(){
    this.montarListFiltros();
    //this.observarImportarAgenda();
  }

  montarListFiltros(){
    this.webService.get('filtros/list_andaime.json')
      .subscribe(
        response=>{
          this.listFiltros = response.filtros
        }
      )
  }

  toggleExpandRow(row, expanded, dt) {
    if (expanded == false){
      this.datatableService.show(row, dt)
    }else{
      dt.rowDetail.toggleExpandRow(row)
    }
  }

  alterarFiltro(event){
    consoleLog(event)
    this.filtro_id = event;
    this.refreshTable();
  }

  alteracaoCollapse(event){
    Helpers.setLoading(true);
    var elementI = event.target.querySelector('i');
    var elementFoco = event.target;
    if (elementI != null){
      if (elementI.classList.contains('la-angle-down')){
          elementI.classList.remove('la-angle-down');
          elementI.classList.add('la-angle-right');
      } else{
          elementI.classList.remove('la-angle-right');
          elementI.classList.add('la-angle-down');
      }
    } else{
      if (elementFoco.classList.contains('la-angle-down')){
        elementFoco.classList.remove('la-angle-down');
        elementFoco.classList.add('la-angle-right');
      } else{
        elementFoco.classList.remove('la-angle-right');
        elementFoco.classList.add('la-angle-down');
      }
    }
    Helpers.setLoading(false);
  }

  parametrizacoes(){
    this.reservaModalService.parametrizacoes()
  }

  openCheckModal(espaco_id){
    Helpers.setLoading(true);
    consoleLog("Entrou na openCheckModal")
    consoleLog(espaco_id)
    this.checkModalService.fabricarModalCheckEspaco(espaco_id)
      .subscribe(
        (resultadoModal)=>{
          if (resultadoModal){
            this.refreshTable();
          }
        Helpers.setLoading(false)
        },
        (error: any) => {
          this.modalService.tratarError(error)
          Helpers.setLoading(false);
        }
      )
  }

  openFormModalEdit(rowId: string) {
    consoleLog("open form modal edit");
    Helpers.setLoading(true);
    this.webService.get(`reservas/${rowId}/edit`)
    .subscribe(
      dados => {
      consoleLog(dados);
        this.reservaModalService.fabricarAssessorista(dados.tipo_reserva, dados.tela, dados)
        .subscribe(resultadoModal=>{
          if (resultadoModal == true){
            this.refreshTable();
          }
        });
        Helpers.setLoading(false)
      },
      (error: any) => {
        this.modalService.tratarError(error)
        Helpers.setLoading(false);
      }
    )
  }

  cancelarReserva(id, lote){
    if (lote == true) {
      this.datatableService.remove(id, lote);
    } else {
      this.reservaModalService.tratarCancelamentoReserva(id).then(
        respostaModal => {
          if (respostaModal == true) {  
            this.refreshTable();
          }
        }
      );
    } 
  }

  observarImportarAgenda(){
    this.subscriptions.add(
      this.importarAgendaService.observarImportacao$
        .subscribe(item=>{
          consoleLog("veio aqui");
          this.refreshTable();
        })
    )
  }

  montarBodyAgendar(){
    return {
      tela: 'listagem_'
    }
  }

  aprovar_solicitacao(id){
    Helpers.setLoading(true);
    this.webService.put(`reservas/${id}/aprovar_solicitacao`, {})
      .subscribe(
        response =>{
          this.modalService.tratarMensagem(response.body.titulo, response.body.corpo)
          Helpers.setLoading(false);
          this.refreshTable();
        },
        (error) => {
          Helpers.setLoading(false);
          this.modalService.tratarError(error);
        }
      )
  }

  reprovar_solicitacao(id){
    Helpers.setLoading(true);
    this.webService.put(`reservas/${id}/reprovar_solicitacao`, {})
      .subscribe(
        response =>{
          this.modalService.tratarMensagem(response.body.titulo, response.body.corpo)
          Helpers.setLoading(false);
          this.refreshTable();
        },
        (error) => {
          Helpers.setLoading(false);
          this.modalService.tratarError(error);
        }
      )
  }

}