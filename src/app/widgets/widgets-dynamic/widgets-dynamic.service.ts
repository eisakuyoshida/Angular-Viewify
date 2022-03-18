import { BehaviorSubject, Observable } from 'rxjs';

import { Injectable } from '@angular/core';

import { Widget } from '../../shared/base-structures/widget';
import { WidgetDefaultSettings } from '../../shared/base-structures/widget-default-settings';
import { WidgetType } from '../../shared/base-structures/widget-type';
import { WidgetIframeComponent } from '../widget-iframe/component/widget-iframe.component';
import { WidgetIframeSettings } from '../widget-iframe/widget-iframe-settings';
import { WidgetTimeComponent } from '../widget-time/component/widget-time.component';
import { WidgetWeatherComponent } from '../widget-weather/component/widget-weather.component';
import { WidgetWhatsappComponent } from '../widget-whatsapp/component/widget-whatsapp.component';
import { WidgetDriveComponent } from '../widget-drive/component/widget-drive.component';
import {WidgetCalculatorComponent} from "../widget-calculator/component/widget-calculator.component";
import {WidgetCalendarComponent} from "../widget-calendar/component/calendar-widget/widget-calendar.component";

@Injectable()
export class WidgetsDynamicService {
    private widgetsList: BehaviorSubject<Widget[]> = new BehaviorSubject([
        new Widget('w-weather', 'Weather', WidgetWeatherComponent, <WidgetDefaultSettings>{
            cellsCount: 2,
            height: 250,
            types: [WidgetType.icon, WidgetType.full],
            showHeaderByDefault: true,
            headerNameByDefault: 'Weather'
        }),
        new Widget('w-time', 'Time', WidgetTimeComponent, <WidgetDefaultSettings>{
            cellsCount: 2,
            height: 250,
            types: [WidgetType.icon, WidgetType.full],
            showHeaderByDefault: false,
            headerNameByDefault: 'Time'
        }),
        new Widget('w-g-mail', 'Gmail', WidgetIframeComponent, <WidgetIframeSettings>{
            cellsCount: 2,
            height: 450,
            types: [WidgetType.icon, WidgetType.full],
            fontSet: 'far',
            fontIcon: 'fa-envelope',
            url: 'https://mail.google.com/mail/mu/mp/?authuser=0',
            showHeaderByDefault: true,
            headerNameByDefault: 'Gmail'
        }),

        new Widget('w-whatsapp', 'Whatsapp', WidgetWhatsappComponent, <WidgetDefaultSettings>{
            cellsCount: 4,
            height: 450,
            types: [WidgetType.icon, WidgetType.full],
            showHeaderByDefault: true,
            headerNameByDefault: 'Whatsapp'
        }),
        new Widget('w-drive', 'Google Drive', WidgetDriveComponent, <WidgetDefaultSettings>{
            cellsCount: 4,
            height: 450,
            types: [WidgetType.icon, WidgetType.full],
            showHeaderByDefault: true,
            headerNameByDefault: 'Google Drive'
        }),

        new Widget('w-calculator', 'Calculator', WidgetCalculatorComponent, <WidgetDefaultSettings>{
            cellsCount: 2,
            height: 350,
            types: [WidgetType.icon, WidgetType.full],
            showHeaderByDefault: true,
            headerNameByDefault: 'Calculator'
        }),
        new Widget('w-calendar', 'Calendar', WidgetCalendarComponent, <WidgetDefaultSettings>{
            cellsCount: 2,
            height: 350,
            types: [WidgetType.icon, WidgetType.full],
            showHeaderByDefault: true,
            headerNameByDefault: 'Calendar'
        })

    ]);

    public readonly widgets: Observable<Widget[]> = this.widgetsList.asObservable();

    constructor() { }

}
