import {IconUnitPosition} from './icon-unit-position';
import {Widget} from '../../shared/base-structures/widget';
import {Observable, Subject} from "rxjs/Rx";

export class IconUnit {
    public remove: Subject<void> = new Subject<void>();
    constructor(public widget: Widget, public position: IconUnitPosition, public userData: any) {
    }
}
