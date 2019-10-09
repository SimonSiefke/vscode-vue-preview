const $style = document.getElementById('style') as HTMLStyleElement

export const update = (newStyle: string): void => {
  $style.innerText = newStyle
}
