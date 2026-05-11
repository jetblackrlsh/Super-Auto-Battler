const canvas = document.getElementById("battleCanvas");
const ctx = canvas.getContext("2d");
const arena = new Image();
arena.src = "assets/omega-city-atlas.png";

const HERO_SPRITES = [
  "assets/sprites/heroes/solar-vanguard.png",
  "assets/sprites/heroes/kinetic-bolt.png",
  "assets/sprites/heroes/tempest-halo.png",
  "assets/sprites/heroes/gadget-hawkeye.png",
  "assets/sprites/heroes/crystal-colossus.png",
  "assets/sprites/heroes/psi-nova.png",
  "assets/sprites/heroes/mutagen-mauler.png",
];

const VILLAIN_SPRITES = [
  "assets/sprites/villains/razor-drone.png",
  "assets/sprites/villains/mask-raider.png",
  "assets/sprites/villains/bulwark-trooper.png",
  "assets/sprites/villains/toxic-titan.png",
  "assets/sprites/villains/rift-hierophant.png",
  "assets/sprites/villains/void-lancer.png",
  "assets/sprites/villains/grave-siren.png",
  "assets/sprites/villains/dread-marshal.png",
];

const GEAR_SPRITES = [
  "assets/sprites/gear/sun-core.png",
  "assets/sprites/gear/phase-boots.png",
  "assets/sprites/gear/mender-pack.png",
  "assets/sprites/gear/rail-scope.png",
  "assets/sprites/gear/aegis-prism.png",
  "assets/sprites/gear/psi-orb.png",
  "assets/sprites/gear/shadow-fang.png",
  "assets/sprites/gear/mutagen-tank.png",
  "assets/sprites/gear/interceptor-drone.png",
  "assets/sprites/gear/impact-gauntlet.png",
  "assets/sprites/gear/bio-rebreather.png",
  "assets/sprites/gear/chaos-reactor.png",
];

const spriteCache = new Map();
[...HERO_SPRITES, ...VILLAIN_SPRITES, ...GEAR_SPRITES].forEach((src) => {
  const img = new Image();
  img.src = src;
  spriteCache.set(src, img);
});

const HERO_POOL = [
  { name: "Solar Vanguard", role: "Bruiser", trait: "Solar", cost: 5, hp: 38, atk: 8, armor: 3, speed: 0.86, sprite: 0, ability: "Radiant Guard", fx: "flare", color: "#ffe95f", midi: [72, 76, 79], lore: "A living sun-core knight who held the western shield wall when Omega City's sky first split open." },
  { name: "Kinetic Bolt", role: "Striker", trait: "Velocity", cost: 4, hp: 25, atk: 9, armor: 1, speed: 1.35, sprite: 1, ability: "Afterimage", fx: "dash", color: "#16e8ff", midi: [84, 88, 91], lore: "A courier turned hero who can ricochet through alleys faster than villain sensors can lock on." },
  { name: "Tempest Halo", role: "Medic", trait: "Storm", cost: 5, hp: 30, atk: 5, armor: 2, speed: 0.95, sprite: 2, ability: "Arc Mender", fx: "storm", color: "#7df6ff", midi: [67, 72, 79], lore: "A field surgeon wrapped in weather magic, stitching wounds with lightning and rain." },
  { name: "Gadget Hawkeye", role: "Sniper", trait: "Tech", cost: 4, hp: 24, atk: 12, armor: 1, speed: 0.72, sprite: 3, ability: "Piercing Line", fx: "laser", color: "#75ff5e", midi: [55, 67, 82], lore: "Omega City's most stubborn engineer, armed with prototype optics stolen back from the invaders." },
  { name: "Crystal Colossus", role: "Tank", trait: "Crystal", cost: 6, hp: 52, atk: 6, armor: 5, speed: 0.62, sprite: 4, ability: "Prism Shell", fx: "shards", color: "#52b8ff", midi: [48, 55, 60], lore: "A guardian grown from the city's prism reactor, slow to anger and nearly impossible to break." },
  { name: "Psi Nova", role: "Support", trait: "Mystic", cost: 5, hp: 28, atk: 7, armor: 1, speed: 1.0, sprite: 5, ability: "Mind Link", fx: "psy", color: "#d86cff", midi: [69, 73, 81], lore: "A telepath who hears the army's battle network and turns its orders into static." },
  { name: "Mutagen Mauler", role: "Brawler", trait: "Mutant", cost: 4, hp: 36, atk: 7, armor: 2, speed: 0.92, sprite: 6, ability: "Adaptive Rage", fx: "burst", color: "#7eff70", midi: [45, 57, 64], lore: "An underground champion altered by mutagen fallout, fighting so the cure labs stay standing." },
];

const VILLAIN_POOL = [
  { name: "Razor Drone", hp: 17, atk: 5, armor: 0, speed: 1.18, sprite: 0, fx: "laser", color: "#ff335f", midi: [44, 47, 56] },
  { name: "Mask Raider", hp: 23, atk: 6, armor: 1, speed: 0.98, sprite: 1, fx: "dash", color: "#ff7755", midi: [41, 48, 53] },
  { name: "Bulwark Trooper", hp: 36, atk: 5, armor: 4, speed: 0.6, sprite: 2, fx: "burst", color: "#ff3f3f", midi: [38, 43, 50] },
  { name: "Toxic Titan", hp: 40, atk: 7, armor: 2, speed: 0.76, sprite: 3, fx: "storm", color: "#90ff36", midi: [39, 46, 51] },
  { name: "Rift Hierophant", hp: 31, atk: 10, armor: 1, speed: 0.82, sprite: 4, fx: "psy", color: "#ff2cff", midi: [51, 56, 63] },
  { name: "Void Lancer", hp: 27, atk: 9, armor: 1, speed: 1.08, sprite: 5, fx: "shards", color: "#9f5cff", midi: [49, 54, 61] },
  { name: "Grave Siren", hp: 25, atk: 8, armor: 1, speed: 1.02, sprite: 6, fx: "flare", color: "#d46cff", midi: [46, 53, 58] },
  { name: "Dread Marshal", hp: 48, atk: 11, armor: 4, speed: 0.72, sprite: 7, fx: "burst", color: "#ff284f", midi: [36, 43, 48] },
];

const GEAR_POOL = [
  { name: "Sun Core", cost: 4, icon: 0, mods: { atk: 3 }, trait: "Solar", lore: "A captured reactor shard that burns brighter when a hero refuses to retreat." },
  { name: "Phase Boots", cost: 3, icon: 1, mods: { speed: 0.18, hp: 4 }, trait: "Velocity", lore: "Prototype boots that skip the wearer through half-seconds the enemy never sees." },
  { name: "Mender Pack", cost: 4, icon: 2, mods: { hp: 10 }, trait: "Storm", lore: "A combat med-kit powered by bottled thunder and emergency shield foam." },
  { name: "Rail Scope", cost: 4, icon: 3, mods: { atk: 4 }, trait: "Tech", lore: "A targeting lens that paints weak points through smoke, armor, and portal haze." },
  { name: "Aegis Prism", cost: 5, icon: 4, mods: { armor: 3, hp: 6 }, trait: "Crystal", lore: "A shield plate grown from the same crystal lattice as Omega Tower." },
  { name: "Psi Orb", cost: 4, icon: 5, mods: { atk: 2, speed: 0.12 }, trait: "Mystic", lore: "A thought amplifier that hums with warnings from a few seconds in the future." },
  { name: "Shadow Fang", cost: 4, icon: 6, mods: { atk: 3, speed: 0.1 }, trait: "Mutant", lore: "A villain blade purified just enough to bite invader armor instead of its bearer." },
  { name: "Mutagen Tank", cost: 3, icon: 7, mods: { hp: 14 }, trait: "Mutant", lore: "Volatile green serum. Dangerous, effective, and somehow still city-approved." },
  { name: "Interceptor Drone", cost: 5, icon: 8, mods: { atk: 2, armor: 1, speed: 0.12 }, trait: "Tech", lore: "A reprogrammed scout that whispers firing solutions into the team channel." },
  { name: "Impact Gauntlet", cost: 4, icon: 9, mods: { atk: 5 }, trait: "Solar", lore: "A city-forged gauntlet that stores momentum until one punch becomes an explosion." },
  { name: "Bio Rebreather", cost: 3, icon: 10, mods: { armor: 2, hp: 5 }, trait: "Storm", lore: "Built for toxic districts where the air itself learned to fight back." },
  { name: "Chaos Reactor", cost: 6, icon: 11, mods: { atk: 4, hp: 8 }, trait: "Mystic", lore: "A forbidden battery that turns rift energy into one more chance to win." },
];

const MAX_ACTIVE_UNITS = 4;
const GRADE_REWARDS = {
  S: { credits: 11, mutagens: 5 },
  A: { credits: 9, mutagens: 4 },
  B: { credits: 7, mutagens: 3 },
  C: { credits: 5, mutagens: 2 },
  D: { credits: 3, mutagens: 1 },
  F: { credits: 2, mutagens: 1 },
};
const GRADE_DIFFICULTY = {
  S: { threat: 0.28, extraEnemies: 1, label: "Omega City crisis spike" },
  A: { threat: 0.18, extraEnemies: 1, label: "villains escalate" },
  B: { threat: 0.08, extraEnemies: 0, label: "villains adapt" },
  C: { threat: 0, extraEnemies: 0, label: "standard threat" },
  D: { threat: -0.05, extraEnemies: 0, label: "villains hesitate" },
  F: { threat: -0.1, extraEnemies: 0, label: "villains regroup" },
};

let uid = 1;
let activeTab = "shop";
let activePage = "battle";
let focusedIndex = 0;
let gamepadLock = {};
let lastFrame = performance.now();
let audioCtx = null;

const state = {
  mode: "planning",
  health: 10,
  stage: 1,
  victories: 0,
  credits: 12,
  mutagens: 4,
  squad: [],
  gear: [],
  shop: { units: [], gear: [] },
  selectedGearId: null,
  enemyPlan: [],
  resultBanner: null,
  battle: null,
  log: [],
  runWon: false,
  runLost: false,
  lastBattleGrade: null,
};

function rand(max) {
  return Math.floor(Math.random() * max);
}

function pick(pool) {
  return pool[rand(pool.length)];
}

function activeUnits() {
  return state.squad.filter((unit) => unit.active);
}

function benchUnits() {
  return state.squad.filter((unit) => !unit.active);
}

function activeIndex(unit) {
  return activeUnits().findIndex((candidate) => candidate.id === unit.id);
}

function sellValue(value) {
  return Math.max(0, Math.floor(value * 0.75));
}

function cloneUnit(template) {
  return {
    id: uid++,
    template: template.name,
    name: template.name,
    role: template.role,
    trait: template.trait,
    ability: template.ability,
    sprite: template.sprite,
    fx: template.fx,
    color: template.color,
    midi: template.midi,
    lore: template.lore,
    level: 1,
    hp: template.hp,
    maxHp: template.hp,
    atk: template.atk,
    armor: template.armor,
    speed: template.speed,
    active: activeUnits().length < MAX_ACTIVE_UNITS,
    duplicateCount: 1,
    investedCredits: template.cost,
    investedMutagens: 0,
    kills: 0,
    deaths: 0,
    gear: [],
  };
}

function cloneGear(template) {
  return {
    id: uid++,
    name: template.name,
    icon: template.icon,
    cost: template.cost,
    trait: template.trait,
    lore: template.lore,
    level: 1,
    investedCredits: template.cost,
    mods: { ...template.mods },
  };
}

function log(message) {
  state.log.unshift(message);
  state.log = state.log.slice(0, 8);
}

function ensureAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume();
}

function midiToHz(note) {
  return 440 * Math.pow(2, (note - 69) / 12);
}

function playMidiEffect(notes, color = "#fff") {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  const baseGain = audioCtx.createGain();
  baseGain.gain.setValueAtTime(0.0001, now);
  baseGain.gain.exponentialRampToValueAtTime(0.055, now + 0.02);
  baseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.34);
  baseGain.connect(audioCtx.destination);
  notes.forEach((note, index) => {
    const osc = audioCtx.createOscillator();
    osc.type = index % 2 ? "square" : "triangle";
    osc.frequency.setValueAtTime(midiToHz(note), now + index * 0.035);
    osc.frequency.exponentialRampToValueAtTime(midiToHz(note + 7), now + 0.18 + index * 0.035);
    osc.connect(baseGain);
    osc.start(now + index * 0.035);
    osc.stop(now + 0.32 + index * 0.035);
  });
}

function playDefeatEffect(unit) {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  const baseGain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();
  const notes = unit.side === "hero" ? [60, 55, 48, 43] : [72, 67, 60, 55];
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1600, now);
  filter.frequency.exponentialRampToValueAtTime(260, now + 0.48);
  baseGain.gain.setValueAtTime(0.0001, now);
  baseGain.gain.exponentialRampToValueAtTime(0.075, now + 0.025);
  baseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.62);
  filter.connect(baseGain);
  baseGain.connect(audioCtx.destination);
  notes.forEach((note, index) => {
    const osc = audioCtx.createOscillator();
    const start = now + index * 0.055;
    osc.type = index % 2 ? "sawtooth" : "square";
    osc.frequency.setValueAtTime(midiToHz(note), start);
    osc.frequency.exponentialRampToValueAtTime(midiToHz(note - 12), start + 0.28);
    osc.connect(filter);
    osc.start(start);
    osc.stop(start + 0.42);
  });
}

function resetRun() {
  uid = 1;
  Object.assign(state, {
    mode: "planning",
    health: 10,
    stage: 1,
    victories: 0,
    credits: 12,
    mutagens: 4,
    squad: [],
    gear: [],
    shop: { units: [], gear: [] },
    selectedGearId: null,
    enemyPlan: [],
    resultBanner: null,
    battle: null,
    log: [],
    runWon: false,
    runLost: false,
    lastBattleGrade: null,
  });
  refreshEnemyPlan();
  rerollShop(true);
  state.squad.push(cloneUnit(HERO_POOL[0]));
  log("Omega City is breached. Win 10 battles to break the invasion.");
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
  if (state.mode !== "planning") return;
  const template = state.shop.units[index];
  if (!template || state.credits < template.cost) return;
  state.credits -= template.cost;
  const owned = state.squad.find((unit) => unit.template === template.name);
  if (owned) {
    applyDuplicateUpgrade(owned, template.cost);
    log(`${template.name} duplicate merged into ${owned.name}: level ${owned.level}.`);
  } else {
    const unit = cloneUnit(template);
    state.squad.push(unit);
    log(`${template.name} ${unit.active ? "joined the active lineup" : "joined the bench"}.`);
  }
  state.shop.units[index] = null;
  renderAll();
}

function applyDuplicateUpgrade(unit, creditCost) {
  unit.duplicateCount += 1;
  unit.investedCredits += creditCost;
  unit.level += 1;
  unit.maxHp += 7;
  unit.hp = unit.maxHp;
  unit.atk += 2;
  unit.armor += unit.level % 2 === 0 ? 1 : 0;
  unit.speed += 0.035;
}

function buyGear(index) {
  if (state.mode !== "planning") return;
  const template = state.shop.gear[index];
  if (!template || state.credits < template.cost) return;
  state.credits -= template.cost;
  const item = cloneGear(template);
  state.gear.push(item);
  state.selectedGearId = item.id;
  log(`${template.name} added to the armory. Choose a hero to equip it.`);
  state.shop.gear[index] = null;
  activeTab = "gear";
  renderAll();
}

function upgradeUnit(id) {
  const unit = state.squad.find((candidate) => candidate.id === id);
  if (!unit || state.mode !== "planning") return;
  const cost = unit.level * 3;
  if (state.mutagens < cost) return;
  state.mutagens -= cost;
  unit.investedMutagens += cost;
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
  log(`${gearById(id)?.name || "Gear"} selected. Pick any hero to equip it.`);
  renderAll();
}

function gearById(id) {
  return state.gear.find((candidate) => candidate.id === id);
}

function findGear(id) {
  const gearId = Number(id);
  const armoryGear = state.gear.find((candidate) => candidate.id === gearId);
  if (armoryGear) return { gear: armoryGear, owner: null };
  for (const unit of state.squad) {
    const equipped = unit.gear.find((candidate) => candidate.id === gearId);
    if (equipped) return { gear: equipped, owner: unit };
  }
  return { gear: null, owner: null };
}

function equipGear(unitId, gearId = state.selectedGearId) {
  if (!gearId || state.mode !== "planning") return;
  const unit = state.squad.find((candidate) => candidate.id === unitId);
  const gear = gearById(Number(gearId));
  if (!unit || !gear) return;
  unit.gear.push(gear);
  state.gear = state.gear.filter((candidate) => candidate.id !== gear.id);
  state.selectedGearId = null;
  log(`${unit.name} equipped ${gear.name}. Gear slots are unlimited.`);
  renderAll();
}

function unequipGear(unitId, gearId) {
  if (state.mode !== "planning") return;
  const unit = state.squad.find((candidate) => candidate.id === unitId);
  if (!unit) return;
  const gear = unit.gear.find((candidate) => candidate.id === Number(gearId));
  if (!gear) return;
  unit.gear = unit.gear.filter((candidate) => candidate.id !== gear.id);
  state.gear.push(gear);
  log(`${unit.name} unequipped ${gear.name}.`);
  renderAll();
}

function upgradeGear(gearId) {
  if (state.mode !== "planning") return;
  const { gear } = findGear(gearId);
  if (!gear) return;
  const cost = gear.level + 2;
  if (state.credits < cost) return;
  state.credits -= cost;
  gear.investedCredits += cost;
  gear.level += 1;
  Object.entries(gear.mods).forEach(([key, value]) => {
    gear.mods[key] = key === "speed" ? Number((value + 0.05).toFixed(2)) : value + Math.max(1, Math.round(value * 0.35));
  });
  log(`${gear.name} upgraded to level ${gear.level}.`);
  renderAll();
}

function sellGear(gearId) {
  if (state.mode !== "planning") return;
  const { gear, owner } = findGear(gearId);
  if (!gear) return;
  const refund = sellValue(gear.investedCredits);
  state.credits += refund;
  if (owner) owner.gear = owner.gear.filter((candidate) => candidate.id !== gear.id);
  else state.gear = state.gear.filter((candidate) => candidate.id !== gear.id);
  if (state.selectedGearId === gear.id) state.selectedGearId = null;
  log(`${gear.name} sold for ${refund} credits.`);
  renderAll();
}

function sellUnit(id) {
  if (state.mode !== "planning") return;
  const unit = state.squad.find((candidate) => candidate.id === id);
  if (!unit) return;
  const creditRefund = sellValue(unit.investedCredits);
  const mutagenRefund = sellValue(unit.investedMutagens);
  state.credits += creditRefund;
  state.mutagens += mutagenRefund;
  state.gear.push(...unit.gear);
  state.squad = state.squad.filter((candidate) => candidate.id !== unit.id);
  log(`${unit.name} sold for ${creditRefund} credits and ${mutagenRefund} mutagens. Gear returned to armory.`);
  renderAll();
}

function toggleBench(id) {
  if (state.mode !== "planning") return;
  const unit = state.squad.find((candidate) => candidate.id === id);
  if (!unit) return;
  if (unit.active) {
    unit.active = false;
    log(`${unit.name} moved to the bench.`);
  } else if (activeUnits().length < MAX_ACTIVE_UNITS) {
    unit.active = true;
    log(`${unit.name} deployed to the active lineup.`);
  }
  renderAll();
}

function moveUnit(id, direction) {
  if (state.mode !== "planning") return;
  const lineup = activeUnits();
  const index = lineup.findIndex((unit) => unit.id === id);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= lineup.length) return;
  const a = state.squad.findIndex((unit) => unit.id === lineup[index].id);
  const b = state.squad.findIndex((unit) => unit.id === lineup[target].id);
  [state.squad[a], state.squad[b]] = [state.squad[b], state.squad[a]];
  log(`${lineup[index].name} shifted ${direction < 0 ? "toward the front" : "toward the back"}.`);
  renderAll();
}

function sellMutagens() {
  if (state.mode !== "planning" || state.mutagens < 2) return;
  state.mutagens -= 2;
  state.credits += 3;
  log("Sold 2 mutagens for 3 credits.");
  renderAll();
}

function traitCounts() {
  return activeUnits().reduce((counts, unit) => {
    counts[unit.trait] = (counts[unit.trait] || 0) + 1;
    unit.gear.forEach((gear) => {
      counts[gear.trait] = (counts[gear.trait] || 0) + 1;
    });
    return counts;
  }, {});
}

function traitBonuses() {
  const counts = traitCounts();
  return Object.entries(counts)
    .filter(([, count]) => count >= 2)
    .map(([trait, count]) => `${trait} x${count}`);
}

function unitBattleStats(unit) {
  const counts = traitCounts();
  let hp = unit.maxHp + unit.level * 2;
  let atk = unit.atk;
  let armor = unit.armor;
  let speed = unit.speed;
  unit.gear.forEach((gear) => {
    hp += gear.mods.hp || 0;
    atk += gear.mods.atk || 0;
    armor += gear.mods.armor || 0;
    speed += gear.mods.speed || 0;
  });
  if ((counts.Solar || 0) >= 2) atk += 2;
  if ((counts.Velocity || 0) >= 2) speed += 0.14;
  if ((counts.Storm || 0) >= 2) hp += 7;
  if ((counts.Tech || 0) >= 2) atk += 1, armor += 1;
  if ((counts.Crystal || 0) >= 2) armor += 2;
  if ((counts.Mystic || 0) >= 2) atk += 2, speed += 0.06;
  if ((counts.Mutant || 0) >= 2) hp += 9, atk += 1;
  return { hp, maxHp: hp, atk, armor, speed };
}

function heroBattleStats(unit, index, lineupLength = activeUnits().length) {
  const stats = unitBattleStats(unit);
  const frontlineHp = index === 0 ? 8 : 0;
  const frontlineArmor = index === 0 ? 3 : 0;
  const backlineAttack = index >= Math.max(1, lineupLength - 2) ? 2 : 0;
  return {
    hp: stats.hp + frontlineHp,
    maxHp: stats.maxHp + frontlineHp,
    atk: stats.atk + backlineAttack,
    armor: stats.armor + frontlineArmor,
    speed: stats.speed,
  };
}

function adaptiveDifficulty() {
  return GRADE_DIFFICULTY[state.lastBattleGrade] || { threat: 0, extraEnemies: 0, label: "first assault" };
}

function refreshEnemyPlan() {
  const adaptive = adaptiveDifficulty();
  const count = Math.min(5, 2 + Math.floor(state.stage / 2) + adaptive.extraEnemies);
  state.enemyPlan = Array.from({ length: count }, (_, index) => (
    index === count - 1 && state.stage % 3 === 0 ? 7 : rand(VILLAIN_POOL.length)
  ));
}

function ensureEnemyPlan() {
  if (!state.enemyPlan.length) refreshEnemyPlan();
}

function enemyStats(template) {
  const adaptive = adaptiveDifficulty();
  const scale = Math.max(0.75, 1 + (state.stage - 1) * 0.18 + adaptive.threat);
  const hp = Math.round(template.hp * scale);
  return {
    hp,
    maxHp: hp,
    atk: Math.round(template.atk * scale),
    armor: Math.max(0, Math.round(template.armor + state.stage * 0.3 + adaptive.threat * 3)),
    speed: Math.max(0.45, template.speed + state.stage * 0.018 + adaptive.threat * 0.08),
  };
}

function plannedEnemies() {
  ensureEnemyPlan();
  return state.enemyPlan.map((templateIndex, index) => {
    const template = VILLAIN_POOL[templateIndex];
    return {
      ...enemyStats(template),
      name: template.name,
      templateIndex,
      sprite: template.sprite,
      fx: template.fx,
      color: template.color,
      midi: template.midi,
      side: "enemy",
      x: 760 + index * 105,
      y: 380 + (index % 2) * 80,
      baseY: 380 + (index % 2) * 80,
    };
  });
}

function buildEnemies() {
  const planned = plannedEnemies();
  const enemies = [];
  for (let i = 0; i < planned.length; i += 1) {
    const template = planned[i];
    enemies.push({
      id: `e${uid++}`,
      name: template.name,
      sprite: template.sprite,
      maxHp: template.maxHp,
      hp: template.hp,
      atk: template.atk,
      armor: template.armor,
      speed: template.speed,
      side: "enemy",
      fx: template.fx,
      color: template.color,
      midi: template.midi,
      cooldown: 0.35 + rand(45) / 100,
      x: 760 + i * 105,
      y: 380 + (i % 2) * 80,
      baseY: 380 + (i % 2) * 80,
      hitFlash: 0,
      attackFlash: 0,
      defeatFlash: 0,
      defeated: false,
    });
  }
  return enemies;
}

function startBattle() {
  const lineup = activeUnits();
  if (state.mode !== "planning" || lineup.length === 0 || state.runLost || state.runWon) return;
  state.resultBanner = null;
  ensureEnemyPlan();
  const heroes = lineup.map((unit, index) => {
    const stats = heroBattleStats(unit, index, lineup.length);
    return {
      id: unit.id,
      name: unit.name,
      sprite: unit.sprite,
      maxHp: stats.maxHp,
      hp: stats.hp,
      atk: stats.atk,
      armor: stats.armor,
      speed: stats.speed,
      side: "hero",
      fx: unit.fx,
      color: unit.color,
      midi: unit.midi,
      cooldown: 0.16 + index * 0.1,
      x: 520 - index * 88,
      y: 380 + (index % 2) * 80,
      baseY: 380 + (index % 2) * 80,
      formation: index === 0 ? "Frontline" : index >= Math.max(1, lineup.length - 2) ? "Backline" : "Midline",
      hitFlash: 0,
      attackFlash: 0,
      defeatFlash: 0,
      defeated: false,
    };
  });
  state.battle = { time: 0, status: "fighting", heroes, enemies: buildEnemies(), floaters: [], effects: [] };
  state.mode = "battle";
  log(`Battle ${state.victories + 1}/10: the villain army attacks.`);
  playMidiEffect([60, 64, 67, 72]);
  renderAll();
}

function alive(list) {
  return list.filter((unit) => unit.hp > 0);
}

function nearest(source, list) {
  return alive(list).sort((a, b) => Math.abs(a.x - source.x) - Math.abs(b.x - source.x))[0];
}

function letterGrade(score) {
  if (score >= 90) return "S";
  if (score >= 78) return "A";
  if (score >= 64) return "B";
  if (score >= 48) return "C";
  if (score >= 30) return "D";
  return "F";
}

function gradeBattlePerformance() {
  const battle = state.battle;
  const totalEnemies = battle.enemies.length;
  const enemiesDefeated = battle.enemies.filter((unit) => unit.hp <= 0).length;
  const totalHeroes = battle.heroes.length;
  const heroesAlive = battle.heroes.filter((unit) => unit.hp > 0).length;
  const totalHealthRemaining = Math.round(battle.heroes.reduce((sum, unit) => sum + Math.max(0, unit.hp), 0));
  const maxTeamHealth = Math.round(battle.heroes.reduce((sum, unit) => sum + unit.maxHp, 0));
  const enemyScore = totalEnemies ? enemiesDefeated / totalEnemies : 0;
  const survivorScore = totalHeroes ? heroesAlive / totalHeroes : 0;
  const healthScore = maxTeamHealth ? totalHealthRemaining / maxTeamHealth : 0;
  const score = Math.round(enemyScore * 50 + survivorScore * 25 + healthScore * 25);
  const grade = letterGrade(score);
  const stageCredits = Math.ceil(state.stage * 0.8);
  const stageMutagens = Math.floor(state.stage / 4);
  const gradeReward = GRADE_REWARDS[grade];
  return {
    grade,
    score,
    enemiesDefeated,
    totalEnemies,
    heroesAlive,
    totalHeroes,
    totalHealthRemaining,
    maxTeamHealth,
    rewards: {
      credits: stageCredits + gradeReward.credits,
      mutagens: stageMutagens + gradeReward.mutagens,
    },
  };
}

function markDefeated(unit) {
  unit.defeated = true;
  unit.defeatFlash = 1.25;
  unit.cooldown = 999;
  if (state.battle.floaters.length < 18) {
    state.battle.floaters.push({ text: "DOWN!", x: unit.x, y: unit.y - 104, ttl: 1.05, side: unit.side });
  }
  state.battle.effects.push({
    type: "defeat",
    color: unit.side === "hero" ? "#28f0ff" : "#ff4b8b",
    fromX: unit.x,
    fromY: unit.y - 56,
    toX: unit.x,
    toY: unit.y - 48,
    ttl: 1.0,
    max: 1.0,
    side: unit.side,
  });
  playDefeatEffect(unit);
}

function addUnitKill(id) {
  const unit = state.squad.find((candidate) => candidate.id === id);
  if (unit) unit.kills += 1;
}

function addUnitDeath(id) {
  const unit = state.squad.find((candidate) => candidate.id === id);
  if (unit) unit.deaths += 1;
}

function hit(attacker, defender) {
  const wasAlive = defender.hp > 0;
  const damage = Math.max(1, Math.round(attacker.atk - defender.armor * 0.55 + rand(4)));
  defender.hp = Math.max(0, defender.hp - damage);
  defender.hitFlash = 0.24;
  attacker.attackFlash = 0.26;
  if (state.battle.floaters.length < 18) {
    state.battle.floaters.push({ text: `-${damage}`, x: defender.x, y: defender.y - 74, ttl: 0.85, side: defender.side });
  }
  state.battle.effects.push({
    type: attacker.fx,
    color: attacker.color,
    fromX: attacker.x,
    fromY: attacker.y - 42,
    toX: defender.x,
    toY: defender.y - 48,
    ttl: 0.42,
    max: 0.42,
  });
  playMidiEffect(attacker.midi, attacker.color);
  if (wasAlive && defender.hp <= 0 && !defender.defeated) {
    markDefeated(defender);
    if (attacker.side === "hero" && defender.side === "enemy") addUnitKill(attacker.id);
    if (defender.side === "hero") addUnitDeath(defender.id);
  }
}

function updateBattle(dt) {
  if (state.mode !== "battle" || !state.battle || state.battle.status !== "fighting") return;
  const battle = state.battle;
  battle.time += dt;
  const all = [...battle.heroes, ...battle.enemies];
  all.forEach((unit) => {
    unit.cooldown -= dt * unit.speed;
    unit.hitFlash = Math.max(0, unit.hitFlash - dt);
    unit.attackFlash = Math.max(0, unit.attackFlash - dt);
    unit.defeatFlash = Math.max(0, unit.defeatFlash - dt);
    if (unit.hp <= 0) return;
    unit.y = unit.baseY + Math.sin(battle.time * (5.5 + unit.speed) + unit.id) * 5;
    if (unit.cooldown <= 0) {
      const target = unit.side === "hero" ? nearest(unit, battle.enemies) : nearest(unit, battle.heroes);
      if (target) {
        hit(unit, target);
        unit.cooldown = 0.85 + rand(30) / 100;
      }
    }
  });
  battle.floaters.forEach((floater) => {
    floater.ttl -= dt;
    floater.y -= dt * 54;
  });
  battle.effects.forEach((effect) => {
    effect.ttl -= dt;
  });
  battle.floaters = battle.floaters.filter((floater) => floater.ttl > 0);
  battle.effects = battle.effects.filter((effect) => effect.ttl > 0);
  if (alive(battle.enemies).length === 0) finishBattle(true);
  if (alive(battle.heroes).length === 0) finishBattle(false);
}

function finishBattle(won) {
  if (!state.battle || state.battle.status !== "fighting") return;
  state.battle.status = won ? "won" : "lost";
  const performance = gradeBattlePerformance();
  const creditGain = performance.rewards.credits;
  const mutagenGain = performance.rewards.mutagens;
  state.credits += creditGain;
  state.mutagens += mutagenGain;
  state.lastBattleGrade = performance.grade;
  if (won) state.victories += 1;
  if (!won) state.health -= 1;
  state.resultBanner = { text: won ? "VICTORY" : "DEFEAT", won, performance };
  log(`${won ? "Victory" : "Defeat"} Grade ${performance.grade}: +${creditGain} credits, +${mutagenGain} mutagens. Enemies ${performance.enemiesDefeated}/${performance.totalEnemies}, heroes ${performance.heroesAlive}/${performance.totalHeroes}, HP ${performance.totalHealthRemaining}/${performance.maxTeamHealth}${won ? "." : ", -1 health."}`);
  if (state.health <= 0) {
    state.runLost = true;
    state.mode = "planning";
    log("Omega City fell. Start a new run to try a different squad.");
  } else if (state.victories >= 10) {
    state.runWon = true;
    state.mode = "planning";
    log("Ten victories won. The supervillain army is broken.");
    playMidiEffect([72, 76, 79, 84, 88]);
  } else {
    state.stage = state.victories + 1;
    state.mode = "planning";
    refreshEnemyPlan();
    rerollShop(true);
  }
  renderAll();
}

function renderStats() {
  document.getElementById("runStats").innerHTML = [
    ["Health", state.health],
    ["Wins", `${state.victories}/10`],
    ["Credits", state.credits],
    ["Mutagens", state.mutagens],
  ].map(([label, value]) => `<div class="stat"><span>${label}</span><strong>${value}</strong></div>`).join("");
}

function spriteSrc(kind, index) {
  if (kind === "gear") return GEAR_SPRITES[index];
  if (kind === "villain") return VILLAIN_SPRITES[index];
  return HERO_SPRITES[index];
}

function portrait(src, alt = "") {
  return `<img class="portrait" src="${src}" alt="${alt}">`;
}

function emptyTotals() {
  return { hp: 0, atk: 0, armor: 0, speed: 0, power: 0 };
}

function addToTotals(totals, stats) {
  totals.hp += stats.maxHp || stats.hp || 0;
  totals.atk += stats.atk || 0;
  totals.armor += stats.armor || 0;
  totals.speed += stats.speed || 0;
  totals.power += statPower(stats);
  return totals;
}

function statPower(stats) {
  return Math.round((stats.maxHp || stats.hp || 0) + (stats.atk || 0) * 4 + (stats.armor || 0) * 6 + (stats.speed || 0) * 22);
}

function roundStat(value) {
  return Number(value.toFixed(1));
}

function combatRecord(unit) {
  const ratio = unit.deaths === 0 ? (unit.kills > 0 ? "Perfect" : "0.00") : (unit.kills / unit.deaths).toFixed(2);
  return { kills: unit.kills, deaths: unit.deaths, ratio };
}

function teamTotals() {
  return activeUnits().reduce((totals, unit, index, lineup) => addToTotals(totals, heroBattleStats(unit, index, lineup.length)), emptyTotals());
}

function enemyTotals() {
  return plannedEnemies().reduce((totals, enemy) => addToTotals(totals, enemy), emptyTotals());
}

function teamComparison() {
  const heroes = teamTotals();
  const enemies = enemyTotals();
  const diff = {
    hp: heroes.hp - enemies.hp,
    atk: heroes.atk - enemies.atk,
    armor: heroes.armor - enemies.armor,
    speed: roundStat(heroes.speed - enemies.speed),
    power: heroes.power - enemies.power,
  };
  const label = diff.power > 0 ? "Hero advantage" : diff.power < 0 ? "Enemy advantage" : "Even threat";
  return {
    heroes: { ...heroes, speed: roundStat(heroes.speed) },
    enemies: { ...enemies, speed: roundStat(enemies.speed) },
    diff,
    label,
  };
}

function gearTotals(unit) {
  return unit.gear.reduce((totals, gear) => {
    Object.entries(gear.mods).forEach(([key, value]) => {
      totals[key] = Number(((totals[key] || 0) + value).toFixed(2));
    });
    return totals;
  }, {});
}

function gearEffectSummary(unit) {
  if (!unit.gear.length) return "No equipped gear bonuses";
  return modText(gearTotals(unit));
}

function equippedGearRows(unit) {
  if (!unit.gear.length) return `<p>No gear equipped</p>`;
  return unit.gear.map((gear) => gearRow(gear, true, unit.id)).join("");
}

function unitCard(unit) {
  const upgradeCost = unit.level * 3;
  const selectedGear = gearById(state.selectedGearId);
  const position = activeIndex(unit);
  const isActive = unit.active;
  const canDeploy = !isActive && activeUnits().length < MAX_ACTIVE_UNITS;
  const creditRefund = sellValue(unit.investedCredits);
  const mutagenRefund = sellValue(unit.investedMutagens);
  const stats = unitBattleStats(unit);
  const record = combatRecord(unit);
  return `
    <article class="card hero-card">
      ${portrait(spriteSrc("hero", unit.sprite), unit.name)}
      <div>
        <h3>${unit.name}</h3>
        <p class="meta">Lv ${unit.level} ${unit.role} | ${unit.ability}</p>
        <p class="lore">${unit.lore}</p>
        <div class="chips">
          <span class="chip">${isActive ? `Active ${position + 1}` : "Benched"}</span>
          <span class="chip">${unit.trait}</span>
          <span class="chip">HP ${unit.maxHp}</span>
          <span class="chip">ATK ${unit.atk}</span>
          <span class="chip">ARM ${unit.armor}</span>
          <span class="chip">KO ${record.kills}</span>
          <span class="chip">Falls ${record.deaths}</span>
          <span class="chip">K/D ${record.ratio}</span>
          <span class="chip">Dupes ${unit.duplicateCount}</span>
          <span class="chip">Gear ${unit.gear.length}</span>
        </div>
        <div class="gear-summary">
          <strong>Gear effects</strong>
          <span>${gearEffectSummary(unit)}</span>
          <span>Battle stats: HP ${stats.maxHp}, ATK ${stats.atk}, ARM ${stats.armor}, SPD ${stats.speed.toFixed(2)}</span>
        </div>
        <div class="loadout">
          ${equippedGearRows(unit)}
        </div>
        <div class="row-actions">
          <button data-action="moveUnit" data-id="${unit.id}" data-direction="-1" ${!isActive || position <= 0 ? "disabled" : ""}>Forward</button>
          <button data-action="moveUnit" data-id="${unit.id}" data-direction="1" ${!isActive || position < 0 || position >= activeUnits().length - 1 ? "disabled" : ""}>Back</button>
          <button data-action="toggleBench" data-id="${unit.id}" ${!isActive && !canDeploy ? "disabled" : ""}>${isActive ? "Bench" : "Deploy"}</button>
          <button data-action="upgradeUnit" data-id="${unit.id}" ${state.mutagens < upgradeCost ? "disabled" : ""}>Upgrade ${upgradeCost}</button>
          <button data-action="equipGear" data-id="${unit.id}" ${!selectedGear ? "disabled" : ""}>Equip ${selectedGear ? selectedGear.name : "Selected Gear"}</button>
          <button data-action="sellUnit" data-id="${unit.id}">Sell +${creditRefund}C +${mutagenRefund}M</button>
        </div>
      </div>
    </article>
  `;
}

function statDiffChip(label, value, decimals = 0) {
  const shown = decimals ? value.toFixed(decimals) : Math.round(value);
  const signed = value > 0 ? `+${shown}` : shown;
  const tone = value > 0 ? "good" : value < 0 ? "bad" : "even";
  return `<span class="stat-diff ${tone}">${label} ${signed}</span>`;
}

function renderThreatIntel() {
  const comparison = teamComparison();
  const enemies = plannedEnemies();
  return `
    <section class="threat-intel">
      <div class="section-title"><span>Threat Intel</span><span>${comparison.label}</span></div>
      <div class="advantage-card ${comparison.diff.power >= 0 ? "hero-lean" : "enemy-lean"}">
        <div><span>Hero Power</span><strong>${comparison.heroes.power}</strong></div>
        <div><span>Enemy Power</span><strong>${comparison.enemies.power}</strong></div>
        <div><span>Advantage</span><strong>${comparison.diff.power > 0 ? "+" : ""}${comparison.diff.power}</strong></div>
      </div>
      <div class="stat-diffs">
        ${statDiffChip("HP", comparison.diff.hp)}
        ${statDiffChip("ATK", comparison.diff.atk)}
        ${statDiffChip("ARM", comparison.diff.armor)}
        ${statDiffChip("SPD", comparison.diff.speed, 1)}
      </div>
      <div class="enemy-roster">
        ${enemies.map((enemy) => `
          <article class="enemy-mini-card">
            ${portrait(spriteSrc("villain", enemy.sprite), enemy.name)}
            <div>
              <h3>${enemy.name}</h3>
              <div class="chips">
                <span class="chip">HP ${enemy.maxHp}</span>
                <span class="chip">ATK ${enemy.atk}</span>
                <span class="chip">ARM ${enemy.armor}</span>
                <span class="chip">SPD ${enemy.speed.toFixed(2)}</span>
              </div>
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function gearUpgradeCost(gear) {
  return gear.level + 2;
}

function gearRow(gear, equipped = false, ownerId = null) {
  return `
    <div class="gear-row">
      <span class="gear-detail">${gear.name} Lv ${gear.level} | ${modText(gear.mods)}</span>
      <span class="gear-actions">
        <button data-action="upgradeGear" data-gear-id="${gear.id}" ${state.credits < gearUpgradeCost(gear) ? "disabled" : ""}>Upgrade ${gearUpgradeCost(gear)}</button>
        <button data-action="sellGear" data-gear-id="${gear.id}">Sell +${sellValue(gear.investedCredits)}C</button>
        ${equipped ? `<button data-action="unequipGear" data-id="${ownerId}" data-gear-id="${gear.id}">Unequip</button>` : ""}
      </span>
    </div>
  `;
}

function emptyShopCard(kind) {
  return `
    <article class="card shop-empty-card">
      <div class="empty-slot-art">EMPTY</div>
      <div>
        <h3>Sold Out</h3>
        <p class="meta">${kind} slot empty</p>
        <p class="lore">Reroll the shop or finish a battle to refill this slot.</p>
      </div>
    </article>
  `;
}

function shopUnitCard(unit, index) {
  if (!unit) return emptyShopCard("Recruit");
  return `
    <article class="card">
      ${portrait(spriteSrc("hero", unit.sprite), unit.name)}
      <div>
        <h3>${unit.name}</h3>
        <p class="meta">${unit.role} | ${unit.ability}</p>
        <p class="lore">${unit.lore}</p>
        <div class="chips"><span class="chip">${unit.trait}</span><span class="chip">Cost ${unit.cost}</span></div>
        <div class="row-actions"><button data-action="buyUnit" data-index="${index}" ${state.credits < unit.cost ? "disabled" : ""}>${state.squad.some((owned) => owned.template === unit.name) ? "Buy Duplicate Upgrade" : "Buy Unit"}</button></div>
      </div>
    </article>
  `;
}

function shopGearCard(gear, index) {
  if (!gear) return emptyShopCard("Gear");
  return `
    <article class="card">
      ${portrait(spriteSrc("gear", gear.icon), gear.name)}
      <div>
        <h3>${gear.name}</h3>
        <p class="meta">Lv 1 | ${modText(gear.mods)} | ${gear.trait}</p>
        <p class="lore">${gear.lore}</p>
        <div class="chips"><span class="chip">Cost ${gear.cost}</span></div>
        <div class="row-actions"><button data-action="buyGear" data-index="${index}" ${state.credits < gear.cost ? "disabled" : ""}>Buy Gear</button></div>
      </div>
    </article>
  `;
}

function renderPanel() {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === activeTab);
  });
  const root = document.getElementById("panelContent");
  const threatIntel = renderThreatIntel();
  if (activeTab === "shop") {
    root.innerHTML = `
      ${threatIntel}
      <div class="section-title"><span>Recruit</span><span>Active ${activeUnits().length}/${MAX_ACTIVE_UNITS} | Owned ${state.squad.length}</span></div>
      <div class="grid-list">
        ${state.shop.units.map(shopUnitCard).join("")}
      </div>
      <div class="section-title section-spaced"><span>Gear</span><span>Reroll 2 credits</span></div>
      <div class="grid-list">
        ${state.shop.gear.map(shopGearCard).join("")}
      </div>
    `;
  } else if (activeTab === "squad") {
    const bonuses = traitBonuses();
    root.innerHTML = `
      ${threatIntel}
      <div class="section-title"><span>Active Lineup</span><span>${bonuses.length ? bonuses.join(" | ") : "Front unit tanks, back units hit harder"}</span></div>
      <div class="grid-list">${activeUnits().length ? activeUnits().map(unitCard).join("") : `<p class="empty">Deploy at least one hero before battle.</p>`}</div>
      <div class="section-title section-spaced"><span>Bench</span><span>Owned reserves</span></div>
      <div class="grid-list">${benchUnits().length ? benchUnits().map(unitCard).join("") : `<p class="empty">Bench units stay owned, can be upgraded and outfitted, but do not battle.</p>`}</div>
    `;
  } else {
    root.innerHTML = `
      ${threatIntel}
      <div class="section-title"><span>Armory</span><span>${state.selectedGearId ? "Gear selected" : "Pick gear and hero"}</span></div>
      <div class="grid-list">
        ${state.gear.length ? state.gear.map((gear) => `
          <article class="card gear-card">
            ${portrait(spriteSrc("gear", gear.icon), gear.name)}
            <div>
              <h3>${gear.name}</h3>
              <p class="meta">Lv ${gear.level} | ${modText(gear.mods)} | ${gear.trait}</p>
              <p class="lore">${gear.lore}</p>
              <div class="row-actions">
                <button data-action="selectGear" data-id="${gear.id}">${state.selectedGearId === gear.id ? "Selected" : "Select"}</button>
                ${state.squad.map((unit) => `<button data-action="equipGearDirect" data-gear-id="${gear.id}" data-id="${unit.id}">Equip to ${unit.name}</button>`).join("")}
                <button data-action="upgradeGear" data-gear-id="${gear.id}" ${state.credits < gearUpgradeCost(gear) ? "disabled" : ""}>Upgrade ${gearUpgradeCost(gear)}</button>
                <button data-action="sellGear" data-gear-id="${gear.id}">Sell +${sellValue(gear.investedCredits)}C</button>
              </div>
            </div>
          </article>
        `).join("") : `<p class="empty">Buy gear, then equip it to any hero. Heroes can carry unlimited gear.</p>`}
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

function renderPage() {
  document.querySelectorAll("[data-page]").forEach((button) => {
    button.classList.toggle("active", button.dataset.page === activePage);
  });
  document.querySelector(".game-layout").hidden = activePage !== "battle";
  document.querySelector(".log-panel").hidden = activePage !== "battle";
  const info = document.getElementById("infoPage");
  info.hidden = activePage === "battle";
  if (activePage === "how") {
    info.innerHTML = `
      <article class="info-card">
        <h2>How to Play</h2>
        <div class="info-grid">
          <section><h3>1. Build</h3><p>Spend credits on heroes and gear. Buying a duplicate hero merges it into your owned copy as a free level upgrade.</p></section>
          <section><h3>2. Line Up</h3><p>Deploy up to 4 active heroes. The first active hero is the frontline and draws fire; the backline gets extra attack.</p></section>
          <section><h3>3. Bench</h3><p>Bench heroes stay owned. You can equip and upgrade them without using an active battle slot.</p></section>
          <section><h3>4. Upgrade</h3><p>Spend mutagens on hero upgrades and credits on gear upgrades. Gear slots are unlimited.</p></section>
          <section><h3>5. Sell</h3><p>Sell units, gear, or 2 mutagens when you need resources. Refunds are useful but lower than the full investment.</p></section>
          <section><h3>6. Scout</h3><p>Threat Intel shows the next enemy team, each enemy's stats, and whether your active lineup has the total stat advantage.</p></section>
          <section><h3>7. Perform</h3><p>Squad cards track each hero's KOs, falls, and K/D ratio. After each battle, earn a grade from knockouts, survivors, and remaining HP.</p></section>
          <section><h3>8. Win the Run</h3><p>Win by defeating all enemies. If every active hero falls, lose 1 health. Win 10 battles before health reaches 0.</p></section>
        </div>
      </article>
    `;
  } else if (activePage === "story") {
    info.innerHTML = `
      <article class="info-card">
        <h2>Story</h2>
        <p>Omega City was built around a prism reactor that turned courage into clean energy. When the supervillain army punched rifts through the skyline, every district became a battlefield.</p>
        <p>You command the last free war room above the city. Heroes, rescued prototypes, unstable mutagens, and reclaimed villain gear arrive between assaults. No two runs form the same team, and no plan survives unless you adapt.</p>
        <p>Win 10 battles to overload the invasion portals, scatter the Dread Marshal's army, and forge the ultimate superhero team before Omega City falls.</p>
      </article>
    `;
  }
}

function renderCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (arena.complete) ctx.drawImage(arena, 0, 0, 1024, 475, 0, 0, canvas.width, canvas.height);
  const grd = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grd.addColorStop(0, "rgba(8, 16, 48, 0.05)");
  grd.addColorStop(0.55, "rgba(32, 216, 255, 0.08)");
  grd.addColorStop(1, "rgba(255, 45, 130, 0.2)");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawHeaderText();
  if (state.battle && (state.mode === "battle" || state.resultBanner)) {
    state.battle.effects.forEach(drawEffect);
    [...state.battle.heroes, ...state.battle.enemies].forEach(drawFighter);
    state.battle.floaters.forEach(drawFloater);
  } else {
    drawPlanningPreview();
  }
  if (state.resultBanner) drawResultBanner(state.resultBanner);
}

function drawHeaderText() {
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.93)";
  ctx.strokeStyle = "#000";
  ctx.shadowColor = "rgba(0,0,0,0.55)";
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 3;
  ctx.lineWidth = 6;
  ctx.font = "900 42px system-ui";
  const title = state.runWon ? "OMEGA CITY SAVED" : state.runLost ? "OMEGA CITY FALLEN" : state.mode === "battle" ? "AUTO BATTLE" : "PREPARE THE TEAM";
  ctx.strokeText(title, 38, 66);
  ctx.fillText(title, 38, 66);
  ctx.font = "800 21px system-ui";
  ctx.lineWidth = 8;
  ctx.shadowBlur = 10;
  const subtitle = `${state.victories}/10 victories secured. Frontline draws fire; backline hits harder.`;
  ctx.strokeText(subtitle, 40, 98);
  ctx.fillText(subtitle, 40, 98);
  ctx.restore();
}

function drawPlanningPreview() {
  const previewHeroes = activeUnits().slice(0, MAX_ACTIVE_UNITS).map((unit, index) => {
    const stats = heroBattleStats(unit, index);
    return { ...stats, name: unit.name, sprite: unit.sprite, side: "hero", color: unit.color, x: 520 - index * 90, y: 475, baseY: 475, hp: stats.maxHp, maxHp: stats.maxHp, hitFlash: 0, attackFlash: 0 };
  });
  previewHeroes.forEach(drawFighter);
  const enemies = plannedEnemies().map((enemy, index) => ({ ...enemy, x: 760 + index * 105, y: 475, baseY: 475, hitFlash: 0, attackFlash: 0 }));
  enemies.forEach(drawFighter);
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 4;
  ctx.font = "900 22px system-ui";
  ctx.strokeText("Frontline -> Backline", 220, 620);
  ctx.fillText("Frontline -> Backline", 220, 620);
  ctx.strokeText(`Battle ${state.victories + 1} Threat`, 805, 620);
  ctx.fillText(`Battle ${state.victories + 1} Threat`, 805, 620);
  ctx.restore();
}

function drawFighter(unit) {
  const src = spriteSrc(unit.side === "enemy" ? "villain" : "hero", unit.sprite);
  const img = spriteCache.get(src);
  const scale = unit.side === "hero" ? 1 : -1;
  const w = unit.side === "hero" ? 150 : 140;
  const h = unit.side === "hero" ? 218 : 200;
  const pulse = unit.hitFlash > 0 ? 16 : 0;
  const lunge = unit.attackFlash > 0 ? (unit.side === "hero" ? 18 : -18) : 0;
  const defeated = unit.defeated || unit.hp <= 0;
  const fall = defeated ? 16 : 0;
  ctx.save();
  ctx.translate(unit.x + lunge, unit.y + fall);
  if (defeated) {
    ctx.globalAlpha = 0.46 + unit.defeatFlash * 0.18;
    ctx.rotate(unit.side === "hero" ? -0.08 : 0.08);
  }
  ctx.fillStyle = unit.side === "hero" ? "rgba(23,200,255,0.34)" : "rgba(255,63,142,0.34)";
  ctx.beginPath();
  ctx.ellipse(0, 72, 58 + pulse, 16 + pulse / 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = unit.color || "#fff";
  ctx.shadowBlur = 18 + pulse;
  ctx.scale(scale, 1);
  if (img?.complete) ctx.drawImage(img, -w / 2, -h / 2, w, h);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  drawHealth(unit.x - 45 + lunge, unit.y - 105, 90, unit.hp / unit.maxHp, unit.side);
  ctx.fillStyle = "rgba(255,255,255,0.98)";
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 4;
  ctx.font = "800 15px system-ui";
  ctx.textAlign = "center";
  ctx.strokeText(unit.name, unit.x + lunge, unit.y + 108, 112);
  ctx.fillText(unit.name, unit.x + lunge, unit.y + 108, 112);
  if (defeated) drawDefeatMarker(unit.x + lunge, unit.y - 28, unit.side, unit.color, unit.defeatFlash);
  ctx.restore();
}

function drawDefeatMarker(x, y, side, color, flash) {
  const badgeColor = side === "hero" ? "#28f0ff" : "#ff4b8b";
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.08);
  ctx.fillStyle = "rgba(10, 12, 28, 0.9)";
  ctx.strokeStyle = color || badgeColor;
  ctx.shadowColor = badgeColor;
  ctx.shadowBlur = 12 + flash * 18;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(-52, -18, 104, 36, 10);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "#000";
  ctx.fillStyle = "#fff";
  ctx.font = "900 24px system-ui";
  ctx.textAlign = "center";
  ctx.strokeText("DOWN", 0, 8);
  ctx.fillText("DOWN", 0, 8);
  ctx.strokeStyle = badgeColor;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(-36, 34);
  ctx.lineTo(36, 86);
  ctx.moveTo(36, 34);
  ctx.lineTo(-36, 86);
  ctx.stroke();
  ctx.restore();
}

function drawHealth(x, y, w, pct, side) {
  ctx.save();
  ctx.fillStyle = "rgba(17,19,38,0.72)";
  ctx.fillRect(x, y, w, 9);
  ctx.fillStyle = side === "hero" ? "#28f0ff" : "#ff4b8b";
  ctx.fillRect(x, y, Math.max(0, w * pct), 9);
  ctx.strokeStyle = "rgba(255,255,255,0.86)";
  ctx.strokeRect(x, y, w, 9);
  ctx.restore();
}

function drawEffect(effect) {
  const t = Math.max(0, effect.ttl / effect.max);
  const p = 1 - t;
  const x = effect.fromX + (effect.toX - effect.fromX) * p;
  const y = effect.fromY + (effect.toY - effect.fromY) * p;
  ctx.save();
  ctx.globalAlpha = Math.min(1, t * 1.8);
  ctx.strokeStyle = effect.color;
  ctx.fillStyle = effect.color;
  ctx.shadowColor = effect.color;
  ctx.shadowBlur = 20;
  ctx.lineWidth = 6;
  if (effect.type === "defeat") {
    const radius = 26 + p * 96;
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(effect.toX, effect.toY + 16, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 9;
    ctx.strokeStyle = effect.side === "hero" ? "#28f0ff" : "#ff4b8b";
    ctx.beginPath();
    ctx.moveTo(effect.toX - 42 - p * 18, effect.toY - 8 - p * 20);
    ctx.lineTo(effect.toX + 42 + p * 18, effect.toY + 62 + p * 20);
    ctx.moveTo(effect.toX + 42 + p * 18, effect.toY - 8 - p * 20);
    ctx.lineTo(effect.toX - 42 - p * 18, effect.toY + 62 + p * 20);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 5;
    ctx.font = "900 34px system-ui";
    ctx.textAlign = "center";
    ctx.strokeText("K.O.", effect.toX, effect.toY - 42);
    ctx.fillText("K.O.", effect.toX, effect.toY - 42);
  } else if (effect.type === "laser") {
    ctx.beginPath();
    ctx.moveTo(effect.fromX, effect.fromY);
    ctx.lineTo(effect.toX, effect.toY);
    ctx.stroke();
  } else if (effect.type === "dash") {
    for (let i = 0; i < 4; i += 1) {
      ctx.beginPath();
      ctx.moveTo(effect.fromX - i * 22, effect.fromY + i * 5);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  } else if (effect.type === "storm") {
    ctx.beginPath();
    ctx.moveTo(effect.fromX, effect.fromY);
    ctx.lineTo(x - 20, y - 35);
    ctx.lineTo(x + 24, y - 8);
    ctx.lineTo(effect.toX, effect.toY);
    ctx.stroke();
  } else if (effect.type === "shards") {
    for (let i = 0; i < 7; i += 1) {
      ctx.beginPath();
      ctx.arc(effect.toX + Math.cos(i) * p * 55, effect.toY + Math.sin(i * 2) * p * 42, 3 + p * 7, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (effect.type === "psy") {
    ctx.beginPath();
    ctx.arc(effect.toX, effect.toY, 18 + p * 58, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(effect.toX, effect.toY, 6 + p * 28, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.arc(effect.toX, effect.toY, 12 + p * 65, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 10; i += 1) {
      ctx.beginPath();
      ctx.moveTo(effect.toX, effect.toY);
      ctx.lineTo(effect.toX + Math.cos(i * 0.63) * (30 + p * 55), effect.toY + Math.sin(i * 0.63) * (30 + p * 55));
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawFloater(floater) {
  ctx.save();
  ctx.globalAlpha = Math.max(0, floater.ttl);
  ctx.fillStyle = floater.side === "hero" ? "#ff4b8b" : "#fff05b";
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 4;
  ctx.font = "900 28px system-ui";
  ctx.textAlign = "center";
  ctx.strokeText(floater.text, floater.x, floater.y);
  ctx.fillText(floater.text, floater.x, floater.y);
  ctx.restore();
}

function drawResultBanner(banner) {
  ctx.save();
  const grad = ctx.createLinearGradient(320, 220, 960, 415);
  if (banner.won) {
    grad.addColorStop(0, "rgba(255, 233, 95, 0.96)");
    grad.addColorStop(0.5, "rgba(23, 232, 255, 0.94)");
    grad.addColorStop(1, "rgba(126, 255, 112, 0.94)");
  } else {
    grad.addColorStop(0, "rgba(255, 63, 142, 0.96)");
    grad.addColorStop(1, "rgba(88, 30, 130, 0.94)");
  }
  ctx.fillStyle = grad;
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.roundRect(308, 226, 664, 196, 18);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#fff";
  ctx.font = "900 64px system-ui";
  ctx.textAlign = "center";
  ctx.strokeText(banner.text, 640, 302);
  ctx.fillText(banner.text, 640, 302);
  if (banner.performance) {
    const p = banner.performance;
    ctx.font = "900 42px system-ui";
    ctx.strokeText(`GRADE ${p.grade}`, 640, 352);
    ctx.fillText(`GRADE ${p.grade}`, 640, 352);
    ctx.font = "900 21px system-ui";
    ctx.strokeText(`+${p.rewards.credits} credits | +${p.rewards.mutagens} mutagens`, 640, 382);
    ctx.fillText(`+${p.rewards.credits} credits | +${p.rewards.mutagens} mutagens`, 640, 382);
    ctx.font = "900 17px system-ui";
    ctx.strokeText(`KO ${p.enemiesDefeated}/${p.totalEnemies} | Heroes ${p.heroesAlive}/${p.totalHeroes} | HP ${p.totalHealthRemaining}/${p.maxTeamHealth}`, 640, 407);
    ctx.fillText(`KO ${p.enemiesDefeated}/${p.totalEnemies} | Heroes ${p.heroesAlive}/${p.totalHeroes} | HP ${p.totalHealthRemaining}/${p.maxTeamHealth}`, 640, 407);
  } else {
    ctx.font = "900 22px system-ui";
    const detail = banner.won ? "Rewards earned" : "Health lost, regroup in the shop";
    ctx.strokeText(detail, 640, 370);
    ctx.fillText(detail, 640, 370);
  }
  ctx.restore();
}

function refreshFocusables() {
  const focusables = [...document.querySelectorAll("button:not(:disabled):not([hidden])")];
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
  renderPage();
  renderCanvas();
  refreshFocusables();
}

function handleAction(target) {
  const action = target.dataset.action;
  if (!action) return;
  ensureAudio();
  if (action === "startBattle") startBattle();
  if (action === "rerollShop") rerollShop(false);
  if (action === "sellMutagens") sellMutagens();
  if (action === "newRun") resetRun();
  if (action === "buyUnit") buyUnit(Number(target.dataset.index));
  if (action === "buyGear") buyGear(Number(target.dataset.index));
  if (action === "upgradeUnit") upgradeUnit(Number(target.dataset.id));
  if (action === "upgradeGear") upgradeGear(Number(target.dataset.gearId));
  if (action === "sellGear") sellGear(Number(target.dataset.gearId));
  if (action === "sellUnit") sellUnit(Number(target.dataset.id));
  if (action === "toggleBench") toggleBench(Number(target.dataset.id));
  if (action === "moveUnit") moveUnit(Number(target.dataset.id), Number(target.dataset.direction));
  if (action === "selectGear") selectGear(Number(target.dataset.id));
  if (action === "equipGear") equipGear(Number(target.dataset.id));
  if (action === "equipGearDirect") equipGear(Number(target.dataset.id), Number(target.dataset.gearId));
  if (action === "unequipGear") unequipGear(Number(target.dataset.id), Number(target.dataset.gearId));
}

document.addEventListener("click", (event) => {
  const pageButton = event.target.closest("[data-page]");
  if (pageButton) {
    activePage = pageButton.dataset.page;
    renderAll();
    return;
  }
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
    if ((pressed(0) && !gamepadLock.a)) {
      ensureAudio();
      refreshFocusables()[focusedIndex]?.click();
    }
    if ((pressed(2) && !gamepadLock.x)) {
      ensureAudio();
      rerollShop(false);
    }
    if ((pressed(3) && !gamepadLock.y)) {
      ensureAudio();
      startBattle();
    }
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
  const difficulty = adaptiveDifficulty();
  const battle = state.battle ? {
    status: state.battle.status,
    heroes: state.battle.heroes.map(({ name, hp, maxHp, atk, armor, x, y, defeated }) => ({ name, hp: Math.round(hp), maxHp, atk, armor, defeated: !!defeated, x: Math.round(x), y: Math.round(y) })),
    enemies: state.battle.enemies.map(({ name, hp, maxHp, atk, armor, x, y, defeated }) => ({ name, hp: Math.round(hp), maxHp, atk, armor, defeated: !!defeated, x: Math.round(x), y: Math.round(y) })),
    activeEffects: state.battle.effects.map(({ type, side }) => ({ type, side: side || null })),
  } : null;
  const unitSummary = (unit, index) => {
    const stats = unitBattleStats(unit);
    const record = combatRecord(unit);
    return {
      name: unit.name,
      level: unit.level,
      position: index + 1,
      formation: index === 0 ? "frontline" : index >= Math.max(1, activeUnits().length - 2) ? "backline" : "midline",
      trait: unit.trait,
      combatRecord: record,
      gearEffects: gearTotals(unit),
      battleStats: { hp: stats.maxHp, atk: stats.atk, armor: stats.armor, speed: Number(stats.speed.toFixed(2)) },
      gear: unit.gear.map((gear) => ({ id: gear.id, name: gear.name, level: gear.level, mods: gear.mods })),
    };
  };
  const comparison = teamComparison();
  return JSON.stringify({
    note: "Canvas coordinates use origin at top-left; x increases right, y increases down.",
    mode: state.mode,
    page: activePage,
    health: state.health,
    victories: state.victories,
    targetVictories: 10,
    stage: state.stage,
    credits: state.credits,
    mutagens: state.mutagens,
    lastBattleGrade: state.lastBattleGrade,
    adaptiveDifficulty: { ...difficulty },
    teamComparison: comparison,
    upcomingEnemies: plannedEnemies().map((enemy) => ({
      name: enemy.name,
      hp: enemy.maxHp,
      atk: enemy.atk,
      armor: enemy.armor,
      speed: Number(enemy.speed.toFixed(2)),
      power: statPower(enemy),
    })),
    activeLineup: activeUnits().map(unitSummary),
    bench: benchUnits().map((unit, index) => unitSummary(unit, index)),
    armory: state.gear.map((gear) => ({ name: gear.name, level: gear.level })),
    shop: {
      units: state.shop.units.map((unit) => unit?.name || null),
      gear: state.shop.gear.map((gear) => gear?.name || null),
    },
    selectedGear: gearById(state.selectedGearId)?.name || null,
    resultBanner: state.resultBanner?.text || null,
    battleGrade: state.resultBanner?.performance || null,
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

function init() {
  resetRun();
  requestAnimationFrame(loop);
}

if (arena.complete) init();
else arena.addEventListener("load", init, { once: true });
