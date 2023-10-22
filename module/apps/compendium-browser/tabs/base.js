import { M as MiniSearch } from "../../../../vendor.mjs";
import { sluggify } from "../../../utils/utils.js";
var _CompendiumBrowserTab_domParser,
  __classPrivateFieldGet =
    (this && this.__classPrivateFieldGet) ||
    function (receiver, state, kind, f) {
      if ("a" === kind && !f)
        throw new TypeError("Private accessor was defined without a getter");
      if (
        "function" == typeof state
          ? receiver !== state || !f
          : !state.has(receiver)
      )
        throw new TypeError(
          "Cannot read private member from an object whose class did not declare it"
        );
      return "m" === kind
        ? f
        : "a" === kind
        ? f.call(receiver)
        : f
        ? f.value
        : state.get(receiver);
    };

export class CompendiumBrowserTab {
  constructor(browser) {
    (this.indexData = []),
      (this.isInitialized = !1),
      (this.totalItemCount = 0),
      (this.scrollLimit = 100),
      _CompendiumBrowserTab_domParser.set(this, new DOMParser()),
      (this.searchFields = []),
      (this.storeFields = []),
      (this.browser = browser);
  }
  async init() {
    await this.loadData(),
      (this.searchEngine = new MiniSearch({
        fields: this.searchFields,
        idField: "uuid",
        storeFields: this.storeFields,
        searchOptions: {
          combineWith: "AND",
          prefix: !0,
        },
      })),
      this.searchEngine.addAll(this.indexData),
      (this.defaultFilterData = deepClone(this.filterData)),
      (this.isInitialized = !0);
  }
  getIndexData(start) {
    if (!this.isInitialized)
      return ui.notifications.error(
        `Compendium Browser Tab "${this.tabName}" is not initialized!`
      );
    const currentIndex = (() => {
      const searchText = this.filterData.search.text;
      if (searchText) {
        const searchResult = this.searchEngine.search(searchText);
        return this.sortResult(
          searchResult.filter(this.filterIndexData.bind(this))
        );
      }
      return this.sortResult(
        this.indexData.filter(this.filterIndexData.bind(this))
      );
    })();
    return (
      (this.totalItemCount = currentIndex.length),
      currentIndex.slice(start, this.scrollLimit)
    );
  }
  resetFilters() {
    this.filterData = deepClone(this.defaultFilterData);
  }
  async renderResults(start) {
    if (!this.templatePath)
      return ui.notifications.error(
        `Tab "${this.tabName}" has no valid template path`
      );
    const indexData = this.getIndexData(start),
      liElements = [];
    this.currentIndex = indexData;
    for (const entry of indexData) {
      const htmlString = await renderTemplate(this.templatePath, {
          entry,
          filterData: this.filterData,
        }),
        html = __classPrivateFieldGet(
          this,
          _CompendiumBrowserTab_domParser,
          "f"
        ).parseFromString(htmlString, "text/html");
      liElements.push(html.body.firstElementChild);
    }
    return liElements;
  }
  sortResult(result) {
    const { order } = this.filterData,
      lang = game.i18n.lang,
      sorted = result.sort((entryA, entryB) => {
        switch (order.by) {
          case "name":
            return entryA.name.localeCompare(entryB.name, lang);
          case "price":
            return (
              entryA.price - entryB.price ||
              entryA.name.localeCompare(entryB.name, lang)
            );
          default:
            return 0;
        }
      });
    return "asc" === order.direction ? sorted : sorted.reverse();
  }
  generateCheckboxOptions(configData, sort = !0) {
    const localized = Object.entries(configData).reduce(
      (result, [key, label]) => ({
        ...result,
        [key]: game.i18n.localize(label),
      }),
      {}
    );
    return Object.entries(
      sort ? this.sortedConfig(localized) : localized
    ).reduce(
      (result, [key, label]) => ({
        ...result,
        [key]: {
          label,
          selected: !1,
        },
      }),
      {}
    );
  }
  generateSourceCheckboxOptions(sources) {
    return [...sources].sort().reduce(
      (result, source) => ({
        ...result,
        [(0, sluggify)(source)]: {
          label: source,
          selected: !1,
        },
      }),
      {}
    );
  }
  sortedConfig(obj) {
    return Object.fromEntries(
      [...Object.entries(obj)].sort((entryA, entryB) =>
        entryA[1].localeCompare(entryB[1], game.i18n.lang)
      )
    );
  }
  hasAllIndexFields(data, indexFields) {
    for (const field of indexFields)
      if (void 0 === getProperty(data, field)) return !1;
    return !0;
  }
  getRollTableResults({ initial = 0, weight = 1 } = {}) {
    return this.currentIndex.flatMap((e, i) => {
      const documentData = fromUuidSync(e.uuid);
      if (!documentData || !documentData.pack || !documentData._id) return [];
      const rangeMinMax = initial + i + 1;
      return {
        text: documentData.name,
        type: CONST.TABLE_RESULT_TYPES.COMPENDIUM,
        collection: documentData.pack,
        resultId: documentData._id,
        img: e.img,
        weight,
        range: [rangeMinMax, rangeMinMax],
        drawn: false,
      };
    });
  }
  async createRollTable() {
    if (!this.isInitialized) {
      throw new Error(
        `Compendium Browser Tab "${this.tabName}" is not initialized!`
      );
    }
    const content = await renderTemplate(
      "systems/shaanrenaissance/templates/compendium-browser/roll-table-dialog.hbs",
      {
        count: this.currentIndex.length,
        rollTables: game.tables.contents,
      }
    );
    Dialog.confirm({
      content,
      title: game.i18n.localize("SR.CompendiumBrowser.RollTable.CreateLabel"),
      yes: async ($html) => {
        const html = $html[0];
        const name =
          html.querySelector("input[name=name]")?.value ||
          game.i18n.localize("SR.CompendiumBrowser.Title");
        const weight =
          Number(html.querySelector("input[name=weight]")?.value) || 1;
        const results = this.getRollTableResults({ weight });
        const table = await RollTable.create({
          name,
          results,
          formula: `1d${results.length}`,
        });
        table?.sheet.render(true);
      },
    });
  }

  async addToRollTable() {
    if (!this.isInitialized) {
      throw new Error(
        `Compendium Browser Tab "${this.tabName}" is not initialized!`
      );
    }
    const content = await renderTemplate(
      "systems/shaanrenaissance/templates/compendium-browser/roll-table-dialog.hbs",
      {
        count: this.currentIndex.length,
        rollTables: game.tables.contents,
      }
    );
    Dialog.confirm({
      title: game.i18n.localize(
        "SR.CompendiumBrowser.RollTable.SelectTableTitle"
      ),
      content,
      yes: async ($html) => {
        const html = $html[0];
        const option = html.querySelector("select[name=roll-table]")
          ?.selectedOptions[0];
        if (!option) return;
        const weight =
          Number(html.querySelector("input[name=weight]")?.value) || 1;
        const table = game.tables.get(option.value, { strict: true });
        await table.createEmbeddedDocuments(
          "TableResult",
          this.getRollTableResults({ initial: table.results.size, weight })
        );
        table?.sheet.render(true);
      },
    });
  }
}
_CompendiumBrowserTab_domParser = new WeakMap();
