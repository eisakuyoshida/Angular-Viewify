import {Component, ElementRef, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';

import { UserService } from './shared/user/user.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

import * as $ from "jquery";

import {ChromeStorageService} from "./shared/storage/services/chrome-storage.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('loading', [
            // ...
            state('loads', style({
                opacity: 1,
            })),
            state('loaded', style({
                opacity: 0,
            })),
            transition('loads => loaded', [
                animate('.3s')
            ]),
            transition('loaded => loads', [
                animate('.3s')
            ]),
        ]),
    ],
})
export class AppComponent implements OnInit, OnDestroy {
    public hasUserName: Promise<boolean>;
    isLoading = true;
    bgImgLoaded = false;

    constructor(
        private element: ElementRef,
        private userService: UserService,
        private store: ChromeStorageService
    ) { }

    ngOnInit(): void {

        this.allowLoadIframe();

        this.hasUserName = this.userService.hasUserName();

        this.bgImgLoaded = true;
        this.isLoading = false;
    }


    ngOnDestroy(): void {
    }

    public onUsernameChange(): void {
        this.userService.hasUserName().then(hasUserName => {
            if (hasUserName) {
                $('app-startup').fadeOut(600, () => {
                    this.hasUserName = Promise.resolve(hasUserName);
                });
            }
        });
    }

    private allowLoadIframe() {
        chrome.tabs.getCurrent(function (tab) {
            const tabId = tab.id;

            chrome.webRequest.onHeadersReceived.addListener(
                function (info) {
                    const headers = info.responseHeaders || [];

                    for (let i = headers.length - 1; i >= 0; --i) {
                        const header = headers[i].name.toLowerCase();

                        if (header === 'x-frame-options' || header === 'frame-options') {
                            headers.splice(i, 1);
                        } else if (header === 'content-security-policy') {
                            // Remove any frame-ancestors CSP directives, this is actually spec-compliant
                            headers[i].value = headers[i].value.split(';').filter(function (e) {
                                return e.trim().toLowerCase().indexOf('frame-ancestors') !== 0;
                            }).join(';');
                        }
                    }

                    return {
                        responseHeaders: headers
                    };
                },
                {
                    tabId: tabId,
                    urls: ['*://*/*'],
                    types: ['sub_frame']
                },
                ['blocking', 'responseHeaders']
            );
        });

        return false;
    }
}
