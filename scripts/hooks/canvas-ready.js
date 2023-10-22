export const CanvasReady = {
  listen: () => {
    Hooks.once("canvasReady", async () => {
      await game.shaanRenaissance.ConditionManager.initialize();
    });
  },
};
