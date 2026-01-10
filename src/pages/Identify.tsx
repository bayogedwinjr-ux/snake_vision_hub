import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { predictSnake, PredictionResult } from "@/services/api";
import { Upload, Camera, AlertTriangle, CheckCircle, Loader2, ImageIcon, ExternalLink, RotateCcw } from "lucide-react";

// Species ID mapping for image lookup (matches database IDs)
const SPECIES_ID_MAP: Record<string, number> = {
  "Ophiophagus hannah": 1,
  "Lycodon capucinus": 2,
  "Laticauda colubrina": 3,
  "Malayopython reticulatus": 4,
  "Dendrelaphis pictus": 5,
  "Gonyosoma oxycephalum": 6,
  "Cerberus schneiderii": 7,
  "Indotyphlops braminus": 8,
  "Psammodynastes pulverulentus": 9,
  "Tropidolaemus subannulatus": 10,
};

const Identify = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasIdentified, setHasIdentified] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setPrediction(null);
        setHasIdentified(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIdentify = async () => {
    if (!imagePreview) return;
    
    setLoading(true);
    try {
      const results = await predictSnake(imagePreview);
      // Only show the highest confidence prediction
      if (results.length > 0) {
        setPrediction(results[0]);
        setHasIdentified(true);
      }
    } catch (error) {
      console.error('Prediction failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImagePreview(null);
    setPrediction(null);
    setHasIdentified(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute("capture", "environment");
      fileInputRef.current.click();
    }
  };

  const getVenomBadgeVariant = (venomous: string): "destructive" | "secondary" | "outline" => {
    if (venomous.includes("Highly")) return "destructive";
    if (venomous.includes("Mildly")) return "secondary";
    return "outline";
  };

  const getVenomIcon = (venomous: string) => {
    if (venomous.includes("Highly")) return <AlertTriangle className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  const getSpeciesImage = (scientificName: string): string | null => {
    const speciesId = SPECIES_ID_MAP[scientificName];
    if (speciesId) {
      // Return the path to the species image based on database ID
      return `/snake_vision_hub/images/${speciesId}.jpg`;
    }
    return null;
  };

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.8) return "text-green-500";
    if (confidence >= 0.5) return "text-yellow-500";
    return "text-red-500";
  };

  const getConfidenceLabel = (confidence: number): string => {
    if (confidence >= 0.8) return "High Confidence";
    if (confidence >= 0.5) return "Medium Confidence";
    return "Low Confidence";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container mx-auto px-4 py-8 max-w-4xl"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 text-foreground">Snake Identification</h2>
        <p className="text-muted-foreground">
          Upload an image to identify Philippine snake species using AI
        </p>
      </div>
      
      {/* Model Limitation Notice */}
      <Card className="mb-6 border-amber-500/50 bg-amber-500/10">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Model Limitation</p>
              <p>
                The AI can identify <strong>10 species</strong>: King Cobra, Yellow-lipped Sea Krait, 
                Temple Pit Viper, Wolf Snake, Reticulated Python, Bronze-backed Snake, 
                Red-tailed Rat Snake, Dog-faced Water Snake, Brahminy Blind Snake, and Mock Viper.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className={`grid gap-6 ${hasIdentified ? 'lg:grid-cols-2' : 'lg:grid-cols-1 max-w-xl mx-auto'}`}>
        {/* Upload Section */}
        <Card className={hasIdentified ? '' : ''}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              {hasIdentified ? 'Uploaded Image' : 'Upload Snake Image'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!imagePreview ? (
              <>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCameraCapture}
                    className="flex-1"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Camera
                  </Button>
                </div>
                
                <div 
                  className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Click or drag an image here to upload
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Supports JPG, PNG, WebP
                  </p>
                </div>
              </>
            ) : (
              <AnimatePresence>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Uploaded snake"
                      className="w-full aspect-square object-cover rounded-lg border border-border"
                    />
                    {hasIdentified && prediction && (
                      <div className="absolute bottom-3 left-3 right-3">
                        <Badge 
                          variant={getVenomBadgeVariant(prediction.venomous)} 
                          className="text-sm px-3 py-1"
                        >
                          {getVenomIcon(prediction.venomous)}
                          <span className="ml-1">{prediction.venomous}</span>
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  {!hasIdentified ? (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleIdentify}
                        disabled={loading}
                        className="flex-1"
                        size="lg"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          "Identify Snake"
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleReset}
                        size="lg"
                      >
                        <RotateCcw className="h-5 w-5" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={handleReset}
                      className="w-full"
                      size="lg"
                    >
                      <RotateCcw className="mr-2 h-5 w-5" />
                      Identify Another Snake
                    </Button>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </CardContent>
        </Card>

        {/* Result Section */}
        <AnimatePresence>
          {hasIdentified && prediction && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      Identification Result
                    </span>
                    <Badge variant="outline" className={getConfidenceColor(prediction.confidence)}>
                      {getConfidenceLabel(prediction.confidence)}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Species Image */}
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                    {getSpeciesImage(prediction.scientific_name) ? (
                      <img
                        src={getSpeciesImage(prediction.scientific_name)!}
                        alt={prediction.species_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Hide image and show placeholder if not found
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : null}
                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                      <div className="text-center text-muted-foreground">
                        <span className="text-6xl">🐍</span>
                        <p className="text-sm mt-2">Reference image coming soon</p>
                      </div>
                    </div>
                  </div>

                  {/* Species Info */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">
                        {prediction.species_name}
                      </h3>
                      <p className="text-lg text-muted-foreground italic">
                        {prediction.scientific_name}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={getVenomBadgeVariant(prediction.venomous)} 
                        className="text-base px-4 py-1.5"
                      >
                        {getVenomIcon(prediction.venomous)}
                        <span className="ml-2">{prediction.venomous}</span>
                      </Badge>
                    </div>

                    {/* Confidence Score */}
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Confidence Score</span>
                        <span className={`text-2xl font-bold ${getConfidenceColor(prediction.confidence)}`}>
                          {(prediction.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${prediction.confidence * 100}%` }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          className={`h-full rounded-full ${
                            prediction.confidence >= 0.8 
                              ? 'bg-green-500' 
                              : prediction.confidence >= 0.5 
                                ? 'bg-yellow-500' 
                                : 'bg-red-500'
                          }`}
                        />
                      </div>
                    </div>

                    {/* View Details Button */}
                    <Button
                      variant="default"
                      onClick={() => navigate('/glossary')}
                      className="w-full"
                      size="lg"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View in Species Glossary
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Identify;
