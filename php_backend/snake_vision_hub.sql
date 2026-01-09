-- Snake Vision Hub Database Schema
-- Run this SQL in phpMyAdmin after starting WAMP server

CREATE DATABASE IF NOT EXISTS snake_vision_hub;
USE snake_vision_hub;

-- Snakes table - stores all 28 Philippine snake species from CSV metadata
CREATE TABLE IF NOT EXISTS snakes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    common_name VARCHAR(255) NOT NULL,
    species_name VARCHAR(255) NOT NULL,
    venomous ENUM('Non-venomous', 'Mildly venomous', 'Highly venomous') NOT NULL,
    status VARCHAR(100) DEFAULT 'Least concern',
    distribution TEXT,
    habitat TEXT,
    description TEXT,
    ecological_role TEXT,
    image_url VARCHAR(500) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_common_name (common_name),
    INDEX idx_venomous (venomous)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Observations table - for encoding snake sightings/data
CREATE TABLE IF NOT EXISTS observations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    snake_id INT DEFAULT NULL,
    species VARCHAR(255) NOT NULL,
    length_cm DECIMAL(10,2) DEFAULT NULL,
    weight_g DECIMAL(10,2) DEFAULT NULL,
    location VARCHAR(255) NOT NULL,
    date_observed DATE NOT NULL,
    picture_url LONGTEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (snake_id) REFERENCES snakes(id) ON DELETE SET NULL,
    INDEX idx_species (species),
    INDEX idx_date (date_observed),
    INDEX idx_location (location)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert the 28 Philippine snake species from CSV metadata
INSERT INTO snakes (common_name, species_name, venomous, status, distribution, habitat, description, ecological_role) VALUES
('Asian Vine Snake', 'Ahaetulla prasina preocularis', 'Mildly venomous', 'Least concern', 'Found across most of the Philippine archipelago, including Luzon, Panay, Negros, Cebu, Bohol, Leyte, and Mindanao.', 'Arboreal (tree-dwelling), found in forests and foliage across the Philippines, often near water.', 'Slender, bright green, tree-dwelling snake common in the Philippines, recognized by its long snout, large eyes with horizontal pupils, and ability to flatten its body to mimic foliage, using mild venom to catch its lizard and frog prey.', 'Important predator in its native ecosystem, playing a key role in maintaining the balance of its forest and scrubland habitats.'),

('Philippine Blunt-headed Tree Snake', 'Boiga angulata', 'Mildly venomous', 'Least concern', 'Endemic to the Philippines, found on islands including Leyte, Luzon, Panay, and Romblon.', 'Inhabits lowland and montane tropical moist forests, as well as disturbed habitats.', 'Commonly known as the Leyte cat snake or Philippine blunt-headed tree snake, is a species of rear-fanged snake endemic to the Philippines.', 'As a nocturnal hunter, it controls populations of small vertebrates that inhabit the upper layers of lowland and montane forests.'),

('Dog-toothed Cat Snake', 'Boiga cynodon', 'Mildly venomous', 'Least concern', 'Widely distributed across Indonesia, Malaysia, Singapore, the Philippines, Thailand, Myanmar, and Bangladesh.', 'Primarily inhabits lowland forests, forest edges, and peatlands. It is highly adaptable and also found in disturbed areas like secondary forests, gardens, and coconut plantations.', 'Boiga cynodon, commonly known as the dog-toothed cat snake, is a large, arboreal species of rear-fanged colubrid found across Southeast Asia and parts of South Asia.', 'Major regulator of bird populations. It is specifically adapted to hunt roosting birds and raid nests for eggs.'),

('Paradise Flying Tree Snake', 'Chrysopelea paradisi variabilis', 'Mildly venomous', 'Least concern', 'Widespread across the Philippines, including Luzon, Panay, and the Sulu Archipelago.', 'Primarily diurnal and arboreal, inhabiting lowland forests, woodlands, coconut plantations, and rural gardens.', 'A subspecies of the paradise flying snake endemic to the Philippines. It is renowned for its remarkable ability to glide through the air by flattening its body into a concave airfoil.', 'As a diurnal (day-active) hunter, it maintains the balance of lizard populations, specifically targeting tree-dwelling species such as emerald skinks and geckos.'),

('Common Bronze-backed Snake', 'Dendrelaphis pictus', 'Non-venomous', 'Least concern', 'True D. pictus is confirmed in Singapore (type locality), Thailand, Peninsular Malaysia, Sumatra, Java, and Borneo.', 'Prefers forest edges, secondary scrub, parks, and gardens; it is rarely found in dense, primary forests.', 'Dendrelaphis pictus, commonly known as the painted bronzeback or common bronzeback, is a highly active, slender tree snake widespread across Southeast Asia.', 'They are primary predators of lizards (geckos, skinks) and frogs. This helps regulate vertebrate populations in the mid-to-high canopy.'),

('Philippine Whipsnake', 'Dryophiops philippina', 'Mildly venomous', 'Vulnerable', 'Endemic to several Philippine islands, including Luzon, Mindoro, Sibuyan, Panay, Negros, Samar, and eastern Mindanao.', 'Primarily found in primary and secondary lowland tropical moist forests. While arboreal, it is frequently seen on the forest floor among leaf litter.', 'Dryophiops philippina, known as the keel-bellied whipsnake or Philippine whipsnake, is a slender, rear-fanged species endemic to the Philippines.', 'It is a highly specialized hunter that primarily pursues geckos and other arboreal lizards.'),

('Grey Tailed Brown Rat Snake', 'Coelognathus erythrurus psephenourus', 'Non-venomous', 'Least concern', 'Primarily found in the Visayan Islands, including Panay, Negros, Cebu, Sibuyan, and Tablas.', 'A versatile species inhabiting lowland and highland forests, open woodlands, wetlands, and cave systems.', 'Coelognathus erythrurus psephenourus, commonly known as the Philippine gray-tailed ratsnake, is a non-venomous subspecies of the Philippine ratsnake endemic to the central islands of the Philippines.', 'As its name suggests, this subspecies is an efficient predator of rodents like rats and mice.'),

('Red-tailed Rat Snake', 'Gonyosoma oxycephalum', 'Non-venomous', 'Least concern', 'Widespread across Southeast Asia, including the Philippines, Indonesia, Malaysia, Singapore, Thailand, and Vietnam.', 'Inhabits lowland tropical rainforests, mangroves, and forest edges. It is primarily arboreal, living in tree cavities and rarely descending to the ground.', 'Gonyosoma oxycephalum, commonly known as the red-tailed racer or red-tailed green rat snake, is a large, striking arboreal snake native to Southeast Asia.', 'By regulating the populations of nest-raiding animals and competitive arboreal vertebrates, it maintains the overall stability of forest biodiversity.'),

('Common Wolf Snake', 'Lycodon capucinus', 'Non-venomous', 'Least concern', 'Found throughout Southeast Asia, including Thailand, Malaysia, Singapore, and Indonesia. In the Philippines, it is a common species across the archipelago.', 'Highly adaptable; it inhabits lowland forests but is most commonly found in agricultural and residential areas. It frequently enters homes to hunt geckos.', 'Lycodon capucinus, commonly known as the common wolf snake or Oriental wolf snake, is a slender, highly adaptable colubrid widespread across Southeast Asia.', 'It serves as a natural controller of lizards (especially geckos and skinks) and small rodents in and around human settlements.'),

('Smooth-scaled Mountain Rat Snake', 'Ptyas luzonensis', 'Non-venomous', 'Least concern', 'Endemic to the islands of Luzon, Polillo, Catanduanes, Leyte, Panay, and Negros.', 'Primarily inhabits lowland tropical forests and mountainous areas, often found between 250 and 1,000 meters above sea level.', 'Ptyas luzonensis, commonly known as the smooth-scaled mountain rat snake or Philippine mountain rat snake, is a large, non-venomous colubrid endemic to the Philippines.', 'Plays a vital role in regulating vertebrate populations. Despite its name, its primary diet consists of frogs, though it also consumes rodents, bats, and lizards.'),

('Gervais'' Worm Snake', 'Calamaria gervaisi iridescens', 'Non-venomous', 'Least concern', 'Endemic to the Philippine archipelago. The iridescens subspecies is noted in records for islands such as Luzon, Mindoro, Negros, Panay, and Cebu.', 'Found from sea level up to 1,000 meters in forests, plantations, and even urban gardens.', 'Calamaria gervaisi iridescens is a subspecies of Gervais''s worm snake (or Philippine dwarf snake), a small, burrowing snake endemic to the Philippines.', 'As a burrower, it contributes to soil aeration and nutrient cycling within the forest floor and garden detritus.'),

('Northern Triangle-spotted Snake', 'Cyclocorus lineatus alcalai', 'Non-venomous', 'Least concern', 'Found on the islands of Cebu, Negros, and Panay. Recent records have confirmed its presence on Sibuyan Island in Romblon Province.', 'Primarily terrestrial, inhabiting mature secondary forests, forest floors with leaf litter, and areas near wetlands or streams.', 'Cyclocorus lineatus alcalai, commonly known as Alcala''s triangle-spotted snake, is a subspecies of Reinhardt''s lined snake endemic to the Philippines.', 'By preying on other small vertebrates, it helps regulate the populations of forest-floor and fossorial species.'),

('Non-banded Philippine Burrowing Snake', 'Oxyrhabdium modestum', 'Non-venomous', 'Least concern', 'Widespread across the Philippine archipelago; it is found on islands including Luzon, Mindanao, Negros, Panay, Cebu, Leyte, Samar, Bohol, and Basilan.', 'Highly adaptable, it inhabits a range of environments from sea level to 1,500 meters.', 'Oxyrhabdium modestum, commonly known as the Philippine shrub snake or non-banded Philippine burrowing snake, is a small, harmless colubrid endemic to the Philippines.', 'It is notable for its ability to persist in disturbed habitats, providing natural pest control.'),

('Negros Light-scaled Burrowing Snake', 'Pseudorabdion oxycephalum', 'Non-venomous', 'Least concern', 'Endemic to the Philippines, specifically recorded on the islands of Negros, Mindanao, Panay, and Luzon.', 'A strictly fossorial (burrowing) species. It inhabits lowland and montane tropical moist forests, ranging from sea level to approximately 1,600 meters.', 'Pseudorabdion oxycephalum, commonly known as Günther''s dwarf reed snake or the Negros light-scaled burrowing snake, is a secretive, small-bodied colubrid endemic to the Philippines.', 'As a burrowing specialist, it primarily feeds on soil-dwelling invertebrates, such as earthworms and small insects.'),

('Dog-faced Water Snake', 'Cerberus schneiderii', 'Mildly venomous', 'Least concern', 'Widespread in coastal areas of the Philippines, Vietnam, Thailand, Malaysia, Singapore, and Indonesia.', 'Primarily inhabits mangrove mudflats, estuaries, and brackish river mouths.', 'Cerberus schneiderii, commonly known as Schneider''s dog-faced water snake or the Southeast Asian bockadam, is a highly abundant, salt-tolerant aquatic snake found throughout the Philippines and Southeast Asia.', 'It is a dominant predator of fish (especially gobies, catfish, and eels) and occasionally consumes crustaceans and frogs.'),

('Negros Spotted Water Snake', 'Tropidonophis negrosensis', 'Non-venomous', 'Near Threatened', 'Endemic to several islands in the Philippines, including Negros, Panay, Cebu, Masbate, Mindoro, Siquijor, and small satellite islands like Azucar.', 'Primarily terrestrial and riparian; it is frequently encountered on the forest floor beneath leaf litter, rotten logs, and detritus, often near shallow streams.', 'Tropidonophis negrosensis, commonly known as the Negros spotted water snake or Negros keelback, is a semi-aquatic colubrid endemic to the Philippines.', 'As a semi-aquatic predator, it likely regulates populations of small vertebrates near water bodies.'),

('Boie''s Keelback Snake', 'Rhabdophis spilogaster', 'Mildly venomous', 'Least concern', 'Found exclusively in the Philippines, specifically on the islands of Luzon (including Bataan province), Catanduanes, Polillo, Calayan, and Ticao.', 'They are diurnal and semi-aquatic, frequently observed near rice fields, streams, marshes, and artificial fish ponds.', 'Rhabdophis spilogaster, commonly known as Boie''s Keelback or the Northern Water Snake, is a species of keelback snake endemic to the Philippines.', 'It is an opportunistic predator that also consumes fish and small aquatic invertebrates.'),

('Yellow-lipped Sea Krait', 'Laticauda colubrina', 'Highly venomous', 'Least concern', 'Widespread throughout the Philippine archipelago. Common sightings occur at Gato Island (Cebu), Gigantes Islands, Mindoro, Mindanao, and Pangasinan.', 'Semi-aquatic/amphibious. It inhabits shallow coastal waters and coral reefs to hunt, but spends about 50% of its time on land.', 'Laticauda colubrina, commonly known as the Yellow-lipped Sea Krait or Banded Sea Krait, is a highly venomous but docile species of semi-aquatic snake found in the tropical Indo-Pacific.', 'An apex predator in coral reef systems, it is a specialist that hunts moray and conger eels.'),

('Double-barred Coral Snake', 'Hemibungarus gemianulis', 'Highly venomous', 'Least concern', 'Endemic to the Philippines; specifically found in the Visayas (islands like Cebu, Panay, and Negros).', 'Secretive and terrestrial; inhabits primary and secondary forests, often found among leaf litter or humus.', 'A small, slender elapid with a distinctive "barred" pattern. It mimics true coral snakes with black, red, and yellow bands.', 'An ophiophagous (snake-eating) specialist that regulates populations of smaller snakes and lizards.'),

('Common Mock Viper', 'Psammodynastes pulverulentus', 'Mildly venomous', 'Least concern', 'Extremely widespread throughout the Philippines, including Luzon, Palawan, Mindanao, Visayas, and Sulu.', 'Highly adaptable; found in lowland forests, montane regions, and agricultural areas near streams.', 'A small snake with a triangular head and large eyes, mimicking the appearance of a true viper.', 'A generalist predator that controls populations of small frogs, geckos, and skinks.'),

('North Philippine Temple Pit Viper', 'Tropidolaemus subannulatus', 'Highly venomous', 'Least concern', 'Found in Brunei, Indonesia (Borneo, Sulawesi), Malaysia (Sabah, Sarawak), and the Philippines (islands including Luzon, Mindanao, Negros, Cebu, Palawan, and Bohol).', 'It inhabits lowland primary and mature secondary forests, riverine environments, and mangroves.', 'Tropidolaemus subannulatus, commonly known as the Bornean Keeled Pit Viper or the North Philippine Temple Pit Viper, is a venomous arboreal species native to Southeast Asia.', 'Primarily feeds on warm-blooded prey such as birds and arboreal rodents, but also consumes frogs and lizards.'),

('Pit Viper', 'Trimeresurus flavomaculatus', 'Highly venomous', 'Least concern', 'Panay, Negros, Leyte, Bohol, Samar, Biliran, Cebu, and Siquijor.', 'It is a partly arboreal species typically found in lowland tropical rainforests, often near shady streams, rivers, and damp localities.', 'Trimeresurus flavomaculatus, commonly known as the Philippine Pit Viper, is a venomous snake endemic to the Philippine archipelago.', 'As an apex predator in its microhabitat, this viper is crucial for maintaining the health of forest ecosystems.'),

('Barred Coral Snake', 'Hemibungarus calligaster', 'Highly venomous', 'Least concern', 'Endemic in the Philippines (Luzon, Mindoro, Cebu, Negros, Panay)', 'Inhabits lowland tropical moist forests, both primary and mature secondary, from sea level to roughly 600 meters.', 'Hemibungarus calligaster, commonly known as the Luzon Barred Coral Snake or Philippine Barred Coral Snake, is a venomous elapid endemic to the northern Philippines.', 'An ophiophagous (snake-eating) predator, specialized in hunting other small snakes.'),

('King Cobra', 'Ophiophagus hannah', 'Highly venomous', 'Vulnerable', 'Found across the Visayas (Cebu, Negros, Panay, Bohol, Samal)', 'They primarily inhabit lowland tropical rainforests, mangroves, and bamboo thickets. Also frequently found near streams and rivers.', 'Ophiophagus hannah, universally known as the King Cobra, is a massive elapid endemic to Asia.', 'A specialized ophiophagous predator (snake-eater). It primarily preys on other snakes, including rat snakes, pythons, and even other cobras.'),

('Samar Cobra', 'Naja Samarensis', 'Highly venomous', 'Least concern', 'Endemic to the Visayas and Mindanao island groups. Confirmed on islands including Samar, Leyte, Bohol, Mindanao, Basilan, Dinagat, and Siquijor.', 'Occupies a wide range of habitats from lowland tropical plains and rice paddies to mountainous jungles, up to an elevation of approximately 800–1,000 meters.', 'Naja samarensis, commonly known as the Samar Cobra or Southern Philippine Spitting Cobra, is a highly venomous elapid endemic to the southern Philippines.', 'They are vital for pest control in agricultural settings.'),

('Reticulated Python', 'Malayopython reticulatus', 'Non-venomous', 'Least concern', 'Inhabits nearly all major islands of the Philippines (e.g., Luzon, Mindanao, Cebu)', 'It is extremely resilient to human-modified landscapes, thriving in agricultural lands and even urban areas.', 'Malayopython reticulatus (the Reticulated Python) is recognized as the longest snake species in the world and one of the most adaptable apex predators in Southeast Asia.', 'As a top predator, it maintains ecosystem equilibrium by regulating populations of diverse animals.'),

('Small Wart Snake', 'Acrochordus granulatus', 'Non-venomous', 'Least concern', 'In the Philippines, it is found on islands such as Luzon, Cebu, Negros, Palawan, and Panay.', 'Primarily marine and estuarine, frequently inhabiting mangrove forests, coastal swamps, and tidal rivers.', 'Acrochordus granulatus, commonly known as the Little File Snake or Marine Wart Snake, is a uniquely adapted aquatic snake found in coastal regions across the Indo-Pacific.', 'A specialized piscivore (fish-eater), feeding primarily on small gobiid fish and occasionally crustaceans like crabs.'),

('Brahminy Blind Snake', 'Indotyphlops braminus', 'Non-venomous', 'Least concern', 'Now found on nearly every continent (except Antarctica). It is widespread throughout the Philippines, Southeast Asia, Australia, the Americas, and many oceanic islands.', 'Found underground or under moist leaf litter, rotting logs, and rocks. It thrives in moist, loose soil.', 'Indotyphlops braminus, commonly known as the Brahminy Blind Snake or Flowerpot Snake, is one of the most widely distributed snake species in the world.', 'Plays a beneficial role in gardens and urban environments by regulating populations of social insects.');
