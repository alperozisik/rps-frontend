const host = "rps-alperozisik.c9users.io";
const useSecure = true;

const baseUrl = (useSecure ? "https://" : "http://") + host;
const username = "alper";
const password = "rps";

const reFullUrl = /^\w+:\/\/\w+/;

function request(options) {
    return new Promise((resolve, reject) => {
        var url = options.url;
        var q = options.q;
        var method = options.method || "GET";
        var requestBody = options.body || {};

        if (!reFullUrl.test(url)) {
            if (!url.startsWith("/"))
                url = "/" + url;
            url = baseUrl + url;
        }


        if (typeof q === "object") {
            let queryValues = [];
            for (let k in q) {
                queryValues.push(`${encodeURIComponent(k)}=${encodeURIComponent(q[k])}`);
            }
            if (queryValues.length > 0) {
                if (url.indexOf("?") > -1)
                    url += "&";
                else
                    url += "?";
            }
            url += queryValues.join("&");
        }


        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState == xhr.HEADERS_RECEIVED) {
                var contentType = xhr.getResponseHeader("Content-Type");
                if (!contentType.startsWith("application/json")) {
                    xhr.abort();
                    return reject({
                        message: "Invalid Content Type"
                    });
                }
            }
            else if (xhr.readyState == 4 && xhr.status > 0) {
                let responseBody = JSON.parse(xhr.responseText);
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(responseBody);
                }
                else {
                    reject(responseBody);
                }
            }
        };

        xhr.onerror = evnt => {
            reject(evnt);
        };

        xhr.open(method, url, true);

        xhr.setRequestHeader("Authorization", "Basic " + window.btoa(`${username}:${password}`));
        xhr.setRequestHeader("Content-Type", "application/json");

        if (method === "GET" || method === "OPTIONS")
            requestBody = undefined;
        else if (typeof requestBody === "object")
            requestBody = JSON.stringify(requestBody);
        xhr.send(requestBody);
    });
}


export { request, host, useSecure };
