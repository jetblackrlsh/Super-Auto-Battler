# Omega City Mutagen War

A static, single-player superhero roguelike auto battler for GitHub Pages.

The run loop is built around recruiting heroes, buying gear, upgrading units with mutagens, equipping items, starting an automatic battle, then using the rewards to adapt the next shop. The player starts with 10 health and loses 1 health whenever all player units die in battle. Winning requires defeating every enemy unit.

## Play Locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 4173
```

Then visit `http://localhost:4173`.

## Controls

- Mouse or touch: click buttons and cards.
- Keyboard: arrow keys move focus, Enter/Space activates, `f` toggles fullscreen.
- Gamepad: D-pad or left stick moves focus, A selects, X rerolls the shop, Y starts battle.

## Hosting

This project has no build step. GitHub Pages can serve it directly from the root of the `main` branch.

## Art

All shipped game sprites, item icons, and the Omega City background are cropped from `assets/omega-city-atlas.png`, generated with the built-in chat image generation capability for this project.
