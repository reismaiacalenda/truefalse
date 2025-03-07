// import { Validators, FormGroup } from '@angular/forms';
import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WebService } from '../../../../../../_services/web.service';
import { Helpers } from '../../../../../../helpers';
import { Subscription } from 'rxjs';

declare function montarTreeLocalizacoes(data: any);

@Component({
  selector: 'modal-selecionar-localizacao',
  templateUrl: 'modal-selecionar-localizacao.component.html'
})
export class ModalSelecionarLocalizacaoComponent implements OnInit, AfterViewInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  public localizacoes:any[];
  public currentLocalizacaoId;
  public currentLocalizacaoName;
  public categoria = '';

  constructor(public activeModal: NgbActiveModal,
    public webService: WebService,
    private route: ActivatedRoute){}

  ngOnInit(){
    this.carregarLocalizacoes();
    this.inscreverOpcaoSelecionada()
  }
  
  ngAfterViewInit(){
  }

  carregarLocalizacoes(){
    this.categoria = this.route.snapshot.queryParams['categoria'] || '';
    console.log(this.categoria);
    this.subscriptions.add(
      this.webService.get(`localizacoes/list_localizacoes_tree_modal.json`, {categoria: this.categoria})
        .subscribe((dados:any) => {
          this.localizacoes = dados.localizacoes;
          montarTreeLocalizacoes(this.localizacoes);
          Helpers.setLoading(false);
        }
      )
    )
  }

  inscreverOpcaoSelecionada(){
    $('#kt_tree_localizacoes').on("select_node.jstree",
      (e, data) => {
        this.currentLocalizacaoId = data.node.original.id;
        this.currentLocalizacaoName = data.node.original.full_text
      }
    )
  }

  aplicarLocalizacao(){
    Helpers.setLoading(true);
    this.cachearLocalizacaoSelecionada();
    this.activeModal.close({
      id: this.currentLocalizacaoId,
      text: this.currentLocalizacaoName
    });
  }

  cachearLocalizacaoSelecionada(){
    localStorage.setItem(`localizacao_${this.categoria}_id`, this.currentLocalizacaoId);
    localStorage.setItem(`localizacao_${this.categoria}_text`, this.currentLocalizacaoName);
  }
  
  onSubmit() {
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }
}