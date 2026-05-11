# Omega City Mutagen War

A static, single-player superhero roguelike auto battler for GitHub Pages.

The run loop is built around recruiting heroes, buying duplicates to upgrade owned heroes, buying and upgrading gear, stacking gear on any hero, benching/deploying units, arranging the active lineup, starting an automatic battle, then using the rewards to adapt the next shop. The player starts with 10 health and loses 1 health whenever all active player units die in battle. Winning requires defeating every enemy unit, and a run is won after 10 battle victories.

Active lineup order matters: the first active hero is the frontline and draws enemy fire with a defensive bonus, while the backline gets extra attack. Benched heroes remain owned and can still be upgraded or outfitted.

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
- Audio: click or use the gamepad once to unlock the browser audio context, then attacks play synthesized MIDI-style effects.

## Hosting

This project has no build step. GitHub Pages can serve it directly from the root of the `main` branch.

## Art

The original sprite and arena atlas is `assets/omega-city-atlas.png`, generated with the built-in chat image generation capability for this project. Runtime character and gear art lives under `assets/sprites/` as transparent PNG cutouts derived from that atlas. The page background, `assets/omega-city-page-bg.png`, was also generated with the built-in chat image generation capability. The logo is `assets/omega-city-logo.svg` and has no background layer.
