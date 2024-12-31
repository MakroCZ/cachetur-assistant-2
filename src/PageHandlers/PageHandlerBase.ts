import { waitForElement, HTMLStringToElement } from "../utils";
import { Settings } from "../Settings";

import i18next from "i18next";
import { ctApiCall } from "../API";

import { Toast, ToastType } from "../Toast/Toast";

/**
 * "Abstract" base class for individual page handlers (GC cache detail, GC old map, GC new map, PGC, ...)
 */
export abstract class PageHandlerBase {

    protected isPageWithoutMap: boolean = true;
    protected ctID: string = "";
    private headerElement : Element | null = null;


    private _toastContainer: HTMLUListElement | null = null;
    public get toastContainer(): HTMLUListElement {
        if (this._toastContainer === null) {
            throw new Error("Accessing toast container before creation");
        }
        return this._toastContainer;
    }
    public set toastContainer(value: HTMLUListElement | null) {
        this._toastContainer = value;
    }


    private _cachesInTrip: Array<string> = [];
    protected get cachesInTrip(): Array<string> {
        return this._cachesInTrip;
    }
    protected set cachesInTrip(value: Array<string>) {
        this._cachesInTrip = value;
        this.onCacheInTripChanged();
    }

    protected onCacheInTripChanged() {
        for (const gcCode of this.gcCodesOnPage) {
            this.refreshCache(gcCode);
        }
    }

    protected refreshCache(gcCode: string) {
        this.getFoundBy(gcCode);

        if (this.cachesInTrip.includes(gcCode)) {
            this.initInList(gcCode);
        } else {
            this.initNotInList(gcCode);
        }
        const controlContainer = this.controlContainers.get(gcCode);
        if (controlContainer === undefined) {
            throw new Error("Missing control container for " + gcCode);
        }
        controlContainer.addEventListener("click", this.onControlClicked);

        this.getPublicLists(gcCode);
    }


    protected onControlClicked = (event: MouseEvent) => {
        const target = event.target;
        if (target === null) {
            throw new Error("Triggered on control clicked event without target");
        }
        if (!(target instanceof HTMLElement)) {
            throw new Error("Triggered on control clicked event with target not being element");
        }
        if (target.matches(".cachetur-add-code")) {
            this.addCacheToList(target);
        } else if (target.matches(".cachetur-add-comment")) {
            this.addCommentToCache(target);
        } else if ("priority" in target.dataset) {
            this.setPriorityToCache(target);
        }
    }

    private async addCacheToList(infoElement: HTMLElement) {
        const tur = this.tripSelector.value;
        const code = infoElement.dataset.code;
        if (code === undefined) {
            throw new Error("Trying to add cache without GC code in data");
        }

        const data = await ctApiCall("planlagt_add_codes", {
            tur: tur,
            code: code,
        });
        if (data === "Ok") {
            this.cachesInTrip.push(code);
            this.initInList(code);
            const _ = new Toast(`Adding cache ${code} to list succedded`, ToastType.Success, 5000, this.toastContainer); //TODO: Translation
            this.cacheCount.innerHTML = `(${this.cachesInTrip.length})`;
        } else {
            const _ = new Toast(`Adding cache ${code} to list failed`, ToastType.Error, 5000, this.toastContainer); //TODO: Translation
        }

        GM_setValue("cachetur_last_action", Date.now());
    }

    private async setPriorityToCache(infoElement: HTMLElement) {
        const tur = this.tripSelector.value;
        const code = infoElement.dataset.code;
        const priority = infoElement.dataset.priority;

        const data = await ctApiCall("planlagt_set_code_priority", {
            tur: tur,
            code: code,
            priority: priority,
        });
        if (data === "Ok") {
            const _ = new Toast(`Setting priority ${priority} to cache ${code} succedded`, ToastType.Success, 5000, this.toastContainer); //TODO: Translation
        } else {
            const _ = new Toast(`Setting priority ${priority} to cache ${code} failed`, ToastType.Error, 5000, this.toastContainer); //TODO: Translation
        }
        GM_setValue("cachetur_last_action", Date.now());
    }

    private async addCommentToCache(infoElement: HTMLElement) {
        const tur = this.tripSelector.value;
        const code = infoElement.dataset.code;
        const comment = prompt(i18next.t("comments.description"));

        const data = await ctApiCall("planlagt_add_code_comment", {
            tur: tur,
            code: code,
            comment: comment,
        });

        if (data === "Ok") {
            const _ = new Toast(`Extending cache ${code} comment succedded`, ToastType.Success, 5000, this.toastContainer); //TODO: Translation
        } else {
            const _ = new Toast(`Extending cache ${code} comment failed`, ToastType.Error, 5000, this.toastContainer); //TODO: Translation
        }

        GM_setValue("cachetur_last_action", Date.now());
    }

    protected gcCodesOnPage: Array<string> = [];

    protected controlContainers: Map<string, HTMLElement> = new Map<string, HTMLElement>();
    protected foundByContainers: Map<string, HTMLElement> = new Map<string, HTMLElement>();
    protected publicListsContainers: Map<string, HTMLElement> = new Map<string, HTMLElement>();

    protected initInList(gcCode: string) {
        console.log("Init in list default implementation");
    }

    protected initNotInList(gcCode: string) {
        console.log("Init not in list default implementation");
    }

    private async getFoundBy(gcCode: string) {
        const id = this.tripSelector.value;
        console.log("Getting info about friends who found cache: " + gcCode);
        const foundBy = await ctApiCall("planlagt_check_find", {
            tur: id,
            code: gcCode,
        });
        console.log("Info about friends who found cache: " + gcCode + " retrieved (" + foundBy + "), starting injecting");
        this.initFoundBy(gcCode, foundBy);
    }

    protected initFoundBy(gcCode: string, foundBy: string) {
        console.log("Init found by default implementation");
    }

    private async getPublicLists(gcCode: string) {
        const publicLists = await ctApiCall("cache_get_lists", {
            "code": gcCode
        });

        if (publicLists.length <= 0) {
            console.log("Couldn't find any lists or trip templates for the given cache");
            return;
        }

        this.initPublicLists(gcCode, publicLists);
    }

    protected initPublicLists(gcCode: string, lists: any[]) {
        console.log("Init public list default implementaiton");
    }

    private _btnOpenCachetur: HTMLButtonElement | null = null;
    public get btnOpenCachetur(): HTMLButtonElement {
        if (this._btnOpenCachetur === null) {
            throw new Error("Trying to access button open cachetur before setting it");
        }
        return this._btnOpenCachetur;
    }
    public set btnOpenCachetur(value: HTMLButtonElement | null) {
        this._btnOpenCachetur = value;
    }

    private _btnRefreshData: HTMLButtonElement | null = null;
    public get btnRefreshData(): HTMLButtonElement {
        if (this._btnRefreshData === null) {
            throw new Error("Trying to access button refresh data before setting it");
        }
        return this._btnRefreshData;
    }
    public set btnRefreshData(value: HTMLButtonElement | null) {
        this._btnRefreshData = value;
    }

    private _btnShowOnMap: HTMLButtonElement | null = null;
    public get btnShowOnMap(): HTMLButtonElement {
        if (this._btnShowOnMap === null) {
            throw new Error("Trying to access button show on map before setting it");
        }
        return this._btnShowOnMap;
    }
    public set btnShowOnMap(value: HTMLButtonElement | null) {
        this._btnShowOnMap = value;
    }

    private _btnFitMap: HTMLButtonElement | null = null;
    public get btnFitMap(): HTMLButtonElement {
        if (this._btnFitMap === null) {
            throw new Error("Trying to access button fit map before setting it");
        }
        return this._btnFitMap;
    }
    public set btnFitMap(value: HTMLButtonElement | null) {
        this._btnFitMap = value;
    }

    private _tripSelector: HTMLSelectElement | null = null;
    public get tripSelector(): HTMLSelectElement {
        if (this._tripSelector === null) {
            throw new Error("Trying to access trip selector before setting it");
        }
        return this._tripSelector;
    }
    public set tripSelector(value: HTMLSelectElement | null) {
        this._tripSelector = value;
    }

    private _cacheCount: HTMLSpanElement | null = null;
    public get cacheCount(): HTMLSpanElement {
        if (this._cacheCount === null) {
            throw new Error("Trying to access cache count before setting it");
        }
        return this._cacheCount;
    }
    public set cacheCount(value: HTMLSpanElement | null) {
        this._cacheCount = value;
    }




    getCTID(): string {
        return this.ctID;
    }

    getHeaderSelector(): string {
        return "";
    }

    async getHeaderElement(): Promise<Element> {
        if (this.headerElement !== null) {
            return this.headerElement;
        }
        this.headerElement = await waitForElement(this.getHeaderSelector());
        return this.headerElement;
    }

    async prependToHeader(data: string): Promise<void> {
        console.log("Injecting cachetur.no in menu");
        const header = await this.getHeaderElement();
        console.log("After awaiting get header element");

        if (header) {
            console.log("Prepend to header - appending data");
            const fragment = HTMLStringToElement(data);
            header.prepend(fragment);
        }
    }

    prepareToastContainer(): void {
        this.toastContainer = document.createElement("ul");
        this.toastContainer.classList.add("toast-container");
        document.body.appendChild(this.toastContainer);
    }

    async ctInitInactive(): Promise<void> {
        if (Settings.Instance().getInitialized()) {
            console.error("Trying to init inactive second time");
            return;
        }
        console.log("Assistant not being actively used, disabling");

        const dataToPrepend = `<li id="cachetur-header" class="ctRootComponent text-white">
                                    <span class="cachetur-header-text">
                                        <img src="https://cachetur.net/img/logo_top.png" alt="cachetur.no" />
                                        <a href id="cachetur-activate">
                                            ${i18next.t("activate.button")}
                                        </a>
                                    </span>
                                </li>`;


        await this.prependToHeader(dataToPrepend);
        const btnActivate = await waitForElement("#cachetur-activate");

        btnActivate.addEventListener("click", () => {
            GM_setValue("cachetur_last_action", Date.now());
        });

        Settings.Instance().setInitialized(true);
    }

    async getTripsAsOptions(): Promise<string> {
        console.log("Inside getTripsAsOptions, starting");
        const available = await ctApiCall("planlagt_list_editable", {
            includetemplates: "true",
        });
        console.log("Inside getTripsAsOptions, data retrieved");
        let options = "";

        for (let item of available) {
            options += `<option value="${item.id}">${item.turnavn}</option>`;
        }

        return options;
    }

    async initTopBar(): Promise<void> {
        console.log("Init logged in");
        if (Settings.Instance().getInitialized()) {
            console.log("Trying to initialize logged in when already initialized");
            return;
        }

        const trips = await this.getTripsAsOptions();

        const topBarData = `
            <li id="cachetur-header" class="ctRootComponent text-white">
                <img src="https://cachetur.net/img/logo_top.png" title="${i18next.t("menu.loggedinas")} ${Settings.Instance().getUsername()}" />
                ${i18next.t("menu.addto")}
                <select id="cachetur-tur-valg">
                    ${trips}
                </select>
                <button id="cachetur-tur-open" class="cachetur-menu-button" type="button" title="${i18next.t("menu.opentrip")}">
                    <img src="https://cachetur.no/api/img/arrow.png" style="height:16px;"/>
                </button>
                <button id="cachetur-tur-refresh" type="button" class="cachetur-menu-button" title="${i18next.t("menu.refresh")}">
                    <img src="https://cachetur.no/api/img/refresh.png" style="height:16px;"/>
                </button>
                <button id="cachetur-tur-add-ct-caches" type="button" class="cachetur-menu-button" title="${i18next.t("menu.showonmap")}">
                    <img src="https://cachetur.no/api/img/map.png" style="height:16px;"/>
                </button>
                <button id="cachetur-tur-fitbounds" class="cachetur-menu-button" type="button" title="${i18next.t("menu.fitroute")}">
                    <img src="https://cachetur.no/api/img/zoom.png" style="height:16px;"/>
                </button>
                <span id="cachetur-tur-antall-container">
                    (<span id="cachetur-tur-antall"></span>)
                </span>
            </li>`

        await this.prependToHeader(topBarData);

        this.tripSelector = document.getElementById("cachetur-tur-valg") as HTMLSelectElement | null;
        this.btnOpenCachetur = document.getElementById("cachetur-tur-open") as HTMLButtonElement | null;
        this.btnRefreshData = document.getElementById("cachetur-tur-refresh") as HTMLButtonElement | null;
        this.btnShowOnMap = document.getElementById("cachetur-tur-add-ct-caches") as HTMLButtonElement | null;
        this.btnFitMap = document.getElementById("cachetur-tur-fitbounds") as HTMLButtonElement | null;
        this.cacheCount = document.getElementById("cachetur-tur-antall-container") as HTMLSpanElement | null;

        await this.initTopLinks();
    }

    async initSpecific(): Promise<void> {
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
                const value = option.value
                if (value === storedTrip) {
                    isStoredTripInSelection = true;
                    this.tripSelector.value = value;
                    break;
                }
            }
        }

        if (!isStoredTripInSelection) {
            if (selectorOptions.length > 0) {
                const option = selectorOptions.item(0) as HTMLOptionElement;
                storedTrip = option.value;
            } else {
                storedTrip = "0";
            }
            GM_setValue("cachetur_selected_trip", storedTrip);
        }
        this.tripSelector.dispatchEvent(new Event("change"));
    }

    private disableTopLinks(): void {
        this.btnFitMap.disabled = this.isPageWithoutMap;
        this.btnShowOnMap.disabled = this.isPageWithoutMap;
    }

    async ctInitLoggedIn(): Promise<void> {
        if (Settings.Instance().getInitialized()) {
            console.log("Trying to initialize logged when already initialized");
            return;
        }
        console.log("Initializing Cachetur assistant");

        const initTopPromise = this.initTopBar();
        const initSpecificPromise = this.initSpecific();

        await Promise.all([initTopPromise, initSpecificPromise]);

        this.disableTopLinks();
        Settings.Instance().setInitialized(true);
        console.log("Initialization completed");
    }

    async ctInitNotLoggedIn(): Promise<void> {
        console.log("Init not logged in");
        if (Settings.Instance().getInitialized()) {
            console.log("Trying to initialize not logged in when already initialized");
            return;
        }

        const dataToPrepend = `<li id="cachetur-header" class="ctRootComponent text-white">
                                    <span class="cachetur-header-text">
                                        <a href="https://cachetur.no/" target="_blank">
                                            <img src="https://cachetur.net/img/logo_top.png" alt="cachetur.no" />
                                            ${i18next.t("menu.notloggedin")}
                                            <br>
                                            ${i18next.t("menu.deactivated")}
                                        </a>
                                    </span>
                                </li>`

        await this.prependToHeader(dataToPrepend);
        console.log("After awaiting prepend to header");
        Settings.Instance().setInitialized(true);
        console.log("Initialization completed");
    }

    private readonly tripChanged = () => {
        const id = this.tripSelector.value;
        this.ctGetAddedCodes(id);
        this.ctGetShowTripData(id);
        GM_setValue("cachetur_selected_trip", id);
        GM_setValue("cachetur_last_action", Date.now());
    }

    private readonly openTrip = () => {
        const selected = this.tripSelector.value;
        let url = "https://cachetur.no/";
        if (selected.endsWith("L")) {
            url = url + "liste/" + selected.substring(0, selected.length - 1);
        } else if (selected.endsWith("T")) {
            url = url + "template/" + selected.substring(0, selected.length - 1);
        } else {
            url = url + "fellestur/" + selected;
        } 
        
        GM_openInTab(url);
    }
    
    private readonly refreshTrip = async () => {
        console.log("Refreshing list of trips and data for selected trip");
        if (this.tripSelector === null) {
            throw new Error("Trying to access trip option list before creation");
        }
        const id = this.tripSelector.value;
        this.cacheCount.innerText = "Loading"; // TODO: Translatable text
        
        const available = await ctApiCall("planlagt_list_editable", {
            includetemplates: "true",
        });
        
        let options = "";
        
        for (let item of available) {
            options += `<option value="${item.id}">${item.turnavn}</option>`;
        }
        
        this.tripSelector.value = "";
        this.tripSelector.replaceChildren(HTMLStringToElement(options));
        this.tripSelector.value = id;
        
        this.ctGetAddedCodes(id);
        this.ctGetShowTripData(id);
        GM_setValue("cachetur_last_action", Date.now());
        console.log("Finished refreshing list of trips and data for selected trip");
    }
    
    private readonly ctGetAddedCodes = async (id: any) => {
        console.log("Get cache codes in list " + id);
        const codes = await ctApiCall("planlagt_get_codes", {
            tur: id,
            useid: false,
        });
        if (codes.length <= 0) {
            console.log("No caches returned for selected trip");
            return;
        }
        
        this.cachesInTrip = structuredClone(codes);
        this.cacheCount.innerHTML = `(${this.cachesInTrip.length.toString()})`;
    }

    private readonly ctGetShowTripData = async (id: any) => {
        if (!id || id.endsWith("L")) {
            this.btnFitMap.disabled = true;
            return;
        }

        console.log("Attempting to fetch route for selected trip");
        const routeData = await ctApiCall("planlagt_get_route", {
            tur: id,
        });
        if (routeData.length <= 0) {
            console.log("Couldn't find any route for given trip/list");
            this.btnFitMap.disabled = true;
            return;
        }
        console.log("Route data received");

        console.log("Attempting to fetch non caches waypoints for selected trip");
        const waypointData = await ctApiCall("planlagt_get_noncaches", {
            tur: id,
        });
        if (waypointData.length <= 0) {
            console.log("Couldn't find any waypoints for given trip/list");
            return;
        }
        console.log("Waypoints received");

        Settings.Instance().bc.postMessage({
            command: "showTripData",
            data: {
                routeData: routeData,
                waypointData: waypointData
            }
        });

        this.btnFitMap.disabled = this.isPageWithoutMap;
        this.btnShowOnMap.disabled = this.isPageWithoutMap;
    }

    private readonly showCachesOnMap = async () => {
        const id = this.tripSelector.value;
        console.log("Adding caches from cachetur.no " + id);

        console.log("Attempting to fetch cache coordinates for selected trip");
        const cacheData = await ctApiCall("planlagt_get_cachecoordinates", {
            tur: id,
        });
        if (cacheData.length <= 0) {
            console.log("Couldn't find any cache data for given trip/list");
            return;
        }

        console.log("Sending cache data to map connector");
        Settings.Instance().bc.postMessage({
            command: "showCachesOnMap",
            data: cacheData
        });

        this.btnFitMap.disabled = this.isPageWithoutMap;
        this.btnShowOnMap.disabled = this.isPageWithoutMap;
    }

    private readonly fitBounds = () => {
        Settings.Instance().bc.postMessage({
            command: "fitBounds"
        });
    }

    cleanUserStuff(): void {
        const elements = document.getElementsByClassName("ctRootComponent");
        for (const elem of elements) {
            elem.remove();
        }
    }
}