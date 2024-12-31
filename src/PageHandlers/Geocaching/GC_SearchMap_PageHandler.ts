import { GC_PageHandlerBase } from "./GC_PageHandlerBase";
import i18next from "i18next";
import { HTMLStringToElement, waitForElement } from "../../utils";

export class GC_SearchMap_PageHandler extends GC_PageHandlerBase {

    constructor() {
        super();
        this.ctID = "gc_map_new";
        this.isPageWithoutMap = false;
    }

    async initSpecific(): Promise<void> {
        const sidebar = await waitForElement("#sidebar");
        if (sidebar === null) {
            throw new Error("Map not yet initialized properly to get popup pane");
        }

        const infoMutationObserver = new MutationObserver(this.onInfoPaneMutated);
        infoMutationObserver.observe(sidebar, {
            childList: true,
            subtree: true,
        });
    }


    private mutationsProcessRemoveOverview(mutations: MutationRecord[]) {
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

    private mutationsProcessAddOverview(mutations: MutationRecord[]) {
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

    private mutationsProcessRemoveDetail(mutations: MutationRecord[]) {
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

    private mutationsProcessAddDetail(mutations: MutationRecord[]) {
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

    private readonly onInfoPaneMutated = (mutations: MutationRecord[]) => {
        // If opening cache detail
        if (mutations.length > 1) {
            this.mutationsProcessRemoveDetail(mutations);
            this.mutationsProcessAddDetail(mutations);
        }
    }

    private addCacheInfoDetail(parentElement: Element) {
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
        publicListsContainer.appendChild(HTMLStringToElement(publicListsContainerHeaderString));


        cacheturContainer.appendChild(publicListsContainer);
        cacheturContainer.appendChild(twoColumnDiv);

        containerElem.insertBefore(cacheturContainer, containerElem.childNodes[2]);


        this.gcCodesOnPage.push(gcCode);
        this.refreshCache(gcCode);
    }

    private addCacheInfoOverview(parentElement: Element) {
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

    private removeCacheInfoDetail(parentElement: Element) {
        const gcCodeElem = parentElement.querySelector(".cache-metadata-code");
        if (gcCodeElem === null) {
            throw new Error("Missing GC code section");
        }
        const gcCode = gcCodeElem.innerHTML;

        this.gcCodesOnPage.splice(this.gcCodesOnPage.indexOf(gcCode), 1);
        this.controlContainers.delete(gcCode);
        this.foundByContainers.delete(gcCode);
    }

    initInList(gcCode: string) {
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

    initNotInList(gcCode: string) {
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

    initFoundBy(gcCode: string, foundBy: string) {
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

            let listElement = `<li class="cachetur-spaced-li">${link} ${i18next.t('template.by')} ${list.owner}</li>`;
            listHtml += listElement;

        }

        listHtml += `</ul>`;
        const publicListContainer = this.publicListsContainers.get(gcCode);
        if (publicListContainer === undefined) {
            throw new Error("Public list container not found");
        }
        const publicListElem = HTMLStringToElement(listHtml);
        publicListContainer.replaceChildren(publicListElem);
    }

}