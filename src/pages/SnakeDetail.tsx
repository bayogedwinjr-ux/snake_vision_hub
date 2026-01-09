import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { snakeApi, Snake } from "@/services/api";
import { ArrowLeft, MapPin, TreeDeciduous, Info, Leaf, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

const SnakeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [snake, setSnake] = useState<Snake | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (id) {
      loadSnake(parseInt(id));
    }
  }, [id]);

  const loadSnake = async (snakeId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await snakeApi.getById(snakeId);
      setSnake(data);
    } catch (err) {
      setError("Failed to load snake details.");
      console.error("Failed to load snake:", err);
    } finally {
      setLoading(false);
    }
  };

  const getVenomBadgeVariant = (venomous: string) => {
    switch (venomous) {
      case 'Highly venomous': return 'destructive';
      case 'Mildly venomous': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    if (status.toLowerCase().includes('vulnerable')) return 'destructive';
    if (status.toLowerCase().includes('threatened')) return 'secondary';
    return 'outline';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Skeleton className="h-10 w-40 mb-6" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-5 w-48" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="w-full h-64 rounded-md" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !snake) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate("/glossary")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Glossary
        </Button>
        <p className="text-center text-muted-foreground mt-8">
          {error || "Species not found."}
        </p>
      </div>
    );
  }

  return (
    <motion.div 
      className="container mx-auto px-4 py-8 max-w-3xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Button variant="ghost" onClick={() => navigate("/glossary")} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Glossary
      </Button>
      
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">{snake.commonName}</CardTitle>
              <p className="text-muted-foreground italic">{snake.speciesName}</p>
            </div>
            <div className="flex gap-2">
              <Badge variant={getVenomBadgeVariant(snake.venomous)}>
                {snake.venomous === 'Highly venomous' && <AlertTriangle className="h-3 w-3 mr-1" />}
                {snake.venomous}
              </Badge>
              <Badge variant={getStatusBadgeVariant(snake.status)}>
                {snake.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="w-full h-64 bg-muted rounded-md flex items-center justify-center overflow-hidden">
              {snake.imageUrl ? (
                <img
                  src={snake.imageUrl}
                  alt={snake.commonName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-8xl">🐍</span>
              )}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Description</h3>
            </div>
            <p className="text-muted-foreground">{snake.description}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Distribution</h3>
            </div>
            <p className="text-muted-foreground">{snake.distribution}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <TreeDeciduous className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Habitat</h3>
            </div>
            <p className="text-muted-foreground">{snake.habitat}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Ecological Role</h3>
            </div>
            <p className="text-muted-foreground">{snake.ecologicalRole}</p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SnakeDetail;
