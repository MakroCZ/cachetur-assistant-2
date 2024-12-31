import { PageHandlerBase } from "../PageHandlerBase";

export abstract class GC_PageHandlerBase extends PageHandlerBase {

    getHeaderSelector(): string {
        return ".user-menu";
    }
}