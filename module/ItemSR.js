import { setHasElement, PHYSICAL_ITEM_TYPES, ErrorSR, isItemSystemData } from "./utils/utils.js";

export class ItemSR extends Item {
    isOfType(...types) {
        return types.some((t => "physical" === t ? (0, setHasElement)(PHYSICAL_ITEM_TYPES, this.type) : this.type === t))
    }
    getRollData() {
        return {
            actor: this.actor,
            item: this
        }
      }
      async processChatData(htmlOptions = {}, data) {
        var _a, _b, _c;
        if (data.properties = null !== (_b = null === (_a = data.properties) || void 0 === _a ? void 0 : _a.filter((property => null !== property))) && void 0 !== _b ? _b : [], (0, isItemSystemData)(data)) {
            const chatData = duplicate(data);
            return htmlOptions.rollData = mergeObject(this.getRollData(), null !== (_c = htmlOptions.rollData) && void 0 !== _c ? _c : {}), chatData.description.value = await TextEditor.enrichHTML(chatData.description.value, {
                ...htmlOptions,
                async: !0
            }), chatData
        }
        return data
    }
      async getChatData(htmlOptions = {}, _rollOptions = {}) {
        if (!this.actor) throw (0, ErrorSR)(`Cannot retrieve chat data for unowned item ${this.name}`);
        const systemData = {
            ...this.system
        };
        return this.processChatData(htmlOptions, deepClone(systemData))
    }
    static async createDialog(data = {}, options = {}) {
        var _a;
        const original = game.system.documentTypes.Item;
        const withClasses = {
            ...options,
            classes: [...null !== (_a = options.classes) && void 0 !== _a ? _a : [], "dialog-item-create"]
        },
        newItem = super.createDialog(data, withClasses);
        return game.system.documentTypes.Item = original, newItem
    }
}