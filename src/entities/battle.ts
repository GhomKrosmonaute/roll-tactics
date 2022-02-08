import * as soldier from "./soldier"

export class Battle {
  getTeamOf(target: soldier.Soldier | BattleTeam): BattleTeam {
    return
  }

  getEnemyTeamOf(target: soldier.Soldier | BattleTeam): BattleTeam {
    return
  }
}

export class BattleTeam {
  private _hp = 100
  private _shield = 0

  public tankSoldier: soldier.TankSoldier
  public fastSoldier: soldier.FastSoldier
  public criticalSoldier: soldier.CriticalSoldier

  constructor(public battle: Battle) {}

  get soldiers(): soldier.Soldier[] {
    return [this.tankSoldier, this.criticalSoldier, this.fastSoldier]
  }

  get targets(): (soldier.Soldier | "shield")[] {
    const targets: (soldier.Soldier | "shield")[] = []

    if (this._shield) targets.push("shield")

    //todo: order by important targets
    // the weakest
    // the most experimented
    // the strongest

    return targets
  }

  getSortedSoldiers<
    Key extends keyof Pick<soldier.Soldier, "exp" | "hp" | "strength">
  >(key: Key, order: "asc" | "desc") {
    return this.soldiers.sort((a, b) => {
      return order === "asc" ? a[key] - b[key] : b[key] - a[key]
    })
  }

  attack() {
    const targets = this.battle.getEnemyTeamOf(this).targets

    //todo: get best soldier for break each target
  }
}
