import React from 'react';
import { AlertCircle, CheckCircle2, ChevronRight, Compass, Globe2, Sparkles } from 'lucide-react';
import type { ActiveNarrativeEventSession, NarrativeEventChoice } from '../types/game';
import { EventIllustration } from './EventIllustration';

interface NarrativeEventModalProps {
  session: ActiveNarrativeEventSession;
  hasNextEventBonus?: boolean;
  onSelectChoice: (choice: NarrativeEventChoice) => void;
  onAdvanceScene: () => void;
  onClose: () => void;
}

const TRIGGER_LABELS: Record<ActiveNarrativeEventSession['triggerKey'], string> = {
  VIAGEM_ESPACIAL: 'Viagem Espacial',
  EXPLORANDO_SUPERFICIE: 'Explorando Superfície',
  MINERANDO_SOLO: 'Minerando em Solo',
  CONVERSANDO_NPC: 'Contato com Habitantes',
  ESCANEANDO_RUINAS: 'Escaneando Ruínas',
  COLETANDO_AMOSTRAS: 'Coletando Amostras',
  NEGOCIANDO_NO_MERCADO: 'Negociando no Mercado',
  DESCANSANDO_NO_ACAMPAMENTO: 'Descansando no Acampamento',
  CHEGANDO_NO_PLANETA: 'Chegando no Planeta',
  DECOLANDO: 'Decolando da Órbita',
};

export const NarrativeEventModal: React.FC<NarrativeEventModalProps> = ({
  session,
  hasNextEventBonus = false,
  onSelectChoice,
  onAdvanceScene,
  onClose,
}) => {
  const isComplex = session.complexity !== 'simples';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto pointer-events-auto">
      <div
        className="w-full max-w-3xl rounded-2xl border bg-[#080d1a] text-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
        style={{ borderColor: `${session.accentColor}66` }}
      >
        {/* Top Metadata Header */}
        <div className="px-4 sm:px-6 py-3 border-b border-slate-800/90 bg-[#0b1222] flex flex-wrap items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wider">
              <span className="inline-flex items-center gap-1 text-cyan-300">
                {session.scope === 'galactico' ? (
                  <Sparkles className="w-3.5 h-3.5" />
                ) : (
                  <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
                {session.isExplorationConclusion
                  ? 'Exploração Planetária'
                  : session.scope === 'galactico'
                    ? 'Evento Galáctico'
                    : 'Evento Planetário'}
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-amber-300">
                {session.isExplorationConclusion && session.targetPlanetName
                  ? session.targetPlanetName
                  : TRIGGER_LABELS[session.triggerKey]}
              </span>
              {!session.isExplorationConclusion && (
                <>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">
                    {isComplex ? 'Evento Complexo' : 'Evento Simples'} · #{session.eventId}
                  </span>
                </>
              )}
            </div>
            <h2 className="font-display text-lg sm:text-xl font-bold text-white mt-0.5 truncate">
              {session.title}
            </h2>
          </div>

          <span
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold ${
              session.outcomeTone === 'fracasso'
                ? 'bg-rose-950/60 border-rose-500/50 text-rose-200'
                : session.outcomeTone === 'parcial'
                  ? 'bg-amber-950/60 border-amber-500/50 text-amber-200'
                  : session.outcomeTone === 'sucesso'
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                    : 'bg-slate-900 border-slate-700 text-slate-300'
            }`}
          >
            {session.outcomeTone === 'fracasso'
              ? 'Fracasso'
              : session.outcomeTone === 'parcial'
                ? 'Com Riscos'
                : session.outcomeTone === 'sucesso'
                  ? 'Sucesso'
                  : session.category}
          </span>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto">
          <EventIllustration
            eventId={session.eventId}
            title={session.title}
            visualMotif={session.visualMotif}
            accentColor={session.accentColor}
            starColor={session.starColor}
            customImageSrc={session.customImageSrc}
            outcomeTone={session.outcomeTone}
          />

          {session.phase === 'scene' ? (
            <>
              <div className="rounded-xl bg-slate-900/75 border border-slate-800 p-4">
                <p className="text-sm sm:text-[15px] text-slate-100 leading-relaxed">
                  {session.currentScene.narrativeText}
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Escolha sua decisão
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {session.currentScene.choices.map((choice) => {
                    const luck = choice.effects.luckCheck;
                    const winChancePct = luck
                      ? Math.min(92, luck.winChancePct + (hasNextEventBonus ? 20 : 0))
                      : null;
                    return (
                      <button
                        key={choice.id}
                        type="button"
                        onClick={() => onSelectChoice(choice)}
                        className="group text-left p-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-400 transition-colors cursor-pointer flex flex-col justify-between gap-2.5"
                      >
                        <div className="space-y-1">
                          <div className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                            Opção {choice.id}
                          </div>
                          <div className="text-sm font-semibold text-white group-hover:text-cyan-200 leading-snug">
                            {choice.label}
                          </div>
                        </div>
                        <div className="pt-2 border-t border-slate-800/80 flex items-end justify-between gap-2">
                          <span className="text-[11px] text-slate-400 font-medium leading-snug">
                            Decidir agora
                          </span>
                          <div className="flex items-center gap-1.5 ml-auto text-right">
                            {winChancePct !== null && (
                              <span
                                className={`text-[11px] font-semibold leading-snug ${
                                  winChancePct >= 65
                                    ? 'text-emerald-300'
                                    : winChancePct >= 45
                                      ? 'text-amber-300'
                                      : 'text-rose-300'
                                }`}
                              >
                                {winChancePct}% de chance de sucesso
                              </span>
                            )}
                            <ChevronRight className="w-4 h-4 text-cyan-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            /* Quadro de Conclusão e Recompensas / Consequências */
            <div className="space-y-4">
              <div className="rounded-xl bg-slate-900/85 border border-cyan-500/40 p-4 space-y-2">
                {session.lastChoiceLabel && (
                  <div className="text-xs font-semibold text-cyan-300">
                    Decisão tomada: {session.lastChoiceLabel}
                  </div>
                )}
                <p className="text-sm sm:text-[15px] text-slate-100 leading-relaxed">
                  {session.lastConclusionText}
                </p>
              </div>

              <div className="rounded-xl bg-slate-900/70 border border-slate-800 p-4 space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  Recompensas e Consequências Aplicadas
                </div>
                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-200">
                  {session.appliedConsequences.map((line, idx) => {
                    const isPenalty =
                      line.startsWith('-') ||
                      line.startsWith('–') ||
                      /^(baixa fatal|sem espaço|depósito .*lotado|nenhum|tripulante perdido|fracasso)/i.test(line);
                    return (
                      <li key={idx} className="flex items-start gap-2">
                        {isPenalty ? (
                          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        )}
                        <span className={isPenalty ? 'text-rose-200' : 'text-slate-100'}>{line}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {session.spawnedMissionTitle && (
                <div className="rounded-xl bg-purple-950/35 border border-purple-500/45 p-3 text-xs text-purple-200 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>
                    Missão de evento adicionada ao diário: <strong>{session.spawnedMissionTitle}</strong>. Ao concluir a missão no sistema marcado, o desfecho final será aberto automaticamente!
                  </span>
                </div>
              )}

              <div className="flex justify-end pt-1">
                {session.pendingNextSceneId ? (
                  <button
                    type="button"
                    onClick={onAdvanceScene}
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm inline-flex items-center gap-2 cursor-pointer"
                  >
                    Avançar para a próxima cena
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm inline-flex items-center gap-2 cursor-pointer"
                  >
                    {session.isExplorationConclusion ? 'Concluir exploração' : 'Continuar viagem'}
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
