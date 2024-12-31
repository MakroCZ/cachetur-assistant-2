import { HTMLStringToElement } from "../../utils";
import { GC_PageHandlerBase } from "./GC_PageHandlerBase";
import i18next from "i18next";

export class GC_Cache_PageHandler extends GC_PageHandlerBase {

    constructor() {
        super();
        this.ctID = "gc_geocache";

        const gcCodeElem = document.getElementById("ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode");
        if (gcCodeElem === null) {
            throw new Error("Trying to read GC code on cache page before load");
        }
        this.gcCodesOnPage.push(gcCodeElem.innerHTML);
    }

    async initSpecific(): Promise<void> {
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

    initInList(gcCode : string) {
        console.log("Injecting cachetur menu to geocache page in list");

        const controlContainer = this.controlContainers.get(gcCode);
        if (controlContainer === undefined) {
            throw new Error("Missing control container for " + gcCode);
        }
        controlContainer.replaceChildren();

        // generate priority control
        for (let i = 1; i <= 3; i++) {
            const control = HTMLStringToElement(`
                <li>
                    <a class="cachetur-set-pri-${i}" style="cursor:pointer"
                        data-code="${gcCode}" data-priority="${i}">
                            ${i18next.t("priority.set" + i)}
                    </a>
                </li>`);
        
            controlContainer.appendChild(control);
        }

        // generate comment control
        const toAdd = HTMLStringToElement(`
            <li>
                <a class="cachetur-add-comment" data-code="${gcCode}">
                    ${i18next.t("comments.add")}
                </a>
            </li>`);
        controlContainer.append(toAdd);
    }

    initNotInList(gcCode : string) {
        console.log("Injecting cachetur menu to geocache page not in list");

        const stringElem = `
            <li>
                <a class="cachetur-add-code"
                    style="cursor: pointer;"
                    data-code="${gcCode}">
                        ${i18next.t("send")}
                </a>
            </li>`;

        const elemToAdd = HTMLStringToElement(stringElem);
        const controlContainer = this.controlContainers.get(gcCode);
        if (controlContainer === undefined) {
            throw new Error("Missing control container for " + gcCode);
        }
        controlContainer.replaceChildren(elemToAdd);
    }

    initFoundBy(gcCode : string, foundBy: string) {
        const dataElement = HTMLStringToElement(`
                <li>
                    <b>
                        <img src="https://cachetur.no/api/img/attfind.png" />
                        ${i18next.t("foundby")}
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

    initPublicLists(gcCode: string, lists: any[]) {
        console.log("Injecting list of lists");

        let alternate = false;

        //TODO: Check container classes
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
                classList += "AlternatingRow"; //TODO: Check css origin
            }

            let listElement = `<li class="${classList}">${link}<br>${i18next.t('template.by')} ${list.owner}</li>`;
            alternate = !alternate;
            listHtml += listElement;

        }

        listHtml += `</ul></div>`;
        const publicListContainer = this.publicListsContainers.get(gcCode);
        if (publicListContainer === undefined) {
            throw new Error("Public list container not found");
        }
        const publicListElem = HTMLStringToElement(listHtml);
        publicListContainer.replaceChildren(publicListElem);
    }

}