export async function Initiative({
    actor = null,
    extraMessageData = {},
    sendMessage = true,
} = {}) {
        const messageTemplate = "systems/Shaan_Renaissance/templates/chat/initiative.hbs";
        const actorData = actor ? actor.system : null;
        const domain = actorData.attributes.initiative.statistic;
        const domainLevel = actorData.skills[domain].rank + actorData.skills[domain].temp;

        
        let rollFormula = `1d10 + @domainLevel`;

        let rollData = {
            ...actorData,
            domain: domain,
            domainLevel: domainLevel
        };


    let rollresult = await new Roll(rollFormula, rollData).roll({async: true});

    if (sendMessage) {
        RollToCustomMessage(actor, rollresult, messageTemplate, {
          ...extraMessageData,
          domain: domain,
          domainLevel: domainLevel,
          actorID: actor.uuid,
        });
      }
      return rollresult;
    }
export async function domainTest ({
    actor = null,
    extraMessageData = {},
    sendMessage = true,
    domain = null,
    difficulty = null,
    spécialisation = null,
} = {}) {
    const messageTemplate = "systems/Shaan_Renaissance/templates/chat/domainTest.hbs";
    const actorData = actor ? actor.system : null;

    let checkOptions = await GetRollOptions({ domain, spécialisation, difficulty})

    if(checkOptions.cancelled){
        return;
    }

    domain = checkOptions.domain;
    const spé = checkOptions.spécialisation;
    difficulty = checkOptions.difficulty;


    let corps = "1d10[red]";
    let ame = "1d10[blue]";
    let esprit = "1d10[yellow]";
    let rollFormula = `{${corps}, ${ame}, ${esprit}}`;

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
    // rollResult.toMessage()
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
        template = "systems/Shaan_Renaissance/templates/chat/domainTest-dialog.hbs" } = {}) {
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
          // console.log(domain)
    }
export async function SpéTest ({
  actor = null,
  extraMessageData = {},
  sendMessage = true,
  domain = null,
  difficulty = null,
  spécialisation = null,
} = {}) {
  const messageTemplate = "systems/Shaan_Renaissance/templates/chat/domainTest.hbs";
  const actorData = actor ? actor.system : null;
  const domainLevel = actorData.skills[domain].rank + actorData.skills[domain].temp
  const spéBonus = actorData.skills[domain].specialisations[spécialisation].bonus;
  const spéAcquis = actorData.skills[domain].specialisations[spécialisation].acquis;

  let checkOptions = await GetRollOptions({ domain, spécialisation, difficulty })

  if(checkOptions.cancelled){
      return;
  }

  difficulty = checkOptions.difficulty;

  let corps = "1d10[red]";
  let ame = "1d10[blue]";
  let esprit = "1d10[yellow]";
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
      difficulty = 0,
      template = "systems/Shaan_Renaissance/templates/chat/spéTest-dialog.hbs" } = {}) {
      const html = await renderTemplate(template, { actor, domain, spécialisation, difficulty });
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
        // console.log(domain)
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
  const messageTemplate = "systems/Shaan_Renaissance/templates/chat/nécroseTest.hbs";
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
    let nécrose = "1d10[black]";
    let esprit = "1d10[yellow]";
    rollFormula = `{${nécrose}, ${esprit}}`;
  } 
  else{
    let nécrose = "1d10[black]";
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
  if (sendMessage) {
    RollToCustomMessage(actor, rollResult, messageTemplate, {
      ...extraMessageData,
      domain: domain,
      spécialisation: spécialisation,
      actorID: actor.uuid,
    });
  }

  async function GetRollOptions({
      domain = null,
      spécialisation = null,
      difficulty = 0,
      template = "systems/Shaan_Renaissance/templates/chat/nécroseTest-dialog.hbs" } = {}) {
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
} = {}) {
  const messageTemplate = "systems/Shaan_Renaissance/templates/chat/spéTestNécr.hbs";
  const actorData = actor ? actor.system : null;
  const domainLevel = actorData.skills[domain].rank + actorData.skills[domain].temp
  const spéBonus = actorData.skills[domain].specialisations[spécialisation].bonus;
  const spéAcquis = actorData.skills[domain].specialisations[spécialisation].acquis;
  const raceName = race

  let checkOptions = await GetRollOptions({ domain, spécialisation, difficulty })

  if(checkOptions.cancelled){
      return;
  }

  difficulty = checkOptions.difficulty;

  let rollFormula

  if(raceName == "Humain") {
    let nécrose = "1d10[black]";
    let esprit = "1d10[yellow]";
    rollFormula = `{${nécrose}, ${esprit}}`;
  }
  else{
    let nécrose = "1d10[black]";
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
      difficulty = 0,
      template = "systems/Shaan_Renaissance/templates/chat/spéTest-dialog.hbs" } = {}) {
      const html = await renderTemplate(template, { actor, domain, spécialisation, difficulty });
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

    let chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({actor}),
        content: await renderTemplate(template, templateContext),
        sound: CONFIG.sounds.dice,
        type: CONST.CHAT_MESSAGE_TYPES.ROLL
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
  const messageTemplate = "systems/Shaan_Renaissance/templates/chat/regenHP-chat.hbs";
  
  let checkOptions = await GetRegenOptions({ malusEsprit, malusAme, malusCorps })

  malusEsprit = checkOptions.malusEsprit;
  malusAme = checkOptions.malusAme;
  malusCorps = checkOptions.malusCorps;

  let corps = "1d10[red] - @malusCorps";
  let ame = "1d10[blue] - @malusAme";
  let esprit = "1d10[yellow] - @malusAme";
  let rollFormula = `{${corps}, ${ame}, ${esprit}}`;

  let rollData = {
    actor,
    hp,
    malusEsprit,
    malusAme,
    malusCorps
  }
  let rollResult = await new Roll(rollFormula, rollData).roll({async: true});

  let regenEsprit
  if(rollResult.terms[0].rolls[2].dice[0].total == 10 ){
    regenEsprit = (-1)
  }
  else {
    regenEsprit = rollResult.terms[0].rolls[2].dice[0].total
  }
  let hpEspritF = hp.hpEsprit.temp + regenEsprit
  if(hpEspritF > hp.hpEsprit.value){
    hpEspritF = hp.hpEsprit.value
  }
  let regenAme
  if(rollResult.terms[0].rolls[1].dice[0].total == 10 ){
    regenAme = (-1)
  }
  else {
    regenAme = rollResult.terms[0].rolls[1].dice[0].total
  }
  let hpAmeF = hp.hpAme.temp + regenAme
  console.log(hpAmeF)
  if(hpAmeF > hp.hpAme.value){
    hpAmeF = hp.hpAme.value
  }
  let regenCorps
  if(rollResult.terms[0].rolls[0].dice[0].total == 10 ){
    regenEsprit = (-1)
  }
  else {
    regenCorps = rollResult.terms[0].rolls[0].dice[0].total
  }
  let hpCorpsF = hp.hpCorps.temp + regenCorps

  if(hpCorpsF > hp.hpCorps.value){
    hpCorpsF = hp.hpCorps.value
  }
  hp.hpEsprit.temp = hpEspritF
  hp.hpAme.temp = hpAmeF
  hp.hpCorps.temp = hpCorpsF
  actor.update({
    system: {
      attributes: {
        hpEsprit: {
          temp: hpEspritF
        },
        hpAme: {
          temp: hpAmeF
        },
        hpCorps: {
          temp: hpCorpsF
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
    console.log(templateContext)

    let chatData = {
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({actor}),
      content: await renderTemplate(template, templateContext),
      sound: CONFIG.sounds.dice,
      type: CONST.CHAT_MESSAGE_TYPES.OTHER
    }
    console.log(chatData)

    ChatMessage.create(chatData);
  }

  async function GetRegenOptions({
    hp = null,
    malusEsprit = null,
    malusAme = null,
    malusCorps = null,
    template = "systems/Shaan_Renaissance/templates/chat/regen-dialog.hbs"} = {}) {
      const html = await renderTemplate(template, { actor, hp, malusEsprit, malusAme, malusCorps});
      const actorData = actor.toObject(!1)
      const config = CONFIG.shaanRenaissance;

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