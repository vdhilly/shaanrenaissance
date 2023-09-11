export class LocalizeSR {
    static ready = false;
    static get translations() {
        if (!this.ready) return ui.notifications.warn("LocalizeSR instantiated too early");
        return void 0 === this._translations && (this._translations = mergeObject(game.i18n._fallback, game.i18n.translations, {
            enforceTypes: !0
        })), this._translations
    }
}
LocalizeSR.ready = true