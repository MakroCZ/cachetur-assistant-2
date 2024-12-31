import { Settings } from "./Settings";

export function ctApiCall(call : string, params: any) : Promise<any> {
    const appId = `Cacheturassistenten ${GM_info.script.version} - ${Settings.Instance().getPageHandler().getCTID()}`;

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
                } catch (e) {
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

function ctInvalidateLogin() {
    Settings.Instance().setUsername("");
    Settings.Instance().getPageHandler().cleanUserStuff();
    Settings.Instance().getPageHandler().ctInitNotLoggedIn();
}