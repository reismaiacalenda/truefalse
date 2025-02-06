import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { consoleLog } from '../../../../../globals';
import { ReservaModalService } from '../../reservas/reserva-modal/reserva-modal.service';
import { Subscription } from 'rxjs';
import { ModalService } from '../../modal/modal.service';
import { WebService } from '../../../../../_services/web.service';
import { ImportarAgendaService } from '../../../../../_services/importar-agenda.service';
import { WorkspaceService } from '../../../../../_services/workspace.service';

@Component({
  selector: 'office-pass',
  templateUrl: './office-pass.component.html'
})
export class OfficePassComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  verso:boolean = false;
  @ViewChild('card', {static: false}) public card: ElementRef;

  dias_da_semana = [
    // {dia: 'D', valor: 0, tooltip: 'Domingo'},
    {dia: 'S', valor: 1, tooltip: 'Segunda-feira'},
    {dia: 'T', valor: 2, tooltip: 'Terça-feira'},
    {dia: 'Q', valor: 3, tooltip: 'Quarta-feira'},
    {dia: 'Q', valor: 4, tooltip: 'Quinta-feira'},
    {dia: 'S', valor: 5, tooltip: 'Sexta-feira'}
    // {dia: 'S', valor: 6, tooltip: 'Sábado'}
  ]


  constructor(public reservaModalService: ReservaModalService,
    public modalService: ModalService,
    public webService: WebService,
    public renderer:Renderer2,
    public importarAgendaService: ImportarAgendaService,
    public workspaceService: WorkspaceService) {
  }

  ngOnInit(){
  }

  ngOnDestroy(){
    this.subscriptions.unsubscribe();
  }

  flipCard(){
    if (this.verso){      
      this.renderer.removeClass(this.card.nativeElement, 'flipInY');
      setTimeout(()=>{
        this.renderer.removeClass(this.card.nativeElement, 'bg-radial-gradient-dark');
        this.renderer.addClass(this.card.nativeElement, 'bg-radial-gradient-primary');
        this.renderer.addClass(this.card.nativeElement, 'flipInY');
        this.verso = !this.verso;
      }, 50)
    }else{
      this.renderer.removeClass(this.card.nativeElement, 'flipInX');
      this.renderer.removeClass(this.card.nativeElement, 'flipInY');
      setTimeout(()=>{
        this.renderer.removeClass(this.card.nativeElement, 'bg-radial-gradient-primary');
        this.renderer.addClass(this.card.nativeElement, 'bg-radial-gradient-dark');
        this.renderer.addClass(this.card.nativeElement, 'flipInY');
        this.verso = !this.verso;
      }, 50)
      // flipInX animated
     
    }
  }

  diaSelecionado(value){
    // if (this.formulario.get('recorrencia').get('dias').value != undefined && 
    // this.formulario.get('recorrencia').get('dias').value.includes(value)){
    //   return true;
    // }
    return false;
  }

  adicionarRemoverDia(value){
  // consoleLog(value);
    // var arrayDias = this.formulario.get('recorrencia').get('dias').value;
    // if (this.diaSelecionado(value)){
    //   var index = arrayDias.indexOf(value, 0);
    //   if (index > -1) {
    //     arrayDias.splice(index, 1);
    //     this.formulario.get('recorrencia').get('dias').setValue(arrayDias);
    //   }
    // }else{
    //   arrayDias.push(value)
    //   arrayDias.sort();
    //   this.formulario.get('recorrencia').get('dias').setValue(arrayDias);
    // }
  }

  nomeUsuarioCaps(){
    return this.workspaceService.currentUser.name.toUpperCase();
  }

}
