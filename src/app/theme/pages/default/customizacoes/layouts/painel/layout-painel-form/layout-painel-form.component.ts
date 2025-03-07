import { RequestOptions } from '@angular/http';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { FileHolder } from 'angular2-image-upload';
import { ModalService } from '../../../../modal/modal.service';
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { DomainService } from '../../../../../../../_services/domain.service';
import { Helpers } from '../../../../../../../helpers';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { consoleLog } from '../../../../../../../globals';

@Component({
  selector: 'layout-painel-form',
  templateUrl: 'layout-painel-form.html'
})
export class LayoutPainelFormComponent implements OnInit, AfterViewInit {
  public modalTitle: string;
  public formulario: FormGroup;
  private apiUrl: string;
  public rowId: number;
  public listTemplate: any[];
  public template: any;
  public carouselPublicidade: string;
  public carouselFundo: string;
  public carouselSituacao: string;
  public filesListPublicidade:string[] = [];
  public filesListFundo:File[] = [];
  public filesDeletePublicidade:string[] = [];
  public filesDeleteFundo:string[] = [];
  public stopCarousel: boolean = false;
  public fileList: File[];
  @ViewChild('imageUploadFundo', {static: false}) imageUploadFundo;
  @ViewChild('imageUploadPublicidade', {static: false}) imageUploadPublicidade;

  constructor(private formBuilder: FormBuilder,
    private http: HttpClient,
    public activeModal: NgbActiveModal,
    private _sanitizer: DomSanitizer,
    private modalNgb: NgbModal,
    private modalService: ModalService,
    private _script: ScriptLoaderService,
    private domainService: DomainService) {
    this.apiUrl = `${domainService.getApiUrl()}/layout_paineis`;
  }

  ngOnInit() {
    Helpers.setLoading(true);
    // "#278ce2"
    this.template = {
      orientacao: "ambos",
      interacao: true,
      carousel_fundo: true
    }

    this.inicializarFormulario();

    if (this.rowId == null) {
      this.modalTitle = "Novo";
      this.prepararTemplates();
    } else {
      this.modalTitle = "Editar";
      this.showForm();
    }
  }

  ngOnDestroy(){
    this.stopCarousel = true;
  }

  inicializarFormulario(){
    this.formulario = this.formBuilder.group({
      nome: [null, Validators.required],
      orientacao: ["horizontal"],
      interacao: ["qrcalenda"],
      interacaoEnum: [1],
      carousel_fundo: [{}],
      carousel_publicidade: [{}],
      cor_fundo_principal: ["rgba(242,243,248,1)"],
      cor_fundo_complementar: ["rgba(255,255,255,1)"],
      cor_linhas_grid: ["rgba(34,204,162,1)"],
      cor_fonte_principal: ["rgba(40,40,40,1)"],
      cor_fonte_complementar: ["rgba(255,255,255,1)"],
      cor_relogio: ["rgba(237,32,36,0.75)"],
      cor_pc_livre: ["rgba(25,178,75,1)"],
      cor_fechado: ["rgba(40,40,40,0.60)"],
      cor_espera: ["rgba(227,161,37,0.9)"],
      cor_ocupado: ["rgba(228,30,38,0.92)"],
      template_id: [null]
    });
  }

  ngAfterViewInit() {
    this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
      'assets/demo/default/custom/components/forms/widgets/bootstrap-touchspin.js');
    this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
      'assets/demo/default/custom/components/forms/widgets/select2.js');
    consoleLog("entrou no afte view");
    this.setarCarouselPublicidade();
    this.setarCarouselFundo();
  }

  onSubmit() {
    Helpers.setLoading(true);
    if (this.formulario.valid) {
      var header = new HttpHeaders();
      // header.append('Content-Type', 'multipart/form-data');
      header.append('Accept', 'application/json');

      if (this.rowId == null) {
        this.postForm(header, this.montarBody(true));
      } else {
        this.putForm(header, this.montarBody(false));
      }
    } else {
      this.verificarValidacoesForm(this.formulario);
    }
  }

  montarBody(post) {
    // let fileList: FileList;
    // if(fileList.length > 0) {
    // let file: File = fileList[0];
    let formData: FormData = new FormData();
    formData.append('[layout][nome]', this.formulario.value.nome);
    formData.append('[layout][aspect_ratio]', this.formulario.value.aspect_ratio);
    formData.append('[layout][cor_fonte]', this.formulario.value.cor_fonte);
    formData.append('[layout][cor_complementar_a]', this.formulario.value.cor_complementar_a);
    formData.append('[layout][cor_complementar_b]', this.formulario.value.cor_complementar_b);
    formData.append('[layout][cor_fechado]', this.formulario.value.cor_fechado);
    formData.append('[layout][cor_livre]', this.formulario.value.cor_livre);
    formData.append('[layout][cor_espera]', this.formulario.value.cor_espera);
    formData.append('[layout][cor_ocupado]', this.formulario.value.cor_ocupado);
    formData.append('[layout][orientacao]', this.formulario.value.orientacao);
    consoleLog("adicionando as cores, formularIO:");
    consoleLog(this.formulario);
    consoleLog("form data montado:");
    consoleLog(formData);
    if (this.template.interacao == true){
      formData.append('[layout][interacao]', this.formulario.value.interacao);
    }else{
      formData.append('[layout][interacao]', 'nenhuma');
    }
    formData.append('[layout][template_id]', this.formulario.value.template_id);
    consoleLog(this.imageUploadFundo);
    consoleLog("*******************");
    consoleLog(this.filesDeleteFundo);
    consoleLog(this.filesListFundo);
    if (post == true) {
      consoleLog(this.template);
      if (this.template.carousel_fundo == true){
        let fileListFundo: FileHolder[] = this.imageUploadFundo.files;
        fileListFundo.forEach(e => {
          var fh: FileHolder = e;
          formData.append('[layout][carousel_fundo][]', fh.file, fh.file.name);
        });
      }
      let fileListPublicidade: FileHolder[] = this.imageUploadPublicidade.files;
      fileListPublicidade.forEach(e => {
        var fh: FileHolder = e;
        formData.append('[layout][carousel_publicidade][]', fh.file, fh.file.name);
      });
    }
    else{
      if (this.template.carousel_fundo == true){
        let fileListFundo: FileHolder[] = this.imageUploadFundo.files;
        fileListFundo.forEach(e => {
          var fh: FileHolder = e;
          if (fh.file.name != "undefined"){
            formData.append('[layout][fundo][]', fh.file, fh.file.name);
          }else{
            formData.append('[layout][fundo_persistir][]', fh.src.split("/")[7]);
          }
        });
      }
      let fileListPublicidade: FileHolder[] = this.imageUploadPublicidade.files;
      fileListPublicidade.forEach(e => {
        var fh: FileHolder = e;
        if (fh.file.name != "undefined"){
          formData.append('[layout][publicidade][]', fh.file, fh.file.name);
        }else{
          formData.append('[layout][publicidade_persistir][]', fh.src.split("/")[7]);
        }
      });
    //   this.deletarEdicaoCarousel('publicidade', this.filesDeletePublicidade);
    //   this.deletarEdicaoCarousel('fundo', this.filesDeleteFundo);
    //   this.uploadCarousel('publicidade', this.filesListPublicidade);
    //   this.uploadCarousel('fundo', this.filesListFundo);
    }
    consoleLog(formData.getAll('[layout][fundo][]'));
    consoleLog(formData);
    return formData;
  }

  postForm(header, body) {
    this.http.post(`${this.apiUrl}`,
      body, { headers: header, observe: 'response' })
      .subscribe(
      (response) => this.modalService.tratarSucesso(response, this.activeModal),
      (error: any) => this.modalService.tratarError(error)
      )
      .add(()=>Helpers.setLoading(false));
  }

  putForm(header, body) {
    this.http.put(`${this.apiUrl}/${this.rowId}`,
      body, { headers: header, observe: 'response' })
      .subscribe(
      (response) => this.modalService.tratarSucesso(response, this.activeModal),
      (error: any) => this.modalService.tratarError(error)
      )
      .add(()=>Helpers.setLoading(false));
  }

  showForm() {
    this.http.get(`${this.apiUrl}/${this.rowId}.json`)
      // FIX
      .subscribe(dados => {
          this.formulario.patchValue(dados);
        }
      ).add(()=>{
        this.http.get(`${this.domainService.getApiUrl()}/templates.json`)
        //.map(dados => (<any>dados).json())
        .subscribe(dados =>
          this.listTemplate = (<any>dados).templates
        )
        .add(()=>{
          this.template = this.listTemplate.find(t => t.id == this.formulario.value.template_id);
          this.carouselSituacao = this.formulario.value.cor_livre;
          Helpers.setLoading(false);
          });
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

  setarCheckBox(control) {
    this.formulario.controls[control].setValue(!this.formulario.controls[control].value);
  }

  setarRadio(control, tipo) {
    this.formulario.controls[control].setValue(tipo);
  }

  onRemovedPublicidade(event) {
    if (this.rowId == null){return;}
    var filename = event.src.replace(/^.*[\\\/]/, '');
    this.filesDeletePublicidade.push(filename);
  }

  onRemovedFundo(event) {
    if (this.rowId == null){return;}
    var filename = event.src.replace(/^.*[\\\/]/, '');
    this.filesDeleteFundo.push(filename);
  }

  deletarEdicaoCarousel(atributo, filesDelete){
    var header = new HttpHeaders();
    header.append('Content-Type', 'application/json');
    header.append('Accept', 'application/json');

    filesDelete.forEach(filename => {
      this.http.delete(
        `${this.apiUrl}/${this.rowId}/carousel_${atributo}?filename=${filename}`,
        { headers: header , observe: 'response'}
      )
        .subscribe(
        (dados) =>
          (error: any) => this.modalService.tratarError(error)
        );
    });
  }

  atualizarFileListPublicidade(event) {
    if (this.rowId == null){return;}
    this.filesListPublicidade = event.target.files;
  }

  atualizarFileListFundo(event) {
    if (this.rowId == null){return;}
    this.filesListFundo = event.target.files;
  }

  uploadCarousel(atributo, fileList){
    let formData: FormData = new FormData();
    for (var index = 0; index < fileList.length; index++) {
      formData.append(`[layout][carousel_${atributo}][]`, fileList[index], fileList[index].name);
    }
    consoleLog(formData.getAll(`[layout][carousel_${atributo}][]`));
    let headers = new HttpHeaders();
    headers.append('Accept', 'application/json');

    // FIX
    this.http.put(`${this.apiUrl}/${this.rowId}/carousel_${atributo}`,
      formData, { headers: headers })
      res => res
      .subscribe(
      dados =>
        err => this.modalService.tratarError(err)
    );
  }

  onUploaded(event) {
    consoleLog(event);
  }

  onOvo(event){
    // consoleLog(event);
    consoleLog(this.formulario.value.cor_livre);
    // consoleLog(formulario.controls.cor_livre.setValue($event))
  }

  prepararTemplates() {
    this.http.get(`${this.domainService.getApiUrl()}/templates.json`)
    // FIX
    .subscribe(dados =>
      this.listTemplate = (<any>dados).templates
    )
    .add(()=>Helpers.setLoading(false));
  }

  setarTemplate(id){
    this.template = this.listTemplate.find(t => t.id == id);
    consoleLog(this.formulario.value.cor_livre);
    // this.formulario.reset();
    this.inicializarFormulario();
    this.formulario.controls["template_id"].setValue(id);
    // consoleLog(this.formulario.value.cor_livre);
    // this.formulario.controls.cor_livre.setValue("rgba(79,129,13,0.88)")
    // consoleLog(this.formulario.value.cor_livre);
    // this.tab_6_2.nativeElement.tab('show');
    (<any>$('.nav-tabs li:eq(4) a')).removeClass('disabled');
    (<any>$('.nav-tabs li:eq(4) a')).tab('show');
    this.carouselSituacao = this.formulario.value.cor_livre;
  }

  delay(milliseconds: number, cor: string): Promise<string> {
    return new Promise<string>(resolve => {
            setTimeout(() => {
                resolve(cor);
            }, milliseconds);
        });
  }

  async setarCarouselPublicidade(): Promise<void> {
    while(this.imageUploadPublicidade.files.length == 0){
      if (this.stopCarousel){break};
      await this.delay(350,'');
    }
    for (let i = 0; i < this.imageUploadPublicidade.files.length; i++) {
      if (this.stopCarousel){break};
      this.carouselPublicidade = await this.delay(5000, this.imageUploadPublicidade.files[i].src);
      if (this.imageUploadPublicidade.files.length == 0){this.carouselPublicidade = ""};
      if (i == this.imageUploadPublicidade.files.length - 1){i = -1};
    }
  }

  async setarCarouselFundo(): Promise<void> {
    while(this.imageUploadFundo.files.length == 0){
      if (this.stopCarousel){break};
      await this.delay(350,'');
    }
    for (let i = 0; i < this.imageUploadFundo.files.length; i++) {
      if (this.stopCarousel){break};
      this.carouselFundo = await this.delay(5000, this.imageUploadFundo.files[i].src);
      if (this.imageUploadFundo.files.length == 0){this.carouselFundo = ""};
      if (i == this.imageUploadFundo.files.length - 1){i = -1};
    }
  }

  setarCarouselSituacao(cor){
    this.carouselSituacao = this.formulario.get(cor).value;
  }

  resolucaoFundo(){
    var res;
    if (this.formulario.value.template_id == 1){
      if(this.formulario.value.orientacao == "horizontal"){
        if(this.formulario.value.aspect_ratio == "4:3"){
          // Anima > Horizontal> Standard
          res = "";
        }else{
          // Anima > Horizontal> Wide
          res = "";
        }
      }else{
        if(this.formulario.value.aspect_ratio == "4:3"){
          // Anima > Vertical> Standard
          res = "";
        }else{
          // Anima > Vertical> Wide
          res = "";
        }
      }
    }else{
      if(this.formulario.value.orientacao == "horizontal"){
        if(this.formulario.value.aspect_ratio == "4:3"){
          // Modern > Horizontal > Standard
          res = "1024x768";
        }else{
          // Modern > Horizontal > Wide
          res = "1366x768";
        }
      }else{
        if(this.formulario.value.aspect_ratio == "4:3"){
          // Modern > Vertical> Standard
          res = "768x1024";
        }else{
          // Modern > Vertical > Wide
          res = "768x1366";
        }
      }
    }
    return res;
  }

  resolucaoPublicidade(){
    var res;
    if (this.formulario.value.template_id == 1){
      if(this.formulario.value.orientacao == "horizontal"){
        if(this.formulario.value.aspect_ratio == "4:3"){
          // Anima > Horizontal> Standard
          res = "768x1162";
        }else{
          // Anima > Horizontal> Wide
          res = "990x768";
        }
      }else{
        if(this.formulario.value.aspect_ratio == "4:3"){
          // Anima > Vertical> Standard
          res = "768x725";
        }else{
          // Anima > Vertical> Wide
          res = "768x1162";
        }
      }
    }else{
      if(this.formulario.value.orientacao == "horizontal"){
        if(this.formulario.value.aspect_ratio == "4:3"){
          // Modern > Horizontal > Standard
          res = "391x120";
        }else{
          // Modern > Horizontal > Wide
          res = "521x160";
        }
      }else{
        if(this.formulario.value.aspect_ratio == "4:3"){
          // Modern > Vertical> Standard
          res = "768x165";
        }else{
          // Modern > Vertical > Wide
          res = "768x165";
        }
      }
    }
    return res;
  }

  setarInteracao(valor){
    if (valor == 1){
      if(this.formulario.value.interacaoEnum == 1){
        this.formulario.value.interacaoEnum = 0;
      }else if(this.formulario.value.interacaoEnum == 2){
        this.formulario.value.interacaoEnum = 3;
      }else if(this.formulario.value.interacaoEnum == 3){
        this.formulario.value.interacaoEnum = 2;
      }else{
        this.formulario.value.interacaoEnum = 1;
      }
    }else{
      if(this.formulario.value.interacaoEnum == 2){
        this.formulario.value.interacaoEnum = 0;
      }else if(this.formulario.value.interacaoEnum == 1){
        this.formulario.value.interacaoEnum = 3;
      }else if(this.formulario.value.interacaoEnum == 3){
        this.formulario.value.interacaoEnum = 1;
      }else{
        this.formulario.value.interacaoEnum = 2;
      }
    }
    this.setarEnumInteracao();
  }

  setarEnumInteracao(){
    switch (this.formulario.value.interacaoEnum) {
      case 1: this.formulario.value.interacao = "qrcalenda";return;
      case 2: this.formulario.value.interacao = "touch";return;
      case 3: this.formulario.value.interacao = "ambos";return;
      default: this.formulario.value.interacao = "nenhuma";return;
    }
  }
}
