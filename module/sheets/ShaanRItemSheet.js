export default class ShaanRItemSheet extends ItemSheet {
    get template(){
        return `systems/Shaan_Renaissance/templates/sheets/${this.item.type}-sheet.hbs`;
    }
    getData() {
        const data = super.getData();
        let sheetData = {
            owner: this.item.isOwner,
            editable: this.isEditable,
            item: data.item,
            data: data.data,
            config: CONFIG.shaanRenaissance
        };
        console.log(sheetData);
        return sheetData;
    }
}