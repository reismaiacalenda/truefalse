import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthComponent } from "./auth.component";
import { WorkspaceAcessarComponent } from './workspaces/acessar/workspace_acessar.component';
import { WorkspaceIndefinidoComponent } from './workspaces/indefinido/workspace_indefinido.component';
import { WorkspaceLoadingComponent } from './workspaces/loading/workspace_loading.component';
import { WorkspaceNaoEncontradoComponent } from './workspaces/nao_encontrado/workspace_nao_encontrado.component';
import { WorkspacePublicoSignupComponent } from './workspaces/acessar/publico_signin/publico_signup/workspace_publico_signup.component';
import { WorkspacePublicoSigninComponent } from './workspaces/acessar/publico_signin/workspace_publico_signin.component';
import { WorkspaceChangePasswordComponent } from './workspaces/acessar/publico_signin/change_password/workspace_change_password.component';
import { WorkspaceForgetPasswordComponent } from './workspaces/acessar/publico_signin/forget_password/workspace_forget_password.component';
import { WorkspaceRestritoSigninComponent } from './workspaces/acessar/restrito_signin/workspace_restrito_signin.component';
import { WorkspaceSelecionarUnidadeComponent } from './workspaces/selecionar_unidade/workspace_selecionar_unidade.component';
import { WorkspaceCriarComponent } from './workspaces/criar/criar/workspace_criar.component';
import { WorkspaceProvedorComponent } from './workspaces/criar/provedor/workspace_provedor.component';
import { WorkspacePreparandoComponent } from './workspaces/criar/preparando/workspace_preparando.component';
import { WorkspaceRestringirComponent } from './workspaces/criar/restringir/workspace_restringir.component';
import { WorkspaceConviteComponent } from './workspaces/criar/convite/workspace_convite.component';
import { WorkspaceAguardandoConfirmacaoComponent } from './workspaces/acessar/publico_signin/aguardando_confirmacao/workspace_aguardando_confirmacao.component';
import { WorkspaceDescobrirComponent } from './workspaces/acessar/descobrir/workspace_descobrir.component';
import { WorkspaceResetPasswordSentComponent } from "./workspaces/acessar/publico_signin/reset_password_sent/workspace_reset_password_sent.component";
import { WorkspacePasswordChangedComponent } from "./workspaces/acessar/publico_signin/password_changed/workspace_password_changed.component";

const routes: Routes = [
  { path: '', component: AuthComponent,
    children: [
      // { path: '', component: WorkspaceIndefinidoComponent },
      { path: '', component: WorkspaceLoadingComponent},
      // { path: 'loading', component: WorkspaceLoadingComponent},
      { path: 'nao_encontrado', component: WorkspaceNaoEncontradoComponent},
      { path: 'descobrir', component: WorkspaceDescobrirComponent},
      { path: 'indefinido', component: WorkspaceIndefinidoComponent},
      { path: 'acessar', component: WorkspaceAcessarComponent},
      { path: 'restrito_signin', component: WorkspaceRestritoSigninComponent},
      { path: 'publico_signin', component: WorkspacePublicoSigninComponent},
      { path: 'publico_signup', component: WorkspacePublicoSignupComponent},
      { path: 'change_password', component: WorkspaceChangePasswordComponent},
      { path: 'forget_password', component: WorkspaceForgetPasswordComponent},
      { path: 'reset_password_sent', component: WorkspaceResetPasswordSentComponent},
      { path: 'password_changed', component: WorkspacePasswordChangedComponent},
      { path: 'selecionar_unidade', component: WorkspaceSelecionarUnidadeComponent},
      { path: 'criar', component: WorkspaceCriarComponent},
      { path: 'provedor', component: WorkspaceProvedorComponent},
      { path: 'preparando', component: WorkspacePreparandoComponent},
      { path: 'restringir', component: WorkspaceRestringirComponent},
      { path: 'convite', component: WorkspaceConviteComponent},
      { path: 'aguardando_confirmacao', component: WorkspaceAguardandoConfirmacaoComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}
