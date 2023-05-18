export async function Initiative({
    actor = null,
    extraMessageData = {},
    sendMessage = true,
} = {}) {
        const messageTemplate = "systems/shaanrenaissance/templates/chat/initiative.hbs";
        const actorData = actor ? actor.system : null;
        const domain = actorData.attributes.initiative.statistic;
        const domainLevel = actorData.skills[domain].rank + actorData.skills[domain].temp;

        
        let rollFormula = `1d10 + @domainLevel`;

        let rollData = {
            ...actorData,
            domain: domain,
            domainLevel: domainLevel
        };


    let rollResult = await new Roll(rollFormula, rollData).roll({async: true});
    if(rollResult.dice[0].total == 10) {
      rollResult._total = rollResult._total -10
    }
    let dice3d
    if(game.dice3d != undefined) {
      dice3d = game.dice3d.showForRoll(rollResult, game.user, true);
      dice3d;
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
export async function domainTest ({
    actor = null,
    extraMessageData = {},
    sendMessage = true,
    domain = null,
    difficulty = null,
    spécialisation = null,
} = {}) {
    const messageTemplate = "systems/shaanrenaissance/templates/chat/domainTest.hbs";
    let spéDomain
    const actorData = actor ? actor.system : null;

    let checkOptions = await GetRollOptions({ domain, spécialisation, difficulty})

    if(checkOptions.cancelled){
        return;
    }

    domain = checkOptions.domain;
    const spé = checkOptions.spécialisation;
    difficulty = checkOptions.difficulty;


    let corps = "1d10[Corps]";
    let ame = "1d10[Ame]";
    let esprit = "1d10[Esprit]";
    let rollFormula = `{${corps}, ${ame}, ${esprit}}`;

    const domainLevel = actorData.skills[domain].rank + actorData.skills[domain].temp
    let données
    for (const [category, details] of Object.entries(actorData.skills)) {
      if (details.specialisations && details.specialisations[spé]) {
       spéDomain = category;
       données = details.specialisations[spé];
        break;
      }
    }
    let spéBonusF
    let spéAcquisF

    if(spé == "pur") {
      spéBonusF = 0
      spéAcquisF = 0
    }
    else {
      spéBonusF = données.bonus
      spéAcquisF = données.acquis
    }

    let rollData 
    if (spé == "pur") {
      rollData = {
        ...actorData,
        domain: domain,
        domainLevel: domainLevel,
        spécialisation: spé,
        difficulty: difficulty,
        isPure: true
      };
    }
    else {
      rollData = {
        ...actorData,
        domain: domain,
        domainLevel: domainLevel,
        spéBonus: spéBonusF,
        spéAcquis: spéAcquisF,
        spécialisation: spé,
        difficulty: difficulty,
        isPure: false
      };
    }
    let rollResult = await new Roll(rollFormula, rollData).roll({async: true});
    let dice3d
    if(game.dice3d != undefined) {
      dice3d = game.dice3d.showForRoll(rollResult, game.user, true);
      dice3d;
    }
    
    let dice = rollResult.dice
    let déCorps = rollResult.dice[dice.length - 3]
    let déAme = rollResult.dice[dice.length - 2 ]
    let déEsprit = rollResult.dice[dice.length - 1 ]
  
    if(déCorps.total == déAme.total && déAme.total == déEsprit.total && déEsprit != 0) {
      rollResult.symbiose = "Réussite"
    }
    else if (déCorps == déAme.total && déAme.total == déEsprit.total && déEsprit == 0) {
      rollResult.symbiose = "Echec"
    }
    else {
      rollResult.symbiose = "Not"
    }

    let domainDice 
    if(domain == "Technique" || domain == "Savoir" || domain == "Social"){
      domainDice = déEsprit
    }
    else if(domain == "Arts" || domain == "Shaan" || domain == "Magie"){
      domainDice = déAme
    }
    else if(domain == "Rituels" || domain == "Survie" || domain == "Combat"){
      domainDice = déCorps
    }
    if(!difficulty){
      difficulty = 0
    }
    let score
    if(domainDice.total == "10"){
      score = 0
    } else {
      score = domainDice.total
    }
    // Check
    let isSuccess
    if(score > domainLevel){
      isSuccess = false
      if(rollResult.symbiose == "Réussite"){
        isSuccess = true
        score = spéAcquisF + spéBonusF + 10
      }
    } else {
      score = score + spéAcquisF + spéBonusF
      if(score == "0") {
        isSuccess = false 
      } else {
        if(score > difficulty){
          isSuccess = true
        } else {
          isSuccess = false
          if(rollResult.symbiose == "Réussite"){
            isSuccess = true
            score = score + 10
          }
        }
      }
    }
    console.log(isSuccess, score)
    if (sendMessage) {
      RollToCustomMessage(actor, rollResult, messageTemplate, {
        ...extraMessageData,
        domain: domain,
        spécialisation: spécialisation,
        actorID: actor.uuid
      });
    }

    async function GetRollOptions({
        domain = null,
        spécialisation = null,
        difficulty = 0,
        template = "systems/shaanrenaissance/templates/chat/domainTest-dialog.hbs" } = {}) {
        const html = await renderTemplate(template, { actor, domain, spécialisation, difficulty });
        const actorData = actor.toObject(!1);
          const config = CONFIG.shaanRenaissance;

        return new Promise(resolve => {
            const data = {
              title: game.i18n.format("chat.domainTest.title"),
              content: html,
              domains: config.SRdomains,
              actor: actorData,
              buttons: {
                normal: {
                  label: game.i18n.localize("chat.actions.roll"),
                  callback: html => resolve(_processdomainTestOptions(html[0].querySelector("form")))
                },
                cancel: {
                  label: game.i18n.localize("chat.actions.cancel"),
                  callback: html => resolve({ cancelled: true })
                }
              },
              default: "normal",
              close: () => resolve({ cancelled: true })
            };
            
            new Dialog(data,null).render(true);
          });
        }
        function _processdomainTestOptions(form) {
            return {
              difficulty: form.difficulty?.value,
              domain: form.domain?.value,
              spécialisation: form.spécialisation?.value
            }
          }
    }
export async function SpéTest ({
  actor = null,
  extraMessageData = {},
  sendMessage = true,
  domain = null,
  difficulty = null,
  spécialisation = null,
  description = null
} = {}) {
  const messageTemplate = "systems/shaanrenaissance/templates/chat/domainTest.hbs";
  const actorData = actor ? actor.system : null;
  const domainLevel = actorData.skills[domain].rank + actorData.skills[domain].temp
  const spéBonus = actorData.skills[domain].specialisations[spécialisation].bonus;
  const spéAcquis = actorData.skills[domain].specialisations[spécialisation].acquis;

  let checkOptions = await GetRollOptions({ domain, spécialisation, difficulty, description })

  if(checkOptions.cancelled){
      return;
  }

  difficulty = checkOptions.difficulty;

  let corps = "1d10[Corps]";
  let ame = "1d10[Ame]";
  let esprit = "1d10[Esprit]";
  let rollFormula = `{${corps}, ${ame}, ${esprit}}`;

  let rollData = {
    ...actorData,
    domain: domain,
    domainLevel: domainLevel,
    spécialisation: spécialisation,
    spéBonus: spéBonus,
    spéAcquis: spéAcquis,
    difficulty: difficulty,
    isPure: false
  };
  let rollResult = await new Roll(rollFormula, rollData).roll({async: true}); 
  let dice3d
  if(game.dice3d != undefined) {
    dice3d = game.dice3d.showForRoll(rollResult, game.user, true);
    dice3d;
  }

  let dice = rollResult.dice
  let déCorps = rollResult.dice[dice.length - 3]
  let déAme = rollResult.dice[dice.length - 2 ]
  let déEsprit = rollResult.dice[dice.length - 1 ]
  

  if(déCorps.total == déAme.total && déAme.total == déEsprit.total && déEsprit != 0) {
    rollResult.symbiose = "Réussite"
  }
  else if (déCorps == déAme.total && déAme.total == déEsprit.total && déEsprit == 0) {
    rollResult.symbiose = "Echec"
  }
  else {
    rollResult.symbiose = "Not"
  }

  let domainDice 
  if(domain == "Technique" || domain == "Savoir" || domain == "Social"){
    domainDice = déEsprit
  }
  else if(domain == "Arts" || domain == "Shaan" || domain == "Magie"){
    domainDice = déAme
  }
  else if(domain == "Rituels" || domain == "Survie" || domain == "Combat"){
    domainDice = déCorps
  }
  if(!difficulty){
    difficulty = 0
  }
  let score
  if(domainDice.total == "10"){
    score = 0
  } else {
    score = domainDice.total
  }
  // Check
  let isSuccess
  if(score > domainLevel){
    isSuccess = false
    if(rollResult.symbiose == "Réussite"){
      isSuccess = true
      score = spéAcquis + spéBonus + 10
    }
  } else {
    score = score + spéAcquis + spéBonus
    if(score == "0") {
      isSuccess = false 
    } else {
      if(score > difficulty){
        isSuccess = true
      } else {
        isSuccess = false
        if(rollResult.symbiose == "Réussite"){
          isSuccess = true
          score = score + 10
        }
      }
    }
  }
  if (sendMessage) {
    RollToCustomMessage(actor, rollResult, messageTemplate, {
      ...extraMessageData,
      domain: domain,
      domainLevel: domainLevel,
      spécialisation: spécialisation,
      spéBonus: spéBonus,
      spéAcquis: spéAcquis,
      actorID: actor.uuid,
    });
  }

  async function GetRollOptions({
      domain = null,
      spécialisation = null,
      description = null,
      difficulty = 0,
      template = "systems/shaanrenaissance/templates/chat/spéTest-dialog.hbs" } = {}) {
      const html = await renderTemplate(template, { actor, domain, spécialisation, difficulty, description });
      const actorData = actor.toObject(!1);
      const TestData = {
        domain: domain,
        domainLevel: domainLevel,
        spécialisation: spécialisation,
        spéBonus: spéBonus,
        spéAcquis: spéAcquis,
      }

      return new Promise(resolve => {
          const data = {
            title: game.i18n.format("chat.domainTest.title"),
            content: html,
            data: TestData,
            actor: actorData,
            buttons: {
              normal: {
                label: game.i18n.localize("chat.actions.roll"),
                callback: html => resolve(_processdomainTestOptions(html[0].querySelector("form")))
              },
              cancel: {
                label: game.i18n.localize("chat.actions.cancel"),
                callback: html => resolve({ cancelled: true })
              }
            },
            default: "normal",
            close: () => resolve({ cancelled: true }),
          };
          // console.log(data)
          new Dialog(data,null).render(true);

        });
      }
      function _processdomainTestOptions(form) {
          return {
            difficulty: parseInt(form.difficulty?.value),
            domain: parseInt(form.domain?.value),
            spécialisation: parseInt(form.spécialisation?.value)
          }
        }
  }
export async function necroseTest ({
  actor = null,
  extraMessageData = {},
  sendMessage = true,
  domain = null,
  difficulty = null,
  spécialisation = null,
  race = null
} = {}) {
  const messageTemplate = "systems/shaanrenaissance/templates/chat/nécroseTest.hbs";
  const actorData = actor ? actor.system : null;
  const raceName = race

  let checkOptions = await GetRollOptions({ domain, spécialisation, difficulty})

  if(checkOptions.cancelled){
      return;
  }

  domain = checkOptions.domain;
  const spé = checkOptions.spécialisation;
  difficulty = checkOptions.difficulty;

  let rollFormula

  if(raceName == "Humain") {
    let nécrose = "1d10[Necrose]";
    let esprit = "1d10[Esprit]";
    rollFormula = `{${nécrose}, ${esprit}}`;
  } 
  else{
    let nécrose = "1d10[Necrose]";
    rollFormula = `${nécrose}`;
  }


  const domainLevel = actorData.skills[domain].rank + actorData.skills[domain].temp
  let spéDomain
    let données
    for (const [category, details] of Object.entries(actorData.skills)) {
      if (details.specialisations && details.specialisations[spé]) {
       spéDomain = category;
       données = details.specialisations[spé];
        break;
      }
    }
    let spéBonusF
    let spéAcquisF

    if(spé == "pur") {
      spéBonusF = 0
      spéAcquisF = 0
    }
    else {
      spéBonusF = données.bonus
      spéAcquisF = données.acquis
    }

    let rollData 
    if (spé == "pur") {
      rollData = {
        ...actorData,
        domain: domain,
        domainLevel: domainLevel,
        spécialisation: spé,
        difficulty: difficulty,
        isPure: true
      };
    }
    else {
      rollData = {
        ...actorData,
        domain: domain,
        domainLevel: domainLevel,
        spéBonus: spéBonusF,
        spéAcquis: spéAcquisF,
        spécialisation: spé,
        difficulty: difficulty,
        isPure: false
      };
    }
  let rollResult = await new Roll(rollFormula, rollData).roll({async: true}); 
  let dice3d
  if(game.dice3d != undefined) {
    dice3d = game.dice3d.showForRoll(rollResult, game.user, true);
    dice3d;
  }
  let dice = rollResult.dice
  let domainDice 
  if(race == "Humain"){
    domainDice = rollResult.dice[dice.length - 2]
  } else {
    domainDice = rollResult.dice[dice.length - 1]
  }
  if(!difficulty){
    difficulty = 0
  }
  let score
  if(domainDice.total == "10"){
    score = domainLevel
  } else {
    score = domainDice.total
  }

  // Check
  let isSuccess
  if(score > domainLevel){
    isSuccess = false
  } else {
    isSuccess = true 
    if(domainDice.total == "10") {
      score = domainLevel
    }
    score = score + spéAcquisF + spéBonusF
    if(score <= difficulty){
      isSuccess = false
    }
  }

  if (sendMessage) {
    RollToCustomMessage(actor, rollResult, messageTemplate, {
      ...extraMessageData,
      domain: domain,
      spécialisation: spécialisation,
      actorID: actor.uuid,
      race: race
    });
  }

  async function GetRollOptions({
      domain = null,
      spécialisation = null,
      difficulty = 0,
      template = "systems/shaanrenaissance/templates/chat/nécroseTest-dialog.hbs" } = {}) {
      const html = await renderTemplate(template, { actor, domain, spécialisation, difficulty });
      const actorData = actor.toObject(!1);
        const config = CONFIG.shaanRenaissance;

      return new Promise(resolve => {
          const data = {
            title: game.i18n.format("chat.necroseTest.title"),
            content: html,
            domains: config.SRdomains,
            actor: actorData,
            buttons: {
              normal: {
                label: game.i18n.localize("chat.actions.roll"),
                callback: html => resolve(_processdomainTestOptions(html[0].querySelector("form")))
              },
              cancel: {
                label: game.i18n.localize("chat.actions.cancel"),
                callback: html => resolve({ cancelled: true })
              }
            },
            default: "normal",
            close: () => resolve({ cancelled: true }),
          };
          new Dialog(data,null).render(true);

        });
      }
      function _processdomainTestOptions(form) {
          return {
            difficulty: form.difficulty?.value,
            domain: form.domain?.value,
            spécialisation: form.spécialisation?.value
          }
        }
  }

export async function SpéTestNécr ({
  actor = null,
  race,
  extraMessageData = {},
  sendMessage = true,
  domain = null,
  difficulty = null,
  spécialisation = null,
  description = null
} = {}) {
  const messageTemplate = "systems/shaanrenaissance/templates/chat/spéTestNécr.hbs";
  const actorData = actor ? actor.system : null;
  const domainLevel = actorData.skills[domain].rank + actorData.skills[domain].temp
  const spéBonus = actorData.skills[domain].specialisations[spécialisation].bonus;
  const spéAcquis = actorData.skills[domain].specialisations[spécialisation].acquis;
  const raceName = race

  let checkOptions = await GetRollOptions({ domain, spécialisation, difficulty, description })

  if(checkOptions.cancelled){
      return;
  }

  difficulty = checkOptions.difficulty;

  let rollFormula

  if(raceName == "Humain") {
    let nécrose = "1d10[Necrose]";
    let esprit = "1d10[Esprit]";
    rollFormula = `{${nécrose}, ${esprit}}`;
  }
  else{
    let nécrose = "1d10[Necrose]";
    rollFormula = `${nécrose}`;
  }

  let rollData = {
    ...actorData,
    domain: domain,
    race: raceName,
    domainLevel: domainLevel,
    spécialisation: spécialisation,
    spéBonus: spéBonus,
    spéAcquis: spéAcquis,
    difficulty: difficulty
  };
  let rollResult = await new Roll(rollFormula, rollData).roll({async: true}); 
  let dice3d
  if(game.dice3d != undefined) {
    dice3d = game.dice3d.showForRoll(rollResult, game.user, true);
    dice3d;
  }

  let dice = rollResult.dice
  let domainDice 
  if(race == "Humain"){
    domainDice = rollResult.dice[dice.length - 2]
  } else {
    domainDice = rollResult.dice[dice.length - 1]
  }
  if(!difficulty){
    difficulty = 0
  }
  let score
  if(domainDice.total == "10"){
    score = domainLevel
  } else {
    score = domainDice.total
  }

  // Check
  let isSuccess
  if(score > domainLevel){
    isSuccess = false
  } else {
    isSuccess = true 
    if(domainDice.total == "10") {
      score = domainLevel
    }
    score = score + spéAcquis + spéBonus
    if(score <= difficulty){
      isSuccess = false
    }
  }
  if (sendMessage) {
    RollToCustomMessage(actor, rollResult, messageTemplate, {
      ...extraMessageData,
      domain: domain,
      domainLevel: domainLevel,
      spécialisation: spécialisation,
      spéBonus: spéBonus,
      spéAcquis: spéAcquis,
      actorID: actor.uuid,
    });
  }

  async function GetRollOptions({
      domain = null,
      spécialisation = null,
      description = null,
      difficulty = 0,
      template = "systems/shaanrenaissance/templates/chat/spéTest-dialog.hbs" } = {}) {
      const html = await renderTemplate(template, { actor, domain, spécialisation, difficulty, description });
      const actorData = actor.toObject(!1);
      const TestData = {
        domain: domain,
        domainLevel: domainLevel,
        spécialisation: spécialisation,
        spéBonus: spéBonus,
        spéAcquis: spéAcquis
      }
        const config = CONFIG.shaanRenaissance;

      return new Promise(resolve => {
          const data = {
            title: game.i18n.format("chat.necroseTest.title"),
            content: html,
            data: TestData,
            actor: actorData,
            buttons: {
              normal: {
                label: game.i18n.localize("chat.actions.roll"),
                callback: html => resolve(_processdomainTestOptions(html[0].querySelector("form")))
              },
              cancel: {
                label: game.i18n.localize("chat.actions.cancel"),
                callback: html => resolve({ cancelled: true })
              }
            },
            default: "normal",
            close: () => resolve({ cancelled: true }),
          };
          console.log(data)
          new Dialog(data,null).render(true);

        });
      }
      function _processdomainTestOptions(form) {
          return {
            difficulty: parseInt(form.difficulty?.value),
            domain: parseInt(form.domain?.value),
            spécialisation: parseInt(form.spécialisation?.value)
          }
        }
  }

export async function RollToCustomMessage(actor = null, rollResult, template, extraData) {
    let templateContext = {
        ...extraData,
        roll: rollResult,
        tooltip: await rollResult.getTooltip()
    };
    let chatData
    if(game.dice3d != undefined) {
      chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({actor}),
        content: await renderTemplate(template, templateContext),
        sound: CONFIG.sounds.dice,
        type: CONST.CHAT_MESSAGE_TYPES.ROLL
      }
    }
    else {
      chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({actor}),
        content: await renderTemplate(template, templateContext),
        sound: CONFIG.sounds.dice,
        type: CONST.CHAT_MESSAGE_TYPES.ROLL
      }
    }
    console.log(rollResult)

    ChatMessage.create(chatData);
}

export async function RegenHP({
  actor = null,
  extraMessageData,
  hp = null,
  malusEsprit = null, 
  malusAme = null,
  malusCorps = null,
  sendMessage = true
} = {}) {
  const actorData = actor ? actor.system : null;
  const messageTemplate = "systems/shaanrenaissance/templates/chat/regenHP-chat.hbs";
  
  let checkOptions = await GetRegenOptions({ malusEsprit, malusAme, malusCorps })

  if(checkOptions.cancelled){
    return;
  }

  malusEsprit = checkOptions.malusEsprit;
  malusAme = checkOptions.malusAme;
  malusCorps = checkOptions.malusCorps;

  let corps = "1d10[Corps] - @malusCorps";
  let ame = "1d10[Ame] - @malusAme";
  let esprit = "1d10[Esprit] - @malusAme";
  let rollFormula = `{${corps}, ${ame}, ${esprit}}`;

  let rollData = {
    actor,
    hp,
    malusEsprit,
    malusAme,
    malusCorps
  }
  let rollResult = await new Roll(rollFormula, rollData).roll({async: true});
  let dice3d
  if(game.dice3d != undefined) {
    dice3d = game.dice3d.showForRoll(rollResult, game.user, true);
    dice3d;
  }

  let regenEsprit
  if(rollResult.terms[0].rolls[2].dice[0].total == 10 ){
    regenEsprit = (-1)
  }
  else {
    regenEsprit = rollResult.terms[0].rolls[2].dice[0].total
  }
  let hpEspritF = hp.hpEsprit.value + regenEsprit
  if(hpEspritF > hp.hpEsprit.max){
    hpEspritF = hp.hpEsprit.max
  }
  let regenAme
  if(rollResult.terms[0].rolls[1].dice[0].total == 10 ){
    regenAme = (-1)
  }
  else {
    regenAme = rollResult.terms[0].rolls[1].dice[0].total
  }
  let hpAmeF = hp.hpAme.value + regenAme
  if(hpAmeF > hp.hpAme.max){
    hpAmeF = hp.hpAme.max
  }
  let regenCorps
  if(rollResult.terms[0].rolls[0].dice[0].total == 10 ){
    regenCorps = (-1)
  }
  else {
    regenCorps = rollResult.terms[0].rolls[0].dice[0].total
  }
  let hpCorpsF = hp.hpCorps.value + regenCorps

  if(hpCorpsF > hp.hpCorps.max){
    hpCorpsF = hp.hpCorps.max
  }
  console.log(hpEspritF, hpAmeF, hpCorpsF)
  hp.hpEsprit.value = hpEspritF
  hp.hpAme.value = hpAmeF
  hp.hpCorps.value = hpCorpsF
  actor.update({
    system: {
      attributes: {
        hpEsprit: {
          value: hpEspritF
        },
        hpAme: {
          value: hpAmeF
        },
        hpCorps: {
          value: hpCorpsF
        }
      }
    }
  })
  if(sendMessage) {
    RegenToCustomMessage(actor, rollResult, messageTemplate, {
      ...extraMessageData, 
      actor: actor,
      hp: hp,
      regenEsprit,
      regenAme,
      regenCorps,
      actorID: actor.uuid
    })
  }

  async function RegenToCustomMessage(actor = null, rollResult, template, extraData) {
    let templateContext = {
      ...extraData,
      actor: actor,
      hp: hp,
      regenEsprit,
      regenAme,
      regenCorps,
      roll: rollResult,
      tooltip: await rollResult.getTooltip()
    };

    let chatData = {
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({actor}),
      content: await renderTemplate(template, templateContext),
      sound: CONFIG.sounds.dice,
      type: CONST.CHAT_MESSAGE_TYPES.OTHER
    }

    ChatMessage.create(chatData);
  }

  async function GetRegenOptions({
    hp = null,
    malusEsprit = null,
    malusAme = null,
    malusCorps = null,
    template = "systems/shaanrenaissance/templates/chat/regen-dialog.hbs"} = {}) {
      const html = await renderTemplate(template, { actor, hp, malusEsprit, malusAme, malusCorps});
      const actorData = actor.toObject(!1)

      return new Promise(resolve => {
        const data = {
          title: game.i18n.format("chat.regenHP.title"),
          content: html,
          hp: hp,
          actor: actorData,
          buttons: {
            normal: {
              label: game.i18n.localize("chat.actions.roll"),
              callback: html => resolve(_processHPRegenOptions(html[0].querySelector("form")))
            },
            cancel: {
              label: game.i18n.localize("chat.actions.cancel"),
              callback: html => resolve({ cancelled: true })
            }
          },
          default: "normal",
          close: () => resolve({ cancelled: true })
        }

        new Dialog(data,null).render(true)
      })
    }
    function _processHPRegenOptions(form) {
      return {
        malusEsprit: form.malusEsprit?.value,
        malusAme: form.malusAme?.value,
        malusCorps: form.malusCorps?.value
      }
    }
}