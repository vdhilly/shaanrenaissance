export const HotBar = {
    listen: () => {
        Hooks.on("hotbarDrop", async (bar, data, slot) => {

            // Vérifie si l'objet déposé est un acteur
            if (data.type === "Actor") {
                const actor = game.actors.get(data.uuid.split(".")[1]);
                if (!actor) return;

                // Création de la macro
                const macro = await Macro.create({
                    name: actor.name,
                    type: "script",
                    img: actor.img, 
                    command: `game.actors.get("${actor.id}").sheet.render(true);`
                });

                // Ajoute la macro dans la hotbar
                await game.user.assignHotbarMacro(macro, slot);
            }
        });
    }
}