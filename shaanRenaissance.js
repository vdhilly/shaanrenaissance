import { shaanRenaissance } from "./module/config.js";
import ShaanRItemSheet from "./module/sheets/ShaanRItemSheet.js";
import ShaanRActorsSheet from "./module/sheets/ShaanRActorsSheet.js"
import ShaanNPCSheet from "./module/sheets/ShaanNPCSheet.js";
import ShaanShaaniSheet from "./module/sheets/ShaanShaaniSheet.js";
import ShaanTrihnSheet from "./module/sheets/ShaanTrihnSheet.js";
import ShaanCreatorSet from "./module/sheets/ShaanCreatorSet.js";
import ShaanRéseauSheet from "./module/sheets/ShaanRéseauSheet.js";
import ShaanCreatureSheet from "./module/sheets/ShaanCreatureSheet.js";
import { templatePaths } from "./module/preloadTemplates.js";

async function preloadHandleBarTemplates() 
{
    return loadTemplates( templatePaths );
};


Hooks.once("init", function(){
    console.log ("SHAAN RENAISSANCE | Initialising Shaan Renaissance System");

    CONFIG.shaanRenaissance = shaanRenaissance;
    CONFIG.fontDefinitions.ITCOfficinaSans = {
      editor: !0,
      fonts: [{
        urls: ["systems/Shaan_Renaissance/fonts/itc-officina-sans-lt-bold.ttf"],
        style: "normal",
        weight: "700"
      }]
    }

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("Shaan_Renaissance", ShaanRItemSheet, {
      types: ["Pouvoir", "Armement", "Armimale", "Manuscrit", "Artefact", "Outil", "Transport", "Technologie", "Richesse", "Protection", "Relation", "Bâtiment"],
      label: "Acquis"
    });
    Items.registerSheet("Shaan_Renaissance", ShaanTrihnSheet, {
      types: ["Trihn"],
      label: "Trihn"
    });
    Items.registerSheet("Shaan_Renaissance", ShaanCreatorSet, {
      types: ["Race", "Peuple", "Caste", "Métier"],
      label: "Character Developpement"
    });
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("Shaan_Renaissance", ShaanRActorsSheet, {
      types: ["Personnage"],
      label: "Personnage"
    });
    Actors.registerSheet("Shaan_Renaissance", ShaanNPCSheet, {
      types: ["PNJ"],
      label: "PNJ"
    });
    Actors.registerSheet("Shaan_Renaissance", ShaanCreatureSheet, {
      types: ["Créature"],
      label: "Créature"
    });
    Actors.registerSheet("Shaan_Renaissance", ShaanShaaniSheet, {
      types: ["Shaani"],
      label: "Shaani"
    });
    Actors.registerSheet("Shaan_Renaissance", ShaanRéseauSheet, {
      types: ["Réseau"],
      label: "Réseau"
    });

    preloadHandleBarTemplates();

    // Handlebars
Handlebars.registerHelper('ifeq', function (a, b, options) {
  if (a == b) { return options.fn(this); }
  return options.inverse(this);
});
Handlebars.registerHelper('ifnoteq', function (a, b, options) {
  if (a != b) { return options.fn(this); }
  return options.inverse(this);
});

Hooks.on("renderSettings", (async (__app, $html) => {
  var _a;
  const html = $html[0],
  systemRow = html.querySelector(".settings-sidebar li.system"),
  systemInfo = null == systemRow ? void 0 : systemRow.cloneNode(!1);
  systemInfo.classList.remove("system"), systemInfo.classList.add("system-info");
  const links = [{
    url: "https://github.com/YoimPouet/Shaan_Renaissance/blob/main/CHANGELOG.md",
    label: "SETTINGS.Sidebar.Changelog"
  }, {
    url: "https://www.shaan-rpg.com/",
    label: "SETTINGS.Sidebar.Site"
  }, {
    url: "https://discord.gg/7fnZ9yCJZq",
    label: "SETTINGS.Sidebar.Discord"
  }].map((data => {
    const anchor = document.createElement("a");
    return anchor.href = data.url, anchor.innerText = game.i18n.localize(data.label), anchor.target = "_blank", anchor
  }));
  if(systemInfo.append(...links), null == systemRow || systemRow.after(systemInfo), !game.user.hasRole("GAMEMASTER")) return;
  const license = document.createElement("div");
  license.id = "shaan-license";
  const licenseButton = document.createElement("button");
  const licenseIcon = document.createElement("i");
  licenseIcon.classList.add("fa-solid", "fa-scale-balanced")
  licenseButton.type = "button", licenseButton.append(licenseIcon, game.i18n.localize("SETTINGS.LicenseViewer.label")), licenseButton.addEventListener("click", (() => {
    game.licenseViewer.render(!0)
  })), license.append(licenseButton);
  const header = document.createElement("h2");
  header.innerText = "Shaan Renaissance", null === (_a = html.querySelector("#settings-documentation")) || void 0 === _a || _a.after(header,license)
}));

// License
class LicenseViewer extends Application {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id:"license-viewer",
      title: game.i18n.localize("SETTINGS.LicenseViewer.label"),
      template: "systems/Shaan_Renaissance/templates/packs/license-viewer.hbs",
      width: 500,
      height: 600,
      resizable: !0
    })
  }
}
game.licenseViewer = new LicenseViewer

// Token
Token.prototype._drawAttributeBars = SRTokenDrawAttributeBars;
Token.prototype._onUpdateBarAttributes = SROnUpdateBarAttributes;

Token.prototype._onCreate =  (function () {
  let superFunction = Token.prototype._onCreate;
  return async function() {
      await superFunction.apply(this, arguments);
      this.document.bar1 = {attribute: "attributes.hpEsprit"};
      this.document.bar2 = {attribute: "attributes.hpAme"};
      this.document.bar3 = {attribute: "attributes.hpCorps"};

  }
})();
TokenDocument.prototype._onCreate =  (function () {
  let superFunction = TokenDocument.prototype._onCreate;
  return async function() {
      await superFunction.apply(this, arguments);
      this.bar1 = {attribute: "attributes.hpEsprit"};
      this.bar2 = {attribute: "attributes.hpAme"};
      this.bar3 = {attribute: "attributes.hpCorps"};
  }
})();

TokenDocument.prototype._onUpdate = (function () {
  const superFunction = TokenDocument.prototype._onUpdate;
  return async function() {
      superFunction.apply(this, arguments);

      this.object.drawBars();
  }
})();
Token.prototype.drawBars = (function() {
  let superFunction = Token.prototype.drawBars;
  return function() {
    return SRTokenDrawBars.apply(this, arguments);
  };

})();

// Override the actual draw call so we can apply our own positioning and styling to the bars
Token.prototype._drawBar = (function() {
  let superFunction = Token.prototype._drawBar;
  return function() {
    return drawSRBar.apply(this, arguments);
  };

})();
Token.prototype.getBarAttribute = (function () {
  let superFunction = Token.prototype.getBarAttribute;
  return function (barName, { alternative } = {}) {
    if(!this.actor){
      return;
    }
    return getSRTokenBarAttribute.apply(this, arguments);
  }
})();
let defaultTokenConfigOptions = TokenConfig.defaultOptions;
Object.defineProperty(TokenConfig, "defaultOptions", {
    get: function () {
        return mergeObject(defaultTokenConfigOptions, {
            template: "systems/Shaan_Renaissance/templates/scene/tokenConfig.hbs"
        });
    }
});
TokenConfig.prototype.getData = (function () {
  const superFunction = TokenConfig.prototype.getData;
  console.log(superFunction)
  return function (options) {
    let result = superFunction.apply(this, arguments);
    console.log(this.object)
    let bar3 = this.object.getBarAttribute("bar3");
    console.log(bar3)

      result.displayBar3 = bar3 && (bar3.type !== "none");
      result.bar3 = {attribute: ""}
      result.bar3Data = bar3;
    console.log(result)
    return result
  }
})();
let defaultTokenHUDOptions = TokenHUD.defaultOptions;
Object.defineProperty(TokenHUD, "defaultOptions", {
    get: function () {
        return mergeObject(defaultTokenHUDOptions, {
            template: "systems/Shaan_Renaissance/templates/hud/tokenHUD.hbs"
        });
    }
});
TokenHUD.prototype.getData = (function () {
  const superFunction = TokenHUD.prototype.getData;
  return function (options) {
      let result = superFunction.apply(this, arguments);

      let bar3 = this.object.getBarAttribute("bar3");

      result.displayBar3 = bar3 && (bar3.type !== "none");
      result.bar3 = {attribute: bar3.attribute}
      result.bar3Data = bar3;


      return result;
  };
})();

function SRTokenDrawAttributeBars() {
  const bars = new PIXI.Container();
  bars.bar1 = bars.addChild(new PIXI.Graphics());
  bars.bar2 = bars.addChild(new PIXI.Graphics());
  bars.bar3 = bars.addChild(new PIXI.Graphics());
  return bars;
}
function SRTokenDrawBars() {
  if (!this.actor || (this.document.displayBars === CONST.TOKEN_DISPLAY_MODES.NONE)) return;
  ["bar1", "bar2", "bar3"].forEach((b, i) => {
      if (!this.hasOwnProperty("bars"))
      return;
      const bar = this.bars[b];
      const attr = this.getBarAttribute(b);
      if (!attr || (attr.type !== "bar")) return bar.visible = false;
      this._drawBar(i, bar, attr);
      bar.visible = true;
  });
}
function SROnUpdateBarAttributes(updateData) {
  const update = ["bar1", "bar2", "bar3"].some(b => {
    let bar = this.data[b];
    if (!bar)
      return false;

    return bar.attribute && hasProperty(updateData, "data."+bar.attribute);
  });

  if (update)
      this.object.drawBars();
}
function drawSRBar(number, bar, data) {
  

  const val = Number(data.value);
  const pct = Math.clamped(val, 0, data.max) / data.max;
  let h = Math.max((canvas.dimensions.size / 12), 8);
  if (this.document.height >= 2) h *= 1.6;  // Enlarge the bar for large tokens

  // Stacked bars, all atop one another
  let yPositions = {
      0: this.h - (3 * h),
      1: this.h - (2 * h),
      2: this.h - h
  };

  // Let's do at least one good thing by making these colors configurable
  let colors = {
      0: "#b8985a",
      1: "#4263a3",
      2: "#c95b40"
  }

  let color = colors[number];

    bar.clear()
    .beginFill(0x000000, 0.5)
    .lineStyle(2, 0x000000, 0.9)
    .drawRoundedRect(0, 0, this.w, h, 3)
    .beginFill(color, 0.8)
    .lineStyle(1, 0x000000, 0.8)
    .drawRoundedRect(1, 1, pct * (this.w - 2), h - 2, 2);

    // Set position
    let posY = yPositions[number];
    bar.position.set(0, posY);
}
function getSRTokenBarAttribute(barName, { alternative } = {}) {
  let attribute;
  if (barName === "bar1") {
      attribute = "attributes.hpEsprit";
  } else if (barName === "bar2") {
      attribute = "attributes.hpAme";
  } else if (barName === "bar3") {
      attribute = "attributes.hpCorps";
  }
  let data = getProperty(this.actor.system, attribute);
  data = duplicate(data);
  return {
      type: "bar",
      attribute: attribute,
      value: parseInt(data.value || 0),
      max: parseInt(data.max || 0)
  }
}
Hooks.once("diceSoNiceReady", (dice3d => {
  if ((obj = dice3d) instanceof Object && ["addSystem", "addDicePreset", "addTexture", "addColorset"].every((m => m in obj))) {
    var obj;
    dice3d.addSystem({
      id: "basic",
      name: "Shaan Renaissance",
      font: "systems/Shaan_Renaissance/fonts/itc-officina-sans-lt-bold.ttf"
    });
    dice3d.addDicePreset({
      type: "d10",
      labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "systems/Shaan_Renaissance/dice/crane-blanc.png"],
      system: "basic"
    }), dice3d.addTexture("Necrose", {
      name: "Shaan Nécrose",
      composite: "source-over",
      source: "systems/Shaan_Renaissance/dice/black/d10Black-texture.webp"
    }).then((() =>  {
      dice3d.addColorset({
        name: "Necrose",
        description: "Shaan Renaissance Nécrose",
        category: "Shaan Renaissance",
        texture: "Necrose",
        material: "none",
        foreground: "#ffffff",
        outline: "none",
        font: "ITCOfficinaSans",
        edge: "#3e3d40",
        visibility: "visible"
      })
    })),
       dice3d.addTexture("Esprit", {
      name: "Shaan Esprit",
      composite: "source-over",
      source: "systems/Shaan_Renaissance/dice/yellow/d10Yellow-texture.webp"
    }).then((() => {
      dice3d.addColorset({
        name: "Esprit",
        description: "Shaan Renaissance Esprit",
        category: "Shaan Renaissance",
        texture: "Esprit",
        material: "none",
        foreground: "#ffffff",
        outline: "none",
        font: "ITCOfficinaSans",
        edge: "#d7b400",
        visibility: "visible"
      })
    })),
    dice3d.addTexture("Ame", {
      name: "Shaan Ame",
      composite: "source-over",
      source: "systems/Shaan_Renaissance/dice/blue/d10Blue-texture.webp"
    }).then((() => {
      dice3d.addColorset({
        name: "Ame",
        description: "Shaan Renaissance Ame",
        category: "Shaan Renaissance",
        texture: "Ame",
        material: "none",
        foreground: "#ffffff",
        outline: "none",
        font: "ITCOfficinaSans",
        edge: "#0058a3",
        visibility: "visible"
      })
    })),
    dice3d.addTexture("Corps", {
      name: "Shaan Corps",
      composite: "source-over",
      source: "systems/Shaan_Renaissance/dice/red/d10Red-texture.webp"
    }).then((() => {
      dice3d.addColorset({
        name: "Corps",
        description: "Shaan Renaissance Corps",
        category: "Shaan Renaissance",
        texture: "Corps",
        material: "none",
        foreground: "#ffffff",
        outline: "none",
        font: "ITCOfficinaSans",
        edge: "#e43525",
        visibility: "visible"
      })
    }))
  }
}))
});