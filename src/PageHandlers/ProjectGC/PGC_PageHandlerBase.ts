import { PageHandlerBase } from "../PageHandlerBase";

export abstract class PGC_PageHandlerBase extends PageHandlerBase {
    
    getHeaderSelector(): string {
        return "#pgcMainMenu ul.navbar-right";
    }

}