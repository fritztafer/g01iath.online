function error() {
    const statusCode = window.performance.getEntriesByType('navigation')[0].responseStatus ?? "CHECK CONSOLE";

    return Object.assign(document.createElement("div"),{
        className: "error",
        style: "text-align: center; font-size: 18px; visibility: hidden; max-height: 0; overflow: hidden;",
        innerHTML: `HTTP ERROR - ${statusCode}<br><br><a href="/">HOME</a><br><br><a href="mailto:fritz@g01iath.online">fritz@g01iath.online</a>`
    });
}