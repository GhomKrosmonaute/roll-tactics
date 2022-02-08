/// @ts-check
/// <reference path="../node_modules/@types/p5/global.d.ts" />

import * as button from "./ui/button"
import * as battle from "./entities/battle"

document.addEventListener("contextmenu", (event) => event.preventDefault())

export function setup() {
  createCanvas(
    Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
  )

  battle.newBattle()
}

export function draw() {
  background(20)

  button.buttons.forEach((button) => button.draw())
}

export function keyPressed() {}
export function keyReleased() {}
export function mousePressed() {}
export function mouseReleased() {
  ;[...button.buttons].find((b) => b.mouseHover)?.click()
}
