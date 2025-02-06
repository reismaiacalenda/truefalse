import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { consoleLog } from '../../../../../globals';
import { ReservaModalService } from '../../reservas/reserva-modal/reserva-modal.service';
import { Subscription } from 'rxjs';
import { ModalService } from '../../modal/modal.service';
import { WebService } from '../../../../../_services/web.service';
import { WorkspaceService } from '../../../../../_services/workspace.service';

@Component({
  selector: 'degustacao',
  templateUrl: './degustacao.component.html'
})
export class DegustacaoComponent implements OnInit, OnDestroy {
  @Input() cssClasses = '';
  private subscriptions: Subscription = new Subscription();
  degustacao:any;

  constructor(public reservaModalService: ReservaModalService,
    public modalService: ModalService,
    public webService: WebService,
    public workspaceService: WorkspaceService) {
    }
    
  ngOnInit(){
  }

  ngOnDestroy(){
    this.subscriptions.unsubscribe();
  }

  iniciarDegustacao(){
    this.modalService.tratarConfirmacao("Iniciar degustação",
      "Gostaria de experimentar o plano Pro por 8 dias?")
      .then(response=>{
        if (response == true){
          Helpers.setLoading(true);
          this.webService.put(`clientes/${this.workspaceService.workspace.id}/experimentar_pro`,{})
            .subscribe(
              dados => {
                Helpers.setLoading(false);
                this.workspaceService.workspace = dados;
                this.modalService.tratarMensagem('Degustação ativada!',
                  'Tudo certo. O Calenda está gratuitamente disponível por 8 dias para você e sua equipe experimentarem. Aproveitem!')
                  .then(()=>{
                    window.location.reload(true);
                  })

              },
              (error: any) => {
                this.modalService.tratarError(error)
                Helpers.setLoading(false);
              }
            )
        }
      })
    // this.subscriptions.add(
    // this.webService.get('reservas/degustacao')
    //   .subscribe( dados => {      
    //       this.degustacao = dados;
    //     Helpers.setLoading(false)
    //     },
    //     (error: any) => {
    //       this.modalService.tratarError(error)
    //       Helpers.setLoading(false);
    //     }
    //   )
    // )
  }
}
