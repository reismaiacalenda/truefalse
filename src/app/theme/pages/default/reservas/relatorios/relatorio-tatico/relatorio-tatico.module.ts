import { HttpClientModule } from '@angular/common/http';
// import { OvoDebugComponent } from './../../ovo/ovo-debug/ovo-debug.component';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../../layouts/layout.module';
import { DefaultComponent } from '../../../default.component';
import { ModalService } from '../../../modal/modal.service';
import { AmChartsModule } from "@amcharts/amcharts3-angular";
import { RelatorioTaticoComponent } from './relatorio-tatico.component';
import { TfPageMapComponent } from '../../../../../../_andaime/tf-pages/tf-page-map/tf-page-map.component';
import { AndaimeModule } from '../../../../../../_andaime/andaime.module';
// import { BrowserModule } from '@angular/platform-browser';

const routes: Routes = [
  {
    "path": "",
    "component": DefaultComponent,
    "children": [
      {
        "path": "",
        "component": RelatorioTaticoComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LayoutModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    AmChartsModule,
    AndaimeModule
    // TfPageMapComponent
    // BrowserModule
  ], exports: [
    RouterModule,
  ], declarations: [
    RelatorioTaticoComponent
  ], providers: [
    ModalService
  ]
})
export class RelatorioTaticoModule { }
