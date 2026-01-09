export interface SnakeSpecies {
  id: string;
  commonName: string;
  scientificName: string;
  imageUrl: string;
  habitat: string;
  behavior: string;
  venomInfo: string;
  description: string;
}

export const snakeSpecies: SnakeSpecies[] = [
  {
    id: "1",
    commonName: "King Cobra",
    scientificName: "Ophiophagus hannah",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/12_-_The_Mystical_King_Cobra_and_Coffee_Forests.jpg/1200px-12_-_The_Mystical_King_Cobra_and_Coffee_Forests.jpg",
    habitat: "Forests, bamboo thickets, and agricultural areas in South and Southeast Asia",
    behavior: "Diurnal, primarily feeds on other snakes. Known for its intelligence and ability to raise up to one-third of its body.",
    venomInfo: "Highly venomous. Neurotoxic venom can cause respiratory failure. Medical attention required immediately.",
    description: "The world's longest venomous snake, capable of reaching 18 feet in length."
  },
  {
    id: "2",
    commonName: "Ball Python",
    scientificName: "Python regius",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Ball_python_lucy.JPG/1200px-Ball_python_lucy.JPG",
    habitat: "Grasslands, shrublands, and open forests of West and Central Africa",
    behavior: "Nocturnal and secretive. Curls into a ball when threatened. Docile temperament.",
    venomInfo: "Non-venomous. Constrictor species. Safe to handle with proper care.",
    description: "Popular pet snake known for its docile nature and manageable size."
  },
  {
    id: "3",
    commonName: "Eastern Diamondback Rattlesnake",
    scientificName: "Crotalus adamanteus",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Crotalus_adamanteus_%2810%29.jpg/1200px-Crotalus_adamanteus_%2810%29.jpg",
    habitat: "Pine forests, scrublands, and coastal areas of southeastern United States",
    behavior: "Ambush predator. Warns with distinctive rattle before striking. Generally avoids confrontation.",
    venomInfo: "Highly venomous. Hemotoxic venom causes tissue damage. Seek immediate medical care.",
    description: "The largest rattlesnake species and one of the heaviest venomous snakes in the Americas."
  },
  {
    id: "4",
    commonName: "Green Tree Python",
    scientificName: "Morelia viridis",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Morelia_viridis_1.jpg/1200px-Morelia_viridis_1.jpg",
    habitat: "Tropical rainforests of New Guinea, Indonesia, and Australia",
    behavior: "Arboreal and nocturnal. Rests coiled on branches during the day. Ambush predator.",
    venomInfo: "Non-venomous. Constrictor with sharp teeth that can cause painful bites.",
    description: "Strikingly colored arboreal python known for its bright green coloration."
  },
  {
    id: "5",
    commonName: "Corn Snake",
    scientificName: "Pantherophis guttatus",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Kornnatter.jpg/1200px-Kornnatter.jpg",
    habitat: "Overgrown fields, forest openings, and abandoned buildings in eastern United States",
    behavior: "Primarily nocturnal. Excellent climber. Docile and easy to handle.",
    venomInfo: "Non-venomous. Harmless to humans. One of the most popular pet snakes.",
    description: "A North American species popular in the pet trade due to its calm demeanor."
  },
  {
    id: "6",
    commonName: "Black Mamba",
    scientificName: "Dendroaspis polylepis",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Dendroaspis_polylepis_by_Bill_Love.jpg/1200px-Dendroaspis_polylepis_by_Bill_Love.jpg",
    habitat: "Savannas, rocky hills, and open woodlands of sub-Saharan Africa",
    behavior: "Fastest snake in the world. Highly aggressive when cornered. Primarily diurnal.",
    venomInfo: "Extremely venomous. Neurotoxic venom can kill within hours. Immediate antivenom required.",
    description: "Africa's longest and most feared venomous snake, named for its black mouth interior."
  },
  {
    id: "7",
    commonName: "Boa Constrictor",
    scientificName: "Boa constrictor",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Boa_constrictor_%282%29.jpg/1200px-Boa_constrictor_%282%29.jpg",
    habitat: "Tropical rainforests, semi-arid areas, and agricultural lands of Central and South America",
    behavior: "Nocturnal ambush predator. Excellent swimmer. Generally docile but can be defensive.",
    venomInfo: "Non-venomous. Kills prey by constriction. Can inflict painful bites.",
    description: "Large, heavy-bodied snake known for its distinctive patterning and constricting ability."
  },
  {
    id: "8",
    commonName: "Garter Snake",
    scientificName: "Thamnophis sirtalis",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Coast_Garter_Snake.jpg/1200px-Coast_Garter_Snake.jpg",
    habitat: "Meadows, marshes, woodlands, and suburban areas across North America",
    behavior: "Diurnal and active. Often found near water. Releases musk when threatened.",
    venomInfo: "Mildly venomous but harmless to humans. Saliva may cause minor irritation.",
    description: "One of the most common snakes in North America, easily recognized by its stripes."
  }
];
