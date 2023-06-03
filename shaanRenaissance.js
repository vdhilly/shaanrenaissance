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
import { ItemSR } from "./module/ItemSR.js";
import * as Puiser from "./module/jets/puiser.js"
import { SRActiveEffectConfig } from "./module/ActiveEffects/SRActiveEffectConfig.js";

async function preloadHandleBarTemplates() 
{
    return loadTemplates( templatePaths );
};
function registerSystemSettings() {
  game.settings.register("shaanrenaissance", "showCheckOptions", {
    config: true,
    scope: "client",
    name: "SETTINGS.showCheckOptions.name",
    hint: "SETTINGS.showCheckOptions.label",
    type: Boolean,
    default: true
  });
}


Hooks.once("init", function(){
    console.log ("SHAAN RENAISSANCE | Initialising Shaan Renaissance System");

    CONFIG.shaanRenaissance = shaanRenaissance;
    CONFIG.Actor.documentClass = ActorSR;
    CONFIG.Token.objectClass = TokenSR;
    CONFIG.Token.documentClass = TokenDocumentSR;
    CONFIG.Token.prototypeSheetClass = TokenConfigSR;
    CONFIG.Item.documentClass = ItemSR;
    CONFIG.ActiveEffect.sheetClass = SRActiveEffectConfig;
    CONFIG.fontDefinitions.ITCOfficinaSans = {
      editor: !0,
      fonts: [
        {
          urls: ["systems/shaanrenaissance/fonts/itc-officina-sans-lt-book.ttf"],
          style: "normal",
          weight: "400"
        },
        {
        urls: ["systems/shaanrenaissance/fonts/itc-officina-sans-lt-bold.ttf"],
        style: "normal",
        weight: "700"
        },
        {
          urls: ["systems/shaanrenaissance/fonts/itc-officina-sans-std-bold-italic-1361504767.ttf"],
          style: "italic",
          weight: "700"
        }]
    }

    DocumentSheetConfig.registerSheet(ActiveEffect, 'shaanrenaissance', SRActiveEffectConfig, {makeDefault: true, label: "test"})
    DocumentSheetConfig.registerSheet(TokenDocument, "shaanrenaissance", TokenConfigSR, { makeDefault: true });
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("shaanrenaissance", ShaanRItemSheet, {
      types: ["Pouvoir", "Armement", "Armimale", "Manuscrit", "Artefact", "Outil", "Transport", "Technologie", "Richesse", "Protection", "Relation", "Bâtiment"],
      label: "Acquis"
    });
    Items.registerSheet("shaanrenaissance", ShaanTrihnSheet, {
      types: ["Trihn"],
      label: "Trihn"
    });
    Items.registerSheet("shaanrenaissance", ShaanCreatorSet, {
      types: ["Race", "Peuple", "Caste", "Métier"],
      label: "Character Developpement"
    });
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("shaanrenaissance", ShaanRActorsSheet, {
      types: ["Personnage"],
      label: "Personnage"
    });
    Actors.registerSheet("shaanrenaissance", ShaanNPCSheet, {
      types: ["PNJ"],
      label: "PNJ"
    });
    Actors.registerSheet("shaanrenaissance", ShaanCreatureSheet, {
      types: ["Créature"],
      label: "Créature"
    });
    Actors.registerSheet("shaanrenaissance", ShaanShaaniSheet, {
      types: ["Shaani"],
      label: "Shaani"
    });
    Actors.registerSheet("shaanrenaissance", ShaanRéseauSheet, {
      types: ["Réseau"],
      label: "Réseau"
    });

    preloadHandleBarTemplates();

    registerSystemSettings();

    // Handlebars
Handlebars.registerHelper('ifeq', function (a, b, options) {
  if (a == b) { return options.fn(this); }
  return options.inverse(this);
});
Handlebars.registerHelper('ifnoteq', function (a, b, options) {
  if (a != b) { return options.fn(this); }
  return options.inverse(this);
});
Handlebars.registerHelper('gt', function(a ,b, options) {
  if (a > b) { return options.fn(this); }
  return options.inverse(this);
})

Hooks.on("renderSettings", (async (__app, $html) => {
  var _a;
  const html = $html[0]
  // License btn
  const license = document.createElement("div");
  license.id = "shaan-license";
  const licenseButton = document.createElement("button");
  const licenseIcon = document.createElement("i");
  licenseIcon.classList.add("fa-solid", "fa-scale-balanced")
  licenseButton.type = "button", licenseButton.append(licenseIcon, game.i18n.localize("SETTINGS.LicenseViewer.label")), licenseButton.addEventListener("click", (() => {
    game.licenseViewer.render(!0)
  })), license.append(licenseButton);
  // Bug btn
  const signalBug = document.createElement("div");
  signalBug.id = "shaan-bugs";
  const signalBugButtonA = document.createElement("a")
  signalBugButtonA.href = "https://github.com/YoimPouet/shaanrenaissance/issues/new/choose";
  const signalBugButton = document.createElement("button"),
  signalBugIcon = document.createElement("i");
  signalBugIcon.classList.add("fa-solid", "fa-bug");
  signalBugButton.type = "button", signalBugButton.append(signalBugIcon, game.i18n.localize("SETTINGS.signalBug.label")), 
  signalBugButtonA.append(signalBugButton)
  signalBug.append(signalBugButtonA)
  // Website btn
  const Website = document.createElement("div");
  Website.id = "shaan-website";
  const WebsiteButtonA = document.createElement("a")
  WebsiteButtonA.href = "https://www.shaan-rpg.com/";
  const WebsiteButton = document.createElement("button"),
  WebsiteIcon = document.createElement("i");
  WebsiteIcon.classList.add("fa-regular", "fa-globe");
  WebsiteButton.type = "button", WebsiteButton.append(WebsiteIcon, game.i18n.localize("SETTINGS.Sidebar.Site")), 
  WebsiteButtonA.append(WebsiteButton)
  Website.append(WebsiteButtonA)
  // Discord btn
  const Discord = document.createElement("div");
  Discord.id = "shaan-discord";
  const DiscordButtonA = document.createElement("a")
  DiscordButtonA.href = "https://discord.gg/7fnZ9yCJZq";
  const DiscordButton = document.createElement("button"),
  DiscordIcon = document.createElement("i");
  DiscordIcon.classList.add("fa-brands", "fa-discord");
  DiscordButton.type = "button", DiscordButton.append(DiscordIcon, game.i18n.localize("SETTINGS.Sidebar.Discord")), 
  DiscordButtonA.append(DiscordButton)
  Discord.append(DiscordButtonA)
  // Changelog btn
  const Changelog = document.createElement("div");
  Changelog.id = "shaan-Changelog";
  const ChangelogButtonA = document.createElement("a")
  ChangelogButtonA.href = "https://github.com/YoimPouet/shaanrenaissance/blob/main/CHANGELOG.md";
  const ChangelogButton = document.createElement("button"),
  ChangelogIcon = document.createElement("i");
  ChangelogIcon.classList.add("fa-solid", "fa-list");
  ChangelogButton.type = "button", ChangelogButton.append(ChangelogIcon, game.i18n.localize("SETTINGS.Sidebar.Changelog")), 
  ChangelogButtonA.append(ChangelogButton)
  Changelog.append(ChangelogButtonA)

  const header = document.createElement("h2");
  header.innerText = "Shaan Renaissance", null === (_a = html.querySelector("#settings-documentation")) || void 0 === _a || _a.after(header,license,Website,Discord,Changelog,signalBug)
}));

// OptGroup Dialog Item
function extractOptGroup(select, label, types) {
  const filtered = [...select.querySelectorAll(":scope > option").values()].filter((option => !types || types.includes(option.value))),
  optgroup = document.createElement("optgroup");
  optgroup.label = label;
  console.log(filtered)
  for(const physicalElement of filtered) optgroup.appendChild(physicalElement);
  return optgroup
}
Hooks.on("renderDialog", ((_dialog, $html) => {
  const element = $html[0];
  if(element.classList.contains("dialog-item-create")) {
    const select = element.querySelector("select[name=type]"),
    categories = game.i18n.translations.Item.CreationDialog.Categories;
    select && (select.append(extractOptGroup(select, categories.Acquis, ["Armement", "Armimale", "Manuscrit", "Artefact", "Outil", "Transport", "Technologie", "Richesse", "Protection", "Relation", "Bâtiment"])), select.append(extractOptGroup(select, categories.Personnage, ["Race", "Peuple", "Caste", "Métier"])), select.append(extractOptGroup(select, categories.Autres)), select.querySelector("option").selected = !0)
  }
}))

// License
class LicenseViewer extends Application {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id:"license-viewer",
      title: game.i18n.localize("SETTINGS.LicenseViewer.label"),
      template: "systems/shaanrenaissance/templates/packs/license-viewer.hbs",
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

Hooks.on('diceSoNiceReady', (dice3d) => {
  async function loadTextures(){
    await dice3d.addTexture("TNecrose", {
      name: "Shaan Nécrose",
      composite: "source-over",
      source: "systems/shaanrenaissance/dice/black/d10Black-texture.webp"
    });
    await dice3d.addTexture("TEsprit", {
      name: "Shaan Esprit",
      composite: "source-over",
      source: "systems/shaanrenaissance/dice/yellow/d10Yellow-texture.webp"
    });
    await dice3d.addTexture("TAme", {
      name: "Shaan Ame",
      composite: "source-over",
      source: "systems/shaanrenaissance/dice/blue/d10Blue-texture.webp"
    });
    await dice3d.addTexture("TCorps", {
      name: "Shaan Corps",
      composite: "source-over",
      source: "systems/shaanrenaissance/dice/red/d10Red-texture.webp"
    });
    loadColors();
  }
  async function loadColors(){
    dice3d.addColorset({
      name: "Necrose",
      description: "Shaan Renaissance Nécrose",
      category: "Shaan Renaissance",
      texture: "TNecrose",
      material: "pristine",
      foreground: "#ffffff",
      outline: "none",
      font: "ITCOfficinaSans",
      edge: "#141414",
      visibility: "visible"
    }, "default");
    dice3d.addColorset({
      name: "Esprit",
      description: "Shaan Renaissance Esprit",
      category: "Shaan Renaissance",
      texture: "TEsprit",
      material: "pristine",
      foreground: "#ffffff",
      outline: "none",
      font: "ITCOfficinaSans",
      edge: "#ebac00",
      visibility: "visible"
    }, "default");
    dice3d.addColorset({
      name: "Ame",
      description: "Shaan Renaissance Ame",
      category: "Shaan Renaissance",
      texture: "TAme",
      material: "pristine",
      foreground: "#ffffff",
      outline: "none",
      font: "ITCOfficinaSans",
      edge: "#002078",
      visibility: "visible"
    }, "default");
    dice3d.addColorset({
      name: "Corps",
      description: "Shaan Renaissance Corps",
      category: "Shaan Renaissance",
      texture: "TCorps",
      material: "pristine",
      foreground: "#ffffff",
      outline: "none",
      font: "ITCOfficinaSans",
      edge: "#af0e00",
      visibility: "visible"
    }, "default");
  }
  loadTextures();
  loadFaces();
  async function loadFaces(){
    await dice3d.addSystem({id:"shaan",name:"Shaan Renaissance",font:"systems/shaanrenaissance/fonts/itc-officina-sans-lt-bold.ttf"}, "preferred");
    await dice3d.addDicePreset({
      type:"d10",
      labels:["systems/shaanrenaissance/dice/d10-crane.webp","1", "2", "3", "4", "5", "6", "7", "8", "9"],
      system:"shaan"
    }, "d10")
  }
})
});

// Puiser
Hooks.on('renderChatMessage', (app, html, data) => {
  Puiser.hideChatPuiserButtons(app, html, data);
  Puiser.addChatListeners(app, html, data)
});
