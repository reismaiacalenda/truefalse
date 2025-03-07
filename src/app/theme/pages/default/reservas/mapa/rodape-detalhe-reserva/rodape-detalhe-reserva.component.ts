// import { Validators, FormGroup } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterViewChecked, OnDestroy, Renderer2, Output, EventEmitter, Input } from '@angular/core';
// import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { LoadingService } from '../../../../../../_services/loading.service';
import { consoleLog } from '../../../../../../globals';
import { Helpers } from '../../../../../../helpers';
import { CheckModalService } from '../../checks-modal/check-modal.service';
import { ReservaModalService } from '../../reserva-modal/reserva-modal.service';

declare function montarTreeLocalizacoes(data: any);

@Component({
  selector: 'rodape-detalhe-reserva',
  templateUrl: 'rodape-detalhe-reserva.component.html'
})
export class RodapeDetalheReservaComponent implements OnInit, AfterViewInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  @ViewChild('rodapeDetalhe', {static: false}) public rodape: ElementRef;
  @Input() espacoSelecionado;
  @Input() data;
  @Input() hora = "";
  @Output() modalFechada = new EventEmitter<any>();
  @Output() reservaEncerrada = new EventEmitter<any>();
  loading: boolean = false;
  rodapeAberto: boolean = false;
  dataCalendario: any;

  constructor(public renderer:Renderer2,
    public checkModalService: CheckModalService,
    private loadingService: LoadingService,
    public reservaModalService: ReservaModalService){}

  ngOnInit(){
    this.dataCalendario = {
      assunto: "Feedback 360º",
      slot: "30 min",
      anfitriao: {
        name: "Lucas Maia",
        email: "lucas@reismaia.com",
        avatar_hair: 16,
        avatar_clothes: 5,
        avatar_extra: 5,
        avatar_body: 5,
        situacao: "ocupado"
      }
    }
  }
  
  ngAfterViewInit(){
    
  }

  onSubmit() {
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  abrirRodape(){
    Helpers.setLoading(true);
    consoleLog("como estão as propriedes")
    consoleLog(this.data);
    if (this.rodapeAberto == true){
      Helpers.setLoading(false);
      return;
    };
    this.rodapeAberto = true;
    this.renderer.removeClass(this.rodape.nativeElement, 'slideOutDown');
    this.renderer.addClass(this.rodape.nativeElement, 'slideInUp');
    this.renderer.removeClass(this.rodape.nativeElement, 'd-none'); 
    setTimeout(()=>{
      Helpers.setLoading(false);
    },751);
  }

  fecharRodape(){
    if (this.rodapeAberto == false){return};
    this.rodapeAberto = false;
    this.renderer.removeClass(this.rodape.nativeElement, 'slideInUp');
    this.renderer.addClass(this.rodape.nativeElement, 'slideOutDown');
    setTimeout(()=>{
      this.renderer.addClass(this.rodape.nativeElement, 'd-none'); 
      this.modalFechada.emit(true);
    },751)
  }

  encerrarReserva(){
    this.loading = true;
    Helpers.setLoading(true);
    this.checkModalService.fabricarModalCheckEspaco(this.espacoSelecionado.id)
      .subscribe((resultadoModal)=>{
        if (resultadoModal){
          consoleLog("reservaEncerrada")
          this.reservaEncerrada.emit(true);
          this.fecharRodape();
        }
        this.loading = false;
      },
      error=>{
        this.loading = false;
      }
      )
    // this.reservaCancelada.emit(true);
  }

  confirmarReserva(){
    this.loading = true;
    Helpers.setLoading(true);
    consoleLog('confirmarreserva')
    this.checkModalService.fabricarModalCheckEspaco(this.espacoSelecionado.id)
      .subscribe((resultadoModal)=>{
        if (resultadoModal){
          consoleLog("reservaEncerrada")
          this.reservaEncerrada.emit(true);
          this.fecharRodape();
        }
        this.loading = false;
      },
      error=>{
        this.loading = false;
      }
      )
  }

  cancelarReserva(){
    this.loading = true;
    Helpers.setLoading(true);
    this.reservaModalService.tratarCancelamentoReserva(this.espacoSelecionado.atual_reserva_id).then(
      respostaModal => {
        consoleLog("ooooi")
        if (respostaModal == true) {  
          Helpers.setLoading(false);
          this.reservaEncerrada.emit(true);
          this.fecharRodape();
          this.loading = false;
        }else{
          consoleLog("oooonde aqui?")
          Helpers.setLoading(false);
          this.reservaEncerrada.emit(false);
          this.fecharRodape();
          this.loading = false;
        }
      }
    );
    // this.reservaCancelada.emit(true);
  }
}