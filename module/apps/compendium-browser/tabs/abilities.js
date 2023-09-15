import { CompendiumBrowserTab } from "./base.js";
import {sluggify} from "../../../utils/utils.js";
export class CompendiumBrowserAbilitiesTab extends CompendiumBrowserTab {
    constructor(browser) {
        super(browser), this.tabName = "abilities", this.templatePath = "systems/shaanrenaissance/templates/compendium-browser/partials/abilities.hbs", this.searchFields = ["name"], this.storeFields = ["type", "name", "img", "uuid", "source"], this.index = ["img", "system.pouvoirType.value", "system.pouvoir.value", "system.rang.value", "system.source.value"], this.filterData = this.prepareFilterData()
    }
    async loadData() {
        console.debug("SHAAN RENAISSANCE | Compendium Browser | Started loading abilities");
        const abilities = [],
            indexFields = ["img", "system.rang.value", "system.PouvoirType.value", "system.pouvoir.value", "system.source.value"],
            sources = new Set;
        for await (const {
            pack, index
        } of this.browser.packLoader.loadPacks("Item", this.browser.loadedPacks("abilities"), indexFields)) {
            console.debug(`Shaan System | Compendium Browser | ${pack.metadata.label} - Loading`);
            for (const abilitiesData of index)
                if("Pouvoir" === abilitiesData.type) {
                    if(!this.hasAllIndexFields(abilitiesData, indexFields)) {
                        console.warn(`Ability '${abilitiesData.name}' does not have all required data fields. Consider unselecting pack '${pack.metadata.label}' in the compendium browser settings.`);
                        continue
                    }
                    const source = abilitiesData.system.source.value
                    
                    source && sources.add(source), abilities.push({
                        type: abilitiesData.system.PouvoirType.value,
                        name: abilitiesData.name,
                        img: abilitiesData.img,
                        uuid: `Compendium.${pack.collection}.${abilitiesData._id}`,
                        rang: abilitiesData.system.rang.value.replace("Rang ", "Rank"),
                        domain: abilitiesData.system.pouvoir.value.replace("de ", "").replace("Astuce ", "").replace("Création d'", "").replace("Privilège ", "").replace("Secret ", "").replace("Symbiose ", "").replace("Sort ", "").replace("Transe ", "").replace("Exploit ", "").replace("Tactique ", "").replace("Tourment ", ""),
                        source: (0, sluggify)(abilitiesData.system.source.value)
                    })
                }
        }
        this.indexData = abilities, this.filterData.checkboxes.domains.options = this.generateCheckboxOptions(CONFIG.shaanRenaissance.SRdomains), this.filterData.checkboxes.types.options = this.generateCheckboxOptions(CONFIG.shaanRenaissance.abilitiesTypes), this.filterData.checkboxes.rangs.options = this.generateCheckboxOptions(CONFIG.shaanRenaissance.pouvoirs.pouvoirRank), this.filterData.checkboxes.source.options = this.generateSourceCheckboxOptions(sources), console.debug("SHAAN RENAISSANCE | Compendium Browser | Finished loading abilities")
    }
    // A changer
    filterIndexData(entry) {
    const {
        checkboxes,
        multiselects
    } = this.filterData;
    entry.source.sluggify
    return (!(checkboxes.domains.selected.length && !checkboxes.domains.selected.includes(entry.domain)) && !(checkboxes.types.selected.length && !checkboxes.types.selected.includes(entry.type)) && !(checkboxes.rangs.selected.length && !checkboxes.rangs.selected.includes(entry.rang)) && !(checkboxes.source.selected.length && !checkboxes.source.selected.includes(entry.source)))
    }
    prepareFilterData() {
        return {
            checkboxes: {
                domains: {
                    isExpanded: !0,
                    label: "SRLabels.DomainsTitle",
                    options: {},
                    selected: []
                },
                types: {
                    isExpanded: !1,
                    label: "SR.AbilitiesTypeLabel",
                    options: {},
                    selected: []
                },
                rangs: {
                    isExpanded: !1,
                    label: "SR.AbilitiesRankLabel",
                    options: {},
                    selected: []
                },
                source: {
                    isExpanded: !1,
                    label: "SR.BrowserFilterSource",
                    options: {},
                    selected: []
                }
            },
            order: {
                by: "name",
                direction: "asc",
                options: {
                    name: "SR.BrowserSortByNameLabel"
                }
            },
            search: {
                text: ""
            }
        }
    }
}