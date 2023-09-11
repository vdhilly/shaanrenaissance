import { CompendiumBrowserTab } from "./base.js";
import {sluggify} from "../../../utils/utils.js";
export class CompendiumBrowserBestiaryTab extends CompendiumBrowserTab {
    constructor(browser) {
        super(browser), this.tabName = "bestiary", this.templatePath = "systems/SR/templates/compendium-browser/partials/bestiary.hbs", this.index = ["img", "system.details.source.value"], this.searchFields = ["name"], this.storeFields = ["type", "name", "img", "uuid", "source"], this.filterData = this.prepareFilterData()
    }
    async loadData() {
        console.debug("SR System | Compendium Browser | Started loading Bestiary actors");
        const bestiaryActors = [],
            sources = new Set,
            indexFields = [...this.index];
        for await (const {
            pack,
            index
        } of this.browser.packLoader.loadPacks("Actor", this.browser.loadedPacks("bestiary"), indexFields)) {
            console.debug(`SR System | Compendium Browser | ${pack.metadata.label} - ${index.size} entries found`);
            for (const actorData of index)
                if ("Personnage" === actorData.type || "PNJ" === actorData.type || "Créature" === actorData.type) {
                    if (!this.hasAllIndexFields(actorData, this.index)) {
                        console.warn(`Actor '${actorData.name}' does not have all required data fields. Consider unselecting pack '${pack.metadata.label}' in the compendium browser settings.`);
                        continue
                    }
                    const source = actorData.system.details.source.value;
                    source && (sources.add(source), actorData.system.details.source.value = (0, sluggify)(source)), bestiaryActors.push({
                        type: actorData.type,
                        name: actorData.name,
                        img: actorData.img,
                        uuid: `Compendium.${pack.collection}.${actorData._id}`,
                        source: (0, sluggify)(actorData.system.source.value)
                    })
                } console.debug(`SR System | Compendium Browser | ${pack.metadata.label} - Loaded`)
        }
        this.indexData = bestiaryActors, this.filterData.checkboxes.source.options = this.generateSourceCheckboxOptions(sources), console.debug("SR System | Compendium Browser | Finished loading Bestiary actors")
    }
    filterIndexData(entry) {
        const {
            checkboxes
        } = this.filterData;
        return (!(checkboxes.source.selected.length && !checkboxes.source.selected.includes(entry.source)))
    }
    prepareFilterData() {
        return {
            checkboxes: {
                source: {
                    isExpanded: !1,
                    label: "SR.BrowserFilterSource",
                    options: {},
                    selected: []
                }
            },
            order: {
                by: "level",
                direction: "asc",
                options: {
                    name: "SR.BrowserSortyByNameLabel",
                    level: "SR.BrowserSortyByLevelLabel"
                }
            },
            search: {
                text: ""
            }
        }
    }
}