const BlogTemplate = () => {
  const globalClasses = window.themeCore.utils.cssClasses;
  const selectors = {
    section: ".js-blog",
    grid: ".js-blog-grid",
    filter: ".js-filter",
    filterLink: ".js-filter-link",
    resetLink: ".js-filter-reset",
    pagination: ".js-pagination",
    paginationLink: ".js-pagination-link",
    infiniteScroll: ".js-infinite-scroll",
    lazyLoad: ".js-lazy-load",
    pageLoader: ".js-page-preloader"
  };
  const classes = {
    noEvents: "no-events",
    ...globalClasses
  };
  const section = document.querySelector(selectors.section);
  const pageLoader = document.querySelector(selectors.pageLoader);
  const nodes = {
    grid: section.querySelector(selectors.grid),
    filter: section.querySelector(selectors.filter),
    filterLinks: [...section.querySelectorAll(selectors.filterLink)],
    resetLink: section.querySelector(selectors.resetLink),
    pagination: section.querySelector(selectors.pagination),
    lazyLoad: section.querySelector(selectors.lazyLoad),
    infiniteScroll: section.querySelector(selectors.infiniteScroll)
  };
  let infinityScrollObserver = null;
  async function paginationClickHandler(event) {
    const paginationLink = event.target.closest(selectors.paginationLink);
    if (!paginationLink) {
      return;
    }
    event.preventDefault();
    paginationLink.classList.add(classes.noEvents);
    window.scrollTo(0, 0);
    await rerenderTemplate(paginationLink.href);
    window.history.pushState({}, null, paginationLink.href);
  }
  async function filterClickHandler(event) {
    const filterLink = event.target.closest(selectors.filterLink);
    const resetLink = event.target.closest(selectors.resetLink);
    if (!filterLink && !resetLink) {
      return;
    }
    event.preventDefault();
    const lastActiveFilterLink = nodes.filterLinks.find(
      (filterLink2) => filterLink2.classList.contains(classes.active)
    ) || nodes.resetLink;
    if (filterLink) {
      filterLink.classList.add(classes.noEvents);
      if (filterLink.classList.contains(classes.active)) {
        filterLink.classList.remove(classes.active);
        await resetLinkEvent();
        filterLink.classList.remove(classes.noEvents);
        return;
      }
      lastActiveFilterLink.classList.remove(classes.active);
      filterLink.classList.add(classes.active);
      filterLink.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
      });
      await rerenderTemplate(filterLink.href);
      window.history.pushState({}, null, filterLink.href);
      filterLink.classList.remove(classes.noEvents);
      nodes.resetLink.setAttribute("tabindex", "0");
      return;
    }
    if (resetLink && !resetLink.classList.contains(classes.active)) {
      lastActiveFilterLink.classList.remove(classes.active);
      await resetLinkEvent();
    }
  }
  async function loadMoreClickHandler(event) {
    const lazyLoad = event.target.closest(selectors.lazyLoad);
    if (!lazyLoad) {
      return;
    }
    lazyLoad.classList.add(classes.noEvents);
    const url = window.location.origin + lazyLoad.dataset.nextUrl;
    await updateTemplate(url);
  }
  async function resetLinkEvent() {
    nodes.resetLink.classList.add(classes.noEvents, classes.active);
    nodes.resetLink.setAttribute("tabindex", "-1");
    await rerenderTemplate(nodes.resetLink.href);
    window.history.pushState({}, null, nodes.resetLink.href);
    nodes.resetLink.classList.remove(classes.noEvents);
  }
  async function rerenderTemplate(url) {
    nodes.grid.ariaBusy = "true";
    pageLoader.classList.add(classes.active);
    const requestURL = getSectionIdURL(url, section.id);
    const newNodes = await fetchNodes(requestURL);
    setHTML(newNodes);
    window.themeCore.LazyLoadImages.init();
    pageLoader.classList.remove(classes.active);
    nodes.grid.ariaBusy = "false";
  }
  function getSectionIdURL(link, sectionId = section.id) {
    const url = new URL(link);
    url.searchParams.set("section_id", sectionId);
    return url.toString();
  }
  async function fetchNodes(url) {
    const response = await fetch(url);
    const responseText = await response.text();
    const responseHTML = new DOMParser().parseFromString(
      responseText,
      "text/html"
    );
    return {
      grid: responseHTML.querySelector(selectors.grid),
      pagination: responseHTML.querySelector(selectors.pagination),
      infiniteScroll: responseHTML.querySelector(
        selectors.infiniteScroll
      ),
      lazyLoad: responseHTML.querySelector(selectors.lazyLoad)
    };
  }
  function setHTML({ grid, pagination, infiniteScroll, lazyLoad }) {
    if (!grid && !pagination && !infiniteScroll && !lazyLoad) {
      return;
    }
    nodes.grid.innerHTML = grid.innerHTML;
    unobserve(nodes.infiniteScroll);
    replaceNodes({ pagination, infiniteScroll, lazyLoad });
    infiniteScroll && initIntersectionObserver(infiniteScroll);
  }
  function replaceNodes(newNodes) {
    if (!newNodes || !Object.keys(newNodes).length) {
      return;
    }
    for (const newNodeName in newNodes) {
      if (nodes[newNodeName]) {
        nodes[newNodeName].replaceWith(newNodes[newNodeName]);
        nodes[newNodeName] = newNodes[newNodeName];
      }
    }
  }
  async function popStateEvent() {
    const url = window.location.href;
    const lastActiveFilterLink = nodes.filterLinks.find(
      (filterLink) => filterLink.classList.contains(classes.active)
    ) || nodes.resetLink;
    const newActiveFilterLink = nodes.filterLinks.find(
      (filterLink) => url.includes(filterLink.href)
    ) || nodes.resetLink;
    lastActiveFilterLink !== newActiveFilterLink && lastActiveFilterLink.classList.remove(classes.active);
    await rerenderTemplate(url);
    lastActiveFilterLink !== newActiveFilterLink && newActiveFilterLink.classList.add(classes.active);
  }
  function initIntersectionObserver(infiniteScroll) {
    infinityScrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(async (entry) => {
          if (entry.isIntersecting) {
            await unobserveAndUpdateTemplate(infiniteScroll);
          }
        });
      },
      { threshold: 0.25 }
    );
    infinityScrollObserver.observe(infiniteScroll);
  }
  function unobserve(infiniteScroll) {
    infiniteScroll && infinityScrollObserver && infinityScrollObserver.unobserve(infiniteScroll);
  }
  async function unobserveAndUpdateTemplate(infiniteScroll) {
    unobserve(infiniteScroll);
    const url = window.location.origin + infiniteScroll.dataset.nextUrl;
    await updateTemplate(url);
  }
  async function updateTemplate(nextPageLink) {
    pageLoader.classList.add(classes.active);
    const url = getSectionIdURL(nextPageLink, section.id);
    const { grid, infiniteScroll, lazyLoad } = await fetchNodes(url);
    nodes.grid.insertAdjacentHTML("beforeend", grid.innerHTML);
    unobserve(nodes.infiniteScroll);
    replaceNodes({ infiniteScroll, lazyLoad });
    infiniteScroll && initIntersectionObserver(infiniteScroll);
    window.themeCore.LazyLoadImages.init();
    pageLoader.classList.remove(classes.active);
  }
  function init() {
    nodes.pagination && section.addEventListener("click", paginationClickHandler);
    nodes.filter && section.addEventListener("click", filterClickHandler);
    nodes.lazyLoad && section.addEventListener("click", loadMoreClickHandler);
    if (nodes.filter || nodes.pagination) {
      window.addEventListener("popstate", popStateEvent);
    }
    nodes.infiniteScroll && initIntersectionObserver(nodes.infiniteScroll);
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.BlogTemplate = window.themeCore.BlogTemplate || BlogTemplate();
  window.themeCore.utils.register(window.themeCore.BlogTemplate, "blog-template");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  if (window.themeCore && window.themeCore.loaded) {
    action();
  } else {
    document.addEventListener("theme:all:loaded", action, { once: true });
  }
}
