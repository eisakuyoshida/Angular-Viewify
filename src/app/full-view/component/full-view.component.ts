import { Observable } from 'rxjs';

import { DOCUMENT } from '@angular/common';
import {
    ChangeDetectorRef,
    Component, Inject, Input, OnDestroy, OnInit, TemplateRef, ViewChild
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

import { DeskViewBaseComponent } from '../../shared/base-structures/desk-view-base.component';
import { Widget } from '../../shared/base-structures/widget';
import { ChromeStorageService } from '../../shared/storage/services/chrome-storage.service';
import { FullViewHelperService } from '../full-view-helper.service';
import { FullUnit } from '../models/full-unit';
import { FullUnitStorageable } from '../models/full-unit-storageable';
import { FullVerticalLayer } from '../models/full-vertical-layer';

enum ViewType {
    'icon' = 0,
    'full' = 1,
}

@Component({
    selector: 'app-full-view',
    templateUrl: './full-view.component.html',
    styleUrls: ['./full-view.component.scss']
})
export class FullViewComponent extends DeskViewBaseComponent implements OnInit, OnDestroy {

    @Input() widgets: Widget[];
    @Input() addUnit: Observable<void>;
    @Input() viewChangeEvent: Observable<void>;
    @Input() openBookmarks: Observable<void>;
    @Input() openHistory: Observable<void>;
    @Input() currentView: string;

    @ViewChild('bookmarksModal') bookmarksModal: TemplateRef<any>;
    @ViewChild('historyModal') historyModal: TemplateRef<any>;
    @ViewChild('addWidgetModal') addWidgetModalTpl: TemplateRef<any>;
    units: FullUnit[] = [];
    @Input() colsCount = 4;
    @Input() viewIndex: number;

    matDialogRef: MatDialogRef<any, any>;
    verticalLayers: FullVerticalLayer[][] = [];
    draggingWidget: Widget;
    draggingLayer: FullVerticalLayer;
    draggingUnit: FullUnit;
    lastEnteredArea: any;
    blur = false;
    canDrag = false;
    private STORAGE_KEY = 'full-view';

    constructor(
        public dialog: MatDialog,
        private helper: FullViewHelperService,
        @Inject(DOCUMENT) public document: Document,
        private storage: ChromeStorageService,
        public detector: ChangeDetectorRef
    ) {
        super();
    }

    ngOnInit() {
        let windowWidth = window.innerWidth;
        if (windowWidth < 1120 && windowWidth > 780) this.colsCount = 3;
        else if (windowWidth < 780) this.colsCount = 2;

        this.STORAGE_KEY = `${this.STORAGE_KEY}-${this.viewIndex}`;
        this.addUnit
            .pipe(
                untilComponentDestroyed(this),
            )
            .subscribe(() => {
                this.openAddWidgetModal();
            });
        this.openBookmarks.subscribe(() => {
            if (this.currentView === ViewType[ViewType.full]) {
                this.openMenuButtonModal("bookmarks");
            }
        });
        this.openHistory.subscribe(() => {
            if (this.currentView === ViewType[ViewType.full]) {
                this.openMenuButtonModal("history");
            }
        });

        this.storage
            .get(this.STORAGE_KEY)
            .subscribe((data: FullUnitStorageable[]) => {
                if (data) {
                    /*let col = 0;
                    let row = 0;
                    data.forEach((unit: FullUnitStorageable) => {
                        if (col >= this.colsCount) {
                            col = 0;
                            row++;
                        }
                        unit.c = col++;
                        unit.v = row;
                    });*/
                    this.units = this.helper.fromStorageToModel(data, this.widgets);
                } else {
                    this.units = this.helper.fromStorageToModel([], this.widgets);
                }

                this.reorganizeUnits();
                this.initLayers();
            });
    }

    ngOnDestroy() {
        this.saveUnits();
    }

    openAddWidgetModal() {
        this.blur = true;
        this.matDialogRef = this.dialog.open(this.addWidgetModalTpl, {
            panelClass: 'app-add-widget-modal-overlay',
            data: {
                widgets: this.widgets,
                dragStart: this.onDragStart,
                dragEnd: this.onDragEnd,
            },
        });
        this.matDialogRef.afterClosed().subscribe(() => {
            this.blur = false;
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

    onDragStart(event, type: string, widget: Widget, layer?: FullVerticalLayer, unit?: FullUnit) {
        this.blur = false;
        if (!type) {
            type = event.type;
            widget = event.widget;
        }

        if (type === 'available') {
            const modals = this.document.getElementsByClassName('cdk-overlay-container');
            Array.from(modals).forEach((el: any) => {
                el.style.zIndex = -1;
                el.style.opacity = 0;
            });
        }
        this.draggingWidget = widget;
        this.draggingLayer = layer || null;
        this.draggingUnit = unit || null;
        if (layer) {
            layer.isDragging = true;
        }

        if (this.lastEnteredArea) {
            this.lastEnteredArea.layer.hasGhost = null;
        }

        setTimeout(() => {
            const el = this.document.querySelector('.drag-active') as HTMLElement;
            if (el) {
                el.style.display = 'none';
            }
        }, 20);

        if (layer) {
            this.calcLayersLayout(layer);
        }
    }

    onDragEnd(event, type: string, unit?: FullUnit, layer?: FullVerticalLayer, layers?: FullVerticalLayer[], columnIdx?: number) {
        if (!type) {
            type = event.type;
        }

        const el = this.document.querySelector('.drag-active') as HTMLElement;
        if (el) {
            el.style.display = 'block';
        }
        if (type === 'available') {
            this.matDialogRef.close();
            const modals = this.document.getElementsByClassName('cdk-overlay-container');
            setTimeout(() => {
                Array.from(modals).forEach((_el: any) => {
                    _el.style.zIndex = null;
                    _el.style.opacity = null;
                });
            }, 500);
        }

        if (this.draggingLayer) {
            this.removeUnitFromLayer(this.draggingUnit, this.draggingLayer);
        }

        this.addWidgetToLayer(this.draggingWidget, this.lastEnteredArea.layer);

        let oldEnteredLayer: FullVerticalLayer = null;
        if (this.lastEnteredArea) {
            oldEnteredLayer = this.lastEnteredArea.layer;
            oldEnteredLayer.hasGhost = null;
            oldEnteredLayer.isDragging = null;
        }
        if (layer) {
            layer.hasGhost = null;
            layer.isDragging = false;
        }
        this.draggingWidget = null;
        this.draggingLayer = null;
        this.draggingUnit = null;
        this.lastEnteredArea = null;
        this.saveUnits();
        this.canDrag = false;
    }

    onDragEnter({dropData}, layer: FullVerticalLayer, direction: string, layers: FullVerticalLayer[], columnIdx, layerIdx) {
        let oldEnteredLayer = null;
        if (this.lastEnteredArea) {
            oldEnteredLayer = this.lastEnteredArea.layer;
            oldEnteredLayer.hasGhost = null;
        }
        layer.hasGhost = direction;
        this.lastEnteredArea = {
            layer,
            direction,
            layers,
            columnIdx,
            layerIdx,
        };
        if (oldEnteredLayer && oldEnteredLayer !== layer) {
            this.calcLayersLayout(oldEnteredLayer);
        }

        this.calcLayersLayout(layer);
    }

    removeUnit(unit: FullUnit, layer: FullVerticalLayer) {
        this.removeUnitFromLayer(unit, layer);
        this.saveUnits();
    }

    onDragIconOver() {
        if (!this.draggingWidget) {
            this.canDrag = true;
        }
    }

    onDragIconOut() {
        if (!this.draggingWidget) {
            this.canDrag = false;
        }
    }

    public onUserDataChanged(fullUnit: FullUnit, userData: any): void {
        const unit = this.units.find(x => x === fullUnit);
        if (unit) {
            unit.userData = userData;
        }
        this.saveUnits();
    }

    getValidateDragFn() {
        return coords => this.validateDrag(coords);
    }

    validateDrag(coords) {
        return this.canDrag;
    }

    rebuildGrid() {
        if (window.innerWidth >= 1120) {
            if (this.colsCount != 4) {
                this.colsCount = 4;
                this.verticalLayers = [];
                this.reorganizeUnits();
                this.initLayers();
            }
        } else if (window.innerWidth < 1120 && window.innerWidth >= 780) {
            if (this.colsCount != 3) {
                this.colsCount = 3;
                this.verticalLayers = [];
                this.reorganizeUnits();
                this.initLayers();
            }
        } else if (window.innerWidth < 780) {
            if (this.colsCount != 2) {
                this.colsCount = 2;
                this.verticalLayers = [];
                this.reorganizeUnits();
                this.initLayers();
            }
        }
    }

    private reorganizeUnits() {
        let col = 0;
        let row = 0;
        this.units = this.units.reduce<FullUnit[]>((newUnits: FullUnit[], unit: FullUnit) => {
            if (col >= this.colsCount) {
                col = 0;
                row++;
            }

            unit.position.column = col++;
            unit.position.verticalLayer = row;
            newUnits.push(unit);

            return newUnits;
        }, []);
    }

    private removeUnitFromLayer(unit: FullUnit, layer: FullVerticalLayer) {
        this.helper.removeUnitFromLayer(unit, layer);
        if (layer.units.length === 0) {
            if (this.lastEnteredArea && this.lastEnteredArea.layer === layer) {
                return;
            }
            const column = this.helper.getLayerColumn(layer, this.verticalLayers);
            this.helper.removeLayerFromColumn(layer, column);
        }
    }

    private addWidgetToLayer(widget: Widget, layer: FullVerticalLayer) {
        if (layer.ghostPosition.top || layer.ghostPosition.bottom || widget.settings.cellsCount >= 2) {
            if (!layer.ghostPosition.top && !layer.ghostPosition.bottom) {
                layer.ghostPosition.top = true;
            }
            this.helper.addWidgetToNewLayer(widget, layer, this.verticalLayers);
        } else {
            this.helper.addWidgetToExistedLayer(widget, layer);
        }
    }

    private getColumnLayers(columnNumber: number, units: FullUnit[]): FullVerticalLayer[] {
        return units
            .filter(unit => unit.position.column === columnNumber)
            .sort((unit1, unit2) => {
                if (unit1.position.verticalLayer > unit2.position.verticalLayer) {
                    return -1;
                } else if (unit1.position.verticalLayer < unit2.position.verticalLayer) {
                    return 1;
                } else {
                    if (unit1.position.horizontalLayer < unit2.position.horizontalLayer) {
                        return -1;
                    } else {
                        return 1;
                    }
                }
            })
            .reduce((layers: FullVerticalLayer[], unit) => {
                if (unit.widget) {
                    let layer = layers[unit.position.verticalLayer];
                    if (layer) {
                        layer.height = Math.max(layer.units[0].widget.settings.height, unit.widget.settings.height);
                        layer.units.push(unit);
                    } else {
                        layer = <FullVerticalLayer>{
                            height: unit.widget.settings.height,
                            units: [unit],
                            minimized: unit.position.minimized,
                        };
                        layers[unit.position.verticalLayer] = layer;
                    }
                }
                return layers;
            }, []);
    }

    private saveUnits() {
        const units = this.verticalLayers.reduce((_units: FullUnit[], _layers) => {
            return _layers.reduce((__units: FullUnit[], _layer) => {
                if (_layer && !_layer.isSpacer) {
                    return [...__units, ..._layer.units];
                }
                return __units;
            }, _units);
        }, []);

        this.units = units;
        this.storage.set(this.STORAGE_KEY, this.helper.fromModelToStorage(this.units));

        this.updateColumnsIfNeeded();
        this.calcAllLayersLayout();
    }

    private initLayers() {
        for (let i = 0; i < this.colsCount; i++) {
            const realLayers = this.getColumnLayers(i, this.units);
            realLayers.push(<FullVerticalLayer> {
                height: null,
                units: [],
                hasGhost: null,
                isSpacer: true,
                minimized: false,
            });
            this.verticalLayers[i] = this.getExtraLayersForColumn(realLayers);
        }
        this.calcAllLayersLayout();
    }

    private getExtraLayersForColumn(realLayers: FullVerticalLayer[]) {
        return realLayers.reduce((column, layer) => {
            return [...column, ...this.helper.getExtraLayersForLayer(layer)];
        }, []);
    }

    private updateColumnsIfNeeded() {
        this.verticalLayers.forEach((column, colIdx) => {
            if (!this.helper.hasColumnEnoughEmptyAreas(column)) {
                const realLayers = column.reduce((layers: FullVerticalLayer[], _layer: FullVerticalLayer) => {
                    if (_layer) {
                        layers.push(_layer);
                    }
                    return layers;
                }, []);
                this.verticalLayers[colIdx] = this.getExtraLayersForColumn(realLayers);
            }
        });
    }

    private calcAllLayersLayout() {
        this.verticalLayers.forEach(column => {
            column.forEach((layer: FullVerticalLayer) => {
                this.calcLayersLayout(layer);
            });
        });
    }

    private calcLayersLayout(layer: FullVerticalLayer) {
        if (layer === null) {
            return;
        }
        layer.height = this.helper.getColumnLayerHeight(layer, this.draggingWidget);
        if (layer.height) {
            layer.flex = 'none';
        } else if (layer.units.length && layer.isDragging) {
            layer.flex = 'none';
        } else {
            layer.flex = 1;
        }

        layer.ghostPosition = this.helper.getGhostPosition(layer, this.draggingWidget);

        if (this.draggingWidget && this.draggingWidget.settings.cellsCount === 1) layer.ghostWidth = '50%';
        else layer.ghostWidth = '100%';

        layer.ghostLeftMargin = (
            layer.ghostPosition.right
            && !layer.ghostPosition.left
            && (layer.ghostPosition.top || layer.ghostPosition.bottom)
        ) ? '50%' : 0;

        layer.showTopGhost = layer.ghostPosition.top
            || (!layer.ghostPosition.top && !layer.ghostPosition.bottom && layer.ghostPosition.left);
        layer.showBottomGhost = layer.ghostPosition.bottom
            || (!layer.ghostPosition.top && !layer.ghostPosition.bottom && layer.ghostPosition.right);

        const hasSmallUnits = this.helper.isLayerWithSmallUnits(layer);
        const hasBigUnits = !hasSmallUnits;

        if (this.draggingWidget && this.draggingWidget.settings.cellsCount >= 2 && hasSmallUnits && layer.hasGhost) {
            layer.ghostPosition.left = true;
            layer.ghostPosition.right = false;
            layer.showTopGhost = true;
            layer.showBottomGhost = false;
        }

        if (layer.isSpacer) {
            layer.hasBottomDraggableArea = false;
        } else {
            layer.hasBottomDraggableArea = hasBigUnits;
        }

        if (!layer.isSpacer) {
            layer.widgetsWrapperWidth = hasBigUnits || (layer.units.length === 2 && !layer.isDragging) ? '100%' : '50%';
            layer.widgetsWrapperFlex = hasBigUnits || (layer.units.length === 2 && !layer.isDragging) ? 'unset' : 1;

            const staticUnits = this.helper.getLayerStaticUnits(layer, this.draggingUnit);

            if (this.helper.isLayerWithSmallUnits(layer) && staticUnits.length) {
                if (staticUnits.length === 2
                    || (layer.hasGhost && this.draggingWidget && this.draggingWidget.settings.cellsCount === 1)
                ) {
                    layer.widgetsWrapperLeftMargin = 0;
                    layer.widgetsWrapperRightMargin = 0;
                } else {            // staticUnits.length === 1
                    const staticUnit = staticUnits[0];
                    if (staticUnit.position.horizontalLayer === 1) {
                        layer.widgetsWrapperLeftMargin = '50%';
                        layer.widgetsWrapperRightMargin = 0;
                    } else {
                        layer.widgetsWrapperLeftMargin = 0;
                        layer.widgetsWrapperRightMargin = '50%';
                    }
                }
            } else {
                layer.widgetsWrapperLeftMargin = 0;
                layer.widgetsWrapperRightMargin = 0;
            }
        }
    }
}
