import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    MatAutocompleteModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule,
    MatSlideToggleModule
} from '@angular/material';

import { BaseStructuresModule } from '../../shared/base-structures/base-structures.module';
import { UtilsModule } from '../../shared/utils/utils.module';
import { WidgetModule } from '../widget/widget.module';
import { WidgetWeatherComponent } from './component/widget-weather.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        UtilsModule,
        BaseStructuresModule,
        WidgetModule,
        MatSlideToggleModule,
        MatIconModule,
        MatAutocompleteModule
    ],
    declarations: [WidgetWeatherComponent],
    exports: [
        WidgetWeatherComponent,
    ]
})
export class WidgetWeatherModule {
}
