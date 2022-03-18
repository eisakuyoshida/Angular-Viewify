import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule
} from '@angular/material';

import { BaseStructuresModule } from '../../shared/base-structures/base-structures.module';
import { WidgetModule } from '../widget/widget.module';
import { WidgetIframeCustomComponent } from './component/widget-iframe-custom.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        BaseStructuresModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        MatFormFieldModule,
        WidgetModule,
    ],
    declarations: [WidgetIframeCustomComponent],
    exports: [WidgetIframeCustomComponent],
})
export class WidgetIframeCustomModule {
}
