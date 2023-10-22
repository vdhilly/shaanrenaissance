export async function Initiative({
  actor = null,
  extraMessageData = {},
  sendMessage = true,
} = {}) {
  const messageTemplate =
    "systems/shaanrenaissance/templates/chat/initiative.hbs";
  const actorData = actor ? actor.system : null;
  const domain = actorData.attributes.initiative.statistic;
  const domainLevel =
    actorData.skills[domain].rank + actorData.skills[domain].temp;

  let rollFormula = `1d10 + @domainLevel`;

  let rollData = {
    ...actorData,
    domain: domain,
    domainLevel: domainLevel,
  };

  let rollResult = await new Roll(rollFormula, rollData).roll({ async: true });
  let dice3d;
  if (game.dice3d != undefined) {
    dice3d = game.dice3d.showForRoll(rollResult, game.user, true);
    dice3d;
  }
  if (rollResult.dice[0].total === 10) {
    rollResult._total = rollResult._total - 10;
    rollResult.terms[0].results[0].result = 0;
  }
  if (sendMessage) {
    RollToCustomMessage(actor, rollResult, messageTemplate, {
      ...extraMessageData,
      domain: domain,
      domainLevel: domainLevel,
      actorID: actor.uuid,
    });
  }
  return rollResult;
}
export async function domainTest({
  actor = null,
  extraMessageData = {},
  sendMessage = true,
  domain = null,
  difficulty = null,
  spécialisation = null,
  state = null,
  race = null,
} = {}) {
  const messageTemplate =
    "systems/shaanrenaissance/templates/chat/domainTest.hbs";
  const actorData = actor ? actor.system : null;

  let checkOptions = await GetRollOptions({
    domain,
    spécialisation,
    difficulty,
  });

  if (checkOptions.cancelled) {
    return;
  }

  domain = checkOptions.domain;
  const spé = checkOptions.spécialisation;
  difficulty = checkOptions.difficulty;

  let corps = "1d10[Corps]";
  let ame = "1d10[Ame]";
  let esprit = "1d10[Esprit]";
  let rollFormula = `{${corps}, ${ame}, ${esprit}}`;

  const domainLevel =
    actorData.skills[domain].rank + actorData.skills[domain].temp;
  let spéDomain;
  let données;
  for (const [category, details] of Object.entries(actorData.skills)) {
    if (details.specialisations && details.specialisations[spé]) {
      spéDomain = category;
      données = details.specialisations[spé];
      break;
    }
  }
  let spéBonusF;
  let spéAcquisF;

  if (spé == "pur") {
    spéBonusF = 0;
    spéAcquisF = 0;
  } else {
    let max;
    if (domainLevel < 5) {
      max = "profane";
    } else {
      if (domainLevel < 8) {
        max = "apprenti";
      } else {
        if (domainLevel < 11) {
          max = "initié";
        } else {
          if (domainLevel < 14) {
            max = "maitre";
          } else {
            max = "legende";
          }
        }
      }
    }
    switch (max) {
      case "profane":
        if (données.bonus >= 1) {
          spéBonusF = 1;
        }
        if (données.acquis >= 1) {
          spéAcquisF = 1;
        }
        break;
      case "apprenti":
        if (données.bonus >= 2) {
          spéBonusF = 2;
        } else {
          spéBonusF = données.bonus;
        }
        if (données.acquis >= 2) {
          spéAcquisF = 2;
        } else {
          spéAcquisF = données.acquis;
        }
        break;
      case "initié":
        if (données.bonus >= 3) {
          spéBonusF = 3;
        } else {
          spéBonusF = données.bonus;
        }
        if (données.acquis >= 3) {
          spéAcquisF = 3;
        } else {
          spéAcquisF = données.acquis;
        }
        break;
      case "maitre":
        if (données.bonus >= 4) {
          spéBonusF = 4;
        } else {
          spéBonusF = données.bonus;
        }
        if (données.acquis >= 4) {
          spéAcquisF = 4;
        } else {
          spéAcquisF = données.acquis;
        }
        break;
      case "legende":
        if (données.bonus >= 5) {
          spéBonusF = 5;
        } else {
          spéBonusF = données.bonus;
        }
        if (données.acquis >= 5) {
          spéAcquisF = 5;
        } else {
          spéAcquisF = données.acquis;
        }
        break;
    }
  }

  let rollData;
  if (spé == "pur") {
    rollData = {
      ...actorData,
      domain: domain,
      domainLevel: domainLevel,
      spécialisation: spé,
      difficulty: difficulty,
      isPure: true,
    };
  } else {
    rollData = {
      ...actorData,
      domain: domain,
      domainLevel: domainLevel,
      spéBonus: spéBonusF,
      spéAcquis: spéAcquisF,
      spécialisation: spé,
      difficulty: difficulty,
      isPure: false,
    };
  }
  let rollResult = await new Roll(rollFormula, rollData).roll({ async: true });
  let dice3d;
  if (game.dice3d != undefined) {
    dice3d = game.dice3d.showForRoll(rollResult, game.user, true);
    dice3d;
  }

  let dice = rollResult.dice;
  let déCorps = rollResult.dice[dice.length - 3];
  let déAme = rollResult.dice[dice.length - 2];
  let déEsprit = rollResult.dice[dice.length - 1];

  if (
    déCorps.total == déAme.total &&
    déAme.total == déEsprit.total &&
    déEsprit != 0
  ) {
    rollResult.symbiose = "Réussite";
  } else if (
    déCorps == déAme.total &&
    déAme.total == déEsprit.total &&
    déEsprit == 0
  ) {
    rollResult.symbiose = "Echec";
  } else {
    rollResult.symbiose = "Not";
  }

  let domainDice;
  if (domain == "Technique" || domain == "Savoir" || domain == "Social") {
    domainDice = déEsprit;
  } else if (domain == "Arts" || domain == "Shaan" || domain == "Magie") {
    domainDice = déAme;
  } else if (domain == "Rituels" || domain == "Survie" || domain == "Combat") {
    domainDice = déCorps;
  }
  if (!difficulty) {
    difficulty = 0;
  }
  let score;
  if (domainDice.total == "10") {
    score = 0;
  } else {
    score = domainDice.total;
  }
  // Check
  let isSuccess = false;
  let statuses = await processStatuses({ actor, race, state, domain });
  spéAcquisF = spéAcquisF || 0;
  spéBonusF = spéBonusF || 0;
  if (score > domainLevel) {
    if (rollResult.symbiose == "Réussite") {
      isSuccess = true;
      score = spéAcquisF + spéBonusF + 10;
    } else if (spéAcquisF + spéBonusF > difficulty && score != 0) {
      isSuccess = true;
      score = spéAcquisF + spéBonusF;
    }
  } else if (score > 0) {
    score += spéAcquisF + spéBonusF + statuses;
    if (score > difficulty) {
      isSuccess = true;
    } else if (rollResult.symbiose == "Réussite") {
      isSuccess = true;
      score += 10;
    }
  }
  if (sendMessage) {
    RollToCustomMessage(actor, rollResult, messageTemplate, {
      ...extraMessageData,
      domain: domain,
      spécialisation: spécialisation,
      score: score,
      race,
      isSuccess,
      advantaged: actor.conditions.advantaged,
      stunned: actor.conditions.stunned,
      obscurity: actor.conditions.obscurity,
      weakened: actor.conditions.weakened,
      deafened: actor.conditions.deafened,
      dazzled: actor.conditions.dazzled,
      blinded: actor.conditions.blinded,
      muted: actor.conditions.muted,
      actorID: actor.uuid,
    });
  }

  async function GetRollOptions({
    domain = null,
    spécialisation = null,
    difficulty = 0,
    template = "systems/shaanrenaissance/templates/chat/domainTest-dialog.hbs",
  } = {}) {
    const html = await renderTemplate(template, {
      actor,
      domain,
      spécialisation,
      difficulty,
    });
    console.log(actor);
    const actorData = actor.toObject(!1);
    const config = CONFIG.shaanRenaissance;

    return new Promise((resolve) => {
      const data = {
        title: game.i18n.format("chat.domainTest.title"),
        content: html,
        domains: config.SRdomains,
        actor: actorData,
        buttons: {
          normal: {
            label: game.i18n.localize("chat.actions.roll"),
            callback: (html) =>
              resolve(_processdomainTestOptions(html[0].querySelector("form"))),
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
  function _processdomainTestOptions(form) {
    return {
      difficulty: form.difficulty?.value,
      domain: form.domain?.value,
      spécialisation: form.spécialisation?.value,
    };
  }
}
export async function SpéTest({
  actor = null,
  extraMessageData = {},
  sendMessage = true,
  domain = null,
  difficulty = null,
  askForOptions = true,
  spécialisation = null,
  description = null,
  invocation = false,
  state = null,
  race,
} = {}) {
  const messageTemplate =
    "systems/shaanrenaissance/templates/chat/domainTest.hbs";
  const actorData = actor ? actor.system : null;
  const domainLevel =
    actorData.skills[domain].rank + actorData.skills[domain].temp;
  const spéBonus =
    actorData.skills[domain].specialisations[spécialisation].bonus;
  const spéAcquis =
    actorData.skills[domain].specialisations[spécialisation].acquis;

  let optionsSettings = game.settings.get(
    "shaanrenaissance",
    "showCheckOptions"
  );
  if (askForOptions != optionsSettings) {
    let checkOptions = await GetRollOptions({
      domain,
      spécialisation,
      difficulty,
      description,
    });
    if (checkOptions.cancelled) {
      return;
    }
    difficulty = checkOptions.difficulty;
  }

  let corps = "1d10[Corps]";
  let ame = "1d10[Ame]";
  let esprit = "1d10[Esprit]";
  let rollFormula = `{${corps}, ${ame}, ${esprit}}`;

  let spéBonusF;
  let spéAcquisF;

  let max;
  if (domainLevel < 5) {
    max = "profane";
  } else {
    if (domainLevel < 8) {
      max = "apprenti";
    } else {
      if (domainLevel < 11) {
        max = "initié";
      } else {
        if (domainLevel < 14) {
          max = "maitre";
        } else {
          max = "legende";
        }
      }
    }
  }
  switch (max) {
    case "profane":
      if (spéBonus >= 1) {
        spéBonusF = 1;
      }
      if (spéAcquis >= 1) {
        spéAcquisF = 1;
      }
      break;
    case "apprenti":
      if (spéBonus >= 2) {
        spéBonusF = 2;
      } else {
        spéBonusF = spéBonus;
      }
      if (spéAcquis >= 2) {
        spéAcquisF = 2;
      } else {
        spéAcquisF = spéAcquis;
      }
      break;
    case "initié":
      if (spéBonus >= 3) {
        spéBonusF = 3;
      } else {
        spéBonusF = spéBonus;
      }
      if (spéAcquis >= 3) {
        spéAcquisF = 3;
      } else {
        spéAcquisF = spéAcquis;
      }
      break;
    case "maitre":
      if (spéBonus >= 4) {
        spéBonusF = 4;
      } else {
        spéBonusF = spéBonus;
      }
      if (spéAcquis >= 4) {
        spéAcquisF = 4;
      } else {
        spéAcquisF = spéAcquis;
      }
      break;
    case "legende":
      if (spéBonus >= 5) {
        spéBonusF = 5;
      } else {
        spéBonusF = spéBonus;
      }
      if (spéAcquis >= 5) {
        spéAcquisF = 5;
      } else {
        spéAcquisF = spéAcquis;
      }
      break;
  }

  let rollData = {
    ...actorData,
    domain: domain,
    domainLevel: domainLevel,
    spécialisation: spécialisation,
    spéBonus: spéBonusF,
    spéAcquis: spéAcquisF,
    difficulty: difficulty,
    isPure: false,
  };
  let rollResult = await new Roll(rollFormula, rollData).roll({ async: true });
  let dice3d;
  if (game.dice3d != undefined) {
    dice3d = game.dice3d.showForRoll(rollResult, game.user, true);
    dice3d;
  }

  let dice = rollResult.dice;
  let déCorps = rollResult.dice[dice.length - 3];
  let déAme = rollResult.dice[dice.length - 2];
  let déEsprit = rollResult.dice[dice.length - 1];

  if (
    déCorps.total == déAme.total &&
    déAme.total == déEsprit.total &&
    déEsprit != 0
  ) {
    rollResult.symbiose = "Réussite";
  } else if (
    déCorps == déAme.total &&
    déAme.total == déEsprit.total &&
    déEsprit == 0
  ) {
    rollResult.symbiose = "Echec";
  } else {
    rollResult.symbiose = "Not";
  }

  let domainDice;
  if (domain == "Technique" || domain == "Savoir" || domain == "Social") {
    domainDice = déEsprit;
  } else if (domain == "Arts" || domain == "Shaan" || domain == "Magie") {
    domainDice = déAme;
  } else if (domain == "Rituels" || domain == "Survie" || domain == "Combat") {
    domainDice = déCorps;
  }
  if (!difficulty) {
    difficulty = 0;
  }
  difficulty = 0;
  let score;
  if (domainDice.total == "10") {
    score = 0;
  } else {
    score = domainDice.total;
  }
  // Check
  let statuses = await processStatuses({ actor, race, state, domain });
  let isSuccess = false;
  spéAcquisF = spéAcquisF || 0;
  spéBonusF = spéBonusF || 0;
  if (score > domainLevel) {
    isSuccess =
      spéAcquisF + spéBonusF > difficulty || rollResult.symbiose === "Réussite";
    console.log(spéAcquisF, spéBonusF);
    score = isSuccess
      ? spéAcquisF + spéBonusF + (rollResult.symbiose === "Réussite" ? 10 : 0)
      : score;
  } else {
    if (score === 0) {
      isSuccess = false;
    } else {
      score += spéAcquisF + spéBonusF + statuses;
      isSuccess = score > difficulty || rollResult.symbiose === "Réussite";
      score = isSuccess
        ? score + (rollResult.symbiose === "Réussite" ? 10 : 0)
        : score;
    }
  }
  if (sendMessage) {
    RollToCustomMessage(actor, rollResult, messageTemplate, {
      ...extraMessageData,
      domain: domain,
      domainLevel: domainLevel,
      spécialisation: spécialisation,
      spéBonus: spéBonusF,
      spéAcquis: spéAcquisF,
      score: score,
      race,
      isSuccess,
      advantaged: actor.conditions.advantaged,
      stunned: actor.conditions.stunned,
      obscurity: actor.conditions.obscurity,
      weakened: actor.conditions.weakened,
      deafened: actor.conditions.deafened,
      dazzled: actor.conditions.dazzled,
      blinded: actor.conditions.blinded,
      muted: actor.conditions.muted,
      actorID: actor.uuid,
    });
  }
  if (invocation) {
    return score;
  }

  async function GetRollOptions({
    domain = null,
    spécialisation = null,
    description = null,
    difficulty = 0,
    template = "systems/shaanrenaissance/templates/chat/spéTest-dialog.hbs",
  } = {}) {
    const html = await renderTemplate(template, {
      actor,
      domain,
      spécialisation,
      difficulty,
      description,
    });
    const actorData = actor.toObject(!1);
    let spéBonusF;
    let spéAcquisF;
    const TestData = {
      domain: domain,
      domainLevel: domainLevel,
      spécialisation: spécialisation,
      spéBonus: spéBonusF,
      spéAcquis: spéAcquisF,
    };

    return new Promise((resolve) => {
      const data = {
        title: game.i18n.format("chat.domainTest.title"),
        content: html,
        data: TestData,
        actor: actorData,
        buttons: {
          normal: {
            label: game.i18n.localize("chat.actions.roll"),
            callback: (html) =>
              resolve(_processdomainTestOptions(html[0].querySelector("form"))),
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
  function _processdomainTestOptions(form) {
    return {
      difficulty: parseInt(form.difficulty?.value),
      domain: parseInt(form.domain?.value),
      spécialisation: parseInt(form.spécialisation?.value),
    };
  }
}
export async function necroseTest({
  actor = null,
  extraMessageData = {},
  sendMessage = true,
  domain = null,
  difficulty = null,
  spécialisation = null,
  race = null,
  state = null,
} = {}) {
  const messageTemplate =
    "systems/shaanrenaissance/templates/chat/nécroseTest.hbs";
  const actorData = actor ? actor.system : null;
  const raceName = race;

  let checkOptions = await GetRollOptions({
    domain,
    spécialisation,
    difficulty,
  });

  if (checkOptions.cancelled) {
    return;
  }

  domain = checkOptions.domain;
  const spé = checkOptions.spécialisation;
  difficulty = checkOptions.difficulty;

  let rollFormula;

  if (raceName == "Humain") {
    let nécrose = "1d10[Necrose]";
    let esprit = "1d10[Esprit]";
    rollFormula = `{${nécrose}, ${esprit}}`;
  } else {
    let nécrose = "1d10[Necrose]";
    rollFormula = `${nécrose}`;
  }

  const domainLevel =
    actorData.skills[domain].rank + actorData.skills[domain].temp;
  let spéDomain;
  let données;
  for (const [category, details] of Object.entries(actorData.skills)) {
    if (details.specialisations && details.specialisations[spé]) {
      spéDomain = category;
      données = details.specialisations[spé];
      break;
    }
  }
  let spéBonusF;
  let spéAcquisF;

  if (spé == "pur") {
    spéBonusF = 0;
    spéAcquisF = 0;
  } else {
    let max;
    if (domainLevel < 5) {
      max = "profane";
    } else {
      if (domainLevel < 8) {
        max = "apprenti";
      } else {
        if (domainLevel < 11) {
          max = "initié";
        } else {
          if (domainLevel < 14) {
            max = "maitre";
          } else {
            max = "legende";
          }
        }
      }
    }
    switch (max) {
      case "profane":
        if (données.bonus >= 1) {
          spéBonusF = 1;
        }
        if (données.acquis >= 1) {
          spéAcquisF = 1;
        }
        break;
      case "apprenti":
        if (données.bonus >= 2) {
          spéBonusF = 2;
        } else {
          spéBonusF = données.bonus;
        }
        if (données.acquis >= 2) {
          spéAcquisF = 2;
        } else {
          spéAcquisF = données.acquis;
        }
        break;
      case "initié":
        if (données.bonus >= 3) {
          spéBonusF = 3;
        } else {
          spéBonusF = données.bonus;
        }
        if (données.acquis >= 3) {
          spéAcquisF = 3;
        } else {
          spéAcquisF = données.acquis;
        }
        break;
      case "maitre":
        if (données.bonus >= 4) {
          spéBonusF = 4;
        } else {
          spéBonusF = données.bonus;
        }
        if (données.acquis >= 4) {
          spéAcquisF = 4;
        } else {
          spéAcquisF = données.acquis;
        }
        break;
      case "legende":
        if (données.bonus >= 5) {
          spéBonusF = 5;
        } else {
          spéBonusF = données.bonus;
        }
        if (données.acquis >= 5) {
          spéAcquisF = 5;
        } else {
          spéAcquisF = données.acquis;
        }
        break;
    }
  }

  let rollData;
  if (spé == "pur") {
    rollData = {
      ...actorData,
      domain: domain,
      domainLevel: domainLevel,
      spécialisation: spé,
      difficulty: difficulty,
      isPure: true,
    };
  } else {
    rollData = {
      ...actorData,
      domain: domain,
      domainLevel: domainLevel,
      spéBonus: spéBonusF,
      spéAcquis: spéAcquisF,
      spécialisation: spé,
      difficulty: difficulty,
      isPure: false,
    };
  }
  let rollResult = await new Roll(rollFormula, rollData).roll({ async: true });
  let dice3d;
  if (game.dice3d != undefined) {
    dice3d = game.dice3d.showForRoll(rollResult, game.user, true);
    dice3d;
  }
  let dice = rollResult.dice;
  let domainDice;
  if (race == "Humain") {
    domainDice = rollResult.dice[dice.length - 2];
  } else {
    domainDice = rollResult.dice[dice.length - 1];
  }
  if (!difficulty) {
    difficulty = 0;
  }
  let score;
  if (domainDice.total == "10") {
    score = domainLevel;
  } else {
    score = domainDice.total;
  }

  // Check
  let isSuccess;
  let statuses = await processStatuses({ actor, race, state, domain });
  if (score > domainLevel) {
    isSuccess = false;
    if (spéAcquisF + spéBonusF > difficulty) {
      isSuccess = true;
      score = spéAcquisF + spéBonusF;
      score += statuses;
    }
  } else {
    isSuccess = true;
    if (domainDice.total == "10") {
      score = domainLevel;
    }
    score += spéAcquisF + spéBonusF + statuses;
    if (score <= difficulty) {
      isSuccess = false;
    }
  }

  if (sendMessage) {
    RollToCustomMessage(actor, rollResult, messageTemplate, {
      ...extraMessageData,
      domain: domain,
      spécialisation: spécialisation,
      score: score,
      isSuccess,
      advantaged: actor.conditions.advantaged,
      stunned: actor.conditions.stunned,
      obscurity: actor.conditions.obscurity,
      weakened: actor.conditions.weakened,
      deafened: actor.conditions.deafened,
      dazzled: actor.conditions.dazzled,
      blinded: actor.conditions.blinded,
      muted: actor.conditions.muted,
      actorID: actor.uuid,
      race: race,
    });
  }

  async function GetRollOptions({
    domain = null,
    spécialisation = null,
    difficulty = 0,
    template = "systems/shaanrenaissance/templates/chat/nécroseTest-dialog.hbs",
  } = {}) {
    const html = await renderTemplate(template, {
      actor,
      domain,
      spécialisation,
      difficulty,
    });
    const actorData = actor.toObject(!1);
    const config = CONFIG.shaanRenaissance;

    return new Promise((resolve) => {
      const data = {
        title: game.i18n.format("chat.necroseTest.title"),
        content: html,
        domains: config.SRdomains,
        actor: actorData,
        buttons: {
          normal: {
            label: game.i18n.localize("chat.actions.roll"),
            callback: (html) =>
              resolve(_processdomainTestOptions(html[0].querySelector("form"))),
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
  function _processdomainTestOptions(form) {
    return {
      difficulty: form.difficulty?.value,
      domain: form.domain?.value,
      spécialisation: form.spécialisation?.value,
    };
  }
}

export async function SpéTestNécr({
  actor = null,
  race,
  extraMessageData = {},
  sendMessage = true,
  domain = null,
  difficulty = null,
  askForOptions = true,
  spécialisation = null,
  description = null,
  state = null,
} = {}) {
  const messageTemplate =
    "systems/shaanrenaissance/templates/chat/spéTestNécr.hbs";
  const actorData = actor ? actor.system : null;
  const domainLevel =
    actorData.skills[domain].rank + actorData.skills[domain].temp;
  const spéBonus =
    actorData.skills[domain].specialisations[spécialisation].bonus;
  const spéAcquis =
    actorData.skills[domain].specialisations[spécialisation].acquis;
  const raceName = race;

  let spéBonusF;
  let spéAcquisF;

  let max;
  if (domainLevel < 5) {
    max = "profane";
  } else {
    if (domainLevel < 8) {
      max = "apprenti";
    } else {
      if (domainLevel < 11) {
        max = "initié";
      } else {
        if (domainLevel < 14) {
          max = "maitre";
        } else {
          max = "legende";
        }
      }
    }
  }
  switch (max) {
    case "profane":
      if (spéBonus >= 1) {
        spéBonusF = 1;
      }
      if (spéAcquis >= 1) {
        spéAcquisF = 1;
      }
      break;
    case "apprenti":
      if (spéBonus >= 2) {
        spéBonusF = 2;
      } else {
        spéBonusF = spéBonus;
      }
      if (spéAcquis >= 2) {
        spéAcquisF = 2;
      } else {
        spéAcquisF = spéAcquis;
      }
      break;
    case "initié":
      if (spéBonus >= 3) {
        spéBonusF = 3;
      } else {
        spéBonusF = spéBonus;
      }
      if (spéAcquis >= 3) {
        spéAcquisF = 3;
      } else {
        spéAcquisF = spéAcquis;
      }
      break;
    case "maitre":
      if (spéBonus >= 4) {
        spéBonusF = 4;
      } else {
        spéBonusF = spéBonus;
      }
      if (spéAcquis >= 4) {
        spéAcquisF = 4;
      } else {
        spéAcquisF = spéAcquis;
      }
      break;
    case "legende":
      if (spéBonus >= 5) {
        spéBonusF = 5;
      } else {
        spéBonusF = spéBonus;
      }
      if (spéAcquis >= 5) {
        spéAcquisF = 5;
      } else {
        spéAcquisF = spéAcquis;
      }
      break;
  }
  let optionsSettings = game.settings.get(
    "shaanrenaissance",
    "showCheckOptions"
  );
  if (askForOptions != optionsSettings) {
    let checkOptions = await GetRollOptions({
      domain,
      spécialisation,
      difficulty,
      description,
      spéBonusF,
      spéAcquisF,
    });
    if (checkOptions.cancelled) {
      return;
    }
    difficulty = checkOptions.difficulty;
  }

  let rollFormula;

  if (raceName == "Humain") {
    let nécrose = "1d10[Necrose]";
    let esprit = "1d10[Esprit]";
    rollFormula = `{${nécrose}, ${esprit}}`;
  } else {
    let nécrose = "1d10[Necrose]";
    rollFormula = `${nécrose}`;
  }

  let rollData = {
    ...actorData,
    domain: domain,
    race: raceName,
    domainLevel: domainLevel,
    spécialisation: spécialisation,
    spéBonus: spéBonusF,
    spéAcquis: spéAcquisF,
    difficulty: difficulty,
  };
  let rollResult = await new Roll(rollFormula, rollData).roll({ async: true });
  let dice3d;
  if (game.dice3d != undefined) {
    dice3d = game.dice3d.showForRoll(rollResult, game.user, true);
    dice3d;
  }

  let dice = rollResult.dice;
  let domainDice;
  if (race == "Humain") {
    domainDice = rollResult.dice[dice.length - 2];
  } else {
    domainDice = rollResult.dice[dice.length - 1];
  }
  if (!difficulty) {
    difficulty = 0;
  }
  let score;
  if (domainDice.total == "10") {
    score = domainLevel;
  } else {
    score = domainDice.total;
  }
  spéAcquisF = spéAcquisF || 0;
  spéBonusF = spéBonusF || 0;
  let statuses = await processStatuses({ actor, race, state, domain });
  let isSuccess = false;

  if (score > domainLevel) {
    if (spéAcquisF + spéBonusF > difficulty) {
      isSuccess = true;
      score = spéAcquisF + spéBonusF + statuses;
    }
  } else {
    isSuccess = true;
    if (domainDice.total == "10") {
      score = domainLevel;
    }
    score += spéAcquisF + spéBonusF + statuses;
    if (score <= difficulty) {
      isSuccess = false;
    }
  }
  if (sendMessage) {
    RollToCustomMessage(actor, rollResult, messageTemplate, {
      ...extraMessageData,
      domain: domain,
      domainLevel: domainLevel,
      spécialisation: spécialisation,
      spéBonus: spéBonusF,
      spéAcquis: spéAcquisF,
      isSuccess,
      advantaged: actor.conditions.advantaged,
      stunned: actor.conditions.stunned,
      obscurity: actor.conditions.obscurity,
      weakened: actor.conditions.weakened,
      deafened: actor.conditions.deafened,
      dazzled: actor.conditions.dazzled,
      blinded: actor.conditions.blinded,
      muted: actor.conditions.muted,
      score: score,
      actorID: actor.uuid,
      race: race,
    });
  }

  async function GetRollOptions({
    domain = null,
    spécialisation = null,
    description = null,
    spéBonusF,
    spéAcquisF,
    difficulty = 0,
    template = "systems/shaanrenaissance/templates/chat/spéTest-dialog.hbs",
  } = {}) {
    const html = await renderTemplate(template, {
      actor,
      domain,
      spécialisation,
      difficulty,
      description,
    });
    const actorData = actor.toObject(!1);
    const TestData = {
      domain: domain,
      domainLevel: domainLevel,
      spécialisation: spécialisation,
      spéBonus: spéBonusF,
      spéAcquis: spéAcquisF,
    };
    const config = CONFIG.shaanRenaissance;

    return new Promise((resolve) => {
      const data = {
        title: game.i18n.format("chat.necroseTest.title"),
        content: html,
        data: TestData,
        actor: actorData,
        buttons: {
          normal: {
            label: game.i18n.localize("chat.actions.roll"),
            callback: (html) =>
              resolve(_processdomainTestOptions(html[0].querySelector("form"))),
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
  function _processdomainTestOptions(form) {
    return {
      difficulty: parseInt(form.difficulty?.value),
      domain: parseInt(form.domain?.value),
      spécialisation: parseInt(form.spécialisation?.value),
    };
  }
}

export async function RollToCustomMessage(
  actor = null,
  rollResult,
  template,
  extraData
) {
  let templateContext = {
    ...extraData,
    roll: rollResult,
    tooltip: await rollResult.getTooltip(),
  };
  let chatData;
  if (game.dice3d != undefined) {
    chatData = {
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor }),
      content: await renderTemplate(template, templateContext),
      sound: CONFIG.sounds.dice,
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
    };
  } else {
    chatData = {
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor }),
      content: await renderTemplate(template, templateContext),
      sound: CONFIG.sounds.dice,
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
    };
  }
  ChatMessage.create(chatData);
}

export async function RegenHP({
  actor = null,
  extraMessageData,
  hp = null,
  malusEsprit = null,
  malusAme = null,
  malusCorps = null,
  sendMessage = true,
} = {}) {
  const actorData = actor ? actor.system : null;
  const messageTemplate =
    "systems/shaanrenaissance/templates/chat/regenHP-chat.hbs";

  let checkOptions = await GetRegenOptions({
    malusEsprit,
    malusAme,
    malusCorps,
  });

  if (checkOptions.cancelled) {
    return;
  }

  malusEsprit = Number(checkOptions.malusEsprit);
  malusAme = Number(checkOptions.malusAme);
  malusCorps = Number(checkOptions.malusCorps);

  if (actorData.attributes.hpEsprit.value < 0) {
    malusEsprit =
      Number(malusEsprit) - Number(actorData.attributes.hpEsprit.value);
  }
  if (actorData.attributes.hpAme.value < 0) {
    malusAme = Number(malusAme) - Number(actorData.attributes.hpAme.value);
  }
  if (actorData.attributes.hpCorps.value < 0) {
    malusCorps =
      Number(malusCorps) - Number(actorData.attributes.hpCorps.value);
  }

  let corps = "1d10[Corps]";
  let ame = "1d10[Ame]";
  let esprit = "1d10[Esprit]";
  let rollFormula = `{${corps} - ${malusCorps}, ${ame} - ${malusAme}, ${esprit} - ${malusEsprit}}`;

  let rollData = {
    actor,
    hp,
    malusEsprit,
    malusAme,
    malusCorps,
  };
  let rollResult = await new Roll(rollFormula, rollData).roll({ async: true });
  let dice3d;
  if (game.dice3d != undefined) {
    dice3d = game.dice3d.showForRoll(rollResult, game.user, true);
    dice3d;
  }

  let regenEsprit;
  if (
    rollResult.terms[0].rolls[2].dice[0].total == 10 ||
    rollResult.terms[0].rolls[2].total < 0
  ) {
    regenEsprit = -1;
  } else {
    regenEsprit = rollResult.terms[0].rolls[2].dice[0].total;
  }
  let hpEspritF = hp.hpEsprit.value + regenEsprit;
  if (hpEspritF > hp.hpEsprit.max) {
    hpEspritF = hp.hpEsprit.max;
  }
  let regenAme;
  if (
    rollResult.terms[0].rolls[1].dice[0].total == 10 ||
    rollResult.terms[0].rolls[1].total < 0
  ) {
    regenAme = -1;
  } else {
    regenAme = rollResult.terms[0].rolls[1].dice[0].total;
  }
  let hpAmeF = hp.hpAme.value + regenAme;
  if (hpAmeF > hp.hpAme.max) {
    hpAmeF = hp.hpAme.max;
  }
  let regenCorps;
  if (
    rollResult.terms[0].rolls[0].dice[0].total == 10 ||
    rollResult.terms[0].rolls[0].total < 0
  ) {
    regenCorps = -1;
  } else {
    regenCorps = rollResult.terms[0].rolls[0].dice[0].total;
  }
  let hpCorpsF = hp.hpCorps.value + regenCorps;

  if (hpCorpsF > hp.hpCorps.max) {
    hpCorpsF = hp.hpCorps.max;
  }
  hp.hpEsprit.value = hpEspritF;
  hp.hpAme.value = hpAmeF;
  hp.hpCorps.value = hpCorpsF;
  actor.update({
    system: {
      attributes: {
        hpEsprit: {
          value: hpEspritF,
        },
        hpAme: {
          value: hpAmeF,
        },
        hpCorps: {
          value: hpCorpsF,
        },
      },
    },
  });
  if (sendMessage) {
    RegenToCustomMessage(actor, rollResult, messageTemplate, {
      ...extraMessageData,
      actor: actor,
      hp: hp,
      regenEsprit,
      regenAme,
      regenCorps,
      actorID: actor.uuid,
    });
  }

  async function RegenToCustomMessage(
    actor = null,
    rollResult,
    template,
    extraData
  ) {
    let templateContext = {
      ...extraData,
      actor: actor,
      hp: hp,
      regenEsprit,
      regenAme,
      regenCorps,
      roll: rollResult,
      tooltip: await rollResult.getTooltip(),
    };

    let chatData = {
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor }),
      content: await renderTemplate(template, templateContext),
      sound: CONFIG.sounds.dice,
      type: CONST.CHAT_MESSAGE_TYPES.OTHER,
    };
    ChatMessage.create(chatData);
  }

  async function GetRegenOptions({
    hp = null,
    malusEsprit = null,
    malusAme = null,
    malusCorps = null,
    template = "systems/shaanrenaissance/templates/chat/regen-dialog.hbs",
  } = {}) {
    const html = await renderTemplate(template, {
      actor,
      hp,
      malusEsprit,
      malusAme,
      malusCorps,
    });
    const actorData = actor.toObject(!1);

    return new Promise((resolve) => {
      const data = {
        title: game.i18n.format("chat.regenHP.title"),
        content: html,
        hp: hp,
        actor: actorData,
        buttons: {
          normal: {
            label: game.i18n.localize("chat.actions.roll"),
            callback: (html) =>
              resolve(_processHPRegenOptions(html[0].querySelector("form"))),
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
  function _processHPRegenOptions(form) {
    return {
      malusEsprit: form.malusEsprit?.value,
      malusAme: form.malusAme?.value,
      malusCorps: form.malusCorps?.value,
    };
  }
}

export async function trihnTest({
  actor = null,
  extraMessageData,
  hp = null,
  trihn = null,
  sendMessage = true,
  race = "string",
  state = null,
} = {}) {
  const actorData = actor ? actor.system : null;
  const messageTemplate =
    "systems/shaanrenaissance/templates/chat/trihnTest-chat.hbs";

  let maxTest;
  let dice;
  if (trihn && trihn === "Esprit") {
    maxTest = hp.hpEsprit.value;
    dice = "1d10[Esprit]";
  } else if (trihn && trihn === "Ame") {
    maxTest = hp.hpAme.value;
    dice = "1d10[Ame]";
  } else if (trihn && trihn === "Corps") {
    maxTest = hp.hpCorps.value;
    dice = "1d10[Corps]";
  }
  let rollFormula = `${dice}`;
  let rollData = {
    actor,
    hp,
    trihn,
    maxTest,
  };
  let rollResult = await new Roll(rollFormula, rollData).roll({ async: true });
  let dice3d;
  if (game.dice3d != undefined) {
    dice3d = game.dice3d.showForRoll(rollResult, game.user, true);
    dice3d;
  }
  let statuses = await processStatuses({ actor, race, state });
  let diceResult;
  if (rollResult._total == 10) {
    diceResult = 0;
  } else {
    diceResult = rollResult._total;
    diceResult += statuses;
  }
  let isSuccess = true;
  if (diceResult <= 0 || diceResult > maxTest) {
    isSuccess = false;
  }

  if (sendMessage) {
    trihnTestToCustomMessage(actor, rollResult, messageTemplate, {
      ...extraMessageData,
      actor: actor,
      hp: hp,
      advantaged: actor.conditions.advantaged,
      stunned: actor.conditions.stunned,
      obscurity: actor.conditions.obscurity,
      weakened: actor.conditions.weakened,
      deafened: actor.conditions.deafened,
      dazzled: actor.conditions.dazzled,
      blinded: actor.conditions.blinded,
      muted: actor.conditions.muted,
      actorID: actor.uuid,
    });
  }
  async function trihnTestToCustomMessage(
    actor = null,
    rollResult,
    template,
    extraData
  ) {
    let templateContext = {
      ...extraData,
      actor: actor,
      hp: hp,
      isSuccess,
      score: diceResult,
      roll: rollResult,
      tooltip: await rollResult.getTooltip(),
    };

    let chatData = {
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor }),
      content: await renderTemplate(template, templateContext),
      sound: CONFIG.sounds.dice,
      type: CONST.CHAT_MESSAGE_TYPES.OTHER,
    };
    ChatMessage.create(chatData);
  }
}
function processStatuses({ actor, race, state, domain } = {}) {
  state = 0;
  if (actor.conditions.advantaged) state += 1;
  if (actor.conditions.stunned) state -= 1;
  if (actor.conditions.obscurity && (race != "Boreal" || race != "Boréal"))
    state -= 2;
  if (actor.conditions.weakened) state -= 2;
  if (actor.conditions.deafened) state -= 2;
  if (actor.conditions.dazzled) state -= 2;
  if (actor.conditions.blinded) state -= 4;
  if (
    actor.conditions.muted &&
    (domain === "Social" || domain === "Magie" || domain === "Rituels")
  )
    state -= 4;

  console.log(state);
  return state;
}
