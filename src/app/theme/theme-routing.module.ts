import { NgModule } from '@angular/core';
import { ThemeComponent } from './theme.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "../auth/_guards/auth.guard";

const routes: Routes = [
  {
    path: "",
    component: ThemeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "index",
        loadChildren: () => import('./pages/default/index/index.module').then(m => m.IndexModule)
      },
      // {
      //   "path": "index\/",
      //   "loadChildren": ".\/pages\/default\/index\/index.module#IndexModule"
      // },
      {
        path: "header/actions",
        loadChildren: () => import('./pages/default/header/header-actions/header-actions.module').then(m => m.HeaderActionsModule)
      },
      {
        path: "header/profile",
        loadChildren: () => import('./pages/default/header/header-profile/header-profile.module').then(m => m.HeaderProfileModule)
      },
      {
        path: "acompanhamentos/monitoramento",
        loadChildren: () => import('./pages/default/acompanhamentos/monitoramento/monitoramento.module').then(m => m.MonitoramentoModule)
      },
      {
        path: "acompanhamentos/monitoramento/porta",
        loadChildren: () => import('./pages/default/acompanhamentos/monitoramento/porta/portas.module').then(m => m.PortasModule)
      },
      {
        path: "cadastros/checkups",
        loadChildren: () => import('./pages/default/cadastros/checkups/checkups.module').then(m => m.CheckupsModule)
      },
      {
        path: "cadastros/questionarios",
        loadChildren: () => import('./pages/default/cadastros/questionario/questionario.module').then(m => m.QuestionarioModule)
      },
      {
        path: "reservas/relatorios",
        loadChildren: () => import('./pages/default/reservas/relatorios/relatorios.module').then(m => m.RelatoriosModule)
      },
      {
        path: "acompanhamentos/relatorios/analitico",
        loadChildren: () => import('./pages/default/reservas/relatorios/relatorio-analitico/relatorio-analitico.module').then(m => m.RelatorioAnaliticoModule)
      },
      {
        path: "acompanhamentos/relatorios/tatico",
        loadChildren: () => import('./pages/default/reservas/relatorios/relatorio-tatico/relatorio-tatico.module').then(m => m.RelatorioTaticoModule)
      },
      {
        path: "reservas/calendario/:id",
        loadChildren: () => import('./pages/default/reservas/calendario/agenda.module').then(m => m.AgendaModule)
      },
      {
        path: "reservas/calendario",
        loadChildren: () => import('./pages/default/reservas/calendario/agenda.module').then(m => m.AgendaModule)
      },
      {
        path: "workspace/qrcalenda",
        loadChildren: () => import('./pages/default/reservas/qrcode/qrcode.module').then(m => m.QrcodeModule)
      },
      {
        path: "acompanhamentos/listagem",
        loadChildren: () => import('./pages/default/reservas/listagem/listagem.module').then(m => m.ListagemModule)
      },
      {
        path: "reservas/quadros",
        loadChildren: () => import('./pages/default/reservas/quadros/quadros.module').then(m => m.QuadrosModule)
      },
      {
        path: "reservas/quadros/espacos",
        loadChildren: () => import('./pages/default/reservas/quadros/quadro-espacos/quadro-espacos.module').then(m => m.QuadroEspacoModule)
      },
      {
        path: "reservas/quadros/pessoas",
        loadChildren: () => import('./pages/default/reservas/quadros/quadro-pessoas/quadro-pessoas.module').then(m => m.QuadroPessoaModule)
      },
      {
        path: "reservas/quadros/recursos",
        loadChildren: () => import('./pages/default/reservas/quadros/quadro-recursos/quadro-recursos.module').then(m => m.QuadroRecursoModule)
      },
      {
        path: "reservas/my-bookings",
        loadChildren: () => import('./pages/default/reservas/my-bookings/my-bookings.module').then(m => m.MyBookingsModule)
      },
      {
        path: "acompanhamentos/recursos-alocados",
        loadChildren: () => import('./pages/default/reservas/recursos-alocados/recursos-alocados.module').then(m => m.RecursosAlocadosModule)
      },
      {
        path: "reservas/mapa-interativo",
        loadChildren: () => import('./pages/default/reservas/mapa-interativo/mapa-interativo.module').then(m => m.MapaInterativoModule)
      },
      {
        path: "reservas/mapa",
        loadChildren: () => import('./pages/default/reservas/mapa/mapa.module').then(m => m.MapaModule)
      },
      {
        path: "reservas/mapa-desktop",
        loadChildren: () => import('./pages/default/reservas/mapa-desktop/mapa-desktop.module').then(m => m.MapaDesktopModule)
      },
      {
        path: "reservas/agendador",
        loadChildren: () => import('./pages/default/reservas/agendador/agendador.module').then(m => m.AgendadorModule)
      },
      // {
      //   "path": "reservas\/reserva-modal",
      //   "loadChildren": ".\/pages\/default\/reservas\/reserva-modal\/reserva-modal.module#ReservaModalModule"
      // },
      // {
      //   "path": "reservas\/pordia",
      //   "loadChildren": ".\/pages\/default\/reservas\/pordia\/pordia.module#PordiaModule"
      // },
      // {
      //   "path": "reservas\/reservas",
      //   "loadChildren": ".\/pages\/default\/reservas\/reservas\/reservas.module#ReservaModule"
      // },
      // {
      //   "path": "cadastros/assinatura",
      //   "loadChildren": ".\/pages\/default\/cadastros\/assinatura\/assinatura.module#AssinaturaModule"
      // },
      {
        path: "acompanhamentos",
        loadChildren: () => import('./pages/default/acompanhamentos/acompanhamentos.module').then(m => m.AcompanhamentosModule)
      },
      {
        path: "acompanhamentos/checkups/exames",
        loadChildren: () => import('./pages/default/cadastros/exame/exame.module').then(m => m.ExameModule)
      },
      {
        path: "cadastros",
        loadChildren: () => import('./pages/default/cadastros/cadastros/cadastros.module').then(m => m.CadastrosModule)
      },
      {
        path: "cadastros/outros/didatico-simples",
        loadChildren: () => import('./pages/default/cadastros/outros/didatico-simples/didatico-simples.module').then(m => m.DidaticoSimplesModule)
      },
      {
        path: "cadastros/outros/didatico-abas",
        loadChildren: () => import('./pages/default/cadastros/outros/didatico-abas/didatico.module').then(m => m.DidaticoModule)
      },
      {
        path: "cadastros/espacos/integrar-calendarios",
        loadChildren: () => import('./pages/default/cadastros/espacos/integracao/integracao.module').then(m => m.IntegracaoModule)
      },
      {
        path: "cadastros/outros/client-api",
        loadChildren: () => import('./pages/default/cadastros/outros/client-api/client-api.module').then(m => m.ClientApiModule)
      },
      {
        path: "cadastros/outros/configuracao",
        loadChildren: () => import('./pages/default/cadastros/outros/configuracao/configuracao.module').then(m => m.ConfiguracaoModule)
      },
      {
        path: "cadastros/outros/crud",
        loadChildren: () => import('./pages/default/cadastros/outros/crud/crud.module').then(m => m.CrudModule)
      },
      // {
      //   "path": "cadastros/empresa",
      //   "loadChildren": ".\/pages\/default\/cadastros\/empresa\/empresa.module#EmpresaModule"
      // },
      // {
      //   "path": "cadastros/fatura",
      //   "loadChildren": ".\/pages\/default\/cadastros\/fatura\/fatura.module#FaturaModule"
      // },
      {
        path: "cadastros/pessoas/aprovadores",
        loadChildren: () => import('./pages/default/cadastros/pessoas/aprovadores/aprovadores.module').then(m => m.AprovadoresModule)
      },
      {
        path: "cadastros/pessoas/pessoas",
        loadChildren: () => import('./pages/default/cadastros/pessoas/pessoas/pessoas.module').then(m => m.PessoaModule)
      },
      {
        path: "cadastros/pessoas/grupos",
        loadChildren: () => import('./pages/default/cadastros/pessoas/grupos/grupos.module').then(m => m.GruposModule)
      },
      {
        path: "cadastros/pessoas/avatar",
        loadChildren: () => import('./pages/default/cadastros/pessoas/avatar/avatar.module').then(m => m.AvatarModule)
      },
      {
        path: "customizacoes",
        loadChildren: () => import('./pages/default/customizacoes/customizacoes.module').then(m => m.CustomizacoesModule)
      },
      {
        path: "customizacoes/campos-customizados",
        loadChildren: () => import('./pages/default/customizacoes/campos-customizados/campos-customizados.module').then(m => m.CamposCustomizadosModule)
      },
      {
        path: "customizacoes/checkups/questionarios",
        loadChildren: () => import('./pages/default/cadastros/questionario/questionario.module').then(m => m.QuestionarioModule)
      },
      {
        path: "customizacoes/campos-customizados",
        loadChildren: () => import('./pages/default/customizacoes/campos-customizados/campos-customizados.module').then(m => m.CamposCustomizadosModule)
      },
      {
        path: "customizacoes/regras",
        loadChildren: () => import('./pages/default/customizacoes/regras/regra.module').then(m => m.RegraModule)
      },
      {
        path: "customizacoes/filtros",
        loadChildren: () => import('./pages/default/customizacoes/filtros/filtro.module').then(m => m.FiltroModule)
      },
      {
        path: "customizacoes/layouts",
        loadChildren: () => import('./pages/default/customizacoes/layouts/layouts.module').then(m => m.LayoutsModule)
      },
      {
        path: "customizacoes/layouts/templates",
        loadChildren: () => import('./pages/default/customizacoes/layouts/template/template.module').then(m => m.TemplateModule)
      },
      {
        path: "customizacoes/layouts/porta",
        loadChildren: () => import('./pages/default/customizacoes/layouts/porta/layout-porta.module').then(m => m.LayoutPortaModule)
      },
      {
        path: "customizacoes/layouts/painel",
        loadChildren: () => import('./pages/default/customizacoes/layouts/painel/layout-painel.module').then(m => m.LayoutPainelModule)
      },
      {
        path: "customizacoes/checkups",
        loadChildren: () => import('./pages/default/cadastros/checkups/checkups.module').then(m => m.CheckupsModule)
      },
      {
        path: "workspace",
        loadChildren: () => import('./pages/default/workspace/workspace.module').then(m => m.WorkspaceModule)
      },
      {
        path: "workspace/unidades",
        loadChildren: () => import('./pages/default/workspace/unidades/unidade.module').then(m => m.UnidadeModule)
      },
      {
        path: "workspace/instituicoes",
        loadChildren: () => import('./pages/default/workspace/instituicoes/instituicao.module').then(m => m.InstituicaoModule)
      },
      {
        path: "workspace/costumer-success",
        loadChildren: () => import('./pages/default/workspace/costumer-success/costumer-success.module').then(m => m.CostumerSuccessModule)
      },
      {
        path: "workspace/guia",
        loadChildren: () => import('./pages/default/workspace/guia/guia.module').then(m => m.GuiaModule)
      },
      {
        path: "workspace/changelog",
        loadChildren: () => import('./pages/default/workspace/changelog/changelog.module').then(m => m.ChangelogModule)
      },
      {
        path: "workspace/qrcalenda",
        loadChildren: () => import('./pages/default/reservas/qrcode/qrcode.module').then(m => m.QrcodeModule)
      },
      // {
      //   "path": ":workspace_route",
      //   "redirectTo": "alguma rota q trata o workspace com index.",
      //   "pathMatch": "full"
      // },
      {
        path: "cadastros/espacos/localizacao",
        loadChildren: () => import('./pages/default/cadastros/espacos/localizacao/localizacao.module').then(m => m.LocalizacaoModule)
      },
      // {
      //   "path": "cadastros/painel",
      //   "loadChildren": ".\/pages\/default\/cadastros\/painel\/painel.module#PainelModule"
      // },
      // {
      //   "path": "cadastros/plano",
      //   "loadChildren": ".\/pages\/default\/cadastros\/plano\/plano.module#PlanoModule"
      // },
      {
        path: "cadastros/recursos/recursos",
        loadChildren: () => import('./pages/default/cadastros/recursos/recursos/recurso.module').then(m => m.RecursoModule)
      },
      {
        path: "cadastros/recursos/modelos",
        loadChildren: () => import('./pages/default/cadastros/recursos/modelo/modelo.module').then(m => m.ModeloModule)
      },
      {
        path: "cadastros/recursos/fiscais",
        loadChildren: () => import('./pages/default/cadastros/recursos/fiscal/fiscal.module').then(m => m.FiscalModule)
      },
      {
        path: "cadastros/espacos/espacos",
        loadChildren: () => import('./pages/default/cadastros/espacos/espaco/espaco.module').then(m => m.EspacoModule)
      },
      {
        path: "cadastros/recursos/servicos",
        loadChildren: () => import('./pages/default/cadastros/recursos/servicos/servico.module').then(m => m.ServicoModule)
      },
      {
        path: "cadastros/espacos/tipos-de-espaco",
        loadChildren: () => import('./pages/default/cadastros/espacos/tipos-de-espaco/tipo.module').then(m => m.TipoModule)
      },
      {
        path: "cadastros/espacos/amenities",
        loadChildren: () => import('./pages/default/cadastros/espacos/amenities/amenities.module').then(m => m.AmenitiesModule)
      },
      {
        path: "cadastros/espacos/planta",
        loadChildren: () => import('./pages/default/cadastros/espacos/planta/planta.module').then(m => m.PlantaModule)
      },
      {
        path: "cadastros/espacos/amenities-installed",
        loadChildren: () => import('./pages/default/cadastros/espacos/amenities-installed/amenities-installed.module').then(m => m.AmenitiesInstalledModule)
      },
      {
        path: "notifications",
        loadChildren: () => import('./pages/default/notifications/notifications.module').then(m => m.NotificationsModule)
      },
      {
        path: "404",
        loadChildren: () => import('./pages/default/not-found/not-found/not-found.module').then(m => m.NotFoundModule)
      },
      {
        path: "",
        redirectTo: "index",
        pathMatch: "full"
      }
    ]
  },
  {
    path: "**",
    redirectTo: "404",
    pathMatch: "prefix"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThemeRoutingModule { }
