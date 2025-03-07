import { Observable } from 'rxjs';
import { User } from '../../../../../../auth/_models/user';
import { Helpers } from '../../../../../../helpers';
import { FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ModalService } from '../../../modal/modal.service';
import { DomainService } from '../../../../../../_services/domain.service';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WorkspaceService } from '../../../../../../_services/workspace.service';
import { consoleLog } from '../../../../../../globals';

@Component({
  templateUrl: "espontanea-modal.html",
  selector: 'espontanea-modal'
})
export class EspontaneaModalComponent implements OnInit {
  private apiUrl: string;
  public espaco_id: number;
  public horariosTermino:string[];

  public bloquearSubmit: boolean = false;
  @ViewChild('dia', {static: false}) public dia: ElementRef;
  @ViewChild('hrinicio', {static: false}) public hrinicio: ElementRef;
  @ViewChild('hrfim', {static: false}) public hrfim: ElementRef;
  @ViewChild('funcionarios', {static: false}) funcionarios;
  @ViewChild('organizadores', {static: false}) organizadores;
  @ViewChild('espacos', {static: false}) espacos;
  @ViewChild('turmas', {static: false}) turmas;
  public user: User;
  public organizador: string;
  public autor: string;
  public reserva;

  constructor(private http: HttpClient,
    public activeModal: NgbActiveModal,
    private _sanitizer: DomSanitizer,
    private modalNgb: NgbModal,
    private modalService: ModalService,
    public workspaceService: WorkspaceService,
    private _script: ScriptLoaderService,
    private domainService: DomainService) {
    this.user = this.workspaceService.currentUser;
    this.apiUrl = `${domainService.getApiUrl()}/qrcalenda`;

    this.reserva = {
      assunto: this.user.fullName,
      // data: (new Date).toLocaleDateString("PT"),
      // hr_inicio: "08:00",
      hr_fim: null,
      finalidade: "reunião",
      // turma: null,
      origem: "Porta",
      // motivo_cancelamento: null,
      espaco_id: null,
      // funcionario_ids: null,
      organizador_id: this.user.id,
      autor_id: this.user.id,
    };
  }

  ngOnInit() {
    Helpers.setLoading(true);
    this.montarHorarios();
    // this.showForm();
    // this.popularLists();
  }

  ngAfterViewInit(){
    this.reserva.espaco_id = this.espaco_id;
    // this._script.load('espontanea-form',
    // 'assets/demo/default/custom/components/forms/widgets/select2.js');
    // this._script.load('espontanea-form',
    // 'assets/demo/default/custom/components/forms/widgets/bootstrap-timepicker.js');
    // this._script.load('espontanea-form',
    // 'assets/demo/default/custom/components/forms/widgets/bootstrap-datepicker.js');
  }

  onSubmit(form) {
    Helpers.setLoading(true);
    consoleLog(form);
    consoleLog(this.reserva);
    this.bloquearSubmit = true;
    // Helpers.setLoading(true);
    // consoleLog(this.reserva.data);
    // consoleLog(this.dia.nativeElement.value);
    // this.reserva.data = this.dia.nativeElement.value;
    // this.reserva.hr_inicio = this.hrinicio.nativeElement.value;
    // this.reserva.hr_fim = this.hrfim.nativeElement.value;
    // this.reserva.organizador_id = Array.apply(null,this.organizadores.nativeElement)  // convert to real Array
    //   .filter(option => option.selected)
    //   .map(option => Number(option.attributes.v.value))[0]
    // this.reserva.funcionario_ids = Array.apply(null,this.funcionarios.nativeElement)  // convert to real Array
    //   .filter(option => option.selected)
    //   .map(option => Number(option.attributes.v.value))
    // this.reserva.espaco_id = Array.apply(null,this.espacos.nativeElement)  // convert to real Array
    //   .filter(option => option.selected)
    //   .map(option => Number(option.attributes.v.value))[0]

    // if(this.reserva.finalidade == 'aula'){
    //   this.reserva.turma = Array.apply(null,this.turmas.nativeElement)  // convert to real Array
    //     .filter(option => option.selected)
    //     .map(option => option.attributes.v.value)[0]
    // }else{
    //   this.reserva.turma = null;
    // }

    // consoleLog(this.reserva);
    // // consoleLog(this.funcionarios.nativeElement.options);
    // // consoleLog(this.reserva);
    // // consoleLog(form);

    // if (form.valid) {
    var header = new HttpHeaders();
    header.append('Content-Type', 'application/json');
    var body = (this.reserva);

    //   // if (this.rowId == null) {
    this.postForm(header, body);
    //   // } else {
    //   //   this.putForm(header, body);
    //   // }
    // }else{
    //   this.verificarValidacoesForm(form);
    //   Helpers.setLoading(false);
    //   this.bloquearSubmit = false;
    // }

  }

  postForm(header, body) {
    this.http.post(`${this.apiUrl}.json`,
      body, { headers: header, observe: 'response' })
      .subscribe(
      (response) => {
        Helpers.setLoading(false);
        this.bloquearSubmit = false;
        this.modalService.tratarSucesso(response, this.activeModal);
      },
      (error: any) => {
        Helpers.setLoading(false);
        this.bloquearSubmit = false;
        this.modalService.tratarError(error);
      }
    );
  }

  montarHorarios() {
    this.http.get(`${this.apiUrl}/${this.espaco_id}/opcoesHrFim.json`)
      // FIX
      .subscribe(
        dados => {
          this.horariosTermino = (<any>dados).opcoesHrFim;
          this.reserva.hr_fim = this.horariosTermino[0];
          // this.
          this.reserva = dados;
          consoleLog(dados);
          this.bloquearSubmit = true;
          Helpers.setLoading(false);
        }
      );
  }

  verificarValidacoesForm(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(campo => {
      let control = formGroup.get(campo);
      control.markAsDirty();
      if (control instanceof FormGroup) {
        this.verificarValidacoesForm(control);
      }
    })
  }

  validarCss(control) {
    return {
      // 'has-danger': this.formulario.get(control).touched
      //   && this.formulario.get(control).invalid,
      // 'has-success': this.formulario.get(control).touched
      //   && this.formulario.get(control).valid
    }
  }
}
