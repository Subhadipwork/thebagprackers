// A mountain trail drawn in ink on paper (line-art-animation style): a small group of
// backpackers walks past a camp with a tent, a campfire and birds on the guy line.
//  - legs come from the gait solver, so boots stay planted; the group shares one travel
//    speed, each hiker with their own cadence and size
//  - trekking poles plant with the opposite foot and stay put while they bear weight
//  - bandanas stream on springs, smoke drifts; moving the pointer makes wind
//  - click a hiker: they stop and shade their eyes, wave, or point at the peaks
//  - click the fire: it flares and throws sparks · click the birds (or walk past): they flush
import { el, pen, shape, blot, paint, limb, shoe, place, inkDefs, run, joint, f, pt, PEN, type Vec } from '@/lib/line-art/ink';
import { gait } from '@/lib/line-art/gait';
import { spring, pointerWind, ease, clamp, wobble, seeded } from '@/lib/line-art/motion';
import { TRIP_EVENT, type TripDetail } from '@/lib/trip-events';

export interface HikerSceneOptions {
  /** Scene width in units; the backdrop stretches to fit (strokes don't). Default 480 (a 2:1 card). */
  width?: number;
  /** Scene height in units. Default 240. */
  height?: number;
  /** Size of a hiker of scale 1. Default 1.25. */
  scale?: number;
  /** Where the camp sits, as a fraction of the width. Default 0.8. */
  campAt?: number;
  /** Which corner the hint line sits in. Default right. */
  hintAlign?: 'left' | 'right';
}

const GREEN = '#3d6b52';    // brand forest, softened for flat fill
const ORANGE = '#e8892a';   // brand sunset, muted a touch
const GOLD = '#efb54a';     // brand gold
const LEAN = (5 * Math.PI) / 180; // a loaded pack tips the upper body forward
const DUTY = 0.62;

const lerpP = (a: Vec, b: Vec, t: number): Vec => { t = clamp(t, 0, 1); return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; };

// ---------------------------------------------------------------- hikers

type Hat = 'cap' | 'sun' | 'beanie';
type Gesture = 'shade' | 'wave' | 'point';
interface HikerSpec {
  x: number; yOff: number; size: number; period: number; phase: number;
  pack: string; accent: string; hat: Hat; pole: boolean; roll: boolean; gesture: Gesture;
}
interface Hiker { readonly x: number; cheer(): void; update(t: number, dt: number, wind: number): void }

function createHiker(layer: SVGGElement, spec: HikerSpec, sceneSpeed: number, ground: number, W: number): Hiker {
  const fig = el('g', { style: 'cursor:pointer' }, layer);
  el('title', {}, fig).textContent = 'Backpacker';
  el('rect', { x: 14, y: 16, width: 52, height: 106, fill: 'transparent' }, fig); // generous click target
  const pack = paint(fig, spec.pack);
  const packLines = pen(fig, PEN * 0.6);
  const roll = shape(fig, PEN * 0.9);
  const rollLines = pen(fig, PEN * 0.6);
  const bandana = paint(fig, spec.accent, PEN * 0.8);
  const farBack = el('g', {}, fig);   // far arm while walking (behind the body)
  const farArm = limb(farBack, 3.6);
  const legs = [limb(fig, 4.6), limb(fig, 4.6)];
  const boots = [blot(fig), blot(fig)];
  const neck = pen(fig);
  const shirt = shape(fig);
  const shirtLines = pen(fig, PEN * 0.6);
  const strap = pen(fig, PEN * 0.9);
  const head = el('ellipse', { rx: 3.8, ry: 4.7, fill: '#fdfdfc', class: 'pp', stroke: 'currentColor', 'stroke-width': PEN }, fig);
  const hair = blot(fig);
  const hatInk = blot(fig);
  const hatPaper = shape(fig);
  const hatBand = pen(fig, PEN * 0.9);
  const farFront = el('g', {}, fig);  // far arm while gesturing (in front)
  const pole = pen(fig, 1.1);
  const nearArm = limb(fig, 3.6);
  const grip = blot(fig);

  // every hiker covers the ground at the group's speed: stride follows from cadence and size
  const stride = (sceneSpeed / spec.size) * DUTY * spec.period;
  const walk = gait({ kind: 'walk', period: spec.period, stride, duty: DUTY });
  const farSwing = spring(60, 9);
  const tail = spring(30, 4);
  let phase = spec.phase, x = spec.x, gT = -1;
  fig.addEventListener('pointerdown', () => { if (gT < 0) gT = 0; });

  return {
    get x() { return x; },
    cheer() { if (gT < 0) gT = 0; },
    update(t, dt, wind) {
      let g = 0; // gesture weight: ease to a stop, hold, walk on
      if (gT >= 0) {
        gT += dt;
        g = gT < 0.5 ? ease(gT / 0.5) : gT < 2.9 ? 1 : 1 - ease((gT - 2.9) / 0.5);
        if (gT > 3.4) gT = -1;
      }
      const go = 1 - g;
      phase += (dt / walk.period) * go;
      x += walk.speed * spec.size * dt * go;
      if (x > W + 60) x -= W + 120;
      place(fig, x, ground + spec.yOff, 1, spec.size);

      const p = walk.pose(phase, go);
      const b = p.bob;
      const hp: Vec = [40, p.hip[1]];
      const c = Math.cos(LEAN), s = Math.sin(LEAN);
      // upper-body point given in the upright standing pose; rides on the hip (carrying the
      // gait's bob) and is tipped forward about it by LEAN
      const R = (ux: number, uy: number): Vec => { const dx = ux - hp[0], dy = uy + b - hp[1]; return [hp[0] + dx * c - dy * s, hp[1] + dx * s + dy * c]; };
      const q = (ux: number, uy: number) => pt(R(ux, uy));

      // legs and boots; the leading leg goes on top
      p.feet.forEach((fo, i) => { legs[i].draw([p.hip, fo.knee, fo.ankle], [0.3, 0.8]); shoe(boots[i], fo.ankle, fo.pitch); });
      fig.insertBefore(legs[p.front].g, neck);
      fig.insertBefore(boots[p.front], neck);

      // rucksack, with a sleeping-mat roll on top for some
      pack.setAttribute('d', `M${q(35, 39)} Q${q(28, 36)} ${q(23.5, 40.5)} Q${q(20, 56)} ${q(22.4, 71)} Q${q(24.5, 75.5)} ${q(31, 75)} L${q(35.5, 74)}Z`);
      packLines.setAttribute('d', `M${q(23.4, 44.5)} Q${q(29, 47)} ${q(35, 45.5)} M${q(22.6, 58)} Q${q(27, 57)} ${q(29, 59)} L${q(28.6, 68)} Q${q(25, 70)} ${q(22.6, 68.5)}`);
      if (spec.roll) {
        roll.setAttribute('d', `M${q(22, 32.4)} L${q(35.6, 32.4)} Q${q(37.4, 35.4)} ${q(35.6, 38.4)} L${q(22, 38.4)} Q${q(20.2, 35.4)} ${q(22, 32.4)}Z`);
        rollLines.setAttribute('d', `M${q(22, 32.4)} Q${q(23.8, 35.4)} ${q(22, 38.4)} M${q(26, 32.4)} L${q(26, 38.4)} M${q(32, 32.4)} L${q(32, 38.4)}`);
      }

      // bandana tied to the pack, streaming back on a spring
      const A = R(22.8, 41);
      const flow = tail.step(-5 - walk.speed * 0.06 * go - wind * 5 + Math.sin(t * 8 + spec.phase * 6) * 0.7, dt);
      bandana.setAttribute('d', `M${pt(A)} Q${f(A[0] - 3 + flow * 0.4)} ${f(A[1] + 2)} ${f(A[0] - 2 + flow)} ${f(A[1] + 8 + flow * 0.15)} L${f(A[0] + 0.6 + flow * 0.8)} ${f(A[1] + 7.2 + flow * 0.15)} Q${f(A[0] - 0.4)} ${f(A[1] + 3)} ${f(A[0] + 1.2)} ${f(A[1] + 1.4)}Z`);

      // shirt, strap and hip belt
      const hc = R(42.4, 33.6);
      const H_ = (dx: number, dy: number) => pt([hc[0] + dx, hc[1] + dy]);
      neck.setAttribute('d', `M${H_(-1.5, 4.3)} L${H_(-1.3, 6.6)} M${H_(1.4, 4.3)} L${H_(1.8, 6.4)}`);
      shirt.setAttribute('d', `M${q(34.4, 42.6)} Q${q(39.4, 39.8)} ${q(45.6, 42.2)} Q${q(47.4, 50)} ${q(46.6, 58)} Q${q(46.2, 68)} ${q(47.8, 76.4)} Q${q(40.2, 78.6)} ${q(32.4, 76.2)} Q${q(33.8, 66)} ${q(33.2, 56)} Q${q(32.8, 47)} ${q(34.4, 42.6)}Z`);
      shirtLines.setAttribute('d', `M${q(43.8, 44.4)} Q${q(44.6, 60)} ${q(44.4, 76.6)} M${q(40.8, 50)} L${q(44.4, 50)} L${q(44.4, 55)} Q${q(42.6, 55.8)} ${q(40.8, 55)}`);
      strap.setAttribute('d', `M${q(35.6, 41.5)} Q${q(41, 39.2)} ${q(44.6, 43.6)} Q${q(46, 52)} ${q(45, 61)} M${q(33, 72.4)} Q${q(40, 74)} ${q(47.4, 72.4)}`);

      // head, hair and hat — the hat is most of who each person is
      head.setAttribute('cx', f(hc[0])); head.setAttribute('cy', f(hc[1]));
      if (spec.hat === 'cap') {
        hair.setAttribute('d', `M${H_(-3.4, -1)} Q${H_(-4.9, 2.6)} ${H_(-2.4, 4.4)} Q${H_(-1.6, 1.6)} ${H_(-0.4, -1)}Z`);
        hatInk.setAttribute('d', `M${H_(-3.9, -1.2)} Q${H_(-4.2, -6.8)} ${H_(0.2, -7.2)} Q${H_(4.2, -7)} ${H_(4.3, -2.6)} L${H_(9.4, -2.2)} Q${H_(9.2, -0.8)} ${H_(4, -1)} L${H_(-3.9, -1.2)}Z`);
      } else if (spec.hat === 'sun') {
        // ponytail swings a little with the step
        const sw = Math.sin(phase * Math.PI * 4) * 0.8 * go;
        hair.setAttribute('d', `M${H_(-3.2, -0.4)} Q${H_(-7 + sw, 2.6)} ${H_(-6.2 + sw, 8.4)} Q${H_(-4.2 + sw * 0.5, 5)} ${H_(-1.4, 1.6)}Z`);
        hatPaper.setAttribute('d', `M${H_(-9.2, -1.4)} Q${H_(-4.6, -2.6)} ${H_(-3.8, -3.6)} Q${H_(-3.6, -8.4)} ${H_(0.4, -8.6)} Q${H_(4.2, -8.4)} ${H_(4.4, -3.6)} Q${H_(5.2, -2.6)} ${H_(9.6, -1.6)} Q${H_(0.4, -1.2)} ${H_(-9.2, -1.4)}Z`);
        hatBand.setAttribute('d', `M${H_(-3.8, -3.8)} Q${H_(0.4, -2.6)} ${H_(4.4, -3.8)}`);
      } else {
        hair.setAttribute('d', `M${H_(-3.6, -0.6)} Q${H_(-4.6, 2.2)} ${H_(-3, 3.4)} Q${H_(-2.4, 1.4)} ${H_(-1.2, -0.6)}Z`);
        hatInk.setAttribute('d', `M${H_(-4.1, -0.4)} Q${H_(-4.8, -7.4)} ${H_(0.2, -7.8)} Q${H_(4.9, -7.4)} ${H_(4.3, -0.6)} Q${H_(0, -1.6)} ${H_(-4.1, -0.4)}Z M${H_(-1.4, -8.6)} a1.5 1.5 0 1 0 3 0 a1.5 1.5 0 1 0 -3 0Z`);
        hatBand.setAttribute('d', `M${H_(-4.2, -2.2)} Q${H_(0.2, -3.4)} ${H_(4.6, -2.4)}`);
        hatBand.setAttribute('stroke', '#fdfdfc');
      }

      const shN = R(42.4, 44.6);
      const f0 = p.feet[0];
      if (spec.pole) {
        // trekking pole: tip planted with the opposite foot, so it stays put while it bears weight
        const tip: Vec = [40 + (f0.ankle[0] - 40) * 1.35 + 11, 120 - Math.max(0, 118.4 - f0.ankle[1]) * 0.9];
        const toSh: Vec = [shN[0] - tip[0], shN[1] - tip[1]];
        const L = Math.hypot(toSh[0], toSh[1]);
        const gp: Vec = [tip[0] + (toSh[0] / L) * 60, tip[1] + (toSh[1] / L) * 60];
        const top: Vec = [tip[0] + (toSh[0] / L) * 64, tip[1] + (toSh[1] / L) * 64];
        pole.setAttribute('d', `M${pt(tip)} L${pt(top)} M${f(tip[0] - 1.8)} ${f(tip[1] - 5)} L${f(tip[0] + 1.8)} ${f(tip[1] - 5.4)}`);
        nearArm.draw([shN, joint(shN, gp, 16, 15, -1), gp], [0.2, 0.4]);
        grip.setAttribute('d', `M${f(gp[0] - 1.6)} ${f(gp[1] - 2.2)} Q${f(gp[0] + 2)} ${f(gp[1] - 2.6)} ${f(gp[0] + 1.8)} ${f(gp[1] + 0.4)} Q${f(gp[0] + 1.6)} ${f(gp[1] + 2.6)} ${f(gp[0] - 1.4)} ${f(gp[1] + 2.2)} Q${f(gp[0] - 2.6)} ${f(gp[1])} ${f(gp[0] - 1.6)} ${f(gp[1] - 2.2)}Z`);
      } else {
        // thumb hooked in the shoulder strap
        const hand = R(45.8, 54);
        nearArm.draw([shN, joint(shN, hand, 16, 15, -1), hand], [0.2, 0.4]);
      }

      // far arm: swings opposite the legs; gestures bring it up in front
      const legSwing = (f0.ankle[0] - 40) / (walk.stride / 2);
      const a = (farSwing.step(-legSwing * 16 * go, dt) * Math.PI) / 180;
      const shF = R(39, 44);
      const elbS: Vec = [shF[0] + 16 * Math.sin(a), shF[1] + 16 * Math.cos(a)];
      const handS: Vec = [elbS[0] + 15 * Math.sin(a + 0.3), elbS[1] + 15 * Math.cos(a + 0.3)];
      let target: Vec;
      if (spec.gesture === 'shade') target = [hc[0] + 3.4, hc[1] - 2.2];
      else if (spec.gesture === 'wave') target = [hc[0] + 4 + 3 * Math.sin(gT * 10) * g, hc[1] - 15];
      else target = [shF[0] + 27, shF[1] - 10];
      const hand = lerpP(handS, target, g);
      const elb = g > 0.01 ? lerpP(elbS, joint(shF, target, 16, 15, 1), g) : elbS;
      farArm.draw([shF, elb, hand], [0.2, 0.5]);
      const slot = g > 0.25 ? farFront : farBack;
      if (farArm.g.parentNode !== slot) slot.appendChild(farArm.g);
    },
  };
}

// ---------------------------------------------------------------- birds

interface Bird { update(t: number, dt: number): void; flush(delay: number): void; readonly home: boolean }

function createBird(layer: SVGGElement, home: Vec, dir: 1 | -1, rnd: (a?: number, b?: number) => number): Bird {
  const g = el('g', {}, layer);
  const perch = el('g', {}, g);
  shape(perch, 0.8).setAttribute('d', 'M-4 -3 Q-1 -6.6 3 -5.2 Q5.2 -4.2 4.6 -2.6 Q2 -0.4 -2 -1.2 Q-4.4 -1.6 -4 -3Z');
  blot(perch).setAttribute('d', 'M1.8 -5.6 a1.5 1.5 0 1 0 3 0 a1.5 1.5 0 1 0 -3 0Z');
  pen(perch, 0.7).setAttribute('d', 'M5 -5 L6.8 -4.5 M-4 -2.6 L-7.4 -1.2 M0 -1 L0 0.2 M1.6 -1 L1.8 0.2');
  const fly = el('g', { display: 'none' }, g);
  shape(fly, 0.8).setAttribute('d', 'M-4 -1 Q0 -3.2 4.6 -1.6 Q2 0.6 -4 -1Z');
  blot(fly).setAttribute('d', 'M3 -2.6 a1.3 1.3 0 1 0 2.6 0 a1.3 1.3 0 1 0 -2.6 0Z');
  const wingA = pen(fly, 0.8), wingB = pen(fly, 0.7);
  wingB.setAttribute('opacity', '0.5');

  let state: 'perch' | 'out' | 'away' | 'in' = 'perch', st = 0, wait = 0, peckAt = rnd(1, 4), peck = 0;
  const away: Vec = [home[0] - dir * rnd(220, 320), home[1] - rnd(110, 150)];
  const ctrl: Vec = [home[0] - dir * 40, home[1] - 70];
  const along = (u: number): Vec => {
    const v = 1 - u;
    return [v * v * home[0] + 2 * v * u * ctrl[0] + u * u * away[0], v * v * home[1] + 2 * v * u * ctrl[1] + u * u * away[1]];
  };
  return {
    get home() { return state === 'perch'; },
    flush(delay) { if (state === 'perch') { state = 'out'; st = -delay; } },
    update(t, dt) {
      st += dt;
      if (state === 'perch') {
        // idle: a quick peck now and then
        peckAt -= dt;
        if (peckAt < 0) { peck = 0.35; peckAt = rnd(1.2, 4); }
        peck = Math.max(0, peck - dt);
        g.setAttribute('transform', `translate(${f(home[0])} ${f(home[1])}) scale(${dir} 1) rotate(${f(peck > 0 ? 18 * Math.sin((peck / 0.35) * Math.PI) : 0)})`);
        perch.setAttribute('display', 'inline'); fly.setAttribute('display', 'none');
        return;
      }
      if (state === 'out' && st < 0) return; // staggered take-off
      perch.setAttribute('display', 'none'); fly.setAttribute('display', 'inline');
      const flap = Math.sin(t * 22 + home[0]);
      wingA.setAttribute('d', `M0 -1.6 Q-2.4 ${f(-4 - 5 * flap)} -5.6 ${f(-2 - 8 * flap)}`);
      wingB.setAttribute('d', `M1 -1.6 Q-1 ${f(-4 - 4 * flap)} -3.4 ${f(-2 - 6.5 * flap)}`);
      let pos: Vec = away, heading = -dir;
      if (state === 'out') { const u = ease(clamp(st / 2.2, 0, 1)); pos = along(u); if (st > 2.2) { state = 'away'; wait = rnd(6, 10); st = 0; } }
      else if (state === 'away') { if (st > wait) { state = 'in'; st = 0; } }
      else { const u = 1 - ease(clamp(st / 2.8, 0, 1)); pos = along(u); heading = dir; if (st > 2.8) { state = 'perch'; st = 0; } }
      g.setAttribute('transform', `translate(${f(pos[0])} ${f(pos[1])}) scale(${heading} 1)`);
    },
  };
}

// ---------------------------------------------------------------- scene

export function mountHikerScene(host: HTMLElement, opts: HikerSceneOptions = {}): () => void {
  const W = opts.width ?? 480, H = opts.height ?? 240, SIZE = opts.scale ?? 1.25;
  const GROUND = H - 44;
  const rnd = seeded(23);
  const id = `hk${Math.floor(Math.random() * 1e6)}`;

  const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': 'Line drawing of backpackers walking a mountain trail past a tent and a campfire' });
  svg.style.display = 'block';
  svg.style.width = '100%';
  svg.style.height = '100%';
  const { filter } = inkDefs(svg, id);
  host.appendChild(svg);
  const scene = el('g', { filter }, svg);

  // --- backdrop: far range in diluted ink, a nearer ridge (drawn for 480 × 240, stretched with
  // non-scaling strokes), pines drawn in scene space so they keep their shape
  const backdrop = el('g', { transform: `translate(0 ${H - 240}) scale(${W / 480} 1)` }, scene);
  const far = el('g', { opacity: 0.38 }, backdrop);
  pen(far, 0.8).setAttribute('d', 'M0 128 Q28 116 54 120 Q82 124 104 104 Q124 86 146 72 Q158 64 170 74 Q190 92 214 100 Q240 108 262 94 Q288 74 310 57 Q320 50 331 61 Q354 84 382 92 Q410 100 436 87 Q458 77 480 82');
  pen(far, 0.6).setAttribute('d', 'M299 67 L304 72 L309 67 L314 73 L319 68 L324 72 M139 79 L144 83 L149 78 L154 82');
  const near = el('g', { opacity: 0.6 }, backdrop);
  pen(near, 0.85).setAttribute('d', 'M0 164 Q36 150 70 154 Q104 158 128 146 Q152 134 178 140 Q204 146 226 158 M318 160 Q350 140 384 136 Q418 132 446 144 Q466 152 480 150');
  backdrop.querySelectorAll('path').forEach((n) => n.setAttribute('vector-effect', 'non-scaling-stroke'));
  const trees = el('g', { opacity: 0.6 }, scene);
  const pine = (cx: number, cbase: number, h: number) => {
    const x = (cx * W) / 480, base = cbase + H - 240;
    const g = el('g', {}, trees);
    pen(g, 0.75).setAttribute('d', `M${x} ${base} L${x} ${base - h}`);
    let d = '';
    for (let i = 0; i < 5; i++) {
      const y = base - h * 0.22 - (h * 0.78 * i) / 5, w = (h * 0.34 * (5 - i)) / 5;
      d += `M${f(x - w)} ${f(y + 2)} Q${f(x - w * 0.4)} ${f(y - 1)} ${x} ${f(y - h * 0.16)} Q${f(x + w * 0.4)} ${f(y - 1)} ${f(x + w)} ${f(y + 2)} `;
    }
    pen(g, 0.75).setAttribute('d', d);
  };
  pine(58, 158, 28); pine(214, 154, 22);

  // --- camp, set back from the trail: tent with birds on its guy line, campfire with smoke
  const camp = el('g', {}, scene);
  const tx = clamp(W * (opts.campAt ?? 0.8), 110, W - 60), tb = GROUND - 9;
  pen(camp, 0.5).setAttribute('d', `M${tx} ${tb - 31} L${tx - 46} ${tb + 2} M${tx} ${tb - 31} L${tx + 46} ${tb + 2} M${tx - 47} ${tb - 1} l2 4 M${tx + 45} ${tb - 1} l2 4`);
  paint(camp, ORANGE, 0.95).setAttribute('d', `M${tx - 30} ${tb} Q${tx - 15} ${tb - 16} ${tx} ${tb - 31} Q${tx + 15} ${tb - 16} ${tx + 30} ${tb} Q${tx} ${tb + 1.4} ${tx - 30} ${tb}Z`);
  blot(camp).setAttribute('d', `M${tx} ${tb - 26} Q${tx - 3} ${tb - 12} ${tx - 8} ${tb} L${tx + 7} ${tb} Q${tx + 3} ${tb - 12} ${tx} ${tb - 26}Z`);
  shape(camp, 0.8).setAttribute('d', `M${tx} ${tb - 26} Q${tx - 4} ${tb - 13} ${tx - 8} ${tb} L${tx - 15} ${tb} Q${tx - 9} ${tb - 12} ${tx} ${tb - 26}Z`);
  pen(camp, 0.9).setAttribute('d', `M${tx} ${tb - 31} L${tx} ${tb - 35}`);
  pen(camp, 0.5).setAttribute('d', `M${tx - 28} ${tb - 1.6} Q${tx - 14} ${tb - 16} ${tx - 1} ${tb - 29}`);

  const fx = tx - 60, fb = GROUND - 7;
  shape(camp, 0.7).setAttribute('d', [[-13, 0, 2.6], [-7, 1.4, 2.2], [0, 1.8, 2.4], [7, 1.4, 2.2], [13, 0, 2.6]].map(([dx, dy, r]) =>
    `M${f(fx + dx - r)} ${f(fb + dy)} Q${f(fx + dx - r)} ${f(fb + dy - r * 1.3)} ${f(fx + dx)} ${f(fb + dy - r * 1.3)} Q${f(fx + dx + r)} ${f(fb + dy - r * 1.3)} ${f(fx + dx + r)} ${f(fb + dy)} Z`).join(' '));
  const flameOut = paint(camp, ORANGE, 0.8);
  const flameIn = paint(camp, GOLD, 0.6);
  shape(camp, 0.8).setAttribute('d', `M${fx - 11} ${fb - 1} L${fx + 8} ${fb - 7} L${fx + 9.4} ${fb - 4.2} L${fx - 9.6} ${fb + 1.6}Z`);
  shape(camp, 0.8).setAttribute('d', `M${fx + 11} ${fb - 1} L${fx - 8} ${fb - 7} L${fx - 9.4} ${fb - 4.2} L${fx + 9.6} ${fb + 1.6}Z`);
  const smoke = Array.from({ length: 6 }, (_, i) => ({ node: pen(camp, 0.6), age: (i / 6) * 4.2 }));
  const sparks = Array.from({ length: 10 }, () => ({ node: blot(camp), p: [0, 0] as Vec, v: [0, 0] as Vec, life: 0 }));
  let flare = 0;
  const fireHit = el('rect', { x: fx - 16, y: fb - 30, width: 32, height: 34, fill: 'transparent', style: 'cursor:pointer' }, camp);
  el('title', {}, fireHit).textContent = 'Campfire';
  fireHit.addEventListener('pointerdown', () => {
    flare = 1;
    sparks.forEach((sp) => { sp.p = [fx + rnd(-4, 4), fb - 8]; sp.v = [rnd(-14, 14), rnd(-46, -24)]; sp.life = rnd(0.8, 1.4); });
  });

  // birds sitting along the right-hand guy line
  const birdLayer = el('g', {}, scene);
  const onLine = (u: number): Vec => [tx + 46 * u, tb - 31 + 33 * u - 0.6];
  const birds = [onLine(0.3), onLine(0.52), onLine(0.74)].map((h, i) => createBird(birdLayer, h, i === 1 ? 1 : -1, rnd));
  const birdHit = el('rect', { x: tx + 4, y: tb - 34, width: 40, height: 30, fill: 'transparent', style: 'cursor:pointer' }, scene);
  el('title', {}, birdHit).textContent = 'Birds';
  const flushAll = () => birds.forEach((b, i) => b.flush(i * 0.18));
  birdHit.addEventListener('pointerdown', flushAll);

  // --- the trail
  pen(scene, 0.95).setAttribute('d', `M0 ${GROUND + 1} Q${W * 0.25} ${GROUND - 1} ${W * 0.5} ${GROUND} Q${W * 0.75} ${GROUND + 1} ${W} ${GROUND - 1}`);
  pen(scene, 0.6).setAttribute('d', `M0 ${GROUND + 13} Q${W * 0.29} ${GROUND + 11} ${W * 0.54} ${GROUND + 14} Q${W * 0.79} ${GROUND + 16} ${W} ${GROUND + 13}`);
  let tufts = '';
  for (let x = 14; x < W; x += 47) tufts += `M${x} ${GROUND + 1} q1 -5 3 -7 M${x + 3} ${GROUND + 1} q0.5 -4 -1 -6 M${x + 5} ${GROUND + 1} q2 -3 4 -4 `;
  pen(scene, 0.55).setAttribute('d', tufts);
  for (const [cx, cy, r] of [[70, 8, 1.6], [168, 10, 1.1], [301, 7, 1.4], [392, 11, 1.0], [446, 8, 1.7]]) {
    const px = (cx * W) / 480, py = GROUND + cy;
    shape(scene, 0.55).setAttribute('d', `M${px - r * 1.4} ${py} Q${px - r} ${py - r} ${px} ${py - r} Q${px + r * 1.4} ${py - r * 0.8} ${px + r * 1.4} ${py} Z`);
  }

  // --- the group: shared travel speed; back to front by depth
  const walkers = el('g', {}, scene);
  const speed = 33 * SIZE; // scene units per second for the whole group
  const x0 = W * 0.08;
  const specs: HikerSpec[] = [
    { x: x0 + 118, yOff: -3, size: SIZE * 0.92, period: 1.14, phase: 0.71, pack: '#2f4f3e', accent: GOLD, hat: 'beanie', pole: true, roll: true, gesture: 'point' },
    { x: x0 + 60, yOff: 0, size: SIZE, period: 1.08, phase: 0.0, pack: GREEN, accent: ORANGE, hat: 'cap', pole: true, roll: true, gesture: 'shade' },
    { x: x0, yOff: 4, size: SIZE * 0.95, period: 0.98, phase: 0.37, pack: ORANGE, accent: GREEN, hat: 'sun', pole: false, roll: false, gesture: 'wave' },
  ];
  const hikers = specs.map((s) => createHiker(walkers, s, speed, GROUND, W));

  // faint hint, outside the ink filter so the type stays crisp
  const hintLeft = opts.hintAlign === 'left';
  const hint = el('text', { x: hintLeft ? 10 : W - 10, y: H - 10, 'text-anchor': hintLeft ? 'start' : 'end', 'font-size': W < 700 ? 13 : 10, fill: 'currentColor', opacity: 0.45 }, svg);
  hint.textContent = 'tap the hikers, the campfire or the birds';

  // the enquiry form drives the camp: the fire grows as the trip takes shape, hikers cheer
  let fireBase = 0.7, nextCheer = 0;
  const onTrip = (e: Event) => {
    const d = (e as CustomEvent<TripDetail>).detail;
    fireBase = 0.7 + 0.6 * clamp(d.progress, 0, 1);
    if (d.cheer === 'one') hikers[nextCheer++ % hikers.length].cheer();
    if (d.cheer === 'all') { hikers.forEach((h) => h.cheer()); flare = 1; flushAll(); }
  };
  window.addEventListener(TRIP_EVENT, onTrip);

  const wind = pointerWind(svg, 0.25);
  let visible = true;
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
  io.observe(svg);

  const stop = run((t, dt) => {
    if (!visible) return;
    const w = wind.step(t);
    hikers.forEach((h) => h.update(t, dt, w));

    // birds flush when a hiker walks right under the guy line
    if (birds.every((b) => b.home) && hikers.some((h) => Math.abs(h.x - (tx + 20)) < 14)) flushAll();
    birds.forEach((b) => b.update(t, dt));

    // fire: flicker, lean with the wind, flare when clicked
    flare = Math.max(0, flare - dt * 0.7);
    const k = fireBase + flare * 0.8;
    const lean = w * 2.2 + wobble(t * 1.7) * 1.4;
    const tongue = (node: SVGPathElement, wd: number, h: number) => {
      const top = fb - 4 - h, sx = fx + lean * (h / 14);
      node.setAttribute('d', `M${f(fx - wd)} ${f(fb - 4)} Q${f(fx - wd * 1.15)} ${f(fb - 4 - h * 0.55)} ${f(sx)} ${f(top)} Q${f(fx + wd * 1.15)} ${f(fb - 4 - h * 0.55)} ${f(fx + wd)} ${f(fb - 4)} Q${f(fx)} ${f(fb - 2.6)} ${f(fx - wd)} ${f(fb - 4)}Z`);
    };
    tongue(flameOut, 6 * Math.sqrt(k), 14 * k * (0.86 + 0.14 * wobble(t * 3.1, 1.3)));
    tongue(flameIn, 3.2 * Math.sqrt(k), 8 * k * (0.84 + 0.16 * wobble(t * 4.3 + 2, 1.1)));
    // smoke puffs rise, grow, drift downwind and fade
    for (const pf of smoke) {
      pf.age += dt;
      if (pf.age > 4.2) pf.age -= 4.2;
      const a = pf.age, r = 1.6 + a * 1.3;
      const sx = fx + a * (1.5 + w * 6) + Math.sin(a * 2) * 1.2, sy = fb - 22 - a * 10;
      pf.node.setAttribute('d', `M${f(sx - r)} ${f(sy)} a${f(r)} ${f(r * 0.85)} 0 1 0 ${f(r * 2)} 0 a${f(r)} ${f(r * 0.85)} 0 1 0 ${f(-r * 2)} 0`);
      pf.node.setAttribute('opacity', f(Math.min(1, a * 2) * (1 - a / 4.2) * 0.55));
    }
    for (const sp of sparks) {
      if (sp.life <= 0) { sp.node.setAttribute('d', ''); continue; }
      sp.life -= dt;
      sp.v[1] += 30 * dt;
      sp.p = [sp.p[0] + (sp.v[0] + w * 8) * dt, sp.p[1] + sp.v[1] * dt];
      sp.node.setAttribute('d', `M${f(sp.p[0] - 0.7)} ${f(sp.p[1])} a0.7 0.7 0 1 0 1.4 0 a0.7 0.7 0 1 0 -1.4 0`);
    }
  });

  return () => {
    stop();
    io.disconnect();
    window.removeEventListener(TRIP_EVENT, onTrip);
    svg.remove();
  };
}
