import * as soldier from "./soldier"
import * as team from "./team"

export class Battle {
  readonly teams: [team.BattleTeam, team.BattleTeam] = [
    new team.BattleTeam(this),
    new team.BattleTeam(this),
  ]

  getTeamOf(target: soldier.Soldier): team.BattleTeam {
    return
  }

  getEnemyTeamOf(target: soldier.Soldier | team.BattleTeam): team.BattleTeam {
    return
  }

  draw() {
    for (const i of [0, 1]) this.teams[i].draw(!!i)
  }
}
