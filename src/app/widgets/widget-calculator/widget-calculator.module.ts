import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WidgetCalculatorComponent} from './component/widget-calculator.component';
import {
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatCardModule,
    MatSlideToggleModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {WidgetModule} from "../widget/widget.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        MatMenuModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatSlideToggleModule,

        WidgetModule
    ],
    declarations: [
        WidgetCalculatorComponent,
    ],
    exports: [
        WidgetCalculatorComponent,
    ],
})
export class WidgetCalculatorModule {
}
