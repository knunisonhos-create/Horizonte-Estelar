import type { NarrativeEventDef } from '../types/game';

export const NARRATIVE_EVENTS_PART2: NarrativeEventDef[] = [
  // ===========================================================================
  // CHAVE: EXPLORANDO_SUPERFICIE (61 - 72)
  // ===========================================================================
  {
    id: 61,
    title: 'Ruínas Enterradas',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'EXPLORANDO_SUPERFICIE',
    category: 'Exploração Planetária',
    visualMotif: 'ruinas',
    allowedPlanetCodes: ['TX01', 'TX02', 'TX04', 'TX08', 'TX09', 'TX21'],
    initialScene: {
      id: 'init',
      narrativeText:
        'A tempestade de poeira recua na superfície de {PLANETA} e revela um templo de basalto escuro. As inscrições esculpidas nas paredes parecem mudar de lugar sempre que ninguém olha diretamente para elas.',
      choices: [
        {
          id: 'A',
          label: 'Entrar na câmara subterrânea com lanternas táticas',
          hint: 'Teste de sorte: +Equipamento raro ou armadilha de poeira',
          conclusionText:
            'A equipe avança pelos degraus escuros de basalto iluminando os glifos mutáveis.',
          effects: {
            luckCheck: {
              winChancePct: 62,
              successText:
                'Os exploradores recuperam uma peça rara intacta no altar central antes que as inscrições fechem a passagem!',
              failText:
                'Uma queda de poeira tóxica força a retirada às pressas com apenas um item comum.',
              successEffect: {
                randomEquipment: 'raro',
                crewHealthDelta: -6,
              },
              failEffect: {
                randomEquipment: 'comum',
                crewHealthDelta: -18,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Escanear as paredes do lado de fora sem cruzar o limiar',
          hint: '+Bônus no próximo evento · +Relíquias Antigas',
          conclusionText:
            'Os sensores decifram o padrão mutável da arquitetura sem expor ninguém aos corredores sufocantes.',
          effects: {
            grantNextEventBonus: true,
            resourceId: 'reliquias',
            resourceQty: 1,
          },
        },
      ],
    },
  },
  {
    id: 62,
    title: 'Pegadas Gigantes',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'EXPLORANDO_SUPERFICIE',
    category: 'Exploração Planetária',
    visualMotif: 'criatura',
    allowedPlanetCodes: ['TX01', 'TX02', 'TX06', 'TX24', 'TX25'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Rastros de três metros de largura cruzam o solo de {PLANETA} e desaparecem dentro de uma fenda rochosa profunda. A terra ainda vibra sob as botas da equipe.',
      choices: [
        {
          id: 'A',
          label: 'Seguir os rastros até a entrada da caverna',
          hint: 'Teste de sorte: +Couro de Megafauna / Diamante raro ou –Saúde da equipe',
          conclusionText:
            'Os exploradores descem com cautela até a câmara úmida no fim da trilha.',
          effects: {
            luckCheck: {
              winChancePct: 60,
              successText:
                'Encontram um ninho abandonado repleto de minerais comprimidos e pele de megafauna!',
              failText:
                'Uma onda sísmica causada pela criatura nas profundezas fere a equipe na subida.',
              successEffect: {
                resourceId: 'diamante',
                resourceQty: 3,
              },
              failEffect: {
                crewHealthDelta: -18,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Marcar alerta geológico e evitar a fenda',
          hint: 'Sem riscos nem custos',
          conclusionText:
            'Você protege o grupo e prossegue por terreno firme em {PLANETA}.',
          effects: {},
        },
      ],
    },
  },
  {
    id: 63,
    title: 'Sobrevivente Isolado',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'EXPLORANDO_SUPERFICIE',
    category: 'Exploração Planetária',
    visualMotif: 'tripulacao',
    excludedPlanetCodes: ['TX03', 'TX04', 'TX12', 'TX13', 'TX14', 'TX15', 'TX16', 'TX31'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Entre formações erodidas de {PLANETA}, um náufrago espacial em trajes rasgados corre na direção da equipe, rindo e chorando: "Vocês finalmente captaram meu sinal!"',
      choices: [
        {
          id: 'A',
          label: 'Resgatá-lo e oferecer vaga na {NAVE}',
          hint: 'Teste de sorte: +1 Tripulante e Bônus ou exaustão impede ingresso',
          conclusionText:
            'O náufrago embarca na cápsula médica recebendo água, calor e primeiros socorros.',
          effects: {
            luckCheck: {
              winChancePct: 72,
              successText:
                'Depois dos cuidados médicos, ele se recupera rápido, integra a equipe e entrega dados de rota!',
              failText:
                'Desidratado demais para seguir viagem ativa, ele paga pela carona com coordenadas locais antes da alta médica.',
              successEffect: {
                suppliesDelta: -18,
                addCrewMember: true,
                grantNextEventBonus: true,
              },
              failEffect: {
                suppliesDelta: -18,
                creditsDelta: 180,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Deixar ração mínima e retornar à nave sem embarque',
          hint: '–Saúde da tripulação',
          conclusionText:
            'O recuo silencioso pesa nos rádios da equipe ao deixar o solitário para trás.',
          effects: {
            crewHealthDelta: -14,
          },
        },
      ],
    },
  },
  {
    id: 64,
    title: 'Cidade Subterrânea',
    scope: 'planetario',
    complexity: 'complexo_missao',
    triggerKey: 'EXPLORANDO_SUPERFICIE',
    category: 'Exploração Planetária',
    visualMotif: 'ruinas',
    requiresPlanetMaxLevel: 4,
    allowedPlanetCodes: ['TX01', 'TX02', 'TX08', 'TX21', 'TX26', 'TX29'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Uma escotilha camuflada sob o pó de {PLANETA} desce para uma metrópole subterrânea iluminada por fungos azulados. Moradores tímidos observam sua equipe das sacadas de pedra.',
      choices: [
        {
          id: 'A',
          label: 'Enviar saudação pacífica e pedir permissão formal para entrar',
          hint: 'Adiciona missão "O Pacto das Sombras" · +Reputação · +Equipamento raro',
          conclusionText:
            'Os guardiões permitem passagem até a praça central e propõem um acordo cultural pela missão "O Pacto das Sombras".',
          effects: {
            renownDelta: 12,
            useSystemOwnerRenown: true,
            spawnMission: {
              title: 'O Pacto das Sombras',
              description:
                'Validar o tratado da cidade subterrânea e regressar à órbita de {PLANETA} para selar a cooperação.',
              followUpSceneId: 'pacto_sombras',
            },
          },
        },
        {
          id: 'B',
          label: 'Forçar entrada pelos túneis e confiscar suprimentos locais',
          hint: 'Teste de sorte: +5 Ouro ou defesa química dos guardiões',
          conclusionText:
            'Os trajes avançam pelos túneis estreitos diante das barricadas dos moradores.',
          effects: {
            luckCheck: {
              winChancePct: 55,
              successText:
                'A equipe recolhe estoques de metais preciosos antes que os portões internos se fechem!',
              failText:
                'Os guardiões liberam gás defensivo pelos dutos, ferindo o grupo e reduzindo o saque.',
              successEffect: {
                resourceId: 'ouro',
                resourceQty: 5,
                renownDelta: -18,
                useSystemOwnerRenown: true,
              },
              failEffect: {
                resourceId: 'ouro',
                resourceQty: 2,
                crewHealthDelta: -14,
                renownDelta: -22,
                useSystemOwnerRenown: true,
              },
            },
          },
        },
      ],
    },
    followUpScenes: {
      pacto_sombras: {
        id: 'pacto_sombras',
        narrativeText:
          'O conselho subterrâneo reconhece sua palavra e entrega um cofre antigo de presente para o retorno à {NAVE}.',
        choices: [
          {
            id: 'A',
            label: 'Garantir o sigilo da cidade nas cartas estelares',
            hint: '+24 Reputação · +Equipamento raro',
            conclusionText:
              'Os anciãos agradecem com um equipamento lendário e amizade perpétua com sua tripulação.',
            effects: {
              renownDelta: 24,
              useSystemOwnerRenown: true,
              randomEquipment: 'raro',
            },
          },
          {
            id: 'B',
            label: 'Propor rota comercial discreta com o mundo da superfície',
            hint: 'Teste de sorte: +780 Créditos e Aerogel Vivo ou acordo tímido',
            conclusionText:
              'Você apresenta termos de troca discreta entre os mercadores do subsolo e os portos da superfície.',
            effects: {
              luckCheck: {
                winChancePct: 66,
                successText:
                  'A nova rota secreta fecha com êxito imediato, rendendo créditos altos e Aerogel Vivo!',
                failText:
                  'Os anciãos temem exposição na superfície e limitam a remessa inicial de estreia.',
                successEffect: {
                  creditsDelta: 780,
                  resourceId: 'aerogel_vivo',
                  resourceQty: 3,
                  renownDelta: 12,
                  useSystemOwnerRenown: true,
                },
                failEffect: {
                  creditsDelta: 380,
                  resourceId: 'aerogel_vivo',
                  resourceQty: 1,
                  renownDelta: 6,
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
    id: 65,
    title: 'Fonte da Juventude',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'EXPLORANDO_SUPERFICIE',
    category: 'Exploração Planetária',
    visualMotif: 'anomalia',
    allowedPlanetCodes: ['TX06', 'TX07', 'TX17', 'TX23', 'TX24', 'TX27'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Uma nascente de água prateada brota entre rochas rachadas em {PLANETA}. Guias locais afirmam que quem bebe recupera anos de vigor, mas jamais se lembra completamente de quem amou.',
      choices: [
        {
          id: 'A',
          label: 'Autorizar gole breve da fonte prateada',
          hint: 'Teste de sorte: +Vigor intenso ou choque neurológico',
          conclusionText:
            'Os exploradores mergulham os cantis na água prateada e provam um gole cuidadoso.',
          effects: {
            luckCheck: {
              winChancePct: 64,
              successText:
                'A vitalidade dispara pelas veias da equipe, apagando apenas pequenos códigos financeiros recentes.',
              failText:
                'A água provoca tontura intensa e confusão nos registros comerciais da expedição.',
              successEffect: {
                crewHealthDelta: 28,
                grantTempBuffLabel: 'Vigor da Nascente Prateada (+0,25 Saúde da tripulação/s)',
                creditsDelta: -120,
              },
              failEffect: {
                crewHealthDelta: -12,
                creditsDelta: -220,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Coletar apenas frascos selados para o laboratório',
          hint: '+Água / Compostos Luminosos e +Kit de Reparo médico',
          conclusionText:
            'A equipe evita riscos neurológicos e embarca amostras puras de altíssimo valor bioquímico.',
          effects: {
            resourceId: 'compostos_luminosos',
            resourceQty: 4,
            consumableId: 'antidoto',
            consumableQty: 1,
          },
        },
      ],
    },
  },
  {
    id: 66,
    title: 'Templo Vivo',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'EXPLORANDO_SUPERFICIE',
    category: 'Exploração Planetária',
    visualMotif: 'ruinas',
    allowedPlanetCodes: ['TX06', 'TX07', 'TX14', 'TX24', 'TX26'],
    initialScene: {
      id: 'init',
      narrativeText:
        'O santuário de {PLANETA} muda de geometria conforme vocês se aproximam. Torres esticam, arcos se fecham e janelas piscam como pálpebras orgânicas.',
      choices: [
        {
          id: 'A',
          label: 'Entrar no coração pulsante do templo',
          hint: 'Teste de sorte: +Equipamento raro ou constrição das paredes vivas',
          conclusionText:
            'Os exploradores cruzam os arcos móveis em direção ao altar pulsante no centro.',
          effects: {
            luckCheck: {
              winChancePct: 58,
              successText:
                'As paredes respiram enquanto o grupo retira uma relíquia rara e escapa antes da porta selar!',
              failText:
                'Os corredores orgânicos se estreitam rápido, ferindo a equipe na fuga com apenas biomassa.',
              successEffect: {
                randomEquipment: 'raro',
                crewHealthDelta: -8,
              },
              failEffect: {
                crewHealthDelta: -22,
                resourceId: 'biomassa_viva',
                resourceQty: 1,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Registrar a arquitetura viva a distância segura',
          hint: '+Bônus no próximo evento · +Biomassa Viva',
          conclusionText:
            'Os sensores captam sequências bioarquitetônicas fascinantes sem correr perigo de aprisionamento.',
          effects: {
            grantNextEventBonus: true,
            resourceId: 'biomassa_viva',
            resourceQty: 2,
          },
        },
      ],
    },
  },
  {
    id: 67,
    title: 'Flora Hipnótica',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'EXPLORANDO_SUPERFICIE',
    category: 'Exploração Planetária',
    visualMotif: 'criatura',
    allowedPlanetCodes: ['TX06', 'TX07', 'TX14', 'TX24', 'TX26', 'TX27'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Flores gigantes sussurram em frequências sonoras doces os desejos mais íntimos da equipe. Um dos exploradores tira o capacete e caminha hipnotizado para dentro do bosque.',
      choices: [
        {
          id: 'A',
          label: 'Resgatar o explorador à força e neutralizar os pólenes',
          hint: '–Suprimentos / energia do traje · Equipe retorna segura',
          conclusionText:
            'Com filtros extras e sedativos rápidos, vocês arrastam o colega para fora do campo sonoro ilesos.',
          effects: {
            suppliesDelta: -18,
            crewHealthDelta: 6,
          },
        },
        {
          id: 'B',
          label: 'Acompanhar o rastro até o centro do jardim hipnótico',
          hint: 'Teste de sorte: +Equipamento raro ou –1 Tripulante perdido',
          conclusionText:
            'A equipe abre caminho por cipós bioluminescentes até o núcleo do vale perfumado.',
          effects: {
            luckCheck: {
              winChancePct: 58,
              successText:
                'No centro das flores repousava uma cápsula antiga com equipamento raro preservado!',
              failText:
                'As raízes envolvem o explorador perdido antes que o resgate alcance a tempo.',
              successEffect: {
                randomEquipment: 'raro',
                resourceId: 'sementes',
                resourceQty: 4,
              },
              failEffect: {
                removeOneCrewMember: true,
                crewHealthDelta: -14,
              },
            },
          },
        },
      ],
    },
  },
  {
    id: 68,
    title: 'Tribo Nômade',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'EXPLORANDO_SUPERFICIE',
    category: 'Exploração Planetária',
    visualMotif: 'acampamento',
    allowedPlanetCodes: ['TX01', 'TX02', 'TX05', 'TX06', 'TX24', 'TX25', 'TX28'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Clãs nômades acampados sob as luas de {PLANETA} cercam sua equipe convidando para um ritual ao redor de fogueiras azuis. Recusar pode soar como desprezo.',
      choices: [
        {
          id: 'A',
          label: 'Participar com respeito do ritual da fogueira azul',
          hint: 'Teste de sorte: +16 Reputação e presente ou tontura do vapor',
          conclusionText:
            'A equipe senta-se em círculo diante das chamas azuladas aceitando a taça ritual.',
          effects: {
            luckCheck: {
              winChancePct: 68,
              successText:
                'Os chefes se emocionam com sua reverência e entregam um equipamento artesanal valioso!',
              failText:
                'A fumaça azul provoca tontura forte na equipe, reduzindo a troca cultural.',
              successEffect: {
                renownDelta: 16,
                useSystemOwnerRenown: true,
                randomEquipment: 'comum',
              },
              failEffect: {
                renownDelta: 8,
                useSystemOwnerRenown: true,
                crewHealthDelta: -16,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Recusar com reverência e seguir exploração',
          hint: 'Sem recompensas nem ofensas graves',
          conclusionText:
            'Os anciãos aceitam a despedida respeitosa e deixam a expedição partir em paz.',
          effects: {},
        },
      ],
    },
  },
  {
    id: 69,
    title: 'Esqueleto de Titã',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'EXPLORANDO_SUPERFICIE',
    category: 'Exploração Planetária',
    visualMotif: 'ruinas',
    allowedPlanetCodes: ['TX01', 'TX02', 'TX04', 'TX21', 'TX25'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Costelas fósseis colossais erguem-se contra o céu de {PLANETA} como catedrais brancas. Preso dentro da caixa torácica, um núcleo metálico brilha intensamente.',
      choices: [
        {
          id: 'A',
          label: 'Escalar as vértebras e retirar o objeto brilhante',
          hint: 'Teste de sorte: +Equipamento raro limpo ou desabamento sobre a nave',
          conclusionText:
            'Os escaladores sobem pelas vértebras gigantes para desencaixar o núcleo reluzente.',
          effects: {
            luckCheck: {
              winChancePct: 58,
              successText:
                'Retirada precisa! O objeto raro vem inteiro com apenas pequenos deslizes de cascalho.',
              failText:
                'Ao soltar a peça, uma costela milenar tomba sobre a fuselagem da nave estacionada abaixo!',
              successEffect: {
                randomEquipment: 'raro',
                hullDelta: -10,
              },
              failEffect: {
                randomEquipment: 'comum',
                hullDelta: -38,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Preservar o monumento intacto e seguir',
          hint: '+Saúde da tripulação · +Ossos Fósseis caídos no solo',
          conclusionText:
            'A tripulação recolhe apenas fragmentos soltos ao redor sem violar o gigante.',
          effects: {
            crewHealthDelta: 10,
            resourceId: 'ossos',
            resourceQty: 4,
          },
        },
      ],
    },
  },
  {
    id: 70,
    title: 'Chuva Ácida',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'EXPLORANDO_SUPERFICIE',
    category: 'Exploração Planetária',
    visualMotif: 'orbita',
    allowedPlanetCodes: ['TX04', 'TX07', 'TX13', 'TX14'],
    initialScene: {
      id: 'init',
      narrativeText:
        'O céu de {PLANETA} escurece de súbito e gotas esverdeadas começam a chiarem sobre trajes e metal exposto.',
      choices: [
        {
          id: 'A',
          label: 'Recolher a equipe em abrigo rochoso até a nuvem passar',
          hint: 'Nave e tripulação intactas',
          conclusionText:
            'A pausa segura evita qualquer corrosão até que o horizonte clareie novamente.',
          effects: {},
        },
        {
          id: 'B',
          label: 'Continuar avançando sob a chuva corrosiva para colher depósitos',
          hint: 'Teste de sorte: +Enxofre abundante ou corrosão severa no casco',
          conclusionText:
            'Você aciona os escudos externos e ordena avançar pelos depósitos amarelos sob a tempestade.',
          effects: {
            luckCheck: {
              winChancePct: 56,
              successText:
                'Os escudos resistem bem o bastante para colher enxofre abundante com corrosão leve.',
              failText:
                'Rajadas ácidas perfuram a cobertura protetora, marcando gravemente o casco da nave!',
              successEffect: {
                hullDelta: -16,
                resourceId: 'enxofre',
                resourceQty: 7,
              },
              failEffect: {
                hullDelta: -42,
                resourceId: 'enxofre',
                resourceQty: 4,
              },
            },
          },
        },
      ],
    },
  },
  {
    id: 71,
    title: 'Mapa Tatuado',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'EXPLORANDO_SUPERFICIE',
    category: 'Exploração Planetária',
    visualMotif: 'ruinas',
    allowedPlanetCodes: ['TX01', 'TX02', 'TX06', 'TX07', 'TX08', 'TX24', 'TX25', 'TX28'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Um eremita local exibe cicatrizes geométricas nos braços que formam um mapa detalhado de depósitos que ele jura nunca ter visto em vida.',
      choices: [
        {
          id: 'A',
          label: 'Contratá-lo como guia até a localização marcada',
          hint: 'Teste de sorte: –220 Créditos · +Equipamento raro ou esconderijo já saqueado',
          conclusionText:
            'A expedição segue o eremita por trilhas áridas até as coordenadas desenhadas em sua pele.',
          effects: {
            luckCheck: {
              winChancePct: 66,
              successText:
                'A trilha secreta termina num esconderijo soterrado contendo equipamento raro intacto!',
              failText:
                'Alguém já havia passado ali décadas atrás, restando apenas uma peça comum esquecida.',
              successEffect: {
                creditsDelta: -220,
                randomEquipment: 'raro',
              },
              failEffect: {
                creditsDelta: -220,
                randomEquipment: 'comum',
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Fotografar e analisar as marcas nos sensores',
          hint: '+Bônus no próximo evento',
          conclusionText:
            'Os mapas vetoriais enriquecem sua base de reconhecimento planetário.',
          effects: {
            grantNextEventBonus: true,
          },
        },
      ],
    },
  },
  {
    id: 72,
    title: 'Vale dos Ecos',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'EXPLORANDO_SUPERFICIE',
    category: 'Exploração Planetária',
    visualMotif: 'anomalia',
    allowedPlanetCodes: ['TX01', 'TX02', 'TX08', 'TX19', 'TX21'],
    initialScene: {
      id: 'init',
      narrativeText:
        'O cânion profundo de {PLANETA} devolve sons que nenhum membro da equipe produziu: risos infantis, gritos de batalha e antigas canções espaciais.',
      choices: [
        {
          id: 'A',
          label: 'Registrar o fenômeno acústico com paciência',
          hint: 'Teste de sorte: +Bônus e Créditos de pesquisa ou desconforto nos ouvidos',
          conclusionText:
            'Os microfones direcionais gravam as ondas sonoras que reverberam pelas paredes do cânion.',
          effects: {
            luckCheck: {
              winChancePct: 64,
              successText:
                'Os áudios revelam arquivos históricos raros sem afetar o equilíbrio da equipe.',
              failText:
                'As frequências sub-sônicas provocam enxaqueca aguda em toda a guarnição.',
              successEffect: {
                grantNextEventBonus: true,
                creditsDelta: 220,
              },
              failEffect: {
                grantNextEventBonus: true,
                crewHealthDelta: -16,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Atravessar o desfiladeiro em marcha rápida sem gravar nada',
          hint: 'Sem riscos nem ganhos',
          conclusionText:
            'O grupo cruza o vale antes do entardecer sem ocorrências.',
          effects: {},
        },
      ],
    },
  },

  // ===========================================================================
  // CHAVE: MINERANDO_SOLO (73 - 80)
  // ===========================================================================
  {
    id: 73,
    title: 'Veio Vivo',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'MINERANDO_SOLO',
    category: 'Mineração em Solo',
    visualMotif: 'mina',
    allowedPlanetCodes: ['TX01', 'TX04', 'TX06', 'TX07', 'TX08', 'TX09', 'TX10', 'TX11', 'TX14', 'TX20', 'TX24', 'TX25', 'TX26', 'TX27'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Sob a broca em {PLANETA}, o filão mineral pulsa em ritmo orgânico! Não é simples rocha — é a carapaça cristalizada de uma criatura subterrânea adormecida.',
      choices: [
        {
          id: 'A',
          label: 'Aumentar o torque da broca e extrair o veio rico mesmo assim',
          hint: 'Teste de sorte: +Cristais Energéticos abundantes ou reação sísmica da fera',
          conclusionText:
            'As brocas rompem a carapaça cristalina enquanto o solo vibra sob o trem de pouso.',
          effects: {
            luckCheck: {
              winChancePct: 56,
              successText:
                'Corte rápido antes que a criatura desperte por completo! O porão enche de Cristais Energéticos.',
              failText:
                'A fera subterrânea se contorce com violência, punindo o trem de pouso e o casco!',
              successEffect: {
                resourceId: 'cristais_energeticos',
                resourceQty: 7,
                hullDelta: -16,
              },
              failEffect: {
                resourceId: 'cristais_energeticos',
                resourceQty: 3,
                hullDelta: -42,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Desligar a perfuratriz e recuar com respeito',
          hint: '+Saúde da tripulação',
          conclusionText:
            'O pulso subterrâneo acalma devagar. A equipe agradece por não despertar uma catástrofe.',
          effects: {
            crewHealthDelta: 12,
          },
        },
      ],
    },
  },
  {
    id: 74,
    title: 'Gruta de Cristais Cantantes',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'MINERANDO_SOLO',
    category: 'Mineração em Solo',
    visualMotif: 'mina',
    allowedPlanetCodes: ['TX05', 'TX08', 'TX10', 'TX11', 'TX17', 'TX19', 'TX22', 'TX23', 'TX29'],
    initialScene: {
      id: 'init',
      narrativeText:
        'As correntes de ar fazem uma gruta inteira de quartzo cantar em acordes perfeitos. Cada fragmento vale caro, porém a vibração atrai predadores da superfície.',
      choices: [
        {
          id: 'A',
          label: 'Cortar todas as colunas maiores antes de subir',
          hint: 'Teste de sorte: +720 Créditos ou ataque intenso de predadores',
          conclusionText:
            'As serras cortam as colunas maiores enquanto ecos graves atravessam a caverna.',
          effects: {
            luckCheck: {
              winChancePct: 58,
              successText:
                'Vocês limpam a gruta rapidamente antes que o bando inteiro cerque a saída.',
              failText:
                'Predadores atacam com fúria durante a decolagem, arranhando seriamente o casco!',
              successEffect: {
                creditsDelta: 720,
                hullDelta: -14,
              },
              failEffect: {
                creditsDelta: 420,
                hullDelta: -38,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Colher apenas lascas soltas silenciosamente',
          hint: '+240 Créditos · Sem riscos',
          conclusionText:
            'Extração limpa e discreta antes que qualquer fera note sua presença.',
          effects: {
            creditsDelta: 240,
          },
        },
      ],
    },
  },
  {
    id: 75,
    title: 'Colapso da Mina',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'MINERANDO_SOLO',
    category: 'Mineração em Solo',
    visualMotif: 'mina',
    allowedPlanetCodes: ['TX01', 'TX02', 'TX04', 'TX08', 'TX09', 'TX13', 'TX20', 'TX21', 'TX29', 'TX30'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Um estrondo seco abala a galeria subterrânea em {PLANETA}. Poeira densa engole os refletores — um de seus operários ficou preso sob vigas caídas perto da carga já extraída.',
      choices: [
        {
          id: 'A',
          label: 'Abandonar os contêineres e resgatar o tripulante de imediato',
          hint: 'Teste de sorte: resgate ileso (+Saúde) ou ferimentos durante remoção',
          conclusionText:
            'A equipe larga as cargas de minério e corre para erguer as vigas sobre o colega preso.',
          effects: {
            luckCheck: {
              winChancePct: 74,
              successText:
                'Usando cargas de emergência, vocês erguem as pedras a tempo e salvam o companheiro sem baixas!',
              failText:
                'O companheiro é salvo, mas novas pedras caem durante o resgate ferindo o grupo.',
              successEffect: {
                suppliesDelta: -20,
                crewHealthDelta: 18,
              },
              failEffect: {
                suppliesDelta: -20,
                crewHealthDelta: -14,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Priorizar a retirada dos minérios antes do segundo desabamento',
          hint: '+Titânio extra · –1 Tripulante · –Saúde da tripulação',
          conclusionText:
            'Os contêineres sobem intactos, mas o segundo desmoronamento sela a galeria sobre o colega perdido.',
          effects: {
            resourceId: 'titanio',
            resourceQty: 7,
            removeOneCrewMember: true,
            crewHealthDelta: -22,
          },
        },
      ],
    },
  },
  {
    id: 76,
    title: 'Cápsula Selada',
    scope: 'planetario',
    complexity: 'complexo_missao',
    triggerKey: 'MINERANDO_SOLO',
    category: 'Mineração em Solo',
    visualMotif: 'tecnologia',
    excludedPlanetCodes: ['TX03', 'TX12', 'TX31'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Presa no meio de um veio de rocha milenar em {PLANETA}, surge uma cápsula metálica sem costuras visíveis. Algo bate ritmicamente pelo lado de dentro.',
      choices: [
        {
          id: 'A',
          label: 'Deslacrar a cápsula agora para investigar o interior',
          hint: 'Adiciona missão "O Que Dorme Dentro" · +Equipamento raro inicial',
          conclusionText:
            'Ao liberar os pinos magnéticos, um núcleo desperto foge para a órbita ativando a missão "O Que Dorme Dentro"!',
          effects: {
            randomEquipment: 'raro',
            spawnMission: {
              title: 'O Que Dorme Dentro',
              description:
                'Rastrear o sinal desperto da cápsula até o sistema marcado e decidir seu destino final.',
              followUpSceneId: 'dorme_dentro',
            },
          },
        },
        {
          id: 'B',
          label: 'Embarcar a cápsula ainda lacrada no porão',
          hint: '+Tecnologia Antiga · Teste de sorte: segura ou vazamento no casco',
          conclusionText:
            'A equipe ergue o cilindro intacto com guindastes até o compartimento blindado.',
          effects: {
            luckCheck: {
              winChancePct: 60,
              successText: 'Os selos suportam perfeitamente a subida orbital com Tecnologia Antiga preservada!',
              failText: 'Um pulso térmico interno rompe uma trava e queima parte do porão!',
              successEffect: {
                resourceId: 'tecnologia_antiga',
                resourceQty: 2,
              },
              failEffect: {
                resourceId: 'tecnologia_antiga',
                resourceQty: 2,
                hullDelta: -28,
              },
            },
          },
        },
      ],
    },
    followUpScenes: {
      dorme_dentro: {
        id: 'dorme_dentro',
        narrativeText:
          'No destino indicado, a entidade desperta da cápsula projeta imagens antigas e pede energia para concluir sua jornada.',
        choices: [
          {
            id: 'A',
            label: 'Alimentá-la com combustível e liberá-la no vazio',
            hint: '–Combustível · +26 Reputação · +Matéria Exótica',
            conclusionText:
              'Em gratidão luminosa, a entidade deixa um núcleo de Matéria Exótica e eleva seu prestígio estelar.',
            effects: {
              fuelDelta: -18,
              renownDelta: 26,
              resourceId: 'materia_exotica',
              resourceQty: 2,
            },
          },
          {
            id: 'B',
            label: 'Capturar o núcleo energético para estudo militar',
            hint: 'Teste de sorte: +980 Créditos e Equipamento raro ou descarga defensiva',
            conclusionText:
              'As garras de contenção avançam sobre o núcleo luminoso da entidade.',
            effects: {
              luckCheck: {
                winChancePct: 62,
                successText:
                  'Captura limpa! Os engenheiros do setor pagam uma soma alta e entregam um equipamento raro.',
                failText:
                  'Uma descarga energética da entidade atinge os sistemas durante a venda forçada.',
                successEffect: {
                  creditsDelta: 980,
                  randomEquipment: 'raro',
                },
                failEffect: {
                  creditsDelta: 520,
                  hullDelta: -20,
                  crewHealthDelta: -12,
                },
              },
            },
          },
        ],
      },
    },
  },
  {
    id: 77,
    title: 'Túnel Escavado por Outros',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'MINERANDO_SOLO',
    category: 'Mineração em Solo',
    visualMotif: 'mina',
    allowedPlanetCodes: ['TX01', 'TX02', 'TX08', 'TX09', 'TX18', 'TX21', 'TX28', 'TX30'],
    initialScene: {
      id: 'init',
      narrativeText:
        'A broca rompe para dentro de um túnel escavado com precisão cirúrgica onde não consta nenhuma colônia. Ferramentas abandonadas e uma caneca ainda morna repousam no chão.',
      choices: [
        {
          id: 'A',
          label: 'Explorar o túnel adiante em busca de quem escavou',
          hint: 'Teste de sorte: +Equipamento raro ou armadilha deixada para trás',
          conclusionText:
            'A equipe acende as lanternas e avança pelo corredor liso seguindo os rastros frescos.',
          effects: {
            luckCheck: {
              winChancePct: 64,
              successText:
                'No fim da galeria repousavam caixas de ferramentas raras abandonadas às pressas!',
              failText:
                'Um fio de alarme dispara uma carga de estilhaços na entrada do acampamento deserto.',
              successEffect: {
                randomEquipment: 'raro',
              },
              failEffect: {
                randomEquipment: 'comum',
                crewHealthDelta: -14,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Selar a abertura por precaução e continuar na jazida segura',
          hint: 'Sem riscos',
          conclusionText:
            'Você fecha o vão e mantém a equipe focada na superfície conhecida.',
          effects: {},
        },
      ],
    },
  },
  {
    id: 78,
    title: 'Veia de Material Radioativo',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'MINERANDO_SOLO',
    category: 'Mineração em Solo',
    visualMotif: 'mina',
    allowedPlanetCodes: ['TX13', 'TX04', 'TX15', 'TX21'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Os dosímetros gritam junto à rocha fendida: um veio puríssimo de isótopos e urânio brilha em azul pálido — lucro altíssimo, mas radiação perigosa.',
      choices: [
        {
          id: 'A',
          label: 'Minerar devagar usando escudos térmicos e suprimentos de filtro',
          hint: '+460 Créditos · +Urânio · –Suprimentos de proteção',
          conclusionText:
            'A blindagem extra consome reservas médicas e filtros, garantindo extração limpa sem baixas.',
          effects: {
            creditsDelta: 460,
            resourceId: 'uranio',
            resourceQty: 4,
            suppliesDelta: -20,
          },
        },
        {
          id: 'B',
          label: 'Extrair rapidamente em força máxima sem esperar blindagem',
          hint: 'Teste de sorte: +880 Créditos e Urânio ou contaminação aguda',
          conclusionText:
            'Os mineradores cortam a veia brilhante no limite do tempo antes que o alarme dispare.',
          effects: {
            luckCheck: {
              winChancePct: 52,
              successText:
                'Extração relâmpago bem-sucedida com lucro máximo e exposição controlada!',
              failText:
                'Um bolso de gás ionizado explode sob a broca, queimando a equipe com radiação severa!',
              successEffect: {
                creditsDelta: 880,
                resourceId: 'uranio',
                resourceQty: 4,
                crewHealthDelta: -12,
              },
              failEffect: {
                creditsDelta: 520,
                crewHealthDelta: -28,
              },
            },
          },
        },
      ],
    },
  },
  {
    id: 79,
    title: 'Fóssil Impossível',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'MINERANDO_SOLO',
    category: 'Mineração em Solo',
    visualMotif: 'ruinas',
    allowedPlanetCodes: ['TX01', 'TX02', 'TX03', 'TX06', 'TX07', 'TX08', 'TX14', 'TX17', 'TX19', 'TX24', 'TX25', 'TX26', 'TX27', 'TX30'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Dentro de um estrato sedimentar de um bilhão de anos em {PLANETA}, a broca expõe um circuito metálico dourado impossível — alguém fabricou tecnologia aqui antes de existir atmosfera respirável.',
      choices: [
        {
          id: 'A',
          label: 'Extrair o circuito inteiro com cortes de precisão',
          hint: 'Teste de sorte: +Tecnologia Antiga e equipamento raro ou rocha trinca',
          conclusionText:
            'Os lasers de precisão contornam o bloco de granito ao redor do circuito milenar.',
          effects: {
            luckCheck: {
              winChancePct: 62,
              successText:
                'O bloco sai intacto da parede direto para seu cofre de raridades!',
              failText:
                'Uma fissura atravessa parte da placa dourada durante o corte, reduzindo o aproveitamento.',
              successEffect: {
                resourceId: 'tecnologia_antiga',
                resourceQty: 2,
                randomEquipment: 'raro',
              },
              failEffect: {
                resourceId: 'tecnologia_antiga',
                resourceQty: 1,
                randomEquipment: 'comum',
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Estudar as camadas geológicas no próprio local',
          hint: '+Bônus no próximo evento · +Perícia de exploração',
          conclusionText:
            'A análise in loco desvenda padrões arqueológicos raros para futuras expedições.',
          effects: {
            grantNextEventBonus: true,
            boostCrewSkill: 4,
          },
        },
      ],
    },
  },
  {
    id: 80,
    title: 'Mineradores Rivais',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'MINERANDO_SOLO',
    category: 'Mineração em Solo',
    visualMotif: 'mina',
    excludedPlanetCodes: ['TX03', 'TX12', 'TX15', 'TX16', 'TX31'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Uma barcaça armada de garimpeiros independentes pousa levantando poeira a duzentos metros. "Esta jazida é nossa!", gritam pelo megafone.',
      choices: [
        {
          id: 'A',
          label: 'Recusar recuo e disputar a posse do veio',
          hint: 'Teste de sorte: +Platina e recuo rápido deles ou troca dura de tiros',
          conclusionText:
            'Sua equipe assume cobertura entre as rochas e responde com tiros de advertência.',
          effects: {
            luckCheck: {
              winChancePct: 60,
              successText:
                'Os rivais recuam rápido deixando para trás caixas inteiras de Platina!',
              failText:
                'O tiroteio dura mais que o esperado, danificando a fuselagem antes de afastá-los.',
              successEffect: {
                hullDelta: -14,
                resourceId: 'platina',
                resourceQty: 5,
              },
              failEffect: {
                hullDelta: -36,
                resourceId: 'platina',
                resourceQty: 2,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Propor divisão amigável da jazida ao meio',
          hint: 'Teste de sorte: acordo cordial (+12 Reputação/Ferro) ou divisão mesquinha',
          conclusionText:
            'Você caminha desarmado até a linha média da cratera para propor acordo justo.',
          effects: {
            luckCheck: {
              winChancePct: 74,
              successText:
                'Os garimpeiros abaixam as armas e dividem cordialmente os turnos de extração!',
              failText:
                'Eles aceitam a trégua com má vontade, cedendo apenas uma parcela menor da jazida.',
              successEffect: {
                renownDelta: 12,
                useSystemOwnerRenown: true,
                resourceId: 'ferro',
                resourceQty: 6,
              },
              failEffect: {
                renownDelta: 4,
                useSystemOwnerRenown: true,
                resourceId: 'ferro',
                resourceQty: 3,
              },
            },
          },
        },
      ],
    },
  },

  // ===========================================================================
  // CHAVE: CONVERSANDO_NPC (81 - 90)
  // ===========================================================================
  {
    id: 81,
    title: 'Proposta de Casamento',
    scope: 'planetario',
    complexity: 'complexo_missao',
    triggerKey: 'CONVERSANDO_NPC',
    category: 'Contato Planetário',
    visualMotif: 'diplomacia',
    allowedPlanetCodes: ['TX03', 'TX06', 'TX17', 'TX23', 'TX24', 'TX28'],
    initialScene: {
      id: 'init',
      narrativeText:
        'No salão nobre de {PLANETA}, sob olhares atentos de toda a corte de {CONTROLE_TEXTO}, a princesa local anuncia publicamente um convite solene de casamento estratégico com o comandante da {NAVE}.',
      choices: [
        {
          id: 'A',
          label: 'Aceitar o compromisso diante da corte',
          hint: 'Adiciona missão "A Coroa Perdida" · +Reputação alta',
          conclusionText:
            'Aplausos ecoam no salão enquanto a missão "A Coroa Perdida" sela os preparativos oficiais da aliança.',
          effects: {
            renownDelta: 22,
            useSystemOwnerRenown: true,
            spawnMission: {
              title: 'A Coroa Perdida',
              description:
                'Cumprir a etapa cerimonial da corte no sistema designado e firmar o pacto real.',
              followUpSceneId: 'coroa_corte',
            },
          },
        },
        {
          id: 'B',
          label: 'Recusar com elegância diplomática',
          hint: 'Adiciona missão "Dívida de Honra" · –Reputação leve · +380 Créditos',
          conclusionText:
            'Você declina com respeito, assumindo a missão "Dívida de Honra" para compensar a casa real sem romper laços.',
          effects: {
            renownDelta: -6,
            useSystemOwnerRenown: true,
            creditsDelta: 380,
            spawnMission: {
              title: 'Dívida de Honra',
              description:
                'Realizar entrega diplomática compensatória no setor indicado pela corte.',
              followUpSceneId: 'honra_corte',
            },
          },
        },
      ],
    },
    followUpScenes: {
      coroa_corte: {
        id: 'coroa_corte',
        narrativeText:
          'Com o cortejo reunido, um conselheiro entrega as chaves dos tesouros dinásticos para sua escolha final.',
        choices: [
          {
            id: 'A',
            label: 'Consagrar aliança militar e política duradoura',
            hint: '+30 Reputação · +950 Créditos',
            conclusionText:
              'Seu nome passa a figurar entre os grandes protetores da casa nobre.',
            effects: {
              renownDelta: 30,
              useSystemOwnerRenown: true,
              creditsDelta: 950,
            },
          },
          {
            id: 'B',
            label: 'Receber dote em tecnologia exclusiva da frota',
            hint: '+Equipamento raro · +14 Reputação',
            conclusionText:
              'Os estaleiros reais entregam armamento refinado como dote oficial.',
            effects: {
              randomEquipment: 'raro',
              renownDelta: 14,
              useSystemOwnerRenown: true,
            },
          },
        ],
      },
      honra_corte: {
        id: 'honra_corte',
        narrativeText:
          'Ao concluir o gesto diplomático, a corte reconhece seu caráter mesmo fora do matrimônio.',
        choices: [
          {
            id: 'A',
            label: 'Selar acordo de amizade e passagem livre',
            hint: '+20 Reputação · +Saúde da tripulação',
            conclusionText:
              'A nobreza encerra qualquer ressentimento e abre rotas privilegiadas à {NAVE}.',
            effects: {
              renownDelta: 20,
              useSystemOwnerRenown: true,
              crewHealthDelta: 10,
            },
          },
          {
            id: 'B',
            label: 'Cobrar taxa comercial pelos serviços prestados à corte',
            hint: 'Teste de sorte: +820 Créditos ou corte reduz pagamento',
            conclusionText:
              'Você apresenta a fatura formal de serviços diplomáticos aos tesoureiros reais.',
            effects: {
              luckCheck: {
                winChancePct: 66,
                successText:
                  'Pagamento integral em créditos antes de retomar o rumo livre pelo espaço.',
                failText:
                  'Os conselheiros consideram a cobrança indelicada e reduzem o valor final.',
                successEffect: {
                  creditsDelta: 820,
                },
                failEffect: {
                  creditsDelta: 420,
                  renownDelta: -6,
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
    id: 82,
    title: 'Mercador de Segredos',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'CONVERSANDO_NPC',
    category: 'Contato Planetário',
    visualMotif: 'mercado',
    excludedPlanetCodes: ['TX12', 'TX31'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Num beco iluminado do porto de {PLANETA}, um informante encapuzado murmura: "Sei algo grave sobre um membro da sua própria tripulação. Quanto paga para ouvir?"',
      choices: [
        {
          id: 'A',
          label: 'Pagar 220 créditos pelo dossiê completo',
          hint: 'Teste de sorte: –220 Créditos · +Bônus e perícia ou pistas falsas',
          conclusionText:
            'Você transfere os créditos e abre o chip criptografado entregue pelo informante.',
          effects: {
            luckCheck: {
              winChancePct: 65,
              successText:
                'As informações autênticas evitam problemas internos futuros e refinam sua vigilância de bordo!',
              failText:
                'O dossiê trazia apenas boatos velhos e o informante já sumiu pela multidão.',
              successEffect: {
                creditsDelta: -220,
                grantNextEventBonus: true,
                boostCrewSkill: 4,
              },
              failEffect: {
                creditsDelta: -220,
                crewHealthDelta: -6,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Recusar chantagem e afastar o informante',
          hint: 'Sem consequências',
          conclusionText:
            'Você confia na sua equipe e deixa o mercador falando sozinho nas sombras.',
          effects: {},
        },
      ],
    },
  },
  {
    id: 83,
    title: 'Profeta Local',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'CONVERSANDO_NPC',
    category: 'Contato Planetário',
    visualMotif: 'diplomacia',
    excludedPlanetCodes: ['TX12', 'TX31'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Uma vidente cega segura sua mão diante do porto de {PLANETA}: "Vejo estrelas partidas. Um de seus tripulantes não voltará a ver o lar ao fim desta rota."',
      choices: [
        {
          id: 'A',
          label: 'Pressioná-la para revelar qual tripulante está em risco',
          hint: 'Teste de sorte: aviso tático útil (+Bônus) ou superstição inquieta equipe',
          conclusionText:
            'Você segura os ombros da vidente pedindo clareza sobre a visão que ela acaba de anunciar.',
          effects: {
            luckCheck: {
              winChancePct: 58,
              successText:
                'Ela aponta com precisão o perigo à frente, preparando seus sensores para o próximo evento.',
              failText:
                'A vidente descreve sinais sombrios e ambíguos que espalham medo pelos turnos da nave.',
              successEffect: {
                grantNextEventBonus: true,
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
          label: 'Agradecer pela advertência e seguir sem alimentar medo',
          hint: 'Sem consequências negativas',
          conclusionText:
            'Você mantém a calma da equipe longe de presságios vazios.',
          effects: {},
        },
      ],
    },
  },
  {
    id: 84,
    title: 'Criança Perdida',
    scope: 'planetario',
    complexity: 'complexo_missao',
    triggerKey: 'CONVERSANDO_NPC',
    category: 'Contato Planetário',
    visualMotif: 'diplomacia',
    allowedPlanetCodes: ['TX01', 'TX02', 'TX03', 'TX05', 'TX06', 'TX09', 'TX17', 'TX23', 'TX24', 'TX28'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Na praça movimentada de {PLANETA}, uma criança puxa a manga do seu uniforme com olhos rasos: "Minha mãe entrou numa nave de transporte e não acho ela em lugar nenhum!"',
      choices: [
        {
          id: 'A',
          label: 'Ajudar pessoalmente a localizar a mãe',
          hint: 'Adiciona missão "Mãe Desaparecida" · +Reputação · +Saúde da tripulação',
          conclusionText:
            'Os registros portuários indicam uma escala próxima. A missão "Mãe Desaparecida" é aberta nos registros!',
          effects: {
            renownDelta: 12,
            useSystemOwnerRenown: true,
            crewHealthDelta: 8,
            spawnMission: {
              title: 'Mãe Desaparecida',
              description:
                'Seguir os registros de embarque até o sistema indicado para reunir mãe e criança.',
              followUpSceneId: 'mae_desaparecida',
            },
          },
        },
        {
          id: 'B',
          label: 'Entregar a criança aos oficiais da guarda local',
          hint: '+6 Reputação local · Sem desvio de rota',
          conclusionText:
            'A guarda acolhe a criança rapidamente e agradece sua cooperação cidadã.',
          effects: {
            renownDelta: 6,
            useSystemOwnerRenown: true,
          },
        },
      ],
    },
    followUpScenes: {
      mae_desaparecida: {
        id: 'mae_desaparecida',
        narrativeText:
          'Você localiza a mãe detida por um erro burocrático na estação do sistema alvo!',
        choices: [
          {
            id: 'A',
            label: 'Pagar a taxa pendente e promover o reencontro emocionante',
            hint: '+26 Reputação · +Saúde da tripulação · +450 Créditos em doação coletiva',
            conclusionText:
              'A comunidade local arrecada agradecimento e sua tripulação vibra com o final feliz.',
            effects: {
              renownDelta: 26,
              useSystemOwnerRenown: true,
              crewHealthDelta: 18,
              creditsDelta: 450,
            },
          },
          {
            id: 'B',
            label: 'Resolver com carta oficial de {FACCAO} e seguir rápido',
            hint: 'Teste de sorte: liberação gratuita (+20 Reputação) ou taxa burocrática',
            conclusionText:
              'Você apresenta os selos diplomáticos de {FACCAO} no balcão de detenção da estação.',
            effects: {
              luckCheck: {
                winChancePct: 70,
                successText:
                  'O selo diplomático libera a mulher na hora sem gastar créditos e rende prestígio.',
                failText:
                  'O oficial local exige taxa administrativa mesmo diante da carta de {FACCAO}.',
                successEffect: {
                  renownDelta: 20,
                  grantNextEventBonus: true,
                },
                failEffect: {
                  renownDelta: 14,
                  creditsDelta: -150,
                },
              },
            },
          },
        ],
      },
    },
  },
  {
    id: 85,
    title: 'Espião Disfarçado',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'CONVERSANDO_NPC',
    category: 'Contato Planetário',
    visualMotif: 'diplomacia',
    excludedPlanetCodes: ['TX12', 'TX31'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Um anfitrião simpático em {PLANETA} sorri um pouco demais e conhece detalhes internos recentes da {NAVE} que nunca foram publicados.',
      choices: [
        {
          id: 'A',
          label: 'Confrontá-lo abertamente sobre quem o enviou',
          hint: 'Teste de sorte: confissão útil (+Reputação) ou escândalo no porto',
          conclusionText:
            'Você fecha a distância na mesa e questiona diretamente a origem dos dados dele.',
          effects: {
            luckCheck: {
              winChancePct: 62,
              successText:
                'Acuado diante dos guardas locais, ele entrega sua rede de contatos e você ganha respeito!',
              failText:
                'O infiltrado foge causando tumulto rápido no porto, deixando pistas vagas para trás.',
              successEffect: {
                renownDelta: 10,
                useSystemOwnerRenown: true,
                grantNextEventBonus: true,
              },
              failEffect: {
                renownDelta: -12,
                useSystemOwnerRenown: true,
                grantNextEventBonus: true,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Sorrir de volta e alimentá-lo com coordenadas falsas',
          hint: 'Teste de sorte: engodo perfeito (+18 Reputação) ou espião percebe',
          conclusionText:
            'Você retribui o sorriso e deixa escapar rotas manipuladas durante o brinde.',
          effects: {
            luckCheck: {
              winChancePct: 68,
              successText:
                'Você desvia os agentes rivais por semanas enquanto sua facção colhe os frutos da manobra!',
              failText:
                'O espião percebe a incoerência nas coordenadas e encerra o encontro desconfiado.',
              successEffect: {
                renownDelta: 18,
                grantNextEventBonus: true,
              },
              failEffect: {
                renownDelta: -8,
              },
            },
          },
        },
      ],
    },
  },
  {
    id: 86,
    title: 'Líder em Crise',
    scope: 'planetario',
    complexity: 'complexo_missao',
    triggerKey: 'CONVERSANDO_NPC',
    category: 'Contato Planetário',
    visualMotif: 'diplomacia',
    requiresPlanetMaxLevel: 4,
    allowedPlanetCodes: ['TX01', 'TX02', 'TX03', 'TX06', 'TX17', 'TX23', 'TX24', 'TX27', 'TX28'],
    initialScene: {
      id: 'init',
      narrativeText:
        'O governador local de {PLANETA} chama você aos bastidores com mãos trêmulas: "Meus próprios oficiais preparam um golpe esta noite. Preciso de apoio de confiança!"',
      choices: [
        {
          id: 'A',
          label: 'Apoiar o governador contra os conspiradores',
          hint: 'Adiciona missão "A Noite das Facas" · +Reputação · +Créditos locais',
          conclusionText:
            'Você assume a missão "A Noite das Facas" para interceptar o mensageiro dos golpistas e garantir a ordem em {PLANETA}.',
          effects: {
            renownDelta: 12,
            useSystemOwnerRenown: true,
            spawnMission: {
              title: 'A Noite das Facas',
              description:
                'Desarticular o enlace conspirador no sistema marcado antes do amanhecer de {PLANETA}.',
              followUpSceneId: 'noite_facas',
              requiresCombat: true,
              enemyName: 'Frota Golpista',
            },
          },
        },
        {
          id: 'B',
          label: 'Recusar envolvimento na política interna do planeta',
          hint: '–10 Reputação local',
          conclusionText:
            'O líder decepcionado fecha as portas do palácio enquanto a tensão ferve na cidade.',
          effects: {
            renownDelta: -10,
            useSystemOwnerRenown: true,
          },
        },
      ],
    },
    followUpScenes: {
      noite_facas: {
        id: 'noite_facas',
        narrativeText:
          'Os golpistas caíram e o governador de {PLANETA} oferece a recompensa prometida pelo trono salvo.',
        choices: [
          {
            id: 'A',
            label: 'Receber recompensa pública e gratidão do planeta',
            hint: '+28 Reputação local · +900 Créditos',
            conclusionText:
              'Você se torna herói oficial em {PLANETA} com amplos privilégios locais.',
            effects: {
              renownDelta: 28,
              useSystemOwnerRenown: true,
              creditsDelta: 900,
            },
          },
          {
            id: 'B',
            label: 'Aceitar créditos dobrados em sigilo',
            hint: '+1.250 Créditos · +12 Reputação',
            conclusionText:
              'O tesouro planetário quita a ajuda imediatamente sem alarde público.',
            effects: {
              creditsDelta: 1250,
              renownDelta: 12,
              useSystemOwnerRenown: true,
            },
          },
        ],
      },
    },
  },
  {
    id: 87,
    title: 'Ancião Sábio',
    scope: 'planetario',
    complexity: 'complexo_missao',
    triggerKey: 'CONVERSANDO_NPC',
    category: 'Contato Planetário',
    visualMotif: 'ruinas',
    allowedPlanetCodes: ['TX06', 'TX17', 'TX19', 'TX23', 'TX24', 'TX26', 'TX27', 'TX28'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Um ancião de olhar límpido oferece pergaminhos raros de navegação em troca de uma entrega aparentemente simples... cujo destino parece envolto em névoa.',
      choices: [
        {
          id: 'A',
          label: 'Aceitar o encargo misterioso',
          hint: 'Adiciona missão "A Tarefa do Ancião" · +Bônus de saber',
          conclusionText:
            'A missão "A Tarefa do Ancião" entra nos registros da ponte. O velho sorri com calma absoluta.',
          effects: {
            grantNextEventBonus: true,
            spawnMission: {
              title: 'A Tarefa do Ancião',
              description:
                'Levar o selo antigo ao sistema indicado e descobrir a lição guardada pelo ancião.',
              followUpSceneId: 'tarefa_anciao',
            },
          },
        },
        {
          id: 'B',
          label: 'Declinar educadamente e seguir viagem',
          hint: 'Sem consequências',
          conclusionText:
            'O ancião acena com a cabeça e desaparece entre a multidão do porto.',
          effects: {},
        },
      ],
    },
    followUpScenes: {
      tarefa_anciao: {
        id: 'tarefa_anciao',
        narrativeText:
          'No altar indicado pela missão, um receptáculo se abre revelando o verdadeiro prêmio do ancião.',
        choices: [
          {
            id: 'A',
            label: 'Tomar o conhecimento preservado para a tripulação',
            hint: '+Perícia elevada · +Bônus no próximo evento · +Cronocristais',
            conclusionText:
              'Os tratados iluminam novas técnicas para toda a equipe de bordo.',
            effects: {
              boostCrewSkill: 8,
              grantNextEventBonus: true,
              resourceId: 'cronocristais',
              resourceQty: 2,
            },
          },
          {
            id: 'B',
            label: 'Recolher também o artefato cerimonial anexo',
            hint: '+Equipamento raro · +500 Créditos',
            conclusionText:
              'A peça antiga integra imediatamente seu inventário estelar.',
            effects: {
              randomEquipment: 'raro',
              creditsDelta: 500,
            },
          },
        ],
      },
    },
  },
  {
    id: 88,
    title: 'Duelo de Honra',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'CONVERSANDO_NPC',
    category: 'Contato Planetário',
    visualMotif: 'diplomacia',
    excludedPlanetCodes: ['TX12', 'TX16', 'TX31'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Sem intenção, você quebrou um tabu cerimonial de {PLANETA}. Um campeão local bate o punho no peito e o desafia para duelo imediato na praça.',
      choices: [
        {
          id: 'A',
          label: 'Aceitar o duelo e defender a honra da {NAVE}',
          hint: 'Teste de sorte: +22 Reputação e respeito ou –Saúde de tripulante ferido',
          conclusionText:
            'A multidão abre um círculo tenso no centro do mercado espacial.',
          effects: {
            luckCheck: {
              winChancePct: 60,
              successText:
                'Vitória limpa! O próprio adversário curva a cabeça em respeito, rendendo +22 Reputação.',
              failText:
                'Um golpe certeiro encerra o combate rapidamente, deixando ferimentos doloridos na equipe.',
              successEffect: {
                renownDelta: 22,
                useSystemOwnerRenown: true,
              },
              failEffect: {
                crewHealthDelta: -18,
                renownDelta: 6,
                useSystemOwnerRenown: true,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Curvar-se e pedir desculpas formais pelo costume desconhecido',
          hint: '–8 Reputação · Nenhum ferimento',
          conclusionText:
            'A etiqueta acalma os ânimos, ainda que parte da plateia considere o recuo tímido.',
          effects: {
            renownDelta: -8,
            useSystemOwnerRenown: true,
          },
        },
      ],
    },
  },
  {
    id: 89,
    title: 'Tradutor Suspeito',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'CONVERSANDO_NPC',
    category: 'Contato Planetário',
    visualMotif: 'diplomacia',
    excludedPlanetCodes: ['TX12', 'TX31'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Durante uma conversa oficial em {PLANETA}, o intérprete local sorri enquanto traduz suas frases, porém seus sensores linguísticos detectam divergências na entonação.',
      choices: [
        {
          id: 'A',
          label: 'Interromper e contestar a tradução usando dados da nave',
          hint: 'Teste de sorte: desmascara fraude (+Reputação) ou constrangimento oficial',
          conclusionText:
            'Você projeta o tradutor automático da {NAVE} sobre a mesa diante dos oficiais.',
          effects: {
            luckCheck: {
              winChancePct: 68,
              successText:
                'Os oficiais comprovam o desvio do intérprete e agradecem sua perspicácia diplomática!',
              failText:
                'Desmascarado, o tradutor causa cena constrangedora e os oficiais encerram a reunião frios.',
              successEffect: {
                grantNextEventBonus: true,
                renownDelta: 8,
                useSystemOwnerRenown: true,
              },
              failEffect: {
                grantNextEventBonus: true,
                renownDelta: -10,
                useSystemOwnerRenown: true,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Confiar na interpretação e assinar assim mesmo',
          hint: 'Teste de sorte: normal ou perda de 280 créditos em cláusula oculta',
          conclusionText:
            'Você rubrica os termos digitais e regressa à rampa de embarque.',
          effects: {
            luckCheck: {
              winChancePct: 50,
              successText: 'O acordo era honesto apesar do sorriso estranho.',
              failText: 'Taxas extras ocultas descontam 280 créditos da sua conta!',
              successEffect: {},
              failEffect: { creditsDelta: -280 },
            },
          },
        },
      ],
    },
  },
  {
    id: 90,
    title: 'Sósia',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'CONVERSANDO_NPC',
    category: 'Contato Planetário',
    visualMotif: 'tripulacao',
    allowedPlanetCodes: ['TX03', 'TX06', 'TX17', 'TX18', 'TX22', 'TX24', 'TX28'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Na alameda central de {PLANETA}, comerciantes o cumprimentam por negócios que você jamais fechou — há alguém andando por aí exatamente com o seu rosto usando seu nome!',
      choices: [
        {
          id: 'A',
          label: 'Cercar e confrontar o sósia em público',
          hint: 'Teste de sorte: prisão e +280 Créditos ou fuga do impostor',
          conclusionText:
            'Você fecha as saídas da alameda com sua equipe para interceptar o impostor.',
          effects: {
            luckCheck: {
              winChancePct: 66,
              successText:
                'Você desmascara o impostor diante da guarda e recupera créditos desviados em seu nome!',
              failText:
                'O sósia foge pela multidão deixando boatos confusos no porto, mas vocês captam pistas.',
              successEffect: {
                renownDelta: 16,
                useSystemOwnerRenown: true,
                grantNextEventBonus: true,
                creditsDelta: 280,
              },
              failEffect: {
                renownDelta: -6,
                useSystemOwnerRenown: true,
                grantNextEventBonus: true,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Segui-lo à distância para mapear sua rede',
          hint: 'Teste de sorte: +Bônus e Créditos ou despiste nos becos',
          conclusionText:
            'Você acompanha a silhueta idêntica à distância pelos corredores do distrito comercial.',
          effects: {
            luckCheck: {
              winChancePct: 72,
              successText:
                'Você descobre contatos clandestinos inteiros e recupera fundos deixados num cofre morto!',
              failText:
                'O impostor percebe a sombra atrás dele e desaparece pelos túneis de serviço.',
              successEffect: {
                grantNextEventBonus: true,
                creditsDelta: 320,
              },
              failEffect: {
                crewHealthDelta: -4,
              },
            },
          },
        },
      ],
    },
  },

  // ===========================================================================
  // CHAVE: ESCANEANDO_RUINAS (91 - 95)
  // ===========================================================================
  {
    id: 91,
    title: 'Cofre Selado',
    scope: 'planetario',
    complexity: 'complexo_missao',
    triggerKey: 'ESCANEANDO_RUINAS',
    category: 'Ruínas Antigas',
    visualMotif: 'ruinas',
    allowedPlanetCodes: ['TX01', 'TX02', 'TX04', 'TX05', 'TX08', 'TX10', 'TX11', 'TX13', 'TX21', 'TX25', 'TX29'],
    initialScene: {
      id: 'init',
      narrativeText:
        'No fundo da anomalia arqueológica em {PLANETA}, um cofre monolítico de obsidiana exibe um teclado astral ao lado de uma balança de sacrifício material.',
      choices: [
        {
          id: 'A',
          label: 'Seguir as pistas da sequência para decifrar o código completo',
          hint: 'Adiciona missão "O Código Perdido" · +Equipamento raro na resolução',
          conclusionText:
            'Os símbolos apontam para um observatório irmão em outro sistema. A missão "O Código Perdido" é iniciada!',
          effects: {
            spawnMission: {
              title: 'O Código Perdido',
              description:
                'Coletar a segunda metade da chave estelar no sistema indicado e destravar o cofre antigo.',
              followUpSceneId: 'codigo_perdido',
            },
          },
        },
        {
          id: 'B',
          label: 'Depositar suprimentos na balança para abrir à força ritual',
          hint: 'Teste de sorte: –Suprimentos · +Equipamento raro ou peça comum',
          conclusionText:
            'A balança de obsidiana afunda sob o peso da oferenda enquanto os trincos internos rangem.',
          effects: {
            luckCheck: {
              winChancePct: 66,
              successText:
                'Os selos giram por completo e liberam uma relíquia rara imediatamente!',
              failText:
                'A trava enferrujada emperra na metade, liberando apenas um módulo comum da câmara externa.',
              successEffect: {
                suppliesDelta: -26,
                randomEquipment: 'raro',
              },
              failEffect: {
                suppliesDelta: -26,
                randomEquipment: 'comum',
              },
            },
          },
        },
      ],
    },
    followUpScenes: {
      codigo_perdido: {
        id: 'codigo_perdido',
        narrativeText:
          'Com a sequência completa em mãos, as sete travas do cofre antigo giram simultaneamente!',
        choices: [
          {
            id: 'A',
            label: 'Extrair a tecnologia bélica/defensiva guardada dentro',
            hint: '+Equipamento raro garantido · +Artefatos',
            conclusionText:
              'Uma peça ancestral impecável brilha sobre o veludo de estase.',
            effects: {
              randomEquipment: 'raro',
              resourceId: 'artefatos',
              resourceQty: 2,
            },
          },
          {
            id: 'B',
            label: 'Copiar também os diagramas históricos da câmara',
            hint: '+Bônus no próximo evento · +700 Créditos · +16 Reputação',
            conclusionText:
              'Museus e academias disputam os registros completos da câmara selada.',
            effects: {
              grantNextEventBonus: true,
              creditsDelta: 700,
              renownDelta: 16,
            },
          },
        ],
      },
    },
  },
  {
    id: 92,
    title: 'Holograma Remanescente',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'ESCANEANDO_RUINAS',
    category: 'Ruínas Antigas',
    visualMotif: 'ruinas',
    allowedPlanetCodes: ['TX09', 'TX17', 'TX18', 'TX19', 'TX22', 'TX28', 'TX30'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Ao varrer o pedestal central em {PLANETA}, um holograma antigo ganha forma e narra com voz cansada a queda de sua civilização, repetindo o mesmo lamento há séculos.',
      choices: [
        {
          id: 'A',
          label: 'Permanecer em silêncio ouvindo o testemunho até o fim',
          hint: '+Bônus no próximo evento · +Saúde da tripulação',
          conclusionText:
            'Quando o relato termina, o projetor entrega coordenadas ocultas e se apaga em paz.',
          effects: {
            grantNextEventBonus: true,
            crewHealthDelta: 12,
          },
        },
        {
          id: 'B',
          label: 'Desligar o emissor para acelerar a coleta',
          hint: 'Sem consequências',
          conclusionText:
            'A câmara mergulha na escuridão fria enquanto a equipe prossegue.',
          effects: {},
        },
      ],
    },
  },
  {
    id: 93,
    title: 'Armadilha Ancestral',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'ESCANEANDO_RUINAS',
    category: 'Ruínas Antigas',
    visualMotif: 'ruinas',
    allowedPlanetCodes: ['TX01', 'TX02', 'TX04', 'TX05', 'TX08', 'TX10', 'TX11', 'TX14', 'TX15', 'TX20', 'TX23', 'TX26', 'TX29', 'TX30'],
    initialScene: {
      id: 'init',
      narrativeText:
        'As portas do salão de {PLANETA} só cedem diante de um enigma geométrico rotativo; forçar as travas dispara lâminas gravitacionais.',
      choices: [
        {
          id: 'A',
          label: 'Resolver o quebra-cabeça com paciência e sensores',
          hint: 'Teste de sorte: +Equipamento raro e Relíquias ou disparo de dardo',
          conclusionText:
            'Os técnicos giram cuidadosamente os anéis geométricos conforme as leituras dos sensores.',
          effects: {
            luckCheck: {
              winChancePct: 66,
              successText:
                'Os anéis se alinham em clique suave e entregam o nicho raro intacto!',
              failText:
                'Um erro no último anel ativa dardos defensivos, deixando apenas peça comum.',
              successEffect: {
                randomEquipment: 'raro',
                resourceId: 'reliquias',
                resourceQty: 1,
              },
              failEffect: {
                randomEquipment: 'comum',
                crewHealthDelta: -14,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Forçar a abertura com feixe cortador da nave',
          hint: 'Teste de sorte: corte veloz (+Relíquias) ou disparo defensivo no casco',
          conclusionText:
            'O canhão auxiliar da {NAVE} dispara um feixe concentrado nas travas antigas.',
          effects: {
            luckCheck: {
              winChancePct: 50,
              successText:
                'O feixe derrete as travas antes da defesa acordar, liberando uma relíquia!',
              failText:
                'Uma torre oculta responde imediatamente atingindo a fuselagem da nave próxima.',
              successEffect: {
                hullDelta: -16,
                resourceId: 'reliquias',
                resourceQty: 1,
              },
              failEffect: {
                hullDelta: -36,
              },
            },
          },
        },
      ],
    },
  },
  {
    id: 94,
    title: 'Mural Profético',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'ESCANEANDO_RUINAS',
    category: 'Ruínas Antigas',
    visualMotif: 'ruinas',
    allowedPlanetCodes: ['TX01', 'TX06', 'TX07', 'TX08', 'TX14', 'TX17', 'TX19', 'TX24', 'TX25', 'TX26', 'TX27'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Sob camadas de musgo petrificado em {PLANETA}, o afresco antigo retrata claramente a silhueta exata da {NAVE} sobre as ruínas, cercada por rostos idênticos aos da sua tripulação.',
      choices: [
        {
          id: 'A',
          label: 'Escanear e estudar cada detalhe da pintura',
          hint: '+Bônus no próximo evento · –Saúde da tripulação pelo assombro',
          conclusionText:
            'A equipe registra o enigma milenar inteiro, mas regressa em silêncio inquieto.',
          effects: {
            grantNextEventBonus: true,
            crewHealthDelta: -10,
          },
        },
        {
          id: 'B',
          label: 'Cobrir e apagar a seção perturbadora antes que todos vejam',
          hint: '+Saúde da tripulação',
          conclusionText:
            'Sem alimentar pânico, todos respiram aliviados na subida para órbita.',
          effects: {
            crewHealthDelta: 10,
          },
        },
      ],
    },
  },
  {
    id: 95,
    title: 'Terminal Ativo',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'ESCANEANDO_RUINAS',
    category: 'Ruínas Antigas',
    visualMotif: 'tecnologia',
    allowedPlanetCodes: ['TX09', 'TX13', 'TX15', 'TX18', 'TX20', 'TX22', 'TX28', 'TX30'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Contra todas as probabilidades, um console milenar continua conectado a uma malha planetária viva em {PLANETA}. A tela pisca aguardando senha.',
      choices: [
        {
          id: 'A',
          label: 'Invadir o sistema diretamente com decodificadores',
          hint: 'Teste de sorte: +Bônus e Créditos silenciosos ou alarme nos vigilantes',
          conclusionText:
            'Os decodificadores injetam chaves quânticas na malha antiga do terminal.',
          effects: {
            luckCheck: {
              winChancePct: 62,
              successText:
                'Você extrai arquivos profundos e créditos antigos sem disparar nenhum alarme!',
              failText:
                'O bloqueio de segurança aciona alertas locais antes que a cópia termine.',
              successEffect: {
                grantNextEventBonus: true,
                creditsDelta: 260,
              },
              failEffect: {
                grantNextEventBonus: true,
                renownDelta: -12,
                useSystemOwnerRenown: true,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Enviar solicitação protocolar às autoridades do setor',
          hint: '+10 Reputação local · Sem dados secretos',
          conclusionText:
            'O gesto transparente rende elogio dos arquivistas planetários.',
          effects: {
            renownDelta: 10,
            useSystemOwnerRenown: true,
          },
        },
      ],
    },
  },

  // ===========================================================================
  // CHAVE: COLETANDO_AMOSTRAS (96 - 99)
  // ===========================================================================
  {
    id: 96,
    title: 'Amostra Consciente',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'COLETANDO_AMOSTRAS',
    category: 'Amostras Biológicas',
    visualMotif: 'criatura',
    allowedPlanetCodes: ['TX06', 'TX07', 'TX14', 'TX17', 'TX24', 'TX26', 'TX27'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Quando a pinça de coleta toca o bulbo luminescente em {PLANETA}, uma voz clara ecoa na mente de toda a equipe: "Por favor... não me colha."',
      choices: [
        {
          id: 'A',
          label: 'Colher o espécime raro mesmo diante do apelo',
          hint: '+Biomassa Viva épica · –Saúde da tripulação',
          conclusionText:
            'O espécime vale uma fortuna científica, mas os sussurros tristes assombram o laboratório.',
          effects: {
            resourceId: 'biomassa_viva',
            resourceQty: 3,
            crewHealthDelta: -14,
          },
        },
        {
          id: 'B',
          label: 'Recolher a pinça e deixar a planta viver em paz',
          hint: '+Saúde da tripulação',
          conclusionText:
            'A planta pulsa em luz verde de gratidão, elevando o espírito da equipe.',
          effects: {
            crewHealthDelta: 14,
          },
        },
      ],
    },
  },
  {
    id: 97,
    title: 'Vírus Adormecido',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'COLETANDO_AMOSTRAS',
    category: 'Amostras Biológicas',
    visualMotif: 'criatura',
    allowedPlanetCodes: ['TX05', 'TX07', 'TX13', 'TX14', 'TX24', 'TX26', 'TX29'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Sob o microscópio de campo em {PLANETA}, o tecido coletado revela uma cepa viral adormecida desconhecida.',
      choices: [
        {
          id: 'A',
          label: 'Selar e queimar o recipiente com reagentes estéreis',
          hint: '–Suprimentos de esterilização · Zero risco biológico',
          conclusionText:
            'Contaminação neutralizada antes mesmo de chegar ao hangar.',
          effects: {
            suppliesDelta: -16,
          },
        },
        {
          id: 'B',
          label: 'Cultivar a amostra para pesquisa farmacológica',
          hint: 'Teste de sorte: +Bônus e Enzimas ou surto a bordo (–Saúde)',
          conclusionText:
            'Os frascos de cultivo são levados para a bancada biológica da {NAVE}.',
          effects: {
            luckCheck: {
              winChancePct: 58,
              successText:
                'Sequenciamento concluído sem vazamento! +Bônus e Enzimas puras obtidas.',
              failText:
                'Um microvazamento espalha febre leve pelo setor médico (-20 Saúde da tripulação).',
              successEffect: {
                grantNextEventBonus: true,
                resourceId: 'enzimas',
                resourceQty: 4,
              },
              failEffect: {
                crewHealthDelta: -20,
              },
            },
          },
        },
      ],
    },
  },
  {
    id: 98,
    title: 'Semente Rara',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'COLETANDO_AMOSTRAS',
    category: 'Amostras Biológicas',
    visualMotif: 'criatura',
    allowedPlanetCodes: ['TX06', 'TX17', 'TX23', 'TX24', 'TX26', 'TX27', 'TX28'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Dentro de uma vagem cristalina em {PLANETA} repousa uma semente capaz de revitalizar ecossistemas inteiros — ou sufocar qualquer flora rival em semanas.',
      choices: [
        {
          id: 'A',
          label: 'Vender a semente intacta aos agrônomos espaciais',
          hint: '+620 Créditos imediatos',
          conclusionText:
            'Os pesquisadores pagam alto pelo potencial genético controlado em laboratório.',
          effects: {
            creditsDelta: 620,
          },
        },
        {
          id: 'B',
          label: 'Cultivá-la em estufa isolada a bordo da nave',
          hint: 'Teste de sorte: estufa permanente (+Suprimentos) ou germinação difícil',
          conclusionText:
            'Os botânicos transferem a semente para o domo hidropônico selado da {NAVE}.',
          effects: {
            luckCheck: {
              winChancePct: 72,
              successText:
                'A estufa prospera de imediato e passa a produzir nutrientes constantes durante toda a campanha!',
              failText:
                'Raízes agressivas exigem poda de emergência antes de estabilizar, rendendo apenas sementes extras.',
              successEffect: {
                grantCosmicSeed: true,
                resourceId: 'sementes',
                resourceQty: 4,
                suppliesDelta: 20,
              },
              failEffect: {
                resourceId: 'sementes',
                resourceQty: 2,
                suppliesDelta: -12,
              },
            },
          },
        },
      ],
    },
  },
  {
    id: 99,
    title: 'Ovo Desconhecido',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'COLETANDO_AMOSTRAS',
    category: 'Amostras Biológicas',
    visualMotif: 'criatura',
    allowedPlanetCodes: ['TX01', 'TX02', 'TX06', 'TX07', 'TX08', 'TX14', 'TX24', 'TX25', 'TX26', 'TX28'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Um ovo morno do tamanho de um baú pulsa suavemente entre raízes em {PLANETA}, irradiando calor próprio.',
      choices: [
        {
          id: 'A',
          label: 'Incubá-lo com cuidado na enfermaria de carga',
          hint: 'Teste de sorte: espécime dócil (+Vigor) ou casca ácida ao rachar',
          conclusionText:
            'Os biólogos ajustam a incubadora térmica enquanto a casca começa a trincar.',
          effects: {
            luckCheck: {
              winChancePct: 68,
              successText:
                'Nasce um espécime dócil e brilhante que encanta a tripulação e produz compostos valiosos!',
              failText:
                'Ao rachar, a casca libera fluido ácido na bancada antes da contenção.',
              successEffect: {
                suppliesDelta: -24,
                grantTempBuffLabel: 'Companheiro Alienígena a Bordo (+0,25 Saúde da tripulação/s)',
                resourceId: 'compostos_organicos',
                resourceQty: 4,
                crewHealthDelta: 12,
              },
              failEffect: {
                suppliesDelta: -24,
                crewHealthDelta: -14,
                resourceId: 'compostos_organicos',
                resourceQty: 2,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Leiloar o ovo lacrado em órbita',
          hint: '+680 Créditos',
          conclusionText:
            'Colecionadores pagam rapidamente pela raridade antes mesmo da eclosão.',
          effects: {
            creditsDelta: 680,
          },
        },
      ],
    },
  },

  // ===========================================================================
  // CHAVE: NEGOCIANDO_NO_MERCADO (100 - 103)
  // ===========================================================================
  {
    id: 100,
    title: 'Mercador Trapaceiro',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'NEGOCIANDO_NO_MERCADO',
    category: 'Mercado Local',
    visualMotif: 'mercado',
    excludedPlanetCodes: ['TX31'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Numa barraca lateral do mercado de {PLANETA}, um vendedor insistente exibe uma "relíquia imperial autêntica" barata demais para ser real.',
      choices: [
        {
          id: 'A',
          label: 'Comprar a peça por 180 créditos sem checar os selos',
          hint: 'Teste de sorte: achado autêntico raro ou sucata defeituosa',
          conclusionText:
            'Você fecha a compra rápida enquanto o vendedor embrulha a peça às pressas.',
          effects: {
            luckCheck: {
              winChancePct: 34,
              successText:
                'Por incrível que pareça, o trapaceiro não sabia o valor real: era uma relíquia rara legítima!',
              failText:
                'O objeto emite chiado irritante e apresenta desgaste oculto; o mercador já sumiu na multidão.',
              successEffect: {
                creditsDelta: -180,
                randomEquipment: 'raro',
              },
              failEffect: {
                creditsDelta: -180,
                randomEquipment: 'comum',
                crewHealthDelta: -12,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Recusar o negócio suspeito imediatamente',
          hint: 'Sem perdas',
          conclusionText:
            'Você desmascara a farsa com um olhar experiente e preserva seus créditos.',
          effects: {},
        },
      ],
    },
  },
  {
    id: 101,
    title: 'Leilão Secreto',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'NEGOCIANDO_NO_MERCADO',
    category: 'Mercado Local',
    visualMotif: 'mercado',
    excludedPlanetCodes: ['TX31'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Nos bastidores do mercado de {PLANETA}, representantes de três facções disputam em silêncio um módulo raro em caixa lacrada. Os lances disparam.',
      choices: [
        {
          id: 'A',
          label: 'Cobrir todos os concorrentes com lance alto (540 créditos)',
          hint: '–540 Créditos · +Equipamento raro garantido',
          conclusionText:
            'O martelo bate a seu favor e a peça de elite vai direto para o depósito da {NAVE}.',
          effects: {
            creditsDelta: -540,
            randomEquipment: 'raro',
          },
        },
        {
          id: 'B',
          label: 'Apenas observar quem compra e registrar as rotas',
          hint: 'Teste de sorte: +Bônus e Créditos de espionagem ou expulsão pela segurança',
          conclusionText:
            'Você fica nas sombras do salão anotando os rostos e códigos dos compradores.',
          effects: {
            luckCheck: {
              winChancePct: 70,
              successText:
                'Você anota quem financiou cada facção e vende um relatório rápido sem gastar um crédito!',
              failText:
                'Seguranças do leilão notam sua espionagem e expulsam a equipe sob olhares irritados.',
              successEffect: {
                grantNextEventBonus: true,
                creditsDelta: 220,
              },
              failEffect: {
                renownDelta: -6,
                useSystemOwnerRenown: true,
              },
            },
          },
        },
      ],
    },
  },
  {
    id: 102,
    title: 'Escambo Cultural',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'NEGOCIANDO_NO_MERCADO',
    category: 'Mercado Local',
    visualMotif: 'mercado',
    excludedPlanetCodes: ['TX31'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Uma guilda tradicional de {PLANETA} propõe uma troca simbólica segundo costumes antigos: qualquer erro de etiqueta pode ofender profundamente a praça.',
      choices: [
        {
          id: 'A',
          label: 'Aceitar o escambo ritual com produtos da carga',
          hint: 'Teste de sorte: +18 Reputação e Sais/Ouro ou ofensa local (–12 Reputação)',
          conclusionText:
            'Os mestres da guilda examinam cuidadosamente sua postura durante a cerimônia.',
          effects: {
            luckCheck: {
              winChancePct: 62,
              successText:
                'O gesto encanta toda a guilda! Você ganha +18 de reputação e presente nobre.',
              failText:
                'Um detalhe errado nos cumprimentos ofende os anfitriões locais (-12 Reputação).',
              successEffect: {
                renownDelta: 18,
                useSystemOwnerRenown: true,
                resourceId: 'ouro',
                resourceQty: 3,
              },
              failEffect: {
                renownDelta: -12,
                useSystemOwnerRenown: true,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Pagar a taxa padrão de 140 créditos sem participar do ritual',
          hint: '–140 Créditos · Zero riscos diplomáticos',
          conclusionText:
            'A transação ocorre de forma profissional e sem atritos culturais.',
          effects: {
            creditsDelta: -140,
          },
        },
      ],
    },
  },
  {
    id: 103,
    title: 'Roubo no Mercado',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'NEGOCIANDO_NO_MERCADO',
    category: 'Mercado Local',
    visualMotif: 'mercado',
    excludedPlanetCodes: ['TX31'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Um batedor ágil arranca uma maleta de ferramentas do seu oficial de suprimentos e dispara pelas galerias lotadas de {PLANETA}!',
      choices: [
        {
          id: 'A',
          label: 'Perseguir o ladrão pelos telhados do mercado',
          hint: 'Teste de sorte: captura com +Equipamento e Créditos ou fuga nos becos',
          conclusionText:
            'Sua equipe salta entre toldos e passarelas elevadas atrás do vulto veloz.',
          effects: {
            luckCheck: {
              winChancePct: 66,
              successText:
                'Vocês encurralam o ladrão num beco sem saída e recuperam a maleta com peças extras!',
              failText:
                'O ladrão desaparece pela rede de esgotos, deixando a equipe esfolada da corrida.',
              successEffect: {
                randomEquipment: 'comum',
                creditsDelta: 220,
              },
              failEffect: {
                crewHealthDelta: -12,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Deixar escapar para não causar tumulto armado',
          hint: '–Saúde da tripulação · Evita atraso',
          conclusionText:
            'A equipe lamenta a perda da maleta enquanto volta à nave.',
          effects: {
            crewHealthDelta: -10,
          },
        },
      ],
    },
  },

  // ===========================================================================
  // CHAVE: DESCANSANDO_NO_ACAMPAMENTO (104 - 107)
  // ===========================================================================
  {
    id: 104,
    title: 'Visitante Noturno',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'DESCANSANDO_NO_ACAMPAMENTO',
    category: 'Acampamento',
    visualMotif: 'acampamento',
    allowedPlanetCodes: ['TX01', 'TX02', 'TX06', 'TX17', 'TX23', 'TX24', 'TX25', 'TX27', 'TX28'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Sob o céu estrelado de {PLANETA}, uma silhueta solitária aproxima-se em silêncio absoluto da fogueira do acampamento.',
      choices: [
        {
          id: 'A',
          label: 'Convidar o estranho a sentar-se e compartilhar uma bebida',
          hint: 'Teste de sorte: segredos de rotas (+Bônus/Saúde) ou furto de rações',
          conclusionText:
            'Você oferece um copo quente ao viajante enquanto a fogueira estala sob o céu alienígena.',
          effects: {
            luckCheck: {
              winChancePct: 70,
              successText:
                'O viajante conta segredos de rotas esquecidas e revigora o ânimo do acampamento!',
              failText:
                'Era um batedor oportunista que desaparece na madrugada levando parte das rações.',
              successEffect: {
                grantNextEventBonus: true,
                crewHealthDelta: 8,
              },
              failEffect: {
                suppliesDelta: -12,
                crewHealthDelta: -6,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Manter a guarda armada e pedir que se afaste',
          hint: 'Sem consequências · Noite tranquila',
          conclusionText:
            'A figura recua na escuridão sem incidentes até a alvorada.',
          effects: {},
        },
      ],
    },
  },
  {
    id: 105,
    title: 'Pesadelo Compartilhado',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'DESCANSANDO_NO_ACAMPAMENTO',
    category: 'Acampamento',
    visualMotif: 'acampamento',
    allowedPlanetCodes: ['TX16'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Dentro das barracas em {PLANETA}, toda a equipe desperta sob suor frio lembrando da mesma voz grave sussurrando debaixo do chão.',
      choices: [
        {
          id: 'A',
          label: 'Registrar e tentar decifrar as palavras do sonho coletivo',
          hint: 'Teste de sorte: +Bônus e Éter ou insônia coletiva severa',
          conclusionText:
            'Os membros do turno reúnem seus desenhos e frases antes de o eco se apagar da mente.',
          effects: {
            luckCheck: {
              winChancePct: 62,
              successText:
                'Os fragmentos formam coordenadas anômalas que revelam condensações de éter próximas!',
              failText:
                'As palavras não fazem sentido e ninguém consegue voltar a dormir pelo resto da noite.',
              successEffect: {
                grantNextEventBonus: true,
                resourceId: 'eter',
                resourceQty: 2,
              },
              failEffect: {
                crewHealthDelta: -16,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Acordar todos, acender holofotes e encerrar o repouso cedo',
          hint: 'Equipe protegida · Sem perdas',
          conclusionText:
            'O acampamento desmonta rápido sob luz forte até clarear o dia.',
          effects: {},
        },
      ],
    },
  },
  {
    id: 106,
    title: 'Festa Local',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'DESCANSANDO_NO_ACAMPAMENTO',
    category: 'Acampamento',
    visualMotif: 'acampamento',
    allowedPlanetCodes: ['TX02', 'TX06', 'TX17', 'TX23', 'TX24', 'TX25', 'TX27', 'TX28'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Uma caravana vizinha celebra o solstício de {PLANETA} com tambores e lanternas flutuantes, convidando sua guarnição para o banquete.',
      choices: [
        {
          id: 'A',
          label: 'Aceitar o convite e levar suprimentos para a troca',
          hint: '–Suprimentos · +18 Reputação local · +Saúde da tripulação',
          conclusionText:
            'A celebração estreita laços diplomáticos valiosos e recupera a saúde e o vigor da tripulação.',
          effects: {
            suppliesDelta: -20,
            renownDelta: 18,
            useSystemOwnerRenown: true,
            crewHealthDelta: 14,
          },
        },
        {
          id: 'B',
          label: 'Agradecer e manter repouso no perímetro próprio',
          hint: 'Sem gastos nem consequências',
          conclusionText:
            'A equipe descansa em silêncio ao som distante dos festejos.',
          effects: {},
        },
      ],
    },
  },
  {
    id: 107,
    title: 'Sabotagem Noturna',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'DESCANSANDO_NO_ACAMPAMENTO',
    category: 'Acampamento',
    visualMotif: 'acampamento',
    allowedPlanetCodes: ['TX01', 'TX02', 'TX06', 'TX08', 'TX09', 'TX10', 'TX11', 'TX13', 'TX14', 'TX21', 'TX22', 'TX24', 'TX25', 'TX26', 'TX28', 'TX30'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Ao nascer do sol no acampamento em {PLANETA}, o módulo principal de comunicações amanhece estilhaçado por corte intencional.',
      choices: [
        {
          id: 'A',
          label: 'Investigar pegadas e fragmentos antes de partir',
          hint: 'Teste de sorte: +Bônus e Créditos ou armadilha de fumaça nos rastros',
          conclusionText:
            'Os batedores examinam os cacos de vidro e as marcas de bota ao redor do gerador.',
          effects: {
            luckCheck: {
              winChancePct: 68,
              successText:
                'Você encontra um chip identificador intacto que revela o sabotador e rende recompensa.',
              failText:
                'Uma armadilha de fumaça irritante escondida nos rastros tosse a equipe antes da partida.',
              successEffect: {
                grantNextEventBonus: true,
                creditsDelta: 240,
              },
              failEffect: {
                crewHealthDelta: -10,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Substituir a peça com reserva da nave e levantar acampamento',
          hint: '–Suprimentos/peças de reparo · Segue rápido',
          conclusionText:
            'Troca limpa em poucos minutos mantendo o cronograma de voo.',
          effects: {
            suppliesDelta: -16,
          },
        },
      ],
    },
  },

  // ===========================================================================
  // CHAVE: CHEGANDO_NO_PLANETA / DECOLANDO (108 - 111)
  // ===========================================================================
  {
    id: 108,
    title: 'Recepção Hostil',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'CHEGANDO_NO_PLANETA',
    category: 'Órbita e Decolagem',
    visualMotif: 'orbita',
    excludedPlanetCodes: ['TX31'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Ao entrar em órbita baixa de {PLANETA}, baterias de defesa automática travam mira na {NAVE} devido a um alerta antigo de fronteira.',
      choices: [
        {
          id: 'A',
          label: 'Desligar armas e pedir autorização emergencial ao controle',
          hint: '–8 Reputação local · Sem danos ao casco',
          conclusionText:
            'Após minutos humilhantes sob mira orbital, o controle reduz os escudos de defesa e libera a órbita.',
          effects: {
            renownDelta: -8,
            useSystemOwnerRenown: true,
          },
        },
        {
          id: 'B',
          label: 'Forçar a descida em manobra evasiva sob disparos',
          hint: 'Teste de sorte: descida hábil ou impacto direto das baterias',
          conclusionText:
            'A {NAVE} mergulha em espiral pela alta atmosfera enquanto os feixes rastreiam seu rastro.',
          effects: {
            luckCheck: {
              winChancePct: 58,
              successText:
                'Manobra evasiva impecável! Os escudos sofrem apenas raspões e o controle respeita a ousadia.',
              failText:
                'As baterias orbitais acertam o flanco em cheio durante o mergulho de entrada.',
              successEffect: {
                hullDelta: -14,
                renownDelta: 8,
                useSystemOwnerRenown: true,
              },
              failEffect: {
                hullDelta: -38,
              },
            },
          },
        },
      ],
    },
  },
  {
    id: 109,
    title: 'Quarentena Imposta',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'DECOLANDO',
    category: 'Órbita e Decolagem',
    visualMotif: 'orbita',
    excludedPlanetCodes: ['TX31'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Na preparação para deixar a órbita de {PLANETA}, drones sanitários exigem inspeção biológica obrigatória antes da liberação do corredor de saída.',
      choices: [
        {
          id: 'A',
          label: 'Aceitar a quarentena e aguardar a vistoria completa',
          hint: '+12 Reputação local',
          conclusionText:
            'A equipe cumpre todas as etapas com paciência, recebendo certificado sanitário exemplar.',
          effects: {
            renownDelta: 12,
            useSystemOwnerRenown: true,
          },
        },
        {
          id: 'B',
          label: 'Ignição súbita para furar o cordão de quarentena',
          hint: 'Teste de sorte: fuga rápida ou raios tratores castigam a popa',
          conclusionText:
            'Os propulsores acendem de repente tentando romper o cerco dos drones sanitários.',
          effects: {
            luckCheck: {
              winChancePct: 60,
              successText:
                'Arrancada veloz deixa os drones para trás com dano mínimo no escudo!',
              failText:
                'Campos tratores rasgam placas da popa antes do salto e geram multa pesada de reputação.',
              successEffect: {
                hullDelta: -10,
                renownDelta: -12,
                useSystemOwnerRenown: true,
              },
              failEffect: {
                hullDelta: -32,
                renownDelta: -20,
                useSystemOwnerRenown: true,
              },
            },
          },
        },
      ],
    },
  },
  {
    id: 110,
    title: 'Passageiro Clandestino',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'CHEGANDO_NO_PLANETA',
    category: 'Órbita e Decolagem',
    visualMotif: 'tripulacao',
    excludedPlanetCodes: ['TX31'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Durante a aproximação orbital de {PLANETA}, a segurança descobre um jovem clandestino escondido entre os dutos do compartimento auxiliar.',
      choices: [
        {
          id: 'A',
          label: 'Desembarcá-lo imediatamente no controle do porto',
          hint: '+Saúde da tripulação por segurança · Sem gastos',
          conclusionText:
            'Protocolo cumprido sem atritos e tripulação aliviada por manter o controle de bordo.',
          effects: {
            crewHealthDelta: 8,
          },
        },
        {
          id: 'B',
          label: 'Acolhê-lo em estágio na tripulação da {NAVE}',
          hint: 'Teste de sorte: +1 Tripulante dedicado ou fuga levando rações',
          conclusionText:
            'Você oferece uniforme básico e tarefas de apoio ao jovem no convés auxiliar.',
          effects: {
            luckCheck: {
              winChancePct: 72,
              successText:
                'Emocionado pela chance nas estrelas, ele trabalha duro e conquista seu espaço a bordo!',
              failText:
                'Na primeira escala, o rapaz foge pela escotilha levando rações extras do depósito.',
              successEffect: {
                addCrewMember: true,
                suppliesDelta: -20,
              },
              failEffect: {
                suppliesDelta: -24,
                crewHealthDelta: -6,
              },
            },
          },
        },
      ],
    },
  },
  {
    id: 111,
    title: 'Decolagem Forçada',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'DECOLANDO',
    category: 'Órbita e Decolagem',
    visualMotif: 'orbita',
    excludedPlanetCodes: ['TX03', 'TX12', 'TX15', 'TX16', 'TX23', 'TX31'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Um abalo sísmico violento rasga o setor de pouso em {PLANETA} durante a partida! Fissuras se abrem sob a rampa, e um tripulante atrasado ainda corre lá fora.',
      choices: [
        {
          id: 'A',
          label: 'Segurar a decolagem por cinco segundos cruciais e puxá-lo',
          hint: 'Teste de sorte: resgate limpo ou detritos sísmicos atingem o casco',
          conclusionText:
            'Você trava os propulsores no chão trêmulo estendendo a rampa para o colega em corrida.',
          effects: {
            luckCheck: {
              winChancePct: 64,
              successText:
                'Ele salta para dentro no limite! A nave sobe quase ilesa e a equipe vibra com o resgate.',
              failText:
                'Rochas sísmicas atingem em cheio a barriga da nave durante os segundos extras no solo!',
              successEffect: {
                hullDelta: -16,
                crewHealthDelta: 10,
              },
              failEffect: {
                hullDelta: -44,
                crewHealthDelta: 6,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Subir imediatamente para salvar o restante da {NAVE}',
          hint: '–1 Tripulante · –Saúde da tripulação',
          conclusionText:
            'A {NAVE} escapa inteira da fenda sísmica, enquanto o grito cortado no rádio gela toda a ponte.',
          effects: {
            removeOneCrewMember: true,
            crewHealthDelta: -20,
          },
        },
      ],
    },
  },

  // ===========================================================================
  // EVENTOS ESPECÍFICOS POR TIPO DE PLANETA (112 - 134)
  // ===========================================================================
  {
    id: 112,
    title: 'Recife das Marés Profundas',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'EXPLORANDO_SUPERFICIE',
    category: 'Exploração Planetária',
    visualMotif: 'criatura',
    allowedPlanetCodes: ['TX03'],
    initialScene: {
      id: 'init',
      narrativeText:
        'A cápsula submersível da {NAVE} desce sob o oceano sem fim de {PLANETA}, revelando torres de coral luminescente onde medusas colossais deslizam na correnteza azul.',
      choices: [
        {
          id: 'A',
          label: 'Descer até a fenda abissal para colher biomassa marinha',
          hint: 'Teste de sorte: +Biomassa Marinha e Água ou pressão racha vedação',
          conclusionText:
            'O submersível mergulha sob pressão crescente na escuridão do recife abissal.',
          effects: {
            luckCheck: {
              winChancePct: 64,
              successText:
                'Os braços coletores recolhem pólipos luminosos ricos sem avarias graves!',
              failText:
                'A pressão extrema trinca a vedação externa do submersível antes da subida.',
              successEffect: {
                resourceId: 'biomassa_marinha',
                resourceQty: 5,
                hullDelta: -8,
              },
              failEffect: {
                resourceId: 'biomassa_marinha',
                resourceQty: 2,
                hullDelta: -24,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Mapear o recife em profundidade segura por sonar',
          hint: '+Bônus no próximo evento · +Água · Sem risco ao casco',
          conclusionText:
            'Os mapas batimétricos registram canais seguros para futuras navegações oceânicas.',
          effects: {
            grantNextEventBonus: true,
            resourceId: 'agua',
            resourceQty: 5,
          },
        },
      ],
    },
  },
  {
    id: 113,
    title: 'Santuário Submerso',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'ESCANEANDO_RUINAS',
    category: 'Ruínas Antigas',
    visualMotif: 'ruinas',
    allowedPlanetCodes: ['TX03'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Os holofotes do submersível cortam as águas turvas de {PLANETA} e iluminam arcos submersos de pedra esculpida cobertos por algas e cracas cintilantes.',
      choices: [
        {
          id: 'A',
          label: 'Enviar mergulhadores até o altar submerso',
          hint: 'Teste de sorte: +Equipamento raro e Relíquias ou correnteza gelada',
          conclusionText:
            'Os trajes de mergulho avançam entre os arcos submersos em busca do cofre antigo.',
          effects: {
            luckCheck: {
              winChancePct: 62,
              successText:
                'Os especialistas trazem um cofre hermético com equipamento raro e relíquias antigas!',
              failText:
                'Uma correnteza gélida surpreende os mergulhadores, reduzindo a coleta e esgotando a equipe.',
              successEffect: {
                randomEquipment: 'raro',
                resourceId: 'reliquias',
                resourceQty: 1,
              },
              failEffect: {
                randomEquipment: 'comum',
                crewHealthDelta: -14,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Registrar as inscrições subaquáticas por drone de sonar',
          hint: '+Bônus no próximo evento · +Sais minerais · Zero riscos',
          conclusionText:
            'O sonar decifra os glifos esculpidos na pedra sem expor ninguém à pressão abissal.',
          effects: {
            grantNextEventBonus: true,
            resourceId: 'sais',
            resourceQty: 4,
          },
        },
      ],
    },
  },
  {
    id: 114,
    title: 'Cardume Abissal Bioluminescente',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'COLETANDO_AMOSTRAS',
    category: 'Amostras Biológicas',
    visualMotif: 'criatura',
    allowedPlanetCodes: ['TX03'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Da balsa de pesquisa sobre as ondas de {PLANETA}, um redemoinho de peixes e plâncton azul-ciano ilumina a noite oceânica ao redor das sondas.',
      choices: [
        {
          id: 'A',
          label: 'Içar o cilindro de amostragem do núcleo do cardume',
          hint: 'Teste de sorte: +Biomassa Marinha e Compostos Luminosos ou dispersão rápida',
          conclusionText:
            'O guincho desce o cilindro estéril bem no centro do redemoinho luminoso.',
          effects: {
            luckCheck: {
              winChancePct: 68,
              successText:
                'O tanque selado preserva espécimes marinhos raros e compostos luminosos!',
              failText:
                'O cardume percebe a vibração do guincho e dispersa antes do fechamento total.',
              successEffect: {
                resourceId: 'biomassa_marinha',
                resourceQty: 4,
                suppliesDelta: -12,
                grantNextEventBonus: true,
              },
              failEffect: {
                resourceId: 'biomassa_marinha',
                resourceQty: 2,
                suppliesDelta: -12,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Coletar apenas água superficial filtrada',
          hint: '+Água pura · +360 Créditos em dados oceânicos',
          conclusionText:
            'Amostras limpas de micróbios pelágicos abastecem os tanques e o catálogo.',
          effects: {
            resourceId: 'agua',
            resourceQty: 6,
            creditsDelta: 360,
          },
        },
      ],
    },
  },
  {
    id: 115,
    title: 'Vigília na Balsa Oceânica',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'DESCANSANDO_NO_ACAMPAMENTO',
    category: 'Acampamento',
    visualMotif: 'acampamento',
    allowedPlanetCodes: ['TX03'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Com o mar de {PLANETA} calmo sob duas luas pálidas, a equipe monta um toldo pressurizado sobre uma balsa flutuante de pesquisa para descansar fora da nave.',
      choices: [
        {
          id: 'A',
          label: 'Manter a vigília calma ouvindo a maré e reparando equipamentos',
          hint: '+Saúde da tripulação · +Água dessalinizada',
          conclusionText:
            'O balanço suave das ondas acalma os ânimos e renova as forças para o retorno.',
          effects: {
            crewHealthDelta: 14,
            resourceId: 'agua',
            resourceQty: 4,
          },
        },
        {
          id: 'B',
          label: 'Ativar iscas sonoras sob a balsa durante a noite',
          hint: 'Teste de sorte: +5 Biomassa Marinha ou onda violenta de criatura',
          conclusionText:
            'Os emissores submersos lançam pulsos suaves na água escura sob a balsa.',
          effects: {
            luckCheck: {
              winChancePct: 60,
              successText:
                'Crustáceos raros prendem-se às redes durante a noite calma sem incidentes!',
              failText:
                'Uma criatura colossal passa sob a balsa levantando onda violenta contra a equipe.',
              successEffect: {
                resourceId: 'biomassa_marinha',
                resourceQty: 5,
              },
              failEffect: {
                resourceId: 'biomassa_marinha',
                resourceQty: 2,
                crewHealthDelta: -14,
              },
            },
          },
        },
      ],
    },
  },
  {
    id: 116,
    title: 'Procissão na Névoa Espectral',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'EXPLORANDO_SUPERFICIE',
    category: 'Exploração Planetária',
    visualMotif: 'anomalia',
    allowedPlanetCodes: ['TX16'],
    initialScene: {
      id: 'init',
      narrativeText:
        'A névoa violeta de {PLANETA} se abre entre pilares partidos, revelando uma procissão silenciosa de fantasmas translúcidos que atravessam rochas sólidas sem deixar pegadas.',
      choices: [
        {
          id: 'A',
          label: 'Seguir a distância a procissão fantasmagórica até o altar de névoa',
          hint: 'Teste de sorte: +Matéria Fantasma e Equipamento raro ou frio espectral',
          conclusionText:
            'A equipe acompanha em silêncio absoluto o cortejo luminoso pela neblina densa.',
          effects: {
            luckCheck: {
              winChancePct: 58,
              successText:
                'No fim da marcha, as aparições se dissipam deixando Matéria Fantasma e uma relíquia rara!',
              failText:
                'O frio espectral envolve os trajes antes da hora, drenando forças da equipe.',
              successEffect: {
                resourceId: 'materia_fantasma',
                resourceQty: 3,
                randomEquipment: 'raro',
                crewHealthDelta: -6,
              },
              failEffect: {
                resourceId: 'materia_fantasma',
                resourceQty: 1,
                crewHealthDelta: -20,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Captar os ecos eletromagnéticos das aparições sem segui-las',
          hint: '+Éter · +Bônus no próximo evento',
          conclusionText:
            'Os sensores registram a assinatura espectral com segurança antes que a neblina feche.',
          effects: {
            resourceId: 'eter',
            resourceQty: 3,
            grantNextEventBonus: true,
          },
        },
      ],
    },
  },
  {
    id: 117,
    title: 'Mausoléu dos Ecos Fantasmas',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'ESCANEANDO_RUINAS',
    category: 'Ruínas Antigas',
    visualMotif: 'ruinas',
    allowedPlanetCodes: ['TX16'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Ao redor de um mausoléu de obsidiana em {PLANETA}, vultos fantasmagóricos orbitam a abóbada em espiral, sussurrando em frequências que só os capacetes captam.',
      choices: [
        {
          id: 'A',
          label: 'Sintonizar o comunicador na frequência dos fantasmas',
          hint: 'Teste de sorte: +4 Matéria Fantasma e Bônus ou choque mental',
          conclusionText:
            'Você abre o canal do capacete ajustando a recepção para os sussurros espirais.',
          effects: {
            luckCheck: {
              winChancePct: 62,
              successText:
                'As vozes revelam reservas de matéria espectral antes de desaparecerem em clarão suave!',
              failText:
                'Um grito em eco atravessa os capacetes, abalando a tripulação na retirada.',
              successEffect: {
                resourceId: 'materia_fantasma',
                resourceQty: 4,
                grantNextEventBonus: true,
              },
              failEffect: {
                resourceId: 'materia_fantasma',
                resourceQty: 2,
                crewHealthDelta: -16,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Recolher apenas fragmentos cristalinos da soleira externa',
          hint: '+Éter · Sem riscos',
          conclusionText:
            'A equipe evita o limiar assombrado e recolhe éter condensado nos degraus.',
          effects: {
            resourceId: 'eter',
            resourceQty: 3,
          },
        },
      ],
    },
  },
  {
    id: 118,
    title: 'Condensação de Éter Fantasma',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'COLETANDO_AMOSTRAS',
    category: 'Amostras Biológicas',
    visualMotif: 'anomalia',
    allowedPlanetCodes: ['TX16'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Filetes luminosos de névoa ectoplasmática sobem do solo rachado de {PLANETA}, reagindo ao campo magnético dos cilindros de coleta como se tivessem memória própria.',
      choices: [
        {
          id: 'A',
          label: 'Sugar a nuvem inteira para o recipiente a vácuo',
          hint: 'Teste de sorte: +Matéria Fantasma e Éter ou descarga fria nos trajes',
          conclusionText:
            'Os extratores a vácuo puxam os filetes brilhantes para dentro do tanque blindado.',
          effects: {
            luckCheck: {
              winChancePct: 64,
              successText:
                'Selo fechado a tempo! O recipiente guarda ectoplasma raríssimo com segurança.',
              failText:
                'O cilindro congela com violência nas mãos do coletor antes de vedar.',
              successEffect: {
                resourceId: 'materia_fantasma',
                resourceQty: 3,
              },
              failEffect: {
                resourceId: 'materia_fantasma',
                resourceQty: 1,
                crewHealthDelta: -14,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Coletar amostra diluída com estabilizador magnético',
          hint: '–Suprimentos · +Éter puro · Zero riscos',
          conclusionText:
            'A mistura controlada garante armazenamento estável para pesquisa espectral.',
          effects: {
            suppliesDelta: -12,
            resourceId: 'eter',
            resourceQty: 4,
          },
        },
      ],
    },
  },
  {
    id: 119,
    title: 'Caldeira de Magma e Basalto',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'EXPLORANDO_SUPERFICIE',
    category: 'Exploração Planetária',
    visualMotif: 'mina',
    allowedPlanetCodes: ['TX04'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Da crista de basalto negro de {PLANETA}, rios incandescente de magma cortam a caldeira vulcânica enquanto o vento traz cinzas quentes e estalos de rocha derretida.',
      choices: [
        {
          id: 'A',
          label: 'Aproximar extratores térmicos da borda do rio de lava',
          hint: 'Teste de sorte: +6 Titânio ou jato de magma atinge o casco',
          conclusionText:
            'Os braços térmicos descem sobre a beira incandescente do rio de magma.',
          effects: {
            luckCheck: {
              winChancePct: 58,
              successText:
                'Coleta veloz de núcleos vulcânicos ricos com apenas desgaste leve nos escudos!',
              failText:
                'Uma erupção lateral atinge a área de pouso, chamuscando gravemente a blindagem!',
              successEffect: {
                resourceId: 'titanio',
                resourceQty: 6,
                hullDelta: -10,
              },
              failEffect: {
                resourceId: 'titanio',
                resourceQty: 3,
                hullDelta: -32,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Coletar cristais de enxofre esfriados na encosta segura',
          hint: '+Enxofre · Sem danos',
          conclusionText:
            'Depósitos amarelos puros abastecem o porão sem arriscar os escudos térmicos.',
          effects: {
            resourceId: 'enxofre',
            resourceQty: 6,
          },
        },
      ],
    },
  },
  {
    id: 120,
    title: 'Extremófilos de Fumarola e Plasma',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'COLETANDO_AMOSTRAS',
    category: 'Amostras Biológicas',
    visualMotif: 'criatura',
    allowedPlanetCodes: ['TX04', 'TX13', 'TX15'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Colônias vibrantes de micróbios extremófilos prosperam junto às fendas escaldantes de {PLANETA}, alimentando-se diretamente de enxofre, radiação e descargas energéticas.',
      choices: [
        {
          id: 'A',
          label: 'Extrair placas vivas inteiras com pinças térmicas',
          hint: 'Teste de sorte: +4 Enzimas raras ou vapor sulfúrico queima filtros',
          conclusionText:
            'As pinças avançam sobre a crosta quente ao lado da fumarola ativa.',
          effects: {
            luckCheck: {
              winChancePct: 64,
              successText:
                'As culturas resistentes são retiradas intactas para os reatores biológicos!',
              failText:
                'Um jato inesperado de vapor sulfúrico irrita os trajes e reduz a coleta.',
              successEffect: {
                resourceId: 'enzimas',
                resourceQty: 4,
              },
              failEffect: {
                resourceId: 'enzimas',
                resourceQty: 2,
                crewHealthDelta: -14,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Realizar raspagem superficial com filtros extras',
          hint: '–Suprimentos · +Compostos Orgânicos · Sem riscos',
          conclusionText:
            'Filtros reforçados garantem amostras limpas sem expor os coletores.',
          effects: {
            suppliesDelta: -10,
            resourceId: 'compostos_organicos',
            resourceQty: 4,
          },
        },
      ],
    },
  },
  {
    id: 121,
    title: 'Fenda na Geleira Milenar',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'EXPLORANDO_SUPERFICIE',
    category: 'Exploração Planetária',
    visualMotif: 'ruinas',
    allowedPlanetCodes: ['TX05', 'TX29'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Em meio às paredes translúcidas de gelo azul de {PLANETA}, o sonar revela a silhueta congelada de uma antiga embarcação incrustada dezenas de metros abaixo da borda.',
      choices: [
        {
          id: 'A',
          label: 'Descer com cordas térmicas até o casco congelado',
          hint: 'Teste de sorte: +Equipamento raro e Gelo ou desmoronamento de gelo',
          conclusionText:
            'Os escaladores descem pela fenda azul iluminando o casco preservado sob o gelo.',
          effects: {
            luckCheck: {
              winChancePct: 62,
              successText:
                'A equipe abre um compartimento selado no gelo e resgata equipamento raro intacto!',
              failText:
                'Uma placa de gelo se desprende na subida, ferindo a equipe na retirada.',
              successEffect: {
                randomEquipment: 'raro',
                resourceId: 'gelo',
                resourceQty: 5,
                crewHealthDelta: -6,
              },
              failEffect: {
                randomEquipment: 'comum',
                crewHealthDelta: -16,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Perfurar apenas as veias de Hélio-3 presas no paredão',
          hint: '+Hélio-3 · +Gelo · Sem riscos',
          conclusionText:
            'Extração fria e precisa de combustível congelado nas camadas superiores.',
          effects: {
            resourceId: 'helio_3',
            resourceQty: 4,
          },
        },
      ],
    },
  },
  {
    id: 122,
    title: 'Floresta de Micélio e Turfa',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'COLETANDO_AMOSTRAS',
    category: 'Amostras Biológicas',
    visualMotif: 'criatura',
    allowedPlanetCodes: ['TX07', 'TX26'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Sob chapéus colossais de cogumelos violetas em {PLANETA}, uma chuva constante de esporos doces paira sobre a lama morna e raízes submersas.',
      choices: [
        {
          id: 'A',
          label: 'Coletar esporos concentrados diretamente sob os píleos gigantes',
          hint: 'Teste de sorte: +5 Esporos puros ou tontura por inalação',
          conclusionText:
            'Os extratores enchem sob a chuva densa de partículas violetas.',
          effects: {
            luckCheck: {
              winChancePct: 66,
              successText:
                'Os filtros seguram a umidade e os cilindros enchem rápido de esporos concentrados!',
              failText:
                'O aroma denso atravessa os filtros, provocando tontura e cansaço nos coletores.',
              successEffect: {
                resourceId: 'esporos',
                resourceQty: 5,
              },
              failEffect: {
                resourceId: 'esporos',
                resourceQty: 3,
                crewHealthDelta: -14,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Recolher turfa e fungos da borda segura da trilha',
          hint: '+Fungos · +Antídoto médico · Sem riscos',
          conclusionText:
            'Amostras limpas rendem insumos médicos de grande utilidade a bordo.',
          effects: {
            resourceId: 'fungos',
            resourceQty: 5,
            consumableId: 'antidoto',
            consumableQty: 1,
          },
        },
      ],
    },
  },
  {
    id: 123,
    title: 'Matriz da Forja Planetária',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'EXPLORANDO_SUPERFICIE',
    category: 'Exploração Planetária',
    visualMotif: 'tecnologia',
    allowedPlanetCodes: ['TX09', 'TX30'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Placas de titânio escovado cobrem o horizonte de {PLANETA}. Canaletas de circuitos azuis acendem sob as botas da equipe e uma escotilha automática se destrava à frente.',
      choices: [
        {
          id: 'A',
          label: 'Acessar o núcleo inferior da matriz mecânica',
          hint: 'Teste de sorte: +Ligas Avançadas e Equipamento raro ou fogo de sentinelas',
          conclusionText:
            'A equipe desce pelos degraus metálicos até o núcleo iluminado por circuitos azuis.',
          effects: {
            luckCheck: {
              winChancePct: 58,
              successText:
                'Vocês desativam os sentinelas a tempo e extraem componentes raros de ponta!',
              failText:
                'Sentinelas antigos despertam e disparam contra a saída, ferindo o casco da nave.',
              successEffect: {
                resourceId: 'ligas_avancadas',
                resourceQty: 4,
                randomEquipment: 'raro',
                hullDelta: -12,
              },
              failEffect: {
                resourceId: 'ligas_avancadas',
                resourceQty: 2,
                hullDelta: -32,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Decodificar os protocolos externos sem violar os selos',
          hint: '+Platina · +Bônus no próximo evento',
          conclusionText:
            'Os autômatos permanecem pacíficos enquanto você baixa diagramas valiosos.',
          effects: {
            resourceId: 'platina',
            resourceQty: 4,
            grantNextEventBonus: true,
          },
        },
      ],
    },
  },
  {
    id: 124,
    title: 'Labirinto de Prismas e Diamante',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'EXPLORANDO_SUPERFICIE',
    category: 'Exploração Planetária',
    visualMotif: 'mina',
    allowedPlanetCodes: ['TX10', 'TX11'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Torres gigantescas de cristal e diamante translúcido em {PLANETA} refratam a luz estelar em feixes afiados como lâminas arco-íris pelo desfiladeiro.',
      choices: [
        {
          id: 'A',
          label: 'Cortar um núcleo prismático puro no centro do labirinto',
          hint: 'Teste de sorte: +4 Diamantes puros ou feixe refratado queima trajes',
          conclusionText:
            'Os cortadores avançam entre os espelhos naturais rumo ao prisma central.',
          effects: {
            luckCheck: {
              winChancePct: 62,
              successText:
                'Corte perfeito fora do ângulo solar! Gemas puríssimas de diamante entram no porão.',
              failText:
                'Um feixe refratado atravessa o corredor, superaquecendo os trajes na retirada.',
              successEffect: {
                resourceId: 'diamante',
                resourceQty: 4,
              },
              failEffect: {
                resourceId: 'diamante',
                resourceQty: 2,
                crewHealthDelta: -16,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Recolher fragmentos na sombra das torres maiores',
          hint: '+Cristais Energéticos · +380 Créditos',
          conclusionText:
            'Coleta segura e lucrativa longe dos focos luminosos principais.',
          effects: {
            resourceId: 'cristais_energeticos',
            resourceQty: 4,
            creditsDelta: 380,
          },
        },
      ],
    },
  },
  {
    id: 125,
    title: 'Tempestade de Arcos de Plasma',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'EXPLORANDO_SUPERFICIE',
    category: 'Exploração Planetária',
    visualMotif: 'anomalia',
    allowedPlanetCodes: ['TX15'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Chicotes de plasma violeta e magenta saltam das fendas energizadas de {PLANETA}, obrigando a equipe a erguer um domo magnético portátil para não ser vaporizada.',
      choices: [
        {
          id: 'A',
          label: 'Acoplar coletores ao pilar durante o pico da descarga',
          hint: 'Teste de sorte: +5 Plasma ou arco elétrico severo no casco',
          conclusionText:
            'Os cabos de coleta se estendem em direção ao pilar ionizado sob estalos elétricos.',
          effects: {
            luckCheck: {
              winChancePct: 56,
              successText:
                'Os capacitores transbordam de plasma puro com apenas sobrecarga leve nos escudos!',
              failText:
                'Um arco gigantesco desvia pelo solo e chamusca gravemente o casco da nave!',
              successEffect: {
                resourceId: 'plasma',
                resourceQty: 5,
                hullDelta: -10,
              },
              failEffect: {
                resourceId: 'plasma',
                resourceQty: 2,
                hullDelta: -34,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Manter o escudo magnético estável e colher resíduos de borda',
          hint: '+Energia · +Bônus no próximo evento · Sem danos',
          conclusionText:
            'Leituras precisas do campo instável alimentam os capacitores com total segurança.',
          effects: {
            resourceId: 'energia',
            resourceQty: 5,
            grantNextEventBonus: true,
          },
        },
      ],
    },
  },
  {
    id: 126,
    title: 'Santuário Dourado das Estrelas',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'ESCANEANDO_RUINAS',
    category: 'Ruínas Antigas',
    visualMotif: 'ruinas',
    allowedPlanetCodes: ['TX17'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Acima das nuvens douradas de {PLANETA}, terraços de mármore branco sustentam anéis celestiais flutuantes que vibram em acordes serenos.',
      choices: [
        {
          id: 'A',
          label: 'Meditar diante do anel central e registrar os harmônicos',
          hint: '+Saúde da tripulação · +Cristais Celestiais · +Bônus',
          conclusionText:
            'Uma calma solene restaura o vigor de todos e revela nichos de cristal dourado.',
          effects: {
            crewHealthDelta: 16,
            resourceId: 'cristais_celestiais',
            resourceQty: 3,
            grantNextEventBonus: true,
          },
        },
        {
          id: 'B',
          label: 'Procurar relíquias esquecidas nos pórticos de obsidiana',
          hint: 'Teste de sorte: +Equipamento raro ou guardiões bloqueiam saída',
          conclusionText:
            'Os exploradores investigam os nichos escuros entre os arcos antigos de obsidiana.',
          effects: {
            luckCheck: {
              winChancePct: 66,
              successText:
                'As oferendas antigas preservadas entre os arcos são recolhidas sem resistência!',
              failText:
                'Guardiões automáticos reagem ao toque, permitindo recolher apenas item comum na saída.',
              successEffect: {
                randomEquipment: 'raro',
                renownDelta: 12,
                useSystemOwnerRenown: true,
              },
              failEffect: {
                randomEquipment: 'comum',
                hullDelta: -12,
              },
            },
          },
        },
      ],
    },
  },
  {
    id: 127,
    title: 'Corredor Não-Euclidiano',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'ESCANEANDO_RUINAS',
    category: 'Ruínas Antigas',
    visualMotif: 'anomalia',
    allowedPlanetCodes: ['TX18'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Escadarias sobem de cabeça para baixo ao redor de uma fenda magenta em {PLANETA}. A bússola espacial gira sem parar enquanto cada passo altera a distância do corredor.',
      choices: [
        {
          id: 'A',
          label: 'Lançar sondas com cabo preso até o centro da fenda dimensional',
          hint: 'Teste de sorte: +3 Cristais de Fenda ou distorção espacial severa',
          conclusionText:
            'Os cabos tensos desaparecem dentro do vértice magenta enquanto os guinchos puxam.',
          effects: {
            luckCheck: {
              winChancePct: 60,
              successText:
                'Os cabos retornam trazendo Cristais de Fenda raríssimos!',
              failText:
                'Uma onda gravitacional torce a gravidade no corredor, deixando enjoo severo e menos amostras.',
              successEffect: {
                resourceId: 'cristal_fenda',
                resourceQty: 3,
                crewHealthDelta: -6,
              },
              failEffect: {
                resourceId: 'cristal_fenda',
                resourceQty: 1,
                crewHealthDelta: -18,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Mapear a geometria distorcida da soleira segura',
          hint: '+Bônus no próximo evento · +Matéria Exótica',
          conclusionText:
            'Os algoritmos de salto absorvem dados inestimáveis sobre dobras no espaço.',
          effects: {
            grantNextEventBonus: true,
            resourceId: 'materia_exotica',
            resourceQty: 2,
          },
        },
      ],
    },
  },
  {
    id: 128,
    title: 'Relógio Congelado no Tempo',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'ESCANEANDO_RUINAS',
    category: 'Ruínas Antigas',
    visualMotif: 'anomalia',
    allowedPlanetCodes: ['TX19'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Diante de um obelisco antigo em {PLANETA}, uma cachoeira inteira está congelada no meio do salto em ondas verde-douradas de estase temporal; gotas pairam imóveis como vidro.',
      choices: [
        {
          id: 'A',
          label: 'Entrar no raio de estase para recolher o cronocristal no pedestal',
          hint: 'Teste de sorte: +4 Cronocristais e Equipamento raro ou dessincronia aguda',
          conclusionText:
            'Um voluntário dá o primeiro passo para dentro da bolha imóvel de luz verde-dourada.',
          effects: {
            luckCheck: {
              winChancePct: 58,
              successText:
                'Retirada precisa com cronocristais intactos e equipamento raro preservado na estase!',
              failText:
                'O tempo salta desordenado ao tocar o pedestal, causando fadiga intensa e menor coleta.',
              successEffect: {
                resourceId: 'cronocristais',
                resourceQty: 4,
                randomEquipment: 'raro',
                crewHealthDelta: -6,
              },
              failEffect: {
                resourceId: 'cronocristais',
                resourceQty: 2,
                crewHealthDelta: -18,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Calibrar os cronômetros da nave com a frequência da cascata imóvel',
          hint: '+Bônus no próximo evento · +Perícia da tripulação',
          conclusionText:
            'Os navegadores ajustam os sensores para prever anomalias com precisão absurda.',
          effects: {
            grantNextEventBonus: true,
            boostCrewSkill: 5,
          },
        },
      ],
    },
  },
  {
    id: 129,
    title: 'Ilhas e Monólitos Suspensos',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'EXPLORANDO_SUPERFICIE',
    category: 'Exploração Planetária',
    visualMotif: 'anomalia',
    allowedPlanetCodes: ['TX20', 'TX23'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Blocos rochosos e ilhas cobertas de vegetação flutuam sobre um mar de nuvens em {PLANETA}, ancorados por raízes e veios azuis onde cachoeiras caem no vazio.',
      choices: [
        {
          id: 'A',
          label: 'Atravessar pelas rochas flutuantes até o núcleo gravitacional',
          hint: 'Teste de sorte: +4 Cristais de Flutuação ou ruptura de cabo na travessia',
          conclusionText:
            'Os batedores disparam arpéus magnéticos de uma rocha suspensa à seguinte.',
          effects: {
            luckCheck: {
              winChancePct: 62,
              successText:
                'Travessia ágil pelos blocos flutuantes garante Cristais de Flutuação intactos!',
              failText:
                'Uma ancoragem escorrega no vento, causando queda contida pelos cabos de segurança.',
              successEffect: {
                resourceId: 'cristais_flutuacao',
                resourceQty: 4,
              },
              failEffect: {
                resourceId: 'cristais_flutuacao',
                resourceQty: 2,
                crewHealthDelta: -16,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Ancorar um farol de rota na borda firme da ilha principal',
          hint: '+Minerais Leves · +320 Créditos em cartografia aérea',
          conclusionText:
            'A rota segura entre ilhas suspensas garante retorno tranquilo à órbita.',
          effects: {
            resourceId: 'minerais_leves',
            resourceQty: 5,
            creditsDelta: 320,
          },
        },
      ],
    },
  },
  {
    id: 130,
    title: 'Cânion da Escuridão Viva',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'EXPLORANDO_SUPERFICIE',
    category: 'Exploração Planetária',
    visualMotif: 'criatura',
    allowedPlanetCodes: ['TX21'],
    initialScene: {
      id: 'init',
      narrativeText:
        'No cânion negro de {PLANETA}, nenhuma estrela rompe a escuridão espessa. Apenas as lanternas dos trajes iluminam veios roxos pulsando nas paredes e olhos ocultos nas frestas.',
      choices: [
        {
          id: 'A',
          label: 'Lançar sinalizadores térmicos e minerar os veios sombrios',
          hint: 'Teste de sorte: +5 Minerais Sombrios ou investida dos predadores noturnos',
          conclusionText:
            'Os sinalizadores abrem um clarão quente no fundo do desfiladeiro enquanto as picaretas avançam.',
          effects: {
            luckCheck: {
              winChancePct: 68,
              successText:
                'A luz intensa afugenta os predadores tempo suficiente para encher as bolsas sem baixas!',
              failText:
                'Criaturas cegas pelo clarão investem na escuridão antes da subida, ferindo os coletores.',
              successEffect: {
                resourceId: 'minerais_sombrios',
                resourceQty: 5,
                suppliesDelta: -14,
              },
              failEffect: {
                resourceId: 'minerais_sombrios',
                resourceQty: 3,
                suppliesDelta: -14,
                crewHealthDelta: -12,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Avançar em modo furtivo apenas coletando fungos da entrada',
          hint: '+Fungos · +Perícia de vigilância',
          conclusionText:
            'Sem chamar atenção, a equipe volta ao ponto de extração sem incidentes.',
          effects: {
            resourceId: 'fungos',
            resourceQty: 4,
            boostCrewSkill: 3,
          },
        },
      ],
    },
  },
  {
    id: 131,
    title: 'Planície do Horizonte Espelhado',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'EXPLORANDO_SUPERFICIE',
    category: 'Exploração Planetária',
    visualMotif: 'anomalia',
    allowedPlanetCodes: ['TX22'],
    initialScene: {
      id: 'init',
      narrativeText:
        'A planície perfeitamente lisa de {PLANETA} reflete nebulosas e luas como um espelho de prata sólido, confundindo o senso de cima e baixo de quem caminha sobre ela.',
      choices: [
        {
          id: 'A',
          label: 'Cortar placas do solo vítreo nas fraturas da borda',
          hint: 'Teste de sorte: +4 Cristais Refletores limpos ou reverberação danifica pouso',
          conclusionText:
            'As serras acústicas tocam a lâmina espelhada da planície cintilante.',
          effects: {
            luckCheck: {
              winChancePct: 66,
              successText:
                'As lâminas espelhadas saem inteiras e perfeitas para sensores óticos militares!',
              failText:
                'A vibração trinca o vidro ao redor do trem de pouso, danificando a base da nave.',
              successEffect: {
                resourceId: 'cristais_refletores',
                resourceQty: 4,
              },
              failEffect: {
                resourceId: 'cristais_refletores',
                resourceQty: 2,
                hullDelta: -22,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Usar a superfície refletora para calibrar sensores óticos da {NAVE}',
          hint: '+Bônus no próximo evento · +Vidro refinado',
          conclusionText:
            'Os telescópios da nave ganham nitidez excepcional após o alinhamento especular.',
          effects: {
            grantNextEventBonus: true,
            resourceId: 'vidro',
            resourceQty: 5,
          },
        },
      ],
    },
  },
  {
    id: 132,
    title: 'Maré Neon Bioluminescente',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'COLETANDO_AMOSTRAS',
    category: 'Amostras Biológicas',
    visualMotif: 'criatura',
    allowedPlanetCodes: ['TX27'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Na costa noturna de {PLANETA}, ondas elétricas em azul-ciano e samambaias esmeraldas pulsam no mesmo ritmo luminoso, transformando toda a praia em uma lanterna viva.',
      choices: [
        {
          id: 'A',
          label: 'Colher frascos da espuma viva e da seiva luminosa',
          hint: 'Teste de sorte: +Compostos Luminosos e +420 Créditos ou choque elétrico',
          conclusionText:
            'Os coletores mergulham os frascos isolados diretamente na espuma azul-ciano brilhante.',
          effects: {
            luckCheck: {
              winChancePct: 70,
              successText:
                'Amostras espetaculares iluminam o laboratório e rendem ótimo valor bio-ótico!',
              failText:
                'Uma onda carregada descarrega estática pelos coletores, reduzindo o rendimento.',
              successEffect: {
                resourceId: 'compostos_luminosos',
                resourceQty: 5,
                creditsDelta: 420,
              },
              failEffect: {
                resourceId: 'compostos_luminosos',
                resourceQty: 3,
                creditsDelta: 180,
                crewHealthDelta: -8,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Sincronizar os sensores biológicos com a pulsação da praia',
          hint: '+Saúde da tripulação · +Biomassa pura',
          conclusionText:
            'A luz serena acalma a equipe e revela bancos ricos de biomassa costeira.',
          effects: {
            crewHealthDelta: 12,
            resourceId: 'biomassa',
            resourceQty: 5,
          },
        },
      ],
    },
  },
  {
    id: 133,
    title: 'Biofilme Litófago das Fissuras',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'COLETANDO_AMOSTRAS',
    category: 'Amostras Biológicas',
    visualMotif: 'mina',
    allowedPlanetCodes: ['TX01', 'TX02', 'TX05', 'TX08', 'TX09', 'TX10', 'TX11', 'TX18', 'TX19', 'TX20', 'TX21', 'TX22', 'TX29', 'TX30'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Nas fendas minerais de {PLANETA}, onde não crescem árvores nem florestas, veios finos de biofilme metálico-turquesa corroem a rocha lentamente para extrair energia mineral.',
      choices: [
        {
          id: 'A',
          label: 'Raspar as colônias litófagas com bisturi a laser',
          hint: 'Teste de sorte: +Compostos Orgânicos limpos ou bolsa de gás ácido',
          conclusionText:
            'O bisturi a laser destaca cuidadosamente as placas metálico-turquesas da fissura.',
          effects: {
            luckCheck: {
              winChancePct: 68,
              successText:
                'Placas perfeitas coletadas com silício residual, mostrando metabolismo inorgânico raro!',
              failText:
                'O corte abre uma bolsa de gás ácido na fenda, obrigando retirada rápida.',
              successEffect: {
                resourceId: 'compostos_organicos',
                resourceQty: 4,
              },
              failEffect: {
                resourceId: 'compostos_organicos',
                resourceQty: 2,
                crewHealthDelta: -12,
              },
            },
          },
        },
        {
          id: 'B',
          label: 'Registrar apenas o padrão bio-mineral em campo',
          hint: '+Bônus no próximo evento · +320 Créditos em pesquisa exobiológica',
          conclusionText:
            'Os dados comprovam metabolismo inorgânico raro sem danificar a jazida.',
          effects: {
            grantNextEventBonus: true,
            creditsDelta: 320,
          },
        },
      ],
    },
  },
  {
    id: 134,
    title: 'Domo Térmico Pressurizado',
    scope: 'planetario',
    complexity: 'simples',
    triggerKey: 'DESCANSANDO_NO_ACAMPAMENTO',
    category: 'Acampamento',
    visualMotif: 'acampamento',
    allowedPlanetCodes: ['TX04', 'TX05', 'TX07', 'TX13', 'TX15', 'TX18', 'TX19', 'TX20', 'TX29'],
    initialScene: {
      id: 'init',
      narrativeText:
        'Diante das condições implacáveis de {PLANETA}, os exploradores armam um domo energético hexagonal e pressurizado, descansando com segurança enquanto o clima hostil varre o exterior.',
      choices: [
        {
          id: 'A',
          label: 'Reforçar o gerador do domo e descansar por turno completo',
          hint: '–Suprimentos leves · +18 Saúde da tripulação garantida',
          conclusionText:
            'O abrigo resiste perfeitamente às rajadas externas e todos recuperam pleno fôlego.',
          effects: {
            suppliesDelta: -10,
            crewHealthDelta: 18,
          },
        },
        {
          id: 'B',
          label: 'Aproveitar o domo como base para calibrar sensores externos',
          hint: 'Teste de sorte: +Bônus e Saúde ou rajada danifica antena',
          conclusionText:
            'Você ergue a antena portátil pela cúpula do abrigo em meio ao vento planetário.',
          effects: {
            luckCheck: {
              winChancePct: 72,
              successText:
                'Os registros atmosféricos ficam impecáveis e aprimoram a próxima varredura!',
              failText:
                'Uma rajada súbita dobra a haste externa, consumindo peças de reparo no conserto.',
              successEffect: {
                crewHealthDelta: 8,
                grantNextEventBonus: true,
              },
              failEffect: {
                crewHealthDelta: 4,
                suppliesDelta: -10,
              },
            },
          },
        },
      ],
    },
  },
];
