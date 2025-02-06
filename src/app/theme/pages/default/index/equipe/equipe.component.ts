import { Component, Input, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { consoleLog } from '../../../../../globals';
import { Subscription } from 'rxjs';
import { ModalService } from '../../modal/modal.service';
import { WebService } from '../../../../../_services/web.service';
import { WorkspaceService } from '../../../../../_services/workspace.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'equipe',
  styleUrls: ["./equipe.component.scss"],
  // encapsulation: ViewEncapsulation.Emulated,
  templateUrl: './equipe.component.html'
})
export class EquipeComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();

  grupo_id;
  formulario= this.formBuilder.group({
    data: [(new Date).toLocaleDateString("PT")],
    grupo_id: [null]
    // pessoas: this.formBuilder.array([])
  })

  grupos: any[];
  pessoas: any[];
  currentPessoa;

  constructor(public modalService: ModalService,
    public webService: WebService,
    public formBuilder: FormBuilder,
    public workspaceService: WorkspaceService) {
  }

  ngOnInit(){
    this.carregarListGrupos();
  }

  ngOnDestroy(){
    // this.subscriptions.unsubscribe();
  }

  carregarListGrupos(){
    this.webService.get(`grupos/list_meus_grupos`)
       .subscribe(
         dados => {
          this.grupos = dados.grupos;
          if (this.grupos != undefined){
            this.formulario.get('grupo_id').setValue(this.grupos[0].id);
          }
          this.carregarPessoas();
          consoleLog("Como está vindo o dados do pessoa")
          consoleLog(dados)
          consoleLog("Como está vindo o dados.servicos do pessoa")
          consoleLog(this.pessoas)
          // this.atual_reserva_id = dados.body.servicos.pessoas.atual_reserva_id
          // consoleLog("Como está vindo o 'atual_reserva_id' do pessoa")
          // consoleLog(this.atual_reserva_id)
          Helpers.setLoading(false)
         },
         (error: any) => {
           this.modalService.tratarError(error)
           Helpers.setLoading(false);
         }
       )
  }

  carregarPessoas(event?){
    if(!this.workspaceService.autorizar('pessoa_visualizar_meu', 'pessoa_visualizar_grupo', 'pessoa_visualizar_unidade')){return;}
    // var body = {
    //   data: this.formulario.get('data').value,
    //   // unidade: 2
    // }
    // if (this.formulario){
    //   // body["pessoas"] = this.formulario.get("pessoas_attributes").value
    // }

    
    var body = this.formulario.value;
    if (event){
      consoleLog('eveeenot');
      consoleLog(event);
      body.grupo_id = event.value
    }
    
    this.webService.put(`funcionarios/quadro`, body)
       .subscribe(
         dados => {
          this.pessoas = dados.body.grupos[0].funcionarios;
          this.coletarSituacaoCurrentUser();
          consoleLog("Como está vindo o dados do pessoa")
          consoleLog(dados)
          consoleLog("Como está vindo o dados.servicos do pessoa")
          consoleLog(this.pessoas)
          // this.atual_reserva_id = dados.body.servicos.pessoas.atual_reserva_id
          // consoleLog("Como está vindo o 'atual_reserva_id' do pessoa")
          // consoleLog(this.atual_reserva_id)
          Helpers.setLoading(false)
         },
         (error: any) => {
           this.modalService.tratarError(error)
           Helpers.setLoading(false);
         }
       )
  }

  coletarSituacaoCurrentUser(){
    this.pessoas.forEach(pessoa => {
      if (pessoa.id == this.workspaceService.currentUser.id){
        this.currentPessoa = pessoa;
      }
    });
  }


}
