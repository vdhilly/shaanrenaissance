import { getSelectedOrOwnActors } from "../utils/utils.js";
export function addChatListeners(app, html, data) {
  const Button = html.find("button.puiser");
  Button.on("click", onPuiser);
  const necroseButton = html.find("button.puiser-necrose");
  necroseButton.on("click", onPuiserNecrose);
}

async function onPuiser(event) {
  const actors = (0, getSelectedOrOwnActors)([
    "Personnage",
    "PNJ",
    "Créature",
    "Shaani",
    "Réseau",
  ]);
  if (actors.length == 0)
    return ui.notifications.warn("Vous devez sélectionner au moins un token.");
  const chatCard = $(this.parentElement);
  const dice = chatCard.find("input.dice-value");
  const domain = Number(chatCard.find("b.domain").text());
  const domainName = chatCard.find("span.domainName").text();
  const spéBonus = Number(chatCard.find("b.spéBonus").text());
  const acquisBonus = Number(chatCard.find("b.acquisBonus").text());
  const messageTemplate = "systems/shaanrenaissance/templates/chat/puiser.hbs";
  let sendMessage = true;
  let esprit = Number(dice[2].value);
  let ame = Number(dice[1].value);
  let corps = Number(dice[0].value);

  let baseDice;
  let puiser1;
  let puiser2;

  if (
    domainName == "Technique" ||
    domainName == "Savoir" ||
    domainName == "Social"
  ) {
    baseDice = {
      value: esprit,
      label: "esprit",
      flavor: "Esprit",
      color: "jaune",
      checked: false,
    };
    puiser1 = {
      value: ame,
      label: "ame",
      flavor: "Ame",
      color: "bleu",
      checked: false,
    };
    puiser2 = {
      value: corps,
      label: "corps",
      flavor: "Corps",
      color: "rouge",
      checked: false,
    };
  } else if (
    domainName == "Arts" ||
    domainName == "Shaan" ||
    domainName == "Magie"
  ) {
    baseDice = {
      value: ame,
      label: "ame",
      flavor: "Ame",
      color: "bleu",
      checked: false,
    };
    puiser1 = {
      value: esprit,
      label: "esprit",
      flavor: "Esprit",
      color: "jaune",
      checked: false,
    };
    puiser2 = {
      value: corps,
      label: "corps",
      flavor: "Corps",
      color: "rouge",
      checked: false,
    };
  } else if (
    domainName == "Rituels" ||
    domainName == "Survie" ||
    domainName == "Combat"
  ) {
    baseDice = {
      value: corps,
      label: "corps",
      flavor: "Corps",
      color: "rouge",
      checked: false,
    };
    puiser1 = {
      value: esprit,
      label: "esprit",
      flavor: "Esprit",
      color: "jaune",
      checked: false,
    };
    puiser2 = {
      value: ame,
      label: "ame",
      flavor: "Ame",
      color: "bleu",
      checked: false,
    };
  }
  if (baseDice.value == 10) {
    baseDice.value = 0;
  }
  if (puiser1.value == 10) {
    puiser1.value = 0;
  }
  if (puiser2.value == 10) {
    puiser2.value = 0;
  }
  console.log(baseDice, puiser1, puiser2);
  if (
    baseDice.value > domain &&
    puiser1.value > domain &&
    puiser2.value > domain
  ) {
    return ui.notifications.error("Vous ne pouvez puiser dans aucun Trihn.");
  }
  //   Définition des choix
  let choix = {};
  choix.bonus = spéBonus + acquisBonus;
  if (puiser1.value != 0 && puiser1.value <= domain) {
    console.log(puiser1.value, baseDice.value);
    if (puiser1.value > baseDice.value || baseDice.value > domain) {
      choix.choix1 = puiser1;
    }
  }
  if (puiser2.value != 0 && puiser2.value <= domain) {
    if (puiser2.value > baseDice.value || baseDice.value > domain) {
      choix.choix2 = puiser2;
    }
  }
  if (
    baseDice.value != 0 &&
    puiser1.value != 0 &&
    baseDice.value + puiser1.value <= domain
  ) {
    choix.choix3 = {
      value: baseDice.value + puiser1.value,
      diceValues: { baseDice: baseDice.value, puiser1: puiser1.value },
      flavor: { baseDice: baseDice.flavor, puiser1: puiser1.flavor },
      color: { baseDice: baseDice.color, puiser1: puiser1.color },
    };
  }
  if (
    baseDice.value != 0 &&
    puiser2.value != 0 &&
    baseDice.value + puiser2.value <= domain
  ) {
    choix.choix4 = {
      value: baseDice.value + puiser2.value,
      diceValues: { baseDice: baseDice.value, puiser2: puiser2.value },
      flavor: { baseDice: baseDice.flavor, puiser2: puiser2.flavor },
      color: { baseDice: baseDice.color, puiser2: puiser2.color },
    };
  }
  if (
    puiser1.value != 0 &&
    puiser2.value != 0 &&
    puiser1.value + puiser2.value <= domain
  ) {
    choix.choix5 = {
      value: puiser1.value + puiser2.value,
      diceValues: { puiser1: puiser1.value, puiser2: puiser2.value },
      flavor: { puiser1: puiser1.flavor, puiser2: puiser2.flavor },
      color: { puiser1: puiser1.color, puiser2: puiser2.color },
    };
  }
  console.log(choix);
  if (
    !choix.choix1 &&
    !choix.choix2 &&
    !choix.choix3 &&
    !choix.choix4 &&
    !choix.choix5
  ) {
    return ui.notifications.error("Vous ne pouvez puiser dans aucun Trihn.");
  }
  let diceList = { baseDice, puiser1, puiser2 };

  let result;
  let puiserOptions = await GetPuiserOptions({
    domain: domain,
    diceList,
    choix,
    result,
  });

  if (puiserOptions.cancelled) {
    return;
  }
  result = puiserOptions.result + spéBonus + acquisBonus;

  for (const actor of actors) {
    const attributes = actor.system.attributes;
    let flavor = puiserOptions.flavor;
    var hp = "hp";
    let flavor1 = hp.concat("", flavor.flavor1);
    let flavor1Base = attributes[flavor1].value;
    let flavor1End = flavor1Base - 1;
    attributes[flavor1].value = flavor1End;
    let flavor2;
    if (flavor.flavor2) {
      flavor2 = hp.concat("", flavor.flavor2);
      let flavor2Base = attributes[flavor2].value;
      let flavor2End = flavor2Base - 1;
      attributes[flavor2].value = flavor2End;
    }
    actor.update(attributes);
    actor.sheet.render();

    if (sendMessage) {
      ToCustomMessage(actor, result, messageTemplate);
    }
    async function ToCustomMessage(Token, result, messageTemplate) {
      let actor = Token.actor;
      let templateContext = {
        Token: Token,
        score: result,
        trihns: flavor,
      };
      let chatData;
      chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor }),
        content: await renderTemplate(messageTemplate, templateContext),
        sound: CONFIG.sounds.notification,
        type: CONST.CHAT_MESSAGE_TYPES.OTHER,
      };
      ChatMessage.create(chatData);
    }
  }

  async function GetPuiserOptions({
    domain = null,
    diceList = null,
    choix = {},
    result = null,
    template = "systems/shaanrenaissance/templates/chat/puiser-dialog.hbs",
  } = {}) {
    const html = await renderTemplate(template, {
      domain,
      diceList,
      choix,
      result,
    });
    const puiserData = {
      diceList: diceList,
      choix: choix,
    };

    return new Promise((resolve) => {
      const data = {
        title: game.i18n.format("chat.puiser.title"),
        content: html,
        data: puiserData,
        buttons: {
          normal: {
            label: game.i18n.localize("chat.actions.puiser"),
            callback: (html) =>
              resolve(_processPuiserOptions(html[0].querySelector("form"))),
          },
          cancel: {
            label: game.i18n.localize("chat.actions.cancel"),
            callback: (html) => resolve({ cancelled: true }),
          },
        },
        default: "normal",
        close: () => resolve({ cancelled: true }),
      };
      new Dialog(data, null).render(true);
    });
  }
  function _processPuiserOptions(form) {
    let checked = form.querySelector("input:checked");
    if (checked) {
      let div = checked.closest("div");
      let checkedId = $(checked)[0].id;
      let flavor = {};
      if (
        checkedId == "choix1" ||
        checkedId == "choix2" ||
        checkedId == "choix3" ||
        checkedId == "choix4"
      ) {
        flavor.flavor1 = div.querySelector("b").dataset.flavor;
      }
      if (checkedId == "choix5") {
        flavor.flavor1 = div.querySelector("b").dataset.flavor1;
        flavor.flavor2 = div.querySelector("b").dataset.flavor2;
      }
      return {
        result: Number(form.result?.value),
        flavor: flavor,
      };
    } else {
      ui.notifications.warn("Vous devez faire un choix.");
    }
  }
}
async function onPuiserNecrose(event) {
  const actors = (0, getSelectedOrOwnActors)([
    "Personnage",
    "PNJ",
    "Créature",
    "Shaani",
    "Réseau",
  ]);
  if (actors.length == 0)
    return ui.notifications.warn("Vous devez sélectionner au moins un token.");
  const chatCard = $(this.parentElement);
  const dice = chatCard.find("input.dice-value");
  const necroseTest = chatCard.find(".necroseTest");
  const domain = Number(chatCard.find("b.domain").text());
  const domainName = chatCard.find("span.domainName").text();
  const spéBonus = Number(chatCard.find("b.spéBonus").text());
  const acquisBonus = Number(chatCard.find("b.acquisBonus").text());
  const messageTemplate = "systems/shaanrenaissance/templates/chat/puiser.hbs";
  let sendMessage = true;
  let esprit = Number(dice[1].value);
  let necrose = Number(dice[0].value);

  console.log(esprit, necrose);
  if (esprit == 10) {
    esprit = 0;
  }
  if (necrose == 10) {
    necrose = domain;
  }
  let choix = {};
  choix.bonus = spéBonus + acquisBonus;
  console.log(esprit, domain);
  if (esprit != 0 && esprit <= domain) {
    console.log("test1");
    if (esprit > necrose || necrose > domain) {
      console.log("test2");
      choix.choix1 = {
        value: esprit,
        label: "esprit",
        flavor: "Esprit",
        color: "jaune",
        checked: false,
      };
    }
  }
  if (esprit != 0 && esprit + necrose <= domain) {
    choix.choix2 = {
      value: esprit + necrose,
      diceValues: { esprit: esprit, necrose: necrose },
      label: { esprit: "esprit", necrose: "necrose" },
      flavor: { esprit: "Esprit", necrose: "Nécrose" },
      color: { esprit: "jaune", necrose: "noir" },
      checked: false,
    };
  }
  console.log(choix);
  if (!choix.choix1 && !choix.choix2) {
    return ui.notifications.error("Vous ne pouvez puiser dans aucun Trihn.");
  }

  let result;
  let puiserOptions = await GetPuiserOptions({ domain: domain, choix, result });
  if (puiserOptions.cancelled) {
    return;
  }
  result = puiserOptions.result + spéBonus + acquisBonus;
  let flavor = puiserOptions.flavor;

  for (const actor of actors) {
    const attributes = actor.system.attributes;
    attributes.hpEsprit.value = attributes.hpEsprit.value - 1;
    actor.update(attributes);
    actor.sheet.render();

    if (sendMessage) {
      ToCustomMessage(actor, result, messageTemplate);
    }
    async function ToCustomMessage(Token, result, messageTemplate) {
      let actor = Token.actor;
      let templateContext = {
        Token: Token,
        score: result,
        trihns: flavor,
      };
      let chatData;
      chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor }),
        content: await renderTemplate(messageTemplate, templateContext),
        sound: CONFIG.sounds.notification,
        type: CONST.CHAT_MESSAGE_TYPES.OTHER,
      };
      ChatMessage.create(chatData);
    }
  }

  async function GetPuiserOptions({
    domain = null,
    diceList = null,
    choix = {},
    result = null,
    template = "systems/shaanrenaissance/templates/chat/puiserNecrose-dialog.hbs",
  } = {}) {
    const html = await renderTemplate(template, { domain, choix, result });
    const puiserData = {
      diceList: diceList,
      choix: choix,
    };

    return new Promise((resolve) => {
      const data = {
        title: game.i18n.format("chat.puiser.title"),
        content: html,
        data: puiserData,
        buttons: {
          normal: {
            label: game.i18n.localize("chat.actions.puiser"),
            callback: (html) =>
              resolve(_processPuiserOptions(html[0].querySelector("form"))),
          },
          cancel: {
            label: game.i18n.localize("chat.actions.cancel"),
            callback: (html) => resolve({ cancelled: true }),
          },
        },
        default: "normal",
        close: () => resolve({ cancelled: true }),
      };
      new Dialog(data, null).render(true);
    });
  }
  function _processPuiserOptions(form) {
    let checked = form.querySelector("input:checked");
    if (checked) {
      let div = checked.closest("div");
      let checkedId = $(checked)[0].id;
      let flavor = {};
      if (checkedId == "choix1" || checkedId == "choix2") {
        flavor.flavor1 = div.querySelector("b").dataset.flavor;
      }
      return {
        result: Number(form.result?.value),
        flavor: flavor,
      };
    } else {
      ui.notifications.warn("Vous devez faire un choix.");
    }
  }
}
export const hideChatPuiserButtons = function (message, html, data) {
  const chatCard = html.find(".chat-card");
  if (chatCard.length > 0) {
    let actor = game.actors.get(
      chatCard.attr("data-actor-id").replace("Actor.", "")
    );
    if (actor && actor.isOwner) {
      return;
    }
    if (game.user.isGM) {
      return;
    }
    const buttons = chatCard.find("button.puiser");
    buttons.each((i, btn) => {
      btn.style.display = "none";
    });
  }
};
