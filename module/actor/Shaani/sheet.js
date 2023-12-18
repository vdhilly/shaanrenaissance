import * as Dice from "../../jets/dice.js";
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
    this.defineTrihnMax(sheetData);
    this.processDomains(sheetData);
    this.processSkills(sheetData)

    console.log(sheetData);
    return sheetData;
  }
  processDomains(sheetData){
    const shaandars = sheetData.data.details.shaandars

    for(const key in shaandars){
      if(shaandars[key].length === 1) {
        sheetData.data.skills[key].rank = shaandars[key][0].system.skills[key].rank
      } else if(shaandars[key].length > 1) {
        let ranks = []
          for (const shaandar in shaandars[key]){
            if(shaandar !== "") {
            ranks.push(shaandars[key][shaandar].system.skills[key].rank)
            }
          }
          let highestRank = Math.max(...ranks);
          let rankValue = highestRank + shaandars[key].length - 1
          sheetData.data.skills[key].rank = rankValue
        } else {
          let ranks = []
          for (const shaandar in this.actor.members){
            if(shaandar !== "") {
            ranks.push(this.actor.members[shaandar].system.skills[key].rank)
            }
          }
          let minRank = Math.min(...ranks);
          sheetData.data.skills[key].rank = minRank
      }
    }
  }
  processSkills(sheetData){
    const members = sheetData.members 

    function updateSheetData(sheetData, members) {
      members.forEach((member) => {
        Object.keys(member.skills).forEach((category) => {
          Object.keys(sheetData.data.skills[category].specialisations).forEach((skill) => {
            const memberBonus = member.skills[category].specialisations[skill].bonus;
            const memberAcquis = member.skills[category].specialisations[skill].acquis;
            
            const sheetBonus = sheetData.data.skills[category].specialisations[skill].bonus;
            const sheetAcquis = sheetData.data.skills[category].specialisations[skill].acquis;
    
            // Compare and update if member has better bonus or acquis
            if (memberBonus > sheetBonus) {
              sheetData.data.skills[category].specialisations[skill].bonus = memberBonus;
            }
    
            if (memberAcquis > sheetAcquis) {
              sheetData.data.skills[category].specialisations[skill].acquis = memberAcquis;
            }
          });
        });
      });
    }
    // Update sheetData with members' data
    updateSheetData(sheetData, members);
    const skills = sheetData.data.skills
    this.actor.update({
      "system.skills": skills
    })
  }
  defineTrihnMax(sheetData) {
    const soucheEspritKey = sheetData.data.soucheEsprit
    const soucheEsprit = sheetData.members[soucheEspritKey]
    const soucheAmeKey = sheetData.data.soucheAme
    const soucheAme = sheetData.members[soucheAmeKey]
    const soucheCorpsKey = sheetData.data.soucheCorps
    const soucheCorps = sheetData.members[soucheCorpsKey];
    let espritMax = 0;
    if(soucheEsprit !== undefined) {
      espritMax = soucheEsprit.hp.esprit.max
    }
    let ameMax = 0
    if(soucheAme !== undefined) {
      ameMax = soucheAme.hp.ame.max
    }
    let corpsMax = 0
    if(soucheCorps !== undefined){
      corpsMax = soucheCorps.hp.corps.max
    }

    this.actor.update({
      "system.attributes":{
          hpEsprit:{
            max: espritMax
          },
          hpAme:{
            max: ameMax
          },
          hpCorps:{
            max: corpsMax
          }
        }
    })
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
        skills: actor.system.skills,
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

    // Define Shaandars

    $html.find(".shaandars[data-action=shaandars]").click(this._ondefineShaandars.bind(this));
    $html.find(".shaaniTest").click(this._onShaaniTest.bind(this));
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
  async _ondefineShaandars(event){
    const actor = this.actor
    const members = actor.members

    this.defineShaandars(actor, members);
  }
  async defineShaandars(actor, members, shaandars = {}){
    let Options = await getShaandarOptions({shaandars}) 

    if (Options.cancelled){
      return
    }

    shaandars = Options.shaandars

    shaandars = await mergeShaandars(this.actor.system.details.shaandars, shaandars);

    this.actor.update({
      "system.details.shaandars": shaandars
    })

    async function getShaandarOptions({
      shaandars,
      template = "systems/shaanrenaissance/templates/actors/Shaani/partials/defineShaandars.hbs",
    } = {}){
      const html = await renderTemplate(template, {actor,members,shaandars, config:CONFIG.shaanRenaissance});

      return new Promise((resolve) => {
        const data = {
          title: game.i18n.localize("SRLabels.Shaandars"),
          content:html,
          actor: actor,
          buttons:{
            normal: {
              label: game.i18n.localize("chat.actions.valider"),
              callback: (html) =>
                resolve(_processShaandarOptions(html[0].querySelector("form"))
                ),
            },
            cancel:{
              label: game.i18n.localize("chat.actions.cancel"),
              callback: (html) => resolve ({cancelled:true}),
            }
          },
          default: "normal",
          close: () => resolve({cancelled:true})
        };
        new Dialog(data, null).render(true);
      })
    }
    function _processShaandarOptions(form){
    // Access all select elements with a name starting with "shaandars."
    const selectElements = form.querySelectorAll('select[name^="shaandars."]');

    // Create an object to store grouped members
    const groupedMembers = {};

    // Loop through each select element
    selectElements.forEach((selectElement, index) => {
        // Extract the key and value
        const key = selectElement.value;
        if(key === "") return;
        const member = members[index];

        // Initialize the array if it doesn't exist
        if (!groupedMembers[key]) {
            groupedMembers[key] = [];
        }

        // Add the member to the array
        groupedMembers[key].push(member);
    });

    return{
      shaandars: groupedMembers
    }
    }
    async function mergeShaandars(existingShaandars, newShaandars) {
      for (const key in newShaandars) {
          if (Object.prototype.hasOwnProperty.call(newShaandars, key)) {
              const newMembers = newShaandars[key];

              if (!existingShaandars[key]) {
                  existingShaandars[key] = [];
              }

              // Vérifier et ajouter uniquement les membres qui n'existent pas encore
              newMembers.forEach((newMember) => {
                // Vérifier si le membre existe déjà dans d'autres tableaux
                const memberExistsElsewhere = Object.keys(existingShaandars).some((otherKey) => {
                    return otherKey !== key && existingShaandars[otherKey].some((otherMember) => otherMember._id === newMember._id);
                });

                // Si le membre existe ailleurs, le supprimer des autres tableaux
                if (memberExistsElsewhere) {
                    Object.keys(existingShaandars).forEach((otherKey) => {
                        if (otherKey !== key) {
                            existingShaandars[otherKey] = existingShaandars[otherKey].filter((otherMember) => otherMember._id !== newMember._id);
                        }
                    });
                }

                // Ajouter le membre au tableau actuel s'il n'existe pas encore
                const isNewMemberExist = existingShaandars[key].some((existingMember) => existingMember._id === newMember._id);
                if (!isNewMemberExist) {
                    existingShaandars[key].push(newMember);
                }
            });
          }
      }
      return existingShaandars
    }
  }
  _onShaaniTest(event){
    let actor = this.actor

    Dice.shaaniTest({
      actor
    })
  }
  _onSpéTest(event) {
    let actor = this.actor;
    let domain = event.target.closest(".pc").dataset.domain
    let spécialisation = event.target.dataset.spe
    let description = game.i18n.translations.SRspéDesc[spécialisation];
    console.log(domain, spécialisation);

    Dice.SpéTest({
      actor,
      domain: domain,
      spécialisation: spécialisation,
      description: description,
      askForOptions: event.shiftKey,
    });
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
