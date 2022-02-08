import * as battle from "./battle"

export abstract class Soldier {
  private _exp = 0
  private _level = 1

  protected abstract _hp: number
  protected abstract _strength: number

  constructor(public readonly battle: battle.Battle) {}

  abstract attack(): void

  get exp() {
    return this._exp
  }

  set exp(exp) {
    this._exp = exp
    this._level = 1 + Math.floor(exp / (100 / this._level))
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
  _hp = 50
  _strength = 50

  attack() {
    // shooting a huge laser (high critical luck)
  }
}

export class TankSoldier extends Soldier {
  _hp = 100
  _strength = 50

  attack() {
    // shooting one target
  }
}

export class FastSoldier extends Soldier {
  _hp = 25
  _strength = 25

  attack() {
    // shooting multiple projectile at multiple target
  }
}
