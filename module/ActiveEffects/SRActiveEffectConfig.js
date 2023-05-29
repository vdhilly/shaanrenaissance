import { shaanRenaissance } from "../config.js"

export class SRActiveEffectConfig extends ActiveEffectConfig {
    get template() {
    return "systems/shaanrenaissance/templates/items/partials/activeEffect-config.hbs";
    }
    getData() {
        const sheetData = super.getData();
        sheetData.config = shaanRenaissance
        console.log(sheetData)
        return sheetData;
    }
}