import type {
  HabitabilityFactors,
  MineralDeposit,
  Mission,
  MissionType,
  PlanetData,
  PlayerCampaignState,
  StarSystemSummary,
  VisualNovelNode,
} from '../types/game';
import { FACTIONS_BY_ID, LIFE_FORMS_BY_ID, SPECIES_BY_ID } from '../data/lifeforms';
import { BLUEPRINTS_BY_ID, RESOURCES_BY_ID } from '../data/items';
import {
  FACTION_ORIGIN_CHOICES,
  LIFEFORM_ORIGIN_CHOICES,
  SPECIES_STAGE1_CHOICES,
  SPECIES_STAGE3_CHOICES,
} from '../data/originPerks';
import { generateSolarSystem, getSystemsInRadius, getSystemSummaryById } from '../data/universe';
import { getEffectiveSystemSummary, getFactionOwnedSystems } from '../engine/galacticWar';
import { baseMarketStockForRarity } from '../engine/market';
import { SeededRNG } from '../utils/rng';

export function buildOpeningVisualNovel(
  speciesId: string,
  factionId: string,
  playerName: string
): VisualNovelNode[] {
  const sp = SPECIES_BY_ID[speciesId];
  const fac = FACTIONS_BY_ID[factionId];
  const lf = LIFE_FORMS_BY_ID[sp.lifeFormId];

  const spStage1 = SPECIES_STAGE1_CHOICES[sp.id] ?? [];
  const lfStage2 = LIFEFORM_ORIGIN_CHOICES[sp.lifeFormId] ?? [];
  const spStage3 = SPECIES_STAGE3_CHOICES[sp.id] ?? [];
  const facStage4 = FACTION_ORIGIN_CHOICES[fac.id] ?? [];

  return [
    {
      id: 'open_1',
      isOpening: true,
      stepIndex: 1,
      totalSteps: 4,
      stageTitle: 'Herança da Raça · Formação',
      stageFocusName: sp.name,
      accentColor: sp.color,
      speakerName: `Mentor Ancestral (${sp.name})`,
      speakerTitle: `Etapa 1 de 4 · Linhagem ${sp.name}`,
      speciesId: sp.id,
      cardId: `species_${sp.id}`,
      cardKind: 'species',
      lifeFormName: lf.name,
      text: `${playerName}, antes de desatracar sua nave, o conselho dos ${sp.name} concede a primeira marca da sua linhagem. Escolha qual legado exclusivo da sua raça definirá o início da sua jornada (${sp.traits.join(' · ')}):`,
      choices: spStage1,
    },
    {
      id: 'open_2',
      isOpening: true,
      stepIndex: 2,
      totalSteps: 4,
      stageTitle: 'Biologia da Forma de Vida',
      stageFocusName: lf.name,
      accentColor: lf.color,
      speakerName: `Xenobiologista de Bordo (${lf.name})`,
      speakerTitle: `Etapa 2 de 4 · Natureza ${lf.name}`,
      speciesId: sp.id,
      cardId: `species_${sp.id}`,
      cardKind: 'species',
      lifeFormName: lf.name,
      text: `Sua biologia ${lf.name} (${lf.biology}) molda como você sobrevive ao vácuo, aos mundos hostis e ao combate estelar. Qual adaptação exclusiva da forma de vida ${lf.name} deseja despertar agora?`,
      choices: lfStage2,
    },
    {
      id: 'open_3',
      isOpening: true,
      stepIndex: 3,
      totalSteps: 4,
      stageTitle: 'Arsenal & Embarcação da Raça',
      stageFocusName: sp.name,
      accentColor: sp.color,
      speakerName: `Mestre de Estaleiro (${sp.name})`,
      speakerTitle: `Etapa 3 de 4 · Equipamento Exclusivo ${sp.name}`,
      speciesId: sp.id,
      cardId: `species_${sp.id}`,
      cardKind: 'species',
      lifeFormName: lf.name,
      text: `Os arsenais reservados exclusivamente aos cidadãos ${sp.name} foram abertos para a sua expedição. Escolha entre assumir a Nave Especial da raça, carregar consumíveis exclusivos ${sp.name} ou instalar tecnologia avançada:`,
      choices: spStage3,
    },
    {
      id: 'open_4',
      isOpening: true,
      stepIndex: 4,
      totalSteps: 4,
      stageTitle: 'Doutrina da Facção Regente',
      stageFocusName: fac.name,
      accentColor: fac.color,
      speakerName: `Chanceler de ${fac.name}`,
      speakerTitle: `Etapa 4 de 4 · ${fac.axis} · Foco: ${fac.economyFocus}`,
      speciesId: sp.id,
      cardId: `species_${sp.id}`,
      cardKind: 'species',
      lifeFormName: lf.name,
      text: `${playerName}, como representante oficial de ${fac.name} ("${fac.customs}"), esta última escolha sela sua doutrina política antes do comando completo da ponte de voo. Selecione seu privilégio exclusivo de facção para iniciar o jogo:`,
      choices: facStage4,
    },
  ];
}

export function buildLevel2ContactDialogue(planet: PlanetData, state: PlayerCampaignState): VisualNovelNode {
  const sp = planet.speciesId ? SPECIES_BY_ID[planet.speciesId] : SPECIES_BY_ID[state.chosenSpeciesId];
  const lf = LIFE_FORMS_BY_ID[sp.lifeFormId];
  return {
    id: `contact_${planet.id}`,
    speakerName: `Emissário de ${planet.name}`,
    speakerTitle: `Civilização Pré-Estelar (Nível 2) · ${sp.name}`,
    speciesId: sp.id,
    cardId: `species_${sp.id}`,
    cardKind: 'species',
    lifeFormName: lf.name,
    text: `Os líderes planetários de ${planet.name} captaram sua nave em órbita. Ainda desconectados da rede galáctica, eles observam com assombro e cautela. Como você conduzirá este contato?`,
    choices: [
      {
        id: 'lvl2_tech',
        label: 'Compartilhar projetos agrícolas e energia limpa',
        hint: 'Evolui planeta (chance de Nível 3) · +18 Reputação · +320 Créditos',
        consequenceText: 'A sociedade local acelera sua transição tecnológica com gratidão.',
        effects: {
          creditsDelta: 320,
          renownDelta: 18,
          factionId: state.chosenFactionId,
          planetEvolve: true,
        },
      },
      {
        id: 'lvl2_trade',
        label: 'Trocar manufaturados por recursos naturais brutos',
        hint: '+650 Créditos · +6 Compostos Orgânicos',
        consequenceText: 'Escambo vantajoso realizado por cápsulas de carga orbitais.',
        effects: {
          creditsDelta: 650,
          giveResourceId: 'compostos_organicos',
          giveResourceQty: 6,
        },
      },
      {
        id: 'lvl2_extract',
        label: 'Impor tratado de extração intensiva',
        hint: '+1100 Créditos · Risco de colapso ecológico · -15 Reputação',
        consequenceText: 'Lucro imediato alto, mas o ecossistema local sofre forte impacto.',
        effects: {
          creditsDelta: 1100,
          renownDelta: -15,
          factionId: state.chosenFactionId,
          planetCollapse: true,
        },
      },
      {
        id: 'lvl2_ground',
        label: 'Descer e impor presença armada',
        hint: 'Combate em solo · a saúde da tripulação absorve o dano',
        consequenceText: 'O destacamento desce. O fogo cruzado não fura o casco — fere quem pisa o chão.',
        effects: {
          creditsDelta: 180,
          renownDelta: -6,
          factionId: state.chosenFactionId,
          crewHealthDelta: -22,
        },
      },
    ],
  };
}

export function generateMissionsForFaction(
  factionId: string,
  currentSystem: StarSystemSummary,
  state: PlayerCampaignState,
  count = 4
): Mission[] {
  const fac = FACTIONS_BY_ID[factionId];
  if (!fac) return [];
  const rng = new SeededRNG(currentSystem.seed + Math.floor(state.gameTimeSeconds / 120) + factionId.length * 17);
  const nearby = getSystemsInRadius(currentSystem, 42).filter((s) => !s.isBlackHole);
  if (nearby.length === 0) return [];

  const warOpponents = (state.activeWars[factionId] ?? []).filter((id) => Boolean(FACTIONS_BY_ID[id]));
  const warMissions: Mission[] = [];

  if (warOpponents.length > 0) {
    const warBpPool = [
      `bp_fac_${factionId}`,
      'bp_corveta_patrulha',
      'bp_cruzador_guerra',
      'bp_fragata_metalocto',
    ].filter((id): id is string => Boolean(BLUEPRINTS_BY_ID[id]));
    const unownedWarBps = warBpPool.filter((id) => !state.blueprintsOwned.includes(id));
    const pickWarBp = (chance: number) => {
      if (warBpPool.length === 0 || rng.next() >= chance) return undefined;
      return rng.pick(unownedWarBps.length > 0 ? unownedWarBps : warBpPool);
    };

    const effectiveCurrent = getEffectiveSystemSummary(currentSystem, state);
    const friendlyNearby = nearby
      .map((s) => getEffectiveSystemSummary(s, state))
      .filter(
        (s) =>
          !s.isBlackHole &&
          (s.controllingFactionId === factionId || s.controllingFactionId === state.chosenFactionId)
      );

    // 1) Missão de Guerra Defensiva (no sistema do jogador / facção aliada)
    const defEnemyId = rng.pick(warOpponents);
    const defEnemyFac = FACTIONS_BY_ID[defEnemyId];
    const currentIsFriendly =
      effectiveCurrent.controllingFactionId === factionId ||
      effectiveCurrent.controllingFactionId === state.chosenFactionId;
    const defSys =
      currentIsFriendly && (friendlyNearby.length <= 1 || rng.next() < 0.65)
        ? effectiveCurrent
        : friendlyNearby.length > 0
        ? rng.pick(friendlyNearby)
        : effectiveCurrent;
    const defDist = Math.max(
      2,
      Math.hypot(defSys.x - currentSystem.x, defSys.y - currentSystem.y, defSys.z - currentSystem.z)
    );
    const defEnemyCount = rng.pick([1, 2, 2, 3]);
    const defBpId = pickWarBp(0.55);
    const defBpDef = defBpId ? BLUEPRINTS_BY_ID[defBpId] : undefined;
    const defBpText = defBpDef ? ` · Recompensa: ${defBpDef.name}` : '';
    const defEnemyName = rng.pick([
      'Incursor de Guerra',
      'Esquadra Invasora',
      'Corsário de Cerco',
      'Frota de Raide',
    ]);

    warMissions.push({
      id: `mis_war_def_${currentSystem.id}_${factionId}_${Math.floor(state.gameTimeSeconds / 120)}`,
      title: `Defesa de Guerra: ${defSys.name}`,
      type: 'guerra',
      warKind: 'defensiva',
      issuerFactionId: factionId,
      targetFactionId: defEnemyId,
      targetSystemId: defSys.id,
      targetSystemName: defSys.name,
      targetSystemCoord: { x: defSys.x, y: defSys.y, z: defSys.z },
      targetEnemyName: defEnemyName,
      warEnemyCount: defEnemyCount,
      warEnemiesDefeated: 0,
      targetEnemyDefeated: false,
      rewardCredits: Math.round((460 + defDist * 26) * (1 + (defEnemyCount - 1) * 0.45)),
      rewardRenown: rng.int(16, 26) + defEnemyCount * 3,
      rewardBlueprintId: defBpId,
      rewardItemName: defBpDef?.name,
      isRivalTerritory: false,
      status: 'disponivel',
      description: `Missão defensiva em ${defSys.name}: derrotar ${defEnemyCount} nave(s) de ${defEnemyFac?.name ?? 'facção inimiga'} que ameaçam o setor.${defBpText}`,
    });

    // 2) Missão de Guerra Ofensiva (no sistema do inimigo)
    const offEnemyId = rng.pick(warOpponents);
    const offEnemyFac = FACTIONS_BY_ID[offEnemyId];
    const enemyOwned = getFactionOwnedSystems(offEnemyId, state).sort((a, b) => {
      const da = Math.hypot(a.x - currentSystem.x, a.y - currentSystem.y, a.z - currentSystem.z);
      const db = Math.hypot(b.x - currentSystem.x, b.y - currentSystem.y, b.z - currentSystem.z);
      return da - db;
    });
    if (enemyOwned.length > 0) {
      const offSys = rng.pick(enemyOwned.slice(0, Math.min(6, enemyOwned.length)));
      const offDist = Math.max(
        4,
        Math.hypot(offSys.x - currentSystem.x, offSys.y - currentSystem.y, offSys.z - currentSystem.z)
      );
      const offEnemyCount = rng.pick([1, 2, 2, 3]);
      const offBpId = pickWarBp(0.65);
      const offBpDef = offBpId ? BLUEPRINTS_BY_ID[offBpId] : undefined;
      const offBpText = offBpDef ? ` · Recompensa: ${offBpDef.name}` : '';
      const offEnemyName = rng.pick([
        'Guarnição Estelar',
        'Patrulha de Fronteira',
        'Cruzador de Defesa',
        'Esquadra Hostil',
      ]);

      warMissions.push({
        id: `mis_war_off_${currentSystem.id}_${factionId}_${Math.floor(state.gameTimeSeconds / 120)}`,
        title: `Ofensiva: ${offSys.name}`,
        type: 'guerra',
        warKind: 'ofensiva',
        issuerFactionId: factionId,
        targetFactionId: offEnemyId,
        targetSystemId: offSys.id,
        targetSystemName: offSys.name,
        targetSystemCoord: { x: offSys.x, y: offSys.y, z: offSys.z },
        targetEnemyName: offEnemyName,
        warEnemyCount: offEnemyCount,
        warEnemiesDefeated: 0,
        targetEnemyDefeated: false,
        rewardCredits: Math.round((560 + offDist * 30) * (1 + (offEnemyCount - 1) * 0.45) * 1.65),
        rewardRenown: rng.int(20, 32) + offEnemyCount * 3,
        rewardBlueprintId: offBpId,
        rewardItemName: offBpDef?.name,
        isRivalTerritory: true,
        status: 'disponivel',
        description: `Missão ofensiva no território de ${offEnemyFac?.name ?? 'inimigo'}: viajar até ${offSys.name} e derrotar ${offEnemyCount} nave(s) inimiga(s).${offBpText}`,
      });
    }

    // 3) Missão de Bombardeio Planetário (apenas para facções militares em guerra)
    if (fac.axis === 'Militar') {
      const orderedOpponents = [rng.pick(warOpponents), ...warOpponents].filter(
        (id, idx, arr) => arr.indexOf(id) === idx
      );
      let bombEnemyId: string | null = null;
      let bombSys: StarSystemSummary | null = null;
      let bombPlanet: PlanetData | null = null;

      for (const oppId of orderedOpponents) {
        const oppSystems = getFactionOwnedSystems(oppId, state).sort((a, b) => {
          const da = Math.hypot(a.x - currentSystem.x, a.y - currentSystem.y, a.z - currentSystem.z);
          const db = Math.hypot(b.x - currentSystem.x, b.y - currentSystem.y, b.z - currentSystem.z);
          return da - db;
        });
        for (const candSys of oppSystems.slice(0, 15)) {
          const full = generateSolarSystem(candSys);
          const highWorlds = full.planets.filter((pl) => getPlanetCurrentLevel(pl, state) >= 3);
          const lvl2Worlds = full.planets.filter((pl) => getPlanetCurrentLevel(pl, state) >= 2);
          const pool = highWorlds.length > 0 ? highWorlds : lvl2Worlds;
          if (pool.length > 0) {
            bombEnemyId = oppId;
            bombSys = candSys;
            bombPlanet = rng.pick(pool);
            break;
          }
        }
        if (bombSys && bombPlanet) break;
      }

      if (bombEnemyId && bombSys && bombPlanet) {
        const bombEnemyFac = FACTIONS_BY_ID[bombEnemyId];
        const bombDist = Math.max(
          4,
          Math.hypot(bombSys.x - currentSystem.x, bombSys.y - currentSystem.y, bombSys.z - currentSystem.z)
        );
        const bombBpId = pickWarBp(0.75);
        const bombBpDef = bombBpId ? BLUEPRINTS_BY_ID[bombBpId] : undefined;
        const bombBpText = bombBpDef ? ` · Recompensa: ${bombBpDef.name}` : '';

        warMissions.push({
          id: `mis_war_bomb_${currentSystem.id}_${factionId}_${Math.floor(state.gameTimeSeconds / 120)}`,
          title: `Bombardeio Orbital: ${bombPlanet.name}`,
          type: 'guerra',
          warKind: 'bombardeio',
          issuerFactionId: factionId,
          targetFactionId: bombEnemyId,
          targetSystemId: bombSys.id,
          targetSystemName: bombSys.name,
          targetSystemCoord: { x: bombSys.x, y: bombSys.y, z: bombSys.z },
          targetPlanetId: bombPlanet.id,
          targetPlanetName: bombPlanet.name,
          bombardCompleted: false,
          rewardCredits: Math.round((780 + bombDist * 32) * 1.85),
          rewardRenown: rng.int(26, 38),
          rewardBlueprintId: bombBpId,
          rewardItemName: bombBpDef?.name,
          isRivalTerritory: true,
          status: 'disponivel',
          description: `Operação militar: entrar em órbita de ${bombPlanet.name} (${bombSys.name}, ${bombEnemyFac?.name ?? 'inimigo'}) e executar Bombardeio Orbital (exige arma de bombardeio).${bombBpText}`,
        });
      }
    }
  }

  const types: MissionType[] = [
    'entrega_comercio',
    'coleta_raro',
    'escanear_planeta',
    'escanear_criatura',
    'contato_nivel2',
    'resgate_escolta',
    'combate',
    'cadeia_faccao',
  ];

  const missions: Mission[] = [...warMissions];
  for (let i = 0; i < count; i++) {
    let type = rng.pick(types);
    let targetSys = rng.pick(nearby);
    let fullTarget = generateSolarSystem(targetSys);

    // Ensure contato_nivel2 always targets a system that actually has a Level 2 planet
    if (type === 'contato_nivel2') {
      const validLvl2 = nearby.filter((s) =>
        generateSolarSystem(s).planets.some((pl) => pl.level === 2)
      );
      if (validLvl2.length > 0) {
        targetSys = rng.pick(validLvl2);
        fullTarget = generateSolarSystem(targetSys);
      } else {
        type = 'escanear_planeta';
      }
    }

    // Ensure escanear_criatura never targets a Level 5 capital or sterile planet with 0 creatures
    if (type === 'escanear_criatura') {
      const validBio = nearby.filter((s) =>
        generateSolarSystem(s).planets.some((pl) => pl.creatureIds.length > 0 && pl.level < 5)
      );
      if (validBio.length > 0) {
        targetSys = rng.pick(validBio);
        fullTarget = generateSolarSystem(targetSys);
      } else {
        type = 'escanear_planeta';
      }
    }

    const dist = Math.max(4, Math.hypot(targetSys.x - currentSystem.x, targetSys.y - currentSystem.y, targetSys.z - currentSystem.z));
    const targetPlanet = fullTarget.planets.length > 0 ? rng.pick(fullTarget.planets) : undefined;
    const isSpecificPlanet = Boolean(targetPlanet);

    const targetFactionId = targetSys.controllingFactionId ?? undefined;
    const isRivalTerritory = Boolean(
      targetFactionId &&
        (fac.warsWith.includes(targetFactionId) ||
          (FACTIONS_BY_ID[targetFactionId]?.speciesId !== fac.speciesId && !fac.alliedWith.includes(targetFactionId)))
    );

    // Section 19 payout formula:
    // Grows with distance + 45% if specific planet + 2.25x if target is in rival/war faction territory
    let rewardCredits = Math.round((280 + dist * 28) * (isSpecificPlanet ? 1.45 : 1) * (isRivalTerritory ? 2.25 : 1));
    const rewardRenown = rng.int(12, 24);

    // Pick candidate ship blueprint rewards (faction ships + chassis blueprints)
    const shipBpPool = [
      `bp_fac_${factionId}`,
      targetFactionId ? `bp_fac_${targetFactionId}` : null,
      'bp_explorador_silvar',
      'bp_cargueiro_mercantil',
      'bp_corveta_patrulha',
      'bp_cruzador_guerra',
      'bp_fragata_metalocto',
    ].filter((id): id is string => Boolean(id && BLUEPRINTS_BY_ID[id]));
    const unownedShipBps = shipBpPool.filter((id) => !state.blueprintsOwned.includes(id));
    const shouldGrantBlueprint =
      type === 'combate' ||
      type === 'cadeia_faccao' ||
      type === 'resgate_escolta' ||
      rng.next() < 0.45;
    const rewardBlueprintId =
      shouldGrantBlueprint && shipBpPool.length > 0
        ? rng.pick(unownedShipBps.length > 0 ? unownedShipBps : shipBpPool)
        : undefined;
    const rewardBpDef = rewardBlueprintId ? BLUEPRINTS_BY_ID[rewardBlueprintId] : undefined;
    const bpText = rewardBpDef ? ` · Recompensa: ${rewardBpDef.name}` : '';

    if (type === 'entrega_comercio' || type === 'coleta_raro') {
      const resPool = type === 'coleta_raro'
        ? ['ouro', 'platina', 'helio_3', 'diamante', 'cristais_energeticos', 'aerogel_vivo']
        : ['ferro', 'cobre', 'agua', 'titanio', 'biomassa', 'hidrogenio'];
      const resId = rng.pick(resPool);
      const res = RESOURCES_BY_ID[resId];
      const qty = type === 'coleta_raro' ? rng.int(4, 10) : rng.int(8, 18);
      rewardCredits += res.basePrice * qty;

      const deliveryPlanet = targetPlanet ?? fullTarget.planets[0];
      missions.push({
        id: `mis_${currentSystem.id}_${i}_${rng.int(100, 999)}`,
        title: type === 'coleta_raro' ? `Coleta Rara: ${res.name}` : `Entrega Comercial: ${res.name}`,
        type,
        issuerFactionId: factionId,
        targetFactionId,
        targetSystemId: targetSys.id,
        targetSystemName: targetSys.name,
        targetSystemCoord: { x: targetSys.x, y: targetSys.y, z: targetSys.z },
        targetPlanetId: deliveryPlanet?.id,
        targetPlanetName: deliveryPlanet?.name,
        requiredResourceId: resId,
        requiredResourceName: res.name,
        requiredQty: qty,
        rewardCredits,
        rewardRenown,
        rewardBlueprintId,
        rewardItemName: rewardBpDef?.name,
        isRivalTerritory,
        status: 'disponivel',
        description: `Entregar ${qty}x ${res.name} em órbita de ${deliveryPlanet?.name ?? targetSys.name} (${targetSys.name}).${bpText}`,
      });
    } else if (type === 'combate') {
      const enemyNames = ['Corsário Renegado', 'Fragata Infiltradora', 'Interceptor Hostil', 'Saqueador de Fronteira'];
      const enemyName = rng.pick(enemyNames);
      missions.push({
        id: `mis_${currentSystem.id}_${i}_${rng.int(100, 999)}`,
        title: `Interceptação: ${enemyName}`,
        type: 'combate',
        issuerFactionId: factionId,
        targetFactionId,
        targetSystemId: targetSys.id,
        targetSystemName: targetSys.name,
        targetSystemCoord: { x: targetSys.x, y: targetSys.y, z: targetSys.z },
        targetEnemyName: enemyName,
        targetEnemyScore: rng.int(80, 190),
        targetEnemyDefeated: false,
        rewardCredits: Math.round(rewardCredits * 1.35),
        rewardRenown: rewardRenown + 6,
        rewardBlueprintId,
        rewardItemName: rewardBpDef?.name,
        isRivalTerritory,
        status: 'disponivel',
        description: `Localizar e derrotar ${enemyName} no sistema ${targetSys.name}.${bpText}`,
      });
    } else if (type === 'escanear_planeta' || type === 'escanear_criatura') {
      const bioPlanets = fullTarget.planets.filter((pl) => pl.creatureIds.length > 0 && pl.level < 5);
      const p =
        type === 'escanear_criatura'
          ? (bioPlanets.length > 0 ? rng.pick(bioPlanets) : targetPlanet ?? fullTarget.planets[0])
          : (targetPlanet ?? fullTarget.planets[0]);
      missions.push({
        id: `mis_${currentSystem.id}_${i}_${rng.int(100, 999)}`,
        title: type === 'escanear_criatura' ? `Catálogo Biológico em ${targetSys.name}` : `Mapeamento de ${p?.name ?? targetSys.name}`,
        type,
        issuerFactionId: factionId,
        targetFactionId,
        targetSystemId: targetSys.id,
        targetSystemName: targetSys.name,
        targetSystemCoord: { x: targetSys.x, y: targetSys.y, z: targetSys.z },
        targetPlanetId: p?.id,
        targetPlanetName: p?.name,
        planetScanned: false,
        creatureScanned: false,
        rewardCredits,
        rewardRenown,
        rewardBlueprintId,
        rewardItemName: rewardBpDef?.name,
        isRivalTerritory,
        status: 'disponivel',
        description:
          (type === 'escanear_criatura'
            ? `Escanear e catalogar uma nova criatura em ${p?.name ?? targetSys.name} (${targetSys.name}).`
            : `Viajar até a órbita de ${p?.name ?? targetSys.name} (${targetSys.name}) e realizar escaneamento completo.`) + bpText,
      });
    } else if (type === 'contato_nivel2') {
      const lvl2Planets = fullTarget.planets.filter((pl) => pl.level === 2);
      const p = lvl2Planets.length > 0 ? rng.pick(lvl2Planets) : targetPlanet ?? fullTarget.planets[0];
      missions.push({
        id: `mis_${currentSystem.id}_${i}_${rng.int(100, 999)}`,
        title: `Primeiro Contato Diplomático`,
        type: 'contato_nivel2',
        issuerFactionId: factionId,
        targetFactionId,
        targetSystemId: targetSys.id,
        targetSystemName: targetSys.name,
        targetSystemCoord: { x: targetSys.x, y: targetSys.y, z: targetSys.z },
        targetPlanetId: p?.id,
        targetPlanetName: p?.name,
        contactCompleted: false,
        rewardCredits: Math.round(rewardCredits * 1.2),
        rewardRenown: rewardRenown + 5,
        rewardBlueprintId,
        rewardItemName: rewardBpDef?.name,
        isRivalTerritory,
        status: 'disponivel',
        description: `Estabelecer contato por diálogo em órbita de ${p?.name ?? targetSys.name} (${targetSys.name}).${bpText}`,
      });
    } else {
      const isChain = type === 'cadeia_faccao';
      const p = targetPlanet ?? fullTarget.planets[0];
      missions.push({
        id: `mis_${currentSystem.id}_${i}_${rng.int(100, 999)}`,
        title: isChain ? `Operação Estratégica da Facção (1/3)` : `Resgate & Escolta Orbital`,
        type,
        issuerFactionId: factionId,
        targetFactionId,
        targetSystemId: targetSys.id,
        targetSystemName: targetSys.name,
        targetSystemCoord: { x: targetSys.x, y: targetSys.y, z: targetSys.z },
        targetPlanetId: p?.id,
        targetPlanetName: p?.name,
        rescueCompleted: false,
        chainStep: isChain ? 1 : undefined,
        chainTotal: isChain ? 3 : undefined,
        rewardCredits: Math.round(rewardCredits * (isChain ? 2.1 : 1.15)),
        rewardRenown: rewardRenown + (isChain ? 14 : 4),
        rewardBlueprintId,
        rewardItemName: rewardBpDef?.name,
        isRivalTerritory,
        status: 'disponivel',
        description: (isChain
          ? `Operação em cadeia (Etapa 1/3): reconhecer a órbita de ${p?.name ?? targetSys.name} (${targetSys.name}) para avançar às próximas etapas. Recompensa final entregue ao concluir as 3 etapas.`
          : `Responder ao sinal de socorro em ${p?.name ?? targetSys.name} (${targetSys.name}) e escoltar sobreviventes.`) + bpText,
      });
    }
  }

  return missions;
}

export function getRenownTierName(renown: number, isFormalAlly: boolean): string {
  if (isFormalAlly) return 'Aliança Formal';
  if (renown <= -30) return 'Hostil';
  if (renown < 0) return 'Rival';
  if (renown === 0) return 'Neutro';
  if (renown < 20) return 'Conhecido';
  if (renown < 50) return 'Aliado';
  if (renown < 80) return 'Confiável';
  return 'Honrado';
}

export function getSystemHostileStatus(
  sys: StarSystemSummary,
  state: PlayerCampaignState
): boolean {
  if (!sys.controllingFactionId) return false;
  const renown = state.factionRenown[sys.controllingFactionId] ?? 0;
  if (renown < 0) return true;
  const owner = sys.controllingFactionId;
  const actorIds = new Set<string>([state.chosenFactionId]);
  for (const ship of state.ships) {
    if (ship.factionId) actorIds.add(ship.factionId);
  }
  for (const id of actorIds) {
    if ((state.activeWars[id] ?? []).includes(owner)) return true;
    if ((state.activeWars[owner] ?? []).includes(id)) return true;
  }
  return false;
}

export function checkMissionReadyInLocation(
  mission: Mission,
  state: PlayerCampaignState
): { ready: boolean; reason: string } {
  if (mission.type === 'guerra') {
    if (mission.warKind === 'bombardeio') {
      if (mission.bombardCompleted) {
        return { ready: true, reason: 'Bombardeio orbital executado! Pronta para entrega.' };
      }
      if (state.currentSystemId !== mission.targetSystemId) {
        return {
          ready: false,
          reason: `Viaje até ${mission.targetSystemName} para bombardear ${mission.targetPlanetName ?? 'o planeta alvo'}.`,
        };
      }
      if (mission.targetPlanetId && state.orbitingPlanetId !== mission.targetPlanetId) {
        return {
          ready: false,
          reason: `Entre em órbita de ${mission.targetPlanetName ?? 'planeta alvo'} para bombardear.`,
        };
      }
      return {
        ready: false,
        reason: `Execute Bombardeio Orbital em ${mission.targetPlanetName ?? 'este planeta'} (aba Bombardear).`,
      };
    }

    const total = Math.max(1, mission.warEnemyCount ?? 1);
    const done = Math.min(total, mission.warEnemiesDefeated ?? (mission.targetEnemyDefeated ? total : 0));
    if (mission.targetEnemyDefeated || done >= total) {
      return { ready: true, reason: 'Esquadra inimiga derrotada! Pronta para concluir.' };
    }
    const enemyFacName = mission.targetFactionId
      ? FACTIONS_BY_ID[mission.targetFactionId]?.name ?? 'inimigos'
      : 'inimigos';
    if (state.currentSystemId !== mission.targetSystemId) {
      return {
        ready: false,
        reason: `Viaje até ${mission.targetSystemName} e derrote ${total - done} nave(s) de ${enemyFacName} (${done}/${total}).`,
      };
    }
    return {
      ready: false,
      reason: `Derrote ${total - done} nave(s) de ${enemyFacName} neste sistema (${done}/${total}).`,
    };
  }

  if (state.currentSystemId !== mission.targetSystemId) {
    return {
      ready: false,
      reason: `Viaje até o sistema ${mission.targetSystemName} para concluir.`,
    };
  }
  if (mission.targetPlanetId && state.orbitingPlanetId !== mission.targetPlanetId) {
    return {
      ready: false,
      reason: `Entre em órbita de ${mission.targetPlanetName ?? 'planeta alvo'} para concluir.`,
    };
  }
  if ((mission.type === 'entrega_comercio' || mission.type === 'coleta_raro') && mission.requiredResourceId) {
    const inCargo = state.cargo.find((c) => c.resourceId === mission.requiredResourceId)?.qty ?? 0;
    const req = mission.requiredQty ?? 1;
    if (inCargo < req) {
      return {
        ready: false,
        reason: `Faltam ${req - inCargo} ${mission.requiredResourceName} no compartimento de carga.`,
      };
    }
  }
  if (
    (mission.type === 'combate' || (mission.type === 'evento_narrativo' && Boolean(mission.targetEnemyName))) &&
    !mission.targetEnemyDefeated
  ) {
    return {
      ready: false,
      reason: `Derrote ${mission.targetEnemyName ?? 'o alvo'} neste sistema.`,
    };
  }
  if (mission.type === 'escanear_planeta' && mission.targetPlanetId && !state.scannedPlanetIds.includes(mission.targetPlanetId)) {
    return {
      ready: false,
      reason: `Escaneie o planeta ${mission.targetPlanetName} em órbita.`,
    };
  }
  if (mission.type === 'escanear_criatura' && !mission.creatureScanned) {
    return {
      ready: false,
      reason: `Desça à superfície de ${mission.targetPlanetName ?? 'planeta'} e catalogue uma criatura.`,
    };
  }
  if (mission.type === 'cadeia_faccao' && (mission.chainStep ?? 1) < (mission.chainTotal ?? 3)) {
    const step = mission.chainStep ?? 1;
    const total = mission.chainTotal ?? 3;
    return {
      ready: true,
      reason: `Etapa ${step}/${total} cumprida no local! Avance para a próxima etapa.`,
    };
  }
  return { ready: true, reason: 'Pronta para entrega no local!' };
}

export function getMissionColoredSummary(mission: Mission): Array<{ text: string; tone: 'normal' | 'item' | 'loc' }> {
  const loc = mission.targetPlanetName
    ? `${mission.targetPlanetName} (${mission.targetSystemName})`
    : mission.targetSystemName;

  if (mission.type === 'entrega_comercio' || mission.type === 'coleta_raro') {
    return [
      { text: 'Entregar ', tone: 'normal' },
      { text: `${mission.requiredQty}x ${mission.requiredResourceName}`, tone: 'item' },
      { text: ' em ', tone: 'normal' },
      { text: loc, tone: 'loc' },
    ];
  }
  if (mission.type === 'combate') {
    return [
      { text: 'Derrotar ', tone: 'normal' },
      { text: `${mission.targetEnemyName}`, tone: 'item' },
      { text: ' em ', tone: 'normal' },
      { text: loc, tone: 'loc' },
    ];
  }
  if (mission.type === 'guerra') {
    if (mission.warKind === 'bombardeio') {
      return [
        { text: 'Bombardear ', tone: 'normal' },
        { text: mission.targetPlanetName ?? 'planeta inimigo', tone: 'item' },
        { text: ' em ', tone: 'normal' },
        { text: mission.targetSystemName, tone: 'loc' },
      ];
    }
    const total = Math.max(1, mission.warEnemyCount ?? 1);
    const done = Math.min(total, mission.warEnemiesDefeated ?? (mission.targetEnemyDefeated ? total : 0));
    const enemyFacName = mission.targetFactionId ? FACTIONS_BY_ID[mission.targetFactionId]?.name ?? 'inimigo' : 'inimigo';
    if (mission.warKind === 'defensiva') {
      return [
        { text: 'Defender ', tone: 'normal' },
        { text: loc, tone: 'loc' },
        { text: ' · ', tone: 'normal' },
        { text: `${total} nave(s) (${done}/${total}) · ${enemyFacName}`, tone: 'item' },
      ];
    }
    return [
      { text: 'Atacar ', tone: 'normal' },
      { text: `${total} nave(s) (${done}/${total}) · ${enemyFacName}`, tone: 'item' },
      { text: ' em ', tone: 'normal' },
      { text: loc, tone: 'loc' },
    ];
  }
  if (mission.type === 'evento_narrativo') {
    if (mission.targetEnemyName) {
      return [
        { text: 'Enfrentar ', tone: 'normal' },
        { text: `${mission.targetEnemyName}`, tone: 'item' },
        { text: ' em ', tone: 'normal' },
        { text: loc, tone: 'loc' },
      ];
    }
    return [
      { text: `${mission.title} em `, tone: 'normal' },
      { text: loc, tone: 'loc' },
    ];
  }
  if (mission.type === 'escanear_planeta') {
    return [
      { text: 'Escanear planeta ', tone: 'normal' },
      { text: loc, tone: 'loc' },
    ];
  }
  if (mission.type === 'escanear_criatura') {
    return [
      { text: 'Escanear ', tone: 'normal' },
      { text: 'criatura', tone: 'item' },
      { text: ' em ', tone: 'normal' },
      { text: loc, tone: 'loc' },
    ];
  }
  if (mission.type === 'cadeia_faccao') {
    const step = mission.chainStep ?? 1;
    const total = mission.chainTotal ?? 3;
    return [
      { text: `Etapa ${step}/${total} — reconhecer órbita de `, tone: 'normal' },
      { text: loc, tone: 'loc' },
    ];
  }
  return [
    { text: mission.title + ' · ', tone: 'normal' },
    { text: loc, tone: 'loc' },
  ];
}

export function getPlanetCurrentLevel(planet: PlanetData, state: PlayerCampaignState): number {
  return state.planetOverrides[planet.id]?.level ?? planet.level;
}

export function destroyedWorldDeposits(planet: PlanetData): MineralDeposit[] {
  const enxofreAmt = baseMarketStockForRarity(RESOURCES_BY_ID['enxofre']?.rarity ?? 'incomum');
  const magmaAmt = baseMarketStockForRarity(RESOURCES_BY_ID['magma']?.rarity ?? 'raro');
  return [
    {
      id: `${planet.id}_ruin_enxofre`,
      resourceId: 'enxofre',
      remaining: enxofreAmt,
      maxAmount: enxofreAmt,
      hiddenUntilHighScan: false,
    },
    {
      id: `${planet.id}_ruin_magma`,
      resourceId: 'magma',
      remaining: magmaAmt,
      maxAmount: magmaAmt,
      hiddenUntilHighScan: false,
    },
  ];
}
export function ruinedHabitability(planet: PlanetData): HabitabilityFactors {
  const collapsedG = Math.round(Math.max(0.18, planet.habitability.gravityG * 0.62) * 100) / 100;
  return {
    score: 0,
    temperatureC: Math.max(680, Math.abs(planet.habitability.temperatureC) + 420),
    tempVariation: 'Crosta vitrificada, sem ciclo climático',
    atmosphere: 'Ausente — queimada na devastação',
    water: 'ausente',
    gravityG: collapsedG,
    radiationLevel: 100,
    geologicalStability: 0,
    threats: ['Inabitável', 'Crosta destruída', 'Cinzas radioativas'],
  };
}

export function getDisplayedHabitability(planet: PlanetData, state: PlayerCampaignState): HabitabilityFactors {
  if (getPlanetCurrentLevel(planet, state) === -1) return ruinedHabitability(planet);
  return planet.habitability;
}

export function planetForRisk(planet: PlanetData, state: PlayerCampaignState): PlanetData {
  if (getPlanetCurrentLevel(planet, state) !== -1) return planet;
  return {
    ...planet,
    level: -1,
    factionId: null,
    habitability: ruinedHabitability(planet),
    deposits: destroyedWorldDeposits(planet),
  };
}

export function getPlanetEffectiveTypeCode(
  planet: PlanetData,
  state?: Pick<PlayerCampaignState, 'planetOverrides'> | null
): string {
  const ov = state?.planetOverrides[planet.id];
  const level = ov?.level ?? planet.level;
  if (level === -1) return 'TX31';
  return ov?.typeCodeOverride ?? planet.typeCode;
}

export function getPlanetControllingFaction(planet: PlanetData, state: PlayerCampaignState): string | null {
  if (getPlanetCurrentLevel(planet, state) === -1) return null;
  if (state.systemOwnerOverrides[planet.systemId] === '__wild__') return null;
  const ov = state.planetOverrides[planet.id]?.factionId;
  if (ov === '__wild__') return null;
  return ov ?? state.systemOwnerOverrides[planet.systemId] ?? planet.factionId;
}

export function getEffectivePlanetTechLevel(
  planet: PlanetData,
  sys: StarSystemSummary,
  state?: Pick<PlayerCampaignState, 'planetOverrides'> | null
): 1 | 2 | 3 | 4 | 5 {
  const ov = state?.planetOverrides[planet.id];
  if (ov?.techLevelOverride) {
    return ov.techLevelOverride;
  }
  // Section 15.2: Colony planets ALWAYS have low tech level (1 or 2) regardless of system calculation
  if (planet.isColony) {
    return planet.colonyTechOverride ?? 1;
  }
  if (ov?.level === 4 && sys.techLevel < 4) {
    return 4;
  }
  return sys.techLevel;
}

export function getCapitalOrNearestSystemSummary(id: string): StarSystemSummary | null {
  return getSystemSummaryById(id);
}
