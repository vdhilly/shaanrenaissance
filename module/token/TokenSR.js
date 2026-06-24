export class TokenSR extends foundry.canvas.placeables.Token {
  #unlinkedVideo = false;
  #ring;

  // Déclarations explicites pour la V14
  bar3;
  levelIndicator;

  async _draw(options) {
    this.#cleanData();

    // Load token texture
    let texture;
    if ( this._original ) texture = this._original.texture?.clone();
    else texture = await foundry.canvas.loadTexture(this.document.texture.src, {fallback: CONST.DEFAULT_TOKEN});

    // Cache token ring subject texture if needed
    const ring = this.document.ring;
    if ( ring.enabled && ring.subject.texture ) await foundry.canvas.loadTexture(ring.subject.texture);

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

    // Draw the token's PrimarySpriteMesh in the PrimaryCanvasGroup
    this.mesh = canvas.primary.addToken(this);

    // Initialize token ring
    this.#initializeRing();

    // Draw the border
    this.border ||= this.addChild(new PIXI.Graphics());

    // Draw the void of the token's PrimarySpriteMesh
    if ( !this.voidMesh ) {
      this.voidMesh = this.addChild(new PIXI.Container());
      this.voidMesh.updateTransform = () => {};
      this.voidMesh.render = renderer => this.mesh?._renderVoid(renderer);
    }

    // Draw the detection filter of the token's PrimarySpriteMesh
    if ( !this.detectionFilterMesh ) {
      this.detectionFilterMesh = this.addChild(new PIXI.Container());
      this.detectionFilterMesh.updateTransform = () => {};
      this.detectionFilterMesh.render = renderer => {
        if ( this.detectionFilter ) this._renderDetectionFilter(renderer);
      };
    }

    // Draw Token interface components
    this.bars ||= this.addChild(this.#drawAttributeBars());
    
    // Bar3 isolée pour éviter les conflits
    this.bar3 ||= this.addChild(new PIXI.Graphics());

    this.tooltip ||= this.addChild(this.#drawTooltip());
    this.effects ||= this.addChild(new PIXI.Container());
    this.targetArrows ||= this.addChild(new PIXI.Graphics());
    this.targetPips ||= this.addChild(new PIXI.Graphics());
    this.nameplate ||= this.addChild(this.#drawNameplate());
    
    // CORRECTION CRITIQUE V14 : Initialisation de l'indicateur de niveau requis par _refreshState()
    // Si la méthode native existe, on l'utilise, sinon on crée un conteneur PIXI Graphics vide par sécurité.
    if ( this.levelIndicator === undefined ) {
      this.levelIndicator = this._drawLevelIndicator ? this._drawLevelIndicator() : new PIXI.Graphics();
      if ( this.levelIndicator ) this.addChild(this.levelIndicator);
    }

    this.sortableChildren = true;

    // Initialize and draw the ruler
    if ( this.ruler === undefined ) this.ruler = this._initializeRuler();
    if ( this.ruler ) await this.ruler.draw();

    // Add filter effects
    this._updateSpecialStatusFilterEffects();

    // Draw elements
    await this._drawEffects();

    // Initialize sources
    if ( !this.isPreview ) this.initializeSources();
  }

  #initializeRing() {
    if (this.document.ring.enabled) {
      if (!this.hasDynamicRing) {
        const cls = CONFIG.Token.ring.ringClass;
        if (!foundry.utils.isSubclass(cls, foundry.canvas.tokens.TokenRing)) {
          throw new Error("The configured CONFIG.Token.ring.ringClass is not a TokenRing subclass.");
        }
        this.#ring = new cls(this);
      }
      this.#ring.configure(this.mesh);
      return;
    }
    if (this.hasDynamicRing) this.#ring.clear();
    this.#ring = null;
  }

  #cleanData() {
    if (!canvas || !this.scene?.active) return;
    const d = canvas.dimensions;
    this.document.x = Math.clamp(this.document.x, 0, d.width - this.w);
    this.document.y = Math.clamp(this.document.y, 0, d.height - this.h);
  }

  #drawTooltip() {
    let text = this._getTooltipText();
    const style = this._getTextStyle();
    const tip = new foundry.canvas.containers.PreciseText(text, style);
    tip.anchor.set(0.5, 1);
    tip.position.set(this.w / 2, -2);
    return tip;
  }

  #drawNameplate() {
    const style = this._getTextStyle();
    const name = new foundry.canvas.containers.PreciseText(this.document.name, style);
    name.anchor.set(0.5, 0);
    name.position.set(this.w / 2, this.h + 2);
    return name;
  }

  drawBars() {
    if (!this.actor || this.document.displayBars === CONST.TOKEN_DISPLAY_MODES.NONE) return;
    
    if ( this.bars ) {
      ["bar1", "bar2"].forEach((b, i) => {
        const bar = this.bars[b];
        if (!bar) return;
        const attr = this.document.getBarAttribute(b);
        if (!attr || attr.type !== "bar" || attr.max === 0) {
          return (bar.visible = false);
        }
        this._drawBar(i, bar, attr);
        bar.visible = true;
      });
    }

    if ( this.bar3 ) {
      const attr3 = this.document.getBarAttribute("bar3");
      if (!attr3 || attr3.type !== "bar" || attr3.max === 0) {
        return (this.bar3.visible = false);
      }
      this._drawBar(2, this.bar3, attr3);
      this.bar3.visible = true;
    }
  }

  _drawBar(number, bar, data) {
    const val = Number(data.value);
    const pct = Math.clamp(val, 0, data.max) / data.max;
    let h = Math.max(canvas.dimensions.size / 12, 8);
    if (this.document.height >= 2) h *= 1.6;

    const yPositions = {
      0: this.h - 3 * h,
      1: this.h - 2 * h,
      2: this.h - h,
    };

    const colors = {
      0: 0xf8ed00, 
      1: 0x5cc8fc, 
      2: 0xdd5616, 
    };

    const color = colors[number] ?? 0xffffff;
    
    bar.clear();

    // Design PIXI v8
    bar.rect(0, 0, this.w, h);
    bar.fill({ color: 0x000000, alpha: 0.5 });
    bar.stroke({ color: 0x000000, alpha: 0.9, width: 2, join: "round" });

    if ( pct > 0 ) {
      bar.rect(1, 1, pct * (this.w - 2), h - 2);
      bar.fill({ color: color, alpha: 0.8 });
      bar.stroke({ color: 0x000000, alpha: 0.8, width: 1, join: "round" });
    }

    const posY = yPositions[number];
    bar.position.set(0, posY);
  }

  #drawAttributeBars() {
    const bars = new PIXI.Container();
    bars.bar1 = bars.addChild(new PIXI.Graphics());
    bars.bar2 = bars.addChild(new PIXI.Graphics());
    return bars;
  }

  _onUpdate(changed, options, userId) {
    super._onUpdate(changed, options, userId);

    this.renderFlags.set({
      refreshBars: ["displayBars", "bar1", "bar2"].some((k) => k in changed) || 
                   (changed.flags?.shaanrenaissance?.bar3 !== undefined)
    });
  }

  _applyRenderFlags(flags) {
    super._applyRenderFlags(flags);
    if ( flags.refreshBars ) this.drawBars();
  }
}