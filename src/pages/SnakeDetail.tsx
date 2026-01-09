import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchSnakeById, Snake } from "@/services/api";
import { snakeSpecies } from "@/data/snakeSpecies";
import { ArrowLeft, AlertTriangle, CheckCircle, MapPin, Leaf, Info } from "lucide-react";

const SnakeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [snake, setSnake] = useState<Snake | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSnake = async () => {
      if (!id) return;
      
      try {
        const data = await fetchSnakeById(id);
        if (data) {
          setSnake(data);
        } else {
          // Fallback to local data
          const localSnake = snakeSpecies.find(s => s.id === id);
          if (localSnake) {
            setSnake({
              id: parseInt(id) || 0,
              common_name: localSnake.commonName,
              species_name: localSnake.scientificName,
              venomous: 'Non-venomous',
              status: 'Least concern',
              distribution: '',
              habitat: localSnake.habitat,
              description: localSnake.description,
              ecological_role: '',
              image_url: localSnake.imageUrl,
              created_at: new Date().toISOString()
            });
          }
        }
      } catch {
        // Use local data on error
        const localSnake = snakeSpecies.find(s => s.id === id);
        if (localSnake) {
          setSnake({
            id: parseInt(id) || 0,
            common_name: localSnake.commonName,
            species_name: localSnake.scientificName,
            venomous: 'Non-venomous',
            status: 'Least concern',
            distribution: '',
            habitat: localSnake.habitat,
            description: localSnake.description,
            ecological_role: '',
            image_url: localSnake.imageUrl,
            created_at: new Date().toISOString()
          });
        }
      } finally {
        setLoading(false);
      }
    };
    loadSnake();
  }, [id]);

  const getVenomBadge = (venomous: string) => {
    if (venomous.includes("Highly")) {
      return <Badge variant="destructive" className="text-sm"><AlertTriangle className="h-4 w-4 mr-1" />Highly Venomous</Badge>;
    }
    if (venomous.includes("Mildly")) {
      return <Badge variant="secondary" className="text-sm">Mildly Venomous</Badge>;
    }
    return <Badge variant="outline" className="text-sm"><CheckCircle className="h-4 w-4 mr-1" />Non-venomous</Badge>;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Skeleton className="h-10 w-32 mb-6" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="w-full h-80 rounded-md" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!snake) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate("/glossary")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Glossary
        </Button>
        <p className="text-center text-muted-foreground mt-8">Species not found.</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-8 max-w-3xl"
    >
      <Button variant="ghost" onClick={() => navigate("/glossary")} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Glossary
      </Button>
      
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">{snake.common_name}</CardTitle>
              <p className="text-muted-foreground italic text-lg">{snake.species_name}</p>
            </div>
            {getVenomBadge(snake.venomous)}
          </div>
          {snake.status && (
            <Badge variant="outline" className="w-fit mt-2">
              Conservation: {snake.status}
            </Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="w-full max-h-80 bg-muted rounded-md flex items-center justify-center overflow-hidden">
            {snake.image_url ? (
              <img
                src={snake.image_url}
                alt={snake.common_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-6xl">🐍</span>
            )}
          </div>

          {snake.description && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Description</h3>
              </div>
              <p className="text-muted-foreground">{snake.description}</p>
            </motion.div>
          )}

          {snake.distribution && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Distribution</h3>
              </div>
              <p className="text-muted-foreground">{snake.distribution}</p>
            </motion.div>
          )}
          
          {snake.habitat && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Habitat</h3>
              </div>
              <p className="text-muted-foreground">{snake.habitat}</p>
            </motion.div>
          )}

          {snake.ecological_role && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="font-semibold text-foreground mb-2">Ecological Role</h3>
              <p className="text-muted-foreground">{snake.ecological_role}</p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SnakeDetail;
