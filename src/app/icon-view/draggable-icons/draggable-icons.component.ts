import { Observable, Subject, Subscription } from 'rxjs';
import { WidgetDragging } from 'src/app/shared/base-structures/widget-dragging';
import { WidgetType } from 'src/app/shared/base-structures/widget-type';

import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

import { Widget } from '../../shared/base-structures/widget';
import { ChromeStorageService } from '../../shared/storage/services/chrome-storage.service';
import { IconUnit } from '../models/icon-unit';
import { IconUnitPosition } from '../models/icon-unit-position';
import { IconUnitStorageable } from '../models/icon-unit-storageable';
import { IconVerticalLayer } from '../models/icon-vertical-layer';

@Component({
    selector: 'app-draggable-icons',
    templateUrl: './draggable-icons.component.html',
    styleUrls: ['./draggable-icons.component.scss']
})
export class DraggableIconsComponent implements OnInit, OnDestroy {
    @Input() position: 'left' | 'bottom' = 'left';
    @Input() widgets: Widget[];
    @Input() hide: Observable<any>;
    @Input() widgetAddingDragStart: Observable<WidgetDragging>;
    @Input() widgetAddingDragEnd: Observable<WidgetDragging>;

    @Output() widgetAddingCompleted = new EventEmitter<void>();

    canDrag = false;
    layers: IconVerticalLayer[] = [];
    draggingWidget: Widget;
    draggingLayer: IconVerticalLayer;
    lastEnteredArea: {
        layer: IconVerticalLayer,
        layerIdx: number,
    };
    @Input() hideOpenedWidgets: Subject<void>;

    private sub = new Subscription();
    private storageKey: string;
    private units: IconUnit[];
    private readonly canBeBottomWidgetKeys = ['w-time'];

    constructor(
        @Inject(DOCUMENT) public document: Document,
        private storage: ChromeStorageService) { }

    ngOnInit(): void {
        this.storageKey = `icon-view-${this.position}`;

        this.storage.get(this.storageKey).subscribe((data: IconUnitStorageable[]) => {
            if (data) {
                this.units = this.fromStorageToModel(data, this.widgets);
            } else {
                this.units = this.fromStorageToModel([], this.widgets);
            }
            this.initLayers();
        });

        this.sub.add(this.widgetAddingDragStart.subscribe(
            (dragData) => this.onDragStart(dragData.$event, dragData.type, dragData.widget)));
        this.sub.add(this.widgetAddingDragEnd.subscribe(
            (dragData) => this.onDragEnd(dragData.$event, dragData.type)));
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    widgetOpened() {
        return () => this.hideOpenedWidgets.next();
    }

    onDragStart($event, type: string, widget: Widget, layer?: IconVerticalLayer) {
        if (!type) {
            type = $event.type;
            widget = $event.widget;
        }
        if (!this.canAddWidget(widget.key)) {
            return;
        }
        if (type === 'available') {
            const modals = this.document.getElementsByClassName('cdk-overlay-container');
            Array.from(modals).forEach((el: any) => {
                el.style.zIndex = -1;
                el.style.opacity = 0;
            });
        }

        this.draggingWidget = widget;
        if (layer) {
            this.draggingLayer = layer;
            layer.isDragging = true;
        }
        setTimeout(() => {
            const el = this.document.querySelector('.drag-active') as HTMLElement;
            if (el) {
                el.style.display = 'none';
            }
        }, 20);
    }

    onDragEnd($event, type: string, layer?: IconVerticalLayer) {
        if (!type) {
            type = $event.type;
        }
        const el = this.document.querySelector('.drag-active') as HTMLElement;
        if (el) {
            el.style.display = 'block';
        }
        if (type === 'available') {
            this.widgetAddingCompleted.emit();
            const modals = this.document.getElementsByClassName('cdk-overlay-container');
            setTimeout(() => {
                Array.from(modals).forEach((_el: any) => {
                    _el.style.zIndex = null;
                    _el.style.opacity = null;
                });
            }, 500);
        }

        if (!this.lastEnteredArea || !this.draggingWidget) {
            this.draggingWidget = null;
            return false;
        }

        if (type === 'user') {
            const idx = this.layers.indexOf(layer);
            this.layers.splice(idx, 1);
            for (let i = idx; i < this.layers.length; i++) {
                this.layers[i].unit.position.layerIndex--;
                if (this.lastEnteredArea.layer === this.layers[i]) {
                    this.lastEnteredArea.layerIdx--;
                }
            }
        }

        const newUnit = new IconUnit(
            this.draggingWidget,
            {
                layerIndex: this.lastEnteredArea.layerIdx
            },
            this.draggingWidget.userData
        );
        const units = this.layers.reduce((_units: IconUnit[], _layer: IconVerticalLayer, layerIdx: number) => {
            if (_layer.isSpacer) {
                return _units;
            }
            if (layerIdx >= this.lastEnteredArea.layerIdx) {
                _layer.unit.position.layerIndex++;
            }
            _units.push(_layer.unit);
            return _units;
        }, [newUnit]);

        if (layer) {
            layer.isDragging = false;
        }
        this.draggingWidget = null;
        this.lastEnteredArea = null;

        this.saveUnits(units);
        this.setWidgetsOverflowScroll();
        this.canDrag = false;
    }

    onDragEnter($event, layer: IconVerticalLayer, layerIdx: number) {
        if (!this.canAddWidget($event.dropData.widget.key)) {
            return;
        }
        if (this.lastEnteredArea) {
            this.lastEnteredArea.layer.hasGhost = false;
        }
        this.lastEnteredArea = {
            layer,
            layerIdx,
        };
        layer.hasGhost = true;
    }

    removeLayer(layerIdx: number) {
        const units = this.layers.reduce((_units: IconUnit[], _layer: IconVerticalLayer, _layerIdx: number) => {
            if (_layer.isSpacer) {
                return _units;
            }
            if (_layerIdx < layerIdx) {
                _units.push(_layer.unit);
            }
            if (_layerIdx > layerIdx) {
                _layer.unit.position.layerIndex--;
                _units.push(_layer.unit);
            }
            return _units;
        }, []);

        this.saveUnits(units);
    }

    onDragIconOver($event) {
        if (!this.draggingWidget) {
            this.canDrag = true;
        }
        this.setWidgetsOverflowHidden();
    }

    onDragIconOut($event) {
        if (!this.draggingWidget) {
            this.canDrag = false;
        }
        this.setWidgetsOverflowScroll();
    }

    public onUserDataChanged(iconUnit: IconUnit, userData: any): void {
        const unit = this.units.find(x => x === iconUnit);
        if (unit) {
            unit.userData = userData;
        }
        this.saveUnits(this.units);
    }

    setWidgetsOverflowHidden() {
        (<HTMLElement>this.document.getElementsByClassName('left-widgets').item(0)).style.overflowY = 'hidden';
    }

    setWidgetsOverflowScroll() {
        // TODO do something with scroll
        // (<HTMLElement>this.document.getElementsByClassName('left-widgets').item(0)).style.overflowY = 'scroll';
        (<HTMLElement>this.document.getElementsByClassName('left-widgets').item(0)).style.overflowY = 'hidden';
    }

    getValidateDragFn() {
        return coords => this.validateDrag(coords);
    }

    validateDrag(coords) {
        return this.canDrag;
    }

    get isForBottomWidgets(): boolean {
        return this.position === 'bottom';
    }

    private canAddWidget(addingWidgetKey: string): boolean {
        return !this.isForBottomWidgets || (this.canBeBottomWidgetKeys.includes(addingWidgetKey) && this.layers.length < 2);
    }

    private saveUnits(units: IconUnit[]): void {
        this.storage
            .set(this.storageKey, this.fromModelToStorage(units))
            .subscribe(() => {
                this.units = units;
                this.initLayers();
            });
    }

    private fromStorageToModel(data: IconUnitStorageable[], widgets: Widget[]): IconUnit[] {
        return data.map(record => {
            const widget = widgets.find(w => w.key === record.key);
            const position = <IconUnitPosition>{
                layerIndex: record.layerIndex
            };
            return new IconUnit(widget, position, record.userData);
        });
    }

    private fromModelToStorage(units: IconUnit[]): IconUnitStorageable[] {
        return units.map(unit => (<IconUnitStorageable>{
            key: unit.widget.key,
            layerIndex: unit.position.layerIndex,
            userData: unit.userData
        }));
    }

    private initLayers() {
        // this._userUnitKeys = [];
        this.layers = this.units.sort((unit1, unit2) => {
            return unit1.position.layerIndex < unit2.position.layerIndex ? -1 : 1;
        }).map(unit => {
            // this._userUnitKeys.push(unit.widget.key);
            return <IconVerticalLayer>{
                unit,
            };
        });
        this.layers.push(<IconVerticalLayer>{
            unit: {
                widget: new Widget('shadow', null, null, { types: [WidgetType.icon] }),
                position: {
                    layerIndex: this.layers.length
                }
            },
            isSpacer: true,
        });
    }

    public test1() {
        console.log("test1 succed");
    }
}
