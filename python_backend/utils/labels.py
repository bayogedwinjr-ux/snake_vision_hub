"""
Snake species labels and metadata for the classification model.
10 Philippine snake species that the model was trained on.
"""

# Scientific names (model output labels - alphabetical order from training folders)
SCIENTIFIC_NAMES = [
    "Cerberus schneiderii",           # Dog-faced Water Snake
    "Dendrelaphis pictus",            # Common Bronze-backed Snake  
    "Gonyosoma oxycephalum",          # Red-tailed Rat Snake
    "Indotyphlops braminus",          # Brahminy Blind Snake
    "Laticauda colubrina",            # Yellow-lipped Sea Krait
    "Lycodon capucinus",              # Common Wolf Snake
    "Malayopython reticulatus",       # Reticulated Python
    "Ophiophagus hannah",             # King Cobra
    "Psammodynastes pulverulentus",   # Common Mock Viper
    "Tropidolaemus subannulatus"      # North Philippine Temple Pit Viper
]

# Common names (matching order of scientific names)
COMMON_NAMES = [
    "Dog-faced Water Snake",
    "Common Bronze-backed Snake",
    "Red-tailed Rat Snake",
    "Brahminy Blind Snake",
    "Yellow-lipped Sea Krait",
    "Common Wolf Snake",
    "Reticulated Python",
    "King Cobra",
    "Common Mock Viper",
    "North Philippine Temple Pit Viper"
]

# Venom classification
VENOM_LEVELS = [
    "Mildly venomous",   # Cerberus schneiderii
    "Non-venomous",      # Dendrelaphis pictus
    "Non-venomous",      # Gonyosoma oxycephalum
    "Non-venomous",      # Indotyphlops braminus
    "Highly venomous",   # Laticauda colubrina
    "Non-venomous",      # Lycodon capucinus
    "Non-venomous",      # Malayopython reticulatus
    "Highly venomous",   # Ophiophagus hannah
    "Mildly venomous",   # Psammodynastes pulverulentus
    "Highly venomous"    # Tropidolaemus subannulatus
]

# Conservation status
CONSERVATION_STATUS = [
    "Least concern",     # Cerberus schneiderii
    "Least concern",     # Dendrelaphis pictus
    "Least concern",     # Gonyosoma oxycephalum
    "Least concern",     # Indotyphlops braminus
    "Least concern",     # Laticauda colubrina
    "Least concern",     # Lycodon capucinus
    "Least concern",     # Malayopython reticulatus
    "Vulnerable",        # Ophiophagus hannah
    "Least concern",     # Psammodynastes pulverulentus
    "Least concern"      # Tropidolaemus subannulatus
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
