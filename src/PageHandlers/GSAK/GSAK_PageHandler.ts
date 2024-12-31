import { PageHandlerBase } from "../PageHandlerBase";

export class GSAK_PageHandler extends PageHandlerBase {
    constructor() {
        super();
        this.ctID = "gsak";
    }

    getHeaderSelector() {
        return ".leaflet-control-scale";
    }
}