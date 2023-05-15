export class TokenSR extends Token {
    drawBars() {
        if (!this.actor || (this.document.displayBars === CONST.TOKEN_DISPLAY_MODES.NONE)) return;
        console.log(this)
        // TO DO - Ajouter bar3
        ["bar1", "bar2", "bar3"].forEach((b, i) => {
            if (!this.hasOwnProperty("bars"))
            return;
            console.log("oui")
            const bar = this.bars[b];
            const attr = this.getBarAttribute(b);
            if (!attr || (attr.type !== "bar")) return bar.visible = false;
            this._drawBar(i, bar, attr);
            bar.visible = true;
        });
    }
    _drawBar(number, bar, data) {
        const val = Number(data.value);
        const pct = Math.clamped(val, 0, data.max) / data.max;
        let h = Math.max((canvas.dimensions.size / 12), 8);
        if (this.document.height >= 2) h *= 1.6;  
      
        let yPositions = {
            0: this.h - (3 * h),
            1: this.h - (2 * h),
            2: this.h - h
        };
      
        // TO DO - 
        let colors = {
            0: "#b8985a",
            1: "#4263a3",
            2: "#c95b40"
        }
      
        let color = colors[number];
      
          bar.clear()
          .beginFill(0x000000, 0.5)
          .lineStyle(2, 0x000000, 0.9)
          .drawRoundedRect(0, 0, this.w, h, 3)
          .beginFill(color, 0.8)
          .lineStyle(1, 0x000000, 0.8)
          .drawRoundedRect(1, 1, pct * (this.w - 2), h - 2, 2);
      
          // Set position
          let posY = yPositions[number];
          bar.position.set(0, posY);
    }
}