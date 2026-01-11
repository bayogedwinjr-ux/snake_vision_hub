import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, BookOpen, ClipboardList, Cpu, MapPin, Leaf, ArrowRight, ChevronDown } from 'lucide-react';
import snaidLogo from '@/assets/snaid-logo.png';
import heroBg from '@/assets/hero-bg.jpg';

const Index = () => {
  const features = [
    {
      icon: Camera,
      title: 'AI-Powered Identification',
      description: 'Upload a photo or use your camera to instantly identify snake species using our trained MobileNetV3 model.',
      link: '/identify',
    },
    {
      icon: BookOpen,
      title: 'Species Glossary',
      description: 'Explore detailed information about 28 Philippine snake species including habitat, behavior, and venom levels.',
      link: '/glossary',
    },
    {
      icon: ClipboardList,
      title: 'Field Observations',
      description: 'Record and document your snake sightings to contribute to local conservation research efforts.',
      link: '/encode',
    },
  ];

  const highlights = [
    {
      icon: Cpu,
      title: 'Raspberry Pi Powered',
      description: 'Designed for embedded deployment on Raspberry Pi for field research applications.',
    },
    {
      icon: MapPin,
      title: 'Negros Occidental Focus',
      description: 'Specialized for snake species commonly found in Negros Occidental, Philippines.',
    },
    {
      icon: Leaf,
      title: 'Conservation Driven',
      description: 'Supporting biodiversity research and human-snake conflict mitigation efforts.',
    },
  ];

  const scrollToContent = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBg} 
            alt="" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background" />
          <div className="absolute inset-0 backdrop-blur-[2px]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <img 
                src={snaidLogo} 
                alt="SNAID Logo" 
                className="h-32 sm:h-40 md:h-48 w-auto mx-auto drop-shadow-2xl animate-float"
              />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4"
            >
              <span className="text-primary">SN</span>
              <span className="text-secondary">AID</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-2 font-medium"
            >
              Snake Identification AI System
            </motion.p>

            {/* Full Title */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-sm sm:text-base text-highlight font-medium mb-8 max-w-2xl mx-auto"
            >
              Embedded AI System Using Raspberry Pi in Negros Occidental
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button asChild size="lg" className="min-w-[180px] h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-shadow">
                <Link to="/identify">
                  <Camera className="mr-2 h-5 w-5" />
                  Identify Snake
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="min-w-[180px] h-12 text-base font-semibold bg-background/50 backdrop-blur hover:bg-background/80">
                <Link to="/glossary">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Browse Species
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            onClick={scrollToContent}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronDown className="h-8 w-8 animate-bounce" />
          </motion.button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Key Features
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Powerful tools for snake identification, education, and conservation research in the Philippines.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={feature.link}>
                  <Card className="h-full transition-all hover:shadow-lg hover:border-primary/30 hover:-translate-y-1 group cursor-pointer">
                    <CardHeader>
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <feature.icon className="h-7 w-7 text-primary" />
                      </div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        {feature.title}
                        <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                About <span className="text-primary">SNAID</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                SNAID (Snake Identification AI System) is a research project designed to assist in 
                the identification of snake species found in Negros Occidental, Philippines. Using 
                advanced machine learning with MobileNetV3 architecture, deployed on Raspberry Pi 
                for field applications.
              </p>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Our goal is to support local conservation efforts, reduce human-snake conflicts, 
                and provide educational resources about Philippine snake biodiversity.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <span className="h-2 w-2 rounded-full bg-secondary" />
                  10 AI-Trained Species
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  28 Documented Species
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid gap-4"
            >
              {highlights.map((item, index) => (
                <Card key={item.title} className="border-l-4 border-l-secondary">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                      <p className="text-muted-foreground text-sm">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Identify Snakes?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
              Start using our AI-powered identification system to learn about snake species in your area.
            </p>
            <Button asChild size="lg" variant="secondary" className="h-12 px-8 text-base font-semibold">
              <Link to="/identify">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src={snaidLogo} alt="SNAID" className="h-10 w-auto" />
              <div>
                <p className="font-semibold text-foreground">SNAID</p>
                <p className="text-xs text-muted-foreground">Snake Identification AI System</p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/glossary" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Glossary
              </Link>
              <Link to="/identify" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Identify
              </Link>
              <Link to="/encode" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Encode
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} SNAID Research Project. Developed for educational and conservation purposes.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
