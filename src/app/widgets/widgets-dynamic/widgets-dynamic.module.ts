import {WidgetIframeCustomModule} from './../widget-iframe-custom/widget-iframe-custom.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DynamicAttributesDirective, DynamicComponent, DynamicDirective, DynamicModule} from 'ng-dynamic-component';
import {WidgetTimeModule} from '../widget-time/widget-time.module';
import {WidgetWhatsappModule} from '../widget-whatsapp/widget-whatsapp.module';
import {WidgetDriveModule} from '../widget-drive/widget-drive.module';
import {WidgetWeatherModule} from '../widget-weather/widget-weather.module';
import {WidgetIframeModule} from '../widget-iframe/widget-iframe.module';
import {WidgetTimeComponent} from '../widget-time/component/widget-time.component';
import {WidgetWhatsappComponent} from '../widget-whatsapp/component/widget-whatsapp.component';
import {WidgetDriveComponent} from '../widget-drive/component/widget-drive.component';
import {WidgetWeatherComponent} from '../widget-weather/component/widget-weather.component';
import {WidgetIframeComponent} from '../widget-iframe/component/widget-iframe.component';
import {WidgetIframeCustomComponent} from '../widget-iframe-custom/component/widget-iframe-custom.component';
import {WidgetCalculatorComponent} from "../widget-calculator/component/widget-calculator.component";
import {WidgetCalculatorModule} from "../widget-calculator/widget-calculator.module";
import {WidgetCalendarComponent} from "../widget-calendar/component/calendar-widget/widget-calendar.component";
import {WidgetCalendarModule} from "../widget-calendar/widget-calendar.module";

import {WidgetsDynamicService} from "./widgets-dynamic.service";

@NgModule({
    imports: [
        CommonModule,

        WidgetWeatherModule,
        WidgetCalculatorModule,
        WidgetTimeModule,
        WidgetWhatsappModule,
        WidgetDriveModule,
        WidgetIframeModule,
        WidgetIframeCustomModule,
        WidgetCalendarModule,

        DynamicModule.withComponents([
            WidgetTimeComponent,
            WidgetWhatsappComponent,
            WidgetDriveComponent,
            WidgetCalculatorComponent,
            WidgetCalendarComponent,
            WidgetWeatherComponent,
            WidgetIframeComponent,
            WidgetIframeCustomComponent,
        ]),
    ],
    declarations: [],
    providers: [
        WidgetsDynamicService,
    ],
    exports: [
        DynamicComponent,
        DynamicDirective,
        DynamicAttributesDirective,
        DynamicModule,
    ]
})
export class WidgetsDynamicModule {
}

