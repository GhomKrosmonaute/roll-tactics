/// @ts-check
/// <reference path="../node_modules/@types/p5/global.d.ts" />

import { Battle } from "./entities/battle"

document.addEventListener("contextmenu", (event) => event.preventDefault())

let game: Battle

export function setup() {
  createCanvas(
    Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
  )

  game = new Battle()
}

export function draw() {
  background(20)

  game.draw()
}

export function keyPressed() {}
export function keyReleased() {}
