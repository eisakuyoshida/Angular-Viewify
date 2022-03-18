import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StorageModule} from '../shared/storage/storage.module';
import {
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule
} from '@angular/material';
import {IconViewModule} from '../icon-view/icon-view.module';
import {DeskComponent} from './component/desk.component';
import {BaseStructuresModule} from '../shared/base-structures/base-structures.module';
import {FullViewModule} from '../full-view/full-view.module';
import {WidgetsDynamicModule} from '../widgets/widgets-dynamic/widgets-dynamic.module';
import {FormsModule} from "@angular/forms";

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        MatCardModule,
        MatIconModule,
        MatDialogModule,
        MatMenuModule,
        MatButtonModule,
        MatToolbarModule,
        MatSidenavModule,
        MatTabsModule,
        MatTooltipModule,
        MatCheckboxModule,
        MatDividerModule,

        StorageModule,
        BaseStructuresModule,
        WidgetsDynamicModule,

        FullViewModule,
        IconViewModule
    ],
    declarations: [
        DeskComponent,
    ],
    exports: [
        DeskComponent,
    ],
    providers: []
})
export class DeskModule {
}
