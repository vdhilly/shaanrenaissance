export class Progress {
    constructor({
        steps = 1
    } = {}) {
        this.steps = steps, this.counter = -1, this.label = ""
    }
    advance(label) {
        this.counter += 1, this.label = label, this.updateUI()
    }
    close(label) {
        label && (this.label = label), this.counter = this.steps, this.updateUI()
    }
    updateUI() {
        const $loader = $("#loading");
        if (0 === $loader.length) return;
        const pct = Math.clamped(100 * this.counter / this.steps, 0, 100);
        $loader.find("#context").text(this.label), $loader.find("#loading-bar").css({
            width: `${pct}%`,
            whiteSpace: "nowrap"
        }), $loader.find("#progress").text(`${this.counter} / ${this.steps}`), $loader.css({
            display: "block"
        }), this.counter !== this.steps || $loader.is(":hidden") || $loader.fadeOut(2e3)
    }
}