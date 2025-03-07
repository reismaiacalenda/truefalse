import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalService } from '../../modal/modal.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from '../../default.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { QrcodeComponent } from './qrcode.component';
import { ModalModule } from '../../modal/modal.module';
import { NgQrScannerModule } from 'angular2-qrscanner';
import { EsperaModalComponent } from './espera-modal/espera-modal.component';
import { OcupadaModalComponent } from './ocupada-modal/ocupada-modal.component';
import { EspontaneaModalComponent } from './espontanea-modal/espontanea-modal.component';
import { CameraModalComponent } from './camera-modal/camera-modal.component';
import { CelularModalComponent } from './celular-modal/celular-modal.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { AndaimeModule } from '../../../../../_andaime/andaime.module';

const routes: Routes = [
  {
    "path": "",
    "component": DefaultComponent,
    "children": [
      {
        "path": "",
        "component": QrcodeComponent,
        "children": [
          {
            "path": "",
            "component": EsperaModalComponent,
            children: [
              { path: ':id', component: EsperaModalComponent }
            ]
          },
          {
            "path": "",
            "component": EspontaneaModalComponent,
            children: [
              { path: ':id', component: EspontaneaModalComponent }
            ]
          },
          {
            "path": "",
            "component": OcupadaModalComponent,
            children: [
              { path: 'new', component: OcupadaModalComponent }
            ]
          },
          {
            "path": "",
            "component": CameraModalComponent,
            children: [
              { path: 'new', component: CameraModalComponent }
            ]
          },
          {
            "path": "",
            "component": CelularModalComponent,
            children: [
              { path: 'new', component: CelularModalComponent }
            ]
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    LayoutModule,
    ModalModule,
    FormsModule,
    ReactiveFormsModule,
    NgQrScannerModule,
    InlineSVGModule,
    AndaimeModule
  ],exports: [
    RouterModule
  ],declarations: [
    QrcodeComponent,
    OcupadaModalComponent,
    EspontaneaModalComponent,
    EsperaModalComponent,
    CameraModalComponent,
    CelularModalComponent
  ],entryComponents:[
    OcupadaModalComponent,
    EspontaneaModalComponent,
    EsperaModalComponent,
    CameraModalComponent,
    CelularModalComponent
  ],providers: [
    ModalService
  ]})

export class QrcodeModule  {

}