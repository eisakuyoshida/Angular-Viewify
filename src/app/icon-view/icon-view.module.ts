import { DragAndDropModule } from 'angular-draggable-droppable';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
    MatButtonModule, MatCardModule, MatDialogModule, MatIconModule, MatMenuModule, MatSidenavModule,
    MatTabsModule, MatToolbarModule
} from '@angular/material';

import { QuoteModule } from '../quote/quote.module';
import { BaseStructuresModule } from '../shared/base-structures/base-structures.module';
import { StorageModule } from '../shared/storage/storage.module';
import { WidgetsAddPopupModule } from '../widgets/widgets-add-popup/widgets-add-popup.module';
import { WidgetsDynamicModule } from '../widgets/widgets-dynamic/widgets-dynamic.module';
import { IconViewComponent } from './component/icon-view.component';
import { DraggableIconsComponent } from './draggable-icons/draggable-icons.component';

@NgModule({
    imports: [
        CommonModule,

        MatCardModule,
        MatIconModule,
        MatDialogModule,
        MatMenuModule,
        MatButtonModule,
        MatToolbarModule,
        MatSidenavModule,
        MatTabsModule,
        DragAndDropModule,
        QuoteModule,
        BaseStructuresModule,
        StorageModule,
        WidgetsDynamicModule,
        WidgetsAddPopupModule
    ],
    declarations: [
        DraggableIconsComponent,
        IconViewComponent
    ],
    exports: [
        IconViewComponent,
    ]
})
export class IconViewModule { }
