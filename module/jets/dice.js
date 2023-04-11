


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
    difficulty = 0,
    spécialisation = null,
} = {}) {
    const messageTemplate = "";
    const actorData = actor ? actor.system : null;
    let domainList = actorData.skills;

    let checkOptions = await GetRollOptions({ domain, spécialisation, difficulty})

    if(checkOptions.cancelled){
        return;
    }

    domain = checkOptions.domain;
    spécialisation = checkOptions.spécialisation;
    difficulty = checkOptions.difficulty;

    async function GetRollOptions({
        domain = null,
        spécialisation = null,
        difficulty = 0,
        template = "systems/Shaan_Renaissance/templates/chat/domainTest-dialog.hbs" } = {}) {
        const html = await renderTemplate(template, { domain, spécialisation, difficulty });

        return new Promise(resolve => {
          const actorData = actor.toObject(!1);
          const config = CONFIG.shaanRenaissance;
            const data = {
              title: game.i18n.format("chat.domainTest.title"),
              content: html,
              config: config,
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

            new Dialog(data, null).render(true);
            
          });
        }
        function _processdomainTestOptions(form) {
          console.log(form.domain?.value)
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