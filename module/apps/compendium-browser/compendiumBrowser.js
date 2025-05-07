import { ItemSR } from "../../item/ItemSR.js";
import { getSelectedOrOwnActors, objectHasKey } from "../../utils/utils.js";
import { PackLoader } from "./PackLoader.js";
import * as browserTabs from "./tabs/index.js";

export class compendiumBrowser extends foundry.applications.api.ApplicationV2 {
  constructor(options = {}) {
    super(options),
      (this.dataTabsList = ["abilities", "bestiary", "acquis", "races", "castes", "people", "jobs"]),
      (this.packLoader = new PackLoader()),
      (this.settings = game.settings.get("shaanrenaissance", "compendiumBrowserPacks")),
      (this.navigationTab = this.hookTab()),
      (this.tabs = {
        abilities: new browserTabs.Abilities(this),
        bestiary: new browserTabs.Bestiary(this),
        acquis: new browserTabs.Acquis(this),
        races: new browserTabs.Races(this),
        people: new browserTabs.People(this),
        jobs: new browserTabs.Jobs(this),
        castes: new browserTabs.Castes(this),
      }),
      this.initCompendiumList();
  }
  get title() {
    return game.i18n.localize("SR.CompendiumBrowser.Title");
  }
  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      id: "compendium-browser",
      classes: [],
      template: "systems/shaanrenaissance/templates/compendium-browser/compendium-browser.hbs",
      width: 800,
      height: 700,
      resizable: !0,
      dragDrop: [
        {
          dragSelector: "ul.item-list > li.item",
        },
      ],
      tabs: [
        {
          navSelector: "nav",
          contentSelector: "section.content",
          initial: "landing-page",
        },
        {
          navSelector: "nav[data-group=settings]",
          contentSelector: ".settings-container",
          initial: "packs",
        },
      ],
      scrollY: [".control-area", ".item-list", ".settings-container"],
    };
  }
  async close(options) {
    // for (const tab of Object.values(this.tabs)) tab.filterData.search.text = "";
    await super.close(options);
  }
  hookTab() {
    console.log(this)
    const navigationTab = this._tabs[0],
      tabCallback = navigationTab.callback;
    return (
      (navigationTab.callback = async (event, tabs, active) => {
        null == tabCallback || tabCallback(event, tabs, active), await this.loadTab(active);
      }),
      navigationTab
    );
  }
  initCompendiumList() {
    const settings = {
      abilities: {},
      bestiary: {},
      acquis: {},
      castes: {},
      people: {},
      jobs: {},
      races: {},
    };

    const loadDefault = {
      "shaanrenaissance.pouvoirs": true,
      "shaanrenaissance.acquis": true,
      "shaanrenaissance.metiers": true,
      "shaanrenaissance.castes": true,
      "shaanrenaissance.peuples": true,
      "shaanrenaissance.races": true,
      "shaanrenaissance.bestiary": true,
    };

    const loadPack = (category, collection, label) => {
      const load = this.settings[category]?.[collection]?.load ?? loadDefault[collection];
      settings[category][collection] = { load, name: label };
    };

    for (const pack of game.packs) {
      const types = new Set(pack.index.map((entry) => entry.type));
      const label = pack.metadata.label;
      const collection = pack.collection;

      if (types.size !== 0) {
        if (types.has("Pouvoir")) {
          loadPack("abilities", collection, label);
        }
        if (types.has("Caste")) {
          loadPack("castes", collection, label);
        }
        if (types.has("Métier")) {
          loadPack("jobs", collection, label);
        }
        if (types.has("Race")) {
          loadPack("races", collection, label);
        }
        if (types.has("Peuple")) {
          loadPack("people", collection, label);
        }
        if (
          [
            "Armement",
            "Armimale",
            "Artefact",
            "Manuscrit",
            "Outil",
            "Protection",
            "Relation",
            "Richesse",
            "Technologie",
            "Transport",
            "Bâtiment",
          ].some((type) => types.has(type))
        ) {
          loadPack("acquis", collection, label);
        }
        if (types.has("Créature") || types.has("PNJ")) {
          loadPack("bestiary", collection, label);
        }
      }
    }

    for (const tab of this.dataTabsList) {
      settings[tab] = Object.fromEntries(
        Object.entries(settings[tab]).sort(([, dataA], [, dataB]) => {
          const nameA = dataA.name ?? "";
          const nameB = dataB.name ?? "";
          return nameA.localeCompare(nameB);
        })
      );
    }

    this.settings = settings;
  }

  async openTab(tabName, filter) {
    return (this.activeTab = tabName), "settings" !== tabName && filter ? this.tabs[tabName].open(filter) : this.loadTab(tabName);
  }

  async loadTab(tabName) {
    if (((this.activeTab = tabName), "settings" === tabName)) return void (await this.render(!0));
    if (!this.dataTabsList.includes(tabName)) return ui.notifications.warn(`Unknown tab "${tabName}"`);
    const currentTab = this.tabs[tabName];
    currentTab.isInitialized || (await currentTab.init()),
      await this.render(!0, {
        focus: !0,
      });
  }
  loadedPacks(tab) {
    var _a;
    return "settings" === tab
      ? []
      : Object.entries(null !== (_a = this.settings[tab]) && void 0 !== _a ? _a : []).flatMap(([collection, info]) =>
          (null == info ? void 0 : info.load) ? [collection] : []
        );
  }
  activateListeners($html) {
    var _a, _b, _c;
    super.activateListeners($html);
    const html = $html[0],
      activeTabName = this.activeTab;
    if (
      (this.navigationTab.active !== activeTabName && this.navigationTab.activate(activeTabName), "settings" === activeTabName)
    ) {
      const form = html.querySelector(".compendium-browser-settings form");
      return void (
        form &&
        (null === (_a = form.querySelector("button.save-settings")) ||
          void 0 === _a ||
          _a.addEventListener("click", async () => {
            const formData = new FormData(form);
            for (const [t, packs] of Object.entries(this.settings))
              for (const [key, pack] of Object.entries(packs)) pack.load = formData.has(`${t}-${key}`);
            await game.settings.set("shaanrenaissance", "compendiumBrowserPacks", this.settings);
            for (const tab of Object.values(this.tabs)) tab.isInitialized && (await tab.init(), (tab.scrollLimit = 100));
            this.render(!0);
          }))
      );
    }
    const currentTab = this.tabs[activeTabName],
      controlArea = html.querySelector("div.control-area");
    if (!controlArea) return;
    const search = controlArea.querySelector("input[name=textFilter]");
    search &&
      search.addEventListener("input", () => {
        (currentTab.filterData.search.text = search.value),
          this.clearScrollLimit(),
          this.renderResultList({
            replace: !0,
          });
      });
    const sortContainer = controlArea.querySelector("div.sortcontainer");
    if (sortContainer) {
      const order = sortContainer.querySelector("select.order");
      order &&
        order.addEventListener("change", () => {
          var _a;
          const orderBy = null !== (_a = order.value) && void 0 !== _a ? _a : "name";
          (currentTab.filterData.order.by = orderBy), this.clearScrollLimit(!0);
        });
      const directionAnchor = sortContainer.querySelector("a.direction");
      directionAnchor &&
        directionAnchor.addEventListener("click", () => {
          var _a;
          const direction = null !== (_a = directionAnchor.dataset.direction) && void 0 !== _a ? _a : "asc";
          (currentTab.filterData.order.direction = "asc" === direction ? "desc" : "asc"), this.clearScrollLimit(!0);
        });
    }
    null === (_b = controlArea.querySelector("button.clear-filters")) ||
      void 0 === _b ||
      _b.addEventListener("click", () => {
        this.resetFilters(), this.clearScrollLimit(!0);
      });
    // Create Roll Table button
    const createRollTableButton = document.querySelector("[data-action=create-roll-table]");
    if (createRollTableButton) {
      createRollTableButton.addEventListener("click", () => {
        currentTab.createRollTable();
      });
    }

    // Add to Roll Table button
    const addToRollTableButton = document.querySelector("[data-action=add-to-roll-table]");
    if (addToRollTableButton) {
      addToRollTableButton.addEventListener("click", async () => {
        if (!game.tables.contents.length) return;
        currentTab.addToRollTable();
      });
    }

    const filterContainers = controlArea.querySelectorAll("div.filtercontainer");
    for (const container of Array.from(filterContainers)) {
      const { filterType, filterName } = container.dataset;
      null === (_c = container.querySelector("button[data-action=clear-filter]")) ||
        void 0 === _c ||
        _c.addEventListener("click", (event) => {
          switch ((event.stopImmediatePropagation(), filterType)) {
            case "checkboxes": {
              const checkboxes = currentTab.filterData.checkboxes;
              if ((0, objectHasKey)(checkboxes, filterName)) {
                for (const option of Object.values(checkboxes[filterName].options)) option.selected = !1;
                (checkboxes[filterName].selected = []), this.render(!0);
              }
              break;
            }
            case "ranges":
              if (currentTab.isOfType("acquis")) {
                const ranges = currentTab.filterData.ranges;
                (0, objectHasKey)(ranges, filterName) &&
                  ((ranges[filterName].values = currentTab.defaultFilterData.ranges[filterName].values),
                  (ranges[filterName].changed = !1),
                  this.render(!0));
              }
          }
        });
      const title = container.querySelector("div.title");
    }

    const list = html.querySelector(".tab.active ul.item-list");
    list &&
      (list.addEventListener("scroll", () => {
        var _a;
        if (list.scrollTop + list.clientHeight >= list.scrollHeight - 5) {
          const currentValue = currentTab.scrollLimit,
            maxValue = null !== (_a = currentTab.totalItemCount) && void 0 !== _a ? _a : 0;
          currentValue < maxValue &&
            ((currentTab.scrollLimit = Math.clamp(currentValue + 100, 100, maxValue)),
            this.renderResultList({
              list,
              start: currentValue,
            }));
        }
      }),
      this.renderResultList({
        list,
      }));
  }
  async renderResultList({ list, start = 0, replace = !1 }) {
    const currentTab = "settings" !== this.activeTab ? this.tabs[this.activeTab] : null,
      html = this.element[0];
    if (!currentTab) return;
    if (!list) {
      const listElement = html.querySelector(".tab.active ul.item-list");
      if (!listElement) return;
      list = listElement;
    }
    const newResults = await currentTab.renderResults(start);
    this.activateResultListeners(newResults);
    const fragment = document.createDocumentFragment();
    fragment.append(...newResults), replace ? list.replaceChildren(fragment) : list.append(fragment);
    for (const dragDropHandler of this._dragDrop) dragDropHandler.bind(html);
  }
  activateResultListeners(liElements = []) {
    var _a, _b;
    for (const liElement of liElements) {
      const { entryUuid } = liElement.dataset;
      if (!entryUuid) continue;
      const nameAnchor = liElement.querySelector("div.name > a");
      nameAnchor &&
        nameAnchor.addEventListener("click", async () => {
          const document = await fromUuid(entryUuid);
          (null == document ? void 0 : document.sheet) && document.sheet.render(!0);
        }),
        "acquis" === this.activeTab &&
          (null === (_a = liElement.querySelector("a[data-action=take-item]")) ||
            void 0 === _a ||
            _a.addEventListener("click", () => {
              this.takeAcquisItem(entryUuid);
            }),
          null === (_b = liElement.querySelector("a[data-action=buy-item]")) ||
            void 0 === _b ||
            _b.addEventListener("click", () => {
              this.buyAcquisItem(entryUuid);
            }));
    }
  }
  async takeAcquisItem(uuid) {
    const actors = (0, getSelectedOrOwnActors)(["Personnage", "PNJ", "Créature", "Shaani", "Réseau", "Loot"]),
      item = await this.getAcquisItem(uuid);
    if (0 !== actors.length) {
      for (const actor of actors) await actor.createEmbeddedDocuments("Item", [item.toObject()]);
      1 === actors.length && game.user.character && actors[0] === game.user.character
        ? ui.notifications.info(
            game.i18n.format("SR.CompendiumBrowser.AddedItemToCharacter", {
              item: item.name,
              character: game.user.character.name,
            })
          )
        : ui.notifications.info(
            game.i18n.format("SR.CompendiumBrowser.AddedItem", {
              item: item.name,
            })
          );
    } else ui.notifications.error(game.i18n.format("SR.ErrorMessage.NoTokenSelected"));
  }
  async buyAcquisItem(uuid) {
    const actors = (0, getSelectedOrOwnActors)(["Personnage", "PNJ", "Créature", "Shaani", "Réseau", "Loot"]),
      item = await this.getAcquisItem(uuid);
    if (0 === actors.length) return void ui.notifications.error(game.i18n.format("SR.ErrorMessage.NoTokenSelected"));
    let purchasesSucceeded = 0;
    for (const actor of actors)
      await actor.inventory.removeCoins(Number(item.system.price.replace("crédos", ""))),
        (purchasesSucceeded += 1),
        await actor.createEmbeddedDocuments("Item", [item.toObject()]);
    1 === actors.length
      ? 1 === purchasesSucceeded
        ? ui.notifications.info(
            game.i18n.format("SR.CompendiumBrowser.BoughtItemWithCharacter", {
              item: item.name,
              character: actors[0].name,
            })
          )
        : ui.notifications.warn(
            game.i18n.format("SR.CompendiumBrowser.FailedToBuyItemWithCharacter", {
              item: item.name,
              character: actors[0].name,
            })
          )
      : purchasesSucceeded === actors.length
      ? ui.notifications.info(
          game.i18n.format("SR.CompendiumBrowser.BoughtItemWithAllCharacters", {
            item: item.name,
          })
        )
      : ui.notifications.warn(
          game.i18n.format("SR.CompendiumBrowser.FailedToBuyItemWithSomeCharacters", {
            item: item.name,
          })
        );
  }
  async getAcquisItem(uuid) {
    const item = await fromUuid(uuid);
    if (!(item instanceof ItemSR)) return ui.notifications.warn("Unexpected failure retrieving compendium item");
    return item;
  }

  getData() {
    const activeTab = this.activeTab;
    if ("settings" === activeTab)
      return {
        user: game.user,
        settings: this.settings,
      };
    const tab = this.tabs[activeTab];
    return tab
      ? {
          user: game.user,
          [activeTab]: {
            filterData: tab.filterData,
          },
          scrollLimit: tab.scrollLimit,
        }
      : {
          user: game.user,
        };
  }
  _canDragStart() {
    return !0;
  }
  _canDragDrop() {
    return !0;
  }
  _onDragStart(event) {
    this.element.animate(
      {
        opacity: 0.125,
      },
      250
    );
    const item = $(event.currentTarget)[0];
    event.dataTransfer.setData(
      "text/plain",
      JSON.stringify({
        type: item.dataset.type,
        uuid: item.dataset.entryUuid,
      })
    ),
      item.addEventListener(
        "dragend",
        () => {
          window.setTimeout(() => {
            this.element.animate(
              {
                opacity: 1,
              },
              250,
              () => {
                this.element.css({
                  pointerEvents: "",
                });
              }
            );
          }, 500);
        },
        {
          once: !0,
        }
      );
  }
  _onDragOver(event) {
    super._onDragOver(event),
      this.element.css({
        pointerEvents: "none",
      });
  }
  resetFilters() {
    const activeTab = this.activeTab;
    "settings" !== activeTab && this.tabs[activeTab].resetFilters();
  }
  clearScrollLimit(render = !1) {
    const tab = this.activeTab;
    if ("settings" === tab) return;
    const list = this.element[0].querySelector(".tab.active ul.item-list");
    list && ((list.scrollTop = 0), (this.tabs[tab].scrollLimit = 100), render && this.render());
  }
}
