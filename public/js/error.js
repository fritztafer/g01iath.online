async function error() {
    const code = window.performance.getEntriesByType('navigation')[0].responseStatus;
    const message = code ? (() => {
        const status = {
            200: "OK",
            400: "BAD REQUEST",
            401: "UNAUTHORIZED",
            402: "PAYMENT REQUIRED",
            403: "FORBIDDEN",
            404: "NOT FOUND",
            405: "METHOD NOT ALLOWED",
            406: "NOT ACCEPTABLE",
            407: "PROXY AUTHENTICATION REQUIRED",
            408: "REQUEST TIMEOUT",
            409: "CONFLICT",
            410: "GONE",
            411: "LENGTH REQUIRED",
            412: "PRECONDITION FAILED",
            413: "PAYLOAD TOO LARGE",
            414: "URI TOO LONG",
            415: "UNSUPPORTED MEDIA TYPE",
            416: "RANGE NOT SATISFIABLE",
            417: "EXPECTATION FAILED",
            421: "MISDIRECTED REQUEST",
            422: "UNPROCESSABLE ENTITY",
            423: "LOCKED",
            424: "FAILED DEPENDENCY",
            426: "UPGRADE REQUIRED",
            428: "PRECONDITION REQUIRED",
            429: "TOO MANY REQUESTS",
            431: "REQUEST HEADER FIELDS TOO LARGE",
            451: "UNAVAILABLE FOR LEGAL REASONS ",
            500: "INTERNAL SERVER ERROR",
            501: "NOT IMPLEMENTED",
            502: "BAD GATEWAY",
            503: "SERVICE UNAVAILABLE",
            504: "GATEWAY TIMEOUT",
            505: "HTTP VERSION NOT SUPPORTED",
            506: "VARIANT ALSO NEGOTIATES",
            507: "INSUFFICIENT STORAGE",
            508: "LOOP DETECTED",
            510: "NOT EXTENDED",
            511: "NETWORK AUTHENTICATION REQUIRED"
        };
        return `${code} ${status[code] || "UNDEFINED STATUS"}`;
    })() : "HTTP ERROR CHECK CONSOLE";

    return Object.assign(document.createElement("div"),{
        className: "error",
        style: "text-align: center; font-size: 18px; visibility: hidden; max-height: 0; overflow: hidden;",
        innerHTML: `${message}<br><br><a href="/">HOME</a><br><br><a href="mailto:info@g01iath.online">info@g01iath.online</a>`
    });
}