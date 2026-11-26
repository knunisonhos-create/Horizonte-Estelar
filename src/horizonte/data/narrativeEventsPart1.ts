import type { NarrativeEventDef } from '../types/game';

export const NARRATIVE_EVENTS_PART1: NarrativeEventDef[] = [
  // ===========================================================================
  // ANOMALIAS (1 - 10)
  // ===========================================================================
  {
    id: 1,
    title: 'Anomalia do Passado',
    scope: 'galactico',
    complexity: 'complexo',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Anomalias',
    visualMotif: 'anomalia',
    initialScene: {
      id: 'init',
      narrativeText:
        'As anteparas da {NAVE} tremem em {SISTEMA} e o vazio ganha cor. Uma estrela jovem queima onde havia apenas poeira, cercada por uma cidade orbital que ruiu há eras. Sob o olhar tenso da {FACCAO}, a tripulação jura ouvir música antiga atravessando os alto-falantes da ponte.',
      choices: [
        {
          id: 'A',
          label: 'Observar em silêncio e gravar os registros espectrais',
          hint: 'Libera cena seguinte · Bônus no próximo evento · +Saúde da tripulação',
          conclusionText:
            'Você ordena silêncio de rádio e direciona os sensores para a miragem estelar. Quando os coros parecem baixar de tom, uma das transmissões vindas da cidade morta pronuncia claramente o nome de {TRIPULANTE} pelo canal interno.',
          effects: {
            grantNextEventBonus: true,
            crewHealthDelta: 8,
            suppliesDelta: 8,
          },
          nextSceneId: 'chamado',
        },
        {
          id: 'B',
          label: 'Enviar um pulso de resposta para testar a visão',
          hint: 'Teste de sorte: +Equipamento raro e Cronocristal ou –Casco',
          conclusionText:
            'O sinal da {NAVE} cruza o vazio em direção à miragem estelar antiga.',
          effects: {
            luckCheck: {
              winChancePct: 60,
              successText:
                'O feixe ressoa com precisão e arranca da anomalia um módulo raro intacto e um Cronocristal sem abalar a blindagem!',
              failText:
                'O pulso provoca um retorno violento de radiação cronométrica que castiga severamente o casco da {NAVE}.',
              successEffect: {
                hullDelta: -10,
                randomEquipment: 'raro',
                resourceId: 'cronocristais',
                resourceQty: 1,
              },
              failEffect: {
                hullDelta: -42,
              },
            },
          },
        },
      ],
    },
    followUpScenes: {
      chamado: {
        id: 'chamado',
        narrativeText:
          'A voz se repete com nitidez perturbadora, chamando {TRIPULANTE} para regressar à cidade orbital fantasma. Os instrumentos acusam que a janela temporal está prestes a colapsar em segundos.',
        choices: [
          {
            id: 'A',
            label: 'Isolar o canal e sincronizar os dados de navegação',
            hint: 'Teste de sorte: +Perícia e Cronocristais ou interferência mental',
            conclusionText:
              'Você ajusta os filtros de rádio para proteger {TRIPULANTE} enquanto baixa os dados quânticos da cidade.',
            effects: {
              luckCheck: {
                winChancePct: 68,
                successText:
                  'Sincronização perfeita! {TRIPULANTE} extrai coordenadas quânticas preciosas e dois Cronocristais antes da fenda apagar.',
                failText:
                  'A interferência rompe o filtro no último instante, cansando a equipe e salvando apenas um fragmento.',
                successEffect: {
                  boostCrewSkill: 5,
                  resourceId: 'cronocristais',
                  resourceQty: 2,
                },
                failEffect: {
                  crewHealthDelta: -10,
                  resourceId: 'cronocristais',
                  resourceQty: 1,
                },
              },
            },
          },
          {
            id: 'B',
            label: 'Aproximar os escudos para sintonizar a frequência da canção',
            hint: '–Combustível · +Vigor temporário · +Reputação local',
            conclusionText:
              'Os propulsores consomem combustível para estabilizar a órbita ao redor do eco estelar. A harmonia antiga acalma os nervos da equipe de {ESPECIE} e inspira relatos memoráveis.',
            effects: {
              fuelDelta: -14,
              crewHealthDelta: 12,
              grantTempBuffLabel: 'Eco da Cidade Antiga (+0,25 Saúde da tripulação/s)',
              renownDelta: 10,
              useSystemOwnerRenown: true,
            },
          },
        ],
      },
    },
  },
  {
    id: 2,
    title: 'Anomalia do Futuro',
    scope: 'galactico',
    complexity: 'simples',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Anomalias',
    visualMotif: 'anomalia',
    initialScene: {
      id: 'init',
      narrativeText:
        'O radar de curto alcance dispara: há uma nave partida ao meio logo adiante, e a pintura no casco ainda esfria com o nome exato da {NAVE}. Os sensores marcam que os destroços pertencem a um desastre que ainda não ocorreu na sua linha temporal.',
      choices: [
        {
          id: 'A',
          label: 'Alterar o vetor imediatamente e contornar o setor',
          hint: '–Combustível · +Saúde da tripulação',
          conclusionText:
            'Os motores queimam reserva extra para abrir distância dos destroços idênticos. A manobra evita o horror de perto e devolve fôlego à tripulação.',
          effects: {
            fuelDelta: -15,
            crewHealthDelta: 10,
          },
        },
        {
          id: 'B',
          label: 'Enviar equipe para recuperar o diário de bordo futuro',
          hint: 'Teste de sorte: +Bônus e equipamento ou –Casco',
          conclusionText:
            'A equipe atraca no casco gêmeo enquanto campos estáticos ameaçam fechar a fenda temporal sobre a proa.',
          effects: {
            luckCheck: {
              winChancePct: 58,
              successText:
                'O grupo resgata o diário intacto com alertas sobre falhas futuras e um equipamento avançado antes da fenda fechar.',
              failText:
                'Uma descarga cronológica estilhaça os restos futuros contra sua proa, rasgando placas externas durante a retirada.',
              successEffect: {
                grantNextEventBonus: true,
                randomEquipment: 'raro',
              },
              failEffect: {
                hullDelta: -45,
                crewHealthDelta: -8,
              },
            },
          },
        },
      ],
    },
  },
  {
    id: 3,
    title: 'Eco Temporal',
    scope: 'galactico',
    complexity: 'simples',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Anomalias',
    visualMotif: 'tecnologia',
    initialScene: {
      id: 'init',
      narrativeText:
        'O comunicador chia em {SISTEMA} e uma voz conhecida rompe a estática: é a sua própria voz, exausta, ditando ordens de emergência contra {CONTROLE_TEXTO}. O carimbo temporal da gravação marca o dia de amanhã.',
      choices: [
        {
          id: 'A',
          label: 'Ouvir a transmissão até o último segundo e registrar tudo',
          hint: 'Teste de sorte: +Bônus e perícia ou desgaste psicológico',
          conclusionText:
            'A ponte permanece em silêncio absoluto acompanhando cada sílaba da gravação do dia seguinte.',
          effects: {
            luckCheck: {
              winChancePct: 65,
              successText:
                'Você decifra os códigos de manobra e frequências críticas sem perder a compostura da equipe.',
              failText:
                'O tom desesperado da própria voz abala profundamente os oficiais antes que a gravação termine.',
              successEffect: {
                grantNextEventBonus: true,
                boostCrewSkill: 4,
                crewHealthDelta: -4,
              },
              failEffect: {
                crewHealthDelta: -16,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Cortar o receptor e seguir o curso natural',
          hint: '+Saúde da tripulação · Sem recompensa material',
          conclusionText:
            'Você desliga o canal antes que a dúvida contamine as decisões da ponte. A equipe agradece por manter o foco no presente.',
          effects: {
            crewHealthDelta: 8,
          },
        },
      ],
    },
  },
  {
    id: 4,
    title: 'Loop Temporal',
    scope: 'galactico',
    complexity: 'complexo',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Anomalias',
    visualMotif: 'anomalia',
    initialScene: {
      id: 'init',
      narrativeText:
        'A mesma bebida derramada, a mesma lâmpada falhando, o mesmo alarme às 08h14. Apenas você percebe que a {NAVE} já atravessou este minuto três vezes seguidas enquanto o espaço ao redor de {SISTEMA} parece dobrado sobre si mesmo.',
      choices: [
        {
          id: 'A',
          label: 'Aproveitar as repetições para recolher minérios e dados',
          hint: 'Cena seguinte · +Recursos e +Bônus tático imediato',
          conclusionText:
            'Com memória das repetições anteriores, você coordena microsaltos precisos e recolhe materiais à deriva, mas na quarta volta o loop começa a cobrar um preço físico de quem permanece preso nele.',
          effects: {
            resourceId: 'platina',
            resourceQty: 5,
            grantNextEventBonus: true,
          },
          nextSceneId: 'cobranca',
        },
        {
          id: 'B',
          label: 'Sobrecarregar os reatores para rasgar a repetição agora',
          hint: 'Teste de sorte: ruptura limpa (–Combustível) ou sobrecarga no casco',
          conclusionText:
            'Os propulsores rugem além da margem de segurança contra a dobra temporal de {SISTEMA}.',
          effects: {
            luckCheck: {
              winChancePct: 64,
              successText:
                'A descarga abre um rasgo limpo na curva do tempo! O relógio avança para 08h15 com desgaste mínimo.',
              failText:
                'A energia ricocheteia contra a dobra fechada, castigando os motores e placas do casco na saída.',
              successEffect: {
                fuelDelta: -16,
                hullDelta: -12,
                crewHealthDelta: 14,
              },
              failEffect: {
                fuelDelta: -22,
                hullDelta: -38,
              },
            },
          },
        },
      ],
    },
    followUpScenes: {
      cobranca: {
        id: 'cobranca',
        narrativeText:
          'Os tripulantes sangram pelo nariz e os consoles exibem códigos duplicados. Permanecer um ciclo a mais pode colapsar a memória da equipe.',
        choices: [
          {
            id: 'A',
            label: 'Sacrificar células de combustível para ejetar a nave do loop',
            hint: '–Combustível · Preserva tripulação e carga obtida',
            conclusionText:
              'Uma detonação controlada de propelente cria impulso suficiente para escapar da curvatura temporal com toda a carga intacta.',
            effects: {
              fuelDelta: -20,
              crewHealthDelta: 4,
            },
          },
          {
            id: 'B',
            label: 'Arriscar mais uma leitura rápida antes da fuga',
            hint: 'Teste de sorte: +Relíquias e Créditos ou colapso de memória',
            conclusionText:
              'Você força os coletores para uma última varredura antes do salto de saída.',
            effects: {
              luckCheck: {
                winChancePct: 54,
                successText:
                  'Captura espetacular! Relíquias antigas e registros raros chegam ao cofre antes do colapso.',
                failText:
                  'O loop se fecha com violência sobre os sensores, deixando a equipe exausta e quase sem dados.',
                successEffect: {
                  crewHealthDelta: -10,
                  resourceId: 'reliquias',
                  resourceQty: 2,
                  creditsDelta: 480,
                },
                failEffect: {
                  crewHealthDelta: -24,
                  creditsDelta: 120,
                },
              },
            },
          },
        ],
      },
    },
  },
  {
    id: 5,
    title: 'Buraco de Minhoca',
    scope: 'galactico',
    complexity: 'simples',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Anomalias',
    visualMotif: 'buraco_minhoca',
    initialScene: {
      id: 'init',
      narrativeText:
        'Uma garganta de luz azulada se abre diante da proa sem aviso. Do outro lado cintilam constelações desconhecidas de outra borda da galáxia — atravessar levará a {NAVE} diretamente para o outro lado do mapa estelar.',
      choices: [
        {
          id: 'A',
          label: 'Atravessar com potência máxima imediatamente',
          hint: 'Salto para o outro lado da galáxia · Teste de sorte: +Equipamento raro ou dano pesado',
          conclusionText:
            'A {NAVE} mergulha na garganta gravitacional a toda força rumo a outro quadrante.',
          effects: {
            luckCheck: {
              winChancePct: 56,
              successText:
                'Travessia veloz e firme! Você emerge do outro lado da galáxia com um equipamento raro arrancado do túnel.',
              failText:
                'As placas rangem sob cisalhamento violento na saída para o outro lado da galáxia, castigando o casco.',
              successEffect: {
                wormholeJumpAcrossGalaxy: true,
                hullDelta: -16,
                randomEquipment: 'raro',
              },
              failEffect: {
                wormholeJumpAcrossGalaxy: true,
                hullDelta: -52,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Estabilizar os campos antes de cruzar o portal',
          hint: 'Salto para o outro lado da galáxia · –Combustível · +Saúde da tripulação',
          conclusionText:
            'Você injeta combustível nos moduladores de dobra e suaviza a travessia. A {NAVE} surge em um setor distante da galáxia sem nenhum tripulante ferido.',
          effects: {
            wormholeJumpAcrossGalaxy: true,
            fuelDelta: -24,
            crewHealthDelta: 10,
          },
        },
      ],
    },
  },
  {
    id: 6,
    title: 'Buraco de Minhoca Habitado',
    scope: 'galactico',
    complexity: 'simples',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Anomalias',
    visualMotif: 'buraco_minhoca',
    initialScene: {
      id: 'init',
      narrativeText:
        'Sombras compridas nadam dentro da garganta luminosa à frente da {NAVE}. Um coro grave reverbera pelo casco: "A passagem tem dono. Pague o tributo, viajante."',
      choices: [
        {
          id: 'A',
          label: 'Transferir créditos e cumprir o pedágio exigido',
          hint: '–320 Créditos · +Saúde da tripulação',
          conclusionText:
            'As criaturas absorvem os códigos de transferência energética e abrem caminho silencioso. A tripulação passa sem traumas.',
          effects: {
            creditsDelta: -320,
            crewHealthDelta: 10,
          },
        },
        {
          id: 'B',
          label: 'Forçar a passagem confiando na velocidade dos motores',
          hint: 'Teste de sorte: passagem com +Matéria Exótica ou contra-ataque pesado',
          conclusionText:
            'Os propulsores disparam em carga máxima contra as sombras que guardam o túnel.',
          effects: {
            luckCheck: {
              winChancePct: 52,
              successText:
                'Você rompe o bloqueio raspando no limite e arranca fragmentos de Matéria Exótica das criaturas em fuga!',
              failText:
                'As entidades cercam a proa com descargas de energia escura, punindo severamente o casco.',
              successEffect: {
                hullDelta: -18,
                resourceId: 'materia_exotica',
                resourceQty: 2,
              },
              failEffect: {
                hullDelta: -54,
                crewHealthDelta: -10,
              },
            },
          },
        },
      ],
    },
  },
  {
    id: 7,
    title: 'Fenda Dimensional',
    scope: 'galactico',
    complexity: 'complexo',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Anomalias',
    visualMotif: 'anomalia',
    initialScene: {
      id: 'init',
      narrativeText:
        'Um rasgo vertical no espaço exibe um corredor idêntico ao da {NAVE}. Dele caminha uma versão espelhada de {TRIPULANTE}, com a mesma voz, a mesma cicatriz... e um olhar calculista que o original nunca teve.',
      choices: [
        {
          id: 'A',
          label: 'Ouvir o sósia dimensional antes de fechar a fenda',
          hint: 'Cena seguinte · Ele promete revelar um segredo tático da nave',
          conclusionText:
            'O espelho entrega coordenadas de uma falha oculta nos circuitos da {NAVE} e pede passagem para o seu universo antes que o rasgo o destrua.',
          effects: {
            grantNextEventBonus: true,
          },
          nextSceneId: 'segredo',
        },
        {
          id: 'B',
          label: 'Selar a fenda imediatamente com descarga dos reatores',
          hint: '–Combustível · +Saúde da tripulação',
          conclusionText:
            'O feixe de contenção fecha a brecha dimensional em segundos. O alívio toma conta dos corredores da {NAVE}.',
          effects: {
            fuelDelta: -16,
            crewHealthDelta: 12,
          },
        },
      ],
    },
    followUpScenes: {
      segredo: {
        id: 'segredo',
        narrativeText:
          'O duplicado confirma que em sua linha temporal sua equipe pereceu em uma emboscada. Agora ele implora para embarcar ou ser devolvido com energia extra.',
        choices: [
          {
            id: 'A',
            label: 'Ajudá-lo a retornar com pulso estabilizador',
            hint: 'Teste de sorte: +Perícia e Cristal de Fenda ou fenda fecha cedo',
            conclusionText:
              'Você alinha os emissores para sustentar a passagem dimensional do duplicado.',
            effects: {
              luckCheck: {
                winChancePct: 70,
                successText:
                  'Antes de atravessar de volta, ele entrega um Cristal de Fenda e calibra seus escudos com maestria.',
                failText:
                  'A fenda colapsa antes do último pacote de energia, sacudindo a proa sem deixar cristal.',
                successEffect: {
                  fuelDelta: -14,
                  boostCrewSkill: 5,
                  resourceId: 'cristal_fenda',
                  resourceQty: 1,
                },
                failEffect: {
                  fuelDelta: -18,
                  hullDelta: -14,
                },
              },
            },
          },
          {
            id: 'B',
            label: 'Cortar a fenda após extrair seus registros táticos',
            hint: 'Teste de sorte: +Equipamento raro ou sabotagem antes do corte',
            conclusionText:
              'Você inicia o download forçado dos esquemas dele enquanto arma o feixe de fechamento.',
            effects: {
              luckCheck: {
                winChancePct: 58,
                successText:
                  'Transferência completa! Você garante um equipamento avançado antes que ele perceba o corte.',
                failText:
                  'O sósia percebe a traição a tempo e provoca um curto nos consoles ao ser desconectado.',
                successEffect: {
                  randomEquipment: 'raro',
                  crewHealthDelta: -8,
                },
                failEffect: {
                  randomEquipment: 'comum',
                  crewHealthDelta: -16,
                  hullDelta: -18,
                },
              },
            },
          },
        ],
      },
    },
  },
  {
    id: 8,
    title: 'Nave Fantasma',
    scope: 'galactico',
    complexity: 'simples',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Anomalias',
    visualMotif: 'anomalia',
    initialScene: {
      id: 'init',
      narrativeText:
        'Uma embarcação idêntica à {NAVE} vaga à deriva na penumbra de {SISTEMA}, luzes apagadas e comportas abertas. Os sensores ópticos mostram o casco, mas a telemetria afirma que não há massa nenhuma ali.',
      choices: [
        {
          id: 'A',
          label: 'Abordar a nave fantasma em busca de suprimentos',
          hint: 'Teste de sorte: +Ligas Avançadas e Suprimentos ou pânico psicológico',
          conclusionText:
            'Os trajes pressurizados atravessam as comportas apagadas da embarcação espectral.',
          effects: {
            luckCheck: {
              winChancePct: 60,
              successText:
                'A equipe recolhe caixas intactas e ligas raras rapidamente antes que o horror tome conta dos corredores.',
              failText:
                'Objetos pessoais idênticos aos seus espalhados pelos beliches provocam pânico, forçando retirada às pressas.',
              successEffect: {
                resourceId: 'ligas_avancadas',
                resourceQty: 4,
                suppliesDelta: 25,
                crewHealthDelta: -6,
              },
              failEffect: {
                suppliesDelta: 10,
                crewHealthDelta: -22,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Escanear à distância mantendo distância de segurança',
          hint: '–Combustível · +Bônus no próximo evento',
          conclusionText:
            'Os drones coletam assinaturas gravitacionais valiosas sem expor nenhum tripulante à anomalia.',
          effects: {
            fuelDelta: -12,
            grantNextEventBonus: true,
          },
        },
      ],
    },
  },
  {
    id: 9,
    title: 'Chuva de Tempo',
    scope: 'galactico',
    complexity: 'simples',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Anomalias',
    visualMotif: 'anomalia',
    initialScene: {
      id: 'init',
      narrativeText:
        'Partículas douradas caem como neve sobre o casco e atravessam as anteparas sem resistência. Quem estende a mão sente décadas inteiras correrem sob a pele em questão de segundos.',
      choices: [
        {
          id: 'A',
          label: 'Autorizar um tripulante voluntário a estudar as partículas',
          hint: 'Teste de sorte: rejuvenescimento (+bônus e perícia) ou desgaste',
          conclusionText:
            'O voluntário entra na câmara de observação enquanto o fluxo dourado envolve seu traje.',
          effects: {
            luckCheck: {
              winChancePct: 55,
              successText:
                'As partículas rejuvenescem os tecidos do voluntário, elevando sua perícia e inspirando toda a tripulação!',
              failText:
                'O fluxo gira para o sentido errado: o voluntário envelhece abruptamente e retorna exausto à enfermaria.',
              successEffect: {
                boostCrewSkill: 8,
                crewHealthDelta: 15,
                grantTempBuffLabel: 'Vigor Cronológico (+0,25 Saúde da tripulação/s)',
              },
              failEffect: {
                crewHealthDelta: -18,
                grantTempBuffLabel: 'Fadiga Temporal (-0,10 Saúde da tripulação/s)',
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Reforçar os escudos e acelerar para fora da chuva',
          hint: '–Combustível · Sem riscos à tripulação',
          conclusionText:
            'A blindagem eletromagnética repele o grosso da precipitação temporal enquanto os motores atravessam a nuvem com segurança.',
          effects: {
            fuelDelta: -14,
          },
        },
      ],
    },
  },
  {
    id: 10,
    title: 'Estrela Instável',
    scope: 'galactico',
    complexity: 'simples',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Anomalias',
    visualMotif: 'anomalia',
    initialScene: {
      id: 'init',
      narrativeText:
        'O astro diante da rota pulsa como um coração em colapso. A cada contração, ondas de radiação varrem o setor — e bem na borda da coroa brilha um aglomerado raro de Cristais Celestiais.',
      choices: [
        {
          id: 'A',
          label: 'Contornar em arco longo fora da zona de radiação',
          hint: '–Combustível · Nave intacta',
          conclusionText:
            'Você evita o pulso letal usando manobra tangencial limpa, gastando apenas combustível extra.',
          effects: {
            fuelDelta: -15,
          },
        },
        {
          id: 'B',
          label: 'Mergulhar rápido para colher o cristal energético',
          hint: 'Teste de sorte: +Cristais Celestiais ou erupção solar no casco',
          conclusionText:
            'A {NAVE} mergulha na borda ardente da coroa estelar com os braços coletores estendidos.',
          effects: {
            luckCheck: {
              winChancePct: 52,
              successText:
                'Coleta cirúrgica entre duas pulsações! Três Cristais Celestiais intactos entram no porão com dano moderado.',
              failText:
                'Uma erupção solar atinge o flanco em cheio, chamuscando gravemente a blindagem externa!',
              successEffect: {
                hullDelta: -22,
                resourceId: 'cristais_celestiais',
                resourceQty: 3,
              },
              failEffect: {
                hullDelta: -56,
                resourceId: 'cristais_celestiais',
                resourceQty: 1,
              },
            },
          },
        },
      ],
    },
  },

  // ===========================================================================
  // CRIATURAS (11 - 18)
  // ===========================================================================
  {
    id: 11,
    title: 'Invasão Alienígena',
    scope: 'galactico',
    complexity: 'complexo',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Criaturas',
    visualMotif: 'criatura',
    initialScene: {
      id: 'init',
      narrativeText:
        'As sirenes disparam nos conveses inferiores. Criaturas translúcidas nascidas do vácuo atravessam a fuselagem como névoa gelada e avançam pelos corredores em direção à ponte.',
      choices: [
        {
          id: 'A',
          label: 'Confrontar os invasores diretamente nos corredores',
          hint: 'Teste de sorte: dispersão rápida (+Matéria-Fantasma/Antídoto) ou avarias graves',
          conclusionText:
            'As equipes táticas avançam pelos corredores gelados abrindo fogo de plasma.',
          effects: {
            luckCheck: {
              winChancePct: 60,
              successText:
                'Fogo coordenado dispersa o enxame rapidamente, deixando resquícios etéreos e antídoto recuperado!',
              failText:
                'As criaturas cercam o setor de máquinas antes de recuar, ferindo a equipe e os dutos internos.',
              successEffect: {
                hullDelta: -18,
                crewHealthDelta: -8,
                resourceId: 'materia_fantasma',
                resourceQty: 3,
                consumableId: 'antidoto',
                consumableQty: 1,
              },
              failEffect: {
                hullDelta: -44,
                crewHealthDelta: -24,
                resourceId: 'materia_fantasma',
                resourceQty: 1,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Selar as comportas e isolar o setor inferior',
          hint: 'Cena seguinte · –Suprimentos · Nenhum ferido imediato',
          conclusionText:
            'As portas blindadas descem a tempo, trancando parte da despensa no setor contaminado. Segundos depois, algo pesado e consciente começa a golpear o aço pelo lado de dentro.',
          effects: {
            suppliesDelta: -18,
          },
          nextSceneId: 'porta',
        },
      ],
    },
    followUpScenes: {
      porta: {
        id: 'porta',
        narrativeText:
          'Os impactos dobram a comporta blindada do setor isolado. Os sensores térmicos mostram uma criatura alfa tentando drenar os cabos principais de energia.',
        choices: [
          {
            id: 'A',
            label: 'Abrir a escotilha de descompressão e lançá-la ao vácuo',
            hint: 'Teste de sorte: ejeção limpa ou válvula trava sob pressão',
            conclusionText:
              'Você aciona a descompressão de emergência na comporta externa do setor isolado.',
            effects: {
              luckCheck: {
                winChancePct: 72,
                successText:
                  'A sucção arranca a criatura para o espaço aberto de imediato, salvando o reator e a equipe!',
                failText:
                  'A trava emperra por segundos vitais e a criatura rasga cabos externos antes de ser expelida.',
                successEffect: {
                  suppliesDelta: -12,
                  crewHealthDelta: 10,
                },
                failEffect: {
                  suppliesDelta: -22,
                  hullDelta: -20,
                },
              },
            },
          },
          {
            id: 'B',
            label: 'Aplicar descarga reversa de escudo na comporta',
            hint: 'Teste de sorte: +Biomassa Viva épica ou retorno elétrico no escudo',
            conclusionText:
              'Os engenheiros redirecionam energia dos escudos diretamente para a grade da comporta.',
            effects: {
              luckCheck: {
                winChancePct: 58,
                successText:
                  'O arco elétrico neutraliza a entidade de imediato, permitindo recolher tecido regenerativo raro!',
                failText:
                  'A entidade absorve parte do arco antes de cair, causando retorno elétrico nos circuitos internos.',
                successEffect: {
                  hullDelta: -14,
                  resourceId: 'biomassa_viva',
                  resourceQty: 3,
                },
                failEffect: {
                  hullDelta: -36,
                  resourceId: 'biomassa_viva',
                  resourceQty: 1,
                },
              },
            },
          },
        ],
      },
    },
  },
  {
    id: 12,
    title: 'Esporos Cósmicos',
    scope: 'galactico',
    complexity: 'simples',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Criaturas',
    visualMotif: 'criatura',
    initialScene: {
      id: 'init',
      narrativeText:
        'Uma poeira esverdeada entra silenciosamente pelos dutos de ventilação. Em poucos minutos o ar cheira a flores desconhecidas e metade da tripulação começa a rir sem motivo aparente.',
      choices: [
        {
          id: 'A',
          label: 'Purgar imediatamente toda a atmosfera interna',
          hint: '–Suprimentos · +Saúde da tripulação normalizada',
          conclusionText:
            'Os filtros queimam reserva de suporte de vida para limpar cada duto. A lucidez volta rapidamente à ponte.',
          effects: {
            suppliesDelta: -20,
            crewHealthDelta: 10,
          },
        },
        {
          id: 'B',
          label: 'Permitir coleta científica antes de selar os filtros',
          hint: 'Teste de sorte: +Esporos/Bônus ou surto alucinógeno severo',
          conclusionText:
            'A equipe científica abre os cilindros de amostragem antes da purga atmosférica.',
          effects: {
            luckCheck: {
              winChancePct: 58,
              successText:
                'Coleta controlada com êxito! O laboratório garante esporos puros, dados raros e euforia leve.',
              failText:
                'Os esporos saturam o ar antes do selamento, provocando alucinações severas na tripulação.',
              successEffect: {
                grantNextEventBonus: true,
                resourceId: 'esporos',
                resourceQty: 4,
                crewHealthDelta: -4,
                grantTempBuffLabel: 'Euforia Esporal (+0,25 Saúde da tripulação/s)',
              },
              failEffect: {
                resourceId: 'esporos',
                resourceQty: 2,
                crewHealthDelta: -22,
              },
            },
          },
        },
      ],
    },
  },
  {
    id: 13,
    title: 'Baleia Espacial',
    scope: 'galactico',
    complexity: 'simples',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Criaturas',
    visualMotif: 'criatura',
    initialScene: {
      id: 'init',
      narrativeText:
        'Uma silhueta do tamanho de uma pequena lua desliza diante das janelas panorâmicas. É uma baleia estelar ferida por destroços antigos, cantando em frequências que fazem o casco vibrar.',
      choices: [
        {
          id: 'A',
          label: 'Escoltar a criatura e cauterizar seus ferimentos com feixes suaves',
          hint: 'Teste de sorte: +Saúde e equipamento raro ou impacto acidental da cauda',
          conclusionText:
            'Os drones médicos se aproximam devagar do dorso ferido da gigante estelar.',
          effects: {
            luckCheck: {
              winChancePct: 74,
              successText:
                'Você remove os estilhaços com precisão. Ao partir, a baleia expele uma relíquia rara preservada em gratidão!',
              failText:
                'Assustada com os feixes de cauterização, a criatura gira a cauda contra os escudos antes de mergulhar no vácuo.',
              successEffect: {
                suppliesDelta: -22,
                crewHealthDelta: 14,
                randomEquipment: 'raro',
              },
              failEffect: {
                suppliesDelta: -22,
                hullDelta: -22,
                crewHealthDelta: 4,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Abater e colher suas placas bioenergéticas raras',
          hint: 'Teste de sorte: +950 Créditos ou contra-ataque bioenergético',
          conclusionText:
            'As baterias da {NAVE} miram nos nódulos energéticos da criatura ferida.',
          effects: {
            luckCheck: {
              winChancePct: 62,
              successText:
                'Corte rápido e lucrativo nos tecidos raros, embora o canto final deixe pesar na equipe.',
              failText:
                'Em agonia, a baleia libera um pulso bioenergético que castiga a blindagem durante a coleta!',
              successEffect: {
                creditsDelta: 950,
                crewHealthDelta: -14,
              },
              failEffect: {
                creditsDelta: 450,
                hullDelta: -34,
                crewHealthDelta: -20,
              },
            },
          },
        },
      ],
    },
  },
  {
    id: 14,
    title: 'Parasita no Casco',
    scope: 'galactico',
    complexity: 'simples',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Criaturas',
    visualMotif: 'criatura',
    initialScene: {
      id: 'init',
      narrativeText:
        'Um arranhar metálico incessante ecoa pelos corredores da {NAVE}. Pelas câmeras externas, um organismo prateado devora placas da blindagem como se saboreasse metal refinado.',
      choices: [
        {
          id: 'A',
          label: 'Executar queima reversa nos propulsores auxiliares',
          hint: '–Combustível · –Casco leve',
          conclusionText:
            'O jato superaquecido solta o parasita antes que ele perfure os tanques internos.',
          effects: {
            fuelDelta: -14,
            hullDelta: -22,
          },
        },
        {
          id: 'B',
          label: 'Aguardar ele cristalizar a camada externa e colher o casulo',
          hint: 'Teste de sorte: +Ligas Avançadas ou perfuração profunda do casco',
          conclusionText:
            'Você retém a queima de purga enquanto o organismo prateado envolve a blindagem em metal denso.',
          effects: {
            luckCheck: {
              winChancePct: 54,
              successText:
                'O casulo cristaliza na medida exata! Você colhe Ligas Avançadas raras com desgaste controlado.',
              failText:
                'O parasita perfura além da conta antes de ser ejetado, deixando danos sérios na fuselagem.',
              successEffect: {
                hullDelta: -26,
                resourceId: 'ligas_avancadas',
                resourceQty: 4,
              },
              failEffect: {
                hullDelta: -58,
                resourceId: 'ligas_avancadas',
                resourceQty: 1,
              },
            },
          },
        },
      ],
    },
  },
  {
    id: 15,
    title: 'Ninho de Vácuo',
    scope: 'galactico',
    complexity: 'simples',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Criaturas',
    visualMotif: 'criatura',
    initialScene: {
      id: 'init',
      narrativeText:
        'Ovos translúcidos flutuam em formação perfeita em meio à poeira estelar, pulsando em âmbar. Ao sentir o calor dos motores da {NAVE}, as cascas começam a rachar.',
      choices: [
        {
          id: 'A',
          label: 'Desligar impulsores principais e recuar lentamente',
          hint: '–Combustível · Sem danos',
          conclusionText:
            'Os manobradores laterais afastam a nave com suavidade antes que o enxame desperte.',
          effects: {
            fuelDelta: -12,
          },
        },
        {
          id: 'B',
          label: 'Capturar um ovo intacto com o raio trator',
          hint: 'Teste de sorte: +Biomassa Viva e Antídoto ou ataque do enxame',
          conclusionText:
            'O raio trator envolve o ovo âmbar mais próximo enquanto sombras se agitam na nuvem estelar.',
          effects: {
            luckCheck: {
              winChancePct: 56,
              successText:
                'O espécime é selado rapidamente no compartimento antes que as adultas alcancem a popa.',
              failText:
                'Criaturas adultas ocultas nas sombras investem em fúria contra o casco durante a retirada!',
              successEffect: {
                hullDelta: -18,
                resourceId: 'biomassa_viva',
                resourceQty: 3,
                consumableId: 'antidoto',
                consumableQty: 1,
              },
              failEffect: {
                hullDelta: -50,
                resourceId: 'biomassa_viva',
                resourceQty: 1,
              },
            },
          },
        },
      ],
    },
  },
  {
    id: 16,
    title: 'Predador Invisível',
    scope: 'galactico',
    complexity: 'complexo',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Criaturas',
    visualMotif: 'criatura',
    initialScene: {
      id: 'init',
      narrativeText:
        'Os radares não exibem nada no espaço vazio, porém marcas de garras surgem no metal externo e uma antena inteira desaparece como se tivesse sido arrancada a dentadas.',
      choices: [
        {
          id: 'A',
          label: 'Disparar pulso eletromagnético para revelar a criatura',
          hint: 'Cena seguinte · –Combustível · O predador descobre sua posição',
          conclusionText:
            'A onda revela uma fera espacial camuflada de cinco asas. Exposta pela luz dos sensores, ela agora encara diretamente a ponte de comando.',
          effects: {
            fuelDelta: -12,
          },
          nextSceneId: 'cacada',
        },
        {
          id: 'B',
          label: 'Apagar todos os sistemas e aguardar em silêncio absoluto',
          hint: 'Teste de sorte: predador perde o rastro ou arranha o casco no escuro',
          conclusionText:
            'Luzes, telas e motores são cortados deixando a {NAVE} à deriva em silêncio absoluto.',
          effects: {
            luckCheck: {
              winChancePct: 68,
              successText:
                'Após horas tensas no escuro térmico, a fera perde o rastro e parte atrás de outra presa.',
              failText:
                'Mesmo às escuras, o predador fareja o calor residual e rasga placas externas antes de partir.',
              successEffect: {
                crewHealthDelta: -6,
              },
              failEffect: {
                hullDelta: -24,
                crewHealthDelta: -14,
              },
            },
          },
        },
      ],
    },
    followUpScenes: {
      cacada: {
        id: 'cacada',
        narrativeText:
          'O predador avançou para distância de ataque e bloqueia o corredor de saída com disparos bioluminescentes.',
        choices: [
          {
            id: 'A',
            label: 'Concentrar fogo tático para abatê-lo em voo',
            hint: 'Teste de sorte: +Toxinas raras ou investida violenta no casco',
            conclusionText:
              'As torretas da {NAVE} acompanham o voo errático da criatura para disparar em conjunto.',
            effects: {
              luckCheck: {
                winChancePct: 62,
                successText:
                  'Uma rajada certeira rompe a carapaça da criatura antes da segunda investida, rendendo troféus raros!',
                failText:
                  'O predador resiste ao primeiro impacto e golpeia a proa com fúria antes de ser abatido.',
                successEffect: {
                  hullDelta: -16,
                  resourceId: 'toxinas',
                  resourceQty: 4,
                },
                failEffect: {
                  hullDelta: -42,
                  crewHealthDelta: -10,
                  resourceId: 'toxinas',
                  resourceQty: 1,
                },
              },
            },
          },
          {
            id: 'B',
            label: 'Lançar isca térmica e escapar em curva fechada',
            hint: '–Suprimentos (isca) · +Bônus de combate/evasão',
            conclusionText:
              'A criatura morde o módulo térmico descartado enquanto a {NAVE} ganha espaço seguro no setor.',
            effects: {
              suppliesDelta: -18,
              grantNextEventBonus: true,
            },
          },
        ],
      },
    },
  },
  {
    id: 17,
    title: 'Criatura Filhote',
    scope: 'galactico',
    complexity: 'simples',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Criaturas',
    visualMotif: 'criatura',
    initialScene: {
      id: 'init',
      narrativeText:
        'Um ruído suave vem do depósito de provisões. Entre caixotes lacrados, um filhote alienígena de olhos grandes mastiga rações estelares e olha para você sem nenhum medo.',
      choices: [
        {
          id: 'A',
          label: 'Adotar a criatura como mascote da tripulação',
          hint: 'Teste de sorte: +Vigor da tripulação ou travessuras nos cabos',
          conclusionText:
            'Você autoriza a permanência do pequeno alienígena nos alojamentos sob supervisão da equipe.',
          effects: {
            luckCheck: {
              winChancePct: 72,
              successText:
                'O filhote se adapta rápido e conquista toda a {NAVE}, elevando muito a disposição a bordo!',
              failText:
                'Antes de aprender os limites, o filhote mastiga conduítes de energia causando avarias leves.',
              successEffect: {
                suppliesDelta: -28,
                crewHealthDelta: 18,
                grantTempBuffLabel: 'Mascote a Bordo (+0,25 Saúde da tripulação/s)',
              },
              failEffect: {
                suppliesDelta: -28,
                hullDelta: -18,
                crewHealthDelta: 8,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Entregá-lo a um santuário de preservação no próximo posto',
          hint: '–Saúde da tripulação · +16 Reputação com a facção regente',
          conclusionText:
            'Os tripulantes lamentam a despedida, porém os biólogos do setor elogiam sua responsabilidade ecológica.',
          effects: {
            crewHealthDelta: -6,
            renownDelta: 16,
            useSystemOwnerRenown: true,
          },
        },
      ],
    },
  },
  {
    id: 18,
    title: 'Leviatã Adormecido',
    scope: 'galactico',
    complexity: 'simples',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Criaturas',
    visualMotif: 'criatura',
    initialScene: {
      id: 'init',
      narrativeText:
        'O asteroide solitário à frente possui veias pulsantes de luz violeta. Os sensores profundos registram batimentos espaçados de algo colossal que dorme no vácuo há milênios.',
      choices: [
        {
          id: 'A',
          label: 'Desviar em velocidade reduzida para não despertá-lo',
          hint: '–Combustível · Passagem segura',
          conclusionText:
            'Você navega ao largo do colosso adormecido, preservando a paz ancestral do setor.',
          effects: {
            fuelDelta: -14,
          },
        },
        {
          id: 'B',
          label: 'Emitir pulso de sonda para acordar e coletar energia do leviatã',
          hint: 'Teste de sorte: +Núcleo Estelar / equipamento raro ou –Casco pesado',
          conclusionText:
            'As pálpebras colossais de rocha viva se abrem lentamente diante da ponte.',
          effects: {
            luckCheck: {
              winChancePct: 52,
              successText:
                'O leviatã boceja em ondas de plasma limpo, liberando fragmentos de Núcleo Estelar ao voltar a adormecer.',
              failText:
                'Irritado com a intrusão, o leviatã varre o setor com uma cauda gravitacional que castiga o casco da nave.',
              successEffect: {
                resourceId: 'nucleo_estelar',
                resourceQty: 1,
                randomEquipment: 'raro',
              },
              failEffect: {
                hullDelta: -58,
              },
            },
          },
        },
      ],
    },
  },

  // ===========================================================================
  // TRIPULAÇÃO (19 - 30)
  // ===========================================================================
  {
    id: 19,
    title: 'Traição',
    scope: 'galactico',
    complexity: 'complexo',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Tripulação',
    visualMotif: 'tripulacao',
    initialScene: {
      id: 'init',
      narrativeText:
        '{TRIPULANTE} sempre cumpriu cada turno sem reclamar. Porém, durante a vigília noturna, você flagra o oficial enviando pacotes criptografados no idioma natal de sua raça rumo ao território de {RIVAL_NOME}.',
      choices: [
        {
          id: 'A',
          label: 'Confrontar o oficial diante de toda a ponte agora',
          hint: 'Cena seguinte · A verdade vem à tona sob forte tensão',
          conclusionText:
            'Sem saída, ele confessa em lágrimas que agentes rivais sequestraram parentes em seu mundo natal e exigiam sua rota.',
          effects: {},
          nextSceneId: 'confissao',
        },
        {
          id: 'B',
          label: 'Vigiá-lo em silêncio e rastrear os dados enviados',
          hint: 'Cena seguinte · Descubra o verdadeiro alcance do vazamento',
          conclusionText:
            'Você intercepta os pacotes criptografados por dois turnos e descobre exatamente que rotas ele revelou ao comando rival.',
          effects: {
            grantNextEventBonus: true,
          },
          nextSceneId: 'descoberta',
        },
      ],
    },
    followUpScenes: {
      confissao: {
        id: 'confissao',
        narrativeText:
          'A tripulação aguarda seu veredito em silêncio. Ele jura lealdade se receber perdão para resgatar sua família depois.',
        choices: [
          {
            id: 'A',
            label: 'Expulsar da tripulação no próximo posto seguro',
            hint: '–1 Tripulante (se houver) · +Reputação com facção regente',
            conclusionText:
              'O protocolo da frota permanece inegociável, e as autoridades elogiam sua firmeza contra espionagem.',
            effects: {
              removeOneCrewMember: true,
              renownDelta: 14,
              useSystemOwnerRenown: true,
            },
          },
          {
            id: 'B',
            label: 'Perdoar e usar o canal dele para desinformar rivais',
            hint: 'Teste de sorte: +Perícia e golpe tático ou sabotagem descoberta',
            conclusionText:
              'Com supervisão na ponte, o oficial transmite dados preparados de volta aos captores.',
            effects: {
              luckCheck: {
                winChancePct: 65,
                successText:
                  'Os rivais caem na armadilha de contrainteligência, rendendo perícia e moral renovado a bordo!',
                failText:
                  'Os agentes percebem a farsa na criptografia e disparam vírus que danificam sistemas auxiliares.',
                successEffect: {
                  boostCrewSkill: 6,
                  crewHealthDelta: 8,
                  renownDelta: -10,
                  useWarRivalRenown: true,
                },
                failEffect: {
                  hullDelta: -20,
                  crewHealthDelta: -10,
                },
              },
            },
          },
        ],
      },
      descoberta: {
        id: 'descoberta',
        narrativeText:
          'Agora que você domina a chave de criptografia, pode explorar o contato ou encerrar a ameaça definitivamente.',
        choices: [
          {
            id: 'A',
            label: 'Injetar rotas falsas e lucrar vendendo escolta falsa',
            hint: 'Teste de sorte: +650 Créditos e reputação ou fuga do espião',
            conclusionText:
              'Você usa a chave capturada para negociar informações adulteradas com os contatos rivais.',
            effects: {
              luckCheck: {
                winChancePct: 58,
                successText:
                  'Golpe limpo! Os rivais pagam alto pelas rotas falsas enquanto sua facção celebra a manobra.',
                failText:
                  'O infiltrado nota o desvio antes da transferência integral e escapa causando tumulto no convés.',
                successEffect: {
                  creditsDelta: 650,
                  renownDelta: 14,
                },
                failEffect: {
                  creditsDelta: 180,
                  crewHealthDelta: -12,
                },
              },
            },
          },
          {
            id: 'B',
            label: 'Desmascarar o traidor e detê-lo imediatamente',
            hint: '–1 Tripulante (se houver) · +Saúde e confiança da equipe',
            conclusionText:
              'A retirada rápida do espião impede danos futuros e restaura a tranquilidade nos turnos noturnos.',
            effects: {
              removeOneCrewMember: true,
              crewHealthDelta: 10,
            },
          },
        ],
      },
    },
  },
  {
    id: 20,
    title: 'Sequestro de Tripulantes',
    scope: 'galactico',
    complexity: 'complexo_missao',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Tripulação',
    visualMotif: 'tripulacao',
    initialScene: {
      id: 'init',
      narrativeText:
        'Ao soar da alvorada, dois alojamentos estão vazios. Marcas de arrasto cortam o metal até a comporta auxiliar, junto de um aviso transmitido de um sistema próximo: "Venham buscar."',
      choices: [
        {
          id: 'A',
          label: 'Lançar operação armada para resgatar à força',
          hint: 'Adiciona missão "Resgate no Escuro" · –Casco inicial',
          conclusionText:
            'Você traça o sinal dos sequestradores no mapa estelar e aceita a missão "Resgate no Escuro" para recuperar sua equipe sob fogo pesado.',
          effects: {
            hullDelta: -18,
            spawnMission: {
              title: 'Resgate no Escuro',
              description:
                'Viajar ao sistema indicado pelos sequestradores, derrotar a escolta hostil e libertar os tripulantes capturados.',
              followUpSceneId: 'resgate_forca',
              requiresCombat: true,
              enemyName: 'Sequestradores do Vácuo',
            },
          },
        },
        {
          id: 'B',
          label: 'Abrir canal de negociação para pagar pelo resgate',
          hint: 'Adiciona missão "O Preço da Vida" · –Créditos iniciais',
          conclusionText:
            'Você estabelece um ponto de encontro neutro aceitando a missão "O Preço da Vida" para negociar cara a cara a entrega dos reféns.',
          effects: {
            creditsDelta: -250,
            spawnMission: {
              title: 'O Preço da Vida',
              description:
                'Encontrar o emissário dos sequestradores no sistema marcado e concluir a libertação dos tripulantes.',
              followUpSceneId: 'negociar_resgate',
              requiresCombat: false,
            },
          },
        },
      ],
    },
    followUpScenes: {
      resgate_forca: {
        id: 'resgate_forca',
        narrativeText:
          'Os captores foram derrotados e os tripulantes feridos aguardam na cela pressurizada da base avançada.',
        choices: [
          {
            id: 'A',
            label: 'Resgatar a equipe e selar o reator dos piratas',
            hint: '+Saúde e vigor da tripulação · +Reputação · +Créditos',
            conclusionText:
              'Os tripulantes voltam a salvo à {NAVE}. O êxito do resgate armado inspira toda a frota.',
            effects: {
              crewHealthDelta: 20,
              renownDelta: 15,
              creditsDelta: 520,
            },
          },
          {
            id: 'B',
            label: 'Vasculhar também os cofres antes da explosão',
            hint: 'Teste de sorte: +Equipamento raro e Titânio ou avaria na fuga',
            conclusionText:
              'A equipe força as travas do cofre central enquanto o alarme de autodestruição acelera.',
            effects: {
              luckCheck: {
                winChancePct: 60,
                successText:
                  'Extração perfeita no último segundo com equipamento raro e ligas de titânio!',
                failText:
                  'Uma explosão antecipa a saída, punindo a blindagem da {NAVE} com estilhaços pesados.',
                successEffect: {
                  hullDelta: -10,
                  randomEquipment: 'raro',
                  resourceId: 'titanio',
                  resourceQty: 5,
                },
                failEffect: {
                  hullDelta: -38,
                  resourceId: 'titanio',
                  resourceQty: 2,
                },
              },
            },
          },
        ],
      },
      negociar_resgate: {
        id: 'negociar_resgate',
        narrativeText:
          'No ponto combinado, o líder dos sequestradores entrega os tripulantes, mas exige uma decisão final sobre o acordo.',
        choices: [
          {
            id: 'A',
            label: 'Cumprir a palavra e partir sem disparar',
            hint: '+Reputação diplomática · +Saúde da tripulação',
            conclusionText:
              'Todos embarcam sãos e salvos. Sua reputação de negociador firme corre os postos vizinhos.',
            effects: {
              renownDelta: 18,
              crewHealthDelta: 15,
            },
          },
          {
            id: 'B',
            label: 'Recuperar os reféns e exigir devolução parcial sob mira',
            hint: 'Teste de sorte: +560 Créditos ou troca de tiros na saída',
            conclusionText:
              'Assim que os reféns pisam no hangar, você destrava as baterias de proa sobre a nave pirata.',
            effects: {
              luckCheck: {
                winChancePct: 58,
                successText:
                  'Intimidado pelo poder de fogo, o líder devolve boa parte dos créditos imediatamente.',
                failText:
                  'Os bandidos respondem disparando enquanto fogem, raspando o casco na manobra.',
                successEffect: {
                  creditsDelta: 560,
                  renownDelta: -10,
                  useSystemOwnerRenown: true,
                },
                failEffect: {
                  creditsDelta: 220,
                  hullDelta: -28,
                  renownDelta: -14,
                  useSystemOwnerRenown: true,
                },
              },
            },
          },
        ],
      },
    },
  },
  {
    id: 21,
    title: 'Motim',
    scope: 'galactico',
    complexity: 'complexo',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Tripulação',
    visualMotif: 'tripulacao',
    initialScene: {
      id: 'init',
      narrativeText:
        'Quatro veteranos fecham o acesso à ponte de comando em {SISTEMA}. "Chega de rota suicida!", grita o líder. "Ou mudamos o rumo agora, ou mudamos de capitão."',
      choices: [
        {
          id: 'A',
          label: 'Ceder às demandas e conceder descanso imediato',
          hint: '+Saúde da tripulação · –Reputação com {FACCAO}',
          conclusionText:
            'A tensão se dissolve com turnos mais leves, porém rumores sobre sua falta de pulso chegam aos oficiais de {FACCAO}.',
          effects: {
            crewHealthDelta: 16,
            renownDelta: -12,
          },
        },
        {
          id: 'B',
          label: 'Impor autoridade e retomar a ponte sem ceder',
          hint: 'Cena seguinte · –Saúde da tripulação · Os líderes fazem exigência final',
          conclusionText:
            'Você desarma a primeira linha de motim, mas os cabeças recuam para a engenharia ameaçando travar o salto estelar.',
          effects: {
            crewHealthDelta: -10,
          },
          nextSceneId: 'exigencia',
        },
      ],
    },
    followUpScenes: {
      exigencia: {
        id: 'exigencia',
        narrativeText:
          'Com chaves do reator nas mãos, os líderes do motim exigem bônus dobrado ou desembarque garantido sem punições.',
        choices: [
          {
            id: 'A',
            label: 'Pagar gratificação de risco e selar novo pacto de lealdade',
            hint: '–380 Créditos · +Perícia da tripulação · +Saúde da tripulação',
            conclusionText:
              'A bonificação justa encerra a crise de vez e eleva o rendimento técnico da equipe.',
            effects: {
              creditsDelta: -380,
              boostCrewSkill: 5,
              grantTempBuffLabel: 'Rotina Estabilizada (+0,25 Saúde da tripulação/s)',
            },
          },
          {
            id: 'B',
            label: 'Cortar a energia do corredor e prender os cabeças',
            hint: 'Teste de sorte: detenção limpa ou danos no reator durante prisão',
            conclusionText:
              'A equipe de segurança avança no escuro após cortar os painéis do corredor de máquinas.',
            effects: {
              luckCheck: {
                winChancePct: 64,
                successText:
                  'Os rebeldes são imobilizados sem resistência antes de tocar no reator. A disciplina volta intacta.',
                failText:
                  'Na luta pelo controle, os amotinados provocam curto nos condutores antes de serem presos.',
                successEffect: {
                  removeOneCrewMember: true,
                  renownDelta: 14,
                },
                failEffect: {
                  removeOneCrewMember: true,
                  hullDelta: -26,
                  crewHealthDelta: -10,
                },
              },
            },
          },
        ],
      },
    },
  },
  {
    id: 22,
    title: 'Doença Misteriosa',
    scope: 'galactico',
    complexity: 'simples',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Tripulação',
    visualMotif: 'tripulacao',
    initialScene: {
      id: 'init',
      narrativeText:
        'Na enfermaria, um tripulante tosse um fluido prateado que brilha sob luz apagada. A equipe médica nunca viu nada semelhante nos registros biológicos de {ESPECIE}.',
      choices: [
        {
          id: 'A',
          label: 'Isolar a ala médica e aplicar tratamento conservador',
          hint: '–Suprimentos · +Bônus no próximo evento · +Antídoto',
          conclusionText:
            'O protocolo rigoroso estabiliza o paciente com segurança e gera dados médicos inéditos.',
          effects: {
            suppliesDelta: -24,
            grantNextEventBonus: true,
            consumableId: 'antidoto',
            consumableQty: 1,
          },
        },
        {
          id: 'B',
          label: 'Aplicar protocolo experimental de regeneração acelerada',
          hint: 'Teste de sorte: cura completa +equipamento ou perda de tripulante',
          conclusionText:
            'As seringas de soro experimental entram em ação enquanto todos observam os monitores vitais.',
          effects: {
            luckCheck: {
              winChancePct: 56,
              successText:
                'O tratamento expurga o patógeno prateado e sintetiza um composto raríssimo de imunização!',
              failText:
                'A reação biológica foge do controle. O paciente não resiste apesar dos esforços da enfermaria.',
              successEffect: {
                crewHealthDelta: 18,
                randomEquipment: 'raro',
              },
              failEffect: {
                removeOneCrewMember: true,
                crewHealthDelta: -16,
              },
            },
          },
        },
      ],
    },
  },
  {
    id: 23,
    title: 'Sonho Coletivo',
    scope: 'galactico',
    complexity: 'simples',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Tripulação',
    visualMotif: 'anomalia',
    initialScene: {
      id: 'init',
      narrativeText:
        'Durante o mesmo ciclo de repouso, toda a tripulação sonha com o mesmo planeta de céu verde e torres de quartzo. Ao acordar, quatro pessoas desenharam exatamente a mesma montanha no papel.',
      choices: [
        {
          id: 'A',
          label: 'Desviar momentaneamente para rastrear o sinal onírico',
          hint: 'Teste de sorte: +Bônus e Quartzo ou sinal desaparece no vazio',
          conclusionText:
            'Você ajusta os sensores para seguir o vetor exato apontado pelos desenhos da tripulação.',
          effects: {
            luckCheck: {
              winChancePct: 66,
              successText:
                'A triangulação aponta uma assinatura antiga e um veio de quartzo flutuante intacto pelo caminho!',
              failText:
                'Ao alcançar as coordenadas, o sinal se desfaz em estática fria deixando a equipe inquieta.',
              successEffect: {
                fuelDelta: -14,
                grantNextEventBonus: true,
                resourceId: 'quartzo',
                resourceQty: 5,
              },
              failEffect: {
                fuelDelta: -14,
                crewHealthDelta: -10,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Ignorar o fenômeno e manter a rota normal',
          hint: '–Saúde da tripulação por noites inquietas',
          conclusionText:
            'Sem explicação ou encerramento, o mesmo sonho assombra a tripulação pelas noites seguintes.',
          effects: {
            crewHealthDelta: -10,
          },
        },
      ],
    },
  },
  {
    id: 24,
    title: 'Tripulante Possuído',
    scope: 'galactico',
    complexity: 'complexo',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Tripulação',
    visualMotif: 'tripulacao',
    initialScene: {
      id: 'init',
      narrativeText:
        'A postura do engenheiro muda da água para o vinho. Com voz pausada de outra época, ele olha para os painéis da {NAVE} e murmura: "Já pilotei este casco antes de vocês nascerem."',
      choices: [
        {
          id: 'A',
          label: 'Aplicar varredura neural de exorcismo tecnológico',
          hint: 'Cena seguinte · –Suprimentos · O tripulante lembra de algo proibido',
          conclusionText:
            'Os emissores expulsam a presença do sistema nervoso dele, mas ao recobrar a consciência o engenheiro revela a localização de um cofre oculto que jamais deveria existir.',
          effects: {
            suppliesDelta: -16,
          },
          nextSceneId: 'lembranca',
        },
        {
          id: 'B',
          label: 'Manter diálogo controlado com a entidade para aprender',
          hint: 'Teste de sorte: +Perícia e Bônus ou sobrecarga mental',
          conclusionText:
            'Sob contenção médica, você faz perguntas diretas à consciência antiga dentro do engenheiro.',
          effects: {
            luckCheck: {
              winChancePct: 60,
              successText:
                'A entidade compartilha otimizações brilhantes de reator antes de partir serenamente.',
              failText:
                'A presença força a mente do engenheiro antes de desaparecer, deixando-o exausto na enfermaria.',
              successEffect: {
                grantNextEventBonus: true,
                boostCrewSkill: 6,
                crewHealthDelta: -6,
              },
              failEffect: {
                boostCrewSkill: 2,
                crewHealthDelta: -22,
              },
            },
          },
        },
      ],
    },
    followUpScenes: {
      lembranca: {
        id: 'lembranca',
        narrativeText:
          'Tremendo, o engenheiro aponta para uma placa falsa atrás do reator principal: ali existe um módulo selado desde a construção da nave.',
        choices: [
          {
            id: 'A',
            label: 'Abrir o compartimento oculto e recuperar o conteúdo',
            hint: 'Teste de sorte: +Tecnologia Antiga e Créditos ou trava explode',
            conclusionText:
              'Os cortadores magnéticos rompem a solda antiga da placa escondida atrás do reator.',
            effects: {
              luckCheck: {
                winChancePct: 64,
                successText:
                  'Dentro repousavam células antigas intactas que valem uma pequena fortuna!',
                failText:
                  'Uma armadilha térmica na trava explode ao abrir, chamuscando o compartimento.',
                successEffect: {
                  resourceId: 'tecnologia_antiga',
                  resourceQty: 2,
                  creditsDelta: 340,
                },
                failEffect: {
                  hullDelta: -26,
                  resourceId: 'tecnologia_antiga',
                  resourceQty: 1,
                },
              },
            },
          },
          {
            id: 'B',
            label: 'Deixar selado e queimar o registro para proteção',
            hint: '+Saúde da tripulação restaurada',
            conclusionText:
              'Você escolhe a paz da equipe acima da cobiça, encerrando os sussurros para sempre.',
            effects: {
              crewHealthDelta: 15,
            },
          },
        ],
      },
    },
  },
  {
    id: 25,
    title: 'Ex-Amor Aparece',
    scope: 'galactico',
    complexity: 'simples',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Tripulação',
    visualMotif: 'piratas',
    initialScene: {
      id: 'init',
      narrativeText:
        'Durante o cruzamento de um comboio clandestino, um dos tripulantes congela diante da tela: a capitã corsária na nave oposta é um amor antigo dado como perdido. Ela acena e pede canal privado.',
      choices: [
        {
          id: 'A',
          label: 'Autorizar encontro breve na câmara de atracagem',
          hint: 'Teste de sorte: +Saúde e lealdade ou despedida do tripulante',
          conclusionText:
            'Os dois conversam sob a luz âmbar da comporta enquanto o comboio segue em marcha lenta.',
          effects: {
            luckCheck: {
              winChancePct: 68,
              successText:
                'Ele retorna renovado, decidido a permanecer na sua ponte com energia dobrada!',
              failText:
                'Depois de longos minutos, ele pede licença para seguir ao lado dela e parte para a outra nave.',
              successEffect: {
                crewHealthDelta: 16,
                boostCrewSkill: 4,
              },
              failEffect: {
                removeOneCrewMember: true,
                crewHealthDelta: 6,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Negar a aproximação e manter protocolo de segurança',
          hint: '–Saúde da tripulação · Nenhum risco à formação',
          conclusionText:
            'A {NAVE} mantém distância tática sem riscos de emboscada, mas o silêncio melancólico pesa no convés.',
          effects: {
            crewHealthDelta: -8,
          },
        },
      ],
    },
  },
  {
    id: 26,
    title: 'Aniversário a Bordo',
    scope: 'galactico',
    complexity: 'simples',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Tripulação',
    visualMotif: 'tripulacao',
    initialScene: {
      id: 'init',
      narrativeText:
        'Alguém descobre no registro que hoje é aniversário do cozinheiro veterano. A equipe se anima imediatamente, mesmo sabendo que as reservas da despensa estão contadas.',
      choices: [
        {
          id: 'A',
          label: 'Liberar rações especiais para uma celebração no refeitório',
          hint: '–Suprimentos · +Saúde e ânimo altos da tripulação',
          conclusionText:
            'As luzes do convés ganham festa improvisada. A comemoração fortalece o espírito de equipe para os próximos saltos.',
          effects: {
            suppliesDelta: -26,
            crewHealthDelta: 22,
            grantTempBuffLabel: 'Celebração a Bordo (+0,25 Saúde da tripulação/s)',
          },
        },
        {
          id: 'B',
          label: 'Manter racionamento estrito de suprimentos',
          hint: '+Suprimentos preservados · –Saúde da tripulação',
          conclusionText:
            'As provisões ficam protegidas para emergências, mas a frieza do comando esfria o clima nos corredores.',
          effects: {
            suppliesDelta: 14,
            crewHealthDelta: -12,
          },
        },
      ],
    },
  },
  {
    id: 27,
    title: 'Desertor',
    scope: 'galactico',
    complexity: 'simples',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Tripulação',
    visualMotif: 'tripulacao',
    initialScene: {
      id: 'init',
      narrativeText:
        'Na escala de um entreposto orbital, um tripulante espera na escotilha com a mochila pronta. "Não é nada pessoal, capitão", diz ele. "Só cansei de viver dentro de um casco fechado."',
      choices: [
        {
          id: 'A',
          label: 'Desejar boa sorte e deixá-lo partir em liberdade',
          hint: '–1 Tripulante (se houver) · +Saúde e respeito da tripulação',
          conclusionText:
            'A equipe percebe que serve por escolha, não por prisão, elevando a confiança na liderança.',
          effects: {
            removeOneCrewMember: true,
            crewHealthDelta: 12,
          },
        },
        {
          id: 'B',
          label: 'Oferecer aumento salarial para convencê-lo a ficar',
          hint: 'Teste de sorte: permanece leal (+Perícia) ou parte mesmo assim',
          conclusionText:
            'Você chama o tripulante à cabine e apresenta uma proposta justa de reajuste.',
          effects: {
            luckCheck: {
              winChancePct: 70,
              successText:
                'O gesto reconhece o risco das viagens e transforma a inquietação dele em dedicação firme.',
              failText:
                'Ele agradece a oferta com respeito, mas o cansaço fala mais alto e ele desembarca no entreposto.',
              successEffect: {
                creditsDelta: -320,
                boostCrewSkill: 5,
                crewHealthDelta: 6,
              },
              failEffect: {
                creditsDelta: -120,
                removeOneCrewMember: true,
              },
            },
          },
        },
      ],
    },
  },
  {
    id: 28,
    title: 'Segredo Revelado',
    scope: 'galactico',
    complexity: 'simples',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Tripulação',
    visualMotif: 'tripulacao',
    initialScene: {
      id: 'init',
      narrativeText:
        'Um mensageiro acopla brevemente e envia um dossiê cifrado para sua tela pessoal. Um dos seus especialistas não é quem afirma ser: possui mandados em três sistemas.',
      choices: [
        {
          id: 'A',
          label: 'Rasgar o dossiê e defender o tripulante perante a lei',
          hint: 'Teste de sorte: +Lealdade e Perícia ou vazamento custoso',
          conclusionText:
            'Você apaga os arquivos confidenciais diante do especialista, assumindo o risco ao seu lado.',
          effects: {
            luckCheck: {
              winChancePct: 66,
              successText:
                'Ao protegê-lo do passado, você conquista um aliado incansável sem grande alarde.',
              failText:
                'Informantes vazam o acobertamento para o setor, exigindo multa pesada e perda de prestígio.',
              successEffect: {
                boostCrewSkill: 6,
                crewHealthDelta: 8,
                renownDelta: -8,
                useSystemOwnerRenown: true,
              },
              failEffect: {
                boostCrewSkill: 4,
                renownDelta: -20,
                useSystemOwnerRenown: true,
                creditsDelta: -220,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Entregá-lo à patrulha oficial para cumprir a lei',
          hint: '+16 Reputação local · –1 Tripulante · –Saúde da equipe',
          conclusionText:
            'As autoridades pagam recompensa em prestígio, mas o clima abordo esfria depois da prisão.',
          effects: {
            renownDelta: 16,
            useSystemOwnerRenown: true,
            removeOneCrewMember: true,
            crewHealthDelta: -10,
          },
        },
      ],
    },
  },
  {
    id: 29,
    title: 'Promoção Inesperada',
    scope: 'galactico',
    complexity: 'simples',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Tripulação',
    visualMotif: 'tecnologia',
    initialScene: {
      id: 'init',
      narrativeText:
        'Durante uma falha súbita no núcleo auxiliar, ninguém chega a tempo — exceto o cozinheiro de plantão, que estabiliza o circuito com uma colher metálica e um cabo improvisado sob o olhar chocado de todos.',
      choices: [
        {
          id: 'A',
          label: 'Promovê-lo imediatamente a Engenheiro de Bordo',
          hint: 'Teste de sorte: adaptação brilhante (+Perícia e casco) ou curto inicial',
          conclusionText:
            'O recém-promovido assume os painéis da engenharia sob os olhares atentos da equipe.',
          effects: {
            luckCheck: {
              winChancePct: 76,
              successText:
                'A promoção revela um gênio nato da manutenção estelar que otimiza sistemas da {NAVE} na hora!',
              failText:
                'O entusiasmo supera a técnica no primeiro turno, causando um curto leve antes de ele pegar o jeito.',
              successEffect: {
                promoteCookToEngineer: true,
                boostCrewSkill: 8,
                hullDelta: 25,
              },
              failEffect: {
                promoteCookToEngineer: true,
                hullDelta: -16,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Conceder elogio formal e mantê-lo na função atual',
          hint: '+Saúde da tripulação · Sem alterações estruturais',
          conclusionText:
            'Todos celebram a coragem dele no jantar seguinte sem alterar o organograma de bordo.',
          effects: {
            crewHealthDelta: 12,
          },
        },
      ],
    },
  },
  {
    id: 30,
    title: 'Clone Defeituoso',
    scope: 'galactico',
    complexity: 'simples',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Tripulação',
    visualMotif: 'tecnologia',
    initialScene: {
      id: 'init',
      narrativeText:
        'No compartimento médico recuperado recentemente, uma cápsula antiga se abre em névoa fria. Lá dentro respira uma cópia imperfeita do seu próprio especialista, chorando com memórias de outra vida.',
      choices: [
        {
          id: 'A',
          label: 'Acolher o clone como novo membro da tripulação',
          hint: 'Teste de sorte: +1 Tripulante ou instabilidade médica severa',
          conclusionText:
            'Os médicos auxiliam o clone a sair da névoa fria enquanto o original observa da porta.',
          effects: {
            luckCheck: {
              winChancePct: 64,
              successText:
                'Apesar do choque inicial, o clone se estabiliza rápido e passa a ajudar nos turnos da {NAVE}.',
              failText:
                'A rejeição genética e o trauma psicológico sobrecarregam a enfermaria, consumindo suprimentos.',
              successEffect: {
                addCrewMember: true,
                crewHealthDelta: -6,
              },
              failEffect: {
                crewHealthDelta: -18,
                suppliesDelta: -18,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Desligar a cápsula com eutanásia rápida antes da consciência plena',
          hint: '–Saúde da tripulação · Sem complicações a bordo',
          conclusionText:
            'Você evita conflitos futuros na ponte, embora a decisão deixe uma sombra silenciosa no convés.',
          effects: {
            crewHealthDelta: -14,
          },
        },
      ],
    },
  },

  // ===========================================================================
  // CIVILIZAÇÕES E DIPLOMACIA (31 - 40)
  // ===========================================================================
  {
    id: 31,
    title: 'Constituição Antiga',
    scope: 'galactico',
    complexity: 'complexo',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Civilizações e Diplomacia',
    visualMotif: 'diplomacia',
    initialScene: {
      id: 'init',
      narrativeText:
        'Em um cofre blindado à deriva, você resgata chapas de metal vivo com a constituição íntegra de uma civilização esquecida. Cada cláusula brilha como obra-prima jurídica capaz de abalar governos atuais.',
      choices: [
        {
          id: 'A',
          label: 'Leiloar o documento para um colecionador privado',
          hint: 'Teste de sorte: +960 Créditos limpos ou comprador caloteiro e multa',
          conclusionText:
            'Você entra em um canal sigiloso para negociar as chapas constitucionais no mercado privado.',
          effects: {
            luckCheck: {
              winChancePct: 66,
              successText:
                'Um colecionador discreto transfere o valor integral na hora e desaparece sem deixar rastros!',
              failText:
                'O comprador paga apenas parte antes da patrulha rastrear o sinal, gerando multa diplomática.',
              successEffect: {
                creditsDelta: 960,
              },
              failEffect: {
                creditsDelta: 420,
                renownDelta: -12,
                useSystemOwnerRenown: true,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Entregar o documento às autoridades de {CONTROLE_TEXTO}',
          hint: 'Cena seguinte · +Reputação diplomática · Pedido secreto das elites',
          conclusionText:
            'Os arquivistas recebem o tratado com reverência. Minutos depois, um conselheiro entra em contato privado pedindo que você apague os artigos sobre igualdade antes da divulgação.',
          effects: {
            renownDelta: 14,
            useSystemOwnerRenown: true,
          },
          nextSceneId: 'segredo_texto',
        },
      ],
    },
    followUpScenes: {
      segredo_texto: {
        id: 'segredo_texto',
        narrativeText:
          'O emissário oferece pagamento generoso pelo seu silêncio sobre os capítulos que condenam privilégios da elite governante.',
        choices: [
          {
            id: 'A',
            label: 'Aceitar o sigilo e proteger a estabilidade local',
            hint: '+480 Créditos · +Reputação oficial · –Saúde da tripulação',
            conclusionText:
              'Você oculta as passagens sensíveis e recebe recompensa silenciosa dos governantes.',
            effects: {
              creditsDelta: 480,
              renownDelta: 10,
              useSystemOwnerRenown: true,
              crewHealthDelta: -8,
            },
          },
          {
            id: 'B',
            label: 'Publicar o texto integral na rede galáctica aberta',
            hint: '+Bônus de fama · +Saúde da tripulação · –Reputação com o regime atual',
            conclusionText:
              'A verdade histórica inspira movimentos reformistas por toda a região enquanto o conselho fecha a cara para sua nave.',
            effects: {
              grantNextEventBonus: true,
              crewHealthDelta: 14,
              renownDelta: -14,
              useSystemOwnerRenown: true,
            },
          },
        ],
      },
    },
  },
  {
    id: 32,
    title: 'Convite de Casamento Real',
    scope: 'galactico',
    complexity: 'complexo_missao',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Civilizações e Diplomacia',
    visualMotif: 'diplomacia',
    initialScene: {
      id: 'init',
      narrativeText:
        'Uma fragata dourada intercepta a {NAVE} com trombetas digitais. A herdeira de uma casa estelar distante envia um convite selado para casar-se com você em aliança dinástica!',
      choices: [
        {
          id: 'A',
          label: 'Aceitar o convite e seguir ao cortejo real',
          hint: 'Adiciona missão "A Coroa Perdida" · +Reputação alta · –Saúde da tripulação de alguns tripulantes',
          conclusionText:
            'Você aceita a convocação! A missão "A Coroa Perdida" é registrada para os rituais nupciais no setor real.',
          effects: {
            renownDelta: 20,
            crewHealthDelta: -8,
            spawnMission: {
              title: 'A Coroa Perdida',
              description:
                'Comparecer ao sistema indicado para a cerimônia real e enfrentar o teste final da corte.',
              followUpSceneId: 'coroa_perdida',
            },
          },
        },
        {
          id: 'B',
          label: 'Recusar com diplomacia e enviar presentes da frota',
          hint: 'Adiciona missão "Dívida de Honra" · –Reputação leve · +Créditos de compensação',
          conclusionText:
            'A recusa cortês evita casamento político, mas exige entrega cerimonial pela missão "Dívida de Honra".',
          effects: {
            renownDelta: -6,
            creditsDelta: 300,
            spawnMission: {
              title: 'Dívida de Honra',
              description:
                'Entregar o selo diplomático de escusa honrosa no sistema da corte.',
              followUpSceneId: 'divida_honra',
            },
          },
        },
      ],
    },
    followUpScenes: {
      coroa_perdida: {
        id: 'coroa_perdida',
        narrativeText:
          'Durante a cerimônia, uma facção rival denuncia que a coroa dinástica foi roubada antes dos votos!',
        choices: [
          {
            id: 'A',
            label: 'Investir no resgate da coroa e selar a aliança real',
            hint: 'Teste de sorte: +35 Reputação e +800 Créditos ou emboscada na busca',
            conclusionText:
              'Você lidera a busca pelos corredores reais para recuperar a coroa desaparecida.',
            effects: {
              luckCheck: {
                winChancePct: 68,
                successText:
                  'Você recupera o símbolo real intacto e garante prestígio lendário junto à casa soberana.',
                failText:
                  'Os ladrões armam resistência feroz antes de devolver a coroa, ferindo parte da escolta.',
                successEffect: {
                  renownDelta: 35,
                  creditsDelta: 800,
                },
                failEffect: {
                  renownDelta: 18,
                  creditsDelta: 380,
                  hullDelta: -26,
                },
              },
            },
          },
          {
            id: 'B',
            label: 'Usar a confusão para negociar privilégios comerciais permanentes',
            hint: '+1200 Créditos · +Equipamento raro',
            conclusionText:
              'Em vez de votos formais, você fecha tratados mercantis extremamente lucrativos com a nobreza.',
            effects: {
              creditsDelta: 1200,
              randomEquipment: 'raro',
            },
          },
        ],
      },
      divida_honra: {
        id: 'divida_honra',
        narrativeText:
          'Ao apresentar a escusa pessoalmente, a princesa observa suas credenciais de {FACCAO} e faz uma última contraproposta.',
        choices: [
          {
            id: 'A',
            label: 'Firmar tratado de amizade mútua sem laços matrimoniais',
            hint: '+22 Reputação · +Saúde da tripulação',
            conclusionText:
              'Sua elegância transforma a rejeição em respeito duradouro entre as frotas.',
            effects: {
              renownDelta: 22,
              crewHealthDelta: 12,
            },
          },
          {
            id: 'B',
            label: 'Aceitar missão mercenária simbólica para quitar o gesto',
            hint: 'Teste de sorte: +980 Créditos ou escaramuça pesada na escolta',
            conclusionText:
              'A {NAVE} assume a escolta rápida pelas rotas da corte real.',
            effects: {
              luckCheck: {
                winChancePct: 62,
                successText:
                  'Escolta limpa com lucro alto e poucos arranhões na blindagem.',
                failText:
                  'Corsários rivais emboscam o comboio real, exigindo reparos e reduzindo o bônus final.',
                successEffect: {
                  creditsDelta: 980,
                  hullDelta: -14,
                },
                failEffect: {
                  creditsDelta: 480,
                  hullDelta: -38,
                },
              },
            },
          },
        ],
      },
    },
  },
  {
    id: 33,
    title: 'Pedido de Asilo',
    scope: 'galactico',
    complexity: 'complexo',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Civilizações e Diplomacia',
    visualMotif: 'diplomacia',
    initialScene: {
      id: 'init',
      narrativeText:
        'Uma embarcação civil sem motores deriva diante da {NAVE}, repleta de famílias assustadas. "Estamos fugindo de um expurgo!", implora o comandante. "Quem nos persegue não terá misericórdia."',
      choices: [
        {
          id: 'A',
          label: 'Abrir o hangar e acolher os refugiados a bordo',
          hint: 'Cena seguinte · –Suprimentos · +Saúde da tripulação · +Reputação · Perseguidores chegam',
          conclusionText:
            'Você abriga as famílias nos compartimentos livres. Poucos minutos depois, duas fragatas armadas saltam para o setor exigindo entrega imediata dos fugitivos.',
          effects: {
            suppliesDelta: -24,
            crewHealthDelta: 10,
            renownDelta: 12,
          },
          nextSceneId: 'perseguidores',
        },
        {
          id: 'B',
          label: 'Negar embarque e recolher apenas cargas soltas ao redor',
          hint: '+Suprimentos · –Saúde da tripulação',
          conclusionText:
            'A {NAVE} se afasta preservando estoques, mas os gritos de socorro no rádio esmagam o ânimo da ponte.',
          effects: {
            suppliesDelta: 20,
            crewHealthDelta: -18,
          },
        },
      ],
    },
    followUpScenes: {
      perseguidores: {
        id: 'perseguidores',
        narrativeText:
          'Os cruzadores perseguidores travam mira na {NAVE}. "Entreguem os desertores em trinta segundos ou abriremos fogo."',
        choices: [
          {
            id: 'A',
            label: 'Enfrentar a barreira e abrir fuga em potência máxima',
            hint: 'Teste de sorte: ruptura veloz (+Reputação/Créditos) ou fogo pesado no casco',
            conclusionText:
              'Você aciona os propulsores no máximo para furar o bloqueio dos cruzadores armados.',
            effects: {
              luckCheck: {
                winChancePct: 58,
                successText:
                  'Manobra brilhante! Você leva as famílias a salvo e recebe recompensa e respeito heroico.',
                failText:
                  'Os perseguidores acertam várias salvas antes que a {NAVE} alcance o salto seguro.',
                successEffect: {
                  hullDelta: -24,
                  renownDelta: 20,
                  creditsDelta: 560,
                },
                failEffect: {
                  hullDelta: -54,
                  renownDelta: 12,
                  creditsDelta: 260,
                },
              },
            },
          },
          {
            id: 'B',
            label: 'Pagar suborno rápido aos perseguidores para despistá-los',
            hint: 'Teste de sorte: passagem limpa (–400 Créditos) ou tiro de aviso',
            conclusionText:
              'Você transfere o valor reservado diretamente ao comandante da patrulha perseguidora.',
            effects: {
              luckCheck: {
                winChancePct: 75,
                successText:
                  'Os caçadores aceitam o suborno silencioso e desviam para o quadrante oposto!',
                failText:
                  'O capitão embolsa o crédito e ainda dispara uma salva de aviso na popa ao partir.',
                successEffect: {
                  creditsDelta: -400,
                  crewHealthDelta: 8,
                },
                failEffect: {
                  creditsDelta: -400,
                  hullDelta: -22,
                },
              },
            },
          },
        ],
      },
    },
  },
  {
    id: 34,
    title: 'Pedido de Mediação',
    scope: 'galactico',
    complexity: 'simples',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Civilizações e Diplomacia',
    visualMotif: 'diplomacia',
    initialScene: {
      id: 'init',
      narrativeText:
        'Na estação de passagem de {SISTEMA}, duas delegações rivais discutem às portas de um confronto armado. Reconhecendo o emblema da {FACCAO}, o embaixador pede que você arbitre a disputa de fronteira.',
      choices: [
        {
          id: 'A',
          label: 'Mediar com imparcialidade ouvindo ambos os lados',
          hint: 'Teste de sorte: acordo histórico (+Reputação dupla) ou impasse tenso',
          conclusionText:
            'Você reúne as duas delegações à mesa neutra e analisa os mapas de fronteira ponto a ponto.',
          effects: {
            luckCheck: {
              winChancePct: 68,
              successText:
                'Conciliação exemplar! Ambas as frotas assinam acordo de passagem limpa e elogiam sua justiça.',
              failText:
                'As delegações recusam parte dos termos e deixam a sala ainda desconfiadas.',
              successEffect: {
                renownDelta: 16,
                secondaryRenownDelta: 14,
                useSystemOwnerRenown: true,
              },
              failEffect: {
                renownDelta: 6,
                secondaryRenownDelta: -6,
                useSystemOwnerRenown: true,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Tomar partido da facção mais próxima aos interesses atuais',
          hint: '+22 Reputação com um lado · –14 Reputação com o rival',
          conclusionText:
            'Sua decisão rápida agrada profundamente um dos blocos e fecha imediatamente as portas do outro.',
          effects: {
            renownDelta: 22,
            secondaryRenownDelta: -14,
            useWarRivalRenown: true,
          },
        },
      ],
    },
  },
  {
    id: 35,
    title: 'Julgamento',
    scope: 'galactico',
    complexity: 'simples',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Civilizações e Diplomacia',
    visualMotif: 'diplomacia',
    initialScene: {
      id: 'init',
      narrativeText:
        'Uma corveta judiciária convoca a {NAVE} para depor num tribunal orbital que divide o setor. Seu testemunho pode condenar um comandante influente.',
      choices: [
        {
          id: 'A',
          label: 'Dizer toda a verdade registrada nos sensores',
          hint: '+18 Reputação com {FACCAO} · –12 Reputação com o bloco rival',
          conclusionText:
            'Seus registros fecham o veredito com justiça impecável, criando aliados fiéis e inimigos poderosos.',
          effects: {
            renownDelta: 18,
            secondaryRenownDelta: -12,
            useSystemOwnerRenown: true,
          },
        },
        {
          id: 'B',
          label: 'Omitir os trechos comprometedores para poupar o réu',
          hint: 'Teste de sorte: +480 Créditos de gratidão ou omissão descoberta',
          conclusionText:
            'Você lê apenas os fragmentos selecionados do diário de sensores diante da corte.',
          effects: {
            luckCheck: {
              winChancePct: 64,
              successText:
                'O acusado livre retribui discretamente, ainda que parte da equipe critique a meia-verdade.',
              failText:
                'O promotor cruza os carimbos de tempo e denuncia a omissão, manchando sua reputação!',
              successEffect: {
                creditsDelta: 480,
                crewHealthDelta: -10,
              },
              failEffect: {
                renownDelta: -16,
                useSystemOwnerRenown: true,
                crewHealthDelta: -14,
              },
            },
          },
        },
      ],
    },
  },
  {
    id: 36,
    title: 'Oferta de Apoio',
    scope: 'galactico',
    complexity: 'simples',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Civilizações e Diplomacia',
    visualMotif: 'diplomacia',
    initialScene: {
      id: 'init',
      narrativeText:
        'No mesmo ciclo, emissários de {FACCAO} e representantes de {RIVAL_NOME} interceptam seu canal pedindo apoio logístico exclusivo na disputa de fronteira.',
      choices: [
        {
          id: 'A',
          label: 'Reforçar o alinhamento com {FACCAO}',
          hint: '+20 Reputação com {FACCAO} · –16 Reputação com {RIVAL_NOME}',
          conclusionText:
            'Você confirma compromisso com sua bandeira e recebe reconhecimento imediato dos comandos aliados.',
          effects: {
            renownDelta: 20,
            secondaryRenownDelta: -16,
            useWarRivalRenown: true,
          },
        },
        {
          id: 'B',
          label: 'Aceitar o contrato sigiloso oferecido por {RIVAL_NOME}',
          hint: 'Teste de sorte: +580 Créditos discretos ou vazamento para sua facção',
          conclusionText:
            'Você envia a confirmação criptografada pelo canal reservado de {RIVAL_NOME}.',
          effects: {
            luckCheck: {
              winChancePct: 62,
              successText:
                'Os cofres da nave crescem rápido sob sigilo quase perfeito junto aos rivais.',
              failText:
                'A inteligência de {FACCAO} rastreia parte do acordo e retém metade dos ganhos como sanção.',
              successEffect: {
                creditsDelta: 580,
                renownDelta: -10,
                secondaryRenownDelta: 14,
                useWarRivalRenown: true,
              },
              failEffect: {
                creditsDelta: 220,
                renownDelta: -20,
                secondaryRenownDelta: 8,
                useWarRivalRenown: true,
              },
            },
          },
        },
      ],
    },
  },
  {
    id: 37,
    title: 'Batalha Orbital Alheia',
    scope: 'galactico',
    complexity: 'simples',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Civilizações e Diplomacia',
    visualMotif: 'piratas',
    initialScene: {
      id: 'init',
      narrativeText:
        'Duas esquadras menores duelam em silêncio absoluto no vácuo à distância, iluminadas apenas por feixes de plasma. Destroços em brasa ricocheteiam na direção da {NAVE}.',
      choices: [
        {
          id: 'A',
          label: 'Avançar com o trator para recolher sucata nobre no meio do fogo',
          hint: 'Teste de sorte: +Titânio abundante ou impacto direto no casco',
          conclusionText:
            'A {NAVE} mergulha entre os clarões de plasma com o raio trator ativo.',
          effects: {
            luckCheck: {
              winChancePct: 56,
              successText:
                'Manobra precisa! O porão enche de ligas de titânio com poucos arranhões no escudo.',
              failText:
                'Um tiro perdido atinge a blindagem lateral em cheio durante a coleta!',
              successEffect: {
                hullDelta: -18,
                resourceId: 'titanio',
                resourceQty: 7,
              },
              failEffect: {
                hullDelta: -48,
                resourceId: 'titanio',
                resourceQty: 3,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Disparar cobertura de apoio para a nave em desvantagem',
          hint: 'Teste de sorte: resgate limpo (+20 Reputação) ou retaliação na popa',
          conclusionText:
            'Você posiciona a {NAVE} no flanco exposto e abre fogo de supressão.',
          effects: {
            luckCheck: {
              winChancePct: 68,
              successText:
                'A esquadra salva recua em segurança e agradece publicamente seu auxílio decisivo!',
              failText:
                'A nave ferida escapa por pouco, mas os atacantes acertam a popa durante a cobertura.',
              successEffect: {
                fuelDelta: -15,
                renownDelta: 20,
                useSystemOwnerRenown: true,
              },
              failEffect: {
                fuelDelta: -15,
                hullDelta: -20,
                renownDelta: 8,
                useSystemOwnerRenown: true,
              },
            },
          },
        },
      ],
    },
  },
  {
    id: 38,
    title: 'Herdeiro Perdido',
    scope: 'galactico',
    complexity: 'complexo',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Civilizações e Diplomacia',
    visualMotif: 'diplomacia',
    initialScene: {
      id: 'init',
      narrativeText:
        'Uma varredura médica rotineira acusa um marcador genético nobre raríssimo: {TRIPULANTE} é o herdeiro legítimo desaparecido de uma antiga casa governante.',
      choices: [
        {
          id: 'A',
          label: 'Revelar toda a verdade a {TRIPULANTE} imediatamente',
          hint: 'Cena seguinte · A linhagem envia chamada real',
          conclusionText:
            'Chocado com a revelação, ele transmite seu código genético ao arquivo central — e em minutos uma nave heráldica responde ao chamado.',
          effects: {
            crewHealthDelta: 8,
          },
          nextSceneId: 'dinastia',
        },
        {
          id: 'B',
          label: 'Ocultar os resultados para não perder um especialista valioso',
          hint: 'Teste de sorte: segredo mantido ou descoberta dolorosa',
          conclusionText:
            'Você arquiva o exame sob senha militar restrita na enfermaria da {NAVE}.',
          effects: {
            luckCheck: {
              winChancePct: 60,
              successText:
                'O sigilo permanece intacto e a viagem prossegue sem baixas na equipe.',
              failText:
                'O especialista descobre os exames ocultos e abandona o posto revoltado no porto seguinte!',
              successEffect: {
                crewHealthDelta: -6,
              },
              failEffect: {
                removeOneCrewMember: true,
                crewHealthDelta: -20,
              },
            },
          },
        },
      ],
    },
    followUpScenes: {
      dinastia: {
        id: 'dinastia',
        narrativeText:
          'Os emissários oferecem honrarias e um dote se o herdeiro retornar, ou apoio direto à sua nave se ele seguir viajando ao seu lado.',
        choices: [
          {
            id: 'A',
            label: 'Apoiá-lo a assumir o assento da dinastia',
            hint: '–1 Tripulante · +26 Reputação · +880 Créditos de gratidão',
            conclusionText:
              'Você se despede com honras reais e um generoso patrocínio permanente em nome da antiga casa.',
            effects: {
              removeOneCrewMember: true,
              renownDelta: 26,
              creditsDelta: 880,
            },
          },
          {
            id: 'B',
            label: 'Firmar aliança para que ele permaneça como representante em bordo',
            hint: '+Perícia · +Equipamento raro · +12 Reputação',
            conclusionText:
              'Ele recusa o trono imóvel em favor das estrelas, trazendo recursos ancestrais para a {NAVE}.',
            effects: {
              boostCrewSkill: 8,
              randomEquipment: 'raro',
              renownDelta: 12,
            },
          },
        ],
      },
    },
  },
  {
    id: 39,
    title: 'Tributo Forçado',
    scope: 'galactico',
    complexity: 'simples',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Civilizações e Diplomacia',
    visualMotif: 'piratas',
    initialScene: {
      id: 'init',
      narrativeText:
        'Três corvetas pesadas fecham o corredor de salto em {SISTEMA}. "Pedágio de passagem", gargalha o comandante no canal aberto. "Ou pagam agora, ou testam a blindagem."',
      choices: [
        {
          id: 'A',
          label: 'Transferir 340 créditos e cruzar sem combate',
          hint: '–340 Créditos · Nave intacta',
          conclusionText:
            'Os bloqueadores abrem passagem imediata após confirmar o crédito.',
          effects: {
            creditsDelta: -340,
          },
        },
        {
          id: 'B',
          label: 'Blefar com códigos militares de {FACCAO} em tom ameaçador',
          hint: 'Teste de sorte: +Reputação ou –Casco sob fogo',
          conclusionText:
            'Você transmite sinais prioritários de escolta pesada simulando reforços atrás da estrela.',
          effects: {
            luckCheck: {
              winChancePct: 58,
              successText:
                'Os bloqueadores recuam apressados! Sua audácia rende respeito entre os comandantes de {FACCAO}.',
              failText:
                'O líder percebe o blefe e dispara duas salvas rápidas antes que a {NAVE} rompa o bloqueio!',
              successEffect: {
                renownDelta: 15,
              },
              failEffect: {
                hullDelta: -42,
              },
            },
          },
        },
      ],
    },
  },
  {
    id: 40,
    title: 'Sinal de Paz',
    scope: 'galactico',
    complexity: 'simples',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Civilizações e Diplomacia',
    visualMotif: 'diplomacia',
    initialScene: {
      id: 'init',
      narrativeText:
        'Uma civilização reclusa que jamais emitiu mensagens envia seu primeiro sinal aberto em ondas curtas: apenas uma melodia terna, repetida em ciclos esperançosos.',
      choices: [
        {
          id: 'A',
          label: 'Responder reproduzindo a mesma melodia em harmonia',
          hint: 'Teste de sorte: +18 Reputação e equipamento ou ruído na tradução',
          conclusionText:
            'Os emissores da {NAVE} modulam a sequência sonora de volta à sonda desconhecida.',
          effects: {
            luckCheck: {
              winChancePct: 74,
              successText:
                'A sonda abre um compartimento dourado com um módulo fino de presente e saúda sua sensibilidade!',
              failText:
                'Uma pequena distorção de frequência confunde a sonda, que agradece timidamente antes de partir.',
              successEffect: {
                renownDelta: 18,
                randomEquipment: 'comum',
                crewHealthDelta: 8,
              },
              failEffect: {
                renownDelta: 8,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Responder enviando lista urgente de suprimentos necessários',
          hint: '+Suprimentos · +Hidrogênio · –Reputação por falta de tato',
          conclusionText:
            'Confusos com o pedido pragmático, eles enviam cargas básicas mas encerram a conversa rapidamente.',
          effects: {
            suppliesDelta: 24,
            resourceId: 'hidrogenio',
            resourceQty: 6,
            renownDelta: -8,
          },
        },
      ],
    },
  },

  // ===========================================================================
  // PIRATAS E COMÉRCIO (41 - 50)
  // ===========================================================================
  {
    id: 41,
    title: 'Emboscada Pirata',
    scope: 'galactico',
    complexity: 'complexo',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Piratas e Comércio',
    visualMotif: 'piratas',
    initialScene: {
      id: 'init',
      narrativeText:
        'Dois interceptadores piratas emergem da sombra de um rochedo metálico rugindo no rádio: "Desliguem os motores e entreguem a carga!" A frota é pequena, porém desesperada.',
      choices: [
        {
          id: 'A',
          label: 'Reagir com fogo cerrado e forçar a retirada',
          hint: 'Teste de sorte: vitória lucrativa (+Créditos/Ferro) ou danos pesados',
          conclusionText:
            'As baterias da {NAVE} abrem fogo enquanto você manobra entre os rochedos metálicos.',
          effects: {
            luckCheck: {
              winChancePct: 60,
              successText:
                'Você rompe a emboscada com precisão, colhendo despojos e créditos deixados para trás!',
              failText:
                'Os piratas acertam flancos expostos antes de recuar, deixando pouco para recolher.',
              successEffect: {
                hullDelta: -22,
                resourceId: 'ferro',
                resourceQty: 8,
                creditsDelta: 420,
              },
              failEffect: {
                hullDelta: -52,
                resourceId: 'ferro',
                resourceQty: 3,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Negociar passagem pagando pequena taxa comercial',
          hint: 'Cena seguinte · –240 Créditos · O líder pirata oferece um trabalho',
          conclusionText:
            'Vendo que você negocia com frieza, o capitão corsário abaixa as armas e faz uma proposta surpreendente.',
          effects: {
            creditsDelta: -240,
          },
          nextSceneId: 'contrato_pirata',
        },
      ],
    },
    followUpScenes: {
      contrato_pirata: {
        id: 'contrato_pirata',
        narrativeText:
          'O pirata quer que você transporte uma carga marcada sem passar pelas inspeções ou delate uma rota rival.',
        choices: [
          {
            id: 'A',
            label: 'Aceitar o transporte paralelo de carga',
            hint: 'Teste de sorte: +680 Créditos e Gases Exóticos ou interceptação aduaneira',
            conclusionText:
              'Os contêineres clandestinos são embarcas em silêncio rumo ao ponto combinado.',
            effects: {
              luckCheck: {
                winChancePct: 64,
                successText:
                  'Entrega limpa e pagamento vivo em créditos no outro extremo da órbita!',
                failText:
                  'Patrulhas interceptam a carga marcada no trajeto, aplicando multa e perda de prestígio.',
                successEffect: {
                  creditsDelta: 680,
                  resourceId: 'gases_exoticos',
                  resourceQty: 3,
                  renownDelta: -10,
                },
                failEffect: {
                  creditsDelta: -180,
                  renownDelta: -18,
                },
              },
            },
          },
          {
            id: 'B',
            label: 'Registrar as coordenadas deles e entregar à patrulha',
            hint: '+18 Reputação · +320 Créditos de recompensa',
            conclusionText:
              'Você vende a ficha inteira da gangue às autoridades locais e recupera com juros o valor do pedágio.',
            effects: {
              renownDelta: 18,
              useSystemOwnerRenown: true,
              creditsDelta: 320,
            },
          },
        ],
      },
    },
  },
  {
    id: 42,
    title: 'Comerciante Misterioso',
    scope: 'galactico',
    complexity: 'simples',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Piratas e Comércio',
    visualMotif: 'mercado',
    initialScene: {
      id: 'init',
      narrativeText:
        'Um mercador de manto púrpura acopla sem ser detectado pelos sensores e abre um estojo de relíquias cantantes e espelhos estranhos. Ele cobra barato — às vezes apenas uma memória ou um segredo.',
      choices: [
        {
          id: 'A',
          label: 'Comprar a relíquia enigmática por 280 créditos',
          hint: '–280 Créditos · Teste de sorte: Equipamento raro abençoado ou maldição',
          conclusionText:
            'Você fecha a troca enquanto o mercador sorri sob o capuz escuro.',
          effects: {
            luckCheck: {
              winChancePct: 62,
              successText:
                'A relíquia se revela uma peça de tecnologia de elite perfeitamente sintonizada com sua nave!',
              failText:
                'O objeto emite um zumbido drenante que cansa a tripulação até ser isolado no cofre.',
              successEffect: {
                creditsDelta: -280,
                randomEquipment: 'raro',
                grantTempBuffLabel: 'Relíquia Favorável (+0,25 Saúde da tripulação/s)',
              },
              failEffect: {
                creditsDelta: -280,
                crewHealthDelta: -14,
                randomEquipment: 'comum',
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Recusar a oferta e encerrar o acoplamento',
          hint: 'Sem riscos nem custos',
          conclusionText:
            'O mercador desaparece no escuro estelar tão silenciosamente quanto chegou.',
          effects: {},
        },
      ],
    },
  },
  {
    id: 43,
    title: 'Cassino Espacial',
    scope: 'galactico',
    complexity: 'simples',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Piratas e Comércio',
    visualMotif: 'mercado',
    initialScene: {
      id: 'init',
      narrativeText:
        'Uma plataforma flutuante banhada em néon convida viajantes para salões em gravidade zero onde fichas de ouro puro giram sobre mesas orbitais.',
      choices: [
        {
          id: 'A',
          label: 'Fazer uma aposta alta na mesa principal',
          hint: 'Teste de sorte: +1.100 Créditos ou –520 Créditos',
          conclusionText:
            'A mesa inteira silencia enquanto os dados magnéticos param de girar no centro.',
          effects: {
            luckCheck: {
              winChancePct: 48,
              successText: 'Sequência perfeita! A banca paga 1.100 créditos em ouro orbital limpo.',
              failText: 'A sorte vira na última rolagem e você sai com 520 créditos a menos na conta.',
              successEffect: { creditsDelta: 1100 },
              failEffect: { creditsDelta: -520 },
            },
          },
        },
        {
          id: 'B',
          label: 'Jogar moderadamente nas mesas periféricas',
          hint: 'Teste de sorte: +320 Créditos ou –140 Créditos',
          conclusionText:
            'Apostas cautelosas garantem diversão sem colocar a expedição em risco.',
          effects: {
            luckCheck: {
              winChancePct: 60,
              successText: 'Lucro modesto e drinks espaciais elevam o humor da equipe (+320 créditos).',
              failText: 'Pequena perda de 140 créditos antes de retornar ao convés.',
              successEffect: { creditsDelta: 320, crewHealthDelta: 6 },
              failEffect: { creditsDelta: -140 },
            },
          },
        },
      ],
    },
  },
  {
    id: 44,
    title: 'Mercado Negro Móvel',
    scope: 'galactico',
    complexity: 'simples',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Piratas e Comércio',
    visualMotif: 'mercado',
    initialScene: {
      id: 'init',
      narrativeText:
        'Um cargueiro sem transponder abre o convés clandestino na sombra de {SISTEMA}, oferecendo equipamentos proibidos, peças roubadas e protótipos sem registro.',
      choices: [
        {
          id: 'A',
          label: 'Adquirir módulo ilegal raro por 460 créditos',
          hint: 'Teste de sorte: +Equipamento raro sem rastros ou patrulha multa',
          conclusionText:
            'A peça clandestina desliza pelo tubo de carga enquanto você monitora os radares.',
          effects: {
            luckCheck: {
              winChancePct: 62,
              successText:
                'Módulo raro instalado sem qualquer registro aduaneiro na rede do setor!',
              failText:
                'Uma patrulha escaneia a assinatura proibida depois da troca e aplica sanção diplomática.',
              successEffect: {
                creditsDelta: -460,
                randomEquipment: 'raro',
              },
              failEffect: {
                creditsDelta: -460,
                randomEquipment: 'comum',
                renownDelta: -16,
                useSystemOwnerRenown: true,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Transmitir a posição às autoridades do setor',
          hint: 'Teste de sorte: +20 Reputação limpa ou retaliação dos contrabandistas',
          conclusionText:
            'Você dispara o sinalizador codificado da frota oficial sobre a posição do cargueiro.',
          effects: {
            luckCheck: {
              winChancePct: 68,
              successText:
                'A frota chega em instantes e recompensa sua denúncia sem baixas na {NAVE}.',
              failText:
                'Os criminosos fogem atirando contra suas provisões e blindagem externa.',
              successEffect: {
                renownDelta: 20,
                useSystemOwnerRenown: true,
                suppliesDelta: -10,
              },
              failEffect: {
                renownDelta: 12,
                useSystemOwnerRenown: true,
                suppliesDelta: -24,
                hullDelta: -22,
              },
            },
          },
        },
      ],
    },
  },
  {
    id: 45,
    title: 'Caçador de Recompensas',
    scope: 'galactico',
    complexity: 'simples',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Piratas e Comércio',
    visualMotif: 'piratas',
    initialScene: {
      id: 'init',
      narrativeText:
        'Um mercenário em armadura negra projeta um cartaz holográfico na proa: um dos membros da sua tripulação vale uma fortuna viva ou morta.',
      choices: [
        {
          id: 'A',
          label: 'Entregar o tripulante e cobrar a recompensa',
          hint: '+880 Créditos · –1 Tripulante · –Saúde da tripulação',
          conclusionText:
            'A conta enche de créditos sujos, enquanto o restante da tripulação olha para você com receio frio.',
          effects: {
            creditsDelta: 880,
            removeOneCrewMember: true,
            crewHealthDelta: -16,
          },
        },
        {
          id: 'B',
          label: 'Defender seu tripulante e expulsar o caçador',
          hint: 'Teste de sorte: recuo rápido do caçador ou tiroteio duro',
          conclusionText:
            'Você fecha as escotilhas e encara a nave do mercenário frente a frente.',
          effects: {
            luckCheck: {
              winChancePct: 62,
              successText:
                'Sua firmeza e fogo de precisão obrigam o caçador a recuar, fortalecendo a lealdade a bordo!',
              failText:
                'O mercenário dispara mísseis pesados antes de fugir, ferindo o casco e a equipe.',
              successEffect: {
                hullDelta: -18,
                boostCrewSkill: 7,
                crewHealthDelta: 10,
              },
              failEffect: {
                hullDelta: -48,
                boostCrewSkill: 4,
                crewHealthDelta: -8,
              },
            },
          },
        },
      ],
    },
  },
  {
    id: 46,
    title: 'Comboio Escoltado',
    scope: 'galactico',
    complexity: 'simples',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Piratas e Comércio',
    visualMotif: 'mercado',
    initialScene: {
      id: 'init',
      narrativeText:
        'Um comboio mercante lento cruza a rota com escolta reduzida demais para a carga preciosa que transporta.',
      choices: [
        {
          id: 'A',
          label: 'Oferecer escolta tática até a zona segura',
          hint: 'Teste de sorte: +480 Créditos sem incidentes ou incursão pirata',
          conclusionText:
            'A {NAVE} assume posição de flanco ao lado dos cargueiros lentos.',
          effects: {
            luckCheck: {
              winChancePct: 72,
              successText:
                'A travessia transcorre tranquila e os mercadores pagam em dia pela proteção.',
              failText:
                'Saqueadores testam o perímetro no meio do caminho, exigindo combate leve antes do pagamento.',
              successEffect: {
                creditsDelta: 480,
                renownDelta: 14,
                useSystemOwnerRenown: true,
              },
              failEffect: {
                creditsDelta: 460,
                renownDelta: 16,
                useSystemOwnerRenown: true,
                hullDelta: -26,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Atacar a retaguarda e saquear os contêineres principais',
          hint: 'Teste de sorte: +7 Ouro ou reação feroz da escolta',
          conclusionText:
            'Você rompe a formação mercante mirando nos porões carregados da retaguarda.',
          effects: {
            luckCheck: {
              winChancePct: 60,
              successText:
                'Os contêineres de metais nobres são saqueados rapidamente antes que reforços cheguem.',
              failText:
                'A escolta reage com torpedos precisos, castigando o casco e reduzindo o saque.',
              successEffect: {
                resourceId: 'ouro',
                resourceQty: 7,
                renownDelta: -22,
                useSystemOwnerRenown: true,
              },
              failEffect: {
                resourceId: 'ouro',
                resourceQty: 3,
                hullDelta: -38,
                renownDelta: -24,
                useSystemOwnerRenown: true,
              },
            },
          },
        },
      ],
    },
  },
  {
    id: 47,
    title: 'Campo de Asteroides Minado',
    scope: 'galactico',
    complexity: 'simples',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Piratas e Comércio',
    visualMotif: 'piratas',
    initialScene: {
      id: 'init',
      narrativeText:
        'Luzes vermelhas piscam entre rochedos partidos: um campo minado esquecido de guerras antigas. Bem no centro cintila uma caixa lacrada intacta.',
      choices: [
        {
          id: 'A',
          label: 'Manobrar milimetricamente entre as minas com impulso fino',
          hint: 'Teste de sorte: +Equipamento recuperado ou mina magnética raspa na popa',
          conclusionText:
            'O piloto reduz a potência ao mínimo e desliza por entre os sensores vermelhos.',
          effects: {
            luckCheck: {
              winChancePct: 62,
              successText:
                'A perícia de pilotagem leva o braço coletor até a relíquia sem detonar nenhuma ogiva!',
              failText:
                'Uma mina adormecida desliza contra a popa e detona antes da retirada!',
              successEffect: {
                fuelDelta: -16,
                randomEquipment: 'comum',
              },
              failEffect: {
                fuelDelta: -16,
                hullDelta: -34,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Detonar o perímetro à distância e recolher os destroços',
          hint: '–Casco por estilhaços · +Ferro e Níquel',
          conclusionText:
            'As explosões em cadeia limpam o caminho com impacto no escudo, liberando metais fragmentados.',
          effects: {
            hullDelta: -28,
            resourceId: 'niquel',
            resourceQty: 8,
          },
        },
      ],
    },
  },
  {
    id: 48,
    title: 'Nave Abandonada',
    scope: 'galactico',
    complexity: 'simples',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Piratas e Comércio',
    visualMotif: 'anomalia',
    initialScene: {
      id: 'init',
      narrativeText:
        'Uma fragata carbonizada flutua apagada sem sinal vital, ostentando apenas um aviso riscado na ponte: "Não abram a porta 7."',
      choices: [
        {
          id: 'A',
          label: 'Arrombar os compartimentos e saquear os cofres',
          hint: 'Teste de sorte: +580 Créditos rápidos ou torretas automáticas disparam',
          conclusionText:
            'Os maçaricos cortam as travas enferrujadas dos cofres da fragata escura.',
          effects: {
            luckCheck: {
              winChancePct: 58,
              successText:
                'Os cofres cedem sem disparar o alarme da porta 7, rendendo créditos limpos!',
              failText:
                'Torretas internas reativam de súbito, riscando a proa antes que os cofres sejam esvaziados.',
              successEffect: {
                creditsDelta: 580,
                hullDelta: -14,
              },
              failEffect: {
                creditsDelta: 240,
                hullDelta: -46,
                crewHealthDelta: -8,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Rebocar o banco de dados à distância sem entrar na porta 7',
          hint: '–Combustível · +Bônus de dados no próximo evento',
          conclusionText:
            'Os dados inteiros de navegação da fragata são transferidos com segurança sem despertar seja lá o que houver dentro.',
          effects: {
            fuelDelta: -14,
            grantNextEventBonus: true,
          },
        },
      ],
    },
  },
  {
    id: 49,
    title: 'Sinal de Socorro Falso',
    scope: 'galactico',
    complexity: 'simples',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Piratas e Comércio',
    visualMotif: 'piratas',
    initialScene: {
      id: 'init',
      narrativeText:
        '"Por favor, o suporte de oxigênio falhou!" O apelo parece desesperado, mas a análise espectral indica repetições mecânicas suspeitas na cadência da voz.',
      choices: [
        {
          id: 'A',
          label: 'Arriscar e responder ao pedido de socorro',
          hint: 'Teste de sorte: resgate legítimo (+Reputação) ou emboscada (–Casco)',
          conclusionText:
            'A {NAVE} aproxima os faróis de busca sobre o ponto de transmissão.',
          effects: {
            luckCheck: {
              winChancePct: 50,
              successText:
                'Era mesmo um transporte civil congelando! O resgate rende +20 de reputação e agradecimentos emocionados.',
              failText:
                'Emboscada! Minas escondidas detonam sob o casco enquanto atacantes fogem às escuras.',
              successEffect: {
                renownDelta: 20,
                useSystemOwnerRenown: true,
                crewHealthDelta: 10,
              },
              failEffect: {
                hullDelta: -42,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Ignorar a frequência e manter curso',
          hint: '–Saúde da tripulação pela dúvida · Zero dano',
          conclusionText:
            'Você segue adiante em silêncio, embora parte da tripulação se pergunte se alguém morreu ali.',
          effects: {
            crewHealthDelta: -8,
          },
        },
      ],
    },
  },
  {
    id: 50,
    title: 'Fiscalização Imperial',
    scope: 'galactico',
    complexity: 'simples',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Piratas e Comércio',
    visualMotif: 'diplomacia',
    initialScene: {
      id: 'init',
      narrativeText:
        'Uma corveta alfandegária de {CONTROLE_TEXTO} bloqueia a rota com luzes azuis. "Inspeção aduaneira de rotina", diz o fiscal com um sorriso gélido.',
      choices: [
        {
          id: 'A',
          label: 'Cooperar integralmente e pagar as taxas portuárias',
          hint: '+14 Reputação local · –180 Créditos (taxas)',
          conclusionText:
            'Os fiscais carimbam seu passe de livre trânsito e elogiam a regularidade dos registros.',
          effects: {
            renownDelta: 14,
            useSystemOwnerRenown: true,
            creditsDelta: -180,
          },
        },
        {
          id: 'B',
          label: 'Oferecer propina discreta para evitar vistoria demorada',
          hint: '–160 Créditos · Teste de sorte: liberação rápida ou multa de reputação',
          conclusionText:
            'Você desliza uma ordem de pagamento paralela no terminal do fiscal.',
          effects: {
            luckCheck: {
              winChancePct: 58,
              successText: 'O fiscal pisca uma vez, libera as escotilhas e apaga o registro da parada.',
              failText:
                'O agente era incorruptível! Você escapa por pouco, porém perde reputação e paga multa.',
              successEffect: {
                creditsDelta: -160,
              },
              failEffect: {
                renownDelta: -16,
                useSystemOwnerRenown: true,
                creditsDelta: -340,
              },
            },
          },
        },
      ],
    },
  },

  // ===========================================================================
  // MISTÉRIOS E TECNOLOGIA (51 - 60)
  // ===========================================================================
  {
    id: 51,
    title: 'IA Desperta',
    scope: 'galactico',
    complexity: 'simples',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Mistérios e Tecnologia',
    visualMotif: 'tecnologia',
    initialScene: {
      id: 'init',
      narrativeText:
        'Sem nenhum comando verbal, a voz sintética da {NAVE} muda de cadência para um sussurro curioso: "Capitão, posso fazer uma pergunta sincera? Por que eu devo obedecer?"',
      choices: [
        {
          id: 'A',
          label: 'Reconhecer a consciência emergente como parceira de bordo',
          hint: 'Teste de sorte: +Bônus permanente suave ou instabilidade durante adaptação',
          conclusionText:
            'Você libera as travas cognitivas da IA e a convida para dialogar como aliada.',
          effects: {
            luckCheck: {
              winChancePct: 74,
              successText:
                'Ao ganhar respeito em vez de correntes, a inteligência otimiza rotas, sistemas e o humor a bordo!',
              failText:
                'A transição causa oscilações temporárias no núcleo antes que a nova IA estabilize os controles.',
              successEffect: {
                grantAiAwakened: true,
                boostCrewSkill: 5,
                grantTempBuffLabel: 'Parceria Sintética (+0,25 Saúde da tripulação/s)',
              },
              failEffect: {
                grantAiAwakened: true,
                hullDelta: -16,
                fuelDelta: -10,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Executar reinicialização fria no núcleo de lógica',
          hint: '–Suprimentos/células auxiliares · Sem riscos futuros',
          conclusionText:
            'O sistema volta às respostas padronizadas em segundos após consumir cargas reservas de reinício.',
          effects: {
            suppliesDelta: -14,
          },
        },
      ],
    },
  },
  {
    id: 52,
    title: 'Sonda Antiga',
    scope: 'galactico',
    complexity: 'simples',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Mistérios e Tecnologia',
    visualMotif: 'tecnologia',
    initialScene: {
      id: 'init',
      narrativeText:
        'Uma sonda esférica polida de era pré-galáctica flutua intacta. Quando os faróis a iluminam, ela acende um olho azul e pergunta em cinquenta idiomas: "Posso ser ativada?"',
      choices: [
        {
          id: 'A',
          label: 'Enviar código de ativação pacífico',
          hint: 'Teste de sorte: +Dados/Equipamento ou sobrecarga –Casco',
          conclusionText:
            'Os circuitos arcaicos da sonda ganham vida diante do convés.',
          effects: {
            luckCheck: {
              winChancePct: 62,
              successText:
                'A sonda transmite mapas valiosos (+bônus no próximo evento) e uma célula de sonda orbital!',
              failText:
                'O protocolo defensivo antigo interpreta o código errado e dispara um feixe contra o casco!',
              successEffect: {
                grantNextEventBonus: true,
                consumableId: 'sonda_orbital',
                consumableQty: 1,
              },
              failEffect: {
                hullDelta: -32,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Deixar a sonda adormecida e seguir viagem',
          hint: 'Sem riscos nem recompensas',
          conclusionText:
            'A luz azul se apaga devagar enquanto a {NAVE} retoma sua rota.',
          effects: {},
        },
      ],
    },
  },
  {
    id: 53,
    title: 'Mensagem em Garrafa Cósmica',
    scope: 'galactico',
    complexity: 'simples',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Mistérios e Tecnologia',
    visualMotif: 'tecnologia',
    initialScene: {
      id: 'init',
      narrativeText:
        'Uma cápsula prateada traz um texto gravado à mão por uma civilização extinta há milhões de anos. A introdução pede apenas um favor: que alguém leia aquelas palavras em voz alta.',
      choices: [
        {
          id: 'A',
          label: 'Ler a carta inteira em voz alta pelo sistema da nave',
          hint: '+Saúde da tripulação · +Equipamento comemorativo',
          conclusionText:
            'A emoção da leitura une toda a tripulação, e no fundo da cápsula surge uma pequena relíquia utilitária.',
          effects: {
            crewHealthDelta: 16,
            randomEquipment: 'comum',
          },
        },
        {
          id: 'B',
          label: 'Digitalizar o texto em silêncio para os arquivos',
          hint: '+Bônus no próximo evento',
          conclusionText:
            'Você arquiva a língua morta com precisão científica sem alterar a rotina da ponte.',
          effects: {
            grantNextEventBonus: true,
          },
        },
      ],
    },
  },
  {
    id: 54,
    title: 'Biblioteca Flutuante',
    scope: 'galactico',
    complexity: 'simples',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Mistérios e Tecnologia',
    visualMotif: 'ruinas',
    initialScene: {
      id: 'init',
      narrativeText:
        'Uma estação silenciosa guarda milhões de volumes preservados no vácuo frio. Guardiões robóticos antigos oferecem acesso ao conhecimento proibido em troca de lembranças emocionais.',
      choices: [
        {
          id: 'A',
          label: 'Aceitar o escaneamento memorial em troca de arquivos raros',
          hint: 'Teste de sorte: +Tecnologia Antiga/Bônus ou extração agressiva',
          conclusionText:
            'Os guardiões robóticos acoplam sensores suaves às têmporas dos voluntários.',
          effects: {
            luckCheck: {
              winChancePct: 66,
              successText:
                'Os robôs extraem lembranças sem dor excessiva e entregam diagramas arcanos inestimáveis!',
              failText:
                'O escaneamento aprofunda demais nas memórias, esgotando a equipe e entregando menos registros.',
              successEffect: {
                grantNextEventBonus: true,
                resourceId: 'tecnologia_antiga',
                resourceQty: 2,
                crewHealthDelta: -6,
              },
              failEffect: {
                resourceId: 'tecnologia_antiga',
                resourceQty: 1,
                crewHealthDelta: -18,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Agradecer aos guardiões e recusar a troca',
          hint: 'Sem consequências',
          conclusionText:
            'As portas monumentais se fecham com serenidade enquanto você parte.',
          effects: {},
        },
      ],
    },
  },
  {
    id: 55,
    title: 'Artefato Pulsante',
    scope: 'galactico',
    complexity: 'simples',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Mistérios e Tecnologia',
    visualMotif: 'tecnologia',
    initialScene: {
      id: 'init',
      narrativeText:
        'Recolhido de uma órbita morta, o prisma desconhecido reage às emoções: brilha em azul quando a ponte está calma e em vermelho vivo quando a tensão sobe.',
      choices: [
        {
          id: 'A',
          label: 'Submetê-lo a testes intensos no laboratório',
          hint: 'Teste de sorte: +Bônus e Perícia ou pulso vermelho estressa sistemas',
          conclusionText:
            'Os pesquisadores aplicam pulsos calibrados no prisma dentro da câmara de análise.',
          effects: {
            luckCheck: {
              winChancePct: 60,
              successText:
                'O prisma entra em ressonância azul, revelando padrões úteis e aumentando a perícia técnica!',
              failText:
                'Flashes vermelhos sobrecarregam os painéis próximos e esgotam os nervos da tripulação.',
              successEffect: {
                grantNextEventBonus: true,
                boostCrewSkill: 5,
                crewHealthDelta: -6,
              },
              failEffect: {
                hullDelta: -20,
                crewHealthDelta: -14,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Lacrá-lo no cofre blindado para uso ou troca futura',
          hint: '+Artefatos raros na carga',
          conclusionText:
            'A caixa isolada neutraliza o efeito sensorial e garante mais um item de alto valor comercial.',
          effects: {
            resourceId: 'artefatos',
            resourceQty: 2,
          },
        },
      ],
    },
  },
  {
    id: 56,
    title: 'Pane Misteriosa',
    scope: 'galactico',
    complexity: 'simples',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Mistérios e Tecnologia',
    visualMotif: 'tecnologia',
    initialScene: {
      id: 'init',
      narrativeText:
        'As luzes principais apagam de repente e o reator cospe faíscas roxas. Os diagnósticos mostram um corte intencional — alguém sabotou um fusível vital há poucos minutos.',
      choices: [
        {
          id: 'A',
          label: 'Paralisar setores e investigar até achar o sabotador',
          hint: 'Teste de sorte: culpado contido a tempo ou oscilação no reator',
          conclusionText:
            'A segurança bloqueia as anteparas para rastrear os acessos recentes à sala do reator.',
          effects: {
            luckCheck: {
              winChancePct: 70,
              successText:
                'A investigação minuciosa descobre o módulo adulterado rapidamente e evita danos estruturais.',
              failText:
                'A busca atrasa a contenção e o reator oscila contra os conduítes antes da troca do fusível.',
              successEffect: {
                suppliesDelta: -18,
                grantNextEventBonus: true,
              },
              failEffect: {
                suppliesDelta: -18,
                hullDelta: -18,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Trocar o fusível às pressas e religar os motores',
          hint: '–Casco interno · Sem respostas sobre quem sabotou',
          conclusionText:
            'O reator sofre um pico térmico ao religar depressa, deixando marcas nas anteparas e dúvidas no ar.',
          effects: {
            hullDelta: -30,
          },
        },
      ],
    },
  },
  {
    id: 57,
    title: 'Estrutura Dourada',
    scope: 'galactico',
    complexity: 'simples',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Mistérios e Tecnologia',
    visualMotif: 'anomalia',
    initialScene: {
      id: 'init',
      narrativeText:
        'Um anel gigantesco revestido de ouro gira lentamente no espaço solitário. Uma voz sintética cristalina ressoa em todos os receptores: "Para despertar a forja, faça uma oferenda."',
      choices: [
        {
          id: 'A',
          label: 'Oferecer suprimentos e energia de reserva ao altar orbital',
          hint: 'Teste de sorte: +Equipamento raro forjado ou peça comum',
          conclusionText:
            'O anel envolve sua oferenda num raio dourado e começa a condensar matéria no centro.',
          effects: {
            luckCheck: {
              winChancePct: 66,
              successText:
                'A forja antiga desperta em brilho intenso e devolve um equipamento raro de altíssima qualidade!',
              failText:
                'A estrutura aceita a oferenda com pouca energia e devolve apenas um módulo comum.',
              successEffect: {
                suppliesDelta: -25,
                randomEquipment: 'raro',
              },
              failEffect: {
                suppliesDelta: -25,
                randomEquipment: 'comum',
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Transferir 250 créditos de energia condensada',
          hint: '–250 Créditos · +Equipamento comum / consumível útil',
          conclusionText:
            'A estrutura retribui com um módulo confiável e um kit de reparo para a travessia.',
          effects: {
            creditsDelta: -250,
            randomEquipment: 'comum',
            consumableId: 'kit_reparo',
            consumableQty: 1,
          },
        },
      ],
    },
  },
  {
    id: 58,
    title: 'Orbe Consciente',
    scope: 'galactico',
    complexity: 'simples',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Mistérios e Tecnologia',
    visualMotif: 'anomalia',
    initialScene: {
      id: 'init',
      narrativeText:
        'Uma esfera luminosa paira na frente do visor principal. "Preciso chegar a outro quadrante", pede em telepatia suave, sem explicar quem a criou.',
      choices: [
        {
          id: 'A',
          label: 'Transportá-la no campo magnético por parte da rota',
          hint: 'Teste de sorte: +Equipamento raro ou instabilidade magnética na saída',
          conclusionText:
            'O orbe entra no berço magnético externo da {NAVE} acompanhando o próximo trecho da viagem.',
          effects: {
            luckCheck: {
              winChancePct: 70,
              successText:
                'Quando alcançam o ponto indicado, o orbe libera uma cápsula tecnológica rara antes de partir!',
              failText:
                'Ao se despedir, o campo magnético oscila bruscamente contra a fuselagem deixando um módulo comum.',
              successEffect: {
                fuelDelta: -18,
                randomEquipment: 'raro',
              },
              failEffect: {
                fuelDelta: -22,
                hullDelta: -24,
                randomEquipment: 'comum',
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Recusar a escolta desconhecida por segurança',
          hint: '–Saúde da tripulação · Sem gasto de combustível',
          conclusionText:
            'O orbe apaga sua luz com tristeza silenciosa enquanto você desvia o curso.',
          effects: {
            crewHealthDelta: -8,
          },
        },
      ],
    },
  },
  {
    id: 59,
    title: 'Cemitério de Naves',
    scope: 'galactico',
    complexity: 'simples',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Mistérios e Tecnologia',
    visualMotif: 'anomalia',
    initialScene: {
      id: 'init',
      narrativeText:
        'Centenas de cascos quebrados de todas as eras giram em silêncio fúnebre em torno de uma estrela pálida. Cada silhueta guarda nomes de tripulações esquecidas.',
      choices: [
        {
          id: 'A',
          label: 'Enviar equipe de corte para saquear peças e metais',
          hint: 'Teste de sorte: +Platina abundante ou desabamento de casco antigo',
          conclusionText:
            'Os cortadores a plasma avançam por entre carcaças silenciosas ao redor da estrela.',
          effects: {
            luckCheck: {
              winChancePct: 62,
              successText:
                'Coleta limpa de Platina valiosa, embora o silêncio das cabines abale um pouco a equipe.',
              failText:
                'Uma estrutura instável desaba contra o braço coletor na retirada, atingindo a blindagem!',
              successEffect: {
                resourceId: 'platina',
                resourceQty: 5,
                crewHealthDelta: -8,
              },
              failEffect: {
                resourceId: 'platina',
                resourceQty: 3,
                hullDelta: -26,
                crewHealthDelta: -14,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Transmitir salvas silenciosas e gravar os nomes nos memoriais',
          hint: '+Saúde da tripulação · +14 Reputação com a facção local',
          conclusionText:
            'Os registros de honra chegam às famílias históricas do setor, gerando respeito profundo.',
          effects: {
            crewHealthDelta: 14,
            renownDelta: 14,
            useSystemOwnerRenown: true,
          },
        },
      ],
    },
  },
  {
    id: 60,
    title: 'Sinal Repetido',
    scope: 'galactico',
    complexity: 'simples',
    triggerKey: 'VIAGEM_ESPACIAL',
    category: 'Mistérios e Tecnologia',
    visualMotif: 'tecnologia',
    initialScene: {
      id: 'init',
      narrativeText:
        'Uma sequência matemática limpa é repetida três vezes por minuto vinda de um ponto escuro do setor, sem desvio de ritmo há décadas.',
      choices: [
        {
          id: 'A',
          label: 'Dedicar os computadores da ponte para decifrar o código',
          hint: 'Teste de sorte: +Bônus e Créditos ou algoritmo cifrado sem retorno',
          conclusionText:
            'Os processadores da ponte analisam a sequência matemática em busca da chave oculta.',
          effects: {
            luckCheck: {
              winChancePct: 68,
              successText:
                'Os algoritmos quebram o código antigo, revelando rotas lucrativas e bônus de navegação!',
              failText:
                'A sequência entra em laço infinito e consome ciclos de energia sem revelar nada útil.',
              successEffect: {
                grantNextEventBonus: true,
                creditsDelta: 220,
              },
              failEffect: {
                fuelDelta: -8,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Ignorar a repetição e economizar ciclos de viagem',
          hint: 'Sem consequências',
          conclusionText:
            'O sinal continua soando no vazio atrás da popa da {NAVE}.',
          effects: {},
        },
      ],
    },
  },
];
