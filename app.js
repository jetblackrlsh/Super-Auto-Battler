const canvas = document.getElementById("battleCanvas");
const ctx = canvas.getContext("2d");
const atlas = new Image();
atlas.src = "assets/omega-city-atlas.png";

const HERO_CROPS = [
  { x: 12, y: 505, w: 132, h: 300 },
  { x: 165, y: 550, w: 128, h: 230 },
  { x: 328, y: 505, w: 135, h: 300 },
  { x: 485, y: 590, w: 125, h: 200 },
  { x: 610, y: 530, w: 136, h: 270 },
  { x: 752, y: 535, w: 112, h: 255 },
  { x: 895, y: 550, w: 112, h: 240 },
];

const VILLAIN_CROPS = [
  { x: 8, y: 888, w: 130, h: 150 },
  { x: 145, y: 885, w: 105, h: 210 },
  { x: 265, y: 880, w: 130, h: 225 },
  { x: 398, y: 855, w: 135, h: 245 },
  { x: 568, y: 835, w: 138, h: 265 },
  { x: 720, y: 860, w: 120, h: 235 },
  { x: 815, y: 875, w: 115, h: 220 },
  { x: 900, y: 865, w: 120, h: 245 },
];

const GEAR_CROPS = [
  { x: 25, y: 1158, w: 110, h: 110 },
  { x: 170, y: 1165, w: 115, h: 120 },
  { x: 325, y: 1165, w: 120, h: 110 },
  { x: 490, y: 1180, w: 110, h: 95 },
  { x: 640, y: 1160, w: 115, h: 115 },
  { x: 780, y: 1158, w: 115, h: 115 },
  { x: 910, y: 1160, w: 110, h: 115 },
  { x: 28, y: 1348, w: 120, h: 112 },
  { x: 175, y: 1345, w: 112, h: 112 },
  { x: 315, y: 1355, w: 120, h: 105 },
  { x: 505, y: 1342, w: 112, h: 118 },
  { x: 765, y: 1338, w: 112, h: 120 },
];

const HERO_POOL = [
  { name: "Solar Vanguard", role: "Bruiser", trait: "Solar", cost: 5, hp: 38, atk: 8, armor: 3, speed: 0.86, crop: 0, ability: "Radiant Guard" },
  { name: "Kinetic Bolt", role: "Striker", trait: "Velocity", cost: 4, hp: 25, atk: 9, armor: 1, speed: 1.35, crop: 1, ability: "Afterimage" },
  { name: "Tempest Halo", role: "Medic", trait: "Storm", cost: 5, hp: 30, atk: 5, armor: 2, speed: 0.95, crop: 2, ability: "Arc Mender" },
  { name: "Gadget Hawkeye", role: "Sniper", trait: "Tech", cost: 4, hp: 24, atk: 12, armor: 1, speed: 0.72, crop: 3, ability: "Piercing Line" },
  { name: "Crystal Colossus", role: "Tank", trait: "Crystal", cost: 6, hp: 52, atk: 6, armor: 5, speed: 0.62, crop: 4, ability: "Prism Shell" },
  { name: "Psi Nova", role: "Support", trait: "Mystic", cost: 5, hp: 28, atk: 7, armor: 1, speed: 1.0, crop: 5, ability: "Mind Link" },
  { name: "Mutagen Mauler", role: "Brawler", trait: "Mutant", cost: 4, hp: 36, atk: 7, armor: 2, speed: 0.92, crop: 6, ability: "Adaptive Rage" },
];

const VILLAIN_POOL = [
  { name: "Razor Drone", hp: 17, atk: 5, armor: 0, speed: 1.18, crop: 0 },
  { name: "Mask Raider", hp: 23, atk: 6, armor: 1, speed: 0.98, crop: 1 },
  { name: "Bulwark Trooper", hp: 36, atk: 5, armor: 4, speed: 0.6, crop: 2 },
  { name: "Toxic Titan", hp: 40, atk: 7, armor: 2, speed: 0.76, crop: 3 },
  { name: "Rift Hierophant", hp: 31, atk: 10, armor: 1, speed: 0.82, crop: 4 },
  { name: "Void Lancer", hp: 27, atk: 9, armor: 1, speed: 1.08, crop: 5 },
  { name: "Grave Siren", hp: 25, atk: 8, armor: 1, speed: 1.02, crop: 6 },
  { name: "Dread Marshal", hp: 48, atk: 11, armor: 4, speed: 0.72, crop: 7 },
];

const GEAR_POOL = [
  { name: "Sun Core", cost: 4, icon: 0, mods: { atk: 3 }, trait: "Solar" },
  { name: "Phase Boots", cost: 3, icon: 1, mods: { speed: 0.18, hp: 4 }, trait: "Velocity" },
  { name: "Mender Pack", cost: 4, icon: 2, mods: { hp: 10 }, trait: "Storm" },
  { name: "Rail Scope", cost: 4, icon: 3, mods: { atk: 4 }, trait: "Tech" },
  { name: "Aegis Prism", cost: 5, icon: 4, mods: { armor: 3, hp: 6 }, trait: "Crystal" },
  { name: "Psi Orb", cost: 4, icon: 5, mods: { atk: 2, speed: 0.12 }, trait: "Mystic" },
  { name: "Shadow Fang", cost: 4, icon: 6, mods: { atk: 3, speed: 0.1 }, trait: "Mutant" },
  { name: "Mutagen Tank", cost: 3, icon: 7, mods: { hp: 14 }, trait: "Mutant" },
  { name: "Interceptor Drone", cost: 5, icon: 8, mods: { atk: 2, armor: 1, speed: 0.12 }, trait: "Tech" },
  { name: "Impact Gauntlet", cost: 4, icon: 9, mods: { atk: 5 }, trait: "Solar" },
  { name: "Bio Rebreather", cost: 3, icon: 10, mods: { armor: 2, hp: 5 }, trait: "Storm" },
  { name: "Chaos Reactor", cost: 6, icon: 11, mods: { atk: 4, hp: 8 }, trait: "Mystic" },
];

let uid = 1;
let activeTab = "shop";
let focusedIndex = 0;
let gamepadLock = {};
let lastFrame = performance.now();

const state = {
  mode: "planning",
  health: 10,
  stage: 1,
  credits: 12,
  mutagens: 4,
  squad: [],
  gear: [],
  shop: { units: [], gear: [] },
  selectedGearId: null,
  battle: null,
  log: [],
  runWon: false,
  runLost: false,
};

function rand(max) {
  return Math.floor(Math.random() * max);
}

function pick(pool) {
  return pool[rand(pool.length)];
}

function cloneUnit(template) {
  return {
    id: uid++,
    template: template.name,
    name: template.name,
    role: template.role,
    trait: template.trait,
    ability: template.ability,
    crop: template.crop,
    level: 1,
    hp: template.hp,
    maxHp: template.hp,
    atk: template.atk,
    armor: template.armor,
    speed: template.speed,
    gear: null,
  };
}

function cloneGear(template) {
  return {
    id: uid++,
    name: template.name,
    icon: template.icon,
    cost: template.cost,
    trait: template.trait,
    mods: { ...template.mods },
  };
}

function log(message) {
  state.log.unshift(message);
  state.log = state.log.slice(0, 8);
}

function resetRun() {
  uid = 1;
  Object.assign(state, {
    mode: "planning",
    health: 10,
    stage: 1,
    credits: 12,
    mutagens: 4,
    squad: [],
    gear: [],
    shop: { units: [], gear: [] },
    selectedGearId: null,
    battle: null,
    log: [],
    runWon: false,
    runLost: false,
  });
  rerollShop(true);
  const starter = cloneUnit(HERO_POOL[0]);
  state.squad.push(starter);
  log("Omega City is breached. Assemble a squad and start the first battle.");
  renderAll();
}

function rerollShop(free = false) {
  if (!free) {
    if (state.mode !== "planning" || state.credits < 2) return;
    state.credits -= 2;
    log("Shop rerolled for 2 credits.");
  }
  state.shop.units = Array.from({ length: 3 }, () => pick(HERO_POOL));
  state.shop.gear = Array.from({ length: 3 }, () => pick(GEAR_POOL));
  renderAll();
}

function buyUnit(index) {
  if (state.mode !== "planning" || state.squad.length >= 5) return;
  const template = state.shop.units[index];
  if (!template || state.credits < template.cost) return;
  state.credits -= template.cost;
  state.squad.push(cloneUnit(template));
  log(`${template.name} joined the resistance.`);
  state.shop.units.splice(index, 1, pick(HERO_POOL));
  renderAll();
}

function buyGear(index) {
  if (state.mode !== "planning") return;
  const template = state.shop.gear[index];
  if (!template || state.credits < template.cost) return;
  state.credits -= template.cost;
  const item = cloneGear(template);
  state.gear.push(item);
  state.selectedGearId = item.id;
  log(`${template.name} added to the armory.`);
  state.shop.gear.splice(index, 1, pick(GEAR_POOL));
  renderAll();
}

function upgradeUnit(id) {
  const unit = state.squad.find((candidate) => candidate.id === id);
  if (!unit || state.mode !== "planning") return;
  const cost = unit.level * 3;
  if (state.mutagens < cost) return;
  state.mutagens -= cost;
  unit.level += 1;
  unit.maxHp += 9;
  unit.hp = unit.maxHp;
  unit.atk += 2;
  unit.armor += unit.level % 2 === 0 ? 1 : 0;
  unit.speed += 0.04;
  log(`${unit.name} mutated to level ${unit.level}.`);
  renderAll();
}

function selectGear(id) {
  state.selectedGearId = id;
  activeTab = "squad";
  renderAll();
}

function equipGear(unitId) {
  if (!state.selectedGearId || state.mode !== "planning") return;
  const unit = state.squad.find((candidate) => candidate.id === unitId);
  const gear = state.gear.find((candidate) => candidate.id === state.selectedGearId);
  if (!unit || !gear) return;
  if (unit.gear) state.gear.push(unit.gear);
  unit.gear = gear;
  state.gear = state.gear.filter((candidate) => candidate.id !== gear.id);
  state.selectedGearId = null;
  log(`${unit.name} equipped ${gear.name}.`);
  renderAll();
}

function traitCounts() {
  return state.squad.reduce((counts, unit) => {
    counts[unit.trait] = (counts[unit.trait] || 0) + 1;
    if (unit.gear) counts[unit.gear.trait] = (counts[unit.gear.trait] || 0) + 1;
    return counts;
  }, {});
}

function traitBonuses() {
  const counts = traitCounts();
  const bonuses = [];
  Object.entries(counts).forEach(([trait, count]) => {
    if (count >= 2) bonuses.push(`${trait} x${count}`);
  });
  return bonuses;
}

function unitBattleStats(unit) {
  const counts = traitCounts();
  let hp = unit.maxHp + unit.level * 2;
  let atk = unit.atk;
  let armor = unit.armor;
  let speed = unit.speed;
  if (unit.gear) {
    hp += unit.gear.mods.hp || 0;
    atk += unit.gear.mods.atk || 0;
    armor += unit.gear.mods.armor || 0;
    speed += unit.gear.mods.speed || 0;
  }
  if ((counts.Solar || 0) >= 2) atk += 2;
  if ((counts.Velocity || 0) >= 2) speed += 0.14;
  if ((counts.Storm || 0) >= 2) hp += 7;
  if ((counts.Tech || 0) >= 2) atk += 1, armor += 1;
  if ((counts.Crystal || 0) >= 2) armor += 2;
  if ((counts.Mystic || 0) >= 2) atk += 2, speed += 0.06;
  if ((counts.Mutant || 0) >= 2) hp += 9, atk += 1;
  return { hp, maxHp: hp, atk, armor, speed };
}

function buildEnemies() {
  const count = Math.min(5, 2 + Math.floor(state.stage / 2));
  const scale = 1 + (state.stage - 1) * 0.17;
  const enemies = [];
  for (let i = 0; i < count; i += 1) {
    const template = i === count - 1 && state.stage % 4 === 0 ? VILLAIN_POOL[7] : pick(VILLAIN_POOL);
    enemies.push({
      id: `e${uid++}`,
      name: template.name,
      crop: template.crop,
      maxHp: Math.round(template.hp * scale),
      hp: Math.round(template.hp * scale),
      atk: Math.round(template.atk * scale),
      armor: Math.round(template.armor + state.stage * 0.25),
      speed: template.speed + state.stage * 0.015,
      side: "enemy",
      cooldown: 0.4 + rand(40) / 100,
      x: 760 + i * 105,
      y: 380 + (i % 2) * 80,
      hitFlash: 0,
    });
  }
  return enemies;
}

function startBattle() {
  if (state.mode !== "planning" || state.squad.length === 0 || state.runLost || state.runWon) return;
  const heroes = state.squad.map((unit, index) => {
    const stats = unitBattleStats(unit);
    return {
      id: unit.id,
      name: unit.name,
      crop: unit.crop,
      maxHp: stats.maxHp,
      hp: stats.hp,
      atk: stats.atk,
      armor: stats.armor,
      speed: stats.speed,
      side: "hero",
      cooldown: 0.2 + index * 0.1,
      x: 230 + index * 78,
      y: 380 + (index % 2) * 80,
      hitFlash: 0,
    };
  });
  state.battle = {
    time: 0,
    status: "fighting",
    heroes,
    enemies: buildEnemies(),
    floaters: [],
  };
  state.mode = "battle";
  log(`Stage ${state.stage}: the villain army attacks.`);
  renderAll();
}

function alive(list) {
  return list.filter((unit) => unit.hp > 0);
}

function nearest(source, list) {
  return alive(list).sort((a, b) => Math.abs(a.x - source.x) - Math.abs(b.x - source.x))[0];
}

function hit(attacker, defender) {
  const damage = Math.max(1, Math.round(attacker.atk - defender.armor * 0.55 + rand(4)));
  defender.hp = Math.max(0, defender.hp - damage);
  defender.hitFlash = 0.16;
  if (state.battle.floaters.length < 12) {
    state.battle.floaters.push({ text: `-${damage}`, x: defender.x, y: defender.y - 74, ttl: 0.75, side: defender.side });
  }
}

function updateBattle(dt) {
  if (state.mode !== "battle" || !state.battle || state.battle.status !== "fighting") return;
  const battle = state.battle;
  battle.time += dt;
  const all = [...battle.heroes, ...battle.enemies];
  all.forEach((unit) => {
    if (unit.hp <= 0) return;
    unit.cooldown -= dt * unit.speed;
    unit.hitFlash = Math.max(0, unit.hitFlash - dt);
    unit.y += Math.sin(battle.time * 5 + Number.parseInt(String(unit.id).replace(/\D/g, ""), 10)) * 0.02;
    if (unit.cooldown <= 0) {
      const target = unit.side === "hero" ? nearest(unit, battle.enemies) : nearest(unit, battle.heroes);
      if (target) {
        hit(unit, target);
        unit.cooldown = 1.05;
      }
    }
  });
  battle.floaters.forEach((floater) => {
    floater.ttl -= dt;
    floater.y -= dt * 44;
  });
  battle.floaters = battle.floaters.filter((floater) => floater.ttl > 0);
  if (alive(battle.enemies).length === 0) finishBattle(true);
  if (alive(battle.heroes).length === 0) finishBattle(false);
}

function finishBattle(won) {
  if (!state.battle || state.battle.status !== "fighting") return;
  state.battle.status = won ? "won" : "lost";
  const baseCredits = 4 + Math.ceil(state.stage * 1.2);
  const baseMutagens = 2 + Math.floor(state.stage / 3);
  const creditGain = baseCredits + (won ? 5 : 0);
  const mutagenGain = baseMutagens + (won ? 2 : 0);
  state.credits += creditGain;
  state.mutagens += mutagenGain;
  if (!won) state.health -= 1;
  log(`${won ? "Victory" : "Defeat"}: +${creditGain} credits, +${mutagenGain} mutagens${won ? "." : ", -1 health."}`);
  if (won) state.stage += 1;
  if (state.health <= 0) {
    state.runLost = true;
    state.mode = "planning";
    log("Omega City fell. Start a new run to try a different squad.");
  } else if (state.stage > 12) {
    state.runWon = true;
    state.mode = "planning";
    log("The supervillain army is broken. Omega City is saved.");
  } else {
    state.mode = "planning";
    rerollShop(true);
  }
  renderAll();
}

function renderStats() {
  document.getElementById("runStats").innerHTML = [
    ["Health", state.health],
    ["Stage", state.stage > 12 ? "Saved" : state.stage],
    ["Credits", state.credits],
    ["Mutagens", state.mutagens],
  ].map(([label, value]) => `<div class="stat"><span>${label}</span><strong>${value}</strong></div>`).join("");
}

function portraitStyle(crop, kind = "hero") {
  const atlasW = 620;
  const scale = atlasW / 1024;
  const source = kind === "gear" ? GEAR_CROPS[crop] : kind === "villain" ? VILLAIN_CROPS[crop] : HERO_CROPS[crop];
  const bgX = -(source.x * scale - 8);
  const bgY = -(source.y * scale - 6);
  return `--atlas-w:${atlasW}px;background-position:${bgX}px ${bgY}px;`;
}

function unitCard(unit) {
  const upgradeCost = unit.level * 3;
  const selectedGear = state.gear.find((item) => item.id === state.selectedGearId);
  return `
    <article class="card" data-focusable="true">
      <div class="portrait" style="${portraitStyle(unit.crop)}"></div>
      <div>
        <h3>${unit.name}</h3>
        <p class="meta">Lv ${unit.level} ${unit.role} | ${unit.ability}</p>
        <div class="chips">
          <span class="chip">${unit.trait}</span>
          <span class="chip">HP ${unit.maxHp}</span>
          <span class="chip">ATK ${unit.atk}</span>
          <span class="chip">ARM ${unit.armor}</span>
          ${unit.gear ? `<span class="chip">${unit.gear.name}</span>` : ""}
        </div>
        <div class="row-actions">
          <button data-action="upgradeUnit" data-id="${unit.id}" ${state.mutagens < upgradeCost ? "disabled" : ""}>Upgrade ${upgradeCost}</button>
          <button data-action="equipGear" data-id="${unit.id}" ${!selectedGear ? "disabled" : ""}>Equip ${selectedGear ? selectedGear.name : "Gear"}</button>
        </div>
      </div>
    </article>
  `;
}

function renderPanel() {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === activeTab);
  });
  const root = document.getElementById("panelContent");
  if (activeTab === "shop") {
    root.innerHTML = `
      <div class="section-title"><span>Recruit</span><span>Squad ${state.squad.length}/5</span></div>
      <div class="grid-list">
        ${state.shop.units.map((unit, index) => `
          <article class="card">
            <div class="portrait" style="${portraitStyle(unit.crop)}"></div>
            <div>
              <h3>${unit.name}</h3>
              <p class="meta">${unit.role} | ${unit.ability}</p>
              <div class="chips">
                <span class="chip">${unit.trait}</span>
                <span class="chip">Cost ${unit.cost}</span>
              </div>
              <div class="row-actions"><button data-action="buyUnit" data-index="${index}" ${state.credits < unit.cost || state.squad.length >= 5 ? "disabled" : ""}>Buy Unit</button></div>
            </div>
          </article>
        `).join("")}
      </div>
      <div class="section-title" style="margin-top:14px"><span>Gear</span><span>Reroll 2 credits</span></div>
      <div class="grid-list">
        ${state.shop.gear.map((gear, index) => `
          <article class="card">
            <div class="portrait" style="${portraitStyle(gear.icon, "gear")}"></div>
            <div>
              <h3>${gear.name}</h3>
              <p class="meta">${modText(gear.mods)} | ${gear.trait}</p>
              <div class="chips"><span class="chip">Cost ${gear.cost}</span></div>
              <div class="row-actions"><button data-action="buyGear" data-index="${index}" ${state.credits < gear.cost ? "disabled" : ""}>Buy Gear</button></div>
            </div>
          </article>
        `).join("")}
      </div>
    `;
  } else if (activeTab === "squad") {
    const bonuses = traitBonuses();
    root.innerHTML = `
      <div class="section-title"><span>Squad</span><span>${bonuses.length ? bonuses.join(" | ") : "Build synergies"}</span></div>
      <div class="grid-list">${state.squad.length ? state.squad.map(unitCard).join("") : `<p class="empty">Recruit heroes from the shop.</p>`}</div>
    `;
  } else {
    root.innerHTML = `
      <div class="section-title"><span>Armory</span><span>${state.selectedGearId ? "Select a squad slot" : "Choose gear"}</span></div>
      <div class="grid-list">
        ${state.gear.length ? state.gear.map((gear) => `
          <article class="card">
            <div class="portrait" style="${portraitStyle(gear.icon, "gear")}"></div>
            <div>
              <h3>${gear.name}</h3>
              <p class="meta">${modText(gear.mods)} | ${gear.trait}</p>
              <div class="row-actions"><button data-action="selectGear" data-id="${gear.id}">${state.selectedGearId === gear.id ? "Selected" : "Select"}</button></div>
            </div>
          </article>
        `).join("") : `<p class="empty">Buy gear, select it here, then equip it to a hero.</p>`}
      </div>
    `;
  }
}

function modText(mods) {
  return Object.entries(mods).map(([key, value]) => `${key.toUpperCase()} +${value}`).join(", ");
}

function renderLog() {
  document.getElementById("eventLog").innerHTML = state.log.map((entry) => `<li>${entry}</li>`).join("");
}

function renderCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (atlas.complete) {
    ctx.drawImage(atlas, 0, 0, 1024, 475, 0, 0, canvas.width, canvas.height);
  }
  const grd = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grd.addColorStop(0, "rgba(10, 20, 60, 0.08)");
  grd.addColorStop(1, "rgba(255, 45, 130, 0.18)");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawHeaderText();
  if (state.mode === "battle" && state.battle) {
    [...state.battle.heroes, ...state.battle.enemies].forEach(drawFighter);
    state.battle.floaters.forEach(drawFloater);
  } else {
    drawPlanningPreview();
  }
}

function drawHeaderText() {
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.88)";
  ctx.strokeStyle = "rgba(17, 19, 38, 0.45)";
  ctx.lineWidth = 5;
  ctx.font = "900 42px system-ui";
  const title = state.runWon ? "OMEGA CITY SAVED" : state.runLost ? "OMEGA CITY FALLEN" : state.mode === "battle" ? "AUTO BATTLE" : "PREPARE THE TEAM";
  ctx.strokeText(title, 38, 66);
  ctx.fillText(title, 38, 66);
  ctx.font = "800 21px system-ui";
  ctx.fillText("Invading supervillains grow stronger after every fight.", 40, 98);
  ctx.restore();
}

function drawPlanningPreview() {
  const previewHeroes = state.squad.slice(0, 5).map((unit, index) => {
    const stats = unitBattleStats(unit);
    return {
      ...stats,
      name: unit.name,
      crop: unit.crop,
      side: "hero",
      x: 220 + index * 118,
      y: 475,
      hp: stats.maxHp,
      maxHp: stats.maxHp,
      hitFlash: 0,
    };
  });
  previewHeroes.forEach(drawFighter);
  const scale = 1 + (state.stage - 1) * 0.17;
  const enemies = Array.from({ length: Math.min(4, 2 + Math.floor(state.stage / 2)) }, (_, index) => {
    const template = VILLAIN_POOL[(state.stage + index) % VILLAIN_POOL.length];
    const hp = Math.round(template.hp * scale);
    return {
      name: template.name,
      crop: template.crop,
      side: "enemy",
      x: 790 + index * 112,
      y: 475,
      hp,
      maxHp: hp,
      atk: Math.round(template.atk * scale),
      armor: Math.round(template.armor + state.stage * 0.25),
      speed: template.speed,
      hitFlash: 0,
    };
  });
  enemies.forEach(drawFighter);
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.font = "900 22px system-ui";
  ctx.fillText("Your Squad", 250, 620);
  ctx.fillText(`Stage ${state.stage} Threat`, 805, 620);
  ctx.restore();
}

function drawFighter(unit) {
  const crop = unit.side === "hero" ? HERO_CROPS[unit.crop] : VILLAIN_CROPS[unit.crop];
  const scale = unit.side === "hero" ? 1 : -1;
  const w = unit.side === "hero" ? 104 : 106;
  const h = unit.side === "hero" ? 168 : 158;
  const pulse = unit.hitFlash > 0 ? 12 : 0;
  ctx.save();
  ctx.translate(unit.x, unit.y);
  ctx.fillStyle = unit.side === "hero" ? "rgba(23,200,255,0.3)" : "rgba(255,63,142,0.3)";
  ctx.beginPath();
  ctx.ellipse(0, 72, 56 + pulse, 16 + pulse / 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.scale(scale, 1);
  if (atlas.complete) ctx.drawImage(atlas, crop.x, crop.y, crop.w, crop.h, -w / 2, -h / 2, w, h);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  drawHealth(unit.x - 45, unit.y - 105, 90, unit.hp / unit.maxHp, unit.side);
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.strokeStyle = "rgba(17,19,38,0.65)";
  ctx.lineWidth = 4;
  ctx.font = "800 15px system-ui";
  ctx.textAlign = "center";
  ctx.strokeText(unit.name, unit.x, unit.y + 108, 108);
  ctx.fillText(unit.name, unit.x, unit.y + 108, 108);
  ctx.restore();
}

function drawHealth(x, y, w, pct, side) {
  ctx.save();
  ctx.fillStyle = "rgba(17,19,38,0.7)";
  ctx.fillRect(x, y, w, 9);
  ctx.fillStyle = side === "hero" ? "#28f0ff" : "#ff4b8b";
  ctx.fillRect(x, y, Math.max(0, w * pct), 9);
  ctx.strokeStyle = "rgba(255,255,255,0.85)";
  ctx.strokeRect(x, y, w, 9);
  ctx.restore();
}

function drawFloater(floater) {
  ctx.save();
  ctx.globalAlpha = Math.max(0, floater.ttl);
  ctx.fillStyle = floater.side === "hero" ? "#ff4b8b" : "#fff05b";
  ctx.strokeStyle = "rgba(17,19,38,0.75)";
  ctx.lineWidth = 4;
  ctx.font = "900 28px system-ui";
  ctx.textAlign = "center";
  ctx.strokeText(floater.text, floater.x, floater.y);
  ctx.fillText(floater.text, floater.x, floater.y);
  ctx.restore();
}

function refreshFocusables() {
  const focusables = [...document.querySelectorAll("button:not(:disabled)")];
  focusables.forEach((el) => el.classList.remove("focus-ring"));
  if (focusables.length === 0) return focusables;
  focusedIndex = Math.max(0, Math.min(focusedIndex, focusables.length - 1));
  focusables[focusedIndex].classList.add("focus-ring");
  return focusables;
}

function renderAll() {
  renderStats();
  renderPanel();
  renderLog();
  renderCanvas();
  refreshFocusables();
}

function handleAction(target) {
  const action = target.dataset.action;
  if (!action) return;
  if (action === "startBattle") startBattle();
  if (action === "rerollShop") rerollShop(false);
  if (action === "newRun") resetRun();
  if (action === "buyUnit") buyUnit(Number(target.dataset.index));
  if (action === "buyGear") buyGear(Number(target.dataset.index));
  if (action === "upgradeUnit") upgradeUnit(Number(target.dataset.id));
  if (action === "selectGear") selectGear(Number(target.dataset.id));
  if (action === "equipGear") equipGear(Number(target.dataset.id));
}

document.addEventListener("click", (event) => {
  const tab = event.target.closest("[data-tab]");
  if (tab) {
    activeTab = tab.dataset.tab;
    renderAll();
    return;
  }
  const action = event.target.closest("[data-action]");
  if (action) handleAction(action);
});

document.addEventListener("keydown", (event) => {
  const focusables = refreshFocusables();
  if (["ArrowDown", "ArrowRight"].includes(event.key)) {
    focusedIndex = (focusedIndex + 1) % Math.max(1, focusables.length);
    refreshFocusables();
    event.preventDefault();
  }
  if (["ArrowUp", "ArrowLeft"].includes(event.key)) {
    focusedIndex = (focusedIndex - 1 + focusables.length) % Math.max(1, focusables.length);
    refreshFocusables();
    event.preventDefault();
  }
  if (event.key === "Enter" || event.key === " ") {
    focusables[focusedIndex]?.click();
    event.preventDefault();
  }
  if (event.key.toLowerCase() === "f") {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  }
});

function pollGamepad() {
  const pad = navigator.getGamepads ? [...navigator.getGamepads()].find(Boolean) : null;
  if (pad) {
    const pressed = (i) => pad.buttons[i]?.pressed;
    const axisMove = Math.abs(pad.axes[1]) > 0.65 || Math.abs(pad.axes[0]) > 0.65;
    if ((pressed(0) && !gamepadLock.a)) refreshFocusables()[focusedIndex]?.click();
    if ((pressed(2) && !gamepadLock.x)) rerollShop(false);
    if ((pressed(3) && !gamepadLock.y)) startBattle();
    if (axisMove && !gamepadLock.axis) {
      const focusables = refreshFocusables();
      const delta = pad.axes[1] > 0.65 || pad.axes[0] > 0.65 ? 1 : -1;
      focusedIndex = (focusedIndex + delta + focusables.length) % Math.max(1, focusables.length);
      refreshFocusables();
    }
    gamepadLock = { a: pressed(0), x: pressed(2), y: pressed(3), axis: axisMove };
  }
}

function loop(now) {
  const dt = Math.min(0.05, (now - lastFrame) / 1000);
  lastFrame = now;
  updateBattle(dt);
  renderCanvas();
  pollGamepad();
  requestAnimationFrame(loop);
}

function renderGameToText() {
  const battle = state.battle ? {
    status: state.battle.status,
    heroes: state.battle.heroes.map(({ name, hp, maxHp, atk, armor, x, y }) => ({ name, hp: Math.round(hp), maxHp, atk, armor, x: Math.round(x), y: Math.round(y) })),
    enemies: state.battle.enemies.map(({ name, hp, maxHp, atk, armor, x, y }) => ({ name, hp: Math.round(hp), maxHp, atk, armor, x: Math.round(x), y: Math.round(y) })),
  } : null;
  return JSON.stringify({
    note: "Canvas coordinates use origin at top-left; x increases right, y increases down.",
    mode: state.mode,
    health: state.health,
    stage: state.stage,
    credits: state.credits,
    mutagens: state.mutagens,
    squad: state.squad.map((unit) => ({ name: unit.name, level: unit.level, trait: unit.trait, gear: unit.gear?.name || null })),
    shop: {
      units: state.shop.units.map((unit) => unit.name),
      gear: state.shop.gear.map((gear) => gear.name),
    },
    selectedGear: state.gear.find((gear) => gear.id === state.selectedGearId)?.name || null,
    runWon: state.runWon,
    runLost: state.runLost,
    battle,
  });
}

window.render_game_to_text = renderGameToText;
window.advanceTime = (ms) => {
  const steps = Math.max(1, Math.round(ms / (1000 / 60)));
  for (let i = 0; i < steps; i += 1) updateBattle(1 / 60);
  renderAll();
};

atlas.addEventListener("load", () => {
  resetRun();
  requestAnimationFrame(loop);
});
