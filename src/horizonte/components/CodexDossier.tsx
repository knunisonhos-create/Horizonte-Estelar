import React from 'react';
import { Award, Brain, Compass, Flag, Shield, Swords, Zap, X } from 'lucide-react';
import {
  CREATURES_BY_ID,
  FACTIONS_BY_ID,
  isFactionConservative,
  LIFE_FORMS_BY_ID,
  SPECIES_BY_ID,
} from '../data/lifeforms';
import { FACTION_DOSSIERS } from '../data/factionDossiers';
import { getRenownTierName } from '../data/narrative';
import { factionMilitaryPower } from '../engine/galacticWar';
import type { FactionTechStyle, LifeFormId, PlayerCampaignState } from '../types/game';
import { PLANET_TYPES_BY_CODE } from '../data/planets';
import { RESOURCES_BY_ID } from '../data/items';
import { SPECIAL_ABILITIES_BY_ID } from '../data/originPerks';
import { getActiveTechCategory, RARITY_STYLES, TECH_CATEGORY_META } from '../utils/formatting';
import { CreatureCard } from './CreatureCard';
import { EquipmentSprite, ResourceSprite } from './SpriteArt';

export type CodexItemCategory =
  | 'hull'
  | 'weapon'
  | 'shield'
  | 'jumpDrive'
  | 'extractor'
  | 'utility'
  | 'suit'
  | 'consumable'
  | 'resource'
  | 'blueprint';

export type CodexDetail = { kind: 'faction' | 'species' | 'life' | 'planet' | 'creature' | 'ability'; id: string } | {
  kind: 'item';
  id: string;
  name: string;
  rarity: string;
  description: string;
  price?: number;
  extra?: string;
  itemCategory?: CodexItemCategory;
  typeLabel?: string;
  techCategory?: FactionTechStyle;
};

interface DossierSection {
  key: string;
  title: string;
  symbol: string;
  icon: React.ReactNode;
  accentClass: string;
  body: React.ReactNode;
}

function worldNames(codes: string[]): string {
  const names = codes.map((code) => PLANET_TYPES_BY_CODE[code]?.name).filter(Boolean);
  return names.length ? names.join(', ') : 'rotas ainda não cartografadas';
}

function rarityTone(rarity: string | undefined) {
  if (!rarity) return RARITY_STYLES.comum;
  return RARITY_STYLES[rarity as keyof typeof RARITY_STYLES] ?? RARITY_STYLES.comum;
}

export function CodexDossier({
  detail,
  campaign,
  onClose,
}: {
  detail: CodexDetail;
  campaign?: PlayerCampaignState;
  onClose: () => void;
}) {
  let title = 'Registro';
  let kicker = 'Arquivo de bordo';
  let titleClass = 'text-cyan-100';
  let paragraphs: string[] = [];
  let sections: DossierSection[] = [];
  let chips: Array<{ label: string; className: string }> = [];
  let cover: string | null = null;
  let portrait: { cardId: string; kind: 'species' | 'creature'; name: string; lifeFormId: LifeFormId; description: string } | null = null;
  let itemSprite: { category: CodexItemCategory; id: string } | null = null;

  if (detail.kind === 'faction') {
    const fac = FACTIONS_BY_ID[detail.id];
    const sp = fac ? SPECIES_BY_ID[fac.speciesId] : undefined;
    const dossier = fac ? FACTION_DOSSIERS[fac.id] : undefined;
    title = fac?.name ?? 'Facção';
    kicker = 'Dossiê Diplomático';
    titleClass = 'text-white';
    if (fac && sp) {
      const isConservative = isFactionConservative(fac);
      const power = campaign ? factionMilitaryPower(fac.id, campaign) : null;
      const renown = campaign ? campaign.factionRenown[fac.id] ?? 0 : 0;
      const isAllied = campaign ? campaign.formalAlliances.includes(fac.id) : false;
      const tier = getRenownTierName(renown, isAllied);
      const pilotedId =
        campaign
          ? (campaign.ships.find((s) => s.uid === campaign.activeShipUid)?.factionId ?? campaign.chosenFactionId)
          : null;
      const activeWarsForFac = campaign
        ? campaign.galacticWars
            .filter((w) => w.factionAId === fac.id || w.factionBId === fac.id)
            .map((w) => (w.factionAId === fac.id ? w.factionBId : w.factionAId))
        : fac.warsWith;
      const warNames = Array.from(new Set(activeWarsForFac))
        .map((id) => FACTIONS_BY_ID[id]?.name)
        .filter(Boolean);
      const allyNames = fac.alliedWith
        .map((id) => FACTIONS_BY_ID[id]?.name)
        .filter(Boolean);

      portrait = {
        cardId: `species_${sp.id}`,
        kind: 'species',
        name: sp.name,
        lifeFormId: sp.lifeFormId,
        description: sp.description,
      };

      chips = [
        { label: sp.name, className: 'border-cyan-400/40 bg-cyan-500/10 text-cyan-200' },
        { label: fac.axis, className: 'border-amber-400/40 bg-amber-500/10 text-amber-200' },
        {
          label: TECH_CATEGORY_META[fac.techStyle].label,
          className: TECH_CATEGORY_META[fac.techStyle].badge,
        },
        {
          label: isConservative ? 'Conservadora (Nv 2)' : 'Integradora',
          className: isConservative
            ? 'border-amber-500/45 bg-amber-500/15 text-amber-300'
            : 'border-sky-500/45 bg-sky-500/15 text-sky-300',
        },
      ];
      if (power !== null) {
        chips.push({
          label: `⚡ Poder ${power}`,
          className: 'border-amber-400/50 bg-amber-500/15 text-amber-200 font-mono-tabular',
        });
      }

      if (dossier) {
        sections = [
          {
            key: 'mindset',
            title: 'Mentalidade & Visão de Mundo',
            symbol: '◈',
            icon: <Brain className="w-4 h-4 text-cyan-300 shrink-0" />,
            accentClass: 'border-cyan-500/35 bg-cyan-950/15',
            body: dossier.mindset,
          },
          {
            key: 'behavior',
            title: 'Forma de Agir em Campo',
            symbol: '✦',
            icon: <Compass className="w-4 h-4 text-amber-300 shrink-0" />,
            accentClass: 'border-amber-500/35 bg-amber-950/15',
            body: dossier.behavior,
          },
          {
            key: 'code',
            title: 'Código Interno & Convivência',
            symbol: '❖',
            icon: <Shield className="w-4 h-4 text-emerald-300 shrink-0" />,
            accentClass: 'border-emerald-500/35 bg-emerald-950/15',
            body: dossier.code,
          },
          {
            key: 'relations',
            title: 'Situação & Relações Galácticas',
            symbol: '⚔',
            icon: <Swords className="w-4 h-4 text-rose-300 shrink-0" />,
            accentClass: 'border-slate-700/80 bg-slate-900/60',
            body: (
              <div className="space-y-1.5 text-xs text-slate-200">
                {campaign && (
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="inline-flex items-center gap-1">
                      <Flag className="w-3.5 h-3.5 text-cyan-300" />
                      <span>
                        Reputação:{' '}
                        <strong className={renown >= 80 ? 'text-emerald-300' : renown <= -20 ? 'text-rose-300' : 'text-cyan-200'}>
                          {renown} ({tier})
                        </strong>
                      </span>
                    </span>
                    {pilotedId === fac.id && (
                      <span className="inline-flex items-center gap-1 text-amber-300 font-semibold">
                        <Award className="w-3.5 h-3.5" /> Sua Facção Atual
                      </span>
                    )}
                    {isAllied && (
                      <span className="inline-flex items-center gap-1 text-emerald-300 font-semibold">
                        <Award className="w-3.5 h-3.5" /> Oficial Legítimo
                      </span>
                    )}
                  </div>
                )}
                <div className="flex items-start gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" />
                  <span>
                    <strong>Doutrina:</strong>{' '}
                    {isConservative
                      ? 'Conservadora — preserva mundos Nível 2 em suas fronteiras.'
                      : 'Integradora — eleva mundos Nível 2 ao padrão Nível 3–4.'}
                  </span>
                </div>
                <div className="flex items-start gap-1.5">
                  <Swords className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Guerras ativas:</strong> {warNames.length > 0 ? warNames.join(', ') : 'Nenhuma frente declarada.'}
                  </span>
                </div>
                {allyNames.length > 0 && (
                  <div className="flex items-start gap-1.5">
                    <Award className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Aliados naturais:</strong> {allyNames.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            ),
          },
        ];
      }
    }
  } else if (detail.kind === 'species') {
    const sp = SPECIES_BY_ID[detail.id];
    const lf = sp ? LIFE_FORMS_BY_ID[sp.lifeFormId] : undefined;
    title = sp?.name ?? 'Raça';
    kicker = 'Relato xenológico';
    titleClass = 'text-cyan-100';
    if (sp) {
      portrait = {
        cardId: `species_${sp.id}`,
        kind: 'species',
        name: sp.name,
        lifeFormId: sp.lifeFormId,
        description: sp.description,
      };
      paragraphs = [
        sp.description,
        `O temperamento registrado em campo é ${sp.temperament}. Não é um rótulo de laboratório: é o que a equipe sente quando a escotilha abre e eles já estão olhando.`,
        lf
          ? `A forma de vida ${lf.name} explica o corpo antes de explicar a política. ${lf.biology}`
          : '',
        `Traços que a expedição aprendeu a respeitar: ${sp.traits.join(', ')}.`,
      ].filter(Boolean);
    }
  } else if (detail.kind === 'life') {
    const lf = LIFE_FORMS_BY_ID[detail.id as keyof typeof LIFE_FORMS_BY_ID];
    title = lf?.name ?? 'Forma de vida';
    kicker = 'Caderno de biologia';
    titleClass = 'text-emerald-200';
    if (lf) {
      paragraphs = [
        lf.biology,
        lf.nicheSummary,
        `Onde o arquivo espera encontrá-los: ${worldNames(lf.compatiblePlanetCodes)}.`,
      ];
    }
  } else if (detail.kind === 'planet') {
    const pt = PLANET_TYPES_BY_CODE[detail.id];
    const tone = rarityTone(pt?.rarity);
    title = pt?.name ?? 'Mundo';
    kicker = 'Levantamento planetário';
    titleClass = tone.text;
    if (pt) {
      cover = `/planet-covers/${pt.code}.jpg`;
      const reserves = pt.typicalResourceIds
        .map((id) => RESOURCES_BY_ID[id]?.name)
        .filter(Boolean)
        .join(', ');
      paragraphs = [
        `Classe ${pt.name}. ${pt.textureDesc.charAt(0).toUpperCase()}${pt.textureDesc.slice(1)}.`,
        pt.lifeRuleText,
        reserves
          ? `O que o solo e o céu costumam entregar: ${reserves}.`
          : 'Nenhuma reserva típica consta neste levantamento.',
        pt.allowsCivilization45
          ? 'Há mundos desta classe que sustentam impérios inteiros, com docas, leis e memória longa.'
          : 'Esta classe raramente segura uma sede imperial. Serve de fronteira, de mina ou de silêncio.',
      ];
      chips = [{ label: tone.label, className: tone.badge }];
    }
  } else if (detail.kind === 'creature') {
    const cr = CREATURES_BY_ID[detail.id];
    title = cr?.name ?? 'Criatura';
    kicker = 'Ficha de fauna';
    const dangerTone =
      cr?.danger === 'mortal' || cr?.danger === 'alto'
        ? 'text-rose-200'
        : cr?.rareNiche
        ? 'text-sky-200'
        : 'text-emerald-200';
    titleClass = dangerTone;
    if (cr) {
      portrait = {
        cardId: cr.id,
        kind: 'creature',
        name: cr.name,
        lifeFormId: cr.lifeFormId,
        description: cr.description,
      };
      paragraphs = [
        cr.description,
        `No ecossistema ocupa o papel de ${cr.ecologicalRole}. O porte é ${cr.size}. O perigo, para quem desce sem leitura prévia, é ${cr.danger}.`,
        `Foi visto em mundos ${worldNames(cr.preferredPlanetCodes)}.`,
        `O que a expedição leva de volta, quando leva: ${cr.utility}.`,
        cr.rareNiche
          ? 'Colecionadores pagam caro por um espécime destes. Não é rota comum.'
          : 'Espécime de rota. Útil, mas não muda o preço de um setor.',
      ];
    }
  } else if (detail.kind === 'ability') {
    const ab = SPECIAL_ABILITIES_BY_ID[detail.id];
    title = ab?.name ?? 'Habilidade';
    kicker = 'Doutrina de bordo';
    titleClass = ab?.healthRegenPerSec ? 'text-rose-200' : 'text-cyan-100';
    if (ab) {
      paragraphs = [
        ab.description,
        ab.summary,
        `Quem a carrega: ${ab.ownerName}.`,
        ab.healthRegenPerSec
          ? 'Em campo, a tripulação sente a saúde voltar devagar, mesmo sem o mestre por perto.'
          : 'Não restaura saúde por si. Age no combate, no comércio ou na leitura do terreno.',
      ];
    }
  } else if (detail.kind === 'item') {
    const tone = rarityTone(detail.rarity);
    const techMeta = detail.techCategory ? TECH_CATEGORY_META[detail.techCategory] : undefined;
    const activeTech = campaign ? getActiveTechCategory(campaign) : undefined;
    const isAffinity = Boolean(detail.techCategory && activeTech && detail.techCategory === activeTech);
    title = detail.name;
    kicker = detail.typeLabel ? `Catálogo · ${detail.typeLabel}` : 'Peça de arsenal';
    titleClass = tone.text;
    if (detail.itemCategory) {
      itemSprite = { category: detail.itemCategory, id: detail.id };
    }
    paragraphs = [
      detail.description,
      detail.extra ?? '',
      techMeta
        ? `${techMeta.label}: ${techMeta.synergyHint}.${
            isAffinity
              ? ' Afinidade tecnológica ativa com sua nave/facção atual — concede bônus máximo ao equipar, consumir ou negociar.'
              : ''
          }`
        : '',
      detail.price != null
        ? `Valor base de catálogo: ${detail.price.toLocaleString('pt-BR')} CR. O preço real varia conforme o mercado local.`
        : '',
    ].filter(Boolean);
    chips = [
      ...(detail.typeLabel ? [{ label: detail.typeLabel, className: 'border-cyan-400/40 bg-cyan-500/10 text-cyan-200' }] : []),
      { label: tone.label, className: tone.badge },
      ...(techMeta
        ? [{ label: `${techMeta.label}${isAffinity ? ' ★' : ''}`, className: techMeta.badge }]
        : []),
    ];
  }

  return (
    <aside className="fixed left-3 top-16 bottom-16 z-[70] w-[min(500px,calc(var(--fit-w)-1.5rem))] overflow-y-auto rounded-2xl border border-cyan-400/40 bg-[#050914]/96 text-slate-100 shadow-[0_0_40px_rgba(34,211,238,0.18)]">
      <div className="relative min-h-[140px] overflow-hidden border-b border-cyan-500/25">
        {cover && (
          <img src={cover} alt="" className="absolute inset-0 h-full w-full object-cover opacity-55" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050914] via-[#050914]/75 to-[#050914]/20" />
        <div className="relative p-4 flex items-start gap-3">
          {portrait && (
            <CreatureCard
              cardId={portrait.cardId}
              kind={portrait.kind}
              name={portrait.name}
              lifeFormId={portrait.lifeFormId}
              description={portrait.description}
              sizeClass="w-20 h-20"
              allowAiGeneration={false}
            />
          )}
          {itemSprite && (
            itemSprite.category === 'resource' ? (
              <ResourceSprite resourceId={itemSprite.id} size={72} />
            ) : (
              <EquipmentSprite category={itemSprite.category} itemId={itemSprite.id} size={72} />
            )
          )}
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase tracking-[0.18em] text-cyan-300/90">{kicker}</div>
            <h3 className={`font-display text-2xl font-bold leading-tight ${titleClass}`}>{title}</h3>
            {chips.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {chips.map((chip) => (
                  <span key={chip.label} className={`px-1.5 py-0.5 rounded border text-[10px] font-semibold ${chip.className}`}>
                    {chip.label}
                  </span>
                ))}
              </div>
            )}
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg border border-cyan-500/40 bg-slate-950/70 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="p-4 space-y-3">
        {sections.length > 0
          ? sections.map((sec) => (
              <div key={sec.key} className={`rounded-xl border p-3.5 space-y-1.5 ${sec.accentClass}`}>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
                  {sec.icon}
                  <span className="text-slate-400">{sec.symbol}</span>
                  <span>{sec.title}</span>
                </div>
                <div className="text-[13px] leading-relaxed text-slate-200">{sec.body}</div>
              </div>
            ))
          : paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 64)} className="text-sm leading-relaxed text-slate-200 border-l-2 border-cyan-500/30 pl-3">
                {paragraph}
              </p>
            ))}
      </div>
    </aside>
  );
}
