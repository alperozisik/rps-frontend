export default function component(innerHtml) {
    const isTabular = isTabularElement(innerHtml);
    const parent = document.createElement(isTabular ? 'table' : 'div');
    parent.innerHTML = innerHtml;
    var element;
    if (isTabular && parent.firstChild.tagName === "TBODY") {
        element = parent.firstChild.firstChild;
    }
    else
        element = parent.firstChild;

    return element;
}

const tabularElements = ["tr"];

const isTabularElement = (innerHtml) => {
    let val = innerHtml.trim().substr(1).toLowerCase();
    for (let tag of tabularElements) {
        if (val.startsWith(tag))
            return true;
    }
    return false;
};
