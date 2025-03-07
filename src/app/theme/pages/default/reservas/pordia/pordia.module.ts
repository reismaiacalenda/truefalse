import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalService } from '../../modal/modal.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from '../../default.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { PordiaComponent } from './pordia.component';
import { ModalModule } from '../../modal/modal.module';
import { NgSelect2Module } from 'ng-select2';
import { FullCalendarModule } from 'ng-fullcalendar';

const routes: Routes = [
  {
    "path": "",
    "component": DefaultComponent,
    "children": [
      {
        "path": "/:id",
        "component": PordiaComponent
      },
      {
        "path": "",
        "component": PordiaComponent,
        children: [
          // { path: 'new', component: PordiaFormComponent },
          // { path: ':id', component: PordiaComponent }
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
    FullCalendarModule,
    ModalModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelect2Module
  ],exports: [
    RouterModule
  ],declarations: [
    PordiaComponent,
  ],entryComponents:[
  ],providers: [
    ModalService,
  ]})

export class PordiaModule  {

}