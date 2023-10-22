import { sluggify } from "../../../utils/utils.js";
import { CompendiumBrowserTab } from "./base.js";
export class CompendiumBrowserJobsTab extends CompendiumBrowserTab {
  constructor(browser) {
    super(browser),
      (this.tabName = "jobs"),
      (this.templatePath =
        "systems/shaanrenaissance/templates/compendium-browser/partials/jobs.hbs"),
      (this.searchFields = ["name"]),
      (this.storeFields = ["type", "name", "img", "uuid", "source"]),
      (this.index = ["img", "system.domain", "system.source.value"]),
      (this.filterData = this.prepareFilterData());
  }
  async loadData() {
    console.debug(
      "SHAAN RENAISSANCE | Compendium Browser | Started loading jobs"
    );
    const jobs = [],
      indexFields = ["img", "system.domain", "system.source.value"],
      sources = new Set();
    for await (const { pack, index } of this.browser.packLoader.loadPacks(
      "Item",
      this.browser.loadedPacks("jobs"),
      indexFields
    )) {
      console.debug(
        `Shaan System | Compendium Browser | ${pack.metadata.label} - Loading`
      );
      for (const jobsData of index)
        if ("Métier" === jobsData.type) {
          if (!this.hasAllIndexFields(jobsData, indexFields)) {
            console.warn(
              `Jobs '${jobsData.name}' does not have all required data fields. Consider unselecting pack '${pack.metadata.label}' in the compendium browser settings.`
            );
            continue;
          }
          const source = jobsData.system.source.value;
          source && sources.add(source),
            jobs.push({
              name: jobsData.name,
              img: jobsData.img,
              uuid: `Compendium.${pack.collection}.${jobsData._id}`,
              domain: jobsData.system.domain,
              source: (0, sluggify)(jobsData.system.source.value),
            });
        }
    }
    (this.indexData = jobs),
      (this.filterData.checkboxes.domains.options =
        this.generateCheckboxOptions(CONFIG.shaanRenaissance.SRdomains)),
      (this.filterData.checkboxes.source.options =
        this.generateSourceCheckboxOptions(sources)),
      console.debug(
        "SHAAN RENAISSANCE | Compendium Browser | Finished loading jobs"
      );
  }
  filterIndexData(entry) {
    const { checkboxes } = this.filterData;
    return (
      !(
        checkboxes.domains.selected.length &&
        !checkboxes.domains.selected.includes(entry.domain)
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
        domains: {
          isExpanded: !0,
          label: "SRLabels.DomainsTitle",
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
