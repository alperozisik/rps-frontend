module.exports = `

var isIE = (window.navigator.userAgent.indexOf("MSIE") != -1);
window.notSupported = !!(isIE);
if (window.notSupported) {
    document.body.innerHTML =
        '<h1>Browser not supported</h1>' +
        'Please use different browser.';
}
`;