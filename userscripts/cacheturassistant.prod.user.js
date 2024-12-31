// ==UserScript==
// @name cachetur-assistant-2
// @version 0.1.0
// @namespace https://cachetur.no/
// @description Companion script for cachetur.no
// @author Makro
// @homepage https://github.com/MakroCZ/cachetur-assistant-2
// @icon https://cachetur.net/img/logo_top.png
// @license https://opensource.org/licenses/MIT
// @match https://www.geocaching.com/live/play/map*
// @match https://www.geocaching.com/map/*
// @match https://www.geocaching.com/geocache/*
// @match https://www.geocaching.com/seek/cache_details.aspx*
// @match https://www.geocaching.com/plan/lists/BM*
// @match https://www.geocaching.com/play/geotours/*
// @match file:///*/gsak/html/*
// @match file:///*/html/*
// @match https://project-gc.com/*
// @match https://cachetur.no/bobilplasser
// @require https://raw.githubusercontent.com/cghove/GM_config/master/gm_config.js
// @require https://cdn.jsdelivr.net/npm/@trim21/gm-fetch@0.1.15
// @require https://cdn.jsdelivr.net/npm/i18next@23.10.1/dist/umd/i18next.js
// @require https://cdn.jsdelivr.net/npm/i18next-browser-languagedetector@7.2.0/dist/umd/i18nextBrowserLanguageDetector.js
// @require https://cdn.jsdelivr.net/npm/i18next-http-backend@2.5.0/i18nextHttpBackend.js
// @connect cachetur.no
// @connect cachetur.net
// @connect self
// @grant GM_xmlhttpRequest
// @grant GM_info
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_openInTab
// @grant GM_registerMenuCommand
// @grant GM_addStyle
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 620:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ctApiCall = void 0;
const Settings_1 = __webpack_require__(307);
function ctApiCall(call, params) {
    const appId = `Cacheturassistenten ${GM_info.script.version} - ${Settings_1.Settings.Instance().getPageHandler().getCTID()}`;
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://cachetur.no/api/" + call,
            data: `appid=${encodeURIComponent(appId)}&json=${encodeURIComponent(JSON.stringify(params))}`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            onload: function (data) {
                try {
                    const response = JSON.parse(data.responseText);
                    if (response.error === "UNAUTHORIZED") {
                        ctInvalidateLogin();
                        reject(new Error("User unathorized"));
                    }
                    return resolve(response.data);
                }
                catch (e) {
                    console.warn(`Failed to verify response from cachetur.no: ${e}`);
                    return reject(e);
                }
            },
            onerror: function (error) {
                return reject(error);
            },
            ontimeout: function () {
                reject(new Error("Timeout"));
            },
        });
    });
}
exports.ctApiCall = ctApiCall;
function ctInvalidateLogin() {
    Settings_1.Settings.Instance().setUsername("");
    Settings_1.Settings.Instance().getPageHandler().cleanUserStuff();
    Settings_1.Settings.Instance().getPageHandler().ctInitNotLoggedIn();
}


/***/ }),

/***/ 509:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CT_PageHandlerBase = void 0;
const PageHandlerBase_1 = __webpack_require__(795);
class CT_PageHandlerBase extends PageHandlerBase_1.PageHandlerBase {
}
exports.CT_PageHandlerBase = CT_PageHandlerBase;


/***/ }),

/***/ 739:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CT_RVSites_PageHandler = void 0;
const CT_PageHandlerBase_1 = __webpack_require__(509);
class CT_RVSites_PageHandler extends CT_PageHandlerBase_1.CT_PageHandlerBase {
    constructor() {
        super();
        this.ctID = "bobil";
    }
    getHeaderSelector() {
        return ".navbar-right";
    }
}
exports.CT_RVSites_PageHandler = CT_RVSites_PageHandler;


/***/ }),

/***/ 540:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CT_Trip_PageHandler = void 0;
const CT_PageHandlerBase_1 = __webpack_require__(509);
class CT_Trip_PageHandler extends CT_PageHandlerBase_1.CT_PageHandlerBase {
    constructor() {
        super();
        this.ctID = "fellestur";
    }
}
exports.CT_Trip_PageHandler = CT_Trip_PageHandler;


/***/ }),

/***/ 775:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GSAK_PageHandler = void 0;
const PageHandlerBase_1 = __webpack_require__(795);
class GSAK_PageHandler extends PageHandlerBase_1.PageHandlerBase {
    constructor() {
        super();
        this.ctID = "gsak";
    }
    getHeaderSelector() {
        return ".leaflet-control-scale";
    }
}
exports.GSAK_PageHandler = GSAK_PageHandler;


/***/ }),

/***/ 255:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GC_BookmarkList_PageHandler = void 0;
const GC_PageHandlerBase_1 = __webpack_require__(817);
class GC_BookmarkList_PageHandler extends GC_PageHandlerBase_1.GC_PageHandlerBase {
    constructor() {
        super();
        this.ctID = "gc_bmlist";
    }
}
exports.GC_BookmarkList_PageHandler = GC_BookmarkList_PageHandler;


/***/ }),

/***/ 547:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GC_BrowseMap_PageHandler = void 0;
const GC_PageHandlerBase_1 = __webpack_require__(817);
const i18next_1 = __importDefault(__webpack_require__(198));
const utils_1 = __webpack_require__(185);
class GC_BrowseMap_PageHandler extends GC_PageHandlerBase_1.GC_PageHandlerBase {
    constructor() {
        super();
        this.onInfoPaneMutated = (mutations) => {
            this.mutationsProcessRemove(mutations);
            this.mutationsProcessAdd(mutations);
        };
        this.ctID = "gc_map";
        this.isPageWithoutMap = false;
    }
    async initSpecific() {
        const infoPaneElem = await (0, utils_1.waitForElement)("#map_canvas > div.leaflet-map-pane > div.leaflet-objects-pane > div.leaflet-popup-pane");
        if (infoPaneElem === null) {
            throw new Error("Map not yet initialized properly to get popup pane");
        }
        const infoMutationObserver = new MutationObserver(this.onInfoPaneMutated);
        infoMutationObserver.observe(infoPaneElem, {
            childList: true,
            subtree: true,
        });
    }
    mutationsProcessRemove(mutations) {
        let removedData = null;
        for (let i = mutations.length - 1; i >= 0; i--) {
            for (const removed of mutations[i].removedNodes) {
                if (!(removed instanceof HTMLElement)) {
                    continue;
                }
                removedData = removed.querySelector("#box");
                if (removedData != null) {
                    for (const removedCache of removedData.children) {
                        this.removeCacheInfo(removedCache);
                    }
                    return;
                }
            }
        }
    }
    mutationsProcessAdd(mutations) {
        let addedData = null;
        for (let i = mutations.length - 1; i >= 0; i--) {
            for (const added of mutations[i].addedNodes) {
                if (!(added instanceof HTMLElement)) {
                    continue;
                }
                addedData = added.querySelector("#box");
                if (addedData != null) {
                    for (const loadedCache of addedData.children) {
                        this.addCacheInfo(loadedCache);
                    }
                    return;
                }
            }
        }
    }
    addCacheInfo(parentElement) {
        const gcCodeElem = parentElement.querySelector(".code");
        if (gcCodeElem === null) {
            throw new Error("Missing GC code section");
        }
        const gcCode = gcCodeElem.innerHTML;
        const twoColumnDiv = document.createElement("div");
        twoColumnDiv.classList.add("cachetur-row");
        parentElement.appendChild(twoColumnDiv);
        const controlContainer = document.createElement("ul");
        controlContainer.id = `cachetur-controls-container-${gcCode}`;
        controlContainer.classList.add("cachetur-two-column");
        controlContainer.classList.add("ul-no-bullets");
        this.controlContainers.set(gcCode, controlContainer);
        twoColumnDiv.appendChild(controlContainer);
        const foundByContainer = document.createElement("ul");
        foundByContainer.id = `cachetur-found-by-container-${gcCode}`;
        foundByContainer.classList.add("cachetur-two-column");
        foundByContainer.classList.add("ul-no-bullets");
        this.foundByContainers.set(gcCode, foundByContainer);
        twoColumnDiv.appendChild(foundByContainer);
        this.gcCodesOnPage.push(gcCode);
        this.refreshCache(gcCode);
    }
    removeCacheInfo(parentElement) {
        const gcCodeElem = parentElement.querySelector(".code");
        if (gcCodeElem === null) {
            throw new Error("Missing GC code section");
        }
        const gcCode = gcCodeElem.innerHTML;
        this.gcCodesOnPage.splice(this.gcCodesOnPage.indexOf(gcCode), 1);
        this.controlContainers.delete(gcCode);
        this.foundByContainers.delete(gcCode);
    }
    initInList(gcCode) {
        console.log("Injecting cachetur menu to geocache page in list");
        const controlContainer = this.controlContainers.get(gcCode);
        if (controlContainer === undefined) {
            throw new Error("Missing control container for " + gcCode);
        }
        controlContainer.replaceChildren();
        for (let i = 1; i <= 3; i++) {
            const control = (0, utils_1.HTMLStringToElement)(`
                <li>
                    <a class="cachetur-set-pri-${i}" style="cursor:pointer"
                        data-code="${gcCode}" data-priority="${i}">
                            ${i18next_1.default.t("priority.set" + i)}
                    </a>
                </li>`);
            controlContainer.appendChild(control);
        }
        const toAdd = (0, utils_1.HTMLStringToElement)(`
            <li>
                <a class="cachetur-add-comment" data-code="${gcCode}">
                    ${i18next_1.default.t("comments.add")}
                </a>
            </li>`);
        controlContainer.append(toAdd);
    }
    initNotInList(gcCode) {
        console.log("Injecting cachetur menu to geocache page not in list");
        const stringElem = `
            <li>
                <a class="cachetur-add-code"
                    style="cursor: pointer;"
                    data-code="${gcCode}">
                        ${i18next_1.default.t("send")}
                </a>
            </li>`;
        const elemToAdd = (0, utils_1.HTMLStringToElement)(stringElem);
        const controlContainer = this.controlContainers.get(gcCode);
        if (controlContainer === undefined) {
            throw new Error("Missing control container for " + gcCode);
        }
        controlContainer.replaceChildren(elemToAdd);
    }
    initFoundBy(gcCode, foundBy) {
        const dataElement = (0, utils_1.HTMLStringToElement)(`
                <li>
                    <b>
                        <img src="https://cachetur.no/api/img/attfind.png" />
                        ${i18next_1.default.t("foundby")}
                    </b>
                </li>
                <li>
                    ${foundBy}
                </li>`);
        const foundByContainer = this.foundByContainers.get(gcCode);
        if (foundByContainer === undefined) {
            throw new Error("Missing control container for " + gcCode);
        }
        foundByContainer.replaceChildren(dataElement);
    }
}
exports.GC_BrowseMap_PageHandler = GC_BrowseMap_PageHandler;


/***/ }),

/***/ 297:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GC_Cache_PageHandler = void 0;
const utils_1 = __webpack_require__(185);
const GC_PageHandlerBase_1 = __webpack_require__(817);
const i18next_1 = __importDefault(__webpack_require__(198));
class GC_Cache_PageHandler extends GC_PageHandlerBase_1.GC_PageHandlerBase {
    constructor() {
        super();
        this.ctID = "gc_geocache";
        const gcCodeElem = document.getElementById("ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode");
        if (gcCodeElem === null) {
            throw new Error("Trying to read GC code on cache page before load");
        }
        this.gcCodesOnPage.push(gcCodeElem.innerHTML);
    }
    async initSpecific() {
        const elem = document.querySelector(".CacheDetailNavigation");
        if (elem === null) {
            throw new Error("Cache detail not found");
        }
        const gcCode = this.gcCodesOnPage[0];
        const controlContainer = document.createElement("ul");
        controlContainer.id = `cachetur-controls-container-${gcCode}`;
        this.controlContainers.set(gcCode, controlContainer);
        elem.appendChild(controlContainer);
        const foundByContainer = document.createElement("ul");
        foundByContainer.id = `cachetur-found-by-container-${gcCode}`;
        this.foundByContainers.set(gcCode, foundByContainer);
        elem.appendChild(foundByContainer);
        const sidebarElem = document.querySelector("#divContentMain > div.span-6.prepend-1.last.sidebar");
        if (sidebarElem === null) {
            throw new Error("Cache sidebar not found");
        }
        const publicListsContainer = document.createElement("div");
        publicListsContainer.id = `cachetur-public-lists-container-${gcCode}`;
        publicListsContainer.classList.add("cachetur-public-lists");
        publicListsContainer.classList.add("CacheDetailNavigationWidget");
        this.publicListsContainers.set(gcCode, publicListsContainer);
        sidebarElem.append(publicListsContainer);
    }
    initInList(gcCode) {
        console.log("Injecting cachetur menu to geocache page in list");
        const controlContainer = this.controlContainers.get(gcCode);
        if (controlContainer === undefined) {
            throw new Error("Missing control container for " + gcCode);
        }
        controlContainer.replaceChildren();
        for (let i = 1; i <= 3; i++) {
            const control = (0, utils_1.HTMLStringToElement)(`
                <li>
                    <a class="cachetur-set-pri-${i}" style="cursor:pointer"
                        data-code="${gcCode}" data-priority="${i}">
                            ${i18next_1.default.t("priority.set" + i)}
                    </a>
                </li>`);
            controlContainer.appendChild(control);
        }
        const toAdd = (0, utils_1.HTMLStringToElement)(`
            <li>
                <a class="cachetur-add-comment" data-code="${gcCode}">
                    ${i18next_1.default.t("comments.add")}
                </a>
            </li>`);
        controlContainer.append(toAdd);
    }
    initNotInList(gcCode) {
        console.log("Injecting cachetur menu to geocache page not in list");
        const stringElem = `
            <li>
                <a class="cachetur-add-code"
                    style="cursor: pointer;"
                    data-code="${gcCode}">
                        ${i18next_1.default.t("send")}
                </a>
            </li>`;
        const elemToAdd = (0, utils_1.HTMLStringToElement)(stringElem);
        const controlContainer = this.controlContainers.get(gcCode);
        if (controlContainer === undefined) {
            throw new Error("Missing control container for " + gcCode);
        }
        controlContainer.replaceChildren(elemToAdd);
    }
    initFoundBy(gcCode, foundBy) {
        const dataElement = (0, utils_1.HTMLStringToElement)(`
                <li>
                    <b>
                        <img src="https://cachetur.no/api/img/attfind.png" />
                        ${i18next_1.default.t("foundby")}
                    </b>
                </li>
                <li>
                    ${foundBy}
                </li>`);
        const foundByContainer = this.foundByContainers.get(gcCode);
        if (foundByContainer === undefined) {
            throw new Error("Missing control container for " + gcCode);
        }
        foundByContainer.replaceChildren(dataElement);
    }
    initPublicLists(gcCode, lists) {
        console.log("Injecting list of lists");
        let alternate = false;
        let listHtml = `<h3 class="WidgetHeader">
                            <img src="https://cachetur.no/api/img/cachetur-15.png" /> Cachetur.no
                        </h3>
                            <div class="WidgetBody">
                                <ul class="BookmarkList ul-no-bullets">`;
        for (const list of lists) {
            let link;
            switch (list.source) {
                case "triptemplate":
                    link = `<a href="https://cachetur.no/tur/${list.id}">${list.name}</a>`;
                    break;
                case "trip":
                    link = `<a href="https://cachetur.no/fellestur/${list.id}">${list.name}</a>`;
                    break;
                default:
                    link = `<a href="https://cachetur.no/liste/${list.id}">${list.name}</a>`;
                    break;
            }
            let classList = "";
            if (alternate === true) {
                classList += "AlternatingRow";
            }
            let listElement = `<li class="${classList}">${link}<br>${i18next_1.default.t('template.by')} ${list.owner}</li>`;
            alternate = !alternate;
            listHtml += listElement;
        }
        listHtml += `</ul></div>`;
        const publicListContainer = this.publicListsContainers.get(gcCode);
        if (publicListContainer === undefined) {
            throw new Error("Public list container not found");
        }
        const publicListElem = (0, utils_1.HTMLStringToElement)(listHtml);
        publicListContainer.replaceChildren(publicListElem);
    }
}
exports.GC_Cache_PageHandler = GC_Cache_PageHandler;


/***/ }),

/***/ 312:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GC_Geotour_PageHandler = void 0;
const GC_PageHandlerBase_1 = __webpack_require__(817);
class GC_Geotour_PageHandler extends GC_PageHandlerBase_1.GC_PageHandlerBase {
    constructor() {
        super();
        this.ctID = "gc_geotour";
    }
}
exports.GC_Geotour_PageHandler = GC_Geotour_PageHandler;


/***/ }),

/***/ 817:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GC_PageHandlerBase = void 0;
const PageHandlerBase_1 = __webpack_require__(795);
class GC_PageHandlerBase extends PageHandlerBase_1.PageHandlerBase {
    getHeaderSelector() {
        return ".user-menu";
    }
}
exports.GC_PageHandlerBase = GC_PageHandlerBase;


/***/ }),

/***/ 89:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GC_SearchMap_PageHandler = void 0;
const GC_PageHandlerBase_1 = __webpack_require__(817);
const i18next_1 = __importDefault(__webpack_require__(198));
const utils_1 = __webpack_require__(185);
class GC_SearchMap_PageHandler extends GC_PageHandlerBase_1.GC_PageHandlerBase {
    constructor() {
        super();
        this.onInfoPaneMutated = (mutations) => {
            if (mutations.length > 1) {
                this.mutationsProcessRemoveDetail(mutations);
                this.mutationsProcessAddDetail(mutations);
            }
        };
        this.ctID = "gc_map_new";
        this.isPageWithoutMap = false;
    }
    async initSpecific() {
        const sidebar = await (0, utils_1.waitForElement)("#sidebar");
        if (sidebar === null) {
            throw new Error("Map not yet initialized properly to get popup pane");
        }
        const infoMutationObserver = new MutationObserver(this.onInfoPaneMutated);
        infoMutationObserver.observe(sidebar, {
            childList: true,
            subtree: true,
        });
    }
    mutationsProcessRemoveOverview(mutations) {
        let removedData = null;
        for (let i = mutations.length - 1; i >= 0; i--) {
            for (const removed of mutations[i].removedNodes) {
                if (!(removed instanceof HTMLElement)) {
                    continue;
                }
                removedData = removed.querySelectorAll("div.geocache-item-details");
                if (removedData != null) {
                    for (const removedCache of removedData) {
                        this.removeCacheInfoDetail(removedCache);
                    }
                    return;
                }
            }
        }
    }
    mutationsProcessAddOverview(mutations) {
        let addedData = null;
        for (let i = mutations.length - 1; i >= 0; i--) {
            for (const added of mutations[i].addedNodes) {
                if (!(added instanceof HTMLElement)) {
                    continue;
                }
                addedData = added.querySelector("div.geocache-item-details");
                if (addedData != null) {
                    this.addCacheInfoOverview(addedData);
                    return;
                }
            }
        }
    }
    mutationsProcessRemoveDetail(mutations) {
        let removedData = null;
        for (let i = mutations.length - 1; i >= 0; i--) {
            const mutation = mutations[i];
            for (const removed of mutation.removedNodes) {
                if (!(removed instanceof HTMLElement)) {
                    continue;
                }
                removedData = (removed.matches("div.cache-detail-preview") && removed) || removed.querySelector("div.cache-detail-preview");
                if (removedData != null) {
                    this.removeCacheInfoDetail(removedData);
                    return;
                }
            }
            if (!(mutation.target instanceof HTMLElement)) {
                continue;
            }
            if (mutation.target.matches("div.cache-detail-preview")) {
                this.removeCacheInfoDetail(mutation.target);
                return;
            }
        }
    }
    mutationsProcessAddDetail(mutations) {
        let addedData = null;
        for (let i = mutations.length - 1; i >= 0; i--) {
            const mutation = mutations[i];
            for (const added of mutation.addedNodes) {
                if (!(added instanceof HTMLElement)) {
                    continue;
                }
                addedData = (added.matches("div.cache-detail-preview") && added) || added.querySelector("div.cache-detail-preview");
                if (addedData != null) {
                    if (addedData.querySelector(".preview-loading-spinner")) {
                        continue;
                    }
                    this.addCacheInfoDetail(addedData);
                    return;
                }
            }
            if (!(mutation.target instanceof HTMLElement)) {
                continue;
            }
            if (mutation.target.matches("div.cache-detail-preview")) {
                this.addCacheInfoDetail(mutation.target);
                return;
            }
        }
    }
    addCacheInfoDetail(parentElement) {
        const gcCodeElem = parentElement.querySelector(".cache-metadata-code");
        if (gcCodeElem === null) {
            throw new Error("Missing GC code section");
        }
        const gcCode = gcCodeElem.innerHTML;
        const containerElem = parentElement.querySelector(".preview-main-inner");
        if (containerElem === null) {
            throw new Error("Container not found");
        }
        const cacheturContainer = document.createElement("div");
        cacheturContainer.classList.add("ctRootComponent");
        const twoColumnDiv = document.createElement("div");
        twoColumnDiv.classList.add("cachetur-row");
        twoColumnDiv.classList.add("cachetur-padding");
        const controlContainer = document.createElement("ul");
        controlContainer.id = `cachetur-controls-container-${gcCode}`;
        controlContainer.classList.add("cachetur-two-column");
        controlContainer.classList.add("ul-no-bullets");
        this.controlContainers.set(gcCode, controlContainer);
        twoColumnDiv.appendChild(controlContainer);
        const foundByContainer = document.createElement("ul");
        foundByContainer.id = `cachetur-found-by-container-${gcCode}`;
        foundByContainer.classList.add("cachetur-two-column");
        foundByContainer.classList.add("ul-no-bullets");
        this.foundByContainers.set(gcCode, foundByContainer);
        twoColumnDiv.appendChild(foundByContainer);
        const publicListsContainerHeaderString = `
            <h3 class="WidgetHeader">
                <img src="https://cachetur.no/api/img/cachetur-15.png" /> Cachetur.no
            </h3>`;
        const publicListsContainer = document.createElement("div");
        publicListsContainer.id = `cachetur-public-lists-container-${gcCode}`;
        publicListsContainer.classList.add("cachetur-public-lists");
        publicListsContainer.classList.add("cachetur-padding");
        this.publicListsContainers.set(gcCode, publicListsContainer);
        publicListsContainer.appendChild((0, utils_1.HTMLStringToElement)(publicListsContainerHeaderString));
        cacheturContainer.appendChild(publicListsContainer);
        cacheturContainer.appendChild(twoColumnDiv);
        containerElem.insertBefore(cacheturContainer, containerElem.childNodes[2]);
        this.gcCodesOnPage.push(gcCode);
        this.refreshCache(gcCode);
    }
    addCacheInfoOverview(parentElement) {
        const gcCodeElem = parentElement.querySelector(".geocache-item-code");
        if (gcCodeElem === null) {
            throw new Error("Missing GC code section");
        }
        const gcCode = gcCodeElem.innerHTML;
        const twoColumnDiv = document.createElement("div");
        twoColumnDiv.classList.add("cachetur-row");
        parentElement.appendChild(twoColumnDiv);
        const controlContainer = document.createElement("ul");
        controlContainer.id = `cachetur-controls-container-${gcCode}`;
        controlContainer.classList.add("cachetur-two-column");
        controlContainer.classList.add("ul-no-bullets");
        this.controlContainers.set(gcCode, controlContainer);
        twoColumnDiv.appendChild(controlContainer);
        const foundByContainer = document.createElement("ul");
        foundByContainer.id = `cachetur-found-by-container-${gcCode}`;
        foundByContainer.classList.add("cachetur-two-column");
        foundByContainer.classList.add("ul-no-bullets");
        this.foundByContainers.set(gcCode, foundByContainer);
        twoColumnDiv.appendChild(foundByContainer);
        this.gcCodesOnPage.push(gcCode);
        this.refreshCache(gcCode);
    }
    removeCacheInfoDetail(parentElement) {
        const gcCodeElem = parentElement.querySelector(".cache-metadata-code");
        if (gcCodeElem === null) {
            throw new Error("Missing GC code section");
        }
        const gcCode = gcCodeElem.innerHTML;
        this.gcCodesOnPage.splice(this.gcCodesOnPage.indexOf(gcCode), 1);
        this.controlContainers.delete(gcCode);
        this.foundByContainers.delete(gcCode);
    }
    initInList(gcCode) {
        console.log("Injecting cachetur menu to geocache page in list");
        const controlContainer = this.controlContainers.get(gcCode);
        if (controlContainer === undefined) {
            throw new Error("Missing control container for " + gcCode);
        }
        controlContainer.replaceChildren();
        for (let i = 1; i <= 3; i++) {
            const control = (0, utils_1.HTMLStringToElement)(`
                <li>
                    <a class="cachetur-set-pri-${i}" style="cursor:pointer"
                        data-code="${gcCode}" data-priority="${i}">
                            ${i18next_1.default.t("priority.set" + i)}
                    </a>
                </li>`);
            controlContainer.appendChild(control);
        }
        const toAdd = (0, utils_1.HTMLStringToElement)(`
            <li>
                <a class="cachetur-add-comment" data-code="${gcCode}">
                    ${i18next_1.default.t("comments.add")}
                </a>
            </li>`);
        controlContainer.append(toAdd);
    }
    initNotInList(gcCode) {
        console.log("Injecting cachetur menu to geocache page not in list");
        const stringElem = `
            <li>
                <a class="cachetur-add-code"
                    style="cursor: pointer;"
                    data-code="${gcCode}">
                        ${i18next_1.default.t("send")}
                </a>
            </li>`;
        const elemToAdd = (0, utils_1.HTMLStringToElement)(stringElem);
        const controlContainer = this.controlContainers.get(gcCode);
        if (controlContainer === undefined) {
            throw new Error("Missing control container for " + gcCode);
        }
        controlContainer.replaceChildren(elemToAdd);
    }
    initFoundBy(gcCode, foundBy) {
        const dataElement = (0, utils_1.HTMLStringToElement)(`
                <li>
                    <b>
                        <img src="https://cachetur.no/api/img/attfind.png" />
                        ${i18next_1.default.t("foundby")}
                    </b>
                </li>
                <li>
                    ${foundBy}
                </li>`);
        const foundByContainer = this.foundByContainers.get(gcCode);
        if (foundByContainer === undefined) {
            throw new Error("Missing control container for " + gcCode);
        }
        foundByContainer.replaceChildren(dataElement);
    }
    initPublicLists(gcCode, lists) {
        console.log("Injecting list of lists");
        let alternate = false;
        let listHtml = `<ul class="BookmarkList ul-no-bullets">`;
        for (const list of lists) {
            let link;
            switch (list.source) {
                case "triptemplate":
                    link = `<a href="https://cachetur.no/tur/${list.id}">${list.name}</a>`;
                    break;
                case "trip":
                    link = `<a href="https://cachetur.no/fellestur/${list.id}">${list.name}</a>`;
                    break;
                default:
                    link = `<a href="https://cachetur.no/liste/${list.id}">${list.name}</a>`;
                    break;
            }
            let listElement = `<li class="cachetur-spaced-li">${link} ${i18next_1.default.t('template.by')} ${list.owner}</li>`;
            listHtml += listElement;
        }
        listHtml += `</ul>`;
        const publicListContainer = this.publicListsContainers.get(gcCode);
        if (publicListContainer === undefined) {
            throw new Error("Public list container not found");
        }
        const publicListElem = (0, utils_1.HTMLStringToElement)(listHtml);
        publicListContainer.replaceChildren(publicListElem);
    }
}
exports.GC_SearchMap_PageHandler = GC_SearchMap_PageHandler;


/***/ }),

/***/ 795:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PageHandlerBase = void 0;
const utils_1 = __webpack_require__(185);
const Settings_1 = __webpack_require__(307);
const i18next_1 = __importDefault(__webpack_require__(198));
const API_1 = __webpack_require__(620);
const Toast_1 = __webpack_require__(163);
class PageHandlerBase {
    constructor() {
        this.isPageWithoutMap = true;
        this.ctID = "";
        this.headerElement = null;
        this._toastContainer = null;
        this._cachesInTrip = [];
        this.onControlClicked = (event) => {
            const target = event.target;
            if (target === null) {
                throw new Error("Triggered on control clicked event without target");
            }
            if (!(target instanceof HTMLElement)) {
                throw new Error("Triggered on control clicked event with target not being element");
            }
            if (target.matches(".cachetur-add-code")) {
                this.addCacheToList(target);
            }
            else if (target.matches(".cachetur-add-comment")) {
                this.addCommentToCache(target);
            }
            else if ("priority" in target.dataset) {
                this.setPriorityToCache(target);
            }
        };
        this.gcCodesOnPage = [];
        this.controlContainers = new Map();
        this.foundByContainers = new Map();
        this.publicListsContainers = new Map();
        this._btnOpenCachetur = null;
        this._btnRefreshData = null;
        this._btnShowOnMap = null;
        this._btnFitMap = null;
        this._tripSelector = null;
        this._cacheCount = null;
        this.tripChanged = () => {
            const id = this.tripSelector.value;
            this.ctGetAddedCodes(id);
            this.ctGetShowTripData(id);
            GM_setValue("cachetur_selected_trip", id);
            GM_setValue("cachetur_last_action", Date.now());
        };
        this.openTrip = () => {
            const selected = this.tripSelector.value;
            let url = "https://cachetur.no/";
            if (selected.endsWith("L")) {
                url = url + "liste/" + selected.substring(0, selected.length - 1);
            }
            else if (selected.endsWith("T")) {
                url = url + "template/" + selected.substring(0, selected.length - 1);
            }
            else {
                url = url + "fellestur/" + selected;
            }
            GM_openInTab(url);
        };
        this.refreshTrip = async () => {
            console.log("Refreshing list of trips and data for selected trip");
            if (this.tripSelector === null) {
                throw new Error("Trying to access trip option list before creation");
            }
            const id = this.tripSelector.value;
            this.cacheCount.innerText = "Loading";
            const available = await (0, API_1.ctApiCall)("planlagt_list_editable", {
                includetemplates: "true",
            });
            let options = "";
            for (let item of available) {
                options += `<option value="${item.id}">${item.turnavn}</option>`;
            }
            this.tripSelector.value = "";
            this.tripSelector.replaceChildren((0, utils_1.HTMLStringToElement)(options));
            this.tripSelector.value = id;
            this.ctGetAddedCodes(id);
            this.ctGetShowTripData(id);
            GM_setValue("cachetur_last_action", Date.now());
            console.log("Finished refreshing list of trips and data for selected trip");
        };
        this.ctGetAddedCodes = async (id) => {
            console.log("Get cache codes in list " + id);
            const codes = await (0, API_1.ctApiCall)("planlagt_get_codes", {
                tur: id,
                useid: false,
            });
            if (codes.length <= 0) {
                console.log("No caches returned for selected trip");
                return;
            }
            this.cachesInTrip = structuredClone(codes);
            this.cacheCount.innerHTML = `(${this.cachesInTrip.length.toString()})`;
        };
        this.ctGetShowTripData = async (id) => {
            if (!id || id.endsWith("L")) {
                this.btnFitMap.disabled = true;
                return;
            }
            console.log("Attempting to fetch route for selected trip");
            const routeData = await (0, API_1.ctApiCall)("planlagt_get_route", {
                tur: id,
            });
            if (routeData.length <= 0) {
                console.log("Couldn't find any route for given trip/list");
                this.btnFitMap.disabled = true;
                return;
            }
            console.log("Route data received");
            console.log("Attempting to fetch non caches waypoints for selected trip");
            const waypointData = await (0, API_1.ctApiCall)("planlagt_get_noncaches", {
                tur: id,
            });
            if (waypointData.length <= 0) {
                console.log("Couldn't find any waypoints for given trip/list");
                return;
            }
            console.log("Waypoints received");
            Settings_1.Settings.Instance().bc.postMessage({
                command: "showTripData",
                data: {
                    routeData: routeData,
                    waypointData: waypointData
                }
            });
            this.btnFitMap.disabled = this.isPageWithoutMap;
            this.btnShowOnMap.disabled = this.isPageWithoutMap;
        };
        this.showCachesOnMap = async () => {
            const id = this.tripSelector.value;
            console.log("Adding caches from cachetur.no " + id);
            console.log("Attempting to fetch cache coordinates for selected trip");
            const cacheData = await (0, API_1.ctApiCall)("planlagt_get_cachecoordinates", {
                tur: id,
            });
            if (cacheData.length <= 0) {
                console.log("Couldn't find any cache data for given trip/list");
                return;
            }
            console.log("Sending cache data to map connector");
            Settings_1.Settings.Instance().bc.postMessage({
                command: "showCachesOnMap",
                data: cacheData
            });
            this.btnFitMap.disabled = this.isPageWithoutMap;
            this.btnShowOnMap.disabled = this.isPageWithoutMap;
        };
        this.fitBounds = () => {
            Settings_1.Settings.Instance().bc.postMessage({
                command: "fitBounds"
            });
        };
    }
    get toastContainer() {
        if (this._toastContainer === null) {
            throw new Error("Accessing toast container before creation");
        }
        return this._toastContainer;
    }
    set toastContainer(value) {
        this._toastContainer = value;
    }
    get cachesInTrip() {
        return this._cachesInTrip;
    }
    set cachesInTrip(value) {
        this._cachesInTrip = value;
        this.onCacheInTripChanged();
    }
    onCacheInTripChanged() {
        for (const gcCode of this.gcCodesOnPage) {
            this.refreshCache(gcCode);
        }
    }
    refreshCache(gcCode) {
        this.getFoundBy(gcCode);
        if (this.cachesInTrip.includes(gcCode)) {
            this.initInList(gcCode);
        }
        else {
            this.initNotInList(gcCode);
        }
        const controlContainer = this.controlContainers.get(gcCode);
        if (controlContainer === undefined) {
            throw new Error("Missing control container for " + gcCode);
        }
        controlContainer.addEventListener("click", this.onControlClicked);
        this.getPublicLists(gcCode);
    }
    async addCacheToList(infoElement) {
        const tur = this.tripSelector.value;
        const code = infoElement.dataset.code;
        if (code === undefined) {
            throw new Error("Trying to add cache without GC code in data");
        }
        const data = await (0, API_1.ctApiCall)("planlagt_add_codes", {
            tur: tur,
            code: code,
        });
        if (data === "Ok") {
            this.cachesInTrip.push(code);
            this.initInList(code);
            const _ = new Toast_1.Toast(`Adding cache ${code} to list succedded`, "success", 5000, this.toastContainer);
            this.cacheCount.innerHTML = `(${this.cachesInTrip.length})`;
        }
        else {
            const _ = new Toast_1.Toast(`Adding cache ${code} to list failed`, "error", 5000, this.toastContainer);
        }
        GM_setValue("cachetur_last_action", Date.now());
    }
    async setPriorityToCache(infoElement) {
        const tur = this.tripSelector.value;
        const code = infoElement.dataset.code;
        const priority = infoElement.dataset.priority;
        const data = await (0, API_1.ctApiCall)("planlagt_set_code_priority", {
            tur: tur,
            code: code,
            priority: priority,
        });
        if (data === "Ok") {
            const _ = new Toast_1.Toast(`Setting priority ${priority} to cache ${code} succedded`, "success", 5000, this.toastContainer);
        }
        else {
            const _ = new Toast_1.Toast(`Setting priority ${priority} to cache ${code} failed`, "error", 5000, this.toastContainer);
        }
        GM_setValue("cachetur_last_action", Date.now());
    }
    async addCommentToCache(infoElement) {
        const tur = this.tripSelector.value;
        const code = infoElement.dataset.code;
        const comment = prompt(i18next_1.default.t("comments.description"));
        const data = await (0, API_1.ctApiCall)("planlagt_add_code_comment", {
            tur: tur,
            code: code,
            comment: comment,
        });
        if (data === "Ok") {
            const _ = new Toast_1.Toast(`Extending cache ${code} comment succedded`, "success", 5000, this.toastContainer);
        }
        else {
            const _ = new Toast_1.Toast(`Extending cache ${code} comment failed`, "error", 5000, this.toastContainer);
        }
        GM_setValue("cachetur_last_action", Date.now());
    }
    initInList(gcCode) {
        console.log("Init in list default implementation");
    }
    initNotInList(gcCode) {
        console.log("Init not in list default implementation");
    }
    async getFoundBy(gcCode) {
        const id = this.tripSelector.value;
        console.log("Getting info about friends who found cache: " + gcCode);
        const foundBy = await (0, API_1.ctApiCall)("planlagt_check_find", {
            tur: id,
            code: gcCode,
        });
        console.log("Info about friends who found cache: " + gcCode + " retrieved (" + foundBy + "), starting injecting");
        this.initFoundBy(gcCode, foundBy);
    }
    initFoundBy(gcCode, foundBy) {
        console.log("Init found by default implementation");
    }
    async getPublicLists(gcCode) {
        const publicLists = await (0, API_1.ctApiCall)("cache_get_lists", {
            "code": gcCode
        });
        if (publicLists.length <= 0) {
            console.log("Couldn't find any lists or trip templates for the given cache");
            return;
        }
        this.initPublicLists(gcCode, publicLists);
    }
    initPublicLists(gcCode, lists) {
        console.log("Init public list default implementaiton");
    }
    get btnOpenCachetur() {
        if (this._btnOpenCachetur === null) {
            throw new Error("Trying to access button open cachetur before setting it");
        }
        return this._btnOpenCachetur;
    }
    set btnOpenCachetur(value) {
        this._btnOpenCachetur = value;
    }
    get btnRefreshData() {
        if (this._btnRefreshData === null) {
            throw new Error("Trying to access button refresh data before setting it");
        }
        return this._btnRefreshData;
    }
    set btnRefreshData(value) {
        this._btnRefreshData = value;
    }
    get btnShowOnMap() {
        if (this._btnShowOnMap === null) {
            throw new Error("Trying to access button show on map before setting it");
        }
        return this._btnShowOnMap;
    }
    set btnShowOnMap(value) {
        this._btnShowOnMap = value;
    }
    get btnFitMap() {
        if (this._btnFitMap === null) {
            throw new Error("Trying to access button fit map before setting it");
        }
        return this._btnFitMap;
    }
    set btnFitMap(value) {
        this._btnFitMap = value;
    }
    get tripSelector() {
        if (this._tripSelector === null) {
            throw new Error("Trying to access trip selector before setting it");
        }
        return this._tripSelector;
    }
    set tripSelector(value) {
        this._tripSelector = value;
    }
    get cacheCount() {
        if (this._cacheCount === null) {
            throw new Error("Trying to access cache count before setting it");
        }
        return this._cacheCount;
    }
    set cacheCount(value) {
        this._cacheCount = value;
    }
    getCTID() {
        return this.ctID;
    }
    getHeaderSelector() {
        return "";
    }
    async getHeaderElement() {
        if (this.headerElement !== null) {
            return this.headerElement;
        }
        this.headerElement = await (0, utils_1.waitForElement)(this.getHeaderSelector());
        return this.headerElement;
    }
    async prependToHeader(data) {
        console.log("Injecting cachetur.no in menu");
        const header = await this.getHeaderElement();
        console.log("After awaiting get header element");
        if (header) {
            console.log("Prepend to header - appending data");
            const fragment = (0, utils_1.HTMLStringToElement)(data);
            header.prepend(fragment);
        }
    }
    prepareToastContainer() {
        this.toastContainer = document.createElement("ul");
        this.toastContainer.classList.add("toast-container");
        document.body.appendChild(this.toastContainer);
    }
    async ctInitInactive() {
        if (Settings_1.Settings.Instance().getInitialized()) {
            console.error("Trying to init inactive second time");
            return;
        }
        console.log("Assistant not being actively used, disabling");
        const dataToPrepend = `<li id="cachetur-header" class="ctRootComponent text-white">
                                    <span class="cachetur-header-text">
                                        <img src="https://cachetur.net/img/logo_top.png" alt="cachetur.no" />
                                        <a href id="cachetur-activate">
                                            ${i18next_1.default.t("activate.button")}
                                        </a>
                                    </span>
                                </li>`;
        await this.prependToHeader(dataToPrepend);
        const btnActivate = await (0, utils_1.waitForElement)("#cachetur-activate");
        btnActivate.addEventListener("click", () => {
            GM_setValue("cachetur_last_action", Date.now());
        });
        Settings_1.Settings.Instance().setInitialized(true);
    }
    async getTripsAsOptions() {
        console.log("Inside getTripsAsOptions, starting");
        const available = await (0, API_1.ctApiCall)("planlagt_list_editable", {
            includetemplates: "true",
        });
        console.log("Inside getTripsAsOptions, data retrieved");
        let options = "";
        for (let item of available) {
            options += `<option value="${item.id}">${item.turnavn}</option>`;
        }
        return options;
    }
    async initTopBar() {
        console.log("Init logged in");
        if (Settings_1.Settings.Instance().getInitialized()) {
            console.log("Trying to initialize logged in when already initialized");
            return;
        }
        const trips = await this.getTripsAsOptions();
        const topBarData = `
            <li id="cachetur-header" class="ctRootComponent text-white">
                <img src="https://cachetur.net/img/logo_top.png" title="${i18next_1.default.t("menu.loggedinas")} ${Settings_1.Settings.Instance().getUsername()}" />
                ${i18next_1.default.t("menu.addto")}
                <select id="cachetur-tur-valg">
                    ${trips}
                </select>
                <button id="cachetur-tur-open" class="cachetur-menu-button" type="button" title="${i18next_1.default.t("menu.opentrip")}">
                    <img src="https://cachetur.no/api/img/arrow.png" style="height:16px;"/>
                </button>
                <button id="cachetur-tur-refresh" type="button" class="cachetur-menu-button" title="${i18next_1.default.t("menu.refresh")}">
                    <img src="https://cachetur.no/api/img/refresh.png" style="height:16px;"/>
                </button>
                <button id="cachetur-tur-add-ct-caches" type="button" class="cachetur-menu-button" title="${i18next_1.default.t("menu.showonmap")}">
                    <img src="https://cachetur.no/api/img/map.png" style="height:16px;"/>
                </button>
                <button id="cachetur-tur-fitbounds" class="cachetur-menu-button" type="button" title="${i18next_1.default.t("menu.fitroute")}">
                    <img src="https://cachetur.no/api/img/zoom.png" style="height:16px;"/>
                </button>
                <span id="cachetur-tur-antall-container">
                    (<span id="cachetur-tur-antall"></span>)
                </span>
            </li>`;
        await this.prependToHeader(topBarData);
        this.tripSelector = document.getElementById("cachetur-tur-valg");
        this.btnOpenCachetur = document.getElementById("cachetur-tur-open");
        this.btnRefreshData = document.getElementById("cachetur-tur-refresh");
        this.btnShowOnMap = document.getElementById("cachetur-tur-add-ct-caches");
        this.btnFitMap = document.getElementById("cachetur-tur-fitbounds");
        this.cacheCount = document.getElementById("cachetur-tur-antall-container");
        await this.initTopLinks();
    }
    async initSpecific() {
        console.log("InitSpecific, base, no implementation");
    }
    async initTopLinks() {
        let storedTrip = GM_getValue("cachetur_selected_trip", "0");
        this.tripSelector.addEventListener("change", this.tripChanged);
        this.btnOpenCachetur.addEventListener("click", this.openTrip);
        this.btnRefreshData.addEventListener("click", this.refreshTrip);
        this.btnShowOnMap.addEventListener("click", this.showCachesOnMap);
        this.btnFitMap.addEventListener("click", this.fitBounds);
        let isStoredTripInSelection = false;
        const selectorOptions = this.tripSelector.children;
        for (const option of selectorOptions) {
            if (option instanceof HTMLOptionElement) {
                const value = option.value;
                if (value === storedTrip) {
                    isStoredTripInSelection = true;
                    this.tripSelector.value = value;
                    break;
                }
            }
        }
        if (!isStoredTripInSelection) {
            if (selectorOptions.length > 0) {
                const option = selectorOptions.item(0);
                storedTrip = option.value;
            }
            else {
                storedTrip = "0";
            }
            GM_setValue("cachetur_selected_trip", storedTrip);
        }
        this.tripSelector.dispatchEvent(new Event("change"));
    }
    disableTopLinks() {
        this.btnFitMap.disabled = this.isPageWithoutMap;
        this.btnShowOnMap.disabled = this.isPageWithoutMap;
    }
    async ctInitLoggedIn() {
        if (Settings_1.Settings.Instance().getInitialized()) {
            console.log("Trying to initialize logged when already initialized");
            return;
        }
        console.log("Initializing Cachetur assistant");
        const initTopPromise = this.initTopBar();
        const initSpecificPromise = this.initSpecific();
        await Promise.all([initTopPromise, initSpecificPromise]);
        this.disableTopLinks();
        Settings_1.Settings.Instance().setInitialized(true);
        console.log("Initialization completed");
    }
    async ctInitNotLoggedIn() {
        console.log("Init not logged in");
        if (Settings_1.Settings.Instance().getInitialized()) {
            console.log("Trying to initialize not logged in when already initialized");
            return;
        }
        const dataToPrepend = `<li id="cachetur-header" class="ctRootComponent text-white">
                                    <span class="cachetur-header-text">
                                        <a href="https://cachetur.no/" target="_blank">
                                            <img src="https://cachetur.net/img/logo_top.png" alt="cachetur.no" />
                                            ${i18next_1.default.t("menu.notloggedin")}
                                            <br>
                                            ${i18next_1.default.t("menu.deactivated")}
                                        </a>
                                    </span>
                                </li>`;
        await this.prependToHeader(dataToPrepend);
        console.log("After awaiting prepend to header");
        Settings_1.Settings.Instance().setInitialized(true);
        console.log("Initialization completed");
    }
    cleanUserStuff() {
        const elements = document.getElementsByClassName("ctRootComponent");
        for (const elem of elements) {
            elem.remove();
        }
    }
}
exports.PageHandlerBase = PageHandlerBase;


/***/ }),

/***/ 338:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PGC_Map_PageHandler = void 0;
const utils_1 = __webpack_require__(185);
const PGC_PageHandlerBase_1 = __webpack_require__(606);
const i18next_1 = __importDefault(__webpack_require__(198));
class PGC_Map_PageHandler extends PGC_PageHandlerBase_1.PGC_PageHandlerBase {
    constructor() {
        super();
        this.onInfoPaneMutated = (mutations) => {
            for (const mutationRecord of mutations) {
                if (!(mutationRecord.target instanceof HTMLElement)) {
                    continue;
                }
                if (mutationRecord.target.className === "leaflet-popup-pane" && mutationRecord.removedNodes.length > 0) {
                    for (const removedNode of mutationRecord.removedNodes) {
                        if (removedNode instanceof Element) {
                            this.removeCacheInfo(removedNode);
                        }
                    }
                }
            }
            for (const mutationRecord of mutations) {
                if (!(mutationRecord.target instanceof HTMLElement)) {
                    continue;
                }
                if (mutationRecord.target.className === "leaflet-popup-pane" && mutationRecord.addedNodes.length > 0) {
                    this.addCacheInfo(mutationRecord.target);
                }
            }
        };
        this.ctID = "pgc_map";
        this.isPageWithoutMap = false;
    }
    async initSpecific() {
        const infoPaneElem = await (0, utils_1.waitForElement)("#map > div.leaflet-map-pane > div.leaflet-objects-pane > div.leaflet-popup-pane");
        if (infoPaneElem === null) {
            throw new Error("Map not yet initialized properly to get popup pane");
        }
        const infoMutationObserver = new MutationObserver(this.onInfoPaneMutated);
        infoMutationObserver.observe(infoPaneElem, {
            childList: true,
            subtree: true,
        });
    }
    addCacheInfo(parentElement) {
        const alreadyProcessed = parentElement.querySelector(".cachetur-row");
        if (alreadyProcessed !== null) {
            alreadyProcessed.remove();
        }
        const gcCodeContent = parentElement.querySelector(".leaflet-popup-content");
        if (gcCodeContent === null) {
            throw new Error("Missing GC code section");
        }
        const gcCode = this.extractGCCode(gcCodeContent);
        const contentWrapper = parentElement.querySelector(".leaflet-popup-content-wrapper");
        if (contentWrapper === null) {
            throw new Error("Missing content wrapper div");
        }
        const twoColumnDiv = document.createElement("div");
        twoColumnDiv.classList.add("cachetur-row");
        contentWrapper.appendChild(twoColumnDiv);
        const controlContainer = document.createElement("ul");
        controlContainer.id = `cachetur-controls-container-${gcCode}`;
        controlContainer.classList.add("cachetur-two-column");
        controlContainer.classList.add("ul-no-bullets");
        this.controlContainers.set(gcCode, controlContainer);
        twoColumnDiv.appendChild(controlContainer);
        const foundByContainer = document.createElement("ul");
        foundByContainer.id = `cachetur-found-by-container-${gcCode}`;
        foundByContainer.classList.add("cachetur-two-column");
        foundByContainer.classList.add("ul-no-bullets");
        this.foundByContainers.set(gcCode, foundByContainer);
        twoColumnDiv.appendChild(foundByContainer);
        this.gcCodesOnPage.push(gcCode);
        this.refreshCache(gcCode);
    }
    removeCacheInfo(parentElement) {
        const gcCodeContent = parentElement.querySelector(".leaflet-popup-content");
        if (gcCodeContent === null) {
            throw new Error("Missing GC code section");
        }
        const gcCode = this.extractGCCode(gcCodeContent);
        this.gcCodesOnPage.splice(this.gcCodesOnPage.indexOf(gcCode), 1);
        this.controlContainers.delete(gcCode);
        this.foundByContainers.delete(gcCode);
    }
    extractGCCode(gcCodeContent) {
        const gcCodeStr = gcCodeContent.children[0].getAttribute("href");
        const gcCode = gcCodeStr === null || gcCodeStr === void 0 ? void 0 : gcCodeStr.substring(gcCodeStr.lastIndexOf("/") + 1);
        if (gcCode === undefined) {
            throw new Error("Parsing GC code failed");
        }
        return gcCode;
    }
    initInList(gcCode) {
        console.log("Injecting cachetur menu to geocache page in list");
        const controlContainer = this.controlContainers.get(gcCode);
        if (controlContainer === undefined) {
            throw new Error("Missing control container for " + gcCode);
        }
        controlContainer.replaceChildren();
        for (let i = 1; i <= 3; i++) {
            const control = (0, utils_1.HTMLStringToElement)(`
                <li>
                    <a class="cachetur-set-pri-${i}" style="cursor:pointer"
                        data-code="${gcCode}" data-priority="${i}">
                            ${i18next_1.default.t("priority.set" + i)}
                    </a>
                </li>`);
            controlContainer.appendChild(control);
        }
        const toAdd = (0, utils_1.HTMLStringToElement)(`
            <li>
                <a class="cachetur-add-comment" data-code="${gcCode}">
                    ${i18next_1.default.t("comments.add")}
                </a>
            </li>`);
        controlContainer.append(toAdd);
    }
    initNotInList(gcCode) {
        console.log("Injecting cachetur menu to geocache page not in list");
        const stringElem = `
            <li>
                <a class="cachetur-add-code"
                    style="cursor: pointer;"
                    data-code="${gcCode}">
                        ${i18next_1.default.t("send")}
                </a>
            </li>`;
        const elemToAdd = (0, utils_1.HTMLStringToElement)(stringElem);
        const controlContainer = this.controlContainers.get(gcCode);
        if (controlContainer === undefined) {
            throw new Error("Missing control container for " + gcCode);
        }
        controlContainer.replaceChildren(elemToAdd);
    }
    initFoundBy(gcCode, foundBy) {
        const dataElement = (0, utils_1.HTMLStringToElement)(`
                <li>
                    <b>
                        <img src="https://cachetur.no/api/img/attfind.png" />
                        ${i18next_1.default.t("foundby")}
                    </b>
                </li>
                <li>
                    ${foundBy}
                </li>`);
        const foundByContainer = this.foundByContainers.get(gcCode);
        if (foundByContainer === undefined) {
            throw new Error("Missing control container for " + gcCode);
        }
        foundByContainer.replaceChildren(dataElement);
    }
}
exports.PGC_Map_PageHandler = PGC_Map_PageHandler;


/***/ }),

/***/ 606:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PGC_PageHandlerBase = void 0;
const PageHandlerBase_1 = __webpack_require__(795);
class PGC_PageHandlerBase extends PageHandlerBase_1.PageHandlerBase {
    getHeaderSelector() {
        return "#pgcMainMenu ul.navbar-right";
    }
}
exports.PGC_PageHandlerBase = PGC_PageHandlerBase;


/***/ }),

/***/ 707:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PGC_VirtualGPS_PageHandler = void 0;
const PGC_PageHandlerBase_1 = __webpack_require__(606);
class PGC_VirtualGPS_PageHandler extends PGC_PageHandlerBase_1.PGC_PageHandlerBase {
    constructor() {
        super();
        this.ctID = "pgc_vgps";
    }
}
exports.PGC_VirtualGPS_PageHandler = PGC_VirtualGPS_PageHandler;


/***/ }),

/***/ 307:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Settings = void 0;
class Settings {
    constructor() {
        this.initialized = false;
        this.username = "";
        this.pageHandler = undefined;
        this._bc = undefined;
    }
    static Instance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new Settings();
        return this.instance;
    }
    getInitialized() {
        return this.initialized;
    }
    setInitialized(newState) {
        this.initialized = newState;
    }
    getUsername() {
        return this.username;
    }
    setUsername(newUsername) {
        this.username = newUsername;
    }
    getPageHandler() {
        if (this.pageHandler === undefined) {
            throw new Error("Trying to access page handler before initialization");
        }
        return this.pageHandler;
    }
    setPageHandler(newPageHandler) {
        this.pageHandler = newPageHandler;
    }
    get bc() {
        if (this._bc === undefined) {
            throw new Error("Trying to access broadcast channel before initialization");
        }
        return this._bc;
    }
    set bc(value) {
        this._bc = value;
    }
}
exports.Settings = Settings;


/***/ }),

/***/ 163:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Toast = void 0;
class Toast {
    constructor(message, type, time, container) {
        this.remove = () => {
            this.parentElement.remove();
        };
        this.message = message;
        this.type = type;
        this.time = time;
        this.parentElement = document.createElement('li');
        this.parentElement.classList.add("toast-notification");
        this.parentElement.classList.add(this.type);
        this.messageElement = document.createElement("div");
        this.messageElement.className = "toast-message-container";
        this.messageElement.textContent = this.message;
        this.parentElement.appendChild(this.messageElement);
        this.closeDiv = document.createElement("div");
        this.closeDiv.className = "toast-close-notification";
        this.closeDiv.textContent = "╳";
        this.parentElement.append(this.closeDiv);
        container.appendChild(this.parentElement);
        setTimeout(this.remove, this.time);
        this.closeDiv.addEventListener("click", this.remove);
    }
}
exports.Toast = Toast;


/***/ }),

/***/ 156:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const GC_Cache_PageHandler_1 = __webpack_require__(297);
const GC_BrowseMap_PageHandler_1 = __webpack_require__(547);
const GC_SearchMap_PageHandler_1 = __webpack_require__(89);
const GC_BookmarkList_PageHandler_1 = __webpack_require__(255);
const GC_Geotour_PageHandler_1 = __webpack_require__(312);
const GSAK_PageHandler_1 = __webpack_require__(775);
const PGC_Map_PageHandler_1 = __webpack_require__(338);
const PGC_VirtualGPS_PageHandler_1 = __webpack_require__(707);
const CT_Trip_PageHandler_1 = __webpack_require__(540);
const CT_RVSites_PageHandler_1 = __webpack_require__(739);
const Settings_1 = __webpack_require__(307);
const API_1 = __webpack_require__(620);
const Toast_css_raw_1 = __importDefault(__webpack_require__(575));
const Cachetur_css_raw_1 = __importDefault(__webpack_require__(325));
const i18next_1 = __importDefault(__webpack_require__(198));
const i18next_browser_languagedetector_1 = __importDefault(__webpack_require__(218));
const i18next_http_backend_1 = __importDefault(__webpack_require__(6));
const pathname = window.location.pathname;
const domain = window.location.hostname;
const href = window.location.href;
let _ctLanguage = "";
window.addEventListener("load", main);
async function main() {
    window.removeEventListener("load", main);
    Settings_1.Settings.Instance().bc = new BroadcastChannel("cachetur-assistant-map-connector");
    console.log("Starting Cacheturassistenten V. " + GM_info.script.version);
    if (domain === "www.geocaching.com") {
        if (pathname.indexOf("/seek/") > -1) {
            Settings_1.Settings.Instance().setPageHandler(new GC_Cache_PageHandler_1.GC_Cache_PageHandler());
        }
        else if (pathname.indexOf("/plan/lists") > -1) {
            Settings_1.Settings.Instance().setPageHandler(new GC_BookmarkList_PageHandler_1.GC_BookmarkList_PageHandler());
        }
        else if (pathname.indexOf("/geocache/") > -1) {
            Settings_1.Settings.Instance().setPageHandler(new GC_Cache_PageHandler_1.GC_Cache_PageHandler());
        }
        else if (pathname.indexOf("/map/") > -1) {
            Settings_1.Settings.Instance().setPageHandler(new GC_BrowseMap_PageHandler_1.GC_BrowseMap_PageHandler());
        }
        else if (pathname.indexOf("/live/play/map") > -1) {
            Settings_1.Settings.Instance().setPageHandler(new GC_SearchMap_PageHandler_1.GC_SearchMap_PageHandler());
        }
        else if (pathname.indexOf("/play/geotours") > -1) {
            Settings_1.Settings.Instance().setPageHandler(new GC_Geotour_PageHandler_1.GC_Geotour_PageHandler());
        }
    }
    else if (href.indexOf("/html/") > -1) {
        Settings_1.Settings.Instance().setPageHandler(new GSAK_PageHandler_1.GSAK_PageHandler());
    }
    else if (pathname.startsWith("/bobilplasser/")) {
        Settings_1.Settings.Instance().setPageHandler(new CT_RVSites_PageHandler_1.CT_RVSites_PageHandler());
    }
    else if (pathname.startsWith("/fellestur/")) {
        Settings_1.Settings.Instance().setPageHandler(new CT_Trip_PageHandler_1.CT_Trip_PageHandler());
    }
    else if (domain === "project-gc.com" &&
        pathname.indexOf("/User/VirtualGPS") > -1 &&
        window.location.search.indexOf("?map=") === -1) {
        Settings_1.Settings.Instance().setPageHandler(new PGC_VirtualGPS_PageHandler_1.PGC_VirtualGPS_PageHandler());
    }
    else if (domain === "project-gc.com") {
        Settings_1.Settings.Instance().setPageHandler(new PGC_Map_PageHandler_1.PGC_Map_PageHandler());
    }
    else {
        throw new Error("Allowed but unsupported page");
    }
    console.log("Running in " + Settings_1.Settings.Instance().getPageHandler().getCTID() + " mode");
    await loadTranslations();
    console.log("Waiting for needed elements defined in page handlers");
    console.log("Page handler has everything to allow init");
    ctInit();
    Settings_1.Settings.Instance().getPageHandler().prepareToastContainer();
    GM_addStyle(Toast_css_raw_1.default);
    GM_addStyle(Cachetur_css_raw_1.default);
}
async function loadTranslations() {
    try {
        await i18next_1.default
            .use(i18next_http_backend_1.default)
            .use(i18next_browser_languagedetector_1.default)
            .init({
            supportedLngs: [
                "nb_NO",
                "en",
                "de_DE",
                "sv_SE",
                "en_US",
                "da_DK",
                "nl_NL",
                "fr_FR",
                "cs_CZ",
                "fi_FI",
                "es_ES",
            ],
            preload: [
                "nb_NO",
                "en",
                "de_DE",
                "sv_SE",
                "en_US",
                "da_DK",
                "nl_NL",
                "fr_FR",
                "cs_CZ",
                "fi_FI",
                "es_ES",
            ],
            fallbackLng: [
                "en",
            ],
            lng: navigator.language,
            ns: ["cachetur"],
            defaultNS: "cachetur",
            backend: {
                loadPath: "https://cachetur.no/monkey/language/{{ns}}.{{lng}}.json",
                crossDomain: true,
            },
        });
    }
    catch (err) {
        if (err.indexOf("failed parsing") > -1) {
            await i18next_1.default.changeLanguage("en");
        }
        console.error("Error occurred when loading language data", err);
        throw err;
    }
    console.log(`Translation fetched successfully ${i18next_1.default.resolvedLanguage}`);
}
function ctInit() {
    const lastUse = GM_getValue("cachetur_last_action", 0);
    const timeSinceLastUse = (Date.now() - lastUse) / 1000;
    console.log(`The Cachetur Assistant was last used ${timeSinceLastUse} seconds ago`);
    if (timeSinceLastUse > 3600) {
        Settings_1.Settings.Instance().getPageHandler().ctInitInactive();
    }
    else {
        ctCheckLogin();
    }
}
async function ctCheckLogin() {
    if (Settings_1.Settings.Instance().getInitialized()) {
        console.error("Trying to check login after sucessful initialization");
        return;
    }
    console.log("Checking login");
    let response;
    try {
        response = await (0, API_1.ctApiCall)("user_get_current", "");
    }
    catch (e) {
        console.log("Authorization failed: " + e);
        console.log("Not logged in");
        return;
    }
    console.log("Checking login data recieved");
    Settings_1.Settings.Instance().setUsername(response.username);
    _ctLanguage = response.language;
    i18next_1.default.changeLanguage(_ctLanguage);
    console.log("Login OK");
    Settings_1.Settings.Instance().getPageHandler().ctInitLoggedIn();
}
const ambassadorNames = (/* unused pure expression or super */ null && (["Heltinnen", "DougyB", "cghove", "Korsgat", "Don Rodolphos", "platoaddict",
    "rragan", "twlare", "GorgonVaktmester", "Olet", "footie77", "HikingSeal",
    "Vatvedt", "kawlii", "Kittykatch", "anirt", "QuoX", "flower6871", "juliekatrine"]));


/***/ }),

/***/ 185:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HTMLStringToElement = exports.waitForElement = void 0;
function waitForElement(selector) {
    return new Promise((resolve) => {
        console.log("Creating promise for waitForElement with selector: ", selector);
        const element = document.querySelector(selector);
        if (element) {
            console.log("Element already in DOM");
            return resolve(element);
        }
        console.log("Creating observer for waitForElement with selector: ", selector);
        const observer = new MutationObserver((mutationList) => {
            console.log("Observed data getting processed for selector: ", selector);
            for (const mutation of mutationList) {
                if (mutation.target instanceof Element) {
                    if (mutation.target.matches(selector)) {
                        console.log("Requested element found using target ", selector);
                        observer.disconnect();
                        return resolve(mutation.target);
                    }
                }
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === node.ELEMENT_NODE) {
                        const element = node;
                        if (element.matches(selector)) {
                            console.log("Requested element found in addedNodes ", selector);
                            observer.disconnect();
                            return resolve(element);
                        }
                    }
                }
            }
            console.log("Observed data didn't contain requested data for selector: ", selector);
            const element = document.querySelector(selector);
            if (element) {
                console.log("Requested element already in DOM ", selector);
                observer.disconnect();
                return resolve(element);
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
}
exports.waitForElement = waitForElement;
function HTMLStringToElement(string) {
    const template = document.createElement("template");
    string = string.trim();
    template.innerHTML = string;
    return template.content;
}
exports.HTMLStringToElement = HTMLStringToElement;
function debounce(func, wait) {
    let timeoutId;
    return function debounced(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(func.bind(this), wait, ...args);
    };
}


/***/ }),

/***/ 325:
/***/ ((module) => {

module.exports = "\r\n\r\n\r\n.cachetur-two-column {\r\n    flex: 50%;\r\n}\r\n\r\n\r\n\r\n.cachetur-row {\r\n    display: flex;\r\n}\r\n\r\n.ul-no-bullets {\r\n    list-style-type: none;\r\n}\r\n\r\n.cachetur-padding {\r\n    padding: 12px 16px;\r\n}\r\n\r\n.cachetur-spaced-li {\r\n    margin: 8px 0px;\r\n}";

/***/ }),

/***/ 575:
/***/ ((module) => {

module.exports = "* {\r\n    margin: 0;\r\n    padding: 0;\r\n}\r\n\r\n.toast-container {\r\n    margin-bottom: 20px;\r\n    margin-left: 0;\r\n    position: fixed;\r\n    z-index: 42;\r\n    bottom: 0;\r\n}\r\n\r\n.toast-container ul, .toast-container ul li {\r\n    -webkit-transform: scaleY(-1);\r\n       -moz-transform: scaleY(-1);\r\n        -ms-transform: scaleY(-1);\r\n         -o-transform: scaleY(-1);\r\n            transform: scaleY(-1);\r\n}\r\n\r\n.toast-notification {\r\n    min-width: 200px;\r\n    border-radius: 10px;\r\n    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;\r\n    display: flex;\r\n    flex-direction: row;\r\n    align-items: center;\r\n\r\n    opacity: 0.95;\r\n}\r\n.toast-notification:not(:last-child) { \r\n    margin-bottom: 5px;\r\n }\r\n\r\n.toast-notification.success {\r\n    background-color:#00b894;\r\n}\r\n\r\n.toast-notification.error {\r\n    background-color:#eb3b5a;\r\n}\r\n\r\n.toast-message-container {\r\n    width: 80%;\r\n    padding-top: 8px;\r\n    padding-bottom: 8px;\r\n    padding-left: 20px;\r\n    color: white;\r\n}\r\n\r\n.toast-close-notification {\r\n    width: 20%;\r\n    color: white;\r\n    text-align: center;\r\n    cursor: pointer;\r\n    font-size: 1.5em;\r\n}";

/***/ }),

/***/ 198:
/***/ ((module) => {

module.exports = i18next;

/***/ }),

/***/ 218:
/***/ ((module) => {

module.exports = i18nextBrowserLanguageDetector;

/***/ }),

/***/ 6:
/***/ ((module) => {

module.exports = i18nextHttpBackend;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(156);
/******/ 	
/******/ })()
;