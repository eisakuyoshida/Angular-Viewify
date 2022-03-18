import { WidgetDataStorageable } from '../../shared/storage/models/widget-data-storageable';

export interface FullUnitStorageable extends WidgetDataStorageable {
    k: string;  // key
    c: number;  // column
    v: number;  // vertical layer
    h: number;  // horizontal layer
    m: boolean; // is minimized
}
