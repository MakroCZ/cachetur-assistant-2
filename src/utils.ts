export function waitForElement(selector : any) : Promise<Element> {
    return new Promise((resolve) => {
        console.log("Creating promise for waitForElement with selector: ", selector);
        const element = document.querySelector(selector);
        if (element) {
            console.log("Element already in DOM");
            return resolve(element);
        }

        console.log("Creating observer for waitForElement with selector: ", selector);
        const observer = new MutationObserver((mutationList) => {
            console.log("Observed data getting processed for selector: ", selector);
            // Main performance friendly solution
            for (const mutation of mutationList) {
                if (mutation.target instanceof Element) {
                    if (mutation.target.matches(selector)) {
                        console.log("Requested element found using target ", selector);
                        observer.disconnect();
                        return resolve(mutation.target);
                    }

                }
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === node.ELEMENT_NODE) {
                        const element = node as Element;
                        if (element.matches(selector)) {
                            console.log("Requested element found in addedNodes ", selector);
                            observer.disconnect();
                            return resolve(element);
                        }
                    }
                }
            }
            
            console.log("Observed data didn't contain requested data for selector: ", selector);
            // Backup solution for possible race condition
            // between page script context and user-script sand-box context
            const element = document.querySelector(selector);
            if (element) {
                console.log("Requested element already in DOM ", selector);
                observer.disconnect();
                return resolve(element);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
}

export function HTMLStringToElement(string : string) {
    const template = document.createElement("template");
    string = string.trim();
    template.innerHTML = string;
    return template.content;
}

// trailing debounce, thanks zspec
function debounce<F extends (...args: any[]) => any>(func: F, wait: number) {
    let timeoutId: number | undefined;
    return function debounced(this: ThisParameterType<F>, ...args: Parameters<F>) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(func.bind(this), wait, ...args);
    };
}

