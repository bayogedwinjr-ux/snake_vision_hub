import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { snakeSpecies } from "@/data/snakeSpecies";
import { ArrowLeft } from "lucide-react";

const SnakeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const species = snakeSpecies.find(s => s.id === id);
  
  if (!species) {
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
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button variant="ghost" onClick={() => navigate("/glossary")} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Glossary
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{species.commonName}</CardTitle>
          <p className="text-muted-foreground italic">{species.scientificName}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <img
            src={species.imageUrl}
            alt={species.commonName}
            className="w-full max-h-80 object-cover rounded-md"
          />
          
          <div>
            <h3 className="font-semibold text-foreground mb-2">Habitat</h3>
            <p className="text-muted-foreground">{species.habitat}</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-2">Behavior</h3>
            <p className="text-muted-foreground">{species.behavior}</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-2">Venom Information</h3>
            <p className="text-muted-foreground">{species.venomInfo}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SnakeDetail;
