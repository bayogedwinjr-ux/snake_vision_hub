import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchSnakes, Snake } from "@/services/api";
import { Search, AlertTriangle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const Glossary = () => {
  const [search, setSearch] = useState("");
  const [snakes, setSnakes] = useState<Snake[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadSnakes = async () => {
      try {
        const data = await fetchSnakes();
        setSnakes(data);
      } catch (error) {
        console.error("Failed to fetch snakes:", error);
      } finally {
        setLoading(false);
      }
    };
    loadSnakes();
  }, []);

  const filteredSpecies = snakes.filter(s =>
    s.common_name.toLowerCase().includes(search.toLowerCase()) ||
    s.species_name.toLowerCase().includes(search.toLowerCase())
  );

  // Helper to get image URL - uses id-based naming convention
  const getImageUrl = (snake: Snake) => {
    if (snake.image_url) return snake.image_url;
    // Fallback: images folder with id-based naming (e.g., images/1.jpg)
    return null;
  };

  const getVenomBadge = (venomous: string) => {
    if (venomous.includes("Highly")) {
      return <Badge variant="destructive" className="text-xs"><AlertTriangle className="h-3 w-3 mr-1" />Highly Venomous</Badge>;
    }
    if (venomous.includes("Mildly")) {
      return <Badge variant="secondary" className="text-xs">Mildly Venomous</Badge>;
    }
    return <Badge variant="outline" className="text-xs"><CheckCircle className="h-3 w-3 mr-1" />Non-venomous</Badge>;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <h2 className="text-2xl font-bold mb-6 text-foreground">Snake Glossary</h2>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search species..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="w-full h-32 rounded-md mb-3" />
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {filteredSpecies.map(species => (
            <motion.div key={species.id} variants={item}>
              <Card
                className="cursor-pointer hover:bg-accent/50 transition-all duration-200 hover:shadow-md"
                onClick={() => navigate(`/glossary/${species.id}`)}
              >
                <CardContent className="p-4">
                  <div className="w-full h-32 bg-muted rounded-md mb-3 flex items-center justify-center overflow-hidden">
                    {getImageUrl(species) ? (
                      <img
                        src={getImageUrl(species)!}
                        alt={species.common_name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-4xl">🐍</span>
                    )}
                  </div>
                  <h3 className="font-medium text-foreground">{species.common_name}</h3>
                  <p className="text-sm text-muted-foreground italic mb-2">{species.species_name}</p>
                  {getVenomBadge(species.venomous)}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
      
      {!loading && filteredSpecies.length === 0 && (
        <p className="text-center text-muted-foreground">No species found matching your search.</p>
      )}
    </motion.div>
  );
};

export default Glossary;
