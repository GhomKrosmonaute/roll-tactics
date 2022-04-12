export function header(content: string) {
  noStroke()
  fill(200)
  textSize(height * 0.1)
  text(content, width / 2, height * 0.1)
}
