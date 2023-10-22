import { sluggify } from "../../../utils/utils.js";
import { CompendiumBrowserTab } from "./base.js";
export class CompendiumBrowserCastesTab extends CompendiumBrowserTab {
  constructor(browser) {
    super(browser),
      (this.tabName = "castes"),
      (this.templatePath =
        "systems/shaanrenaissance/templates/compendium-browser/partials/castes.hbs"),
      (this.searchFields = ["name"]),
      (this.storeFields = ["type", "name", "img", "uuid", "source"]),
      (this.index = ["img", "system.source.value"]),
      (this.filterData = this.prepareFilterData());
  }
  async loadData() {
    console.debug(
      "SHAAN RENAISSANCE | Compendium Browser | Started loading castes"
    );
    const castes = [],
      indexFields = ["img", "system.source.value"],
      sources = new Set();
    for await (const { pack, index } of this.browser.packLoader.loadPacks(
      "Item",
      this.browser.loadedPacks("castes"),
      indexFields
    )) {
      console.debug(
        `Shaan System | Compendium Browser | ${pack.metadata.label} - Loading`
      );
      for (const castesData of index)
        if ("Caste" === castesData.type) {
          if (!this.hasAllIndexFields(castesData, indexFields)) {
            console.warn(
              `Caste '${castesData.name}' does not have all required data fields. Consider unselecting pack '${pack.metadata.label}' in the compendium browser settings.`
            );
            continue;
          }
          const source = castesData.system.source.value;
          source && sources.add(source),
            castes.push({
              name: castesData.name,
              img: castesData.img,
              uuid: `Compendium.${pack.collection}.${castesData._id}`,
              source: (0, sluggify)(castesData.system.source.value),
            });
        }
    }
    (this.indexData = castes),
      (this.filterData.checkboxes.source.options =
        this.generateSourceCheckboxOptions(sources)),
      console.debug(
        "SHAAN RENAISSANCE | Compendium Browser | Finished loading castes"
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
