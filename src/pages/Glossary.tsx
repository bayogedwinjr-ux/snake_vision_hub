import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { snakeApi, Snake } from "@/services/api";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const Glossary = () => {
  const [search, setSearch] = useState("");
  const [snakes, setSnakes] = useState<Snake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadSnakes();
  }, []);

  const loadSnakes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await snakeApi.getAll();
      setSnakes(data);
    } catch (err) {
      setError("Failed to load snakes. Make sure the PHP backend is running.");
      console.error("Failed to load snakes:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSpecies = snakes.filter(s =>
    s.commonName.toLowerCase().includes(search.toLowerCase()) ||
    s.speciesName.toLowerCase().includes(search.toLowerCase())
  );

  const getVenomBadgeVariant = (venomous: string) => {
    switch (venomous) {
      case 'Highly venomous': return 'destructive';
      case 'Mildly venomous': return 'secondary';
      default: return 'outline';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-2 text-foreground">Snake Glossary</h2>
        <p className="text-muted-foreground mb-6">
          Browse {snakes.length} Philippine snake species
        </p>
      </motion.div>
      
      <motion.div 
        className="relative mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by common or scientific name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </motion.div>

      {error && (
        <motion.div 
          className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <AlertCircle className="h-5 w-5 text-destructive" />
          <p className="text-destructive">{error}</p>
        </motion.div>
      )}

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
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredSpecies.map(species => (
            <motion.div key={species.id} variants={itemVariants}>
              <Card
                className="cursor-pointer hover:bg-accent/50 transition-all duration-200 hover:shadow-md group"
                onClick={() => navigate(`/glossary/${species.id}`)}
              >
                <CardContent className="p-4">
                  <div className="w-full h-32 bg-muted rounded-md mb-3 flex items-center justify-center overflow-hidden">
                    {species.imageUrl ? (
                      <img
                        src={species.imageUrl}
                        alt={species.commonName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <span className="text-4xl">🐍</span>
                    )}
                  </div>
                  <h3 className="font-medium text-foreground mb-1">{species.commonName}</h3>
                  <p className="text-sm text-muted-foreground italic mb-2">{species.speciesName}</p>
                  <Badge variant={getVenomBadgeVariant(species.venomous)}>
                    {species.venomous}
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
      
      {!loading && filteredSpecies.length === 0 && (
        <motion.p 
          className="text-center text-muted-foreground py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No species found matching your search.
        </motion.p>
      )}
    </div>
  );
};

export default Glossary;
