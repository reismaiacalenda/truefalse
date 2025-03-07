import { RequestOptions } from '@angular/http';
import { CelularModalComponent } from './celular-modal/celular-modal.component';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../../../../../auth/_models/user';
import { DomainService } from '../../../../../_services/domain.service';
import { Component, OnInit, ViewEncapsulation, ViewChild, EventEmitter, ElementRef } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { ModalService } from '../../modal/modal.service';
import { ModalDismissReasons, NgbModal, NgbActiveModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { QrScannerComponent } from 'angular2-qrscanner';
import { EsperaModalComponent } from './espera-modal/espera-modal.component';
import { OcupadaModalComponent } from './ocupada-modal/ocupada-modal.component';
import { EspontaneaModalComponent } from './espontanea-modal/espontanea-modal.component';
import { CameraModalComponent } from './camera-modal/camera-modal.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WorkspaceService } from '../../../../../_services/workspace.service';
import { consoleLog } from '../../../../../globals';

@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./qrcode.component.html",
  encapsulation: ViewEncapsulation.None,
})

export class QrcodeComponent implements OnInit {
  private apiUrl: string;
  private espaco_id;
  private situacao;
  private reserva_id;
  private device;
  public teste;
  private user: User;
  public videoDevices: MediaDeviceInfo[] = [];
  public OS:string = Helpers.getOS();
  @ViewChild('modal', {static: false}) public modal: ElementRef;
	@ViewChild('closeModal', {static: false}) public closeModal: ElementRef;
  @ViewChild(QrScannerComponent, {static: false}) qrScannerComponent: QrScannerComponent ;

  constructor(private _script: ScriptLoaderService,
    private route: ActivatedRoute,
    private modalNgb: NgbModal,
    private http: HttpClient,
    public workspaceService: WorkspaceService,
    private modalService: ModalService,
    private domainService: DomainService)  {
      this.user = this.workspaceService.currentUser;
      this.apiUrl = `${domainService.getApiUrl()}/qrcalenda`;
  }

  ngOnInit() {
    var q = this.route.snapshot.queryParams['q'] || '/';
    if (q == '/'){
      // this.inicializarQrScanner();
    }else{
      localStorage.setItem('qrcode', '/');
      this.switchModal(atob(q).split(","));
    }
  }

  inicializarQrScanner(){
    this.device = JSON.parse(localStorage.getItem("camera"));

    if(this.device != undefined){
      consoleLog("tem coisa setada ja:");
      consoleLog(this.device);
      this.qrScannerComponent.getMediaDevices().then(() => {
        // for (const device of devices) {
          // if (device.deviceId === this.device.deviceId) {
            // consoleLog("achou o bacana");
            this.qrScannerComponent.chooseCamera.next(this.device);
          // }
        // }
      });
    }else{
      this.escolherCamera();
    }

    this.inscreverCaptura();
  }

  inscreverCaptura(){
    this.qrScannerComponent.capturedQr.subscribe(result => {
      Helpers.setLoading(true);
      consoleLog(result);
      this.qrScannerComponent.stopScanning();
      // let q = result.split("q=")[1];

      this.switchModal(atob(result.split("?q=")[1]).split(","));
    });
  }

  reiniciarScanner(){
    this.qrScannerComponent.stopScanning();
    this.qrScannerComponent.startScanning(this.device);
  }

  trocarCamera(){
    // this.qrScannerComponent.stopScanning();
    this.escolherCamera();
  }

  escolherCamera(){
    this.qrScannerComponent.getMediaDevices().then(devices => {
      consoleLog(devices);

      this.videoDevices = [];
      for (var device of devices) {
        if (device.kind.toString() === 'videoinput') {
          this.videoDevices.push(device);
        }
      }
      if (this.videoDevices.length > 0){
        consoleLog(this.videoDevices);
        let ngbModalOptions: NgbModalOptions={
          backdrop: 'static',
          keyboard: false
        }
        const modalRef = this.modalNgb.open(CameraModalComponent, ngbModalOptions);
        modalRef.componentInstance.videoDevices = this.videoDevices;
        modalRef.componentInstance.oldDevice = this.device;
        modalRef.result.then((choosenDev) => {
          if (choosenDev) {
            consoleLog("selecionou uma camera:");
            consoleLog(choosenDev);
            this.qrScannerComponent.chooseCamera.next(choosenDev);
            this.device = choosenDev;
            localStorage.setItem("camera", JSON.stringify(this.device));
            Helpers.setLoading(false);
          }
        })
        consoleLog("saiu do result da modal");


          // for (const dev of this.videoDevices){
          //   // consoleLog(dev.label);
          //   // this.teste = dev.label;
          //   if (dev.label.includes('back')){
          //       this.choosenDev = dev;
          //       break;
          //   }
          // }
          // if (this.choosenDev) {
          //     this.qrScannerComponent.chooseCamera.next(this.choosenDev);
          //     this.device = this.choosenDev;
          // } else {
          //     this.qrScannerComponent.chooseCamera.next(this.videoDevices[0]);
          //     this.device = this.videoDevices[0];
          // }
      // }else{
        // "este dispotivo nao possui camera";
      }
    });
  }

  switchModal(portaParams){
    if (portaParams.length != 3){
      consoleLog("tamanho invalido do PortaParams");
      Helpers.setLoading(false);
      return;
    }else if(portaParams.length ==3){
      this.espaco_id = +portaParams[0];
      this.situacao = +portaParams[1];
      this.reserva_id = +portaParams[2];
      switch (this.situacao){
        case 0: this.openEsperaModal();
          break;
        case 1: this.openOcupadaModal();
          break;
        case 2: this.openEspontaneaModal();
          break;
      }
    }
    else if(portaParams.length == 1){
      this.espaco_id = +portaParams[0];
      this.http.get(`${this.apiUrl}/situacao/${this.espaco_id}.json`)
        .subscribe(dados => {
          consoleLog("retornou a situacao:");
          this.reserva_id = (<any>dados).reserva_id;
          this.situacao = (<any>dados).situacao;
          Helpers.setLoading(false);
          switch (this.situacao){
            case 0: this.openEsperaModal();
              break;
            case 1: this.openOcupadaModal();
              break;
            case 2: this.openEspontaneaModal();
              break;
          }
        });
      }

  }

  openEsperaModal() {
    this.requisitarUpdate();//.subscribe(result =);
    // let ngbModalOptions: NgbModalOptions={
       //   backdrop: 'static',
       //   keyboard: false
      //}
     // const modalRef = this.modalNgb.open(EsperaModalComponent);
    // modalRef.componentInstance.porta_id = this.espaco_id;
    // modalRef.componentInstance.reserva_id = this.reserva_id;
    // modalRef.result.then((responseSuccess) => {
      // if (responseSuccess) {
        // this.qrScannerComponent.
        // consoleLog("voltar com camera agora");
        // this.ligarQrScanner();
      // }
      // this.qrScannerComponent.startScanning(this.device);
    // })
  }

  openOcupadaModal(){
    Helpers.setLoading(false);
    let ngbModalOptions: NgbModalOptions={
          backdrop: 'static',
          keyboard: false
      }
    const modalRef = this.modalNgb.open(OcupadaModalComponent, ngbModalOptions);
    modalRef.result.then((responseSuccess) => {
      if (responseSuccess) {
        this.requisitarUpdate();
        consoleLog("deu true");
      }else{
        consoleLog("deu false");
        this.qrScannerComponent.startScanning(this.device);
      }
    })
  }

  openEspontaneaModal(){
    let ngbModalOptions: NgbModalOptions={
          backdrop: 'static',
          keyboard: false
      }
    const modalRef = this.modalNgb.open(EspontaneaModalComponent, ngbModalOptions);
    modalRef.componentInstance.espaco_id = this.espaco_id;
    modalRef.result.then((responseSuccess) => {
      // if (responseSuccess) {
        // this.reiniciarCalendario();
      // }
      this.qrScannerComponent.startScanning(this.device);
    })
  }

  requisitarUpdate(){//:EventEmitter<boolean> {
    Helpers.setLoading(true);
    var header = new HttpHeaders();
    header.append('Content-Type', 'application/json');
    var body = ({
      organizador_id: this.user.id,
      autor_id: this.user.id
    });
    this.putForm(header, body);
    // return EventEmitter.create;
  }

  putForm(header, body) {
    this.http.put(`${this.apiUrl}/${this.reserva_id}.json`,
    body, { headers: header, observe: 'response' })
    .subscribe(
      (response) => {
        Helpers.setLoading(false);
        this.modalService.tratarSucesso(response);
      },
      (error: any) => {
        Helpers.setLoading(false);
        this.modalService.tratarError(error);
      }
    ).add(()=>{
      // Helpers.setLoading(false);
      this.qrScannerComponent.startScanning(this.device)
    });
  }

  escolherCelular(){
      let ngbModalOptions: NgbModalOptions={
          backdrop: 'static',
          keyboard: false
      }
    const modalRef = this.modalNgb.open(CelularModalComponent);
      modalRef.componentInstance.OS = this.OS;
      modalRef.result.then((choosenMobile) => {
        if (choosenMobile) {
          this.OS = choosenMobile;
          Helpers.setLoading(false);
        }
      })

  }
}
