import { sluggify } from "../../../utils/utils.js";
import { CompendiumBrowserTab } from "./base.js";
export class CompendiumBrowserBestiaryTab extends CompendiumBrowserTab {
  constructor(browser) {
    super(browser),
      (this.tabName = "bestiary"),
      (this.templatePath =
        "systems/shaanrenaissance/templates/compendium-browser/partials/bestiary.hbs"),
      (this.index = [
        "img",
        "system.source",
        "system.general.classe",
        "system.general.role",
        "system.general.milieu",
      ]),
      (this.searchFields = ["name"]),
      (this.storeFields = ["type", "name", "img", "uuid", "source"]),
      (this.filterData = this.prepareFilterData());
  }
  async loadData() {
    console.debug(
      "SR System | Compendium Browser | Started loading Bestiary actors"
    );
    const bestiaryActors = [],
      sources = new Set(),
      indexFields = [
        "img",
        "system.source",
        "system.general.classe",
        "system.general.role",
        "system.general.milieu",
      ];
    for await (const { pack, index } of this.browser.packLoader.loadPacks(
      "Actor",
      this.browser.loadedPacks("bestiary"),
      indexFields
    )) {
      console.debug(
        `SR System | Compendium Browser | ${pack.metadata.label} - ${index.size} entries found`
      );
      for (const actorData of index)
        if (
          "Personnage" === actorData.type ||
          "PNJ" === actorData.type ||
          "Créature" === actorData.type
        ) {
          if (!this.hasAllIndexFields(actorData, this.index)) {
            console.warn(
              `Actor '${actorData.name}' does not have all required data fields. Consider unselecting pack '${pack.metadata.label}' in the compendium browser settings.`
            );
            continue;
          }
          const source = actorData.system.source;
          source &&
            (sources.add(source),
            (actorData.system.source = (0, sluggify)(source))),
            bestiaryActors.push({
              type: actorData.type,
              name: actorData.name,
              img: actorData.img,
              milieu: actorData.system.general.milieu,
              role: actorData.system.general.role,
              class: actorData.system.general.classe,
              uuid: `Compendium.${pack.collection}.${actorData._id}`,
              source: (0, sluggify)(actorData.system.source),
            });
        }
      console.debug(
        `SR System | Compendium Browser | ${pack.metadata.label} - Loaded`
      );
    }
    (this.indexData = bestiaryActors),
      (this.filterData.checkboxes.type.options = this.generateCheckboxOptions(
        CONFIG.shaanRenaissance.bestiaryBrowser.type
      )),
      (this.filterData.checkboxes.class.options = this.generateCheckboxOptions(
        CONFIG.shaanRenaissance.bestiaryBrowser.class
      )),
      (this.filterData.checkboxes.role.options = this.generateCheckboxOptions(
        CONFIG.shaanRenaissance.bestiaryBrowser.role
      )),
      (this.filterData.checkboxes.source.options =
        this.generateSourceCheckboxOptions(sources)),
      console.debug(
        "SR System | Compendium Browser | Finished loading Bestiary actors"
      );
  }
  filterIndexData(entry) {
    const { checkboxes } = this.filterData;
    return (
      !(
        checkboxes.type.selected.length &&
        !checkboxes.type.selected.includes(entry.type)
      ) &&
      !(
        checkboxes.class.selected.length &&
        !checkboxes.class.selected.includes(entry.class)
      ) &&
      !(
        checkboxes.role.selected.length &&
        !checkboxes.role.selected.includes(entry.role)
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
        type: {
          isExpanded: !0,
          label: "SR.BrowserFilterBestiaryType",
          options: {},
          selected: [],
        },
        class: {
          isExpanded: !1,
          label: "SR.BrowserFilterClass",
          options: {},
          selected: [],
        },
        role: {
          isExpanded: !1,
          label: "SR.BrowserFilterBestiaryRole",
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
        },
      },
      search: {
        text: "",
      },
    };
  }
}
