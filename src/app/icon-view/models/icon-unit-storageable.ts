import { WidgetDataStorageable } from '../../shared/storage/models/widget-data-storageable';

export interface IconUnitStorageable extends WidgetDataStorageable {
    key: string;
    layerIndex: number;
}
