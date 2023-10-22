import { sluggify } from "../../../utils/utils.js";
import { CompendiumBrowserTab } from "./base.js";
export class CompendiumBrowserPeopleTab extends CompendiumBrowserTab {
  constructor(browser) {
    super(browser),
      (this.tabName = "people"),
      (this.templatePath =
        "systems/shaanrenaissance/templates/compendium-browser/partials/people.hbs"),
      (this.searchFields = ["name"]),
      (this.storeFields = ["type", "name", "img", "uuid", "source"]),
      (this.index = ["img", "system.source.value"]),
      (this.filterData = this.prepareFilterData());
  }
  async loadData() {
    console.debug(
      "SHAAN RENAISSANCE | Compendium Browser | Started loading people"
    );
    const people = [],
      indexFields = ["img", "system.source.value"],
      sources = new Set();
    for await (const { pack, index } of this.browser.packLoader.loadPacks(
      "Item",
      this.browser.loadedPacks("people"),
      indexFields
    )) {
      console.debug(
        `Shaan System | Compendium Browser | ${pack.metadata.label} - Loading`
      );
      for (const peopleData of index)
        if ("Peuple" === peopleData.type) {
          if (!this.hasAllIndexFields(peopleData, indexFields)) {
            console.warn(
              `People '${peopleData.name}' does not have all required data fields. Consider unselecting pack '${pack.metadata.label}' in the compendium browser settings.`
            );
            continue;
          }
          const source = peopleData.system.source.value;
          source && sources.add(source),
            people.push({
              name: peopleData.name,
              img: peopleData.img,
              uuid: `Compendium.${pack.collection}.${peopleData._id}`,
              source: (0, sluggify)(peopleData.system.source.value),
            });
        }
    }
    (this.indexData = people),
      (this.filterData.checkboxes.source.options =
        this.generateSourceCheckboxOptions(sources)),
      console.debug(
        "SHAAN RENAISSANCE | Compendium Browser | Finished loading people"
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
