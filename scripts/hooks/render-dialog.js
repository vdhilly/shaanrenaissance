
export const RenderDialog = {
    listen: () => {
        Hooks.on("renderDialog", ((_dialog, $html) => {
            const element = $html[0];
            if(element.classList.contains("dialog-item-create")) {
              const select = element.querySelector("select[name=type]"),
              categories = game.i18n.translations.Item.CreationDialog.Categories;
              select && (select.append(extractOptGroup(select, categories.Acquis, ["Armement", "Armimale", "Manuscrit", "Artefact", "Outil", "Transport", "Technologie", "Richesse", "Protection", "Relation", "Bâtiment"])), select.append(extractOptGroup(select, categories.Personnage, ["Race", "Peuple", "Caste", "Métier"])), select.append(extractOptGroup(select, categories.Autres)), select.querySelector("option").selected = !0)
            }
        }))
    }
};
function extractOptGroup(select, label, types) {
    const filtered = [...select.querySelectorAll(":scope > option").values()].filter((option => !types || types.includes(option.value))),
    optgroup = document.createElement("optgroup");
    optgroup.label = label;
    for(const physicalElement of filtered) optgroup.appendChild(physicalElement);
    return optgroup
}