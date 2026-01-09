import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { snakeSpecies, SnakeSpecies } from "@/data/snakeSpecies";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Glossary = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredSpecies = snakeSpecies.filter(s =>
    s.commonName.toLowerCase().includes(search.toLowerCase()) ||
    s.scientificName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredSpecies.map(species => (
          <Card
            key={species.id}
            className="cursor-pointer hover:bg-accent transition-colors"
            onClick={() => navigate(`/glossary/${species.id}`)}
          >
            <CardContent className="p-4">
              <img
                src={species.imageUrl}
                alt={species.commonName}
                className="w-full h-32 object-cover rounded-md mb-3"
              />
              <h3 className="font-medium text-foreground">{species.commonName}</h3>
              <p className="text-sm text-muted-foreground italic">{species.scientificName}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredSpecies.length === 0 && (
        <p className="text-center text-muted-foreground">No species found matching your search.</p>
      )}
    </div>
  );
};

export default Glossary;
