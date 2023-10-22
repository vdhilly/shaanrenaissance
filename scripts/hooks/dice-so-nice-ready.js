export const DiceSoNiceReady = {
  listen: () => {
    Hooks.on("diceSoNiceReady", (dice3d) => {
      async function loadTextures() {
        await dice3d.addTexture("TNecrose", {
          name: "Shaan Nécrose",
          composite: "source-over",
          source: "systems/shaanrenaissance/dice/black/d10Black-texture.webp",
        });
        await dice3d.addTexture("TEsprit", {
          name: "Shaan Esprit",
          composite: "source-over",
          source: "systems/shaanrenaissance/dice/yellow/d10Yellow-texture.webp",
        });
        await dice3d.addTexture("TAme", {
          name: "Shaan Ame",
          composite: "source-over",
          source: "systems/shaanrenaissance/dice/blue/d10Blue-texture.webp",
        });
        await dice3d.addTexture("TCorps", {
          name: "Shaan Corps",
          composite: "source-over",
          source: "systems/shaanrenaissance/dice/red/d10Red-texture.webp",
        });
        loadColors();
      }
      async function loadColors() {
        dice3d.addColorset(
          {
            name: "Necrose",
            description: "Shaan Renaissance Nécrose",
            category: "Shaan Renaissance",
            texture: "TNecrose",
            material: "pristine",
            foreground: "#ffffff",
            outline: "none",
            font: "ITCOfficinaSans",
            edge: "#141414",
            visibility: "visible",
          },
          "default"
        );
        dice3d.addColorset(
          {
            name: "Esprit",
            description: "Shaan Renaissance Esprit",
            category: "Shaan Renaissance",
            texture: "TEsprit",
            material: "pristine",
            foreground: "#ffffff",
            outline: "none",
            font: "ITCOfficinaSans",
            edge: "#ebac00",
            visibility: "visible",
          },
          "default"
        );
        dice3d.addColorset(
          {
            name: "Ame",
            description: "Shaan Renaissance Ame",
            category: "Shaan Renaissance",
            texture: "TAme",
            material: "pristine",
            foreground: "#ffffff",
            outline: "none",
            font: "ITCOfficinaSans",
            edge: "#002078",
            visibility: "visible",
          },
          "default"
        );
        dice3d.addColorset(
          {
            name: "Corps",
            description: "Shaan Renaissance Corps",
            category: "Shaan Renaissance",
            texture: "TCorps",
            material: "pristine",
            foreground: "#ffffff",
            outline: "none",
            font: "ITCOfficinaSans",
            edge: "#af0e00",
            visibility: "visible",
          },
          "default"
        );
      }
      loadTextures();
      loadFaces();
      async function loadFaces() {
        await dice3d.addSystem(
          {
            id: "shaan",
            name: "Shaan Renaissance",
            font: "systems/shaanrenaissance/fonts/itc-officina-sans-lt-bold.ttf",
          },
          "preferred"
        );
        await dice3d.addDicePreset(
          {
            type: "d10",
            labels: [
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "7",
              "8",
              "9",
              "systems/shaanrenaissance/dice/d10-crane.webp",
            ],
            system: "shaan",
          },
          "d10"
        );
      }
    });
  },
};
