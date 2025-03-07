import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ModalService } from '../../../modal/modal.service';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { DomainService } from '../../../../../../_services/domain.service';
import { Helpers } from '../../../../../../helpers';
import { User } from '../../../../../../auth/_models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WorkspaceService } from '../../../../../../_services/workspace.service';
import { consoleLog } from '../../../../../../globals';

@Component({
  selector: 'painel-form',
  templateUrl: 'painel-form.html'
})
export class PainelFormComponent implements OnInit {
  selectedPrototypeSelector;
  public modalTitle: string;
  public formulario: FormGroup;
  public flagPc: boolean = true;
  private apiUrl: string;
  public rowId: number;
  private count = 1;
  public layout_paineis: any[];
  public listLayout: any[];
  public listUnidade: any[];
  public listLocalizacao: any[];
  public listRaspberry: any[];
  public listComputador: any[];
  public listEspaco: any[];
  public listLocalizacaoFiltrada: any[];
  @ViewChild('espacos', {static: false}) espacos;
  currentUser: User;

  constructor(private formBuilder: FormBuilder,
    private http: HttpClient,
    public activeModal: NgbActiveModal,
    private _sanitizer: DomSanitizer,
    private modalNgb: NgbModal,
    public workspaceService: WorkspaceService,
    private modalService: ModalService,
    private _script: ScriptLoaderService,
    private domainService: DomainService) {
      this.currentUser = this.workspaceService.currentUser;
      this.apiUrl = `${domainService.getApiUrl()}/paineis`;
  }

  ngOnInit() {
    this.formulario = this.formBuilder.group({
      nome: [null, Validators.required],
      param_url: [1],
      unidade_id: [null],
      localizacao_id: [null, Validators.required],
      raspberry_id: [null],
      layout_painel_ids: [null],
      layout_paineis: [null],
      licenciado: [true],
      espaco_ids: [null],
      espaco_id: [null]
    });

    // this.formulario.valueChanges.subscribe(data => consoleLog('Form changes', data));

    this.popularLists();

    if (this.rowId == null) {
      this.modalTitle = "Novo";
    } else {
      this.modalTitle = "Editar";
      this.showForm();
    }
  }

  ngAfterViewInit() {
    this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
      'assets/demo/default/custom/components/forms/widgets/select2.js');
      consoleLog(this.formulario.value);
      consoleLog(this.formulario.value.unidade_id==null);
  }

  popularLists() {
    //FIX
    this.http.get(`${this.domainService.getApiUrl()}/layout_paineis/list.json`)
      .subscribe(dados =>
        this.listLayout = (<any>dados).layout_paineis
      );

    this.http.get(`${this.domainService.getApiUrl()}/unidades/list.json`)
      .subscribe(
      dados => this.listUnidade = (<any>dados).unidades
      );

    this.http.get(`${this.domainService.getApiUrl()}/localizacoes/list.json`)
      .subscribe(
      dados => this.listLocalizacao = (<any>dados).localizacoes
    );

    this.http.get(`${this.domainService.getApiUrl()}/raspberries/list.json`)
      .subscribe(dados =>
        this.listRaspberry = (<any>dados).raspberries
      );

    this.http.get(`${this.domainService.getApiUrl()}/espacos/listSelect2.json`)
      .subscribe(dados => {
        this.listEspaco = (<any>dados).espacos;
        consoleLog(this.listEspaco);
      }
      );

    this.http.get(`${this.domainService.getApiUrl()}/computadores/list.json`)
      .subscribe(dados =>
        this.listComputador = (<any>dados).computadores
      );
  }

  prepararSelect(list: any[], field) {
    if (this.formulario.controls[field].value != null) {
      let arrayAux: any[];
      let i = list.indexOf(i => i.id == this.formulario.controls[field].value);
      arrayAux = list.splice(i, 1);
      list = arrayAux.concat(list);
    }
    return list;
    // return arrayAux.concat(this.listCalendario);
  }

  autocompleListFormatter = (data: any): SafeHtml => {
    let html = `<span>${data.name}</span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }

  autocompleListFormatterLocalizacao = (data: any): SafeHtml => {
    let html = `<span>A${data.andar}${data.predio}</span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }

  onSubmit() {
    if (this.formulario.valid) {
      var header = new HttpHeaders();
      header.append('Content-Type', 'application/json');
      consoleLog(this.formulario.value);
      consoleLog(this.espacos.nativeElement);
      this.formulario.value.espacos_ids = Array.apply(null,this.espacos.nativeElement)
        .filter(option => option.selected)
        .map(option => Number(option.v))
      consoleLog(Array.apply(null, this.espacos.nativeElement).filter(option =>option.seelected));

      this.formulario.controls['layout_paineis'].setValue(this.layout_paineis);
      var body = ({painel: this.formulario.value})
      consoleLog(body);
      consoleLog(this.layout_paineis);
      if (this.rowId == null) {
        // this.postForm(header, body);
      } else {
        // this.putForm(header, body);
      }
    } else {
      this.verificarValidacoesForm(this.formulario);
    }
  }

  postForm(header, body) {
    this.http.post(`${this.apiUrl}.json`,
      body, { headers: header, observe: 'response' })
      .subscribe(
      (response) => this.modalService.tratarSucesso(response, this.activeModal),
      (error: any) => this.modalService.tratarError(error)
      );
  }

  putForm(header, body) {
    this.http.put(`${this.apiUrl}/${this.rowId}.json`,
      body, { headers: header, observe: 'response' })
      .subscribe(
      (response) => this.modalService.tratarSucesso(response, this.activeModal),
      (error: any) => this.modalService.tratarError(error)
      );
  }

  showForm() {
    this.http.get(`${this.apiUrl}/${this.rowId}.json`)
      //FIX
      .subscribe(dados => {
        this.formulario.patchValue(dados);
        this.layout_paineis = (<any>dados).layout_paineis;
        this.setEspacos((<any>dados).espacos);
        // consoleLog(dados);
        // consoleLog("layout id?:");
        // consoleLog(this.formulario.value.layout_id);
        // consoleLog(this.formulario);
        consoleLog("passou do flag");
        this.filtrarListLocalizacao(this.formulario.value.unidade_id);
        // this.selectedPrototypeSelector = this.listCalendario.find(i=>i.id == dados.calendario_id)
      });
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
      'has-danger': this.formulario.get(control).touched
        && this.formulario.get(control).invalid,
      'has-success': this.formulario.get(control).touched
        && this.formulario.get(control).valid
    }
  }

  checkInstalado() {
    this.formulario.controls.instalado.setValue(!this.formulario.controls.instalado.value);
  }

  setarRadio(control, tipo) {
    this.formulario.controls[control].setValue(tipo);
  }

  paginarTab(event) {
    // this.navtab.nativeElement.children[this.count]
  }

  incrementar(campo) {
    var value = this.formulario.get(campo).value;
    if (value < 99) {
      value++;
    }
    this.formulario.get(campo).setValue(value);
  }

  decrementar(campo) {
    var value = this.formulario.get(campo).value;
    if (value > 0) {
      value--;
    }
    this.formulario.get(campo).setValue(value);
  }

  filtrarListLocalizacao(u){
    this.listLocalizacaoFiltrada = this.listLocalizacao.filter(
      l => l.unidade_id == u
    )

  }

  // onChangeLayout(e) {
  //   this.formulario.controls['layout_painel_id'].setValue(this.listLayout[e.target.selectedIndex].value);
  // }

  onChangeRasp(e) {
    this.formulario.controls['raspberry_id'].setValue(this.listRaspberry[e.target.selectedIndex].value);
    consoleLog(this.formulario);
  }

  // onChangeCalendario(e) {
  //   this.formulario.controls['calendario_id'].setValue(this.listCalendario[e.target.selectedIndex].value);
  // }

  onChangeUnidade(e) {
    this.formulario.controls['unidade_id'].setValue(this.listUnidade[e.target.selectedIndex].value);
    this.filtrarListLocalizacao(this.formulario.value.unidade_id);
    this.formulario.controls['localizacao_id'].setValue(this.listLocalizacaoFiltrada[0].value)
  }

  onChangeLocalizacao(e) {
    this.formulario.controls['localizacao_id'].setValue(this.listLocalizacaoFiltrada[e.target.selectedIndex].value);
  }


  setarCheckBox(control) {
    this.formulario.controls[control].setValue(!this.formulario.controls[control].value);
  }

  setEspacos(espacos){
    consoleLog("set espacos");
    // consoleLog(this.reserva);
    var values:string[] = [];
    for (var i = 0; i<espacos.length;i++){
      // this.http.get(`${this.domainService.getApiUrl()}/funcionarios/${this.reserva.funcionario_ids[i]}.json`)
      // .map(dados => dados.json())
      // .subscribe(
        // dados => {
          var par = document.createElement("option");
          par.text = `${espacos[i].text}`;
          par.value = `${espacos[i].id}`;
          par.selected = true;
          this.espacos.nativeElement.add(par);
          values.push(par.value);
        // });
    };
    consoleLog("vaaalues:");
    consoleLog(values);
    // this.funcionarios.nativeElement.value = values;
    consoleLog(this.espacos);
  }

  addLayout(){
    this.layout_paineis.push({id: 0, nome:"", duracao:1});
  }

  removeLayout(){
    this.layout_paineis.pop()
  }

  onChangeLayoutPainelDuracao(i, event){
    this.layout_paineis[i].duracao = event.target.value;
  }

  onChangeLayoutPainel(i, event){
    this.layout_paineis[i].id = this.listLayout[event.target.selectedIndex].value;
    consoleLog(this.layout_paineis);
  }

  onChangeOvo(event){
    consoleLog(event);
  }
}
