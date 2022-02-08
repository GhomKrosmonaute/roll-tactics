import * as soldier from "./soldier"
import * as team from "./team"
import * as utils from "../ui/utils"
import * as button from "../ui/button"
import * as casinoRoll from "../ui/casinoRoll"

export class Battle {
  private logs: (() => unknown)[]

  readonly teams: [team.BattleTeam, team.BattleTeam] = [
    new team.BattleTeam(this),
    new team.BattleTeam(this),
  ]

  private turn = true

  get playerTeam() {
    return this.teams[Number(this.turn)]
  }

  get enemyTeam() {
    return this.teams[Number(!this.turn)]
  }

  startTurn() {
    button.reset()

    new button.Choice([
      new button.Button("Invocation", width / 2, height * 0.4, () => {
        this.startCasinoRoll("invocation")
      }),
      new button.Button("Buff", width / 2, height * 0.5, () => {
        this.startCasinoRoll("buff")
      }),
      new button.Button("Spell", width / 2, height * 0.6, () => {
        this.startCasinoRoll("spell")
      }),
    ])

    new button.Button(
      "Exit",
      width * 0.8,
      height * 0.8,
      () => {
        button.reset()

        newBattle()
      },
      () => {
        noStroke()
        fill(200)
        textAlign(CENTER, CENTER)
        textSize(height * 0.05)
        utils.header("Game started")
        this.drawTeams()
      }
    )
  }

  startCasinoRoll(type: casinoRoll.CasinoRollType) {
    // todo: setup casino roll
    // todo: draw casino roll
    new button.Button("Stop", width / 2, height / 2, () => {
      // todo: stop casino roll
      // todo: apply found items
      this.playerTeam.attack()
      // todo: not a perfect match ? this.turn = !this.turn
      this.startTurn()
    })
  }

  getTeamOf(target: soldier.Soldier): team.BattleTeam {
    return this.teams.find((t) => t.soldiers.includes(target))
  }

  getEnemyTeamOf(target: soldier.Soldier | team.BattleTeam): team.BattleTeam {
    return this.teams.find((t) =>
      target instanceof team.BattleTeam
        ? t !== target
        : !t.soldiers.includes(target)
    )
  }

  drawTeams() {
    for (const i of [0, 1]) this.teams[i].draw(!!i)
  }
}

const context: any = {}

export function currentBattle() {
  return context.currentBattle
}

export function newBattle() {
  context.currentBattle = new Battle()

  new button.Button(
    "Start",
    width / 2,
    height / 2,
    () => context.currentBattle.startTurn(),
    undefined,
    true,
    height * 0.06
  )
}
