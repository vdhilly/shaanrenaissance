import { getSelectedOrOwnActors } from "../utils/utils.js";

export function addChatListeners(app, html, data) {
  html.find("button.puiser").on("click", onPuiser);
  html.find("button.puiser-necrose").on("click", onPuiserNecrose);
}

async function onPuiser(event) {
  const actors = getSelectedOrOwnActors(["Personnage", "PNJ", "Créature", "Shaani", "Réseau"]);
  if (!actors.length) return ui.notifications.warn("Vous devez sélectionner au moins un token.");

  const chatCard = $(this.parentElement);
  const dice = chatCard.find("input.dice-value");
  const isParalyzed = chatCard.find(".die.Corps").attr("data-paralyzed") === "true";
  const isBewitched = chatCard.find(".die.Ame").attr("data-bewitched") === "true";
  const isDominated = chatCard.find(".die.Esprit").attr("data-dominated") === "true";

  const domain = Number(chatCard.find("b.domain").text());
  const domainName = chatCard.find("span.domainName").text();
  const spéBonus = Number(chatCard.find("b.spéBonus").text());
  const acquisBonus = Number(chatCard.find("b.acquisBonus").text());
  const messageTemplate = "systems/shaanrenaissance/templates/chat/puiser.hbs";

  let corps = isParalyzed ? 0 : Number(dice[0]?.value ?? 0);
  let ame = isBewitched ? 0 : Number(dice[1]?.value ?? 0);
  let esprit = isDominated ? 0 : Number(dice[2]?.value ?? 0);

  let baseDice, puiser1, puiser2;

  if (["Technique", "Savoir", "Social"].includes(domainName)) {
    baseDice = { value: esprit, label: "esprit", flavor: "Esprit", color: "jaune", checked: false };
    puiser1  = { value: ame, label: "ame", flavor: "Ame", color: "bleu", checked: false };
    puiser2  = { value: corps, label: "corps", flavor: "Corps", color: "rouge", checked: false };
  } else if (["Arts", "Shaan", "Magie"].includes(domainName)) {
    baseDice = { value: ame, label: "ame", flavor: "Ame", color: "bleu", checked: false };
    puiser1  = { value: esprit, label: "esprit", flavor: "Esprit", color: "jaune", checked: false };
    puiser2  = { value: corps, label: "corps", flavor: "Corps", color: "rouge", checked: false };
  } else if (["Rituels", "Survie", "Combat"].includes(domainName)) {
    baseDice = { value: corps, label: "corps", flavor: "Corps", color: "rouge", checked: false };
    puiser1  = { value: esprit, label: "esprit", flavor: "Esprit", color: "jaune", checked: false };
    puiser2  = { value: ame, label: "ame", flavor: "Ame", color: "bleu", checked: false };
  }

  if (baseDice.value === 10) baseDice.value = 0;
  if (puiser1.value === 10) puiser1.value = 0;
  if (puiser2.value === 10) puiser2.value = 0;

  if (baseDice.value > domain && puiser1.value > domain && puiser2.value > domain) {
    return ui.notifications.error("Vous ne pouvez puiser dans aucun Trihn.");
  }

  // Définition des choix
  const choix = { bonus: spéBonus + acquisBonus };

  if (puiser1.value !== 0 && puiser1.value <= domain) {
    if (puiser1.value > baseDice.value || baseDice.value > domain) {
      choix.choix1 = puiser1;
    }
  }
  if (puiser2.value !== 0 && puiser2.value <= domain) {
    if (puiser2.value > baseDice.value || baseDice.value > domain) {
      choix.choix2 = puiser2;
    }
  }
  if (baseDice.value !== 0 && puiser1.value !== 0 && baseDice.value + puiser1.value <= domain) {
    choix.choix3 = {
      value: baseDice.value + puiser1.value,
      diceValues: { baseDice: baseDice.value, puiser1: puiser1.value },
      flavor: { baseDice: baseDice.flavor, puiser1: puiser1.flavor },
      color: { baseDice: baseDice.color, puiser1: puiser1.color },
    };
  }
  if (baseDice.value !== 0 && puiser2.value !== 0 && baseDice.value + puiser2.value <= domain) {
    choix.choix4 = {
      value: baseDice.value + puiser2.value,
      diceValues: { baseDice: baseDice.value, puiser2: puiser2.value },
      flavor: { baseDice: baseDice.flavor, puiser2: puiser2.flavor },
      color: { baseDice: baseDice.color, puiser2: puiser2.color },
    };
  }
  if (puiser1.value !== 0 && puiser2.value !== 0 && puiser1.value + puiser2.value <= domain && domain >= 10) {
    choix.choix5 = {
      value: puiser1.value + puiser2.value,
      diceValues: { puiser1: puiser1.value, puiser2: puiser2.value },
      flavor: { puiser1: puiser1.flavor, puiser2: puiser2.flavor },
      color: { puiser1: puiser1.color, puiser2: puiser2.color },
    };
  }

  if (!choix.choix1 && !choix.choix2 && !choix.choix3 && !choix.choix4 && !choix.choix5) {
    return ui.notifications.error("Vous ne pouvez puiser dans aucun Trihn.");
  }

  const diceList = { baseDice, puiser1, puiser2 };
  const puiserOptions = await GetPuiserOptions({ domain, diceList, choix, template: "systems/shaanrenaissance/templates/chat/puiser-dialog.hbs" });

  if (puiserOptions.cancelled) return;

  const result = puiserOptions.result + spéBonus + acquisBonus;

  for (const actor of actors) {
    const attributes = actor.system.attributes;
    const flavor = puiserOptions.flavor;
    const updateData = {};

    const flavor1 = `hp${flavor.flavor1}`;
    if (attributes[flavor1]?.value > 0) {
      updateData[`system.attributes.${flavor1}.value`] = attributes[flavor1].value - 1;
    }

    if (flavor.flavor2) {
      const flavor2 = `hp${flavor.flavor2}`;
      if (attributes[flavor2]?.value > 0) {
        updateData[`system.attributes.${flavor2}.value`] = attributes[flavor2].value - 1;
      }
    }

    if (Object.keys(updateData).length > 0 && puiserOptions.lose) {
      await actor.update(updateData);
      actor.sheet.render(false);
    }

    await _sendPuiserChatMessage(actor, result, flavor, messageTemplate);
  }
}

async function onPuiserNecrose(event) {
  const actors = getSelectedOrOwnActors(["Personnage", "PNJ", "Créature", "Shaani", "Réseau"]);
  if (!actors.length) return ui.notifications.warn("Vous devez sélectionner au moins un token.");

  const chatCard = $(this.parentElement);
  const dice = chatCard.find("input.dice-value");
  const isDominated = chatCard.find(".die.Esprit").attr("data-dominated") === "true";

  const domain = Number(chatCard.find("b.domain").text());
  const spéBonus = Number(chatCard.find("b.spéBonus").text());
  const acquisBonus = Number(chatCard.find("b.acquisBonus").text());
  const messageTemplate = "systems/shaanrenaissance/templates/chat/puiser.hbs";

  let necrose = Number(dice[0]?.value ?? 0);
  let esprit = isDominated ? 0 : Number(dice[1]?.value ?? 0);

  if (esprit === 10) esprit = domain;
  if (necrose === 10) necrose = domain;

  const choix = { bonus: spéBonus + acquisBonus };

  if (esprit <= domain && (esprit > necrose || necrose > domain)) {
    choix.choix1 = {
      value: esprit,
      label: "esprit",
      flavor: "Esprit",
      color: "jaune",
      checked: false,
    };
  }
  if (esprit + necrose <= domain) {
    choix.choix2 = {
      value: esprit + necrose,
      diceValues: { esprit, necrose },
      label: { esprit: "esprit", necrose: "necrose" },
      flavor: { esprit: "Esprit", necrose: "Necrose" },
      color: { esprit: "jaune", necrose: "noir" },
      checked: false,
    };
  }

  if (!choix.choix1 && !choix.choix2) {
    return ui.notifications.error("Vous ne pouvez puiser dans aucun Trihn.");
  }

  const puiserOptions = await GetPuiserOptions({ domain, choix, template: "systems/shaanrenaissance/templates/chat/puiserNecrose-dialog.hbs" });
  if (puiserOptions.cancelled) return;

  const result = puiserOptions.result + spéBonus + acquisBonus;

  for (const actor of actors) {
    const updateData = {};

    if (actor.system.attributes.hpEsprit?.value > 0) {
      updateData["system.attributes.hpEsprit.value"] = actor.system.attributes.hpEsprit.value - 1;
    }

    if (Object.keys(updateData).length > 0 && puiserOptions.lose) {
      await actor.update(updateData);
      actor.sheet.render(false);
    }

    await _sendPuiserChatMessage(actor, result, puiserOptions.flavor, messageTemplate);
  }
}


async function GetPuiserOptions({ domain = null, diceList = null, choix = {}, template = "" } = {}) {
  const html = await renderTemplate(template, { domain, diceList, choix });

  return new Promise((resolve) => {
    new Dialog({
      title: game.i18n.format("chat.puiser.title"),
      content: html,
      data: { diceList, choix },
      buttons: {
        normal: {
          label: game.i18n.localize("chat.actions.puiser"),
          callback: (html) => resolve(_processPuiserOptions(html[0].querySelector("form"))),
        },
        cancel: {
          label: game.i18n.localize("chat.actions.cancel"),
          callback: () => resolve({ cancelled: true }),
        },
      },
      default: "normal",
      close: () => resolve({ cancelled: true }),
    }).render(true);
  });
}

function _processPuiserOptions(form) {
  const checked = form?.querySelector("input:checked");
  if (!checked) {
    ui.notifications.warn("Vous devez faire un choix.");
    return { cancelled: true };
  }

  const div = checked.closest("div");
  const checkedId = checked.id;
  const flavor = {};

  if (["choix1", "choix2", "choix3", "choix4"].includes(checkedId)) {
    flavor.flavor1 = div.querySelector("b")?.dataset.flavor;
  } else if (checkedId === "choix5") {
    flavor.flavor1 = div.querySelector("b")?.dataset.flavor1;
    flavor.flavor2 = div.querySelector("b")?.dataset.flavor2;
  }

  return {
    result: Number(form.result?.value ?? 0),
    flavor,
    lose: !form.puiserLoseTrihn?.checked,
  };
}

async function _sendPuiserChatMessage(actor, result, flavor, template) {
  const templateContext = {
    Token: actor.prototypeToken || actor,
    actor,
    score: result,
    trihns: flavor,
  };

  const rollMode = game.settings.get("core", "rollMode");
  let whispers = [];

  // En V14, on filtre directement la collection des utilisateurs
  if (rollMode === "gmroll" || rollMode === "blindroll") {
    whispers = game.users.filter((u) => u.isGM).map((u) => u.id);
  } else if (rollMode === "selfroll") {
    whispers = [game.user.id];
  }

  const chatData = {
    author: game.user.id,
    speaker: ChatMessage.getSpeaker({ actor }),
    content: await foundry.applications.handlebars.renderTemplate(template, templateContext),
    sound: CONFIG.sounds.notification,
    style: CONST.CHAT_MESSAGE_STYLES?.OTHER ?? CONST.CHAT_MESSAGE_STYLES?.DEFAULT,
    whisper: whispers,
    blind: rollMode === "blindroll",
  };

  return await ChatMessage.create(chatData);
}

export const hideChatPuiserButtons = function (message, html, data) {
  const chatCard = html.find(".chat-card");
  if (!chatCard.length) return;

  const actorId = chatCard.attr("data-actor-id")?.replace("Actor.", "");
  const actor = game.actors.get(actorId);

  if ((actor && actor.isOwner) || game.user.isGM) {
    return;
  }

  chatCard.find("button.puiser").hide();
};