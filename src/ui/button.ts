export const buttons = new Set<Button>()

// @ts-ignore
window.buttons = buttons

export function reset() {
  buttons.forEach((b) => b.delete())
  buttons.clear()
}

export class Choice {
  constructor(private choices: Button[]) {
    this.choices.forEach((b) =>
      b.listeners.push(() => {
        this.choices.forEach((b2) => b2.delete())
      })
    )
  }
}

export class Button {
  readonly listeners: (() => unknown)[] = []

  get height() {
    return height * 0.05
  }

  get width() {
    return this.height * 5
  }

  constructor(
    private readonly text: string,
    private readonly x: number,
    private readonly y: number,
    private readonly onClick: () => unknown,
    private readonly onDraw?: () => unknown,
    private readonly once = true,
    private readonly size = height * 0.04
  ) {
    this.x -= this.width / 2
    this.y -= this.height / 2
    buttons.add(this)
  }

  get mouseHover(): boolean {
    return (
      mouseX > this.x &&
      mouseX < this.x + this.width &&
      mouseY > this.y &&
      mouseY < this.y + this.height
    )
  }

  checkClick() {
    if (this.mouseHover) {
      this.listeners.forEach((onClick) => onClick())
      this.onClick()
      if (this.once) this.delete()
      return true
    }
    return false
  }

  draw() {
    // stroke(this.mouseHover ? 255 : 100)
    // noFill()
    // rect(this.x, this.y, this.width, this.height)
    fill(this.mouseHover ? 255 : 100)
    noStroke()
    textAlign(CENTER, CENTER)
    textSize(this.size)
    text(this.text, this.x + this.width / 2, this.y + this.height / 2)
    this.onDraw?.()
  }

  delete() {
    buttons.delete(this)
  }
}
