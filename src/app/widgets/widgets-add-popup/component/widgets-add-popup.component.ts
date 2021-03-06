import { DOCUMENT } from '@angular/common';
import {
    Component, EventEmitter, Inject, Input, OnInit, Output, ViewEncapsulation
} from '@angular/core';

import { Widget } from '../../../shared/base-structures/widget';
import { WidgetDragging } from '../../../shared/base-structures/widget-dragging';

@Component({
    selector: 'app-widgets-add-popup',
    templateUrl: './widgets-add-popup.component.html',
    styleUrls: ['./widgets-add-popup.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class WidgetsAddPopupComponent implements OnInit {

    @Input() widgets: Widget[];
    @Output() dragStart: EventEmitter<WidgetDragging> = new EventEmitter();
    @Output() dragEnd: EventEmitter<WidgetDragging> = new EventEmitter();

    canDrag = false;
    isDragging = false;

    constructor(@Inject(DOCUMENT) public document: Document) {
    }

    ngOnInit() {
    }

    onDragStart($event, type, widget) {
        this.isDragging = true;
        this.dragStart.emit({$event, type, widget});
    }

    onDragEnd($event, type) {
        this.isDragging = true;
        this.dragEnd.emit({$event, type});
    }

    onDragIconOver($event) {
        if (!this.isDragging) {
            this.canDrag = true;
        }
    }

    onDragIconOut($event) {
        if (!this.isDragging) {
            this.canDrag = false;
        }
    }

    public onUserDataChanged(widget: Widget, userData: any): void {
        const wd = this.widgets.find(x => x === widget);
        if (wd) {
            wd.userData = userData;
        }
    }

    getValidateDragFn() {
        return coords => this.validateDrag(coords);
    }

    validateDrag(coords) {
        return this.canDrag;
    }

}
