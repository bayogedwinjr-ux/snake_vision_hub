import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMockPrediction, PredictionResult } from "@/utils/mockPrediction";
import { Upload, Camera } from "lucide-react";

const Identify = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setPrediction(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIdentify = async () => {
    if (!imagePreview) return;
    
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    const result = getMockPrediction();
    setPrediction(result);
    setLoading(false);
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute("capture", "environment");
      fileInputRef.current.click();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Snake Identification</h2>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Upload Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          
          {imagePreview && (
            <div className="space-y-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full max-h-64 object-contain rounded-md border border-border"
              />
              <Button
                onClick={handleIdentify}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Analyzing..." : "Identify Snake"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {prediction && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Identification Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="font-medium text-muted-foreground">Species:</span>
              <p className="text-foreground text-lg">{prediction.speciesName}</p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Scientific Name:</span>
              <p className="text-foreground italic">{prediction.scientificName}</p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Confidence:</span>
              <p className="text-foreground">{(prediction.confidence * 100).toFixed(1)}%</p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Description:</span>
              <p className="text-foreground">{prediction.description}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Identify;
