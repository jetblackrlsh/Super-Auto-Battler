Original prompt: Make this project a public git hub repo. I want this to be a static web game that will be hosted as a free github.io Github Pages site. Specifically I want this game to be a single-player, rougelike, auto battler game. The gameplay loop should involve buying units/gear, upgrading units, equipping units with gear, starting and watching the battle, repeat. The player should have a starting health value of 10. Whenever the player's units all die during a battle, the player loses 1 health. The player wins a battle whenever all of the enemy units are defeated in a battle. The player should earn mutagens and credits after every battle, but they should win more whenever they win a battle as a bonus. Mutagens are used to buy upgrades for units, and credits are used to buy units and gear. The game should be superhero themed. The game's story should center around you trying to forge the ultimate superhero team to defeat the supervillain army that has invaded Omega City. The game should have a lot of replay value, scaling difficulty progression, easy to understand gameplay, lots of strategic depth and options, and the ability for every run to feel unique. The game shouldn't really have complex controls, as the player is mainly clicking on things. The game should also be playable with a gamepad. Use the builtin chat AI image generation capability (which doesn't require an API key) to make all of the sprites and backgrounds. The shop for gear and units should be randomized after each battle, and the player should be able to re-roll the shop by spending credits. The art style for the game should be a high color saturation, colorful, dynamic, bright, high detail sharpness, anime style.

## 2026-05-10

- Generated a single anime-style asset atlas with the built-in chat image generation capability and copied it to `assets/omega-city-atlas.png`.
- Added a no-build static web game with `index.html`, `styles.css`, and `app.js`.
- Implemented the core loop: randomized unit/gear shop, credit rerolls, unit purchases, gear purchases, gear selection/equip, mutagen upgrades, auto battle, rewards after every battle, win bonus rewards, scaling enemy waves, 10 starting health, and -1 health when the squad dies.
- Added keyboard and gamepad focus controls.
- Added `window.render_game_to_text()` and `window.advanceTime(ms)` for deterministic browser testing.
- Ran the web-game Playwright client against `http://localhost:4180`; no console errors were produced, the battle payout fired, and health dropped from 10 to 9 on squad defeat. Tightened enemy preview spacing after screenshot review.
- Ran a second web-game Playwright pass that bought a unit, activated Start Battle through the focus path, advanced the fight, and confirmed a victory advanced from stage 1 to stage 2 with win bonus rewards.
- Captured desktop and mobile page screenshots with Playwright; no console errors were reported, and buying/selecting/equipping gear updated the squad state.

## 2026-05-10 Follow-up

- Generated a new built-in image background for the page and copied it to `assets/omega-city-page-bg.png`.
- Added `assets/omega-city-logo.svg` as a transparent-background game logo.
- Extracted transparent PNG hero, villain, and gear cutouts under `assets/sprites/` so checkerboard backgrounds no longer appear in gameplay or UI portraits.
- Changed unit loadouts from one gear item to unlimited gear arrays. The armory now lets the player equip a chosen gear piece directly to a chosen hero, and stacked gear is reflected in stats.
- Added lore text for every hero and gear piece.
- Added How to Play and Story pages in the static app shell.
- Changed the run win condition to 10 victories and updated state output to report `victories` and `targetVictories`.
- Added unique per-character battle effect types and synthesized MIDI-style Web Audio hit effects.
- Restyled the UI around the generated page background, transparent logo, neon anime colors, stronger panels, and transparent sprites.
- Verification: `node --check app.js`; web-game Playwright battle smoke with no console errors; desktop How/Story screenshots; mid-battle effects screenshot; mobile Battle/Story screenshots; custom long-run Playwright automation reached `victories: 10` and `runWon: true` with a heavily stacked gear build.

## 2026-05-10 Management Follow-up

- Added duplicate-unit purchases: buying a unit already owned now merges into that unit and upgrades it using credits.
- Added active lineup vs bench state. Owned benched units can be upgraded and outfitted without taking an active battle slot.
- Added active lineup ordering controls. The first active unit becomes the frontline, draws enemy fire, and gets a defensive bonus; the backline gets extra attack.
- Added unit selling with partial credit and mutagen refunds, returning equipped gear to the armory.
- Added gear upgrading with credits and gear selling with partial credit refunds from both armory and equipped gear.
- Added a Sell Mutagens action that trades 2 mutagens for 3 credits.
- Added persistent Victory/Defeat battle result banners and black outlines for battle-area text.
- Verification: `node --check app.js`; custom Playwright management flow covering duplicate upgrade, mutagen sale, active reorder, bench/deploy, unit sale, gear buy/upgrade/sell, battle finish banner; web-game client smoke test with no console errors and screenshot review of the Defeat banner.

## 2026-05-10 Team Size Follow-up

- Capped the active battle team at 4 units using `MAX_ACTIVE_UNITS`.
- Updated deploy gating, auto-active assignment for newly bought units, the shop counter, planning preview, and How to Play copy to use the 4-unit active limit.
- Kept bench ownership unrestricted so extra units can still be owned, outfitted, and upgraded off the active team.
- Verification: `node --check app.js`; Chrome DevTools local load confirmed the shop displays `Active 1/4`; custom Playwright cap test confirmed six owned units produce four active units, two benched units with disabled deploy buttons, and battles start with exactly four heroes; web-game client battle smoke produced no console errors and a readable Defeat banner screenshot.

## TODO

- No open TODOs for the team-size follow-up.
