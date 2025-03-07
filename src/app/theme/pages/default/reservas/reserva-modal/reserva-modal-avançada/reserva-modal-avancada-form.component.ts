import { Validators, FormGroup, FormArray } from '@angular/forms';
import { Component } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../_andaime/tf-forms/tf-form-base.component';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Helpers } from '../../../../../../helpers';
import { RecursoFormComponent } from '../recursos/recursos-form.component';
import { ConvidadoFormComponent } from '../convidados/convidados-form.component';
import { ReservaModalService } from '../reserva-modal.service';
import { consoleLog } from '../../../../../../globals';
import { ValidateEmailSelectMulti, ValidateEmail } from '../../../../../../_andaime/tf-validators/email.validators';
import { Observable, Subject, concat, of } from 'rxjs';
import { distinctUntilChanged, debounceTime, tap, switchMap, catchError, map } from 'rxjs/operators';

@Component({
  selector: 'reserva-modal-avancada-form',
  templateUrl: 'reserva-modal-avancada-form.component.html'
})
export class ReservaModalAvancadaFormComponent extends TfFormBaseComponent {
  // public verificarCampos: Observable<any> = this.getCamposRecursos();
  isMobile:boolean = Helpers.isMobile();
  listSalas: any[];
  entidade="reservas"  
  listDadosSelect = {
    'espacos': [],
    // 'funcionarios': [],
    'recursos': [],
  }

  istDadosSelect = {
    'list_vinculados': [],
  }
  desabiltar;
  titulo;
  localizacao;
  atual_reserva_id;
  campoAlterado = "";
  reservaModalService:ReservaModalService;
  data_fim_bkp;
  hr_fim_bkp;
  vinculos_removidos:string;
  vinculos_removidos_array = [];
  inputsDeCalculo : Subject<string> = new Subject();
  
  formulario = this.formBuilder.group({
    montar_tela: this.formBuilder.group({
      anfitriao: [false]
    }),
    dia_todo: [false]
  })
  
  aba1 = this.formBuilder.array([        
    this.formulario.get('data_inicio'),
    this.formulario.get('data_fim'),
    this.formulario.get('hr_inicio_previsto'),
    this.formulario.get('hr_fim_previsto'),
    this.formulario.get('dia_todo'),
    this.formulario.get('qtd_convidados'),
    this.formulario.get('periodo_indeterminado'),
    this.formulario.get('criador_id_substituto'),
    this.formulario.get('anfitriao_id_substituto'),
    this.formulario.get('convidados'),
    this.formulario.get('convidados_emails'),
    this.formulario.get('anfitriao_email'),
    this.formulario.get('espacos_reserva_attributes'),
    this.formulario.get('recursos_reservas_attributes'),
    this.formulario.get('exibir_gastos'),
    this.formulario.get('assunto'),
    this.formulario.get('generate_link_conference'),
    this.formulario.get('calendario_conference_url'),
    this.formulario.get('private_subject')
  ])
  
  aba2 = this.formBuilder.array([
    this.formulario.get('observacao')
  ])

  abas = [
    // {"icon":"flaticon-calendar-1", "formArray": this.aba1, "requisicaoTabulada": this.verificarCampos },
    {"icon":"flaticon-calendar-1", "formArray": this.aba1},
    {"icon":"flaticon-list", "formArray": this.aba2 }
];

  // formulario = this.formBuilder.group({
  //   id: [null],
  //   espaco_id: [null],
  //   assunto: [null],
  //   data: [null], // this.data
  //   hr_inicio_previsto: [null], // [this.dateTime],
  //   hr_fim_previsto: [null],
  //   criador_id: [this.workspaceService.currentUser.id],
  //   anfitriao_id: [null],
  //   funcionarios_attributes: this.prepararFormArraySelectMultiploSemRequired(), //this.initFormArrayName('funcionarios_attributes'), // Inserido após bugs Sprint_2.23
  //   recursos_reservados_attributes: this.initFormArrayName('recursos_reservados_attributes'),
  //   quantidade_participantes: [null],
  //   observacao: [null],
  //   amenities: [null],
  //   // origem: [null],
  //   // recorrencia: this.formBuilder.array([]),
  //   // funcionarios_reservas_attributes: this.initFormArrayName('funcionarios_reservas_attributes'),
  // })

  // formulario = this.formBuilder.group({
  //   id: [null],
  //   espaco_id: [null],
  //   assunto: [null],
  //   qtd_convidados: [null], // espacos_reservas
  //   convidados_attributes: this.initFormArrayName('convidados_attributes'), // espacos_reservas
  //   recursos_reservados_attributes: this.initFormArrayName('recursos_reservados_attributes'),
  //   reserva_attributes: this.formBuilder.group({
  //     hr_inicio_previsto: [null],
	//     hr_fim_previsto: [null],
	//     data_inicio: [null],
	//     data_fim: [null],
	//     criador_id: [this.workspaceService.currentUser.id],
	//     anfitriao_id: [null],
	//     dia_todo: [null],
	//     observacao: [null],
	//     campos_customizados: this.initFormArrayName('campos_customizados')
  //   })
  // })

  listVinculados() {
    this.webService.get(`recursos/list_vinculados`)
      .subscribe(dados => {
        consoleLog(dados)
        this.listSelectVinculados = (<any>dados).recursos
        consoleLog("listSelectVinculados")
        consoleLog(this.listSelectVinculados)
      });    
  }

  listSelectVinculados: any[];

  childInit(){
    this.inscricaoAlterarCampos();
    this.preencherListSala();
    this.loadConvidados();
    this.definirObrigatoriedade();
    this.listVinculados();
    // this.desabilitarCampoAnfitriao();
  }

  ngAfterViewInit(): void {
    this.renderer.addClass(this.element.nativeElement.parentElement, 'animated-50')
    this.renderer.addClass(this.element.nativeElement.parentElement, 'fadeIn');
    $('.ng-select.ng-select-multiple .ng-select-container')[0].style['min-height'] = '96px';
    $('.ng-select.ng-select-multiple .ng-select-container .ng-value-container')[0].style['margin-top'] = '50px'
  }

  definirObrigatoriedade(){
    this.formulario.get('espaco_id').setValidators([Validators.required])
    this.formulario.get('espaco_id').updateValueAndValidity();
  }

  inscricaoAlterarCampos(){
    this.subscriptions.add(
      this.inputsDeCalculo.pipe(
        debounceTime(600),
        distinctUntilChanged()
      ).subscribe(response=>{
      // consoleLog("deobounce");
      // consoleLog(response);
        var body = {
          espaco_id: this.formulario.get('espaco_id').value,      
          // pessoa_id: this.formulario.get('pessoa_id').value,      
          // recurso_id: this.formulario.get('recurso_id').value,      
          data: this.formulario.get('data_inicio').value,
          hr_inicio_previsto: this.formulario.get('hr_inicio_previsto').value,
          hr_fim_previsto: this.formulario.get('hr_fim_previsto').value,
          data_fim: this.formulario.get('data_fim').value,
          qtd_convidados: this.formulario.get('qtd_convidados').value,
          rr_attributes: JSON.stringify(this.formulario.get('recursos_reservas_attributes').value),
          recorrencia: this.formulario.get('recorrencia').value,
          desconto: this.formulario.get('desconto').value,
          tela: this.reservaModalService.tela,
          dia_todo: this.formulario.get('dia_todo').value,
          campo_alterado: this.campoAlterado,
          vinculos_removidos: this.vinculos_removidos,
          recalculando: true,
          calendario_conference_url: this.formulario.get('calendario_conference_url').value,
          generate_link_conference: this.formulario.get('generate_link_conference').value
        }
        this.reservaModalService.chamarNew(body);
      })
    )

    this.subscriptions.add(
      this.formulario.controls['espaco_id'].valueChanges.subscribe(
        response=>{
          // if (this.formulario.get('id').value == undefined){
            if (this.formulario.value['espaco_id'] != response && this.reservaModalService.flagNewSendoSetada == false){
              this.campoAlterado = 'espaco_id'
              this.inputsDeCalculo.next(response);
            }
          // }
      })
    )
    this.subscriptions.add(
      this.formulario.controls['data_inicio'].valueChanges.subscribe(
        response=>{
          // if (this.formulario.get('id').value == undefined){
            if (this.formulario.value['data_inicio'] != response && this.reservaModalService.flagNewSendoSetada == false){
              this.campoAlterado = 'data_inicio'
              this.inputsDeCalculo.next(response);
            }
          // }
      })
    )
    this.subscriptions.add(
      this.formulario.controls['hr_inicio_previsto'].valueChanges.subscribe(
        response=>{
          // if (this.formulario.get('id').value == undefined){
            if (this.formulario.value['hr_inicio_previsto'] != response && this.reservaModalService.flagNewSendoSetada == false){
              this.campoAlterado = 'hr_inicio_previsto'
              this.inputsDeCalculo.next(response);
            }
          // }
      })
    )
    this.subscriptions.add(
      this.formulario.controls['data_fim'].valueChanges.subscribe(
        response=>{
          // if (this.formulario.get('id').value == undefined){
            if (this.formulario.value['data_fim'] != response && this.reservaModalService.flagNewSendoSetada == false){
              this.campoAlterado = 'data_fim'
              this.inputsDeCalculo.next(response);
            }
          // }
      })
    )
    this.subscriptions.add(
      this.formulario.controls['hr_fim_previsto'].valueChanges.subscribe(
        response=>{
          // if (this.formulario.get('id').value == undefined){
            if (this.formulario.value['hr_fim_previsto'] != response && this.reservaModalService.flagNewSendoSetada == false){
              this.campoAlterado = 'hr_fim_previsto'
              this.inputsDeCalculo.next(response);
            }
          // }
      })
    )
    this.subscriptions.add(
      this.formulario.controls['dia_todo'].valueChanges.pipe().subscribe(
        response=>{
          // if (this.formulario.get('id').value == undefined){
            if (this.formulario.value['dia_todo'] != response && this.reservaModalService.flagNewSendoSetada == false){
              this.campoAlterado = 'dia_todo'
              this.inputsDeCalculo.next(response.toString());
            }
          // }
      })
    )
    this.subscriptions.add(
      this.formulario.controls['qtd_convidados'].valueChanges.pipe().subscribe(
        response=>{
          // if (this.formulario.get('id').value == undefined){
            if (this.formulario.value['qtd_convidados'] != response && this.reservaModalService.flagNewSendoSetada == false){
              this.campoAlterado = 'qtd_convidados'
              this.inputsDeCalculo.next(response);
            }
          // }
      })
    )
    // this.subscriptions.add(
      // this.formulario.controls['recorrencia'].valueChanges.pipe().subscribe(
      //   response=>{
      //     // if (this.formulario.get('id').value == undefined){
      //       if (this.formulario.value['recorrencia'] != response && this.reservaModalService.flagNewSendoSetada == false){
      //         this.campoAlterado = 'recorrencia'
      //         this.inputsDeCalculo.next(response);
      //       }
      //     // }
      // })
    // )
    this.subscriptions.add(
      this.formulario.controls['desconto'].valueChanges.subscribe(
        response=>{
        // consoleLog("value changed")
          // if (this.formulario.get('id').value == undefined){
          // consoleLog("rowId null")
            if (this.formulario.value['desconto'] != response && this.reservaModalService.flagNewSendoSetada == false){
            // consoleLog("valor realmente mudou, chamando new")
              this.campoAlterado = 'desconto';
              this.inputsDeCalculo.next(response);
            }
          // }
      })
    )
    // this.subscriptions.add(
    // this.formulario.controls['data_inicio'].valueChanges.subscribe(
    //   response=>{
    //     if (this.formulario.get('id').value == undefined){
    //       if (this.formulario.value['data_inicio'] != response){
    //         this.reservaModalService.chamarNew();
    //       }
    //     }
    // )
  }

  // adicionarRecursos(){
  //   Helpers.setLoading(true);
  //   this.reservaModalService.abrirModalAddRecursos()
  //     .then((resultadoModal) => {
  //       consoleLog(this.formulario);
  //       this.inicializarFormService();
  //       Helpers.setLoading(false)
  //     })
  // }

  // adicionarConvidados(){
  //   Helpers.setLoading(true);
  //   this.reservaModalService.abrirModalAddConvidados()
  //     .then((resultadoModal) => {
  //       this.inicializarFormService();
  //       Helpers.setLoading(false)
  //     })
  // }

  adicionarRecorrencia(){
    Helpers.setLoading(true);
    this.reservaModalService.abrirModalRecorrencia()
      .then((resultadoModal) => {
        this.inicializarFormService();
        Helpers.setLoading(false)
      })
  }

  initItemRows(){
    return this.formBuilder.group({
      recurso_id: [null],
      quantidade: [null]
    })
  }

  getCamposCustomizadosControls(){
    return (this.formulario.get('campos_customizados_reservas_attributes') as unknown as FormArray).controls
  }

  // desabilitarAnfitriao(){    
  //   consoleLog(this.formulario.get('montar_tela').value.anfitriao);
  //   if (this.formulario.get('montar_tela').value.anfitriao == false){
  //     this.desabiltar = "true"
  //   }else {
  //     this.desabiltar = "false"
  //   }
  //   consoleLog(this.desabiltar);
  //   return this.desabiltar;
  // }

  desabilitarCampoAnfitriao(){
    if (this.formulario.get('montar_tela').value.anfitriao == false){
      this.formulario.get('anfitriao_id').disable();
    }
  }

  setarDiaTodo(){
    if (this.formulario.get('dia_todo').value == true){
      this.formulario.get('dia_todo').setValue(false);
      // this.formulario.get('hr_fim_previsto').setValue(this.hr_fim_bkp);
      // this.formulario.get('data_fim').setValue(this.data_fim_bkp);
    }else{
      this.formulario.get('dia_todo').setValue(true);
      // this.data_fim_bkp = this.formulario.get('data_fim').value;
      // this.hr_fim_bkp = this.formulario.get('hr_fim_previsto').value;
      // this.formulario.get('data_fim').setValue(this.formulario.get('data_inicio').value);
      // this.formulario.get('hr_fim_previsto').setValue('23:59');
    }
  }

  validacao(){
    // if (value != undefined && value != [])
  // consoleLog(this.formulario.get('convidados_emails').value);
    ValidateEmailSelectMulti(this.formulario.get('convidados_emails'));
    this.formulario.updateValueAndValidity();
  }

  validacaoAnfitriao(){
    ValidateEmail(this.formulario.get('anfitriao_email'))
  }

  convidados$: Observable<any[]>;
  convidadosLoading = false;
  convidadosInput$ = new Subject<string>();

  trackByFn(item: any) {
    return item.id;
  }

  private loadConvidados() {
    this.convidados$ = concat(
        of([]), // default items
        this.convidadosInput$.pipe(
            distinctUntilChanged(),
            debounceTime(500),
            tap(() => this.convidadosLoading = true),
            switchMap(term => this.webService.get('funcionarios/list', {q: term})
            .pipe(
                map(r=>{return r.funcionarios}),
                catchError(() => of([])), // empty list on error
                tap(() => this.convidadosLoading = false)
            ))
        )
    );
  }

  preencherListSala(){
    this.webService.get(`espacos/list_andaime`, {tipo_espaco: 'sala'})
    .subscribe(dados => {
      consoleLog(dados)
      this.listSalas = (<any>dados).espacos
      consoleLog("listSelectEspacos")
      consoleLog(this.listSalas)
    });
  }

  selecaoRecurso(event,i){
    if (this.reservaModalService.flagNewSendoSetada == false){
      this.campoAlterado = `recurso.id=#${event}`
      this.inputsDeCalculo.next(event+i);
    }
  }

  alterarQuantidade(event, i){
    if (this.reservaModalService.flagNewSendoSetada == false){
      this.campoAlterado = 'recurso.quantidade'
      this.inputsDeCalculo.next(event+i);
    }
  }

  deleteRow(itemrow, index){
    if (this.reservaModalService.flagNewSendoSetada == false){
      this.campoAlterado = `recurso.delecao=#${index}`
      super.deleteRow(itemrow, index);
      if (itemrow.value.vinculavel != undefined && itemrow.value.vinculavel == true){
        this.vinculos_removidos_array.push(itemrow.value.recurso_id);
        this.vinculos_removidos = this.vinculos_removidos_array.join(',');
      }
      this.inputsDeCalculo.next(itemrow.value.recurso_id+index);
    }
  }

  removeItem(lote){
    if(lote) {
      this.formService.remove(this.rowId, true)
    } else {
      this.reservaModalService.tratarCancelamentoReserva(this.rowId, this.activeModal);
    }
  }

  // hrInicioChanged(event){
  //   var novoHorario;
  //   if (event.split(':')[0] == "23"){
  //     novoHorario = '23:59';
  //   }else{
  //     novoHorario = moment(`2000-01-01T${event}`).add(1,'hour').format('HH:mm')
  //   }
  //   if (this.formulario.get('dia_todo').value != true){
  //     this.formulario.get('hr_fim_previsto').setValue(novoHorario);
  //   }else{
  //     this.hr_fim_bkp = novoHorario
  //   }
  // }

  // hrFimChanged(event){

  // }

  // descontar(event){
  //   var subtotal = this.formulario.get('subtotal').value
  //   var desconto = this.formulario.get('desconto').value;
  // // consoleLog(subtotal.value);
  //   if (subtotal < desconto){
  //   // consoleLog("oi")
  //     desconto = subtotal;
  //   }
  //   this.formulario.get('total_a_pagar').setValue(subtotal-desconto);
  //   // if (total.value)
  // }

}