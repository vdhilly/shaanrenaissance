export class TokenSR extends Token {
    #unlinkedVideo = false;
    async _draw() {
        this.#cleanData();
    
        // Load token texture
        let texture;
        if ( this._original ) texture = this._original.texture?.clone();
        else texture = await loadTexture(this.document.texture.src, {fallback: CONST.DEFAULT_TOKEN});
    
        // Manage video playback
        let video = game.video.getVideoSource(texture);
        this.#unlinkedVideo = !!video && !this._original;
        if ( this.#unlinkedVideo ) {
          texture = await game.video.cloneTexture(video);
          video = game.video.getVideoSource(texture);
          const playOptions = {volume: 0};
          if ( (this.document.getFlag("core", "randomizeVideo") !== false) && Number.isFinite(video.duration) ) {
            playOptions.offset = Math.random() * video.duration;
          }
          game.video.play(video, playOptions);
        }
        this.texture = texture;
    
        // Draw the TokenMesh in the PrimaryCanvasGroup
        this.mesh = canvas.primary.addToken(this);
    
        // Draw the border frame in the GridLayer
        this.border ||= canvas.grid.borders.addChild(new PIXI.Graphics());
    
        // Draw Token interface components
        this.bars ||= this.addChild(this.#drawAttributeBars());
        this.tooltip ||= this.addChild(this.#drawTooltip());
        this.effects ||= this.addChild(new PIXI.Container());
    
        this.target ||= this.addChild(new PIXI.Graphics());
        this.nameplate ||= this.addChild(this.#drawNameplate());
    
        // Draw elements
        await this.drawEffects();
    
        // Define initial interactivity and visibility state
        this.hitArea = new PIXI.Rectangle(0, 0, this.w, this.h);
      }
    
      /* -------------------------------------------- */
    
      /**
       * Apply initial sanitizations to the provided input data to ensure that a Token has valid required attributes.
       * Constrain the Token position to remain within the Canvas rectangle.
       */
      #cleanData() {
        if ( !canvas || !this.scene?.active ) return;
        const d = canvas.dimensions;
        this.document.x = Math.clamped(this.document.x, 0, d.width - this.w);
        this.document.y = Math.clamped(this.document.y, 0, d.height - this.h);
      }
      #drawTooltip() {
        let text = this._getTooltipText();
        const style = this._getTextStyle();
        const tip = new PreciseText(text, style);
        tip.anchor.set(0.5, 1);
        tip.position.set(this.w / 2, -2);
        return tip;
      }
      #drawNameplate() {
    const style = this._getTextStyle();
    const name = new PreciseText(this.document.name, style);
    name.anchor.set(0.5, 0);
    name.position.set(this.w / 2, this.h + 2);
    return name;
  }
    drawBars() {
        if (!this.actor || (this.document.displayBars === CONST.TOKEN_DISPLAY_MODES.NONE)) return;
        // TO DO - Ajouter bar3
        const bars = ["bar1", "bar2", "bar3"]
        bars.forEach((b, i) => {
            if(!this.hasOwnProperty("bars"))
            return;

            const bar = this.bars[b];
            const attr = this.getBarAttribute(b);
            if (!attr || (attr.type !== "bar")) return bar.visible = false;
            this._drawBar(i, bar, attr);
            bar.visible = true;
        });
        this.bars.visible = this._canViewMode(this.document.displayBars);
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
            0: "0xf8ed00",
            1: "0x5cc8fc",
            2: "0xdd5616"
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
    #drawAttributeBars() {
        const bars = new PIXI.Container();
        bars.bar1 = bars.addChild(new PIXI.Graphics());
        bars.bar2 = bars.addChild(new PIXI.Graphics());
        bars.bar3 = bars.addChild(new PIXI.Graphics());
        return bars;
    }
    getBarAttribute(barName, { alternative } = {}) {
        let stat;
        if (barName === "bar1") {
            stat = "attributes.hpEsprit";
        } else if (barName === "bar2") {
            stat = "attributes.hpAme";
        } else if (barName === "bar3") {
            stat = "attributes.hpCorps";
        }
        
        let data = getProperty(this.actor.system, stat);
        data = duplicate(data);
    
        return {
            type: "bar",
            attribute: stat,
            value: parseInt(data.value || 0),
            max: parseInt(data.max || 0)
        }
    }
}       