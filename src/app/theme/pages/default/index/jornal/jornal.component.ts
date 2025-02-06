import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { consoleLog } from '../../../../../../app/globals';
import { ReservaModalService } from '../../reservas/reserva-modal/reserva-modal.service';
import { Subscription } from 'rxjs';
import { ModalService } from '../../modal/modal.service';
import { WebService } from '../../../../../_services/web.service';
import { ImportarAgendaService } from '../../../../../_services/importar-agenda.service';

@Component({
  selector: 'jornal',
  templateUrl: './jornal.component.html'
})
export class JornalComponent implements OnInit, OnDestroy {
  @Input() cssClasses = '';
  private subscriptions: Subscription = new Subscription();
  jornal: any;
  flagInicioInscricao = false;

  constructor(public reservaModalService: ReservaModalService,
    public modalService: ModalService,
    public webService: WebService,
    public importarAgendaService: ImportarAgendaService) {
  }

  ngOnInit(){
    this.coletarJornal();
    this.observarImportarAgenda();
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
          this.coletarJornal();
        }
      });
  }

  openFormModalEdit(rowId: string) {
    consoleLog("open form modal edit");
    Helpers.setLoading(true);
    this.webService.get(`reservas/${rowId}/edit`)
    .subscribe(
      dados => {
        this.reservaModalService.fabricarAssessorista(dados.tipo_reserva, dados.tela, dados)
        .subscribe(resultadoModal=>{
          if (resultadoModal == true){
            this.coletarJornal();
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

  coletarJornal(){
    consoleLog("chamou o coletar jornal")
    Helpers.setLoading(true);
    this.subscriptions.add(
      this.webService.get('reservas/jornal')
        .subscribe( dados => {      
            this.jornal = dados.jornal;
            consoleLog("recebeu coletar jornal")
            Helpers.setLoading(false)
          },
          (error: any) => {
            this.modalService.tratarError(error)
            Helpers.setLoading(false);
          }
        )
      )
  }

  observarImportarAgenda(){
    this.subscriptions.add(
      this.importarAgendaService.observarImportacao$
        .subscribe(item=>{
          consoleLog("veio aqui");
          if (this.flagInicioInscricao == false){
            this.flagInicioInscricao = true;
          }else {
            this.coletarJornal();
          }
        })
    )
  }

  ngOnDestroy(){
    this.subscriptions.unsubscribe();
  }
}
