import { sluggify } from "../../../utils/utils.js";
import { CompendiumBrowserTab } from "./base.js";
export class CompendiumBrowserRacesTab extends CompendiumBrowserTab {
  constructor(browser) {
    super(browser),
      (this.tabName = "races"),
      (this.templatePath =
        "systems/shaanrenaissance/templates/compendium-browser/partials/races.hbs"),
      (this.searchFields = ["name"]),
      (this.storeFields = ["type", "name", "img", "uuid", "source"]),
      (this.index = ["img", "system.source.value"]),
      (this.filterData = this.prepareFilterData());
  }
  async loadData() {
    console.debug(
      "SHAAN RENAISSANCE | Compendium Browser | Started loading races"
    );
    const races = [],
      indexFields = ["img", "system.source.value"],
      sources = new Set();
    for await (const { pack, index } of this.browser.packLoader.loadPacks(
      "Item",
      this.browser.loadedPacks("races"),
      indexFields
    )) {
      console.debug(
        `Shaan System | Compendium Browser | ${pack.metadata.label} - Loading`
      );
      for (const racesData of index)
        if ("Race" === racesData.type) {
          if (!this.hasAllIndexFields(racesData, indexFields)) {
            console.warn(
              `Race '${racesData.name}' does not have all required data fields. Consider unselecting pack '${pack.metadata.label}' in the compendium browser settings.`
            );
            continue;
          }
          const source = racesData.system.source.value;
          source && sources.add(source),
            races.push({
              name: racesData.name,
              img: racesData.img,
              uuid: `Compendium.${pack.collection}.${racesData._id}`,
              source: (0, sluggify)(racesData.system.source.value),
            });
        }
    }
    (this.indexData = races),
      (this.filterData.checkboxes.source.options =
        this.generateSourceCheckboxOptions(sources)),
      console.debug(
        "SHAAN RENAISSANCE | Compendium Browser | Finished loading races"
      );
  }
  filterIndexData(entry) {
    const { checkboxes } = this.filterData;
    return !(
      checkboxes.source.selected.length &&
      !checkboxes.source.selected.includes(entry.source)
    );
  }
  prepareFilterData() {
    return {
      checkboxes: {
        source: {
          isExpanded: !1,
          label: "SR.BrowserFilterSource",
          options: {},
          selected: [],
        },
      },
      order: {
        by: "name",
        direction: "asc",
        options: {
          name: "SR.BrowserSortByNameLabel",
        },
      },
      search: {
        text: "",
      },
    };
  }
}
