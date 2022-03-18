import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material';

import { BaseStructuresModule } from '../../shared/base-structures/base-structures.module';
import {
    WidgetComponent, WidgetFullComponent, WidgetIconComponent, WidgetSettingsComponent,
    WidgetSettingsOnAddingComponent
} from './component/widget.component';

@NgModule({
    imports: [
        CommonModule,
        BaseStructuresModule,
        MatIconModule
    ],
    declarations: [
        WidgetComponent,
        WidgetIconComponent,
        WidgetFullComponent,
        WidgetSettingsComponent,
        WidgetSettingsOnAddingComponent
    ],
    exports: [
        WidgetComponent,
        WidgetIconComponent,
        WidgetFullComponent,
        WidgetSettingsComponent,
        WidgetSettingsOnAddingComponent
    ]
})
export class WidgetModule {
}
