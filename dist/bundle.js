var app = (() => {
  var __defProp = Object.defineProperty;
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __export = (target, all) => {
    __markAsModule(target);
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // src/index.ts
  var src_exports = {};
  __export(src_exports, {
    draw: () => draw,
    keyPressed: () => keyPressed,
    keyReleased: () => keyReleased,
    mousePressed: () => mousePressed,
    mouseReleased: () => mouseReleased,
    setup: () => setup
  });

  // src/ui/button.ts
  var buttons = new Set();
  window.buttons = buttons;
  function reset() {
    buttons.forEach((b) => b.delete());
    buttons.clear();
  }
  var Choice = class {
    constructor(choices) {
      this.choices = choices;
      this.choices.forEach((b) => b.listeners.push(() => {
        this.choices.forEach((b2) => b2.delete());
      }));
    }
  };
  var Button = class {
    constructor(text2, x, y, onClick, onDraw, once = true, size = height * 0.04) {
      this.text = text2;
      this.x = x;
      this.y = y;
      this.onClick = onClick;
      this.onDraw = onDraw;
      this.once = once;
      this.size = size;
      this.listeners = [];
      this.x -= this.width / 2;
      this.y -= this.height / 2;
      buttons.add(this);
    }
    get height() {
      return height * 0.05;
    }
    get width() {
      return this.height * 5;
    }
    get mouseHover() {
      return mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height;
    }
    click() {
      this.listeners.forEach((onClick) => onClick());
      this.onClick();
      if (this.once)
        this.delete();
    }
    draw() {
      var _a;
      fill(this.mouseHover ? 255 : 100);
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(this.size);
      text(this.text, this.x + this.width / 2, this.y + this.height / 2);
      (_a = this.onDraw) == null ? void 0 : _a.call(this);
    }
    delete() {
      buttons.delete(this);
    }
  };

  // src/entities/soldier.ts
  var Soldier = class {
    constructor(battle2, _baseHp, _baseStrength) {
      this.battle = battle2;
      this._baseHp = _baseHp;
      this._baseStrength = _baseStrength;
      this.played = false;
      this._exp = 0;
      this._level = 1;
      this._hp = _baseHp;
      this._strength = _baseStrength;
    }
    get level() {
      return this._level;
    }
    get isDead() {
      return this.hp <= 0;
    }
    get exp() {
      return this._exp;
    }
    set exp(exp) {
      const currentLevel = this._level;
      this._exp = exp;
      this._level = 1 + Math.floor(exp / (100 / currentLevel));
      if (currentLevel !== this._level) {
        this._hp = this._baseHp * this._level;
        this._strength = this._baseStrength * this._level;
      }
    }
    get hp() {
      return this._hp;
    }
    set hp(hp) {
      this._hp = hp;
    }
    get strength() {
      return this._strength;
    }
    set strength(strength) {
      this._strength = strength;
    }
  };
  var CriticalSoldier = class extends Soldier {
    constructor(battle2) {
      super(battle2, 50, 50);
      this.battle = battle2;
    }
    attack() {
    }
    draw(left) {
      if (this.isDead)
        return;
    }
  };
  var TankSoldier = class extends Soldier {
    constructor(battle2) {
      super(battle2, 100, 50);
      this.battle = battle2;
    }
    attack() {
    }
    draw(left) {
      if (this.isDead)
        return;
    }
  };
  var FastSoldier = class extends Soldier {
    constructor(battle2) {
      super(battle2, 25, 25);
      this.battle = battle2;
    }
    attack() {
    }
    draw(left) {
      if (this.isDead)
        return;
    }
  };

  // src/entities/team.ts
  var BattleTeam = class {
    constructor(battle2) {
      this.battle = battle2;
      this._hp = 100;
      this._shield = 0;
      this.tankSoldier = new TankSoldier(this.battle);
      this.fastSoldier = new FastSoldier(this.battle);
      this.criticalSoldier = new CriticalSoldier(this.battle);
    }
    get shield() {
      return this._shield;
    }
    set shield(shield) {
      this._shield = Math.max(0, shield);
    }
    get soldiers() {
      return [this.tankSoldier, this.criticalSoldier, this.fastSoldier];
    }
    get alive() {
      return this.soldiers.filter((s) => !s.isDead);
    }
    get playable() {
      return this.alive.filter((s) => !s.played);
    }
    hasSameLevels() {
      return this.tankSoldier.level === this.fastSoldier.level && this.tankSoldier.level === this.criticalSoldier.level;
    }
    getSortedSoldiers(key, order) {
      return this.alive.sort((a, b) => {
        return order === "asc" ? a[key] - b[key] : b[key] - a[key];
      });
    }
    attack() {
      this.soldiers.forEach((s) => s.played = false);
      const enemyTeam = this.battle.getEnemyTeamOf(this);
      if (enemyTeam._shield) {
      }
      for (const level of [3, 2, 1]) {
        if (this.playable.length === 0)
          break;
        const enemies = enemyTeam.getSortedSoldiers("hp", "asc").filter((s) => s.level === level);
        const alies = this.getSortedSoldiers("strength", "asc").filter((s) => !s.played);
        for (const enemy of enemies) {
          if (this.playable.length === 0)
            break;
          for (const ali of alies) {
            if (enemy.isDead || ali.played)
              break;
            if (ali instanceof TankSoldier) {
            } else if (ali instanceof CriticalSoldier) {
              const rest = enemy.hp % ali.strength;
            } else {
            }
            ali.played = true;
          }
        }
      }
    }
    getHigherStat(key) {
      return Math.max(...this.soldiers.map((s) => s[key]));
    }
    getLowerStat(key) {
      return Math.min(...this.soldiers.map((s) => s[key]));
    }
    draw(left) {
      this.drawPlayer(left);
      this.criticalSoldier.draw(left);
      this.tankSoldier.draw(left);
      this.fastSoldier.draw(left);
    }
    drawPlayer(left) {
      fill(255);
      noStroke();
      circle(left ? width * 0.2 : width * 0.8, height * 0.5, height * 0.25);
    }
  };

  // src/ui/utils.ts
  function header(content) {
    noStroke();
    fill(200);
    textSize(height * 0.1);
    text(content, width / 2, height * 0.1);
  }

  // src/entities/battle.ts
  var Battle = class {
    constructor() {
      this.teams = [
        new BattleTeam(this),
        new BattleTeam(this)
      ];
      this.turn = true;
    }
    get playerTeam() {
      return this.teams[Number(this.turn)];
    }
    get enemyTeam() {
      return this.teams[Number(!this.turn)];
    }
    startTurn() {
      reset();
      new Choice([
        new Button("Invocation", width / 2, height * 0.4, () => {
          this.startCasinoRoll("invocation");
        }),
        new Button("Buff", width / 2, height * 0.5, () => {
          this.startCasinoRoll("buff");
        }),
        new Button("Spell", width / 2, height * 0.6, () => {
          this.startCasinoRoll("spell");
        })
      ]);
      new Button("Exit", width * 0.8, height * 0.8, () => {
        reset();
        newBattle();
      }, () => {
        noStroke();
        fill(200);
        textAlign(CENTER, CENTER);
        textSize(height * 0.05);
        header("Game started");
        this.drawTeams();
      });
    }
    startCasinoRoll(type) {
      new Button("Stop", width / 2, height / 2, () => {
        this.playerTeam.attack();
        this.startTurn();
      });
    }
    getTeamOf(target) {
      return this.teams.find((t) => t.soldiers.includes(target));
    }
    getEnemyTeamOf(target) {
      return this.teams.find((t) => target instanceof BattleTeam ? t !== target : !t.soldiers.includes(target));
    }
    drawTeams() {
      for (const i of [0, 1])
        this.teams[i].draw(!!i);
    }
  };
  var context = {};
  function newBattle() {
    context.currentBattle = new Battle();
    new Button("Start", width / 2, height / 2, () => context.currentBattle.startTurn(), () => {
      header("Roll Tactics");
    }, true, height * 0.06);
  }

  // src/index.ts
  document.addEventListener("contextmenu", (event) => event.preventDefault());
  function setup() {
    createCanvas(Math.max(document.documentElement.clientWidth, window.innerWidth || 0), Math.max(document.documentElement.clientHeight, window.innerHeight || 0));
    newBattle();
  }
  function draw() {
    background(20);
    buttons.forEach((button3) => button3.draw());
  }
  function keyPressed() {
  }
  function keyReleased() {
  }
  function mousePressed() {
  }
  function mouseReleased() {
    var _a;
    ;
    (_a = [...buttons].find((b) => b.mouseHover)) == null ? void 0 : _a.click();
  }
  return src_exports;
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL2luZGV4LnRzIiwgInNyYy91aS9idXR0b24udHMiLCAic3JjL2VudGl0aWVzL3NvbGRpZXIudHMiLCAic3JjL2VudGl0aWVzL3RlYW0udHMiLCAic3JjL3VpL3V0aWxzLnRzIiwgInNyYy9lbnRpdGllcy9iYXR0bGUudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vLyBAdHMtY2hlY2tcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9ub2RlX21vZHVsZXMvQHR5cGVzL3A1L2dsb2JhbC5kLnRzXCIgLz5cblxuaW1wb3J0ICogYXMgYnV0dG9uIGZyb20gXCIuL3VpL2J1dHRvblwiXG5pbXBvcnQgKiBhcyBiYXR0bGUgZnJvbSBcIi4vZW50aXRpZXMvYmF0dGxlXCJcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIChldmVudCkgPT4gZXZlbnQucHJldmVudERlZmF1bHQoKSlcblxuZXhwb3J0IGZ1bmN0aW9uIHNldHVwKCkge1xuICBjcmVhdGVDYW52YXMoXG4gICAgTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoLCB3aW5kb3cuaW5uZXJXaWR0aCB8fCAwKSxcbiAgICBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0LCB3aW5kb3cuaW5uZXJIZWlnaHQgfHwgMClcbiAgKVxuXG4gIGJhdHRsZS5uZXdCYXR0bGUoKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZHJhdygpIHtcbiAgYmFja2dyb3VuZCgyMClcblxuICBidXR0b24uYnV0dG9ucy5mb3JFYWNoKChidXR0b24pID0+IGJ1dHRvbi5kcmF3KCkpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBrZXlQcmVzc2VkKCkge31cbmV4cG9ydCBmdW5jdGlvbiBrZXlSZWxlYXNlZCgpIHt9XG5leHBvcnQgZnVuY3Rpb24gbW91c2VQcmVzc2VkKCkge31cbmV4cG9ydCBmdW5jdGlvbiBtb3VzZVJlbGVhc2VkKCkge1xuICA7Wy4uLmJ1dHRvbi5idXR0b25zXS5maW5kKChiKSA9PiBiLm1vdXNlSG92ZXIpPy5jbGljaygpXG59XG4iLCAiZXhwb3J0IGNvbnN0IGJ1dHRvbnMgPSBuZXcgU2V0PEJ1dHRvbj4oKVxuXG4vLyBAdHMtaWdub3JlXG53aW5kb3cuYnV0dG9ucyA9IGJ1dHRvbnNcblxuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0KCkge1xuICBidXR0b25zLmZvckVhY2goKGIpID0+IGIuZGVsZXRlKCkpXG4gIGJ1dHRvbnMuY2xlYXIoKVxufVxuXG5leHBvcnQgY2xhc3MgQ2hvaWNlIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjaG9pY2VzOiBCdXR0b25bXSkge1xuICAgIHRoaXMuY2hvaWNlcy5mb3JFYWNoKChiKSA9PlxuICAgICAgYi5saXN0ZW5lcnMucHVzaCgoKSA9PiB7XG4gICAgICAgIHRoaXMuY2hvaWNlcy5mb3JFYWNoKChiMikgPT4gYjIuZGVsZXRlKCkpXG4gICAgICB9KVxuICAgIClcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQnV0dG9uIHtcbiAgcmVhZG9ubHkgbGlzdGVuZXJzOiAoKCkgPT4gdW5rbm93bilbXSA9IFtdXG5cbiAgZ2V0IGhlaWdodCgpIHtcbiAgICByZXR1cm4gaGVpZ2h0ICogMC4wNVxuICB9XG5cbiAgZ2V0IHdpZHRoKCkge1xuICAgIHJldHVybiB0aGlzLmhlaWdodCAqIDVcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgdGV4dDogc3RyaW5nLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgeDogbnVtYmVyLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgeTogbnVtYmVyLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgb25DbGljazogKCkgPT4gdW5rbm93bixcbiAgICBwcml2YXRlIHJlYWRvbmx5IG9uRHJhdz86ICgpID0+IHVua25vd24sXG4gICAgcHJpdmF0ZSByZWFkb25seSBvbmNlID0gdHJ1ZSxcbiAgICBwcml2YXRlIHJlYWRvbmx5IHNpemUgPSBoZWlnaHQgKiAwLjA0XG4gICkge1xuICAgIHRoaXMueCAtPSB0aGlzLndpZHRoIC8gMlxuICAgIHRoaXMueSAtPSB0aGlzLmhlaWdodCAvIDJcbiAgICBidXR0b25zLmFkZCh0aGlzKVxuICB9XG5cbiAgZ2V0IG1vdXNlSG92ZXIoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIChcbiAgICAgIG1vdXNlWCA+IHRoaXMueCAmJlxuICAgICAgbW91c2VYIDwgdGhpcy54ICsgdGhpcy53aWR0aCAmJlxuICAgICAgbW91c2VZID4gdGhpcy55ICYmXG4gICAgICBtb3VzZVkgPCB0aGlzLnkgKyB0aGlzLmhlaWdodFxuICAgIClcbiAgfVxuXG4gIGNsaWNrKCkge1xuICAgIHRoaXMubGlzdGVuZXJzLmZvckVhY2goKG9uQ2xpY2spID0+IG9uQ2xpY2soKSlcbiAgICB0aGlzLm9uQ2xpY2soKVxuICAgIGlmICh0aGlzLm9uY2UpIHRoaXMuZGVsZXRlKClcbiAgfVxuXG4gIGRyYXcoKSB7XG4gICAgLy8gc3Ryb2tlKHRoaXMubW91c2VIb3ZlciA/IDI1NSA6IDEwMClcbiAgICAvLyBub0ZpbGwoKVxuICAgIC8vIHJlY3QodGhpcy54LCB0aGlzLnksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KVxuICAgIGZpbGwodGhpcy5tb3VzZUhvdmVyID8gMjU1IDogMTAwKVxuICAgIG5vU3Ryb2tlKClcbiAgICB0ZXh0QWxpZ24oQ0VOVEVSLCBDRU5URVIpXG4gICAgdGV4dFNpemUodGhpcy5zaXplKVxuICAgIHRleHQodGhpcy50ZXh0LCB0aGlzLnggKyB0aGlzLndpZHRoIC8gMiwgdGhpcy55ICsgdGhpcy5oZWlnaHQgLyAyKVxuICAgIHRoaXMub25EcmF3Py4oKVxuICB9XG5cbiAgZGVsZXRlKCkge1xuICAgIGJ1dHRvbnMuZGVsZXRlKHRoaXMpXG4gIH1cbn1cbiIsICJpbXBvcnQgKiBhcyBiYXR0bGUgZnJvbSBcIi4vYmF0dGxlXCJcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFNvbGRpZXIge1xuICBwbGF5ZWQgPSBmYWxzZVxuXG4gIHByb3RlY3RlZCBfZXhwID0gMFxuICBwcm90ZWN0ZWQgX2xldmVsID0gMVxuICBwcm90ZWN0ZWQgX2hwOiBudW1iZXJcbiAgcHJvdGVjdGVkIF9zdHJlbmd0aDogbnVtYmVyXG5cbiAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyByZWFkb25seSBiYXR0bGU6IGJhdHRsZS5CYXR0bGUsXG4gICAgcHJvdGVjdGVkIF9iYXNlSHA6IG51bWJlcixcbiAgICBwcm90ZWN0ZWQgX2Jhc2VTdHJlbmd0aDogbnVtYmVyXG4gICkge1xuICAgIHRoaXMuX2hwID0gX2Jhc2VIcFxuICAgIHRoaXMuX3N0cmVuZ3RoID0gX2Jhc2VTdHJlbmd0aFxuICB9XG5cbiAgYWJzdHJhY3QgYXR0YWNrKCk6IHZvaWRcbiAgYWJzdHJhY3QgZHJhdyhsZWZ0OiBib29sZWFuKTogdm9pZFxuXG4gIGdldCBsZXZlbCgpIHtcbiAgICByZXR1cm4gdGhpcy5fbGV2ZWxcbiAgfVxuXG4gIGdldCBpc0RlYWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaHAgPD0gMFxuICB9XG5cbiAgZ2V0IGV4cCgpIHtcbiAgICByZXR1cm4gdGhpcy5fZXhwXG4gIH1cblxuICBzZXQgZXhwKGV4cCkge1xuICAgIGNvbnN0IGN1cnJlbnRMZXZlbCA9IHRoaXMuX2xldmVsXG4gICAgdGhpcy5fZXhwID0gZXhwXG4gICAgdGhpcy5fbGV2ZWwgPSAxICsgTWF0aC5mbG9vcihleHAgLyAoMTAwIC8gY3VycmVudExldmVsKSlcbiAgICBpZiAoY3VycmVudExldmVsICE9PSB0aGlzLl9sZXZlbCkge1xuICAgICAgdGhpcy5faHAgPSB0aGlzLl9iYXNlSHAgKiB0aGlzLl9sZXZlbFxuICAgICAgdGhpcy5fc3RyZW5ndGggPSB0aGlzLl9iYXNlU3RyZW5ndGggKiB0aGlzLl9sZXZlbFxuICAgIH1cbiAgfVxuXG4gIGdldCBocCgpIHtcbiAgICByZXR1cm4gdGhpcy5faHBcbiAgfVxuXG4gIHNldCBocChocCkge1xuICAgIHRoaXMuX2hwID0gaHBcbiAgfVxuXG4gIGdldCBzdHJlbmd0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RyZW5ndGhcbiAgfVxuXG4gIHNldCBzdHJlbmd0aChzdHJlbmd0aCkge1xuICAgIHRoaXMuX3N0cmVuZ3RoID0gc3RyZW5ndGhcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ3JpdGljYWxTb2xkaWVyIGV4dGVuZHMgU29sZGllciB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBiYXR0bGU6IGJhdHRsZS5CYXR0bGUpIHtcbiAgICBzdXBlcihiYXR0bGUsIDUwLCA1MClcbiAgfVxuXG4gIGF0dGFjaygpIHtcbiAgICAvLyBzaG9vdGluZyBhIGh1Z2UgbGFzZXIgKGhpZ2ggY3JpdGljYWwgbHVjaylcbiAgfVxuXG4gIGRyYXcobGVmdDogYm9vbGVhbikge1xuICAgIGlmICh0aGlzLmlzRGVhZCkgcmV0dXJuXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRhbmtTb2xkaWVyIGV4dGVuZHMgU29sZGllciB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBiYXR0bGU6IGJhdHRsZS5CYXR0bGUpIHtcbiAgICBzdXBlcihiYXR0bGUsIDEwMCwgNTApXG4gIH1cblxuICBhdHRhY2soKSB7XG4gICAgLy8gc2hvb3Rpbmcgb25lIHRhcmdldFxuICB9XG5cbiAgZHJhdyhsZWZ0OiBib29sZWFuKSB7XG4gICAgaWYgKHRoaXMuaXNEZWFkKSByZXR1cm5cbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRmFzdFNvbGRpZXIgZXh0ZW5kcyBTb2xkaWVyIHtcbiAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IGJhdHRsZTogYmF0dGxlLkJhdHRsZSkge1xuICAgIHN1cGVyKGJhdHRsZSwgMjUsIDI1KVxuICB9XG5cbiAgYXR0YWNrKCkge1xuICAgIC8vIHNob290aW5nIG11bHRpcGxlIHByb2plY3RpbGUgYXQgbXVsdGlwbGUgdGFyZ2V0XG4gIH1cblxuICBkcmF3KGxlZnQ6IGJvb2xlYW4pIHtcbiAgICBpZiAodGhpcy5pc0RlYWQpIHJldHVyblxuXG5cbiAgfVxufVxuIiwgImltcG9ydCAqIGFzIHNvbGRpZXIgZnJvbSBcIi4vc29sZGllclwiXG5pbXBvcnQgKiBhcyBiYXR0bGUgZnJvbSBcIi4vYmF0dGxlXCJcblxuZXhwb3J0IGNsYXNzIEJhdHRsZVRlYW0ge1xuICBwcml2YXRlIF9ocCA9IDEwMFxuICBwcml2YXRlIF9zaGllbGQgPSAwXG5cbiAgcHVibGljIHRhbmtTb2xkaWVyID0gbmV3IHNvbGRpZXIuVGFua1NvbGRpZXIodGhpcy5iYXR0bGUpXG4gIHB1YmxpYyBmYXN0U29sZGllciA9IG5ldyBzb2xkaWVyLkZhc3RTb2xkaWVyKHRoaXMuYmF0dGxlKVxuICBwdWJsaWMgY3JpdGljYWxTb2xkaWVyID0gbmV3IHNvbGRpZXIuQ3JpdGljYWxTb2xkaWVyKHRoaXMuYmF0dGxlKVxuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBiYXR0bGU6IGJhdHRsZS5CYXR0bGUpIHt9XG5cbiAgZ2V0IHNoaWVsZCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9zaGllbGRcbiAgfVxuXG4gIHNldCBzaGllbGQoc2hpZWxkKSB7XG4gICAgdGhpcy5fc2hpZWxkID0gTWF0aC5tYXgoMCwgc2hpZWxkKVxuICB9XG5cbiAgZ2V0IHNvbGRpZXJzKCk6IHNvbGRpZXIuU29sZGllcltdIHtcbiAgICByZXR1cm4gW3RoaXMudGFua1NvbGRpZXIsIHRoaXMuY3JpdGljYWxTb2xkaWVyLCB0aGlzLmZhc3RTb2xkaWVyXVxuICB9XG5cbiAgZ2V0IGFsaXZlKCk6IHNvbGRpZXIuU29sZGllcltdIHtcbiAgICByZXR1cm4gdGhpcy5zb2xkaWVycy5maWx0ZXIoKHMpID0+ICFzLmlzRGVhZClcbiAgfVxuXG4gIGdldCBwbGF5YWJsZSgpOiBzb2xkaWVyLlNvbGRpZXJbXSB7XG4gICAgcmV0dXJuIHRoaXMuYWxpdmUuZmlsdGVyKChzKSA9PiAhcy5wbGF5ZWQpXG4gIH1cblxuICBoYXNTYW1lTGV2ZWxzKCkge1xuICAgIHJldHVybiAoXG4gICAgICB0aGlzLnRhbmtTb2xkaWVyLmxldmVsID09PSB0aGlzLmZhc3RTb2xkaWVyLmxldmVsICYmXG4gICAgICB0aGlzLnRhbmtTb2xkaWVyLmxldmVsID09PSB0aGlzLmNyaXRpY2FsU29sZGllci5sZXZlbFxuICAgIClcbiAgfVxuXG4gIGdldFNvcnRlZFNvbGRpZXJzKFxuICAgIGtleToga2V5b2YgUGljazxzb2xkaWVyLlNvbGRpZXIsIFwiZXhwXCIgfCBcImhwXCIgfCBcInN0cmVuZ3RoXCI+LFxuICAgIG9yZGVyOiBcImFzY1wiIHwgXCJkZXNjXCJcbiAgKSB7XG4gICAgcmV0dXJuIHRoaXMuYWxpdmUuc29ydCgoYSwgYikgPT4ge1xuICAgICAgcmV0dXJuIG9yZGVyID09PSBcImFzY1wiID8gYVtrZXldIC0gYltrZXldIDogYltrZXldIC0gYVtrZXldXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiA8cHJlPlxuICAgKiB0b2RvOiBvcmRlciBieSBpbXBvcnRhbnQgdGFyZ2V0c1xuICAgKiAgIHRoZSB3ZWFrZXN0XG4gICAqICAgdGhlIG1vc3QgZXhwZXJpbWVudGVkXG4gICAqICAgdGhlIHN0cm9uZ2VzdFxuICAgKlxuICAgKiB0b2RvOiBnZXQgYmVzdCBzb2xkaWVyIGZvciBicmVhayBlYWNoIHRhcmdldFxuICAgKiA8L3ByZT5cbiAgICovXG4gIGF0dGFjaygpIHtcbiAgICB0aGlzLnNvbGRpZXJzLmZvckVhY2goKHMpID0+IChzLnBsYXllZCA9IGZhbHNlKSlcblxuICAgIGNvbnN0IGVuZW15VGVhbSA9IHRoaXMuYmF0dGxlLmdldEVuZW15VGVhbU9mKHRoaXMpXG5cbiAgICBpZiAoZW5lbXlUZWFtLl9zaGllbGQpIHtcbiAgICAgIC8vIGhpdCBzaGllbGQgd2l0aCB0aGUgbW9zdCBhYmxlIGFsaShlcylcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGxldmVsIG9mIFszLCAyLCAxXSkge1xuICAgICAgaWYgKHRoaXMucGxheWFibGUubGVuZ3RoID09PSAwKSBicmVha1xuXG4gICAgICBjb25zdCBlbmVtaWVzID0gZW5lbXlUZWFtXG4gICAgICAgIC5nZXRTb3J0ZWRTb2xkaWVycyhcImhwXCIsIFwiYXNjXCIpXG4gICAgICAgIC5maWx0ZXIoKHMpID0+IHMubGV2ZWwgPT09IGxldmVsKVxuICAgICAgY29uc3QgYWxpZXMgPSB0aGlzLmdldFNvcnRlZFNvbGRpZXJzKFwic3RyZW5ndGhcIiwgXCJhc2NcIikuZmlsdGVyKFxuICAgICAgICAocykgPT4gIXMucGxheWVkXG4gICAgICApXG5cbiAgICAgIGZvciAoY29uc3QgZW5lbXkgb2YgZW5lbWllcykge1xuICAgICAgICBpZiAodGhpcy5wbGF5YWJsZS5sZW5ndGggPT09IDApIGJyZWFrXG5cbiAgICAgICAgZm9yIChjb25zdCBhbGkgb2YgYWxpZXMpIHtcbiAgICAgICAgICBpZiAoZW5lbXkuaXNEZWFkIHx8IGFsaS5wbGF5ZWQpIGJyZWFrXG5cbiAgICAgICAgICBpZiAoYWxpIGluc3RhbmNlb2Ygc29sZGllci5UYW5rU29sZGllcikge1xuICAgICAgICAgIH0gZWxzZSBpZiAoYWxpIGluc3RhbmNlb2Ygc29sZGllci5Dcml0aWNhbFNvbGRpZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3QgPSBlbmVteS5ocCAlIGFsaS5zdHJlbmd0aFxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYWxpLnBsYXllZCA9IHRydWVcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldEhpZ2hlclN0YXQoa2V5OiBrZXlvZiBQaWNrPHNvbGRpZXIuU29sZGllciwgXCJleHBcIiB8IFwiaHBcIiB8IFwic3RyZW5ndGhcIj4pIHtcbiAgICByZXR1cm4gTWF0aC5tYXgoLi4udGhpcy5zb2xkaWVycy5tYXAoKHMpID0+IHNba2V5XSkpXG4gIH1cblxuICBnZXRMb3dlclN0YXQoa2V5OiBrZXlvZiBQaWNrPHNvbGRpZXIuU29sZGllciwgXCJleHBcIiB8IFwiaHBcIiB8IFwic3RyZW5ndGhcIj4pIHtcbiAgICByZXR1cm4gTWF0aC5taW4oLi4udGhpcy5zb2xkaWVycy5tYXAoKHMpID0+IHNba2V5XSkpXG4gIH1cblxuICBkcmF3KGxlZnQ6IGJvb2xlYW4pIHtcbiAgICB0aGlzLmRyYXdQbGF5ZXIobGVmdClcbiAgICB0aGlzLmNyaXRpY2FsU29sZGllci5kcmF3KGxlZnQpXG4gICAgdGhpcy50YW5rU29sZGllci5kcmF3KGxlZnQpXG4gICAgdGhpcy5mYXN0U29sZGllci5kcmF3KGxlZnQpXG4gICAgLy8gZHJhdyB0ZWFtIHRvIGxlZnQgb3IgdG8gcmlnaHRcbiAgfVxuXG4gIGRyYXdQbGF5ZXIobGVmdDogYm9vbGVhbikge1xuICAgIGZpbGwoMjU1KVxuICAgIG5vU3Ryb2tlKClcbiAgICBjaXJjbGUobGVmdCA/IHdpZHRoICogMC4yIDogd2lkdGggKiAwLjgsIGhlaWdodCAqIDAuNSwgaGVpZ2h0ICogMC4yNSlcbiAgfVxufVxuIiwgImV4cG9ydCBmdW5jdGlvbiBoZWFkZXIoY29udGVudDogc3RyaW5nKSB7XG4gIG5vU3Ryb2tlKClcbiAgZmlsbCgyMDApXG4gIHRleHRTaXplKGhlaWdodCAqIDAuMSlcbiAgdGV4dChjb250ZW50LCB3aWR0aCAvIDIsIGhlaWdodCAqIDAuMSlcbn1cbiIsICJpbXBvcnQgKiBhcyBzb2xkaWVyIGZyb20gXCIuL3NvbGRpZXJcIlxuaW1wb3J0ICogYXMgdGVhbSBmcm9tIFwiLi90ZWFtXCJcbmltcG9ydCAqIGFzIHV0aWxzIGZyb20gXCIuLi91aS91dGlsc1wiXG5pbXBvcnQgKiBhcyBidXR0b24gZnJvbSBcIi4uL3VpL2J1dHRvblwiXG5pbXBvcnQgKiBhcyBjYXNpbm9Sb2xsIGZyb20gXCIuLi91aS9jYXNpbm9Sb2xsXCJcblxuZXhwb3J0IGNsYXNzIEJhdHRsZSB7XG4gIHByaXZhdGUgbG9nczogKCgpID0+IHVua25vd24pW11cblxuICByZWFkb25seSB0ZWFtczogW3RlYW0uQmF0dGxlVGVhbSwgdGVhbS5CYXR0bGVUZWFtXSA9IFtcbiAgICBuZXcgdGVhbS5CYXR0bGVUZWFtKHRoaXMpLFxuICAgIG5ldyB0ZWFtLkJhdHRsZVRlYW0odGhpcyksXG4gIF1cblxuICBwcml2YXRlIHR1cm4gPSB0cnVlXG5cbiAgZ2V0IHBsYXllclRlYW0oKSB7XG4gICAgcmV0dXJuIHRoaXMudGVhbXNbTnVtYmVyKHRoaXMudHVybildXG4gIH1cblxuICBnZXQgZW5lbXlUZWFtKCkge1xuICAgIHJldHVybiB0aGlzLnRlYW1zW051bWJlcighdGhpcy50dXJuKV1cbiAgfVxuXG4gIHN0YXJ0VHVybigpIHtcbiAgICBidXR0b24ucmVzZXQoKVxuXG4gICAgbmV3IGJ1dHRvbi5DaG9pY2UoW1xuICAgICAgbmV3IGJ1dHRvbi5CdXR0b24oXCJJbnZvY2F0aW9uXCIsIHdpZHRoIC8gMiwgaGVpZ2h0ICogMC40LCAoKSA9PiB7XG4gICAgICAgIHRoaXMuc3RhcnRDYXNpbm9Sb2xsKFwiaW52b2NhdGlvblwiKVxuICAgICAgfSksXG4gICAgICBuZXcgYnV0dG9uLkJ1dHRvbihcIkJ1ZmZcIiwgd2lkdGggLyAyLCBoZWlnaHQgKiAwLjUsICgpID0+IHtcbiAgICAgICAgdGhpcy5zdGFydENhc2lub1JvbGwoXCJidWZmXCIpXG4gICAgICB9KSxcbiAgICAgIG5ldyBidXR0b24uQnV0dG9uKFwiU3BlbGxcIiwgd2lkdGggLyAyLCBoZWlnaHQgKiAwLjYsICgpID0+IHtcbiAgICAgICAgdGhpcy5zdGFydENhc2lub1JvbGwoXCJzcGVsbFwiKVxuICAgICAgfSksXG4gICAgXSlcblxuICAgIG5ldyBidXR0b24uQnV0dG9uKFxuICAgICAgXCJFeGl0XCIsXG4gICAgICB3aWR0aCAqIDAuOCxcbiAgICAgIGhlaWdodCAqIDAuOCxcbiAgICAgICgpID0+IHtcbiAgICAgICAgYnV0dG9uLnJlc2V0KClcblxuICAgICAgICBuZXdCYXR0bGUoKVxuICAgICAgfSxcbiAgICAgICgpID0+IHtcbiAgICAgICAgbm9TdHJva2UoKVxuICAgICAgICBmaWxsKDIwMClcbiAgICAgICAgdGV4dEFsaWduKENFTlRFUiwgQ0VOVEVSKVxuICAgICAgICB0ZXh0U2l6ZShoZWlnaHQgKiAwLjA1KVxuICAgICAgICB1dGlscy5oZWFkZXIoXCJHYW1lIHN0YXJ0ZWRcIilcbiAgICAgICAgdGhpcy5kcmF3VGVhbXMoKVxuICAgICAgfVxuICAgIClcbiAgfVxuXG4gIHN0YXJ0Q2FzaW5vUm9sbCh0eXBlOiBjYXNpbm9Sb2xsLkNhc2lub1JvbGxUeXBlKSB7XG4gICAgLy8gdG9kbzogc2V0dXAgY2FzaW5vIHJvbGxcbiAgICAvLyB0b2RvOiBkcmF3IGNhc2lubyByb2xsXG4gICAgbmV3IGJ1dHRvbi5CdXR0b24oXCJTdG9wXCIsIHdpZHRoIC8gMiwgaGVpZ2h0IC8gMiwgKCkgPT4ge1xuICAgICAgLy8gdG9kbzogc3RvcCBjYXNpbm8gcm9sbFxuICAgICAgLy8gdG9kbzogYXBwbHkgZm91bmQgaXRlbXNcbiAgICAgIHRoaXMucGxheWVyVGVhbS5hdHRhY2soKVxuICAgICAgLy8gdG9kbzogbm90IGEgcGVyZmVjdCBtYXRjaCA/IHRoaXMudHVybiA9ICF0aGlzLnR1cm5cbiAgICAgIHRoaXMuc3RhcnRUdXJuKClcbiAgICB9KVxuICB9XG5cbiAgZ2V0VGVhbU9mKHRhcmdldDogc29sZGllci5Tb2xkaWVyKTogdGVhbS5CYXR0bGVUZWFtIHtcbiAgICByZXR1cm4gdGhpcy50ZWFtcy5maW5kKCh0KSA9PiB0LnNvbGRpZXJzLmluY2x1ZGVzKHRhcmdldCkpXG4gIH1cblxuICBnZXRFbmVteVRlYW1PZih0YXJnZXQ6IHNvbGRpZXIuU29sZGllciB8IHRlYW0uQmF0dGxlVGVhbSk6IHRlYW0uQmF0dGxlVGVhbSB7XG4gICAgcmV0dXJuIHRoaXMudGVhbXMuZmluZCgodCkgPT5cbiAgICAgIHRhcmdldCBpbnN0YW5jZW9mIHRlYW0uQmF0dGxlVGVhbVxuICAgICAgICA/IHQgIT09IHRhcmdldFxuICAgICAgICA6ICF0LnNvbGRpZXJzLmluY2x1ZGVzKHRhcmdldClcbiAgICApXG4gIH1cblxuICBkcmF3VGVhbXMoKSB7XG4gICAgZm9yIChjb25zdCBpIG9mIFswLCAxXSkgdGhpcy50ZWFtc1tpXS5kcmF3KCEhaSlcbiAgfVxufVxuXG5jb25zdCBjb250ZXh0OiBhbnkgPSB7fVxuXG5leHBvcnQgZnVuY3Rpb24gY3VycmVudEJhdHRsZSgpIHtcbiAgcmV0dXJuIGNvbnRleHQuY3VycmVudEJhdHRsZVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbmV3QmF0dGxlKCkge1xuICBjb250ZXh0LmN1cnJlbnRCYXR0bGUgPSBuZXcgQmF0dGxlKClcblxuICBuZXcgYnV0dG9uLkJ1dHRvbihcbiAgICBcIlN0YXJ0XCIsXG4gICAgd2lkdGggLyAyLFxuICAgIGhlaWdodCAvIDIsXG4gICAgKCkgPT4gY29udGV4dC5jdXJyZW50QmF0dGxlLnN0YXJ0VHVybigpLFxuICAgICgpID0+IHtcbiAgICAgIHV0aWxzLmhlYWRlcihcIlJvbGwgVGFjdGljc1wiKVxuICAgIH0sXG4gICAgdHJ1ZSxcbiAgICBoZWlnaHQgKiAwLjA2XG4gIClcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7OztBQ0FPLE1BQU0sVUFBVSxJQUFJO0FBRzNCLFNBQU8sVUFBVTtBQUVWLG1CQUFpQjtBQUN0QixZQUFRLFFBQVEsQ0FBQyxNQUFNLEVBQUU7QUFDekIsWUFBUTtBQUFBO0FBR0gscUJBQWE7QUFBQSxJQUNsQixZQUFvQixTQUFtQjtBQUFuQjtBQUNsQixXQUFLLFFBQVEsUUFBUSxDQUFDLE1BQ3BCLEVBQUUsVUFBVSxLQUFLLE1BQU07QUFDckIsYUFBSyxRQUFRLFFBQVEsQ0FBQyxPQUFPLEdBQUc7QUFBQTtBQUFBO0FBQUE7QUFNakMscUJBQWE7QUFBQSxJQVdsQixZQUNtQixPQUNBLEdBQ0EsR0FDQSxTQUNBLFFBQ0EsT0FBTyxNQUNQLE9BQU8sU0FBUyxNQUNqQztBQVBpQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWpC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
