import { Observable, Subject } from 'rxjs';

import { DOCUMENT } from '@angular/common';
import {
    Component, ElementRef, Inject, Input, OnInit, TemplateRef, ViewChild
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import {
    WidgetsDynamicService
} from '../../../app/widgets/widgets-dynamic/widgets-dynamic.service';
import { DeskViewBaseComponent } from '../../shared/base-structures/desk-view-base.component';
import { Widget } from '../../shared/base-structures/widget';
import { WidgetDefaultSettings } from '../../shared/base-structures/widget-default-settings';
import { WidgetDragging } from '../../shared/base-structures/widget-dragging';

enum ViewType {
    'icon' = 0,
    'full' = 1,
}

@Component({
    selector: 'app-icon-view',
    templateUrl: './icon-view.component.html',
    styleUrls: ['./icon-view.component.scss']
})
export class IconViewComponent extends DeskViewBaseComponent implements OnInit {

    @Input() widgets: Widget[];
    @Input() addUnit: Observable<void>;
    @Input() viewChangeEvent: Observable<void>;
    @Input() openBookmarks: Observable<void>;
    @Input() openHistory: Observable<void>;
    @Input() currentView: string;

    @ViewChild('addWidgetModal') addWidgetModalTpl: TemplateRef<any>;
    @ViewChild('widgetsBar') widgetsBar: ElementRef;
    @ViewChild('bookmarksModal') bookmarksModal: TemplateRef<any>;
    @ViewChild('historyModal') historyModal: TemplateRef<any>;

    hideOpenedWidgets: Subject<void> = new Subject<void>();
    widgetAddingDragStart: Subject<WidgetDragging> = new Subject<WidgetDragging>();
    widgetAddingDragEnd: Subject<WidgetDragging> = new Subject<WidgetDragging>();

    matDialogRef: MatDialogRef<any, any>;
    availableWidgets: Widget[];

    constructor(
        public dialog: MatDialog,
        @Inject(DOCUMENT) public document: Document,
        private widgetsService: WidgetsDynamicService
    ) {
        super();
    }

    ngOnInit() {
        this.availableWidgets = this.widgets;
        this.addUnit.subscribe(() => {
            this.openAddWidgetModal();
        });
        this.viewChangeEvent.subscribe(event => {
            this.hideOpenedWidgets.next();
        });
        this.openBookmarks.subscribe(() => {
            if (this.currentView === ViewType[ViewType.icon]) {
                this.openMenuButtonModal("bookmarks");
            }
        });
        this.openHistory.subscribe(() => {
            if (this.currentView === ViewType[ViewType.icon]) {
                this.openMenuButtonModal("history");
            }
        });

        this.widgetsService.widgets.subscribe(widgets => {

        });
    }

    widgetOpened() {
        return () => this.hideOpenedWidgets.next();
    }

    openAddWidgetModal() {
        this.matDialogRef = this.dialog.open(this.addWidgetModalTpl, {
            panelClass: 'app-add-widget-modal-overlay',
            data: {
                widgets: this.widgets
            },
        });
    }

    openMenuButtonModal(buttonName: string) {
        if (buttonName === "bookmarks") {
            this.matDialogRef = this.dialog.open(this.bookmarksModal, {
                panelClass: 'menu-element_overlay'
            });
        } else if (buttonName === "history") {
            this.matDialogRef = this.dialog.open(this.historyModal, {
                panelClass: 'menu-element_overlay'
            });
        }
    }

    onDragStart($event, type: string, widget: Widget) {
        this.widgetAddingDragStart.next({ $event, type, widget });
    }

    onDragEnd($event, type: string) {
        this.widgetAddingDragEnd.next({ $event, type });
    }

    closeDialog(): void {
        if (this.matDialogRef) {
            this.matDialogRef.close();
        }
    }
}
