import { HTMLStringToElement, waitForElement } from "../../utils";
import { PGC_PageHandlerBase } from "./PGC_PageHandlerBase";

import i18next from "i18next";

export class PGC_Map_PageHandler extends PGC_PageHandlerBase {
    constructor() {
        super();
        this.ctID = "pgc_map";
        this.isPageWithoutMap = false;
    }

    async initSpecific(): Promise<void> {
        const infoPaneElem = await waitForElement("#map > div.leaflet-map-pane > div.leaflet-objects-pane > div.leaflet-popup-pane");
        if (infoPaneElem === null) {
            throw new Error("Map not yet initialized properly to get popup pane");
        }

        const infoMutationObserver = new MutationObserver(this.onInfoPaneMutated);
        infoMutationObserver.observe(infoPaneElem, {
            childList: true,
            subtree: true,
        });
    }


    private onInfoPaneMutated = (mutations: MutationRecord[]) => {
        //TODO: Removed
        for (const mutationRecord of mutations) {
            if (!(mutationRecord.target instanceof HTMLElement)) {
                continue
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
                continue
            }
            if (mutationRecord.target.className === "leaflet-popup-pane" && mutationRecord.addedNodes.length > 0) {
                this.addCacheInfo(mutationRecord.target);
            }
        }
    }

    private addCacheInfo(parentElement: Element) {
        const alreadyProcessed = parentElement.querySelector(".cachetur-row");
        if (alreadyProcessed !== null) {
            alreadyProcessed.remove();
        }
        const gcCodeContent = parentElement.querySelector(".leaflet-popup-content");
        if (gcCodeContent === null) {
            throw new Error("Missing GC code section");
        }
        const gcCode = this.extractGCCode(gcCodeContent);

        const contentWrapper = parentElement.querySelector(".leaflet-popup-content-wrapper")
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

    private removeCacheInfo(parentElement: Element) {
        const gcCodeContent = parentElement.querySelector(".leaflet-popup-content");
        if (gcCodeContent === null) {
            throw new Error("Missing GC code section");
        }
        const gcCode = this.extractGCCode(gcCodeContent);

        this.gcCodesOnPage.splice(this.gcCodesOnPage.indexOf(gcCode), 1);
        this.controlContainers.delete(gcCode);
        this.foundByContainers.delete(gcCode);
    }

    private extractGCCode(gcCodeContent: Element): string {
        const gcCodeStr = gcCodeContent.children[0].getAttribute("href");
        const gcCode = gcCodeStr?.substring(gcCodeStr.lastIndexOf("/") + 1);
        if (gcCode === undefined) {
            throw new Error("Parsing GC code failed");
        }
        return gcCode;
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
}