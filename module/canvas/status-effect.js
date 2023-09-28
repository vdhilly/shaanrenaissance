import { ErrorSR } from "../utils/utils.js";

export class StatusEffects {
    static initialize() {
        console.log("TEST1")
        CONFIG.shaanRenaissance.statusEffects.iconDir = "systems/shaanrenaissance/icons/conditions/"
        this.updateStatusIcons();
    }
    static get conditions() {
        return LocalizeSR.translations.shaanRenaissance.condition
    }
    static async onRenderTokenHUD(html, tokenData) {
        var _b, _c, _d;
        const token = canvas.tokens.get(tokenData._id);
        if (!token) return;
        const iconGrid = html.querySelector(".status-effects");
        if (!iconGrid) throw (0, ErrorSR)("Unexpected error retrieving status effects grid");
        console.log(token.actor)
        const affectingConditions = null !== (_c = null === (_b = token.actor) || void 0 === _b ? void 0 : _b.conditions.active.filter((c => c.isInHUD))) && void 0 !== _c ? _c : [],
            titleBar = document.createElement("div");
        titleBar.className = "title-bar", iconGrid.append(titleBar);
        const statusIcons = iconGrid.querySelectorAll(".effect-control");
        for (const icon of statusIcons) {
            const picture = document.createElement("picture");
            picture.classList.add("effect-control"), picture.dataset.statusId = icon.dataset.statusId, picture.title = icon.title;
            const iconSrc = icon.getAttribute("src");
            picture.setAttribute("src", iconSrc);
            const newIcon = document.createElement("img");
            newIcon.src = iconSrc, picture.append(newIcon), icon.replaceWith(picture);
            const slug = null !== (_d = picture.dataset.statusId) && void 0 !== _d ? _d : "",
                affecting = affectingConditions.filter((c => c.slug === slug));
            // if ((affecting.length > 0 || iconSrc === token.document.overlayEffect) && picture.classList.add("active"), affecting.length > 0) {
            //     const isOverridden = affecting.every((c => c.system.references.overriddenBy.length > 0)),
            //         isLocked = affecting.every((c => c.isLocked)),
            //         hasValue = affecting.some((c => c.value));
            //     if (isOverridden) {
            //         picture.classList.add("overridden");
            //         const badge = (0, _util_1.fontAwesomeIcon)("angle-double-down");
            //         badge.classList.add("badge"), picture.append(badge)
            //     } else if (isLocked) {
            //         picture.classList.add("locked");
            //         const badge = (0, _util_1.fontAwesomeIcon)("lock");
            //         badge.classList.add("badge"), picture.append(badge)
            //     } else if (hasValue) {
            //         picture.classList.add("valued");
            //         const badge = document.createElement("i");
            //         badge.classList.add("badge");
            //         const value = Math.max(...affecting.map((c => {
            //             var _b;
            //             return null !== (_b = c.value) && void 0 !== _b ? _b : 1
            //         })));
            //         badge.innerText = value.toString(), picture.append(badge)
            //     }
            // }
        }
        // __classPrivateFieldGet(this, _a, "m", _StatusEffects_activateListeners).call(this, iconGrid)
    }
    static updateStatusIcons() {
        console.log("TEST")
        CONFIG.statusEffects = Object.entries(CONFIG.shaanRenaissance.statusEffects.conditions).map((([id, label]) => ({
            id,
            label, 
            icon: `systems/shaanrenaissance/icons/conditions/${id}.webp`
        }))), CONFIG.statusEffects.push({
            id: "dead",
            label: "SR.Actor.Dead",
            icon: CONFIG.controlIcons.defeated
        })
    }
}
