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
      className="min-h-screen bg-background"
    >
      {/* Header Section */}
      <div className="bg-gradient-to-b from-primary/10 to-transparent py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Species Glossary
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore detailed information about 28 Philippine snake species found in Negros Occidental and surrounding regions.
            </p>
          </motion.div>
          
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by name or species..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-12 text-base bg-card border-border/50"
            />
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">

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
        <div className="text-center py-12">
          <span className="text-6xl mb-4 block">🔍</span>
          <p className="text-muted-foreground">No species found matching "{search}"</p>
        </div>
      )}
      </div>
    </motion.div>
  );
};

export default Glossary;
