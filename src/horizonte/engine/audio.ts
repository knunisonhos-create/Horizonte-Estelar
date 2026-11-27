import type { WeaponDamageType } from '../types/game';

export type MusicMode = 'none' | 'space' | 'orbit' | 'event' | 'combat';

const SPACE_CHORDS: number[][] = [
  [130.81, 196.0, 246.94, 293.66], // Cmaj9
  [110.0, 164.81, 220.0, 246.94],  // Am9
  [87.31, 130.81, 164.81, 220.0],  // Fmaj7
  [98.0, 146.83, 196.0, 246.94],   // G6
];

const SPACE_BELL_NOTES = [523.25, 659.25, 783.99, 987.77, 587.33];

const ORBIT_CHORDS: number[][] = [
  [164.81, 246.94, 293.66, 369.99], // Em9
  [146.83, 220.0, 293.66, 329.63],  // Dsus2
  [130.81, 196.0, 246.94, 329.63],  // Cmaj7
  [123.47, 185.0, 246.94, 329.63],  // Bsus4
];

const ORBIT_ARP_PATTERNS: number[][] = [
  [329.63, 493.88, 587.33, 739.99],
  [293.66, 440.0, 587.33, 659.25],
  [261.63, 392.0, 493.88, 659.25],
  [246.94, 369.99, 493.88, 659.25],
];

const EVENT_CHORDS: number[][] = [
  [65.41, 130.81, 155.56, 196.0],  // Cm dark drone
  [65.41, 138.59, 185.0, 246.94],  // C + b2 + tritone tension
  [58.27, 116.54, 155.56, 207.65], // Bbm tension
  [61.74, 123.47, 174.61, 233.08], // B dim/suspense
];

const EVENT_TENSION_NOTES = [311.13, 369.99, 493.88, 277.18, 466.16];

// Epic D-minor space-opera progression: Dm -> Bb -> C -> A
const COMBAT_CHORDS: number[][] = [
  [73.42, 146.83, 220.0, 293.66, 349.23],  // Dm power
  [58.27, 116.54, 174.61, 233.08, 293.66], // Bb heroic lift
  [65.41, 130.81, 196.0, 261.63, 329.63],  // C soaring
  [55.0, 110.0, 164.81, 220.0, 277.18],    // A dramatic dominant push
];

// Soaring brass/lead phrases aligned per 2-step chord bar
const COMBAT_LEAD_MOTIFS: Array<Array<{ freq: number; delay: number; hold: number; release: number }>> = [
  [
    { freq: 587.33, delay: 0.0, hold: 0.25, release: 0.45 },   // D5
    { freq: 698.46, delay: 0.475, hold: 0.22, release: 0.45 }, // F5
  ],
  [
    { freq: 659.25, delay: 0.0, hold: 0.16, release: 0.35 },   // E5
    { freq: 587.33, delay: 0.24, hold: 0.14, release: 0.32 },  // D5
    { freq: 440.0, delay: 0.475, hold: 0.32, release: 0.5 },   // A4
  ],
  [
    { freq: 466.16, delay: 0.0, hold: 0.28, release: 0.48 },   // Bb4
    { freq: 587.33, delay: 0.475, hold: 0.24, release: 0.45 }, // D5
  ],
  [
    { freq: 523.25, delay: 0.0, hold: 0.18, release: 0.36 },   // C5
    { freq: 466.16, delay: 0.24, hold: 0.16, release: 0.34 },  // Bb4
    { freq: 440.0, delay: 0.475, hold: 0.34, release: 0.55 },  // A4
  ],
  [
    { freq: 523.25, delay: 0.0, hold: 0.26, release: 0.48 },   // C5
    { freq: 659.25, delay: 0.475, hold: 0.26, release: 0.48 }, // E5
  ],
  [
    { freq: 783.99, delay: 0.0, hold: 0.2, release: 0.4 },    // G5
    { freq: 659.25, delay: 0.475, hold: 0.28, release: 0.5 },  // E5
  ],
  [
    { freq: 554.37, delay: 0.0, hold: 0.28, release: 0.48 },   // C#5
    { freq: 659.25, delay: 0.475, hold: 0.28, release: 0.48 }, // E5
  ],
  [
    { freq: 880.0, delay: 0.0, hold: 0.38, release: 0.65 },    // A5 heroic climax
  ],
];

class SoundEngine {
  private ctx: AudioContext | null = null;
  private _muted = false;

  private musicMasterGain: GainNode | null = null;
  private musicDuckGain: GainNode | null = null;
  private musicReverbInput: GainNode | null = null;
  private trackGains: Record<'space' | 'orbit' | 'event' | 'combat', GainNode | null> = {
    space: null,
    orbit: null,
    event: null,
    combat: null,
  };

  private desiredMode: MusicMode = 'none';
  private musicDucked = false;
  private schedulerTimer: number | null = null;
  private stepCount = 0;
  private unlockBound = false;

  get muted(): boolean {
    return this._muted;
  }

  set muted(val: boolean) {
    this._muted = val;
    this.syncMasterMute();
  }

  setMuted(val: boolean) {
    this.muted = val;
  }

  private bindUnlockListener() {
    if (this.unlockBound || typeof window === 'undefined') return;
    this.unlockBound = true;
    const unlock = () => {
      if (this._muted) return;
      const ctx = this.initContextInternal();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      this.ensureMusicGraph();
      this.applyTrackGains();
    };
    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
  }

  private initContextInternal(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    this.bindUnlockListener();
    if (!this.ctx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
    }
    return this.ctx;
  }

  private ensureContext(): AudioContext | null {
    if (this._muted) return null;
    const ctx = this.initContextInternal();
    if (!ctx) return null;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    this.ensureMusicGraph();
    return ctx;
  }

  private syncMasterMute() {
    if (!this.ctx || !this.musicMasterGain) return;
    const now = this.ctx.currentTime;
    this.musicMasterGain.gain.cancelScheduledValues(now);
    this.musicMasterGain.gain.setValueAtTime(this.musicMasterGain.gain.value, now);
    this.musicMasterGain.gain.linearRampToValueAtTime(this._muted ? 0.0001 : 0.72, now + 0.25);
  }

  private ensureMusicGraph() {
    const ctx = this.ctx;
    if (!ctx || this.musicMasterGain) return;

    const master = ctx.createGain();
    master.gain.value = this._muted ? 0.0001 : 0.72;
    master.connect(ctx.destination);
    this.musicMasterGain = master;

    const duck = ctx.createGain();
    duck.gain.value = this.musicDucked ? 0.16 : 1.0;
    duck.connect(master);
    this.musicDuckGain = duck;

    // Gentle stereo-feeling feedback delay tail for ambient space/orbit/suspense atmosphere
    const reverbIn = ctx.createGain();
    reverbIn.gain.value = 0.32;
    const delay = ctx.createDelay(1.0);
    delay.delayTime.value = 0.42;
    const fb = ctx.createGain();
    fb.gain.value = 0.36;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 1350;

    reverbIn.connect(delay);
    delay.connect(lp);
    lp.connect(fb);
    fb.connect(delay);
    lp.connect(duck);
    this.musicReverbInput = reverbIn;

    (['space', 'orbit', 'event', 'combat'] as const).forEach((key) => {
      const g = ctx.createGain();
      g.gain.value = this.desiredMode === key ? 1.0 : 0.0001;
      g.connect(duck);
      g.connect(reverbIn);
      this.trackGains[key] = g;
    });

    if (this.schedulerTimer === null && typeof window !== 'undefined') {
      this.schedulerTimer = window.setInterval(() => {
        this.tickSoundtrack();
      }, 950);
    }
  }

  private applyTrackGains() {
    if (!this.ctx || !this.musicMasterGain) return;
    const now = this.ctx.currentTime;
    (['space', 'orbit', 'event', 'combat'] as const).forEach((key) => {
      const node = this.trackGains[key];
      if (!node) return;
      const target = this.desiredMode === key ? 1.0 : 0.0001;
      node.gain.cancelScheduledValues(now);
      node.gain.setValueAtTime(Math.max(0.0001, node.gain.value), now);
      node.gain.linearRampToValueAtTime(target, now + 1.15);
    });
  }

  setMusicMode(mode: MusicMode) {
    if (this.desiredMode === mode && this.musicMasterGain) return;
    this.desiredMode = mode;
    this.bindUnlockListener();
    if (!this.ctx) return;
    if (!this._muted && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    this.ensureMusicGraph();
    this.applyTrackGains();
  }

  setMusicDucked(ducked: boolean) {
    this.musicDucked = ducked;
    if (!this.ctx || !this.musicDuckGain) return;
    const now = this.ctx.currentTime;
    this.musicDuckGain.gain.cancelScheduledValues(now);
    this.musicDuckGain.gain.setValueAtTime(this.musicDuckGain.gain.value, now);
    this.musicDuckGain.gain.linearRampToValueAtTime(ducked ? 0.16 : 1.0, now + 0.45);
  }

  private scheduleTone(params: {
    track: 'space' | 'orbit' | 'event' | 'combat';
    freq: number;
    type: OscillatorType;
    attack: number;
    hold: number;
    release: number;
    peakGain: number;
    cutoffHz?: number;
    delayOffset?: number;
    detuneCents?: number;
    freqEnd?: number;
  }) {
    const ctx = this.ctx;
    const targetNode = this.trackGains[params.track];
    if (!ctx || !targetNode) return;

    const start = ctx.currentTime + (params.delayOffset ?? 0);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = params.type;
    osc.frequency.setValueAtTime(params.freq, start);
    if (params.freqEnd) {
      osc.frequency.exponentialRampToValueAtTime(
        Math.max(20, params.freqEnd),
        start + params.attack + params.hold + params.release
      );
    }
    if (params.detuneCents) {
      osc.detune.setValueAtTime(params.detuneCents, start);
    }

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(params.peakGain, start + params.attack);
    gain.gain.setValueAtTime(params.peakGain, start + params.attack + params.hold);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + params.attack + params.hold + params.release);

    if (params.cutoffHz) {
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(params.cutoffHz, start);
      osc.connect(filter).connect(gain).connect(targetNode);
    } else {
      osc.connect(gain).connect(targetNode);
    }

    const end = start + params.attack + params.hold + params.release + 0.05;
    osc.start(start);
    osc.stop(end);
  }

  private tickSoundtrack() {
    if (this._muted || !this.ctx || this.ctx.state !== 'running') return;
    if (this.desiredMode === 'none') return;

    const step = this.stepCount++;

    // 1. Soft Deep-Space Soundtrack (outside planet orbit)
    if (this.desiredMode === 'space') {
      if (step % 6 === 0) {
        const chordIdx = Math.floor(step / 6) % SPACE_CHORDS.length;
        const chord = SPACE_CHORDS[chordIdx];
        chord.forEach((freq, idx) => {
          this.scheduleTone({
            track: 'space',
            freq,
            type: idx === 0 ? 'sine' : 'triangle',
            attack: 1.6,
            hold: 2.2,
            release: 2.4,
            peakGain: idx === 0 ? 0.05 : 0.022,
            cutoffHz: 520,
            detuneCents: idx % 2 === 0 ? -4 : 4,
          });
        });
      }
      if (step % 3 === 1) {
        const bell = SPACE_BELL_NOTES[(step * 7) % SPACE_BELL_NOTES.length];
        this.scheduleTone({
          track: 'space',
          freq: bell,
          type: 'sine',
          attack: 0.08,
          hold: 0.2,
          release: 1.9,
          peakGain: 0.018,
          cutoffHz: 1800,
        });
      }
    }

    // 2. Planetary Orbit Soundtrack (atmospheric discovery & resonant orbital arpeggio)
    if (this.desiredMode === 'orbit') {
      const chordIdx = Math.floor(step / 4) % ORBIT_CHORDS.length;
      if (step % 4 === 0) {
        const chord = ORBIT_CHORDS[chordIdx];
        chord.forEach((freq, idx) => {
          this.scheduleTone({
            track: 'orbit',
            freq,
            type: idx === 0 ? 'triangle' : 'sawtooth',
            attack: 0.9,
            hold: 1.6,
            release: 1.8,
            peakGain: idx === 0 ? 0.048 : 0.017,
            cutoffHz: 760,
            detuneCents: idx % 2 === 0 ? -5 : 5,
          });
        });
        // Deep orbital sub root
        this.scheduleTone({
          track: 'orbit',
          freq: chord[0] * 0.5,
          type: 'sine',
          attack: 0.5,
          hold: 2.0,
          release: 1.5,
          peakGain: 0.055,
          cutoffHz: 220,
        });
      }
      const arp = ORBIT_ARP_PATTERNS[chordIdx];
      const arpNote = arp[step % arp.length];
      this.scheduleTone({
        track: 'orbit',
        freq: arpNote,
        type: 'triangle',
        attack: 0.03,
        hold: 0.14,
        release: 0.85,
        peakGain: 0.024,
        cutoffHz: 1550,
      });
    }

    // 3. Event Panel Open Soundtrack (tensão e suspense)
    if (this.desiredMode === 'event') {
      const chordIdx = Math.floor(step / 4) % EVENT_CHORDS.length;
      if (step % 4 === 0) {
        const chord = EVENT_CHORDS[chordIdx];
        chord.forEach((freq, idx) => {
          this.scheduleTone({
            track: 'event',
            freq,
            type: idx < 2 ? 'sawtooth' : 'triangle',
            attack: 0.7,
            hold: 1.8,
            release: 1.9,
            peakGain: idx === 0 ? 0.06 : 0.022,
            cutoffHz: 340,
            detuneCents: idx % 2 === 0 ? -8 : 9,
          });
        });
      }
      // Suspenseful low heartbeat pulse
      if (step % 2 === 0) {
        this.scheduleTone({
          track: 'event',
          freq: 54,
          type: 'sine',
          attack: 0.015,
          hold: 0.05,
          release: 0.34,
          peakGain: 0.095,
          cutoffHz: 140,
        });
        this.scheduleTone({
          track: 'event',
          freq: 50,
          type: 'sine',
          attack: 0.015,
          hold: 0.04,
          release: 0.28,
          peakGain: 0.065,
          cutoffHz: 130,
          delayOffset: 0.24,
        });
      }
      // Eerie high tension motif
      if (step % 3 === 2) {
        const note = EVENT_TENSION_NOTES[(step * 5) % EVENT_TENSION_NOTES.length];
        this.scheduleTone({
          track: 'event',
          freq: note,
          type: 'sine',
          attack: 0.14,
          hold: 0.35,
          release: 1.4,
          peakGain: 0.024,
          cutoffHz: 1100,
          detuneCents: -6,
        });
      }
    }

    // 4. Epic Combat Soundtrack (same cosmic synth palette, heroic brass pads + driving bass + war drums)
    if (this.desiredMode === 'combat') {
      const chordIdx = Math.floor(step / 2) % COMBAT_CHORDS.length;
      const chord = COMBAT_CHORDS[chordIdx];

      // Epic layered synth brass chords on every 2-step bar
      if (step % 2 === 0) {
        chord.forEach((freq, idx) => {
          this.scheduleTone({
            track: 'combat',
            freq,
            type: idx === 0 ? 'triangle' : 'sawtooth',
            attack: 0.22,
            hold: 1.05,
            release: 0.85,
            peakGain: idx === 0 ? 0.052 : idx <= 2 ? 0.022 : 0.017,
            cutoffHz: idx === 0 ? 340 : 1080,
            detuneCents: idx % 2 === 0 ? -7 : 7,
          });
        });
      }

      // Driving galloping bass & fifth ostinato (4 rhythmic pulses per 950ms beat)
      const root = chord[0];
      const fifth = chord[1] * 0.75; // fifth above low root (e.g. D2 -> A2)
      const bassPattern = [root, root, fifth, root * 2];
      bassPattern.forEach((freq, beatIdx) => {
        this.scheduleTone({
          track: 'combat',
          freq,
          type: 'sawtooth',
          attack: 0.012,
          hold: 0.06,
          release: 0.15,
          peakGain: beatIdx === 0 ? 0.055 : 0.036,
          cutoffHz: beatIdx === 3 ? 620 : 420,
          delayOffset: beatIdx * 0.2375,
        });
      });

      // Cinematic war-drum pulse (kick on 0 and 0.475, syncopated tom accent on 0.7125)
      [0, 0.475].forEach((offset, idx) => {
        this.scheduleTone({
          track: 'combat',
          freq: idx === 0 ? 118 : 96,
          freqEnd: 36,
          type: 'sine',
          attack: 0.008,
          hold: 0.03,
          release: 0.22,
          peakGain: idx === 0 ? 0.115 : 0.08,
          cutoffHz: 210,
          delayOffset: offset,
        });
      });
      if (step % 2 === 1) {
        this.scheduleTone({
          track: 'combat',
          freq: 145,
          freqEnd: 62,
          type: 'triangle',
          attack: 0.008,
          hold: 0.02,
          release: 0.14,
          peakGain: 0.055,
          cutoffHz: 320,
          delayOffset: 0.7125,
        });
      }

      // Soaring heroic lead melody in the same cosmic synth timbre
      const motif = COMBAT_LEAD_MOTIFS[step % COMBAT_LEAD_MOTIFS.length];
      motif.forEach((note) => {
        this.scheduleTone({
          track: 'combat',
          freq: note.freq,
          type: 'sawtooth',
          attack: 0.045,
          hold: note.hold,
          release: note.release,
          peakGain: 0.026,
          cutoffHz: 1550,
          delayOffset: note.delay,
          detuneCents: 6,
        });
        this.scheduleTone({
          track: 'combat',
          freq: note.freq,
          type: 'triangle',
          attack: 0.045,
          hold: note.hold,
          release: note.release,
          peakGain: 0.02,
          cutoffHz: 1700,
          delayOffset: note.delay,
          detuneCents: -6,
        });
      });
    }
  }

  playClick() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(660, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(420, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  }

  playScan() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [520, 780, 1040].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.07);
      gain.gain.setValueAtTime(0.06, now + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.16);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 0.16);
    });
  }

  playWarp() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.35);
    osc.frequency.exponentialRampToValueAtTime(75, now + 0.85);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.09, now + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.9);
  }

  playWeapon(type: WeaponDamageType) {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    if (type === 'laser') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1150, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.11);
      gain.gain.setValueAtTime(0.045, now);
    } else if (type === 'cinetica') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.06);
      gain.gain.setValueAtTime(0.035, now);
    } else if (type === 'plasma') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(130, now + 0.14);
      gain.gain.setValueAtTime(0.045, now);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.18);
      gain.gain.setValueAtTime(0.055, now);
    }
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  playExplosion() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(28, now + 0.35);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.36);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.36);
  }

  playMiningPulse() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(310, now);
    osc.frequency.linearRampToValueAtTime(460, now + 0.09);
    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  playAlert() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [440, 580].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + i * 0.12);
      gain.gain.setValueAtTime(0.04, now + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.1);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.1);
    });
  }
}

export const soundEngine = new SoundEngine();
