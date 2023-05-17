export class ItemSR extends Item {
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