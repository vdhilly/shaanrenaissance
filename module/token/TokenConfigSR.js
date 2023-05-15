export class TokenConfigSR extends TokenConfig {
    get template() {
        console.log(this)
        return `systems/Shaan_Renaissance/templates/scene/tokenConfig.hbs`
    }
}