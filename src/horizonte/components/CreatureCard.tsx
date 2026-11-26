import React, { useEffect, useState } from 'react';
import type { LifeFormId } from '../types/game';
import { CreaturePortraitSvg, SpeciesPortraitSvg } from './SpeciesPortraits';

export const SPECIES_PORTRAIT_IMAGES: Record<string, string> = {
  solarianos: '/src/assets/images/species_solarianos_1795645302650.jpg',
  valdris: '/src/assets/images/species_valdris_1795645305038.jpg',
  nyxianos: '/src/assets/images/species_nyxianos_1795645305046.jpg',
  luminares_eter: '/src/assets/images/species_luminares_eter_1795645304092.jpg',
  pulsari: '/src/assets/images/species_pulsari_1795646200453.jpg',
  umbrais_fotonicos: '/src/assets/images/species_umbrais_fotonicos_1795645305932.jpg',
  ferronitas: '/src/assets/images/species_ferronitas_1795645307578.jpg',
  titanios_forja: '/src/assets/images/species_titanios_forja_1795645307226.jpg',
  cromalitas: '/src/assets/images/species_cromalitas_1795645309995.jpg',
  sylvaris: '/src/assets/images/species_sylvaris_1795646200782.jpg',
  espinhoes_vex: '/src/assets/images/species_espinhoes_vex_1795645309051.jpg',
  lotus_silenciosos: '/src/assets/images/species_lotus_silenciosos_1795645436587.jpg',
  litoides_basalto: '/src/assets/images/species_litoides_basalto_1795645311300.jpg',
  drakolitos: '/src/assets/images/species_drakolitos_1795646202005.jpg',
  quartzos_thul: '/src/assets/images/species_quartzos_thul_1795645438528.jpg',
  vespideos_mel: '/src/assets/images/species_vespideos_mel_1795645312239.jpg',
  krikkari: '/src/assets/images/species_krikkari_1795645438460.jpg',
  mantis_sombra: '/src/assets/images/species_mantis_sombra_1795645386672.jpg',
  vaelorianos: '/src/assets/images/species_vaelorianos_1795645439953.jpg',
  nautilideos_mael: '/src/assets/images/species_nautilideos_mael_1795645440794.jpg',
  abissais_glacio: '/src/assets/images/species_abissais_glacio_1795645440240.jpg',
};

export const SpeciesIllustration: React.FC<{
  speciesId: string;
  name: string;
}> = ({ speciesId, name }) => {
  const imageUrl = SPECIES_PORTRAIT_IMAGES[speciesId];
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [speciesId]);

  if (!imageUrl || imgFailed) {
    return <SpeciesPortraitSvg speciesId={speciesId} name={name} />;
  }

  return (
    <img
      src={imageUrl}
      alt={`Retrato da espécie ${name}`}
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
  sizeClass?: string;
  allowAiGeneration?: boolean;
}

export const CreatureCard: React.FC<CreatureCardProps> = ({
  cardId,
  kind,
  name,
  lifeFormId,
  sizeClass = 'w-24 h-24',
}) => {
  const speciesId = cardId.replace(/^species_/, '');

  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-slate-700/70 bg-black shrink-0 ${sizeClass}`}
    >
      {kind === 'species' ? (
        <SpeciesIllustration speciesId={speciesId} name={name} />
      ) : (
        <CreaturePortraitSvg cardId={cardId} lifeFormId={lifeFormId} name={name} />
      )}
    </div>
  );
};
