import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DynamicAttributesDirective, DynamicComponent, DynamicDirective, DynamicModule} from 'ng-dynamic-component';
import {WidgetTimeComponent} from '../../widgets/widget-time/component/widget-time.component';
import {WidgetWeatherComponent} from '../../widgets/widget-weather/component/widget-weather.component';
import {WidgetIframeComponent} from '../../widgets/widget-iframe/component/widget-iframe.component';
import {WidgetTimeModule} from '../../widgets/widget-time/widget-time.module';
import {WidgetWeatherModule} from '../../widgets/widget-weather/widget-weather.module';
import {WidgetIframeModule} from '../../widgets/widget-iframe/widget-iframe.module';
import {WidgetCalculatorModule} from "../../widgets/widget-calculator/widget-calculator.module";
import {WidgetCalendarModule} from "../../widgets/widget-calendar/widget-calendar.module";
import {WidgetCalculatorComponent} from "../../widgets/widget-calculator/component/widget-calculator.component";


@NgModule({
    imports: [
        CommonModule,

        WidgetTimeModule,
        WidgetWeatherModule,
        WidgetIframeModule,
        WidgetCalculatorModule,

        DynamicModule.withComponents([
            WidgetTimeComponent,
            WidgetWeatherComponent,
            WidgetIframeComponent,
            WidgetCalculatorComponent,
            WidgetCalendarModule
        ]),
    ],
    declarations: [],
    exports: [
        DynamicComponent,
        DynamicDirective,
        DynamicAttributesDirective,
        DynamicModule,
    ]
})
export class ViewifyDynamicModule {
}
