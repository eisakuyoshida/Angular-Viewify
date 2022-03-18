import {Component, OnDestroy, ViewEncapsulation} from '@angular/core';
import {CalculatorSettings} from "../model/calculator-settings";
import {CalculatorService} from "../calculator.service";
import {WidgetBaseComponent} from "../../../shared/base-structures/widget-base.component";
import {AppStorageService} from "../../../shared/storage/services/app-storage.service";

@Component({
    selector: 'app-widget-calculator',
    templateUrl: './widget-calculator.component.html',
    styleUrls: ['./widget-calculator.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class WidgetCalculatorComponent extends WidgetBaseComponent<CalculatorSettings> implements OnDestroy {
    operation: string = '';
    result: string= '';

    constructor(protected appStorage: AppStorageService,
                public calcService: CalculatorService) { super(appStorage); }

    public widgetInit(): void {
        this.startWork(this.calcService);
    }

    ngOnDestroy(): void {
        this.saveSettings();
    }


    public reload(): void {
        this.operation = '';
        this.result = '';
    }

    saveSettings() {
        this.calcService.saveSettings();
    }

    public onMinimize(value): void {
        this.calcService.settings.minimized = value;
        this.appStorage.set<CalculatorSettings>(this.storageKey, this.calcService.settings);
    }

    append(element: string){
        this.operation += element;
    }

    complexAppend(element: string) {
        this.operation += element;
    }

    undo(){
        if (this.operation != ''){
          this.operation = this.operation.slice(0, -1);
        }
    }

    clear(){
        this.operation = '';
        this.result = '';
    }

    evaluate(){
        try{
          this.result = eval(this.operation);
        } catch(err) {
          if (err)
          this.result = 'Error';
        }
    }
}
