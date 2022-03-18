import { Type } from '@angular/core';
import { WidgetDefaultSettings } from './widget-default-settings';

export class Widget {
    public userData?: any;
    constructor(public key: string, public title: string, public component: Type<any>, public settings: WidgetDefaultSettings) {}
}
