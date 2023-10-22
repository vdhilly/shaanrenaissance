import { sluggify } from "../../../utils/utils.js";
import { CompendiumBrowserTab } from "./base.js";
export class CompendiumBrowserAcquisTab extends CompendiumBrowserTab {
  constructor(browser) {
    super(browser),
      (this.tabName = "acquis"),
      (this.templatePath =
        "systems/shaanrenaissance/templates/compendium-browser/partials/acquis.hbs"),
      (this.searchFields = ["name"]),
      (this.storeFields = ["type", "name", "img", "uuid", "source"]),
      (this.index = [
        "img",
        "system.source.value",
        "system.price",
        "system.class",
        "system.spécialisations",
      ]),
      (this.filterData = this.prepareFilterData());
  }
  async loadData() {
    console.debug(
      "SHAAN RENAISSANCE | Compendium Browser | Started loading acquisitions"
    );
    const acquis = [],
      itemTypes = [
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
      ],
      indexFields = [
        "img",
        "system.source.value",
        "system.price",
        "system.class",
      ],
      sources = new Set();
    for await (const { pack, index } of this.browser.packLoader.loadPacks(
      "Item",
      this.browser.loadedPacks("acquis"),
      indexFields
    )) {
      console.debug(
        `Shaan System | Compendium Browser | ${pack.metadata.label} - Loading`
      );
      for (const acquisData of index)
        if (itemTypes.includes(acquisData.type)) {
          if (!this.hasAllIndexFields(acquisData, indexFields)) {
            console.warn(
              `Acquisition '${acquisData.name}' does not have all required data fields. Consider unselecting pack '${pack.metadata.label}' in the compendium browser settings.`
            );
            continue;
          }
          const source = acquisData.system.source.value;
          const price =
            typeof acquisData.system.price === "string"
              ? acquisData.system.price.replace("crédos", "")
              : acquisData.system.price;

          source && sources.add(source),
            acquis.push({
              type: acquisData.type,
              name: acquisData.name,
              price: price,
              img: acquisData.img,
              uuid: `Compendium.${pack.collection}.${acquisData._id}`,
              class: acquisData.system.class.replace("Classe ", "class"),
              spécialisations: acquisData.system.spécialisations,
              source: (0, sluggify)(acquisData.system.source.value),
            });
        }
    }
    (this.indexData = acquis),
      (this.filterData.checkboxes.types.options = this.generateCheckboxOptions(
        CONFIG.shaanRenaissance.acquis.category
      )),
      (this.filterData.checkboxes.class.options = this.generateCheckboxOptions(
        CONFIG.shaanRenaissance.acquis.class
      )),
      (this.filterData.checkboxes.source.options =
        this.generateSourceCheckboxOptions(sources)),
      console.debug(
        "SHAAN RENAISSANCE | Compendium Browser | Finished loading acquis"
      );
  }
  // A changer
  filterIndexData(entry) {
    const { checkboxes, multiselects } = this.filterData;
    return (
      !(
        checkboxes.types.selected.length &&
        !checkboxes.types.selected.includes(entry.type)
      ) &&
      !(
        checkboxes.class.selected.length &&
        !checkboxes.class.selected.includes(entry.class)
      ) &&
      !(
        checkboxes.source.selected.length &&
        !checkboxes.source.selected.includes(entry.source)
      )
    );
  }
  prepareFilterData() {
    return {
      checkboxes: {
        types: {
          isExpanded: !0,
          label: "SR.AcquisCategoryLabel",
          options: {},
          selected: [],
        },
        class: {
          isExpanded: !1,
          label: "SR.AcquisClassLabel",
          options: {},
          selected: [],
        },
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
          price: "SR.BrowserSortByPriceLabel",
        },
      },
      search: {
        text: "",
      },
    };
  }
}
