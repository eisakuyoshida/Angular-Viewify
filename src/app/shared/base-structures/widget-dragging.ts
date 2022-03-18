import { Widget } from './widget';

export interface WidgetDragging {
    $event: any;
    type: string;
    widget?: Widget;
}
