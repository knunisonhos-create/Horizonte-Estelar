import React, { useMemo, useState } from 'react';
import { Rocket, Play, RotateCcw, Shield, Compass, Sparkles } from 'lucide-react';
import { FACTIONS, LIFE_FORMS, SPECIES } from '../data/lifeforms';
import { CreatureCard } from './CreatureCard';
import { getSystemSummaryById } from '../data/universe';
import type { CharacterGender, LifeFormId, PlayerCampaignState } from '../types/game';
import { TECH_CATEGORY_META } from '../utils/formatting';
import { TechCategoryBadge } from './TechCategoryBadge';

interface StartScreenProps {
  existingSave: PlayerCampaignState | null;
  onContinueSave: () => void;
  onStartNewGame: (
    speciesId: string,
    factionId: string,
    playerName: string,
    playerGender: CharacterGender
  ) => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  existingSave,
  onContinueSave,
  onStartNewGame,
}) => {
  const [playerName, setPlayerName] = useState('Comandante Lyra');
  const [selectedGender, setSelectedGender] = useState<CharacterGender>('M');
  const [selectedLifeForm, setSelectedLifeForm] = useState<LifeFormId>('humanoide');
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<string>('solarianos');
  const [selectedFactionId, setSelectedFactionId] = useState<string>('fac_solarianos_1');

  const activeLifeForm = useMemo(
    () => LIFE_FORMS.find((l) => l.id === selectedLifeForm) ?? LIFE_FORMS[0],
    [selectedLifeForm]
  );

  const speciesInLifeForm = useMemo(
    () => SPECIES.filter((s) => s.lifeFormId === selectedLifeForm),
    [selectedLifeForm]
  );

  const selectedSpecies = useMemo(
    () => SPECIES.find((s) => s.id === selectedSpeciesId) ?? speciesInLifeForm[0],
    [selectedSpeciesId, speciesInLifeForm]
  );

  const factionsForSpecies = useMemo(
    () => FACTIONS.filter((f) => f.speciesId === selectedSpecies.id),
    [selectedSpecies]
  );

  const selectedFaction = useMemo(
    () => FACTIONS.find((f) => f.id === selectedFactionId) ?? factionsForSpecies[0],
    [selectedFactionId, factionsForSpecies]
  );

  const handleLifeFormChange = (lfId: LifeFormId) => {
    setSelectedLifeForm(lfId);
    const firstSp = SPECIES.find((s) => s.lifeFormId === lfId);
    if (firstSp) {
      setSelectedSpeciesId(firstSp.id);
      const firstFac = FACTIONS.find((f) => f.speciesId === firstSp.id);
      if (firstFac) setSelectedFactionId(firstFac.id);
    }
  };

  const handleSpeciesChange = (spId: string) => {
    setSelectedSpeciesId(spId);
    const firstFac = FACTIONS.find((f) => f.speciesId === spId);
    if (firstFac) setSelectedFactionId(firstFac.id);
  };

  const techMeta = TECH_CATEGORY_META[selectedSpecies.techCategory];

  return (
    <div className="fixed inset-0 z-50 bg-[#050811] text-slate-100 overflow-y-auto lg:overflow-hidden">
      <div className="w-full h-full px-4 sm:px-6 py-3 lg:h-[100dvh] flex flex-col gap-3">
        {/* Top Bar */}
        <header className="shrink-0 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/90 pb-2.5">
          <h1 className="font-display text-2xl xl:text-3xl font-bold text-white tracking-tight whitespace-nowrap shrink-0">
            Horizonte Estelar
          </h1>

          <div className="flex flex-wrap items-center gap-3 ml-auto">
            <div className="flex items-center gap-2.5">
              <label
                htmlFor="explorer-name-input"
                className="text-sm font-medium text-slate-300 whitespace-nowrap shrink-0"
              >
                Explorador
              </label>
              <input
                id="explorer-name-input"
                type="text"
                maxLength={32}
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-44 sm:w-56 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm font-medium text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-300 whitespace-nowrap shrink-0">
                Sexo
              </span>
              <div
                role="group"
                aria-label="Sexo do personagem"
                className="inline-flex rounded-lg border border-slate-700 bg-slate-950 p-0.5 shrink-0"
              >
                <button
                  type="button"
                  aria-pressed={selectedGender === 'M'}
                  onClick={() => setSelectedGender('M')}
                  className={`px-3 py-1 rounded-md text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    selectedGender === 'M'
                      ? 'bg-cyan-500 text-slate-950'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Masculino
                </button>
                <button
                  type="button"
                  aria-pressed={selectedGender === 'F'}
                  onClick={() => setSelectedGender('F')}
                  className={`px-3 py-1 rounded-md text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    selectedGender === 'F'
                      ? 'bg-cyan-500 text-slate-950'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Feminino
                </button>
              </div>
            </div>

            {existingSave && (
              <button
                type="button"
                onClick={onContinueSave}
                className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap shrink-0"
              >
                <Play className="w-4 h-4 shrink-0" />
                Continuar ({existingSave.playerName} · {existingSave.credits.toLocaleString('pt-BR')} cr)
              </button>
            )}
          </div>
        </header>

        {/* Main Full-Screen Split: Left Configurator + Right Result Panel */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_390px] xl:grid-cols-[minmax(0,1fr)_440px] gap-3.5 items-stretch">
          {/* Left Workspace */}
          <div className="min-h-0 lg:overflow-y-auto bg-[#090e1a] border border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-3.5">
            {/* 1. Forma de Vida */}
            <section className="shrink-0 space-y-2">
              <h2 className="text-base font-bold text-white">1. Forma de Vida</h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-2">
                {LIFE_FORMS.map((lf) => {
                  const isActive = selectedLifeForm === lf.id;
                  return (
                    <button
                      key={lf.id}
                      type="button"
                      onClick={() => handleLifeFormChange(lf.id)}
                      className={`px-3 py-2.5 rounded-lg text-left text-xs sm:text-sm border transition-colors cursor-pointer flex items-center gap-2 min-w-0 ${
                        isActive
                          ? 'bg-slate-800 border-cyan-400 text-white font-semibold'
                          : 'bg-slate-950/75 border-slate-800 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <span
                        className="w-1.5 h-4 rounded-xs shrink-0"
                        style={{ backgroundColor: lf.color }}
                      />
                      <span className="truncate">{lf.name}</span>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 rounded-lg border border-slate-800/80 bg-slate-950/65 px-3.5 py-2.5 text-sm text-slate-200 leading-snug">
                <div>
                  <span className="text-cyan-300 font-semibold">Físico:</span>{' '}
                  {activeLifeForm.biology}
                </div>
                <div>
                  <span className="text-emerald-300 font-semibold">Ambientes:</span>{' '}
                  {activeLifeForm.nicheSummary}
                </div>
              </div>
            </section>

            {/* 2. Raça & Espécie Inteligente — 3 Raças Lado a Lado */}
            <section className="flex-1 min-h-0 flex flex-col gap-2">
              <h2 className="text-base font-bold text-white shrink-0">
                2. Raça & Espécie
              </h2>

              <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch">
                {speciesInLifeForm.map((sp) => {
                  const active = sp.id === selectedSpecies.id;
                  return (
                    <button
                      key={sp.id}
                      type="button"
                      onClick={() => handleSpeciesChange(sp.id)}
                      className={`h-full p-3.5 xl:p-4 rounded-xl border text-left transition-colors cursor-pointer flex flex-col justify-between gap-3 min-w-0 ${
                        active
                          ? 'bg-slate-800/90 border-cyan-400 text-white'
                          : 'bg-slate-950/75 border-slate-800 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <div className="space-y-3 min-w-0">
                        <div className="flex items-center gap-3 min-w-0">
                          <CreatureCard
                            cardId={`species_${sp.id}`}
                            kind="species"
                            name={sp.name}
                            lifeFormId={sp.lifeFormId}
                            gender={selectedGender}
                            description={sp.description}
                            sizeClass="w-16 h-16 xl:w-20 xl:h-20"
                            allowAiGeneration={false}
                          />
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="text-base xl:text-lg font-bold text-white truncate">{sp.name}</div>
                            <div className="flex items-center justify-between gap-1.5 flex-wrap">
                              <span className="text-xs text-slate-400 capitalize">{sp.temperament}</span>
                              <TechCategoryBadge category={sp.techCategory} compact />
                            </div>
                          </div>
                        </div>

                        <p className="text-sm xl:text-[15px] text-slate-200 leading-relaxed">
                          {sp.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-800/75 text-xs text-slate-400 truncate">
                        {sp.traits.join(' · ')}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 3. Facção de Origem */}
            <section className="shrink-0 space-y-2">
              <h2 className="text-base font-bold text-white">3. Facção de Origem</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {factionsForSpecies.map((fac) => {
                  const active = fac.id === selectedFaction.id;
                  return (
                    <button
                      key={fac.id}
                      type="button"
                      onClick={() => setSelectedFactionId(fac.id)}
                      className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer flex flex-col justify-between gap-2 min-w-0 ${
                        active
                          ? 'bg-slate-800/90 border-cyan-400 text-white'
                          : 'bg-slate-950/75 border-slate-800 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-sm xl:text-base font-bold flex items-center gap-2 min-w-0">
                          <span
                            className="w-1.5 h-4 rounded-xs shrink-0"
                            style={{ backgroundColor: fac.color }}
                          />
                          <span className="truncate">{fac.name}</span>
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <TechCategoryBadge category={fac.techStyle} compact />
                          <span className="text-xs text-cyan-300 font-medium capitalize">{fac.axis}</span>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs xl:text-sm leading-snug">
                        <p className="text-slate-200">
                          <span className="text-cyan-300 font-semibold">Visão:</span> {fac.vision}
                        </p>
                        <p className="text-slate-300">
                          <span className="text-amber-300 font-semibold">Objetivo:</span> {fac.goal}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Right Panel: Painel de Resultado */}
          <aside className="min-h-0 lg:overflow-y-auto bg-[#090e1a] border border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-3.5">
            <div className="space-y-3.5 min-h-0">
              <div className="flex items-start gap-4">
                <CreatureCard
                  cardId={`species_${selectedSpecies.id}`}
                  kind="species"
                  name={selectedSpecies.name}
                  lifeFormId={selectedSpecies.lifeFormId}
                  gender={selectedGender}
                  description={selectedSpecies.description}
                  sizeClass="w-28 h-28 xl:w-32 xl:h-32 shrink-0"
                  allowAiGeneration={true}
                />
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="text-xs text-cyan-400 font-semibold">Dossiê da Origem</div>
                  <div className="text-sm text-slate-300 truncate">
                    {playerName.trim() || 'Comandante Lyra'} · {selectedGender === 'F' ? 'Feminino' : 'Masculino'}
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white leading-tight truncate">
                    {selectedSpecies.name}
                  </h3>
                  <div className="text-sm font-semibold truncate" style={{ color: selectedFaction.color }}>
                    {selectedFaction.name}
                  </div>
                  <div className="pt-1 flex items-center gap-2 flex-wrap text-xs text-slate-400">
                    <span>Tipo da Raça:</span>
                    <TechCategoryBadge category={selectedSpecies.techCategory} compact />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-slate-800/80 bg-slate-950/60 px-3.5 py-2.5 text-xs xl:text-sm text-slate-300 leading-snug">
                <span className={techMeta.text + ' font-semibold'}>
                  Harmonia {techMeta.shortLabel}:
                </span>{' '}
                {techMeta.synergyHint}.
              </div>

              <div className="space-y-2.5 text-xs xl:text-sm border-t border-slate-800 pt-3">
                <div className="flex items-start gap-2.5">
                  <Compass className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400">Setor capital:</span>{' '}
                    <span className="text-slate-100 font-semibold">
                      {getSystemSummaryById(selectedFaction.capitalSystemId)?.name ?? 'Setor da facção'}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Shield className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400">Visão:</span>{' '}
                    <span className="text-slate-200 leading-snug">{selectedFaction.vision}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Rocket className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400">Objetivo:</span>{' '}
                    <span className="text-slate-200 leading-snug">{selectedFaction.goal}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400">Traços:</span>{' '}
                    <span className="text-slate-200">{selectedSpecies.traits.join(' · ')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="shrink-0 space-y-3 pt-3 border-t border-slate-800/80">
              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3 text-xs xl:text-sm text-slate-300 space-y-1.5">
                <div className="font-bold text-slate-100">Nave Inicial: Balsa Estelar Civil</div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs xl:text-sm text-slate-400 font-mono-tabular">
                  <span>Casco: 165</span>
                  <span>Salto: 16 a.l.</span>
                  <span>Carga: 40 + 35 reb.</span>
                  <span>Trip.: 1 ativa · 1 res.</span>
                  <span className="col-span-2 text-slate-300 font-sans">
                    Canhão laser civil · Broca mineral civil
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onStartNewGame(selectedSpecies.id, selectedFaction.id, playerName, selectedGender)}
                className="w-full py-3.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-bold text-base flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Rocket className="w-5 h-5 shrink-0" />
                {existingSave ? 'Iniciar Nova Campanha (Sobrescrever)' : 'Iniciar Exploração'}
              </button>

              {existingSave && (
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                  Campanha salva disponível no botão verde superior.
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
