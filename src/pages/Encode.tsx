import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchSnakes, fetchObservations, createObservation, deleteObservation as deleteObs, Snake, Observation } from "@/services/api";
import { snakeSpecies } from "@/data/snakeSpecies";
import { Trash2, Image, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Encode = () => {
  const [observations, setObservations] = useState<Observation[]>([]);
  const [snakes, setSnakes] = useState<Snake[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    species: "",
    length: "",
    weight: "",
    location: "",
    dateObserved: "",
    notes: ""
  });
  const [picturePreview, setPicturePreview] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [snakesData, obsData] = await Promise.all([
          fetchSnakes(),
          fetchObservations()
        ]);
        
        if (snakesData.length > 0) {
          setSnakes(snakesData);
        }
        setObservations(obsData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Use local species data as fallback
  const speciesList = snakes.length > 0 
    ? snakes.map(s => ({ id: s.id.toString(), name: s.common_name }))
    : snakeSpecies.map(s => ({ id: s.id, name: s.commonName }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.species || !formData.length || !formData.location || !formData.dateObserved) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const response = await createObservation({
        species: formData.species,
        length_cm: parseFloat(formData.length),
        weight_g: formData.weight ? parseFloat(formData.weight) : undefined,
        location: formData.location,
        date_observed: formData.dateObserved,
        picture_url: picturePreview || undefined,
        notes: formData.notes || undefined
      });

      if (response.success) {
        // Refresh observations
        const obsData = await fetchObservations();
        setObservations(obsData);
        setFormData({ species: "", length: "", weight: "", location: "", dateObserved: "", notes: "" });
        setPicturePreview(null);
        toast({ title: "Success", description: "Observation saved to database" });
      } else {
        toast({ title: "Error", description: response.message || "Failed to save", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to save observation", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteObs(id);
      if (response.success) {
        setObservations(observations.filter(obs => obs.id !== id));
        toast({ title: "Deleted", description: "Observation removed" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    }
  };

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPicturePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-background"
    >
      {/* Header Section */}
      <div className="bg-gradient-to-b from-secondary/10 to-transparent py-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Field <span className="text-secondary">Observations</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Record and document snake sightings to contribute to conservation research in Negros Occidental.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
      
      <Card className="mb-8 border-secondary/30">
        <CardHeader className="bg-secondary/5">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-secondary/20 flex items-center justify-center">
              <Image className="h-4 w-4 text-secondary" />
            </div>
            New Observation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="species">Species *</Label>
                <Select value={formData.species} onValueChange={(v) => setFormData({...formData, species: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select species" />
                  </SelectTrigger>
                  <SelectContent>
                    {speciesList.map(s => (
                      <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="length">Length (cm) *</Label>
                <Input
                  id="length"
                  type="number"
                  value={formData.length}
                  onChange={(e) => setFormData({...formData, length: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (g)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Date Observed *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.dateObserved}
                  onChange={(e) => setFormData({...formData, dateObserved: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="picture">Picture</Label>
                <Input id="picture" type="file" accept="image/*" onChange={handlePictureChange} />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              />
            </div>
            
            <Button type="submit" disabled={submitting}>
              {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : "Save Observation"}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Observations</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : observations.length === 0 ? (
            <p className="text-muted-foreground">No observations recorded yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Species</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Picture</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {observations.map(obs => (
                  <TableRow key={obs.id}>
                    <TableCell>{obs.species}</TableCell>
                    <TableCell>{obs.date_observed}</TableCell>
                    <TableCell>{obs.location}</TableCell>
                    <TableCell>
                      {obs.picture_url ? <Image className="h-4 w-4 text-primary" /> : "-"}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(obs.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      </div>
    </motion.div>
  );
};

export default Encode;
