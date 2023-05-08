import { shaanRenaissance } from "./module/config.js";
import ShaanRItemSheet from "./module/sheets/ShaanRItemSheet.js";
import ShaanRActorsSheet from "./module/sheets/ShaanRActorsSheet.js"
import ShaanNPCSheet from "./module/sheets/ShaanNPCSheet.js";
import ShaanShaaniSheet from "./module/sheets/ShaanShaaniSheet.js";
import ShaanTrihnSheet from "./module/sheets/ShaanTrihnSheet.js";
import ShaanCreatorSet from "./module/sheets/ShaanCreatorSet.js";
import ShaanRéseauSheet from "./module/sheets/ShaanRéseauSheet.js";
import ShaanCreatureSheet from "./module/sheets/ShaanCreatureSheet.js";


async function preloadHandleBarTemplates() 
{
    // register templates parts
    const templatePaths = [
      // Character sheet
      // Sidebar
      "systems/Shaan_Renaissance/templates/actors/Personnage/sidebar/health.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/sidebar/armor.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/partials/header.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/sidebar/initiative.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/sidebar/jets.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/sidebar/reserve.hbs",

      // Content
      "systems/Shaan_Renaissance/templates/actors/Personnage/tabs/acquis.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/tabs/biography.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/tabs/general.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/tabs/magic.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/tabs/powers.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/partials/background.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/partials/domaincircle.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/partials/specialisations.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/partials/ressources.hbs",

      // NPC
      "systems/Shaan_Renaissance/templates/actors/PNJ/partials/cercle.hbs",
      "systems/Shaan_Renaissance/templates/actors/PNJ/partials/general.hbs",
      "systems/Shaan_Renaissance/templates/actors/PNJ/partials/powers.hbs",
      "systems/Shaan_Renaissance/templates/actors/PNJ/partials/bio.hbs",
      "systems/Shaan_Renaissance/templates/actors/PNJ/partials/acquis.hbs",
      "systems/Shaan_Renaissance/templates/actors/PNJ/partials/specialisations.hbs",
      "systems/Shaan_Renaissance/templates/actors/PNJ/partials/armor.hbs",

      // Creature
      "systems/Shaan_Renaissance/templates/actors/Créature/partials/cercle.hbs",
      "systems/Shaan_Renaissance/templates/actors/Créature/partials/general.hbs",
      "systems/Shaan_Renaissance/templates/actors/Créature/partials/powers.hbs",
      "systems/Shaan_Renaissance/templates/actors/Créature/partials/bio.hbs",
      "systems/Shaan_Renaissance/templates/actors/Créature/partials/acquis.hbs",
      "systems/Shaan_Renaissance/templates/actors/Créature/partials/specialisations.hbs",
      "systems/Shaan_Renaissance/templates/actors/Créature/partials/armor.hbs",

      // Shaani
      // Sidebar
      "systems/Shaan_Renaissance/templates/actors/Shaani/sidebar/health.hbs",
      "systems/Shaan_Renaissance/templates/actors/Shaani/sidebar/armor.hbs",
      "systems/Shaan_Renaissance/templates/actors/Shaani/partials/header.hbs",
      "systems/Shaan_Renaissance/templates/actors/Shaani/sidebar/initiative.hbs",
      "systems/Shaan_Renaissance/templates/actors/Shaani/sidebar/jets.hbs",
      "systems/Shaan_Renaissance/templates/actors/Shaani/sidebar/reserve.hbs",

      // Content
      "systems/Shaan_Renaissance/templates/actors/Shaani/tabs/acquis.hbs",
      "systems/Shaan_Renaissance/templates/actors/Shaani/tabs/details.hbs",
      "systems/Shaan_Renaissance/templates/actors/Shaani/tabs/general.hbs",
      "systems/Shaan_Renaissance/templates/actors/Shaani/tabs/magic.hbs",
      "systems/Shaan_Renaissance/templates/actors/Shaani/tabs/symbioses.hbs",
      "systems/Shaan_Renaissance/templates/actors/Shaani/tabs/powers.hbs",
      "systems/Shaan_Renaissance/templates/actors/Shaani/partials/background.hbs",
      "systems/Shaan_Renaissance/templates/actors/Shaani/partials/domaincircle.hbs",
      "systems/Shaan_Renaissance/templates/actors/Shaani/partials/specialisations.hbs",
      "systems/Shaan_Renaissance/templates/actors/Shaani/partials/ressources.hbs",

      // Réseau
      // Sidebar
      "systems/Shaan_Renaissance/templates/actors/Réseau/sidebar/health.hbs",
      "systems/Shaan_Renaissance/templates/actors/Réseau/sidebar/armor.hbs",
      "systems/Shaan_Renaissance/templates/actors/Réseau/partials/header.hbs",
      "systems/Shaan_Renaissance/templates/actors/Réseau/sidebar/initiative.hbs",
      "systems/Shaan_Renaissance/templates/actors/Réseau/sidebar/jets.hbs",
      "systems/Shaan_Renaissance/templates/actors/Réseau/sidebar/reserve.hbs",

      // Content
      "systems/Shaan_Renaissance/templates/actors/Réseau/tabs/acquis.hbs",
      "systems/Shaan_Renaissance/templates/actors/Réseau/tabs/details.hbs",
      "systems/Shaan_Renaissance/templates/actors/Réseau/tabs/general.hbs",
      "systems/Shaan_Renaissance/templates/actors/Réseau/tabs/magic.hbs",
      "systems/Shaan_Renaissance/templates/actors/Réseau/tabs/powers.hbs",
      "systems/Shaan_Renaissance/templates/actors/Réseau/partials/background.hbs",
      "systems/Shaan_Renaissance/templates/actors/Réseau/partials/domaincircle.hbs",
      "systems/Shaan_Renaissance/templates/actors/Réseau/partials/specialisations.hbs",
      "systems/Shaan_Renaissance/templates/actors/Réseau/partials/ressources.hbs",

      // Item sheets
      "systems/Shaan_Renaissance/templates/items/partials/header.hbs",

      // JETS
      "systems/Shaan_Renaissance/templates/chat/initiative.hbs",
      "systems/Shaan_Renaissance/templates/chat/domainTest-dialog.hbs"

    ];
    return loadTemplates( templatePaths );
};


Hooks.once("init", function(){
    console.log ("SHAAN RENAISSANCE | Initialising Shaan Renaissance System");

    CONFIG.shaanRenaissance = shaanRenaissance;

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
  });

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
