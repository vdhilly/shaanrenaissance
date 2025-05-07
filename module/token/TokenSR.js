export class TokenSR extends foundry.canvas.placeables.Token {
  #unlinkedVideo = false;

  #ring;

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
    this.tooltip ||= this.addChild(this.#drawTooltip());
    this.effects ||= this.addChild(new PIXI.Container());
    this.targetArrows ||= this.addChild(new PIXI.Graphics());
    this.targetPips ||= this.addChild(new PIXI.Graphics());
    this.nameplate ||= this.addChild(this.#drawNameplate());
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
    // Construct a TokenRing instance
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

    // Deactivate a prior TokenRing instance
    if (this.hasDynamicRing) this.#ring.clear();
    this.#ring = null;
  }
  /* -------------------------------------------- */

  /**
   * Apply initial sanitizations to the provided input data to ensure that a Token has valid required attributes.
   * Constrain the Token position to remain within the Canvas rectangle.
   */
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
    ["bar1", "bar2", "bar3"].forEach((b, i) => {
      const bar = this.bars[b];
      const attr = this.document.getBarAttribute(b);
      if (!attr || attr.type !== "bar" || attr.max === 0) return (bar.visible = false);
      this._drawBar(i, bar, attr);
      bar.visible = true;
    });
  }
  _drawBar(number, bar, data) {
    const val = Number(data.value);
    const pct = Math.clamp(val, 0, data.max) / data.max;
    let h = Math.max(canvas.dimensions.size / 12, 8);
    if (this.document.height >= 2) h *= 1.6;

    let yPositions = {
      0: this.h - 3 * h,
      1: this.h - 2 * h,
      2: this.h - h,
    };

    // TO DO -
    let colors = {
      0: "0xf8ed00",
      1: "0x5cc8fc",
      2: "0xdd5616",
    };

    let color = colors[number];
    bar
      .clear()
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
  _onUpdate(changed, options, userId) {
    super._onUpdate(changed, options, userId);

    this.renderFlags.set({
      refreshBars: ["displayBars", "bar1", "bar2", "bar3"].some((k) => k in changed),
    });
  }
}
