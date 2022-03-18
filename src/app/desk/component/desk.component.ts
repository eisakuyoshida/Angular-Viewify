import {Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {Subject} from 'rxjs';
import {Widget} from '../../shared/base-structures/widget';
import {WidgetType} from '../../shared/base-structures/widget-type';
import {ChromeStorageService} from '../../shared/storage/services/chrome-storage.service';
import {WidgetsDynamicService} from '../../widgets/widgets-dynamic/widgets-dynamic.service';
import {MatDialog, MatDialogRef} from "@angular/material";
import {FullUnitStorageable} from "../../full-view/models/full-unit-storageable";
import {IconUnitStorageable} from "../../icon-view/models/icon-unit-storageable";

enum ViewType {
    'icon' = 0,
    'full' = 1,
}

@Component({
    selector: 'app-desk',
    templateUrl: './desk.component.html',
    styleUrls: ['./desk.component.scss']
})
export class DeskComponent implements OnInit {

    allWidgets: Widget[];
    fullWidgets: Widget[];
    iconWidgets: Widget[];
    currentView: string;
    defaultView: string;
    currentViewIndex: number;
    defaultViewIndex: number;
    addFullUnit: Subject<void> = new Subject();
    addIconUnit: Subject<void> = new Subject();
    viewChange: Subject<any> = new Subject<number>();

    openBookmarksModal: Subject<void> = new Subject();
    openHistoryModal: Subject<void> = new Subject();

    searchMenus = [
        {id: 'search', name: 'Search', icon: 'fa-search'},
        {id: 'shop', name: 'Shop', icon: 'fa-shopping-cart'},
        {id: 'travel', name: 'Travel', icon: 'fa-suitcase'},
        {id: 'eat', name: 'Eat', icon: 'fa-utensils'},
        {id: 'knowledge', name: 'Knowledge', icon: 'fa-school'}
    ];
    selectedMenu: boolean;
    @ViewChild("imgChanger") imgChangerTemplate: TemplateRef<any>;

    firstLoad: boolean = true;
    showPageMenu: boolean = false;
    fullViewsArr: number[];
    readonly MAX_FULL_VIEW_COUNT = 4;

    private imgDialogRef: MatDialogRef<any, any>;

    get viewTypeIndex() {
        return ViewType[this.currentView];
    }

    private defaults: {
        currentView: ViewType,
        defaultView: ViewType,
    } = {
        currentView: ViewType.icon,
        defaultView: ViewType.icon,
    };

    private readonly STORAGE_KEY = 'desk';

    constructor(
        private widgetsService: WidgetsDynamicService,
        private storage: ChromeStorageService,
        private dialog: MatDialog
    ) {
    }

    ngOnInit() {
        //this.cleanStorage();

        /*this.storage.get("firstLoad").subscribe((result: string) => {
            if (!result) {
                this.loadDefaultWidgets();
            }
        });*/

        this.fullViewsArr = Array(this.MAX_FULL_VIEW_COUNT).fill(0).map((x, i) => i);
        this.widgetsService.widgets.subscribe(widgets => {
            //get current view
            this.storage.get(this.STORAGE_KEY).subscribe((data: { v: number, i: number }) => {
                this.allWidgets = widgets;
                this.fullWidgets = widgets.filter(widget => widget.settings.types.includes(WidgetType.full));
                this.iconWidgets = widgets.filter(widget => widget.settings.types.includes(WidgetType.icon));
                if (data) {
                    this.currentView = ViewType[data.v];
                    this.defaultView = ViewType[data.v];
                    this.currentViewIndex = data.i ? data.i : 0;
                    this.defaultViewIndex = this.currentViewIndex;
                } else {
                    this.currentView = ViewType[this.defaults.currentView];
                    this.defaultView = ViewType[this.defaults.defaultView];
                    this.defaultViewIndex = 0;
                    this.currentViewIndex = 0;
                }
                setTimeout(() => {
                    this.firstLoad = false;
                    this.storage.set("firstLoad", "loaded");
                }, 100);
                this.viewChange.next(ViewType[this.currentView]);
            });
        });
    }

    onAddUnit($event) {
        if (this.currentView === ViewType[ViewType.full]) {
            this.addFullUnit.next($event);
        } else {
            this.viewChange.next(ViewType.icon);  // close opened widgets
            this.addIconUnit.next($event);
        }
    }

    searchBarOpen($event) {
        this.viewChange.next(ViewType[this.currentView]);  // close opened widgets
    }

    onOpenBookmarks() {
        this.openBookmarksModal.next();
    }

    onOpenHistory() {
        this.openHistoryModal.next();
    }

    goLeft() {
        if (this.currentViewIndex === 0) {
            this.goIconView();
        } else {
            this.currentViewIndex--;
        }
    }

    goRight() {
        this.currentViewIndex++;
    }

    goFullView() {
        this.currentViewIndex = 0;
        this.viewChange.next(ViewType.full);
        this.currentView = ViewType[ViewType.full];
    }

    goIconView() {
        this.viewChange.next(ViewType.icon);
        this.currentView = ViewType[ViewType.icon];
    }

    setDefaultViewType() {
        this.defaultView = this.currentView;
        this.defaultViewIndex = this.currentViewIndex;
        const data = {
            v: ViewType[this.defaultView],
            i: this.currentViewIndex,
        };
        this.storage.set(this.STORAGE_KEY, data);
    }

    selectMenu(menu) {
        this.selectedMenu = menu;
    }

    openImgList(event) {
        event.stopPropagation();

        this.imgDialogRef = this.dialog.open(this.imgChangerTemplate, {
            panelClass: "img-list-modal-overlay",
            data: {}
        });
    }

    openPageMenu() {

    }

    private loadDefaultWidgets() {
        let iconPageKey = "icon-view-left";
        let page1Key = "full-view-0";
        let page2Key = "full-view-1";
        let page3Key = "full-view-2";
        let page4Key = "full-view-3";

        let iconPageWidgets: IconUnitStorageable[] = [
            {key: "w-weather", layerIndex: 0},
            {key: "w-news", layerIndex: 1},
            {key: "w-g-mail", layerIndex: 2},
            {key: "w-whatsapp", layerIndex: 3}
        ]
        let page1Widgets: FullUnitStorageable[] = [
            {k: "w-g-mail", c: 0, v: 0, h: 0, m: true},
            {k: "w-news", c: 1, v: 0, h: 0, m: true},
            {k: "w-stock", c: 2, v: 0, h: 0, m: false},
            {k: "w-scores", c: 3, v: 0, h: 0, m: false},
            {k: "w-whatsapp", c: 0, v: 1, h: 0, m: true},
            {k: "w-todo", c: 1, v: 1, h: 0, m: false},
            {k: "w-weather", c: 2, v: 2, h: 0, m: false},
            {k: "w-time", c: 3, v: 2, h: 0, m: false}
        ];
        let page2Widgets: FullUnitStorageable[] = [
            {k: "w-calculator", c: 0, v: 0, h: 0, m: false},
            {k: "w-currency", c: 1, v: 0, h: 0, m: false},
            {k: "w-translate", c: 2, v: 0, h: 0, m: false}
        ];
        let page3Widgets: FullUnitStorageable[] = [
            {k: "w-events", c: 0, v: 0, h: 0, m: false},
            {k: "w-movies", c: 1, v: 0, h: 0, m: false},
            {k: "w-youtube", c: 2, v: 0, h: 0, m: false},
            {k: "w-youtube-music", c: 3, v: 0, h: 0, m: false}
        ];
        let page4Widgets: FullUnitStorageable[] = [
            {k: "w-facebook", c: 0, v: 0, h: 0, m: false},
            {k: "w-twitter", c: 1, v: 0, h: 0, m: false},
            {k: "w-instagram", c: 2, v: 0, h: 0, m: false},
            {k: "w-reddit", c: 3, v: 0, h: 0, m: false}
        ];

        this.storage.set(iconPageKey, iconPageWidgets);
        this.storage.set(page1Key, page1Widgets);
        this.storage.set(page2Key, page2Widgets);
        this.storage.set(page3Key, page3Widgets);
        this.storage.set(page4Key, page4Widgets);
    }

    /**
     * clear storage if it needs for app to work properly, just change currentVersion variable number
     */
    private cleanStorage() {
        let currentVersion = "7";
        let version = localStorage.getItem("app-version");
        if (currentVersion != version) {
            chrome.storage.local.clear(() => console.log("local storage is clean"));
            chrome.storage.sync.clear(() => console.log("sync storage is clean"));
            localStorage.setItem("app-version", currentVersion);
        }
    }
}
