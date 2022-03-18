import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WidgetWhatsappComponent} from './component/widget-whatsapp.component';
import {BaseStructuresModule} from '../../shared/base-structures/base-structures.module';
import {WidgetModule} from '../widget/widget.module';

@NgModule({
    imports: [
        CommonModule,
        BaseStructuresModule,
        WidgetModule,
    ],
    declarations: [WidgetWhatsappComponent],
    exports: [
        WidgetWhatsappComponent,
    ]
})
export class WidgetWhatsappModule {
}
