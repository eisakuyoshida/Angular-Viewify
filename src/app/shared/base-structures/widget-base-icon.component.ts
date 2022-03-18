import {Input} from '@angular/core';
import {Observable} from 'rxjs';
import {WidgetBaseComponent} from './widget-base.component';
import { WidgetSettings } from './widget-settings';

export abstract class WidgetBaseIconComponent extends WidgetBaseComponent<WidgetSettings> {
    @Input() frozen = false;
    @Input() hide: Observable<any>;
    @Input() opened: () => any;
}
