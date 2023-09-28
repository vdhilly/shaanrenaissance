
export const RenderTokenHUD = {
    listen: () => {
        Hooks.on("renderTokenHUD", ((_app, $html, data) => {
            game.shaanRenaissance.StatusEffects.onRenderTokenHUD($html[0], data)
        }))
    }
}