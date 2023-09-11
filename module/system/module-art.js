var _ModuleArt_instances, _ModuleArt_getArtMap, _ModuleArt_isModuleArt, __classPrivateFieldGet = this && this.__classPrivateFieldGet || function(receiver, state, kind, f) {
    if ("a" === kind && !f) throw new TypeError("Private accessor was defined without a getter");
    if ("function" == typeof state ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return "m" === kind ? f : "a" === kind ? f.call(receiver) : f ? f.value : state.get(receiver)
};

export class ModuleArt {
    constructor() {
        _ModuleArt_instances.add(this), this.map = new Map
    }
    async refresh() {
        var _a, _b;
        this.map.clear();
        const activeModules = [...game.modules.entries()].filter((([_key, m]) => m.active));
        for (const [moduleKey, foundryModule] of activeModules) {
            const moduleArt = await __classPrivateFieldGet(this, _ModuleArt_instances, "m", _ModuleArt_getArtMap).call(this, null === (_b = null === (_a = foundryModule.flags) || void 0 === _a ? void 0 : _a[moduleKey]) || void 0 === _b ? void 0 : _b["sr-art"]);
            if (moduleArt)
                for (const [packName, art] of Object.entries(moduleArt)) {
                    const pack = game.packs.get(`shaanrenaissance.${packName}`);
                    if (!pack) {
                        console.warn(`Shaan Renaissance System | Failed pack lookup from module art registration (${moduleKey}): ${packName}`);
                        continue
                    }
                    const index = pack.indexed ? pack.index : await pack.getIndex();
                    for (const [actorId, paths] of Object.entries(art)) {
                        const record = index.get(actorId);
                        if (!record) continue;
                        record.img = paths.actor;
                        const actorArtPartial = {
                            img: paths.actor,
                            prototypeToken: {
                                texture: {
                                    src: "string" == typeof paths.token ? paths.token : paths.token.img
                                }
                            }
                        };
                        "string" != typeof paths.token && ("number" == typeof paths.token.scale && (actorArtPartial.prototypeToken.texture.scaleX = paths.token.scale, actorArtPartial.prototypeToken.texture.scaleY = paths.token.scale, actorArtPartial.prototypeToken.flags = {
                            shaanrenaissance: {
                                autoscale: !1
                            }
                        }), "boolean" == typeof paths.token.randomImg && (actorArtPartial.prototypeToken.randomImg = paths.token.randomImg)), this.map.set(`Compendium.shaanrenaissance.${packName}.${actorId}`, actorArtPartial)
                    }
                }
        }
        const apps = Object.values(ui.windows).filter((w => w instanceof Compendium));
        for (const compendium of apps) compendium.render()
    }
}
_ModuleArt_instances = new WeakSet, _ModuleArt_getArtMap = async function(art) {
    if (!art) return null;
    if (__classPrivateFieldGet(this, _ModuleArt_instances, "m", _ModuleArt_isModuleArt).call(this, art)) return art;
    if ("string" == typeof art) try {
        const response = await fetch(art);
        if (!response.ok) return console.warn(`Shaan Renaissance System | Failed loading art mapping file at ${art}`), null;
        const map = await response.json();
        return __classPrivateFieldGet(this, _ModuleArt_instances, "m", _ModuleArt_isModuleArt).call(this, map) ? map : null
    } catch (error) {
        error instanceof Error && console.warn(`Shaan Renaissance System | ${error.message}`)
    }
    return null
}, _ModuleArt_isModuleArt = function(record) {
    return (0, isObject)(record) && Object.values(record).every((packToArt => (0, isObject)(packToArt) && Object.values(packToArt).every((art => (0, isObject)(art) && "actor" in art && typeof(0, isImageFilePath)(art.actor) && "token" in art && ((0, isImageOrVideoPath)(art.token) || (0, isObject)(art.token) && "img" in art.token && (0, isImageOrVideoPath)(art.token.img) && (!("scale" in art.token) || "number" == typeof art.token.scale && art.token.scale > 0) && (!("randomImg" in art.token) || "boolean" == typeof art.token.randomImg))))))
}
