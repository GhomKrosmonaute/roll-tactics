import * as soldier from "./soldier"
import * as battle from "./battle"

export class BattleTeam {
  private _hp = 100
  private _shield = 0

  public tankSoldier = new soldier.TankSoldier(this.battle)
  public fastSoldier = new soldier.FastSoldier(this.battle)
  public criticalSoldier = new soldier.CriticalSoldier(this.battle)

  constructor(public battle: battle.Battle) {}

  get shield(): number {
    return this._shield
  }

  set shield(shield) {
    this._shield = Math.max(0, shield)
  }

  get soldiers(): soldier.Soldier[] {
    return [this.tankSoldier, this.criticalSoldier, this.fastSoldier]
  }

  get alive(): soldier.Soldier[] {
    return this.soldiers.filter((s) => !s.isDead)
  }

  get playable(): soldier.Soldier[] {
    return this.alive.filter((s) => !s.played)
  }

  hasSameLevels() {
    return (
      this.tankSoldier.level === this.fastSoldier.level &&
      this.tankSoldier.level === this.criticalSoldier.level
    )
  }

  getSortedSoldiers(
    key: keyof Pick<soldier.Soldier, "exp" | "hp" | "strength">,
    order: "asc" | "desc"
  ) {
    return this.alive.sort((a, b) => {
      return order === "asc" ? a[key] - b[key] : b[key] - a[key]
    })
  }

  /**
   * <pre>
   * todo: order by important targets
   *   the weakest
   *   the most experimented
   *   the strongest
   *
   * todo: get best soldier for break each target
   * </pre>
   */
  attack() {
    this.soldiers.forEach((s) => (s.played = false))

    const enemyTeam = this.battle.getEnemyTeamOf(this)

    if (enemyTeam._shield) {
      // hit shield with the most able ali(es)
    }

    for (const level of [3, 2, 1]) {
      if (this.playable.length === 0) break

      const enemies = enemyTeam
        .getSortedSoldiers("hp", "asc")
        .filter((s) => s.level === level)
      const alies = this.getSortedSoldiers("strength", "asc").filter(
        (s) => !s.played
      )

      for (const enemy of enemies) {
        if (this.playable.length === 0) break

        for (const ali of alies) {
          if (enemy.isDead || ali.played) break

          if (ali instanceof soldier.TankSoldier) {
          } else if (ali instanceof soldier.CriticalSoldier) {
            const rest = enemy.hp % ali.strength
          } else {
          }

          ali.played = true
        }
      }
    }
  }

  getHigherStat(key: keyof Pick<soldier.Soldier, "exp" | "hp" | "strength">) {
    return Math.max(...this.soldiers.map((s) => s[key]))
  }

  getLowerStat(key: keyof Pick<soldier.Soldier, "exp" | "hp" | "strength">) {
    return Math.min(...this.soldiers.map((s) => s[key]))
  }

  draw(left: boolean) {
    this.drawPlayer(left)
    this.criticalSoldier.draw(left)
    this.tankSoldier.draw(left)
    this.fastSoldier.draw(left)
    // draw team to left or to right
  }

  drawPlayer(left: boolean) {
    fill(255)
    noStroke()
    circle(left ? width * 0.2 : width * 0.8, height * 0.5, height * 0.25)
  }
}
