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
import { TokenSR } from "./module/token/TokenSR.js";
import { TokenDocumentSR } from "./module/token/TokenDocumentSR.js";
import { ActorSR } from "./module/ActorSR.js";
import { TokenConfigSR } from "./module/token/TokenConfigSR.js";
import { SRTokenHUD } from "./module/token/SRTokenHUD.js";

async function preloadHandleBarTemplates() 
{
    return loadTemplates( templatePaths );
};


Hooks.once("init", function(){
    console.log ("SHAAN RENAISSANCE | Initialising Shaan Renaissance System");

    CONFIG.shaanRenaissance = shaanRenaissance;
    CONFIG.Actor.documentClass = ActorSR;
    CONFIG.Token.objectClass = TokenSR;
    CONFIG.Token.documentClass = TokenDocumentSR;
    CONFIG.Token.prototypeSheetClass = TokenConfigSR;
    CONFIG.fontDefinitions.ITCOfficinaSans = {
      editor: !0,
      fonts: [{
        urls: ["systems/Shaan_Renaissance/fonts/itc-officina-sans-lt-bold.ttf"],
        style: "normal",
        weight: "700"
      }]
    }

    DocumentSheetConfig.registerSheet(TokenDocument, "Shaan_Renaissance", TokenConfigSR, { makeDefault: true });
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

// Token HUD
Hooks.once("ready", function () {
  canvas.hud.token = new SRTokenHUD();
})

// DsN
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