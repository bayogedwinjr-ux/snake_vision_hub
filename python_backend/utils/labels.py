"""
Snake species labels and metadata for the classification model.
28 Philippine snake species from the CSV metadata.
"""

# Common names (model output labels)
COMMON_NAMES = [
    "Asian Vine Snake",
    "Philippine Blunt-headed Tree Snake",
    "Dog-toothed Cat Snake",
    "Paradise Flying Tree Snake",
    "Common Bronze-backed Snake",
    "Philippine Whipsnake",
    "Grey Tailed Brown Rat Snake",
    "Red-tailed Rat Snake",
    "Common Wolf Snake",
    "Smooth-scaled Mountain Rat Snake",
    "Gervais' Worm Snake",
    "Northern Triangle-spotted Snake",
    "Non-banded Philippine Burrowing Snake",
    "Negros Light-scaled Burrowing Snake",
    "Dog-faced Water Snake",
    "Negros Spotted Water Snake",
    "Boie's Keelback Snake",
    "Yellow-lipped Sea Krait",
    "Double-barred Coral Snake",
    "Common Mock Viper",
    "North Philippine Temple Pit Viper",
    "Pit Viper",
    "Barred Coral Snake",
    "King Cobra",
    "Samar Cobra",
    "Reticulated Python",
    "Small Wart Snake",
    "Brahminy Blind Snake"
]

# Scientific names
SCIENTIFIC_NAMES = [
    "Ahaetulla prasina preocularis",
    "Boiga angulata",
    "Boiga cynodon",
    "Chrysopelea paradisi variabilis",
    "Dendrelaphis pictus",
    "Dryophiops philippina",
    "Coelognathus erythrurus psephenourus",
    "Gonyosoma oxycephalum",
    "Lycodon capucinus",
    "Ptyas luzonensis",
    "Calamaria gervaisi iridescens",
    "Cyclocorus lineatus alcalai",
    "Oxyrhabdium modestum",
    "Pseudorabdion oxycephalum",
    "Cerberus schneiderii",
    "Tropidonophis negrosensis",
    "Rhabdophis spilogaster",
    "Laticauda colubrina",
    "Hemibungarus gemianulis",
    "Psammodynastes pulverulentus",
    "Tropidolaemus subannulatus",
    "Trimeresurus flavomaculatus",
    "Hemibungarus calligaster",
    "Ophiophagus hannah",
    "Naja Samarensis",
    "Malayopython reticulatus",
    "Acrochordus granulatus",
    "Indotyphlops braminus"
]

# Venom classification
VENOM_LEVELS = [
    "Mildly venomous",   # Asian Vine Snake
    "Mildly venomous",   # Philippine Blunt-headed Tree Snake
    "Mildly venomous",   # Dog-toothed Cat Snake
    "Mildly venomous",   # Paradise Flying Tree Snake
    "Non-venomous",      # Common Bronze-backed Snake
    "Mildly venomous",   # Philippine Whipsnake
    "Non-venomous",      # Grey Tailed Brown Rat Snake
    "Non-venomous",      # Red-tailed Rat Snake
    "Non-venomous",      # Common Wolf Snake
    "Non-venomous",      # Smooth-scaled Mountain Rat Snake
    "Non-venomous",      # Gervais' Worm Snake
    "Non-venomous",      # Northern Triangle-spotted Snake
    "Non-venomous",      # Non-banded Philippine Burrowing Snake
    "Non-venomous",      # Negros Light-scaled Burrowing Snake
    "Mildly venomous",   # Dog-faced Water Snake
    "Non-venomous",      # Negros Spotted Water Snake
    "Mildly venomous",   # Boie's Keelback Snake
    "Highly venomous",   # Yellow-lipped Sea Krait
    "Highly venomous",   # Double-barred Coral Snake
    "Mildly venomous",   # Common Mock Viper
    "Highly venomous",   # North Philippine Temple Pit Viper
    "Highly venomous",   # Pit Viper
    "Highly venomous",   # Barred Coral Snake
    "Highly venomous",   # King Cobra
    "Highly venomous",   # Samar Cobra
    "Non-venomous",      # Reticulated Python
    "Non-venomous",      # Small Wart Snake
    "Non-venomous"       # Brahminy Blind Snake
]

# Conservation status
CONSERVATION_STATUS = [
    "Least concern",     # Asian Vine Snake
    "Least concern",     # Philippine Blunt-headed Tree Snake
    "Least concern",     # Dog-toothed Cat Snake
    "Least concern",     # Paradise Flying Tree Snake
    "Least concern",     # Common Bronze-backed Snake
    "Vulnerable",        # Philippine Whipsnake
    "Least concern",     # Grey Tailed Brown Rat Snake
    "Least concern",     # Red-tailed Rat Snake
    "Least concern",     # Common Wolf Snake
    "Least concern",     # Smooth-scaled Mountain Rat Snake
    "Least concern",     # Gervais' Worm Snake
    "Least concern",     # Northern Triangle-spotted Snake
    "Least concern",     # Non-banded Philippine Burrowing Snake
    "Least concern",     # Negros Light-scaled Burrowing Snake
    "Least concern",     # Dog-faced Water Snake
    "Near Threatened",   # Negros Spotted Water Snake
    "Least concern",     # Boie's Keelback Snake
    "Least concern",     # Yellow-lipped Sea Krait
    "Least concern",     # Double-barred Coral Snake
    "Least concern",     # Common Mock Viper
    "Least concern",     # North Philippine Temple Pit Viper
    "Least concern",     # Pit Viper
    "Least concern",     # Barred Coral Snake
    "Vulnerable",        # King Cobra
    "Least concern",     # Samar Cobra
    "Least concern",     # Reticulated Python
    "Least concern",     # Small Wart Snake
    "Least concern"      # Brahminy Blind Snake
]


def get_species_info(index: int) -> dict:
    """Get full species information by index."""
    if 0 <= index < len(COMMON_NAMES):
        return {
            "index": index,
            "common_name": COMMON_NAMES[index],
            "scientific_name": SCIENTIFIC_NAMES[index],
            "venomous": VENOM_LEVELS[index],
            "status": CONSERVATION_STATUS[index]
        }
    return None


def get_all_species() -> list:
    """Get list of all species with full information."""
    return [get_species_info(i) for i in range(len(COMMON_NAMES))]


def find_species_by_name(name: str) -> dict:
    """Find species by common or scientific name."""
    name_lower = name.lower()
    for i, common in enumerate(COMMON_NAMES):
        if common.lower() == name_lower or SCIENTIFIC_NAMES[i].lower() == name_lower:
            return get_species_info(i)
    return None
