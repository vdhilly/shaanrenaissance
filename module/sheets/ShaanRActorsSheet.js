export default class ShaanRActorsSheet extends ActorSheet {
    get template(){
        return `systems/Shaan_Renaissance/templates/actors/${this.actor.type}/sheet.hbs`;
    }
    getData() {
        const data = super.getData();
        let sheetData = {
            editable: this.isEditable,
            actor: data.actor,
            data: data.data,
            config: CONFIG.shaanRenaissance
        };
        console.log(sheetData);
        return sheetData;
    }
}