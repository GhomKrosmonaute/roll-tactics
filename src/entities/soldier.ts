import * as battle from "./battle"

export abstract class Soldier {
  played = false

  protected _exp = 0
  protected _level = 1
  protected _hp: number
  protected _strength: number

  protected constructor(
    public readonly battle: battle.Battle,
    protected _baseHp: number,
    protected _baseStrength: number
  ) {
    this._hp = _baseHp
    this._strength = _baseStrength
  }

  abstract attack(): void
  abstract draw(left: boolean): void

  get level() {
    return this._level
  }

  get isDead() {
    return this.hp <= 0
  }

  get exp() {
    return this._exp
  }

  set exp(exp) {
    const currentLevel = this._level
    this._exp = exp
    this._level = 1 + Math.floor(exp / (100 / currentLevel))
    if (currentLevel !== this._level) {
      this._hp = this._baseHp * this._level
      this._strength = this._baseStrength * this._level
    }
  }

  get hp() {
    return this._hp
  }

  set hp(hp) {
    this._hp = hp
  }

  get strength() {
    return this._strength
  }

  set strength(strength) {
    this._strength = strength
  }
}

export class CriticalSoldier extends Soldier {
  constructor(public readonly battle: battle.Battle) {
    super(battle, 50, 50)
  }

  attack() {
    // shooting a huge laser (high critical luck)
  }

  draw(left: boolean) {
    if (this.isDead) return
  }
}

export class TankSoldier extends Soldier {
  constructor(public readonly battle: battle.Battle) {
    super(battle, 100, 50)
  }

  attack() {
    // shooting one target
  }

  draw(left: boolean) {
    if (this.isDead) return
  }
}

export class FastSoldier extends Soldier {
  constructor(public readonly battle: battle.Battle) {
    super(battle, 25, 25)
  }

  attack() {
    // shooting multiple projectile at multiple target
  }

  draw(left: boolean) {
    if (this.isDead) return


  }
}
