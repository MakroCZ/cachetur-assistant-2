import { CT_PageHandlerBase } from "./CT_PageHandlerBase";

export class CT_RVSites_PageHandler extends CT_PageHandlerBase {
    
    constructor() {
        super();
        this.ctID = "bobil";
    }
    
    getHeaderSelector() {
        return ".navbar-right";
    }
}