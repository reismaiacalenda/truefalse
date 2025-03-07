import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BaseRequestOptions } from "@angular/http";
import { MockBackend } from "@angular/http/testing";

import { AuthRoutingModule } from "./auth-routing.routing";
import { AuthComponent } from "./auth.component";
import { AlertComponent } from "./_directives/alert.component";
import { LogoutComponent } from "./logout/logout.component";
import { AuthGuard } from "./_guards/auth.guard";
import { AlertService } from "./_services/alert.service";
import { AuthenticationService } from "./_services/authentication.service";
// import { fakeBackendProvider } from "./_helpers/index";
import { HttpClientModule } from '@angular/common/http';
import { WorkspaceIndefinidoComponent } from './workspaces/indefinido/workspace_indefinido.component';
import { WorkspaceAcessarComponent } from './workspaces/acessar/workspace_acessar.component';
import { WorkspacePublicoSignupComponent } from './workspaces/acessar/publico_signin/publico_signup/workspace_publico_signup.component';
import { WorkspaceLoadingComponent } from './workspaces/loading/workspace_loading.component';
import { WorkspaceNaoEncontradoComponent } from './workspaces/nao_encontrado/workspace_nao_encontrado.component';
import { WorkspaceChangePasswordComponent } from './workspaces/acessar/publico_signin/change_password/workspace_change_password.component';
import { WorkspaceForgetPasswordComponent } from './workspaces/acessar/publico_signin/forget_password/workspace_forget_password.component';
import { WorkspacePublicoSigninComponent } from './workspaces/acessar/publico_signin/workspace_publico_signin.component';
import { WorkspaceRestritoSigninComponent } from './workspaces/acessar/restrito_signin/workspace_restrito_signin.component';
import { WorkspaceSelecionarUnidadeComponent } from './workspaces/selecionar_unidade/workspace_selecionar_unidade.component';
import { AndaimeModule } from '../_andaime/andaime.module';
import { WorkspaceCriarComponent } from './workspaces/criar/criar/workspace_criar.component';
import { WorkspaceProvedorComponent } from './workspaces/criar/provedor/workspace_provedor.component';
import { WorkspacePreparandoComponent } from './workspaces/criar/preparando/workspace_preparando.component';
import { WorkspaceRestringirComponent } from './workspaces/criar/restringir/workspace_restringir.component';
import { WorkspaceConviteComponent } from './workspaces/criar/convite/workspace_convite.component';
import { WorkspaceAguardandoConfirmacaoComponent } from './workspaces/acessar/publico_signin/aguardando_confirmacao/workspace_aguardando_confirmacao.component';
import { WorkspaceDescobrirComponent } from './workspaces/acessar/descobrir/workspace_descobrir.component';
import { NgxMaskModule } from 'ngx-mask';
import { ModalService } from '../theme/pages/default/modal/modal.service';
import { WorkspaceResetPasswordSentComponent } from "./workspaces/acessar/publico_signin/reset_password_sent/workspace_reset_password_sent.component";
import { InlineSVGModule } from "ng-inline-svg-2";
import { WorkspacePasswordChangedComponent } from "./workspaces/acessar/publico_signin/password_changed/workspace_password_changed.component";

@NgModule({
  declarations: [
    AuthComponent,
    AlertComponent,
    LogoutComponent,
    WorkspaceIndefinidoComponent,
    WorkspaceAcessarComponent,
    WorkspaceDescobrirComponent,
    WorkspaceChangePasswordComponent,
    WorkspaceForgetPasswordComponent,
    WorkspacePasswordChangedComponent,
    WorkspaceResetPasswordSentComponent,
    WorkspacePublicoSignupComponent,
    WorkspacePublicoSigninComponent,
    WorkspaceRestritoSigninComponent,
    WorkspaceLoadingComponent,
    WorkspaceNaoEncontradoComponent,
    WorkspaceSelecionarUnidadeComponent,
    WorkspaceCriarComponent,
    WorkspaceProvedorComponent,
    WorkspacePreparandoComponent,
    WorkspaceRestringirComponent,
    WorkspaceConviteComponent,
    WorkspaceAguardandoConfirmacaoComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    AuthRoutingModule,
    AndaimeModule,
    ReactiveFormsModule,
    NgxMaskModule,
    InlineSVGModule
  ],
  providers: [
    AuthGuard,
    AlertService,
    AuthenticationService,
    ModalService
    // api backend simulation
    // fakeBackendProvider,
    // MockBackend,
    // BaseRequestOptions,
  ],
  entryComponents: [AlertComponent]
})

export class AuthModule {
}
