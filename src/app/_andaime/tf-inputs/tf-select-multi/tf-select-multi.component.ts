import { Component, Input, forwardRef, OnInit, OnChanges, SimpleChanges, SimpleChange, OnDestroy, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { Subscription, Subject } from 'rxjs';
import { consoleLog, globals } from '../../../globals';

const TF_SELECT_MULTI_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TfSelectMultiComponent),
  multi: true
};

@Component({
  selector: 'tf-select-multi',
  templateUrl: './tf-select-multi.component.html',
  standalone: false
  //styleUrls: ['./input-field.component.css'],
  // providers: [TF_SELECT_MULTI_VALUE_ACCESSOR]
})

export class TfSelectMultiComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() control;
  @Input() id: string;
  @Input() label: string = "";
  @Input() placeholder: string = "";
  @Input() isReadOnly = false;
  @Input() desabilitar: boolean = false;
  @Input() retirarLabel: boolean = false;
  @Input() allowClear = true;
  @Input() options:any = {
    multiple: true,
    tags: false,
    width: '100%',
    language: 'pt-BR'
  }
  @Input() form:FormArray;
  @Input() data = [];
  @Input() notificarDataEspacoSelect:Subject<any>
  @Input() tooltip: string;
  @Output() valorModificado = new EventEmitter();
  public model;
  private innerValue: any;
  private subscriptions: Subscription = new Subscription();
  private isValueChangeFromFormService:boolean = true;

  constructor(public formBuilder: FormBuilder){
    this.form = this.formBuilder.array([]);
  }

  ngOnInit(){
    this.model = this.formControlToStringArray(this.form);

    this.subscriptions.add(
      this.form.valueChanges.subscribe(value=>{
        consoleLog("we are thce chamipios (formulario acaba de receber o patchvalue no subscribe e tá na hora de converter o formarray de formgbrup de formcontrol para string")
        consoleLog(value);
        if (this.isValueChangeFromFormService){
          consoleLog("rolou mudança, logo, vamos chama a conversaõ de abstractControl para StringArray, para popular o <ng-select2>")
          this.model = this.formControlToStringArray(this.form);
          consoleLog("converteu a model em string array:")
          consoleLog(this.model)
        }
      })
    )

    // if (this.notificarDataEspacoSelect){
    //  this.subscriptions.add(
    //    this.notificarDataEspacoSelect.subscribe(event=>{
    //      consoleLog("chegou um event aqui no component");
    //      consoleLog(event);
    //      consoleLog(this.data);
    //      this.data=[{id:6, text:"ovo"}];
    //      this.data=event.reverse().slice();
    //     //  this.data.
    //      consoleLog(this.data);
    //    })
    //  )
    // }
  }

  ngAfterViewInit(){
    consoleLog("ow, eu terminei aqui a renderizaçao, e seu form tá vindo assim:")
    consoleLog(this.form);
    consoleLog(this.form.value);
  }

  ngOnDestroy(){
    this.subscriptions.unsubscribe();
  }

  formControlToStringArray(form){
    var stringArray = [];
    consoleLog("formControl to string array disparado:")
    consoleLog(form);
    // if (form && form.controls && form.controls.length > 0){
      // consoleLog(form.controls.length);
      form.controls.forEach(f => {
        consoleLog("each:");
        consoleLog(f.value);
        if (f.value.id && !f.value._destroy){
          stringArray.push(f.value.id.toString())
        }
      });
    // }

    // if (form && form.value){
    //   form.value.forEach(value => {
    //     if (value.id && !value._destroy){
    //       stringArray.push(value.id.toString())
    //     }
    //   });
    // }
    // consoleLog("olha o form:")
    // consoleLog(form);
    consoleLog("olha o retorno do string array;:")
    consoleLog(stringArray);
    return stringArray
  }

  stringArrayToFormControl(stringArray:any[]){
    //TODO: varrer os ids no form.
    //1. se achar no string array, destroy é false.
    //2. se nao achar no stringarray, mas existir nof orm, é destroy true
    //3. se nao achar no form, mas existir no string array, é novo item pro form, com destroy false
    //4. Tomar cuidado durante a edição. new record pode ajudar
    //5. Tomar cuidado ao deletar e depoir adicionar o mesmo item. new recor dpode ajudar

    consoleLog("form no StringArrayToFormControl:");
    consoleLog(this.form);

    if (this.form == null || this.form.value == null){
      consoleLog("//Form veio vazio.");
      // if (!stringArray && stringArray == []){
      if (!stringArray || stringArray.length === 0){
        consoleLog("// Usuario brincou de selecionar e desisitiu, ou simplesmente nao encostou.");
        consoleLog("// nao faz nada, mantem o form nullinho da silva");
      }else{
        consoleLog("// tem inserção nova:");
        this.form = this.formBuilder.array([]);
        stringArray.forEach(e=>{
          this.form.push(this.formBuilder.group({
            id: parseInt(e),
            new_record: true
          }));
        })
        // _destroy: false
      }
    }else{
      stringArray.forEach(e=>{
        consoleLog("//percorre os ids as seleções");
        if (this.form.controls.find(f=>f.value.id==e) === undefined){
          consoleLog("//se esse id não existir no form, trata-se de uma nova inserção (new_record: true)");
          this.form.push(this.formBuilder.group({
            id: parseInt(e),
            new_record: true
          }))
        }else{
          consoleLog("// caso o id já esteja salvo no form nada a fazer. o registro se mantem");
        }

      })

      this.form.controls.forEach((f, i) => {
        consoleLog("// controlar deleções");
        consoleLog(f);
        if (!stringArray.includes(f.value.id.toString())){
          consoleLog("//se o control não existir mais na seleção:");
          if (f.value.new_record){
            consoleLog("// e se o registro for novo, remove ele do form, pra nem enviar pra api;");
            this.form.removeAt(i);

          }else{
            consoleLog("// se o registro ja tiver sido salvo na base, então não podemos removê-lo,");
            consoleLog("// mas sim flagar sua destruição para a api ficar ligada que tem removê-lo da base");
            f.value._destroy = true;
          }
        }
      });

      if (this.form.controls.length == 0){
        consoleLog("caso o usuario só brincou de selecionar mas desistiu de todos, devemos anular o form");
        // this.form = null;
      }
    }
  }

  valueChanged(event){
    this.isValueChangeFromFormService=false;
    this.stringArrayToFormControl(event.value);
    this.valorModificado.emit({event: event, form: this.form});
    this.isValueChangeFromFormService=true;
    this.form.markAsTouched();
    this.form.markAsDirty();
    this.form.updateValueAndValidity();
   }

  sinalizarTouch(event){
    // consoleLog("ta caindo aqui no eita() ")
    // consoleLog(event);
    // consoleLog(event.relatedTarget);
    if (event.relatedTarget != undefined &&
      event.relatedTarget.className != undefined &&
      event.relatedTarget.className == "select2-selection select2-selection--multiple"
      // this.form.value
      ){
      // consoleLog("caiu no if");
      // this.form.markAsTouched();
      // this.form.updateValueAndValidity();
    }
  }

  setDisabledState?(isDisabled: boolean): void {
    this.desabilitar = isDisabled;
  }

  debugGlobal = globals.debug;

}
			
// <div *ngIf="isAnima" class="m-login__signin">
// <div class="m-login__head">
//   <div class="m-login__logo">
//     <a href="#">
//       <img src="./assets/app/media/img/logos/calenda-monitores.png" style="padding-top:4rem;">
//     </a>
//   </div>
//   <div class="m-login__title">
//     <h3>
//       Calenda
//     </h3>
//   </div>
//   <div class="m-login__desc">
//     Módulo de cadastro, agendamento e monitoramento do sistema <b>Calenda</b>.
//   </div>
// </div>
// <div class="m-login__form m-form" style="margin-top:rem;">
//   <div class="m-login__form-action">
//     <a [href]="loginUrl" 
//     class="btn btn-info m-btn m-btn--pill m-btn--custom m-btn--air"
//     >Entrar</a>
//   </div>
// </div>
// </div>
// <div *ngIf="!isAnima" class="m-login__signin">
// <div class="m-login__head">
//   <h3 class="m-login__title">
//     Acesse com sua conta:
//   </h3>
// </div>
// <form (ngSubmit)="signInForm.form.valid && signin()" #signInForm="ngForm" class="m-login__form m-form" action="">
//   <ng-template #alertSignin></ng-template>
//   <div class="form-group m-form__group">
//     <input class="form-control m-input" type="email" placeholder="E-mail"
//      name="username"
//      [(ngModel)]="signInData.login"
//      #username="ngModel"
//      autocomplete="off"
//      required>
//   </div>
//   <div class="form-group m-form__group">
//     <input class="form-control m-input m-login__form-input--last"
//     type="Password"
//     placeholder="Senha"
//     name="password"
//     [(ngModel)]="signInData.password"
//     #password="ngModel">
//   </div>
//   <div class="row m-login__form-sub">
//     <div class="col m--align-left">
//       <!-- <label class="m-checkbox m-checkbox-s">
//         <input type="checkbox" name="remember" [(ngModel)]="model.remember" #remember="ngModel">
//         Remember me
//         <span></span>
//       </label> -->
//       <!-- id="forgetPasswordForm" -->
//       <a href="javascript:;"  class="m-link" (click)="esqueceuSenha()">
//         Esqueceu a senha?
//       </a>
//     </div>
//     <div class="col m--align-right">
//       <a href="javascript:;" id="m_login_signup" class="m-link">
//         Criar conta rápida.
//       </a>
//     </div>
//   </div>
//   <div *ngIf="outputSignin != undefined" class="m-login__form-sub">
//     <span *ngFor="let m of (outputSignin?.error?.errors)" class="m-form__help m--font-danger">
//       {{m}}
//     </span>
//     <span *ngIf="outputSignin != undefined && (outputSignin?.ok==true || outputSignin?.status == 200 || outputSignin?.success == true ) && outputSignin?.message"
//       class="m-form__help m--font-success">
//       {{outputSignin.message}}
//     </span>
//   </div>
//   <div class="m-login__form-action">
//     <button [disabled]="loading" [ngClass]="{'m-loader m-loader--right m-loader--light': loading}" id="m_login_signin_submit"
//     class="btn btn-primary m-btn m-btn--pill m-btn--custom m-btn--air">
//       Entrar
//     </button>
//   </div>
// </form>
// </div>
// <div *ngIf="!isAnima"  class="m-login__signup">
// <div class="m-login__head">
//   <h3 class="m-login__title">
//     Criar conta rápida:
//   </h3>
//   <!-- <div class="m-login__desc">
//     Enter your details to create your account: -->
//   <!-- </div> -->
// </div>
// <form (ngSubmit)="registerForm.form.valid && signup()" #registerForm="ngForm" class="m-login__form m-form" action="">
//   <ng-template #alertSignup></ng-template>
//   <div class="form-group m-form__group">
//     <input class="form-control m-input"
//       type="text"
//       placeholder="Seu nome"
//       name="name"
//       [(ngModel)]="registerData.name"
//       #fullname="ngModel"
//       required>
//   </div>
//   <div class="form-group m-form__group">
//     <input class="form-control m-input"
//     type="e-mail"
//     placeholder="E-mail"
//     name="email"
//     [(ngModel)]="registerData.login"
//     #email="ngModel"
//     autocomplete="off"
//     required>
//   </div>
//   <div class="form-group m-form__group">
//     <input class="form-control m-input"
//     type="password"
//     placeholder="Senha"
//     name="password"
//     [(ngModel)]="registerData.password"
//     #password="ngModel">
//   </div>
//   <!-- <div class="form-group m-form__group">
//     <input class="form-control m-input m-login__form-input--last" type="password" placeholder="Confirm Password" name="rpassword" [(ngModel)]="model.rpassword" #rpassword="ngModel">
//   </div> -->

//     <!-- <label class="m-checkbox m-checkbox--primary">
//       <input type="checkbox" name="agree" [(ngModel)]="model.agree" #agree="ngModel">
//       Eu concordo com os
//       <a href="#" class="m-link m-link--primary">
//         termos de uso
//       </a>
//       .
//       <span></span>
//     </label> -->
//   <div *ngIf="outputSignup != undefined" class="m-login__form-sub">
//     <span *ngFor="let m of (outputSignup?.error?.errors?.full_messages)" class="m-form__help m--font-danger">
//       {{m}}
//     </span>
//   </div>
//   <div class="m-login__form-action">
//     <button [disabled]="loading" [ngClass]="{'m-loader m-loader--right m-loader--light': loading}" id="m_login_signup_submit" class="btn btn-primary m-btn m-btn--pill m-btn--custom m-btn--air">
//       Criar
//     </button>
//     <button [disabled]="loading"  id="m_login_signup_cancel" class="btn btn-outline-primary m-btn m-btn--pill m-btn--custom">
//       Cancelar
//     </button>
//   </div>
// </form>
// </div>
// <!-- <div *ngIf="!isAnima"  class="m-login__forget-password2">
// <div class="m-login__head">
//   <h3 class="m-login__title">
//     Esqueceu sua senha?
//   </h3>
//   <div class="m-login__desc">
//     Digite seu e-mail para resetarmos sua senha por lá.
//   </div>
// </div>
// <form (ngSubmit)="f.form.valid && forgetPass()" #f="ngForm" class="m-login__form m-form" action="">
//   <ng-template #alertForgetPass></ng-template>
//   <div class="form-group m-form__group">
//     <input class="form-control m-input" type="email" placeholder="Email" name="email" [(ngModel)]="model.email" #email="ngModel" id="m_email" autocomplete="off">
//   </div>
//   <div class="m-login__form-action">
//     <button [disabled]="loading" [ngClass]="{'m-loader m-loader--right m-loader--light': loading}" id="changePasswordForm_submit" class="btn btn-primary m-btn m-btn--pill m-btn--custom m-btn--air">
//       Enviar
//     </button>
//     <button [disabled]="loading"  id="changePasswordForm_cancel" class="btn btn-outline-primary m-btn m-btn--pill m-btn--custom ">
//       Cancelar
//     </button>
//   </div>
// </form>
// </div> -->
// <div *ngIf="!isAnima" class="m-login__forget-password">
// <div class="m-login__head">
//   <h3 class="m-login__title">
//     Esqueceu sua senha?
//   </h3>
//   <div class="m-login__desc">
//     Digite seu e-mail para resetarmos sua senha por lá.
//   </div>
// </div>
// <form (ngSubmit)="forgetPasswordForm.valid && forgetPass()" #forgetPasswordForm="ngForm" class="m-login__form m-form" action="">
//   <ng-template #alertForgetPass></ng-template>
//   <div class="form-group m-form__group">
//     <input class="form-control m-input"
//     type="e-mail"
//     placeholder="E-mail"
//     name="email"
//     [(ngModel)]="signInData.login"
//     #email="ngModel"
//     autocomplete="off"
//     required>
//   </div>
//   <div *ngIf="outputForgetPassword != undefined" class="m-login__form-sub">
//     <span *ngIf="outputForgetPassword != undefined && outputForgetPassword.ok==false" class="m-form__help m--font-danger">
//       {{outputForgetPassword.error?.message}}
//     </span>
//     <span *ngIf="outputForgetPassword != undefined && outputForgetPassword.success==true && outputForgetPassword?.message"
//       class="m-form__help m--font-success">
//       {{outputForgetPassword.message}}
//     </span>
//   </div>
//   <div class="m-login__form-action" *ngIf="outputForgetPassword == undefined || outputForgetPassword?.success != true">
//     <button [disabled]="loading" [ngClass]="{'m-loader m-loader--right m-loader--light': loading}" id="forgetPasswordForm_submit" class="btn btn-primary m-btn m-btn--pill m-btn--custom m-btn--air">
//       Enviar
//     </button>
//     <button [disabled]="loading"  id="forgetPasswordForm_cancel" class="btn btn-outline-primary m-btn m-btn--pill m-btn--custom ">
//       Cancelar
//     </button>
//   </div>
// </form>
// </div>
// <div *ngIf="!isAnima"  class="m-login__change-password">
// <div class="m-login__head">
//   <h3 class="m-login__title">
//     Troca senha
//   </h3>
//   <div class="m-login__desc">
//     Atualize sua nova senha:
//   </div>
// </div>
// <form (ngSubmit)="changePasswordForm.valid && changePassword()" #changePasswordForm="ngForm" class="m-login__form m-form" action="">
//   <ng-template #alertChangePass></ng-template>
//   <div class="form-group m-form__group">
//     <input class="form-control m-input m-login__form-input--last"
//     type="Password"
//     placeholder="Nova senha"
//     name="password"
//     [(ngModel)]="updatePasswordData.password"
//     require
//     #password="ngModel">
//   </div>
//   <div class="form-group m-form__group">
//     <input class="form-control m-input m-login__form-input--last"
//     type="Password"
//     placeholder="Confirme sua senha"
//     name="password"
//     [(ngModel)]="updatePasswordData.passwordConfirmation"
//     required
//     #password="ngModel">
//   </div>
//   <div *ngIf="outputChangePassword != undefined" class="m-login__form-sub">
//       <span *ngIf="outputChangePassword != undefined && outputChangePassword.ok==false" class="m-form__help m--font-danger">
//         {{outputChangePassword.error?.errors[0]}}
//       </span>
//       <span *ngIf="outputChangePassword != undefined && outputChangePassword.success==true && outputChangePassword?.message"
//         class="m-form__help m--font-success">
//         {{outputChangePassword.message}}
//       </span>
//   </div>
//   <div class="m-login__form-action">
//     <button [disabled]="loading" [ngClass]="{'m-loader m-loader--right m-loader--light': loading}" id="changePasswordForm_submit" class="btn btn-primary m-btn m-btn--pill m-btn--custom m-btn--air">
//       Enviar
//     </button>
//     <button [disabled]="loading"  id="changePasswordForm_cancel" class="btn btn-outline-primary m-btn m-btn--pill m-btn--custom ">
//       Cancelar
//     </button>
//   </div>
// </form>
// </div>