// CREDOS
export async function AddCoins(actors) {
  let credos;
  let checkOptions = await GetCredosOptions({
    credos,
  });

  if (checkOptions.cancelled) {
    return;
  }
  credos = Number(checkOptions.credos);
  for (const actor of actors) {
    actor.update({
      "system.attributes.crédos": actor.system.attributes.crédos + credos,
    });
  }
}
export async function RemoveCoins(actors) {
  let credos;
  let checkOptions = await GetCredosOptions({
    credos,
  });

  if (checkOptions.cancelled) {
    return;
  }
  credos = Number(checkOptions.credos);
  for (const actor of actors) {
    actor.update({
      "system.attributes.crédos": actor.system.attributes.crédos - credos,
    });
  }
}
async function GetCredosOptions({
  credos,
  template = "systems/shaanrenaissance/templates/dialogs/add-remove-credos.hbs",
} = {}) {
  const html = await renderTemplate(template, {
    credos,
  });
  const config = CONFIG.shaanRenaissance;

  return new Promise((resolve) => {
    const data = {
      title: game.i18n.format("chat.addCoins.title"),
      content: html,
      buttons: {
        normal: {
          label: game.i18n.localize("chat.actions.valider"),
          callback: (html) =>
            resolve(_processCredosOptions(html[0].querySelector("form"))),
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
function _processCredosOptions(form) {
  return {
    credos: form.credos?.value,
  };
}
// XP
export async function AddXP(actors) {
  let xp;
  let checkOptions = await GetXPOptions({
    xp,
  });

  if (checkOptions.cancelled) {
    return;
  }
  xp = Number(checkOptions.xp);
  console.log(xp);
  for (const actor of actors) {
    actor.update({
      "system.details.xp.value": actor.system.details.xp.value + xp,
      "system.details.xpMax.value": actor.system.details.xpMax.value + xp,
    });
  }
}
async function GetXPOptions({
  xp,
  template = "systems/shaanrenaissance/templates/dialogs/add-xp.hbs",
} = {}) {
  const html = await renderTemplate(template, {
    xp,
  });
  const config = CONFIG.shaanRenaissance;

  return new Promise((resolve) => {
    const data = {
      title: game.i18n.format("chat.addXP.title"),
      content: html,
      buttons: {
        normal: {
          label: game.i18n.localize("chat.actions.valider"),
          callback: (html) =>
            resolve(_processXPOptions(html[0].querySelector("form"))),
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
function _processXPOptions(form) {
  return {
    xp: form.xp?.value,
  };
}

export async function AddPrestige(actors) {
  let prestige;
  let checkOptions = await GetPrestigeOptions({
    prestige,
  });

  if (checkOptions.cancelled) {
    return;
  }
  prestige = Number(checkOptions.prestige);
  console.log(prestige);
  for (const actor of actors) {
    actor.update({
      "system.attributes.prestige": actor.system.attributes.prestige + prestige,
      "system.attributes.préstigeMax":
        actor.system.attributes.préstigeMax + prestige,
    });
  }
}
async function GetPrestigeOptions({
  prestige,
  template = "systems/shaanrenaissance/templates/dialogs/add-prestige.hbs",
} = {}) {
  const html = await renderTemplate(template, {
    prestige,
  });
  const config = CONFIG.shaanRenaissance;

  return new Promise((resolve) => {
    const data = {
      title: game.i18n.format("chat.addPrestige.title"),
      content: html,
      buttons: {
        normal: {
          label: game.i18n.localize("chat.actions.valider"),
          callback: (html) =>
            resolve(_processPrestigeOptions(html[0].querySelector("form"))),
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
function _processPrestigeOptions(form) {
  return {
    prestige: form.prestige?.value,
  };
}
