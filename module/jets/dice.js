


export async function Initiative({
    actor = null,
    extraMessageData = {},
    sendMessage = true,
} = {}) {
        const messageTemplate = "systems/Shaan_Renaissance/templates/chat/initiative.hbs";
        const actorData = actor ? actor.system : null;
        const domain = actorData.attributes.initiative.statistic;
        const domainLevel = actorData.skills[domain].rank;

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
    spécialisation = checkOptions.spécialisation;
    difficulty = checkOptions.difficulty;

    let corps = "1d10[red]";
    let ame = "1d10[blue]";
    let esprit = "1d10[yellow]";
    let rollFormula = `{${corps}, ${ame}, ${esprit}}`;

    let rollData = {
      ...actorData,
      domain: domain,
      spécialisation: spécialisation
    };
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
              close: () => resolve({ cancelled: true }),
            };
            console.log(data)
            new Dialog(data,null).render(true);

          });
        }
        function _processdomainTestOptions(form) {
          console.log(form.domain?.value);
          console.log(form.spécialisation?.value)
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
        roll: rollResult,
        content: await renderTemplate(template, templateContext),
        sound: CONFIG.sounds.dice,
        type: CONST.CHAT_MESSAGE_TYPES.ROLL
    }

    ChatMessage.create(chatData);
}