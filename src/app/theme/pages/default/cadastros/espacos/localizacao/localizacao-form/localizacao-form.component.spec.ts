
import { TestBed, tick, fakeAsync } from '@angular/core/testing';
import { Observable, Observer } from 'rxjs';
import { LocalizacaoFormComponent } from './localizacao-form.component';
import { Component } from '@angular/core';
import { AndaimeModule } from '../../../../../../../_andaime/andaime.module';
import { ModalService } from '../../../../modal/modal.service';
import { RouterTestingModule } from "@angular/router/testing";
describe('User ovo do lucas Component:', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
    imports: [AndaimeModule, RouterTestingModule, LocalizacaoFormComponent],
    providers: [ModalService]
}).compileComponents();
  });
  it('should do nothing', () => {
    expect().nothing();
  });
  it('should show TEST INPUT', () => {
      let fixture = TestBed.createComponent(LocalizacaoFormComponent);
  //   fixture.componentInstance.formulario.get('andar')
  //   const input=fixture.componentInstance.formulario.get('andar').value
  //   expect(input).toBeUndefined()
  });
})//https://marina-ferreira.github.io/tutorials/angular5/inject-service-into-component-test/