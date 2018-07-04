const pages = new Map();

var currentPageName;

const router = {
    add: (name, page) => {
        let pageInstance = page;
        pageInstance.component.style.display = "none";
        pages.set(name, pageInstance);
        document.body.appendChild(pageInstance.component);
        pageInstance.emit("init");
    },

    go: (name, data = {}) => {
        if (name === currentPageName)
            return;
        let newPage = pages.get(name);
        let oldPage = pages.get(currentPageName);
        if (oldPage) {
            oldPage.component.style.display = "none";
            oldPage.emit("hide");
        }
        currentPageName = name;
        newPage.component.style.display = "";
        newPage.emit("show", data);
        
    }
};


export default router;
