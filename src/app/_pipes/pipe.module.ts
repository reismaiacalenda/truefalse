import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgBrazil } from 'ng-brazil'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipeComponent } from './pipe.component';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    TextMaskModule,
    NgBrazil,
    ],
  declarations: [PipeComponent],
  bootstrap: [PipeComponent]
})
export class PipeModule { }




// CNPJ

// import { NgModule } from '@angular/core';
// import { CNPJPipe } from './cnpj.pipe';

// @NgModule({
//   imports: [   
//     CNPJPipe
//     ],
//   declarations: [],
//   bootstrap: []
// })
// export class PipeModule { }