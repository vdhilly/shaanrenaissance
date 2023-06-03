export function addChatListeners(app, html, data) {
    const Button = html.find("button.puiser")
    Button.on("click", onPuiser)
}

async function onPuiser(event) {
    const selectedToken = canvas.tokens.controlled;
    if(!selectedToken.length) return ui.notifications.info("Aucun token sélectionné");
    if(selectedToken.length > 1) return ui.notifications.info("Vous ne devez sélectionner qu'un seul token")
    console.log(selectedToken)
    if(selectedToken[0].isOwner != true) return ui.notifications.info("Vous devez sélectionner un token qui vous appartient")
    const chatCard = $(this.parentElement)
    const dice = chatCard.find("input.dice-value");
    const domain = Number(chatCard.find('b.domain').text());
    const domainName = chatCard.find('span.domainName').text();
    const spéBonus = Number(chatCard.find('b.spéBonus').text());
    const acquisBonus = Number(chatCard.find('b.acquisBonu').text());
    const messageTemplate = "systems/shaanrenaissance/templates/chat/puiser.hbs"
    let esprit =  Number(dice[2].value)
    let ame = Number(dice[1].value)
    let corps = Number(dice[0].value)
    let sendMessage = true

    let baseDice
    let puiser1
    let puiser2

    if(domainName == "Technique" || domainName == "Savoir" || domainName == "Social"){
        baseDice = {value: esprit, label: "esprit", flavor:"Esprit", color: "jaune", checked: false}
        puiser1 = {value: ame, label: "ame", flavor:"Ame", color: "bleu", checked: false}
        puiser2 = {value: corps, label: "corps", flavor:"Corps", color: "rouge", checked: false}
      }
      else if(domainName == "Arts" || domainName == "Shaan" || domainName == "Magie"){
        baseDice = {value: ame, label: "ame", flavor:"Ame", color: "bleu", checked: false}
        puiser1 = {value: esprit, label: "esprit", flavor:"Esprit", color: "jaune", checked: false}
        puiser2 = {value: corps, label: "corps", flavor:"Corps", color: "rouge", checked: false}
      }
      else if(domainName == "Rituels" || domainName == "Survie" || domainName == "Combat"){
        baseDice = {value: corps, label: "corps", flavor:"Corps", color: "rouge", checked: false}
        puiser1 = {value: esprit, label: "esprit", flavor:"Esprit", color: "jaune", checked: false}
        puiser2 = {value: ame, label: "ame", flavor:"Ame", color: "bleu", checked: false}
      }    
      if(baseDice.value == 10){
        baseDice.value = 0
      }
      if(puiser1.value == 10){
        baseDice.value = 0
      }
      if(puiser2.value == 10){
        baseDice.value = 0
      }
      console.log(baseDice, puiser1, puiser2)
      if(baseDice.value > domain && puiser1.value > domain && puiser2.value > domain) {
        return ui.notifications.error("Vous ne pouvez puiser dans aucun Trihn.");
      }
    //   Définition des choix
      let choix = {}
      choix.bonus = spéBonus+acquisBonus 
      if(puiser1.value != 0 && puiser1.value <= domain) {
        choix.choix1 = puiser1
      }
      if(puiser2.value != 0 && puiser2.value <= domain) {
        choix.choix2 = puiser2
      }
      if(baseDice.value != 0 && puiser1.value != 0 && baseDice.value+puiser1.value <= domain ) {
        choix.choix3 = {value: baseDice.value+puiser1.value, diceValues: {baseDice: baseDice.value, puiser1: puiser1.value}, flavor:{baseDice: baseDice.flavor, puiser1: puiser1.flavor}, color:{baseDice: baseDice.color, puiser1: puiser1.color}}
      }
      if(baseDice.value != 0 && puiser2.value != 0 && baseDice.value+puiser2.value <= domain ) {
        choix.choix4 = {value: baseDice.value+puiser2.value, diceValues: {baseDice: baseDice.value, puiser2: puiser2.value} , flavor:{baseDice: baseDice.flavor, puiser2: puiser2.flavor}, color:{baseDice: baseDice.color, puiser2: puiser2.color}}
      }
      if(puiser1.value != 0 && puiser2.value != 0 && puiser1.value+puiser2.value <= domain ) {
        choix.choix5 = {value: puiser1.value+puiser2.value, diceValues: {puiser1: puiser1.value, puiser2: puiser2.value}, flavor:{puiser1: puiser1.flavor, puiser2: puiser2.flavor}, color:{puiser1: puiser1.color, puiser2: puiser2.color}}
      }
      console.log(choix)
      if(!choix.choix1 && !choix.choix2 && !choix.choix3 && !choix.choix4 && !choix.choix5) {
        return ui.notifications.error("Vous ne pouvez puiser dans aucun Trihn.");
      }
      let diceList = {baseDice, puiser1, puiser2}

      let result
      let puiserOptions = await GetPuiserOptions({ domain: domain, diceList, choix, result })

        if(puiserOptions.cancelled){
            return;
        }
        const actor = selectedToken[0].actor;
        const attributes = actor.system.attributes;
        result = puiserOptions.result + spéBonus + acquisBonus
        let flavor = puiserOptions.flavor
        var hp = "hp"
        let flavor1 = hp.concat('', flavor.flavor1)
        let flavor1Base = attributes[flavor1].value
        let flavor1End = flavor1Base - 1 
        attributes[flavor1].value = flavor1End
        let flavor2
        if(flavor.flavor2) {
          flavor2 = hp.concat('', flavor.flavor2)
          let flavor2Base = attributes[flavor2].value
          let flavor2End = flavor2Base - 1 
          attributes[flavor2].value = flavor2End
        }

        if(sendMessage) {
            ToCustomMessage(selectedToken, result, messageTemplate)
        }

        async function ToCustomMessage(Token, result, messageTemplate) {
            let actor = Token.actor
            let templateContext = {
                Token: Token[0],
                score: result,
                trihns: flavor
            };
            let chatData
            chatData = {
                user: game.user.id,
                speaker: ChatMessage.getSpeaker({actor}),
                content: await renderTemplate(messageTemplate, templateContext),
                sound: CONFIG.sounds.notification,
                type: CONST.CHAT_MESSAGE_TYPES.OTHER
            }
            ChatMessage.create(chatData);
        }

      async function GetPuiserOptions({
        domain = null,
        diceList = null, 
        choix = {},
        result = null,
        template = "systems/shaanrenaissance/templates/chat/puiser-dialog.hbs" } = {}) {
            const html = await renderTemplate(template, {domain, diceList, choix, result})
            const puiserData = {
                diceList: diceList,
                choix: choix
            }

        return new Promise(resolve => {
            const data = {
                title: game.i18n.format("chat.puiser.title"),
                content: html,
                data: puiserData,
                buttons: {
                    normal: {
                        label: game.i18n.localize("chat.actions.puiser"),
                        callback: html => resolve(_processPuiserOptions(html[0].querySelector("form")))
                      },
                      cancel: {
                        label: game.i18n.localize("chat.actions.cancel"),
                        callback: html => resolve({ cancelled: true })
                      }                   
                },
                default: "normal",
                close: () => resolve({ cancelled: true })
            };
            new Dialog(data, null).render(true);
        })
    }
    function _processPuiserOptions(form) {
        let checked = form.querySelector('input:checked');
        if(checked){
          let div = checked.closest('div')
          let checkedId = $(checked)[0].id
          let flavor = {}
          if(checkedId == "choix1" || checkedId == "choix2" || checkedId == "choix3" || checkedId == "choix4") {
              flavor.flavor1 = div.querySelector('b').dataset.flavor
          }
          if(checkedId == "choix5") {
              flavor.flavor1 = div.querySelector('b').dataset.flavor1
              flavor.flavor2 = div.querySelector('b').dataset.flavor2
          }
          return {
              result: Number(form.result?.value) ,
              flavor: flavor
          }
        }
        else{
          ui.notifications.warn("Vous devez faire un choix.")
        }
    }   
}

export const hideChatPuiserButtons = function (message, html, data) {
  const chatCard = html.find('.chat-card');
  if(chatCard.length > 0) {
    let actor = game.actors.get(chatCard.attr("data-actor-id").replace('Actor.', ''));
    if(actor && actor.isOwner) {
      return;
    }
    if(game.user.isGM) {
      return;
    }
    const buttons = chatCard.find('button.puiser');
    buttons.each((i, btn) => {
      btn.style.display = "none"
    });
  }
}
