import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Helpers } from '../../../../../../helpers';
import { Subject } from 'rxjs';
import { transform } from 'typescript';
import { ModalService } from '../../../modal/modal.service';
import { FormBuilder } from '@angular/forms';
import { WorkspaceService } from '../.././../../../../_services/workspace.service';
import { WebService } from '../.././../../../../_services/web.service';

declare function montarTreeLocalizacoes(data: any);

@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./avatar.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class AvatarComponent implements OnInit, AfterViewInit {

  bodyArray = Array(6);
  hairArray = Array(51);
  clothesArray = Array(52);
  extraArray = Array(8);

  formulario = this.formBuilder.group({
    // id: [null],
    avatar_body: [this.workspaceService.currentUser.avatar_body],
    avatar_hair: [this.workspaceService.currentUser.avatar_hair],
    avatar_clothes: [this.workspaceService.currentUser.avatar_clothes],
    avatar_extra: [this.workspaceService.currentUser.avatar_extra]
  });

  public tabStateManager = {
    activeState: 1
  }
  changeTab(index) {
    this.tabStateManager.activeState = index;
  }

  constructor(public formBuilder: FormBuilder,
    public workspaceService: WorkspaceService,
    public webService: WebService,
    public modalService: ModalService) {

  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  
  }

  save() {
    Helpers.setLoading(true);
    this.webService.put(`funcionarios/${this.workspaceService.currentUser.id}`,this.formulario.value)
      .subscribe(
        response => {
          this.modalService.tratarSucesso(response)
          this.workspaceService.currentUser.avatar_body = this.formulario.value.avatar_body;
          this.workspaceService.currentUser.avatar_hair = this.formulario.value.avatar_hair;
          this.workspaceService.currentUser.avatar_clothes = this.formulario.value.avatar_clothes;
          this.workspaceService.currentUser.avatar_extra = this.formulario.value.avatar_extra;
          Helpers.setLoading(false);
        },
        (error: any) => {
          this.modalService.tratarError(error)
          Helpers.setLoading(false);
        }
      )
  }

  changeBody(index){
    this.formulario.get('avatar_body').setValue(index);
  }

  changeHair(index){
    this.formulario.get('avatar_hair').setValue(index);
  }

  changeClothes(index){
    this.formulario.get('avatar_clothes').setValue(index);
  }
  
  changeExtra(index){
    this.formulario.get('avatar_extra').setValue(index);
  }

  descartar(){
    this.formulario.get('avatar_body').setValue(this.workspaceService.currentUser.avatar_body);
    this.formulario.get('avatar_hair').setValue(this.workspaceService.currentUser.avatar_hair);
    this.formulario.get('avatar_clothes').setValue(this.workspaceService.currentUser.avatar_clothes);
    this.formulario.get('avatar_extra').setValue(this.workspaceService.currentUser.avatar_extra);
  }

  random(){
    this.changeBody(Math.floor(Math.random() * this.bodyArray.length));
    this.changeClothes(Math.floor(Math.random() * this.clothesArray.length));
    this.changeExtra(Math.floor(Math.random() * this.extraArray.length));
    this.changeHair(Math.floor(Math.random() * this.hairArray.length));
  }

}