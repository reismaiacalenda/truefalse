import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { consoleLog } from '../../../../../globals';
import { ReservaModalService } from '../../reservas/reserva-modal/reserva-modal.service';
import { Subscription } from 'rxjs';
import { ModalService } from '../../modal/modal.service';
import { WebService } from '../../../../../_services/web.service';
import { ImportarAgendaService } from '../../../../../_services/importar-agenda.service';
import { WorkspaceService } from '../../../../../_services/workspace.service';

@Component({
  selector: 'jornal-servicos-recursos',
  templateUrl: './jornal-servicos-recursos.component.html'
})
export class JornalServicosRecursosComponent implements OnInit, OnDestroy {
  @Input() cssClasses = '';
  @Output() refreshData = new EventEmitter();
  private subscriptions: Subscription = new Subscription();
  jornal: any;
  flagInicioInscricao = false;
  diaSelecionado = new Date().getDate() - 1;
  date = new Date().toLocaleString('pt-BR', {timeZone: 'UTC'}).split(' ')[0];

  constructor(public reservaModalService: ReservaModalService,
    public modalService: ModalService,
    public webService: WebService,
    public importarAgendaService: ImportarAgendaService,
    public workspaceService: WorkspaceService) {
  }

  ngOnInit(){
    // this.coletarJornal();
    // this.observarImportarAgenda();
  }

  montarBodyAgendar(){
    return {
      tela: 'dashboard_'
    }
  }

  openModalDetalhe(id){
    this.reservaModalService.abrirModalDetalheReserva(id)
      .subscribe(resultado=>{
        consoleLog("retornando do edit do card")
        consoleLog(resultado);
        if (resultado == true){
          this.refreshData.emit(true);
          // this.coletarJornal();
        }
      });
  }

  ngOnDestroy(){
    this.subscriptions.unsubscribe();
  }
}
