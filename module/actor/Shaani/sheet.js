import { htmlClosest, htmlQuery, htmlQueryAll } from "../../utils/utils.js";
import { CreatureSR } from "../Créature/document.js";
import { NpcSR } from "../PNJ/document.js";
import { PersonnageSR } from "../Personnage/PersonnageSR.js";
import { ActorSheetSR } from "../sheet.js";
import { ItemSummaryRenderer } from "../sheet/item-summary-renderer.js";

export class ShaaniSheetSR extends ActorSheetSR {
  constructor() {
    super(...arguments), (this.itemRenderer = new ItemSummaryRenderer(this));
  }
  static get defaultOptions() {
    const options = super.defaultOptions;
    return {
      ...options,
      classes: [...options.classes, "shaani"],
      width: 720,
      height: 720,
      template: "systems/shaanrenaissance/templates/actors/Shaani/sheet.hbs",
      scrollY: [".tab.active", ".tab.active .content"],
      tabs: [
        {
          navSelector: "form > nav",
          contentSelector: ".container",
          initial: "main",
        },
      ],
    };
  }

  async getData(options) {
    options.id || (options.id = this.id);
    const actorData = this.actor.toObject(!1),
      sheetData = {
        cssClass: this.actor.isOwner ? "editable" : "locked",
        editable: this.isEditable,
        document: this.actor,
        limited: this.actor.limited,
        owner: this.actor.isOwner,
        title: this.title,
        actor: actorData,
        data: actorData.system,
        members: this.prepareMembers(),
        items: actorData.items,
        config: CONFIG.shaanRenaissance,
        user: {
          isGM: game.user.isGM,
        },
      };
    this.prepareMembersItems(sheetData);

    console.log(sheetData);
    return sheetData;
  }
  prepareMembersItems(sheetData) {
    sheetData.Acquis = {
      Armement: [],
      Armimale: [],
      Artefact: [],
      Manuscrit: [],
      Outil: [],
      Protection: [],
      Relation: [],
      Richesse: [],
      Technologie: [],
      Transport: [],
      Batiment: [],
    };
    sheetData.Powers = {
      Esprit: [],
      Ame: [],
      Corps: [],
      Necrose: [],
    };
    for (const member of sheetData.members) {
      this.prepareMembersAcquis(sheetData, member);
      this.prepareMembersPowers(sheetData, member);
    }
  }
  prepareMembersAcquis(sheetData, member) {
    const Armement = member.actor.items.filter(function (item) {
      return item.type == "Armement" && item.system.morphe == false;
    });
    Armement.forEach((item) => {
      sheetData.Acquis.Armement.push({ ...item, parent: item.parent, _id:item._id });

    });
    const Armimale = member.actor.items.filter(function (item) {
      return item.type == "Armimale";
    });
    Armimale.forEach((item) => {
      sheetData.Acquis.Armimale.push({ ...item, parent: item.parent, _id:item._id });
    });
    const Artefact = member.actor.items.filter(function (item) {
      return item.type == "Artefact";
    });
    Artefact.forEach((item) => {
      sheetData.Acquis.Artefact.push({ ...item, parent: item.parent,_id:item._id });
    });
    const Manuscrit = member.actor.items.filter(function (item) {
      return item.type == "Manuscrit";
    });
    Manuscrit.forEach((item) => {
      sheetData.Acquis.Manuscrit.push({ ...item, parent: item.parent, _id:item._id });
    });
    const Outil = member.actor.items.filter(function (item) {
      return item.type == "Outil" && item.system.morphe == false;
    });
    Outil.forEach((item) => {
      sheetData.Acquis.Outil.push({ ...item, parent: item.parent, _id:item._id });
    });
    const Protection = member.actor.items.filter(function (item) {
      return item.type == "Protection" && item.system.morphe == false;
    });
    Protection.forEach((item) => {
      sheetData.Acquis.Protection.push({ ...item, parent: item.parent, _id:item._id });
    });
    const Relation = member.actor.items.filter(function (item) {
      return item.type == "Relation";
    });
    Relation.forEach((item) => {
      sheetData.Acquis.Relation.push({ ...item, parent: item.parent, _id:item._id });
    });
    const Richesse = member.actor.items.filter(function (item) {
      return item.type == "Richesse";
    });
    Richesse.forEach((item) => {
      sheetData.Acquis.Richesse.push({ ...item, parent: item.parent, _id:item._id });
    });
    const Technologie = member.actor.items.filter(function (item) {
      return item.type == "Technologie" && item.system.morphe == false;
    });
    Technologie.forEach((item) => {
      sheetData.Acquis.Technologie.push({ ...item, parent: item.parent, _id:item._id });
    });
    const Transport = member.actor.items.filter(function (item) {
      return item.type == "Transport";
    });
    Transport.forEach((item) => {
      sheetData.Acquis.Transport.push({ ...item, parent: item.parent, _id:item._id });
    });
    const Batiment = member.actor.items.filter(function (item) {
      return item.type == "Bâtiment";
    });
    Batiment.forEach((item) => {
      sheetData.Acquis.Batiment.push({ ...item, parent: item.parent, _id:item._id });
    });
  }
  prepareMembersPowers(sheetData, member) {
    const Esprit = member.actor.items.filter(function (item) {
      return (
        (item.type == "Pouvoir" && item.system.trihn == "Esprit") ||
        item.system.pouvoir.value == "Astuce de Technique" ||
        item.system.pouvoir.value == "Secret de Savoir" ||
        item.system.pouvoir.value == "Privilège de Social"
      );
    });
    Esprit.forEach((item) => {
      sheetData.Powers.Esprit.push({ ...item, parent: item.parent, _id:item._id });
    });
    const Ame = member.actor.items.filter(function (item) {
      return (
        (item.type == "Pouvoir" && item.system.trihn == "Âme") ||
        item.system.pouvoir.value == "Création d'Arts" ||
        item.system.pouvoir.value == "Symbiose de Shaan" ||
        item.system.pouvoir.value == "Sort de Magie"
      );
    });
    Ame.forEach((item) => {
      sheetData.Powers.Ame.push({ ...item, parent: item.parent, _id:item._id });
    });
    const Corps = member.actor.items.filter(function (item) {
      return (
        (item.type == "Pouvoir" && item.system.trihn == "Corps") ||
        item.system.pouvoir.value == "Transe de Rituels" ||
        item.system.pouvoir.value == "Exploit de Survie" ||
        item.system.pouvoir.value == "Tactique de Combat"
      );
    });
    Corps.forEach((item) => {
      sheetData.Powers.Corps.push({ ...item, parent: item.parent, _id:item._id });
    });
    const Necrose = member.actor.items.filter(function (item) {
      return (
        (item.type == "Pouvoir" && item.system.trihn == "Nécrose") ||
        item.system.pouvoir.value == "Tourment de Nécrose"
      );
    });
    Necrose.forEach((item) => {
      sheetData.Powers.Necrose.push({ ...item, parent: item.parent, _id:item._id });
    });
  }
  prepareMembers() {
    return this.actor.members.map((actor) => {
      const observer = actor.testUserPermission(game.user, "OBSERVER");
      const restricted = !(
        game.settings.get("shaanrenaissance", "showShaaniStats") || observer
      );
      let race = actor.items.filter(function (item) {
        return item.type == "Race";
      });
      let peuple = actor.items.filter(function (item) {
        return item.type == "Peuple";
      });
      let caste = actor.items.filter(function (item) {
        return item.type == "Caste";
      });
      let metier = actor.items.filter(function (item) {
        return item.type == "Métier";
      });
      return {
        actor,
        owner: actor.isOwner,
        observer,
        limited: observer || actor.limited,
        hp: {
          esprit: actor.system.attributes.hpEsprit,
          ame: actor.system.attributes.hpAme,
          corps: actor.system.attributes.hpCorps,
        },
        items: actor.items,
        race: race[0],
        peuple: peuple[0],
        caste: caste[0],
        metier: metier[0],
        restricted,
      };
    });
  }
  activateListeners($html) {
    super.activateListeners($html);
    const html = $html[0];

    if ((this.itemRenderer.activateListeners(html), !this.options.editable))
    return;

    // Add open actor sheet links
    for (const openSheetLink of htmlQueryAll(
      html,
      "[data-action=open-sheet]"
    )) {
      const tab = openSheetLink.dataset.tab;
      const actorUUID = htmlClosest(openSheetLink, "[data-actor-uuid]")?.dataset
        .actorUuid;
      const actor = fromUuidSync(actorUUID ?? "");
      openSheetLink.addEventListener("click", async () =>
        actor?.sheet.render(true, { tab })
      );
    }
    for (const memberElem of htmlQueryAll(html, "[data-actor-uuid]")) {
      const actorUUID = memberElem.dataset.actorUuid;
      const actor = this.document.members.find((m) => m.uuid === actorUUID);

      if (game.user.isGM) {
        htmlQuery(memberElem, "a[data-action=remove-member]")?.addEventListener(
          "click",
          async (event) => {
            const confirmed = event.ctrlKey
              ? true
              : await Dialog.confirm({
                  title: game.i18n.localize(
                    "SR.Actor.Shaani.RemoveMember.Title"
                  ),
                  content: game.i18n.localize(
                    "SR.Actor.Shaani.RemoveMember.Content"
                  ),
                });
            if (confirmed && actor) {
              this.document.removeMembers(actor);
            }
          }
        );
      }
    }
  }
  async _onDropActor(event, data) {
    await super._onDropActor(event, data);

    const actor = fromUuidSync(data.uuid);
    if (
      actor instanceof PersonnageSR ||
      actor instanceof NpcSR ||
      actor instanceof CreatureSR
    ) {
      this.document.addMembers(actor);
    }
  }
}
