import { GC_Cache_PageHandler } from "./PageHandlers/Geocaching/GC_Cache_PageHandler";
import { GC_BrowseMap_PageHandler } from "./PageHandlers/Geocaching/GC_BrowseMap_PageHandler";
import { GC_SearchMap_PageHandler } from "./PageHandlers/Geocaching/GC_SearchMap_PageHandler";
import { GC_BookmarkList_PageHandler } from "./PageHandlers/Geocaching/GC_BookmarkList_PageHandler";
import { GC_Geotour_PageHandler } from "./PageHandlers/Geocaching/GC_Geotour_PageHandler";

import { GSAK_PageHandler } from "./PageHandlers/GSAK/GSAK_PageHandler";

import { PGC_Map_PageHandler } from "./PageHandlers/ProjectGC/PGC_Map_PageHandler";
import { PGC_VirtualGPS_PageHandler } from "./PageHandlers/ProjectGC/PGC_VirtualGPS_PageHandler";

import { CT_Trip_PageHandler } from "./PageHandlers/Cachetur/CT_Trip_PageHandler";
import { CT_RVSites_PageHandler } from "./PageHandlers/Cachetur/CT_RVSites_PageHandler";

import { Settings } from "./Settings";
import { ctApiCall } from "./API";

import toastCSS from "./Styles/Toast.css?raw";
import cacheturCSS from "./Styles/Cachetur.css?raw";

import i18next from 'i18next';
import i18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';
import i18nextHTTPBackend from 'i18next-http-backend';


const pathname = window.location.pathname;
const domain = window.location.hostname;
const href = window.location.href;

let _ctLanguage = "";

// TODO: get public lists handling


window.addEventListener("load", main);

async function main() {
    window.removeEventListener("load", main);
    Settings.Instance().bc = new BroadcastChannel("cachetur-assistant-map-connector");
    console.log("Starting Cacheturassistenten V. " + GM_info.script.version);
    if (domain === "www.geocaching.com") {
        if (pathname.indexOf("/seek/") > -1) {
            Settings.Instance().setPageHandler(new GC_Cache_PageHandler()); // Useless?
        } else if (pathname.indexOf("/plan/lists") > -1) {
            Settings.Instance().setPageHandler(new GC_BookmarkList_PageHandler());
        } else if (pathname.indexOf("/geocache/") > -1) {
            Settings.Instance().setPageHandler(new GC_Cache_PageHandler());
        } else if (pathname.indexOf("/map/") > -1) {
            Settings.Instance().setPageHandler(new GC_BrowseMap_PageHandler());
        } else if (pathname.indexOf("/live/play/map") > -1) {
            Settings.Instance().setPageHandler(new GC_SearchMap_PageHandler());
        } else if (pathname.indexOf("/play/geotours") > -1) {
            Settings.Instance().setPageHandler(new GC_Geotour_PageHandler());
        }
    } else if (href.indexOf("/html/") > -1) {
        Settings.Instance().setPageHandler(new GSAK_PageHandler());
    } else if (pathname.startsWith("/bobilplasser/")) {
        Settings.Instance().setPageHandler(new CT_RVSites_PageHandler());
    } else if (pathname.startsWith("/fellestur/")) {
        Settings.Instance().setPageHandler(new CT_Trip_PageHandler()); // Useless?
    } else if (
        domain === "project-gc.com" &&
        pathname.indexOf("/User/VirtualGPS") > -1 &&
        window.location.search.indexOf("?map=") === -1
    ) {
        Settings.Instance().setPageHandler(new PGC_VirtualGPS_PageHandler());
    } else if (domain === "project-gc.com") {
        Settings.Instance().setPageHandler(new PGC_Map_PageHandler());
    } else {
        throw new Error("Allowed but unsupported page");
    }

    console.log("Running in " + Settings.Instance().getPageHandler().getCTID() + " mode");
    
    await loadTranslations();
    
    
    console.log("Waiting for needed elements defined in page handlers");
    //await _ctPageHandler.waitForNeededElements();
    
    console.log("Page handler has everything to allow init");
    
    ctInit();

    Settings.Instance().getPageHandler().prepareToastContainer();
    GM_addStyle(toastCSS);
    GM_addStyle(cacheturCSS);
    
    //ctStartmenu();
    //document.body.addEventListener("click", onCacheturAddClicked);
}

// TODO: Finish the error handling
async function loadTranslations() {
    try {
        await i18next
            .use(i18nextHTTPBackend)
            .use(i18nextBrowserLanguageDetector)
            .init(
                {
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
                        loadPath:
                            "https://cachetur.no/monkey/language/{{ns}}.{{lng}}.json",
                        crossDomain: true,
                    },
                });
    } catch (err : any) {
        if (err.indexOf("failed parsing") > -1) {
            await i18next.changeLanguage("en");
        }
        console.error("Error occurred when loading language data", err);
        throw err;
        
    }
    console.log(`Translation fetched successfully ${i18next.resolvedLanguage}`);
}

function ctInit() {
    const lastUse = GM_getValue("cachetur_last_action", 0);
    const timeSinceLastUse = (Date.now() - lastUse) / 1000;
    console.log(`The Cachetur Assistant was last used ${timeSinceLastUse} seconds ago`);

    if (timeSinceLastUse > 3600) {
        Settings.Instance().getPageHandler().ctInitInactive();
    } else {
        ctCheckLogin();
    }
}





async function ctCheckLogin() {
    if (Settings.Instance().getInitialized()) {
        console.error("Trying to check login after sucessful initialization");
        return;
    }
    console.log("Checking login");
    let response;
    try {
        response = await ctApiCall("user_get_current", "");
    } catch (e) {
        console.log("Authorization failed: " + e);
        console.log("Not logged in");
        return;
    }
    console.log("Checking login data recieved");
    Settings.Instance().setUsername(response.username);
    _ctLanguage = response.language;
    i18next.changeLanguage(_ctLanguage);
    console.log("Login OK");
    Settings.Instance().getPageHandler().ctInitLoggedIn();
}








// TODO: Move to external file downloaded when starting, as random gorgon
const ambassadorNames = ["Heltinnen", "DougyB", "cghove", "Korsgat", "Don Rodolphos", "platoaddict",
                         "rragan", "twlare", "GorgonVaktmester", "Olet", "footie77", "HikingSeal", 
                         "Vatvedt", "kawlii", "Kittykatch", "anirt", "QuoX", "flower6871", "juliekatrine"];
