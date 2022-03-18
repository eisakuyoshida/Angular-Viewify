import { WidgetIconSettings } from './widget-icon-settings';
import { WidgetType } from './widget-type';

export class WidgetDefaultSettings {
    types: WidgetType[];
    cellsCount?: number;
    height?: number;        // px
    headerNameByDefault?: string;
    showHeaderByDefault?: boolean;
    widgetIconSettings?: WidgetIconSettings = {
        dialogMarginTop: 70,
        dialogMarginLeft: 70
    };
}
