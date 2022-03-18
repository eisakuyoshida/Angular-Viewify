import {WidgetDefaultSettings} from '../../shared/base-structures/widget-default-settings';

export interface WidgetIframeSettings extends WidgetDefaultSettings {
    url: string;
    fontIcon: string;
    fontSet: string;
}
