export interface FactionDossierContent {
  /** Como a facção pensa, interpreta o cosmos e mede valor. */
  mindset: string;
  /** Como age em campo, portos, negociações e conflitos. */
  behavior: string;
  /** Código interno, rituais de convívio e o que desperta respeito ou repúdio. */
  code: string;
}

export const FACTION_DOSSIERS: Record<string, FactionDossierContent> = {
  // ── SOLARIANOS (Humanoide) ────────────────────────────────────────────────
  fac_solarianos_1: {
    mindset:
      'Para a Liga Mercantil de Solis, a galáxia não é um tabuleiro de fronteiras, mas um imenso livro de rotas onde cada estrela vale pelo fluxo de naves que atrai. Seus conselheiros enxergam a paz como infraestrutura lucrativa: guerras desperdiçam casco, desviam comboios e encarecem seguros. Desconfiam de discursos grandiosos e medem a seriedade de qualquer comandante pela pontualidade com que honra uma carga assinada.',
    behavior:
      'Nos portos da Liga, tudo se move por leilões rápidos, selos de voz criptografados e escoltas contratadas por trecho. Quando um conflito ameaça um corredor de suprimentos, raramente respondem com fanfarra militar; primeiro congelam linhas de crédito, desviam fretes e financiam mercenários discretos para reabrir a passagem antes que o mercado oscile.',
    code:
      'Os contratos são gravados em áudio no momento do acoplamento e repetidos em frequência aberta ao final da entrega. Quebrar um acordo ou abandonar um comboio escoltado transforma o infrator em nome proibido em dezenas de docas; em contrapartida, mercadores leais recebem prioridade de pouso mesmo sob tempestade solar.',
  },
  fac_solarianos_2: {
    mindset:
      'A Ordem Reformista do Alvorecer acredita que nenhuma civilização tem o direito de envelhecer isolada na ignorância do próprio céu. Seus líderes são cartógrafos, ex-pilotos e cientistas que tratam cada anomalia espacial como uma página arrancada da história comum do universo. Para eles, reter mapas estelares em cofres fechados equivale a incendiar bibliotecas.',
    behavior:
      'Suas naves viajam em formações leves, sempre com sensores abertos e sondas prontas para cruzar zonas pouco exploradas. Em mesa diplomática, oferecem tecnologia de navegação e cartas atualizadas em troca de acesso irrestrito a mundos novos, mantendo uma cordialidade paciente que só endurece quando encontram censura científica ou tráfico de amostras vivas.',
    code:
      'Antes de liberar qualquer atracação, exigem varredura biológica completa para impedir contaminações entre ecossistemas. Capitães que compartilham coordenadas inéditas ou salvam dados de estações perdidas sobem depressa no conceito da Ordem, sendo convidados para assembleias abertas onde decisões de frota são votadas por mérito técnico.',
  },

  // ── VALDRIS (Humanoide) ───────────────────────────────────────────────────
  fac_valdris_1: {
    mindset:
      'O Pacto Marcial Valdris despreza acordos nascidos do medo e respeita apenas a força que se testa sob fogo real. Na visão de seus marechais, a galáxia pertence a quem não recua diante de um bloqueio orbital, e a complacência é a raiz da queda de todos os impérios antigos. A honra pessoal do piloto pesa tanto quanto o calibre dos canhões da nave.',
    behavior:
      'Patrulhas do Pacto abordam visitantes com escudos ativos e canhões destravados, exigindo resposta imediata e postura firme pelo rádio. Não gostam de rodeios burocráticos: negociam direto ao ponto, pagam generosamente por escoltas arriscadas ou caçadas a rivais, e consideram covardia qualquer tentativa de fuga sem ao menos trocar uma salva de aviso.',
    code:
      'Saudações oficiais acontecem com um pulso breve de escudo contra escudo ao entrar em formação fechada. Duelos combinados resolvem disputas entre oficiais sem rancor posterior, mas contrabandear armas em seus sistemas ou trair um pacto de batalha garante perseguição implacável por todo o setor.',
  },
  fac_valdris_2: {
    mindset:
      'Para a Vanguarda Colonial Valdris, estrela sem colônia iluminada é desperdício de espaço vivo. Onde outras potências veem rochas estéreis ou climas hostis, os engenheiros da Vanguarda enxergam futuras metrópoles erguidas na base de aço, teimosia e vigas ancoradas no basalto. O progresso, para eles, se mede em cúpulas pressurizadas acendendo no lado noturno dos planetas.',
    behavior:
      'Avançam em ondas coordenadas de cargueiros pesados, escavadores e naves-fábrica que transformam postos avançados em cidades médias em poucos ciclos. Tratam viajantes como potenciais fornecedores de matéria-prima e recompensam bem quem abastece frentes recém-fundadas, embora demonstrem pouca paciência para discursos preservacionistas que atrasem uma obra.',
    code:
      'Cada nova colônia fundada recebe um sino metálico forjado com o primeiro minério extraído do solo local, tocado sempre que um comboio de apoio atraca. Abandonar um assentamento à própria sorte em meio a uma crise de mantimentos é a maior desonra possível dentro da Vanguarda.',
  },

  // ── NYXIANOS (Humanoide) ──────────────────────────────────────────────────
  fac_nyxianos_1: {
    mindset:
      'O Conclave Tradicional de Nyx cresceu na penumbra fria de órbitas distantes e aprendeu que sobreviver exige falar pouco e observar tudo. Seus anciãos encaram a agitação das potências jovens com desconfiança silenciosa, convictos de que segredos preservados duram mais do que impérios ruidosos. Para o Conclave, cada visita não anunciada é uma intrusão até prova em contrário.',
    behavior:
      'Mantêm seus portos escurecidos, com balizas desligadas até que o visitante transmita credenciais reconhecidas ou reputação comprovada. Mesmo durante trocas comerciais autorizadas, comunicam-se por mensagens curtas e cifradas, evitando revelar a localização de seus arquivos centrais ou o real alcance de suas frotas de vigilância.',
    code:
      'O silêncio de rádio dentro de espaço controlado pelo Conclave é sinal de respeito, não de hostilidade. Aproximar-se com transmissores em potência máxima ou tentar sondar estações fechadas sem licença leva a interceptações rápidas e bloqueio imediato das docas centrais.',
  },
  fac_nyxianos_2: {
    mindset:
      'O Consórcio Sombra de Ébano enxerga o universo como uma rede paralela de informações privilegiadas, relíquias esquecidas e dívidas que nunca vencem. Seus diretores operam longe das câmeras oficiais e acreditam que todo poder público possui um preço privado nos bastidores. Valorizam a discrição acima de títulos, brasões ou alinhamentos ideológicos.',
    behavior:
      'Negociam em estações discretas, leilões fechados por convite e encontros orbitais fora das rotas patrulhadas. Raramente declaram guerras abertas; preferem comprar rotas inteiras, sumir com registros comprometedores ou redirecionar piratas convenientes contra competidores que atrapalhem seus contratos confidenciais.',
    code:
      'A única regra sagrada do Consórcio é jamais expor coordenadas privadas ou identidades de clientes a terceiros. Quem cumpre entregas sem fazer perguntas recebe acesso a peças raras e informações valiosas; quem vende segredos da casa desaparece dos registros de tráfego sem deixar vestígio.',
  },

  // ── LUMINARES DE ÉTER (Espectroid) ────────────────────────────────────────
  fac_luminares_eter_1: {
    mindset:
      'O Coro Harmônico do Éter percebe o espaço não como vazio, mas como uma sinfonia contínua de campos magnéticos, ventos estelares e correntes de plasma vivo. Para essas consciências fotônicas, destruir um gigante gasoso por ganância industrial equivale a rasgar um órgão vital do cosmos. Pensam em escalas longas e desprezam a pressa febril das espécies sólidas.',
    behavior:
      'Seus emissários não falam por palavras secas, mas por modulações musicais em frequência de rádio que traduzem humor, advertência e intenção. Recebem bem navegadores pacientes e respeitosos, mas erguem barreiras energéticas densas diante de extratoras agressivas ou naves com reatores mal blindados que poluam nuvens sagradas.',
    code:
      'Ao entrar em órbita de mundos gasosos tutelados pelo Coro, espera-se que os motores operem em marcha suave e sem descargas iônicas bruscas. Ferir criaturas de plasma ou saquear bolsas nebulares protegidas rompe a harmonia local e fecha todas as estações do Coro ao infrator.',
  },
  fac_luminares_eter_2: {
    mindset:
      'O Fórum Luminar Aberto vê cada mente consciente — sólida, gasosa ou metálica — como um prisma distinto que refrata a mesma verdade cósmica sob outro ângulo. Seus pensadores rejeitam o isolamento místico de outros espectroides e defendem que a troca aberta de leituras espectrais acelera a evolução de toda a galáxia.',
    behavior:
      'Suas plataformas flutuam em altitudes altas de atmosferas turbulentas, operando como laboratórios livres onde capitães de qualquer raça trocam registros de sensores e amostras energéticas. São diplomatas afáveis, curiosos por relatos de fronteira, mas intransigentes quando alguém tenta monopolizar descobertas ou aprisionar fauna etérica.',
    code:
      'Toda nave visitante que doa medições precisas de estrelas ou tempestades magnéticas ganha crédito imediato junto ao Fórum. Ocultar dados de perigo espacial de outras tripulações é considerado uma falha ética grave contra a comunidade luminar.',
  },

  // ── PULSARI (Espectroid) ──────────────────────────────────────────────────
  fac_pulsari_1: {
    mindset:
      'Nascidos da fúria rítmica de estrelas mortas e zonas irradiadas, os comandantes da Frente Radiante Pulsari associam estabilidade à fraqueza e intensidade à grandeza. Para eles, só merece governar um setor quem suporta o calor de sóis azuis e a pressão de tempestades de radiação sem recuar para abrigos mornos.',
    behavior:
      'Conduzem naves carregadas de emissores de plasma e escudos de alta frequência com disciplina severa. Não toleram turistas desarmados nem curiosos sem autorização em áreas tensas; testam a resistência e o sangue-frio de recém-chegados antes de oferecer contratos militares ou abrir acesso a zonas ricas em energia pura.',
    code:
      'O respeito na Frente se conquista aguentando firme em ambientes que derreteriam cascos comuns. Recuar de um compromisso por causa de radiação ou falhar em uma prova de resistência encerra na hora qualquer chance de aliança com seus oficiais.',
  },
  fac_pulsari_2: {
    mindset:
      'O Sindicato de Plasma de Vela enxerga a energia pura como a única moeda honesta do universo: créditos impressos mudam de dono, mas megawatts acumulados movem frotas inteiras. Práticos e calculistas, avaliam sistemas solares pelo potencial de fusão, reservas de hélio e densidade térmica de suas estrelas.',
    behavior:
      'Operam grandes estações coletoras e postos de reabastecimento rápidos ao longo de rotas de alta demanda. Negociam com frieza profissional, impondo taxas pesadas sobre combustíveis fósseis primitivos enquanto oferecem tarifas atraentes para cargas de isótopos, plasma condensado e peças de reator.',
    code:
      'Toda transação é medida pela eficiência energética do transporte e pela limpeza do reator da nave atracada. Navegadores que desperdiçam carga ou causam vazamentos em doca pagam multas pesadas antes de receber permissão para saltar.',
  },

  // ── UMBRAIS FOTÔNICOS (Espectroid) ────────────────────────────────────────
  fac_umbrais_fotonicos_1: {
    mindset:
      'O Observatório Umbral Silente dedica sua existência ao estudo contemplativo de buracos negros, fendas dimensionais e nebulosas escuras. Suas mentes funcionam em cadência lenta e reservada, convencidas de que o verdadeiro segredo da realidade mora onde a luz comum não ousa voltar.',
    behavior:
      'Permanecem ocultos na borda de horizontes de eventos, operando sensores profundos quase indetectáveis. Raramente interferem em disputas mundanas entre impérios vizinhos, mas interceptam sem hesitar qualquer expedicionário imprudente que tente explorar singularidades sagradas sem confiança previamente conquistada.',
    code:
      'Aproxime-se em silêncio, com armas recolhidas e paciência absoluta. O Observatório nunca aceita subornos fáceis: apenas quem comprova rigor científico e discrição ao longo do tempo recebe licença para descer em seus santuários escuros.',
  },
  fac_umbrais_fotonicos_2: {
    mindset:
      'O Círculo Espectral Reformado rompeu com o mutismo tradicional dos umbrais porque entendeu que anomalias espaciais crescentes ameaçam todos os povos igualmente. Acreditam que o conhecimento das fendas deve ser compartilhado em expedições mistas antes que setores inteiros sejam engolidos por instabilidades.',
    behavior:
      'Recrutam batedores, exploradores e pilotos ousados de fora de sua espécie para mapear nebulosas periféricas e coletar matéria-fantasma com segurança. São anfitriões enigmáticos porém cooperativos, sempre atentos a instrumentos de medição precisos e relatos detalhados de fenômenos raros.',
    code:
      'Proíbem estritamente o disparo de munição cinética dentro de suas estações etéricas, temendo rupturas em campos de contenção sensíveis. Quem colabora com análises reais de anomalias encontra aliados fiéis e acesso a tecnologias espectrais avançadas.',
  },

  // ── FERRONITAS (Metalocto) ────────────────────────────────────────────────
  fac_ferronitas_1: {
    mindset:
      'Para a Guilda dos Fundidores Ferronitas, cada objeto — de um parafuso de antepara a um encouraçado estelar — carrega a honra de quem o forjou. Desprezam soluções improvisadas e gambiarras descartáveis; para um ferronita, construir algo que dure séculos é a forma mais alta de sabedoria moral.',
    behavior:
      'Seus estaleiros e forjas funcionam com precisão metódica, inspecionando a integridade estrutural de cada nave antes mesmo de abrir o canal de comércio. Valorizam contratos sólidos, pagam justo por minérios brutos de qualidade e gostam de negociar com capitães que mantêm o próprio casco reparado e limpo.',
    code:
      'Cumprir um prazo de entrega de carga pesada vale mais que mil juramentos diplomáticos. Se um comandante entrega exatamente o combinado sem tentar enganar na pureza do minério, a Guilda grava seu código de nave em aço permanente e abre crédito preferencial.',
  },
  fac_ferronitas_2: {
    mindset:
      'Os Mestres da Bigorna Eterna tratam o calor vulcânico e a pressão tectônica como altares vivos da criação metálica. Acreditam que ligas temperadas perto do magma carregam memória e resistência que nenhuma fundição orbital fria consegue imitar, vendo a si mesmos como guardiões de uma arte ancestral sagrada.',
    behavior:
      'Trabalham em mundos extremos com paciência inabalável, aceitando poucos aprendizes de fora e julgando visitantes pelo respeito demonstrado às suas oficinas. Quando precisam de recursos raros, contratam apenas navegadores testados que compreendam o risco de pousar em crostas instáveis.',
    code:
      'Descartar sucata metálica ou resíduos industriais na órbita de um mundo forja é considerado sacrilégio grave. Todo metal morto deve retornar aos cadinhos para renascer em nova forma útil.',
  },

  // ── TITÂNIOS DE FORJA (Metalocto) ─────────────────────────────────────────
  fac_titanios_forja_1: {
    mindset:
      'A Legião de Aço Metalocto enxerga o universo através da lógica implacável da blindagem contra o impacto: o que não resiste ao fogo pesado não merece ocupar um setor estratégico. Frios, metódicos e orgulhosos da própria engenharia bélica, encaram a guerra como uma verificação prática de superioridade técnica.',
    behavior:
      'Patrulham suas rotas em esquadrões blindados e avaliam imediatamente as defesas de qualquer nave que se aproxima. Embarcações sem escudo adequado recebem alertas secos logo na entrada do sistema, enquanto comandantes bem armados são tratados com deferência militar e convidados a contratos de combate.',
    code:
      'Nunca interrompa uma simulação tática da Legião e jamais entre em formação de combate sem transmitir código amigo. A força é respeitada até em adversários, desde que lutem de frente e sem trapaças covardes.',
  },
  fac_titanios_forja_2: {
    mindset:
      'As Forjas Expansionistas de Ferro veem cada cinturão rico em titânio e platina como combustível natural para sua marcha industrial pela galáxia. Ambiciosas e inquietas, acreditam que estagnação equivale à ferrugem e que novas docas devem surgir sempre um salto adiante da fronteira atual.',
    behavior:
      'Mobilizam frotas inteiras de mineração escoltadas para reivindicar sistemas promissores e erguer estaleiros em tempo recorde. Compram metais estruturais sem cessar e pagam excelente ágio por ligas raras, mas costumam pressionar vizinhos lentos a ceder direitos minerais.',
    code:
      'Eficiência produtiva define a posição de qualquer parceiro aos olhos das Forjas. Quem mantém um fluxo constante de ligas e projetos tecnológicos recebe encomendas gigantescas; quem atrasa fornecimentos críticos perde a licença de operação sem aviso duplo.',
  },

  // ── CROMÁLITAS (Metalocto) ────────────────────────────────────────────────
  fac_cromalitas_1: {
    mindset:
      'A Sentinela Espelhada Cromálita cultiva um ideal austero de pureza, simetria e vigilância perpétua. Seus sentinelas acreditam que o caos nasce de fronteiras mal guardadas e que apenas protocolos rigorosos mantêm intactos os tesouros minerais e mundos artificiais herdados do passado.',
    behavior:
      'Mantêm postos silenciosos e impecáveis ao redor de planetas protegidos, exigindo identificação completa antes de permitir qualquer manobra orbital. Em combate, confiam em escudos refletores espelhados para devolver a agressão do oponente e raramente perseguem quem se retira imediatamente após um aviso.',
    code:
      'Antes de selar qualquer tratado importante, exigem o polimento cerimonial do casco como prova de disciplina e ordem. Entrar sem código ou tocar depósitos selados sem licença desperta resposta armada imediata.',
  },
  fac_cromalitas_2: {
    mindset:
      'O Enclave Prateado de Refração vê a luz, o laser e o cristal ótico como expressões matemáticas da perfeição física. Menos rígidos que a Sentinela, seus pensadores combinam rigor geométrico com genuína fascinação científica por lentes, reflexos e sistemas de precisão.',
    behavior:
      'Operam redes de satélites refletores e laboratórios espelhados onde testam feixes avançados e escudos óticos. Negociam de maneira educada, porém exigente, preferindo parceiros com sensibilidade técnica e aversão a danos colaterais em órbita.',
    code:
      'Danificar ou ofuscar um satélite refletor em manobra descuidada acarreta multas severas e bloqueio temporário de doca. Em contrapartida, doadores de cristais puros e vidro estelar recebem acesso privilegiado às oficinas do Enclave.',
  },

  // ── SYLVARIS (Plantídeo) ──────────────────────────────────────────────────
  fac_sylvaris_1: {
    mindset:
      'A Aliança Verde de Sylvaris pensa na escala das grandes florestas: nenhum galho floresce sozinho quando a raiz inteira adoece. Seus anciãos enxergam planetas vivos como organismos conscientes em ritmo lento e tratam o equilíbrio ecológico como lei superior a qualquer tratado comercial passageiro.',
    behavior:
      'Recebem visitantes com calma orgânica, trocando sementes nativas como gesto de confiança mútua. Preferem resolver disputas por mediação paciente e sanções ecológicas, mas mobilizam frotas inteiras quando detectam exploração predatória de fauna ou queimadas industriais em mundos verdes.',
    code:
      'Caçar espécies nativas sem registro científico ou degradar ecossistemas frágeis derruba a reputação com a Aliança de forma quase irreversível. Protetores da vida e pesquisadores respeitosos ganham acesso às terapias biológicas mais raras do setor.',
  },
  fac_sylvaris_2: {
    mindset:
      'Os Jardins Mercantis do Dossel acreditam que preservar a natureza e prosperar pelo comércio não são caminhos opostos, mas duas faces da mesma colheita sustentável. Orgulham-se de transformar compostos raros, especiarias e biociência limpa em pontes de amizade entre todas as formas de vida.',
    behavior:
      'Organizam feiras orbitais coloridas, repletas de estufas suspensas e mercadores hospitaleiros vindos de dezenas de sistemas. Negociam com entusiasmo e flexibilidade, exigindo apenas protocolos sanitários rígidos para evitar que pragas e parasitas destruam suas coleções botânicas.',
    code:
      'Toda carga biológica passa por quarentena obrigatória antes de tocar os anéis comerciais. Cumprida a verificação, o capitão é recebido como convidado de honra e pode negociar sementes exóticas, fármacos e coletores de alta precisão.',
  },

  // ── ESPINHÕES DE VEX (Plantídeo) ──────────────────────────────────────────
  fac_espinhoes_vex_1: {
    mindset:
      'A Horda Esporal de Vex interpreta a natureza sem sentimentalismo: na selva cósmica, a espécie que não espalha suas raízes acaba sufocada sob a sombra de outra. Diretos, territoriais e implacáveis, seus líderes veem conflitos armados como poda necessária para abrir espaço ao crescimento forte.',
    behavior:
      'Marcam fronteiras disputadas com nuvens densas de esporos corrosivos e interceptam invasores sem diplomacia branda. Apesar da ferocidade, respeitam aliados que sobrevivem a zonas hostis e pagam alto por toxinas potentes e componentes de guerra biológica.',
    code:
      'Qualquer sinal de poluição industrial ou incêndio orbital em mundos vegetais provoca retaliação imediata da Horda. Apenas quem prova utilidade tática ou força em campo ganha salvo-conduto entre seus sistemas.',
  },
  fac_espinhoes_vex_2: {
    mindset:
      'Os Semeadores da Fronteira Viva olham para rochas cinzentas e mundos mortos com uma ambição quase obsessiva de despertá-los pela força biológica. Para eles, deixar um planeta estéril intacto por prudência burocrática é covardia diante do potencial da vida em expansão.',
    behavior:
      'Lançam cápsulas de bio-terraformação, enzimas agressivas e florestas pioneiras em mundos de fronteira antes mesmo de pedir permissão às potências vizinhas. Trabalham em ritmo febril, contratando qualquer piloto disposto a transportar compostos orgânicos e biomassa viva para frentes recém-semeadas.',
    code:
      'Quem fornece matéria orgânica e protege colônias recém-brotadas é acolhido como semeador irmão. Tentar conter ou esterilizar um projeto de germinação em curso transforma você em alvo declarado.',
  },

  // ── LÓTUS SILENCIOSOS (Plantídeo) ─────────────────────────────────────────
  fac_lotus_silenciosos_1: {
    mindset:
      'O Mosteiro do Lótus Imóvel rejeita a pressa ruidosa dos impérios e busca compreender a quietude profunda que une estrelas, raízes e consciência. Seus monges vegetais acreditam que palavras apressadas distorcem a intenção e que apenas quem suporta o silêncio revela quem realmente é.',
    behavior:
      'Antes de iniciar qualquer conversa oficial nos portos monásticos, impõem longos minutos de contemplação silenciosa sem sinais de rádio. Restringem severamente o pouso em suas sedes sagradas, abrindo suas portas somente para navegadores de reputação elevada ou portadores de licença diplomática.',
    code:
      'Interromper o silêncio cerimonial ou forçar pouso sem honra prévia fecha imediatamente as escotilhas do Mosteiro. Aqueles que respeitam o ritmo contemplativo recebem antídotos raros e sabedoria botânica impossível de comprar em feiras comuns.',
  },
  fac_lotus_silenciosos_2: {
    mindset:
      'O Círculo Simbiótico de Raiz acredita que cada espécie rara carrega uma resposta evolutiva que não pode ser perdida no esquecimento. Atuam como guardiões pacientes de biomas úmidos e santuários naturais, preferindo a observação cuidadosa e a cura simbiótica à conquista territorial.',
    behavior:
      'Colaboram discretamente com exploradores éticos, financiando levantamentos de fauna em mundos perigosos para catalogar criaturas únicas sem feri-las. São gentis no trato, mas implacáveis no corte de relações caso descubram abate predatório ou comércio ilegal de espécimes.',
    code:
      'Amostras obtidas por escaneamento limpo rendem recompensas generosas e profunda gratidão do Círculo. Ferir gratuitamente criaturas raras sob sua proteção anula contratos na hora.',
  },

  // ── LITÓIDES DE BASALTO (Grutoide) ────────────────────────────────────────
  fac_litoides_basalto_1: {
    mindset:
      'O Clã Escavador de Basalto raciocina com o peso firme das camadas geológicas: promessas leves voam com o vento solar, mas o trabalho bem escavado permanece de pé por eras. Valorizam consistência, resistência à pressão e contratos escritos como rocha que não se parte no meio.',
    behavior:
      'Recebem parceiros comerciais oferecendo pequenas amostras minerais polidas em vez de discursos vazios. Suas operações dependem de brocas pesadas e comboios confiáveis que nunca temem cavernas fundas ou gravidade elevada, pagando honestamente e exigindo a mesma firmeza em retorno.',
    code:
      'Um contrato selado com o Clã é irrevogável até sua conclusão ou ressarcimento integral. Tentar renegociar termos depois que as brocas já desceram ao subsolo destrói sua credibilidade para sempre.',
  },
  fac_litoides_basalto_2: {
    mindset:
      'A Câmara Profunda Litóide desconfia da superfície exposta dos planetas e encontra segurança genuína apenas sob quilômetros de rocha sólida e calor geotérmico estável. Seus conselheiros enxergam o tempo de maneira lenta e conservadora, preservando galerias milenares contra qualquer modernização apressada.',
    behavior:
      'Realizam encontros diplomáticos em grandes cavernas iluminadas por cristais térmicos, longe da luz direta das estrelas. São cautelosos com estrangeiros, avessos a mudanças bruscas e extremamente protetores de mundos primitivos que vivem em equilíbrio subterrâneo.',
    code:
      'Detonar explosivos de mineração perto de galerias habitadas é crime capital sob a lei da Câmara. Visitantes que usam perfuração de precisão e respeitam o silêncio da rocha ganham confiança sólida e duradoura.',
  },

  // ── DRAKÓLITOS (Grutoide) ─────────────────────────────────────────────────
  fac_drakolitos_1: {
    mindset:
      'O Clã Vulcânico Drakólito cultua a energia bruta das placas tectônicas e acredita que apenas a prova do fogo revela o verdadeiro caráter de um comandante. Impulsivos, orgulhosos e destemidos, respeitam somente quem encara o perigo de frente e desprezam negociações acovardadas.',
    behavior:
      'Ocupam mundos escaldantes e cinturões ricos perto de rios de lava, desafiando forasteiros a demonstrar coragem antes de qualquer acordo sério. Suas naves são armadas para o impacto brutal a curta e média distância, mantendo uma postura agressiva contra rivais que ousem disputar seus minérios.',
    code:
      'Não há lugar para meias-palavras no Clã Vulcânico: honre seus desafios, vença seus combates e entregue o que prometeu sob pressão extrema. Quem recua na hora decisiva perde todo respeito de seus chefes.',
  },
  fac_drakolitos_2: {
    mindset:
      'O Sindicato Tectônico de Magma canalizou a ambição drakólita para o domínio implacável dos minérios preciosos escondidos em núcleos planetários instáveis. Pragmáticos e oportunistas, acreditam que cada erupção e campo de meteoros pertence a quem tiver equipamento e ousadia para cercá-lo primeiro.',
    behavior:
      'Promovem leilões disputados de ouro, platina e diamantes brutos, enquanto cobram pedágios salgados de naves independentes que cruzam seus cinturões mais lucrativos. Toleram quase qualquer aliado capaz de gerar lucro ou proteger rotas minerais de alto risco.',
    code:
      'Pagar o pedágio de rota ou firmar sociedade em campo garante passagem livre e preços quentes nos leilões. Extrair sem licença em zona demarcada pelo Sindicato significa confisco imediato de carga.',
  },

  // ── QUARTZOS DE THUL (Grutoide) ───────────────────────────────────────────
  fac_quartzos_thul_1: {
    mindset:
      'O Arquivo Cristalino de Thul preserva cada acontecimento histórico gravado diretamente na estrutura molecular de matrizes de quartzo puro. Para esses guardiões reservados, esquecer o passado é condenar a galáxia a repetir seus piores erros, e cada intruso sem mérito representa risco de perda irreparável.',
    behavior:
      'Mantêm santuários subterrâneos fechados à maioria dos viajantes, liberando entrada apenas para pesquisadores honrados ou emissários com alta reputação. Falam de maneira precisa e formal, registrando cada frase de uma negociação como documento histórico permanente.',
    code:
      'Alterar registros ou ocultar fatos em um relato entregue ao Arquivo é imperdoável. A verdade verificada, mesmo quando incômoda, abre as câmaras de cristal e o acesso a tecnologias óticas raras.',
  },
  fac_quartzos_thul_2: {
    mindset:
      'Os Prismáticos Reformistas acreditam que a memória cristalina só cumpre seu propósito quando ilumina novos caminhos para todos os povos exploradores. Mais abertos e inquietos que o Arquivo, enxergam cada caverna desconhecida e anomalia como peça faltante de um grande mapa comum.',
    behavior:
      'Compartilham mapas subterrâneos e notas de campo com navegadores curiosos em troca de leituras frescas de sistemas distantes. Protegem formações naturais raras contra destruição industrial, mas incentivam expedições bem equipadas com escavadores arqueológicos e escudos refratores.',
    code:
      'Danificar formações cristalinas únicas durante uma escavação suspende imediatamente o apoio dos Prismáticos. Exploradores cuidadosos que trazem descobertas autênticas são tratados como colegas de expedição.',
  },

  // ── VESPÍDEOS DE MEL (Insectoide) ──────────────────────────────────────────
  fac_vespideos_mel_1: {
    mindset:
      'A Colmeia Dourada Vespídea pensa como um organismo logístico perfeito: cada nave é uma operária e cada rota bem sincronizada multiplica a prosperidade de todo o enxame. Generosos com parceiros produtivos, enxergam a cooperação comercial como a forma mais inteligente de sobrevivência coletiva.',
    behavior:
      'Comunicam oportunidades vantajosas de mercado por sinais luminosos coordenados ao redor de suas estações movimentadas. Adoram volumes cheios de suprimentos, enzimas e combustíveis orgânicos, oferecendo descontos imediatos a quem entrega carregamentos completos sem atraso.',
    code:
      'Desperdício de espaço de carga ou atraso recorrente em entregas coletivas quebram o ritmo da Colmeia. Comandantes eficientes tornam-se favoritos instantâneos e recebem rotas exclusivas com margem garantida.',
  },
  fac_vespideos_mel_2: {
    mindset:
      'A Federação do Néctar Estelar estendeu o espírito solidário das colmeias para uma aliança ampla entre múltiplos enxames e sistemas vizinhos. Seus estrategistas acreditam que comboios protegidos em rede superam qualquer predador solitário que tente saquear fronteiras distantes.',
    behavior:
      'Coordenam escoltas mútuas, estações de reabastecimento rápido e rebocadores pesados que resgatam naves avariadas pelo caminho. Mantêm uma diplomacia calorosa e prática, sempre buscando integrar sistemas isolados em sua malha de suporte e comércio contínuo.',
    code:
      'Responder a um pedido de socorro de comboio da Federação constrói laços quase inquebráveis com todo o bloco. Recusar ajuda a uma nave de suprimentos em perigo marca seu histórico com desconfiança duradoura.',
  },

  // ── KRIKKARI (Insectoide) ─────────────────────────────────────────────────
  fac_krikkari_1: {
    mindset:
      'O Enxame Corsário Krikkari vive pela velocidade do ataque e pela certeza de que fronteiras frouxas pertencem ao enxame mais ágil. Não respeitam papéis assinados em capitais distantes; para seus líderes de bando, só o domínio real do espaço e a coragem no assalto legitimam posse.',
    behavior:
      'Voam em interceptadores ligeiros armados com mísseis enxame, atacando comboios sem escolta ou licenças vencidas antes que reforços consigam responder. Dividem o saque pelo mérito em batalha e respeitam capitães que lutam ferozmente ou pagam tributo sem choramingar.',
    code:
      'Hesitar diante de uma abordagem corsária é convite para ser pilhado até o último parafuso. Quem demonstra ferocidade ou utilidade direta como caçador pode até conquistar respeito sombrio junto ao Enxame.',
  },
  fac_krikkari_2: {
    mindset:
      'Os Clãs Nômades de Areia rejeitam cidades fixas e acreditam que quem se prende a um só planeta vira presa fácil para impostos e guerras alheias. Adaptáveis, astutos e desapegados de bandeiras, medem a liberdade pela autonomia do próprio tanque de combustível.',
    behavior:
      'Montam feiras temporárias nas órbitas de cometas e mundos áridos, trocando peças usadas, gás natural e achados de fronteira sem fazer perguntas indiscretas sobre a origem da carga. Desaparecem tão rápido quanto surgem se alguma armada imperial se aproxima demais.',
    code:
      'Nunca entregue a posição de uma feira nômade às autoridades centrais e não faça perguntas sobre vendedores mascarados. Em troca, encontrará suprimentos vitais onde nenhum mapa oficial indica porto algum.',
  },

  // ── MANTIS DE SOMBRA (Insectoide) ──────────────────────────────────────────
  fac_mantis_sombra_1: {
    mindset:
      'A Ordem Oculta da Mantis cultiva a paciência do predador imóvel: observa por horas, analisa cada brecha e age uma única vez com precisão letal. Desconfia profundamente de qualquer expansão barulhenta e trata seus mundos sombrios como reservas invioláveis de silêncio e veneno.',
    behavior:
      'Quase nunca emitem advertências prévias em rádio aberto; seus caças camuflados acompanham invasores na escuridão e atacam no exato instante em que ultrapassam limites proibidos. Negociam apenas com quem conquistou confiança através de serviços silenciosos e discrição extrema.',
    code:
      'Entrar em sistemas da Ordem com sensores varrendo ativamente o escuro é interpretado como ato de guerra. Quem respeita seus limites invisíveis e entrega toxinas ou minerais sombrios sem alarde ganha salvo-conduto raro.',
  },
  fac_mantis_sombra_2: {
    mindset:
      'Os Caçadores de Eclipse transformaram o instinto furtivo da espécie em uma profissão fria e precisa: eliminar ameaças selecionadas sem deixar rastro ou testemunha. Não guardam ódio pessoal contra seus alvos; tratam cada contrato de caça como equação limpa de ângulo, veneno e momento exato.',
    behavior:
      'Aceitam missões confidenciais de eliminação e escolta oculta em cantos mal iluminados das estações. Suas naves priorizam furtividade, ataque fulminante e retirada instantânea, mantendo sigilo absoluto sobre quem contratou o golpe.',
    code:
      'Quebrar o sigilo de um contratante ou trair um alvo combinado em conjunto atrai a marca da caçada eterna sobre o traidor. Profissionalismo frio e silêncio garantem acesso ao melhor equipamento furtivo do setor.',
  },

  // ── VAELORIANOS (Anfíbio) ─────────────────────────────────────────────────
  fac_vaelorianos_1: {
    mindset:
      'A Talassocracia de Vaelor enxerga os oceanos interplanetários como estradas naturais de diplomacia e abundância. Refinados, sociáveis e pragmáticos, seus estadistas acreditam que portos abertos e água limpa circulando entre mundos mantêm impérios muito mais estáveis do que frotas de guerra.',
    behavior:
      'Recebem visitantes pacíficos com transmissões musicais hidroacústicas e docas amplas sempre prontas para abastecer mantimentos, água e bombas líquidas. Sabem negociar com elegância firme, usando pactos comerciais marinhos para isolar rapidamente qualquer potência que perturbe a navegação livre.',
    code:
      'Poluir mares ou bloquear rotas de água potável para colônias vizinhas é crime gravíssimo na Talassocracia. Navegadores pacíficos e bons negociadores sempre encontram portos acolhedores e crédito fácil.',
  },
  fac_vaelorianos_2: {
    mindset:
      'A Assembleia Coralina Reformista vê os mares vivos da galáxia como berços frágeis de inteligência que exigem voz política e proteção científica. Idealistas sem ingenuidade, seus delegados buscam reformar tratados antigos para colocar a saúde dos oceanos acima do lucro imediato.',
    behavior:
      'Mantêm estações de pesquisa submersas, frotas de drones ambientais e mesas abertas para diálogo cultural com outras formas de vida. Apoiam fortemente expedições de catalogação marinha e cobram caro em sanções diplomáticas de quem despeja resíduos tóxicos em mundos aquáticos.',
    code:
      'O descarte de contaminantes em qualquer planeta oceânico acarreta expulsão imediata e perda severa de reputação. Cientistas e defensores de biomas líquidos recebem acolhida calorosa e acesso a tecnologia de exploração profunda.',
  },

  // ── NAUTILÍDEOS DE MAEL (Anfíbio) ─────────────────────────────────────────
  fac_nautilideos_mael_1: {
    mindset:
      'A Armada Abissal de Mael acredita que a pressão esmagadora das fossas subglaciais molda comandantes superiores aos que cresceram sob sóis confortáveis. Disciplinados, duros e orgulhosos, encaram as rotas geladas como domínio natural de quem aguenta o frio absoluto sem quebrar o casco.',
    behavior:
      'Operam frotas pressurizadas e armadas com torpedos criogênicos, impondo tributos ou licenças rígidas a quem cruza corredores congelados sob sua bandeira. Valorizam força naval comprovada e exoesqueletos resistentes, tratando com frieza desdenhosa naves frágeis que não aguentam condições extremas.',
    code:
      'Tentar furar bloqueio glacial sem licença paga ou permissão de almirante convida torpedo direto sem segunda chamada. Quem paga seu tributo direito e combate bem ao lado da Armada ganha respeito marcial imediato.',
  },
  fac_nautilideos_mael_2: {
    mindset:
      'Os Navegadores da Corrente Fria transformaram a travessia perigosa de mares congelados e cinturões de gelo em uma irmandade solidária de comboios. Práticos e vigilantes, acreditam que no frio extremo ninguém sobrevive sozinho por muito tempo e que a escolta mútua é a verdadeira lei do mar.',
    behavior:
      'Guiam comboios mercantes por passagens traiçoeiras usando rotas térmicas e resfriadores de alta potência, oferecendo seguro cooperativo para aliados confiáveis. Negociam de forma franca e direta, valorizando hélio-3, gelo puro e tripulações que jamais abandonam o comboio sob ataque.',
    code:
      'Permanecer na formação até o último cargueiro atracar é o juramento básico das Correntes. Quem foge deixando parceiros para trás nunca mais recebe escolta nem cobertura de seguro.',
  },

  // ── ABISSAIS DE GLÁCIO (Anfíbio) ──────────────────────────────────────────
  fac_abissais_glacio_1: {
    mindset:
      'O Santuário Subglacial Profundo habita oceanos selados sob quilômetros de gelo milenar e acredita que a superfície iluminada do universo pertence a criaturas efêmeras demais para guardar segredos eternos. Reservados e solenes, protegem relíquias primordiais preservadas no gelo desde eras anteriores às facções modernas.',
    behavior:
      'Mantêm seus acessos subglaciais completamente bloqueados a desconhecidos, respondendo apenas a emissários de reputação comprovada e intenção respeitosa. Raras vezes saem de seus mundos frios, preferindo enviar sondas silenciosas para vigiar fronteiras e afastar saqueadores de relíquias.',
    code:
      'Perfurar camadas sagradas de gelo sem licença ou tentar extrair artefatos primordiais às escondidas desperta hostilidade implacável. Somente a paciência e o respeito prolongado abrem as comportas do Santuário.',
  },
  fac_abissais_glacio_2: {
    mindset:
      'Os Sondadores de Glácio romperam o isolamento glacial por curiosidade genuína sobre o que dorme tanto nas profundezas abissais quanto além das estrelas. Cientistas audaciosos em ambientes congelantes, veem cada caverna submersa e ruína antiga como um elo vivo entre oceanos separados por anos-luz.',
    behavior:
      'Organizam expedições conjuntas com exploradores estrangeiros, equipando naves visitantes com sondas abissais, resfriadores e escavadores arqueológicos. Pagam generosamente pela catalogação de criaturas das profundezas e pelo resgate limpo de relíquias históricas.',
    code:
      'Esconder descobertas arqueológicas feitas em expedição conjunta rompe a confiança dos Sondadores. Colaboradores honestos recebem mapas de cavernas secretas e equipamentos de ponta para ambientes extremos.',
  },
};
