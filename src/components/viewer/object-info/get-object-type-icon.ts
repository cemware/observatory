export function getObjectTypeIcon(objectTypes: string[]) {
  let fileName = 'unknown.svg';
  for (const i in objectTypes) {
    if (objectTypes[i] in iconNames) {
      fileName = iconNames[objectTypes[i]];
      break;
    }
  }
  return `/images/object-type/${fileName}`;
}

const iconNames: Record<string, string> = {
  // Stars
  'Pec?': 'star.svg',
  '**?': 'double_star.svg',
  '**': 'double_star.svg',
  'V*': 'variable_star.svg',
  'V*?': 'variable_star.svg',
  '*': 'star.svg',

  // Candidates
  'As?': 'group_of_stars.svg',
  'SC?': 'group_of_galaxies.svg',
  'Gr?': 'group_of_galaxies.svg',
  'C?G': 'group_of_galaxies.svg',
  'G?': 'galaxy.svg',

  // Multiple objects
  reg: 'region_defined_in_the_sky.svg',
  SCG: 'group_of_galaxies.svg',
  ClG: 'group_of_galaxies.svg',
  GrG: 'group_of_galaxies.svg',
  IG: 'interacting_galaxy.svg',
  PaG: 'pair_of_galaxies.svg',
  'C?*': 'open_galactic_cluster.svg',
  'Gl?': 'globular_cluster.svg',
  GlC: 'globular_cluster.svg',
  OpC: 'open_galactic_cluster.svg',
  'Cl*': 'open_galactic_cluster.svg',
  'As*': 'group_of_stars.svg',
  mul: 'multiple_objects.svg',

  // Interstellar matter
  'PN?': 'planetary_nebula.svg',
  PN: 'planetary_nebula.svg',
  SNR: 'planetary_nebula.svg',
  'SR?': 'planetary_nebula.svg',
  ISM: 'interstellar_matter.svg',

  // Galaxies
  PoG: 'part_of_galaxy.svg',
  QSO: 'quasar.svg',
  G: 'galaxy.svg',

  dso: 'deep_sky.svg',

  // Solar System
  Asa: 'artificial_satellite.svg',
  Moo: 'moon.svg',
  Sun: 'sun.svg',
  Pla: 'planet.svg',
  DPl: 'planet.svg',
  Com: 'comet.svg',
  MPl: 'minor_planet.svg',
  SSO: 'minor_planet.svg',

  Con: 'constellation.svg',
}