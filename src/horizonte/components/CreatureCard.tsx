import React, { useEffect, useState } from 'react';
import type { CharacterGender, LifeFormId } from '../types/game';
import { CreaturePortraitSvg, SpeciesPortraitSvg } from './SpeciesPortraits';

export const SPECIES_PORTRAIT_IMAGES: Record<string, { M: string; F: string }> = {
  solarianos: {
    M: '/src/assets/images/species_solarianos_1795645302650.jpg',
    F: '/src/assets/images/species_solarianos_f_1795738918218.jpg',
  },
  valdris: {
    M: '/src/assets/images/species_valdris_m_1795738916624.jpg',
    F: '/src/assets/images/species_valdris_f_1795738916782.jpg',
  },
  nyxianos: {
    M: '/src/assets/images/species_nyxianos_1795645305046.jpg',
    F: '/src/assets/images/species_nyxianos_f_1795738918583.jpg',
  },
  luminares_eter: {
    M: '/src/assets/images/species_luminares_eter_m_1795738918696.jpg',
    F: '/src/assets/images/species_luminares_eter_1795645304092.jpg',
  },
  pulsari: {
    M: '/src/assets/images/species_pulsari_1795646200453.jpg',
    F: '/src/assets/images/species_pulsari_f_1795738919849.jpg',
  },
  umbrais_fotonicos: {
    M: '/src/assets/images/species_umbrais_fotonicos_m_1795738920174.jpg',
    F: '/src/assets/images/species_umbrais_fotonicos_1795645305932.jpg',
  },
  ferronitas: {
    M: '/src/assets/images/species_ferronitas_1795645307578.jpg',
    F: '/src/assets/images/species_ferronitas_f_1795738921164.jpg',
  },
  titanios_forja: {
    M: '/src/assets/images/species_titanios_forja_1795645307226.jpg',
    F: '/src/assets/images/species_titanios_forja_f_1795739014830.jpg',
  },
  cromalitas: {
    M: '/src/assets/images/species_cromalitas_1795645309995.jpg',
    F: '/src/assets/images/species_cromalitas_f_1795738921826.jpg',
  },
  sylvaris: {
    M: '/src/assets/images/species_sylvaris_m_1795739013578.jpg',
    F: '/src/assets/images/species_sylvaris_1795646200782.jpg',
  },
  espinhoes_vex: {
    M: '/src/assets/images/species_espinhoes_vex_1795645309051.jpg',
    F: '/src/assets/images/species_espinhoes_vex_f_1795739015111.jpg',
  },
  lotus_silenciosos: {
    M: '/src/assets/images/species_lotus_silenciosos_m_1795739013943.jpg',
    F: '/src/assets/images/species_lotus_silenciosos_1795645436587.jpg',
  },
  litoides_basalto: {
    M: '/src/assets/images/species_litoides_basalto_1795645311300.jpg',
    F: '/src/assets/images/species_litoides_basalto_f_1795738926419.jpg',
  },
  drakolitos: {
    M: '/src/assets/images/species_drakolitos_1795646202005.jpg',
    F: '/src/assets/images/species_drakolitos_f_1795738925735.jpg',
  },
  quartzos_thul: {
    M: '/src/assets/images/species_quartzos_thul_1795645438528.jpg',
    F: '/src/assets/images/species_quartzos_thul_f_1795738986878.jpg',
  },
  vespideos_mel: {
    M: '/src/assets/images/species_vespideos_mel_1795645312239.jpg',
    F: '/src/assets/images/species_vespideos_mel_f_1795739015530.jpg',
  },
  krikkari: {
    M: '/src/assets/images/species_krikkari_1795645438460.jpg',
    F: '/src/assets/images/species_krikkari_f_1795739046589.jpg',
  },
  mantis_sombra: {
    M: '/src/assets/images/species_mantis_sombra_1795645386672.jpg',
    F: '/src/assets/images/species_mantis_sombra_f_1795739046325.jpg',
  },
  vaelorianos: {
    M: '/src/assets/images/species_vaelorianos_1795645439953.jpg',
    F: '/src/assets/images/species_vaelorianos_f_1795738986941.jpg',
  },
  nautilideos_mael: {
    M: '/src/assets/images/species_nautilideos_mael_m_1795738986338.jpg',
    F: '/src/assets/images/species_nautilideos_mael_1795645440794.jpg',
  },
  abissais_glacio: {
    M: '/src/assets/images/species_abissais_glacio_1795645440240.jpg',
    F: '/src/assets/images/species_abissais_glacio_f_1795738986991.jpg',
  },
};

export const SpeciesIllustration: React.FC<{
  speciesId: string;
  name: string;
  gender?: CharacterGender;
}> = ({ speciesId, name, gender = 'M' }) => {
  const pair = SPECIES_PORTRAIT_IMAGES[speciesId];
  const imageUrl = pair ? pair[gender] ?? pair.M : undefined;
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [speciesId, gender]);

  if (!imageUrl || imgFailed) {
    return <SpeciesPortraitSvg speciesId={speciesId} name={name} />;
  }

  return (
    <img
      src={imageUrl}
      alt={`Retrato da espécie ${name} (${gender === 'F' ? 'Feminino' : 'Masculino'})`}
      referrerPolicy="no-referrer"
      onError={() => setImgFailed(true)}
      className="w-full h-full object-cover object-center block select-none"
      loading="lazy"
    />
  );
};

interface CreatureCardProps {
  cardId: string;
  kind: 'species' | 'creature';
  name: string;
  lifeFormId: LifeFormId;
  description: string;
  gender?: CharacterGender;
  sizeClass?: string;
  allowAiGeneration?: boolean;
}

export const CreatureCard: React.FC<CreatureCardProps> = ({
  cardId,
  kind,
  name,
  lifeFormId,
  gender = 'M',
  sizeClass = 'w-24 h-24',
}) => {
  const speciesId = cardId.replace(/^species_/, '');

  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-slate-700/70 bg-black shrink-0 ${sizeClass}`}
    >
      {kind === 'species' ? (
        <SpeciesIllustration speciesId={speciesId} name={name} gender={gender} />
      ) : (
        <CreaturePortraitSvg cardId={cardId} lifeFormId={lifeFormId} name={name} />
      )}
    </div>
  );
};
