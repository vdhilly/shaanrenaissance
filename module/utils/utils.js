
export function objectHasKey(obj, key) {
    return (typeof key === "string" || typeof key === "number") && key in obj;
}

export function getSelectedOrOwnActors(types, useOwnCharacter = !0) {
    const actors = canvas.tokens.controlled.flatMap((token => token.actor ? token.actor : [])).filter((actor => actor.isOwner)).filter((actor => !types || actor.isOfType(...types)));
    return 0 === actors.length && game.user.character && useOwnCharacter && actors.push(game.user.character), actors
}

const wordCharacter = String.raw`[\p{Alphabetic}\p{Mark}\p{Decimal_Number}\p{Join_Control}]`;
const nonWordCharacter = String.raw`[^\p{Alphabetic}\p{Mark}\p{Decimal_Number}\p{Join_Control}]`;
const nonWordCharacterRE = new RegExp(nonWordCharacter, "gu");
const wordBoundary = String.raw`(?:${wordCharacter})(?=${nonWordCharacter})|(?:${nonWordCharacter})(?=${wordCharacter})`;
const nonWordBoundary = String.raw`(?:${wordCharacter})(?=${wordCharacter})`;
const lowerCaseLetter = String.raw`\p{Lowercase_Letter}`;
const upperCaseLetter = String.raw`\p{Uppercase_Letter}`;
const lowerCaseThenUpperCaseRE = new RegExp(`(${lowerCaseLetter})(${upperCaseLetter}${nonWordBoundary})`, "gu");
const nonWordCharacterHyphenOrSpaceRE = /[^-\p{White_Space}\p{Alphabetic}\p{Mark}\p{Decimal_Number}\p{Join_Control}]/gu;
const upperOrWordBoundariedLowerRE = new RegExp(`${upperCaseLetter}|(?:${wordBoundary})${lowerCaseLetter}`, "gu");

export function sortStringRecord(record) {
    return Object.fromEntries(
        Object.entries(record)
            .map(function (entry) {
                entry[1] = game.i18n.localize(entry[1]);
                return entry;
            })
            .sort(function (a, b) {
                return a[1].localeCompare(b[1], game.i18n.lang);
            })
    );
}






export function sluggify(text, { camel = null } = {}) {
    if (typeof text !== "string") {
        console.warn("Non-string argument passed to `sluggify`");
        return "";
    }
    if (text === "-") {
        return text;
    }
    switch (camel) {
        case null:
            return text
                .replace(lowerCaseThenUpperCaseRE, "$1-$2")
                .toLowerCase()
                .replace(/['’]/g, "")
                .replace(nonWordCharacterRE, " ")
                .trim()
                .replace(/[-\s]+/g, "-");
        case "bactrian": {
            const dromedary = sluggify(text, {
                camel: "dromedary"
            });
            return dromedary.charAt(0).toUpperCase() + dromedary.slice(1);
        }
        case "dromedary":
            return text
                .replace(nonWordCharacterHyphenOrSpaceRE, "")
                .replace(/[-_]+/g, " ")
                .replace(upperOrWordBoundariedLowerRE, (part, index) =>
                    index === 0 ? part.toLowerCase() : part.toUpperCase()
                )
                .replace(/\s+/g, "");
        default:
            throw new Error("I don't think that's a real camel.");
    }
}

export function ErrorSR(message) {
    return Error(`SR System | ${message}`)
}
function isObject(value) {
    return "object" == typeof value && null !== value
}

export function setHasElement(set, value) {
    return set.has(value)
}
export function tupleHasValue(array, value) {
    return array.includes(value)
}
export function htmlQuery(parent, selectors) {
    return parent instanceof Element || parent instanceof Document ? parent.querySelector(selectors) : null
}
export function htmlQueryAll(parent, selectors) {

    return parent instanceof Element || parent instanceof Document ? Array.from(parent.querySelectorAll(selectors)) : []
}
export function htmlClosest(child, selectors) {
    return child instanceof Element ? child.closest(selectors) : null
}
export function localizer(prefix) {
    return function (...[suffix, formatArgs]) {
        return formatArgs ? game.i18n.format(`${prefix}.${suffix}`, formatArgs) : game.i18n.localize(`${prefix}.${suffix}`);
    };
}
export function fontAwesomeIcon(glyph, {
    style = "solid",
    fixedWidth = !1
} = {}) {
    const styleClass = `fa-${style}`,
        glyphClass = glyph.startsWith("fa-") ? glyph : `fa-${glyph}`,
        icon = document.createElement("i");
    return icon.classList.add(styleClass, glyphClass), fixedWidth && icon.classList.add("fa-fw"), icon
}
export const PHYSICAL_ITEM_TYPES = new Set(["Armement", "Armimale", "Artefact", "Manuscrit", "Outil", "Protection", "Relation", "Richesse", "Technologie", "Transport", "Bâtiment"]);
export const CHARACTER_ACTOR_TYPES = ["Personnage","PNJ","Shaani","Créature","Réseau"];
export const CHARACTER_SHEET_TABS = ["character", "powers", "symbioses", "details","morphe", "magic", "acquis", "biography"]
export const CHARACTER_SCHEMES = {element: ["moi", "lui", "eau", "terre", "animal", "vegetal", "air", "feu", "objet", "limbes"], action: ["controle", "deplacement", "non-perception", "mutation", "perception"], cles: ["comme", "dans", "sur", "de", "en"], frequence: ["frequence1", "frequence2", "frequence3", "frequence4"], portee: ["contact", "interaction", "distance", "horizon"], duree: ["duree1", "duree2", "duree3", "duree4"], cibles: ["cibles1", "cibles2", "cibles3", "cibles4"]}

export function isItemSystemData(data) {
    return (0, isObject)(data) && (0, isObject)(data.description) && "string" == typeof data.description.value && Array.isArray(data.rules) && (null === data.slug || "string" == typeof data.slug)
}