// Mock prediction labels (28 Philippine species)
const SPECIES_LABELS = [
  { name: "Asian Vine Snake", scientific: "Ahaetulla prasina preocularis" },
  { name: "Philippine Blunt-headed Tree Snake", scientific: "Boiga angulata" },
  { name: "Dog-toothed Cat Snake", scientific: "Boiga cynodon" },
  { name: "Paradise Flying Tree Snake", scientific: "Chrysopelea paradisi variabilis" },
  { name: "Common Bronze-backed Snake", scientific: "Dendrelaphis pictus" },
  { name: "Philippine Whipsnake", scientific: "Dryophiops philippina" },
  { name: "Grey Tailed Brown Rat Snake", scientific: "Coelognathus erythrurus psephenourus" },
  { name: "Red-tailed Rat Snake", scientific: "Gonyosoma oxycephalum" },
  { name: "Common Wolf Snake", scientific: "Lycodon capucinus" },
  { name: "Smooth-scaled Mountain Rat Snake", scientific: "Ptyas luzonensis" },
  { name: "Gervais' Worm Snake", scientific: "Calamaria gervaisi iridescens" },
  { name: "Northern Triangle-spotted Snake", scientific: "Cyclocorus lineatus alcalai" },
  { name: "Non-banded Philippine Burrowing Snake", scientific: "Oxyrhabdium modestum" },
  { name: "Negros Light-scaled Burrowing Snake", scientific: "Pseudorabdion oxycephalum" },
  { name: "Dog-faced Water Snake", scientific: "Cerberus schneiderii" },
  { name: "Negros Spotted Water Snake", scientific: "Tropidonophis negrosensis" },
  { name: "Boie's Keelback Snake", scientific: "Rhabdophis spilogaster" },
  { name: "Yellow-lipped Sea Krait", scientific: "Laticauda colubrina" },
  { name: "Double-barred Coral Snake", scientific: "Hemibungarus gemianulis" },
  { name: "Common Mock Viper", scientific: "Psammodynastes pulverulentus" },
  { name: "North Philippine Temple Pit Viper", scientific: "Tropidolaemus subannulatus" },
  { name: "Pit Viper", scientific: "Trimeresurus flavomaculatus" },
  { name: "Barred Coral Snake", scientific: "Hemibungarus calligaster" },
  { name: "King Cobra", scientific: "Ophiophagus hannah" },
  { name: "Samar Cobra", scientific: "Naja Samarensis" },
  { name: "Reticulated Python", scientific: "Malayopython reticulatus" },
  { name: "Small Wart Snake", scientific: "Acrochordus granulatus" },
  { name: "Brahminy Blind Snake", scientific: "Indotyphlops braminus" },
  { name: "Cuming's Blind Snake", scientific: "Ramphotyphlops cumingii" }
];

export interface PredictionResult {
  speciesName: string;
  scientificName: string;
  confidence: number;
  description: string;
}

export const getMockPrediction = (): PredictionResult => {
  const randomIndex = Math.floor(Math.random() * SPECIES_LABELS.length);
  const species = SPECIES_LABELS[randomIndex];
  const confidence = Math.round((0.7 + Math.random() * 0.29) * 100) / 100;
  
  return {
    speciesName: species.name,
    scientificName: species.scientific,
    confidence,
    description: `A Philippine snake species commonly found in the archipelago.`
  };
};
