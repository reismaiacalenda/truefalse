import { NgModule } from '@angular/core';
import { LayoutComponent } from './layout/layout.component';
import { HeaderNavComponent } from './header-nav/header-nav.component';
import { DefaultComponent } from '../pages/default/default.component';
import { AsideNavComponent } from './aside-nav/aside-nav.component';
import { FooterComponent } from './footer/footer.component';
import { QuickSidebarComponent } from './quick-sidebar/quick-sidebar.component';
import { ScrollTopComponent } from './scroll-top/scroll-top.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HrefPreventDefaultDirective } from '../../_directives/href-prevent-default.directive';
import { UnwrapTagDirective } from '../../_directives/unwrap-tag.directive';
import { ModalService } from '../pages/default/modal/modal.service';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ReservaModalService } from '../pages/default/reservas/reserva-modal/reserva-modal.service';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImportarAgendaComponent } from './header-nav/importar-agenda/importar-agenda.component';
import { LoadingSpinComponent } from './loading-spin/loading-spin.component';

@NgModule({
    exports: [
        LayoutComponent,
        HeaderNavComponent,
        ImportarAgendaComponent,
        DefaultComponent,
        AsideNavComponent,
        FooterComponent,
        QuickSidebarComponent,
        LoadingSpinComponent,
        ScrollTopComponent,
        HrefPreventDefaultDirective,
    ],
    imports: [
        CommonModule,
        RouterModule,
        InlineSVGModule.forRoot(),
        NgbDropdownModule,
        NgbModule,
        LayoutComponent,
        HeaderNavComponent,
        ImportarAgendaComponent,
        DefaultComponent,
        AsideNavComponent,
        FooterComponent,
        QuickSidebarComponent,
        LoadingSpinComponent,
        ScrollTopComponent,
        HrefPreventDefaultDirective,
        UnwrapTagDirective
    ],
    providers: [
        ModalService,
        ReservaModalService
    ]
})
export class LayoutModule {
}
