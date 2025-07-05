"use client";

import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Copy,
  Download,
  Play,
  Pause,
  RotateCcw,
  Info,
  Zap,
  Code,
  FileCode,
  Sparkles,
  Send,
  Wand2,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CodeEditor from "./code-editor";
import ShaderCanvas from "./shader-canvas";
import ShaderDocumentation from "./shader-documentation";
import { defaultShaders } from "@/lib/default-shaders";
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY!,
});

export default function ShaderPlayground() {
  const [activeShader, setActiveShader] = useState("circles");
  const [shaderCode, setShaderCode] = useState(defaultShaders.circles);
  const [isPlaying, setIsPlaying] = useState(true);
  const [time, setTime] = useState(0);
  const [resolution] = useState({ width: 500, height: 500 });
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStep, setGenerationStep] = useState("");
  const [parameters, setParameters] = useState({
    speed: 1.0,
    intensity: 0.02,
    scale: 8.0,
    colorMultiplier: 1.0,
    colorShift: 0.0,
    distortion: 0.0,
  });
  const animationRef = useRef<number | null>(null);
  const startTime = useRef(Date.now());
  const { toast } = useToast();

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        const currentTime = (Date.now() - startTime.current) / 1000;
        setTime(currentTime * parameters.speed);
        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [isPlaying, parameters.speed]);

  const handleShaderSelect = (value: string) => {
    setActiveShader(value);
    setShaderCode(defaultShaders[value as keyof typeof defaultShaders]);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    startTime.current = Date.now();
    setTime(0);
  };

  const handleParameterChange = (param: string, value: number) => {
    setParameters((prev) => ({
      ...prev,
      [param]: value,
    }));
  };

  const updateShaderCode = (newCode: string) => {
    setShaderCode(newCode);
  };

  const generateShaderWithAI = async (prompt: string) => {
    const glslPrompt = `You are an expert GLSL fragment shader programmer. Generate a complete GLSL fragment shader based on the user's description.

IMPORTANT REQUIREMENTS:
1. The shader MUST use the exact function signature: void mainImage( out vec4 fragColor, in vec2 fragCoord )
2. Available uniform variables:
   - iTime: float (current time in seconds)
   - iResolution: vec2 (canvas resolution)
   - iScale: float (scale parameter, typically 1.0-20.0)
   - iIntensity: float (intensity parameter, typically 0.001-0.1)
   - iColorMultiplier: float (color multiplier, typically 0.1-3.0)
   - iColorShift: float (color shift, typically 0.0-1.0)
   - iDistortion: float (distortion parameter, typically 0.0-1.0)
NOTE - DONT REDEFINE THE ABOVE VARIABLES, ASSUME THEM TO BE ALREADY DEFINED.

3. Convert fragCoord to normalized UV coordinates: vec2 uv = fragCoord / iResolution.xy;
4. Apply aspect ratio correction: uv.x *= iResolution.x / iResolution.y;
5. Center coordinates: uv = uv * 2.0 - 1.0;
6. Use the uniform parameters to make the shader interactive
7. Create visually appealing effects with smooth animations
8. Return the final color in fragColor = vec4(color, 1.0);

GLSL Built-in Functions Available:
- sin(), cos(), tan(), atan(), atan2()
- length(), distance(), dot(), cross(), normalize()
- mix(), smoothstep(), step(), clamp()
- pow(), exp(), log(), sqrt()
- floor(), ceil(), fract(), mod()
- abs(), sign(), min(), max()

User Request: ${prompt}

Generate ONLY the GLSL shader code, no explanations or markdown formatting:`;

    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: glslPrompt,
    });

    let generatedCode = result.text;
    generatedCode = generatedCode!
      .replace(/```glsl\n?/g, "")
      .replace(/```\n?/g, "");
    generatedCode = generatedCode.trim();

    return generatedCode;
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Prompt required",
        description:
          "Please enter a description for the shader you want to generate.",
        variant: "destructive",
      });
      return;
    }

    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      toast({
        title: "API Key missing",
        description:
          "Please set your NEXT_PUBLIC_GEMINI_API_KEY environment variable.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setGenerationStep("Initializing AI generation...");

    try {
      const progressSteps = [
        "Analyzing prompt...",
        "Generating GLSL structure...",
        "Creating visual algorithms...",
        "Optimizing shader code...",
        "Finalizing shader...",
      ];

      const progressInterval = setInterval(() => {
        setGenerationProgress((prev) => {
          const newProgress = prev + 20;
          if (newProgress < 100) {
            setGenerationStep(
              progressSteps[Math.floor(newProgress / 20)] || "Processing..."
            );
          }
          return Math.min(newProgress, 90);
        });
      }, 800);

      const generatedShader = await generateShaderWithAI(aiPrompt);

      clearInterval(progressInterval);
      setGenerationProgress(100);
      setGenerationStep("Complete!");

      setShaderCode(generatedShader);
      setActiveShader("ai-generated");

      toast({
        title: "Shader generated successfully!",
        description: `Generated shader based on: "${aiPrompt}"`,
      });
    } catch (error) {
      console.error("AI Generation Error:", error);
      toast({
        title: "Generation failed",
        description:
          "Failed to generate shader. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
      setGenerationStep("");
    }
  };

  const downloadShader = () => {
    const element = document.createElement("a");
    const file = new Blob([shaderCode], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `shader-${activeShader}.glsl`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "Shader downloaded",
      description: `The shader-${activeShader}.glsl file has been downloaded.`,
    });
  };

  const copyShaderCode = () => {
    navigator.clipboard.writeText(shaderCode);
    toast({
      title: "Code copied",
      description: "The shader code has been copied to the clipboard.",
    });
  };

  const getShaderCategoryBadge = () => {
    const categories: Record<
      string,
      {
        label: string;
        variant: "default" | "secondary" | "outline" | "destructive";
      }
    > = {
      circles: { label: "Patterns", variant: "default" },
      grid: { label: "Patterns", variant: "default" },
      waves: { label: "Waves", variant: "secondary" },
      fractal: { label: "Fractals", variant: "outline" },
      fire: { label: "Effects", variant: "destructive" },
      plasma: { label: "Effects", variant: "destructive" },
      vortex: { label: "Effects", variant: "destructive" },
      stars: { label: "Space", variant: "secondary" },
      liquid: { label: "Fluids", variant: "outline" },
      kaleidoscope: { label: "Patterns", variant: "default" },
      "ai-generated": { label: "AI Generated", variant: "default" },
    };

    const category = categories[activeShader] || {
      label: "Other",
      variant: "default",
    };

    return <Badge variant={category.variant}>{category.label}</Badge>;
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col gap-6">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">Shader Playground</h1>
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <p className="text-muted-foreground">
              Create and experiment with GLSL fragment shaders
            </p>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={downloadShader}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download shader</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 flex flex-col gap-6">
            <Card className="overflow-hidden border-border">
              <CardHeader className="pb-2 space-y-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CardTitle>Preview</CardTitle>
                    {getShaderCategoryBadge()}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handlePlayPause}
                      className="h-8 w-8"
                    >
                      {isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleReset}
                      className="h-8 w-8"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription className="flex items-center gap-2">
                  <Zap className="h-3 w-3" />
                  Time: {time.toFixed(2)}s
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="bg-black/20 backdrop-blur-sm">
                  <ShaderCanvas
                    fragmentShader={shaderCode}
                    time={time}
                    resolution={resolution}
                    parameters={parameters}
                  />
                </div>
              </CardContent>
              <CardFooter className="pt-4 pb-2">
                <Select value={activeShader} onValueChange={handleShaderSelect}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select shader" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="circles">Concentric Circles</SelectItem>
                    <SelectItem value="grid">Circle Grid</SelectItem>
                    <SelectItem value="waves">Wave Pattern</SelectItem>
                    <SelectItem value="fractal">Julia Fractal</SelectItem>
                    <SelectItem value="fire">Fire Effect</SelectItem>
                    <SelectItem value="plasma">Psychedelic Plasma</SelectItem>
                    <SelectItem value="vortex">Hypnotic Vortex</SelectItem>
                    <SelectItem value="stars">Star Field</SelectItem>
                    <SelectItem value="liquid">Liquid Effect</SelectItem>
                    <SelectItem value="kaleidoscope">Kaleidoscope</SelectItem>
                  </SelectContent>
                </Select>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Parameters</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Info className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Adjust parameters to modify the shader</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <CardDescription>
                  Adjust the parameters to modify the shader in real time
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium">Speed</label>
                        <span className="text-sm text-muted-foreground">
                          {parameters.speed.toFixed(2)}
                        </span>
                      </div>
                      <Slider
                        value={[parameters.speed]}
                        min={0.1}
                        max={5}
                        step={0.1}
                        onValueChange={(value) =>
                          handleParameterChange("speed", value[0])
                        }
                        className="cursor-pointer"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium">Intensity</label>
                        <span className="text-sm text-muted-foreground">
                          {parameters.intensity.toFixed(3)}
                        </span>
                      </div>
                      <Slider
                        value={[parameters.intensity]}
                        min={0.001}
                        max={0.1}
                        step={0.001}
                        onValueChange={(value) =>
                          handleParameterChange("intensity", value[0])
                        }
                        className="cursor-pointer"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium">Scale</label>
                        <span className="text-sm text-muted-foreground">
                          {parameters.scale.toFixed(1)}
                        </span>
                      </div>
                      <Slider
                        value={[parameters.scale]}
                        min={1}
                        max={20}
                        step={0.5}
                        onValueChange={(value) =>
                          handleParameterChange("scale", value[0])
                        }
                        className="cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium">
                          Color Multiplier
                        </label>
                        <span className="text-sm text-muted-foreground">
                          {parameters.colorMultiplier.toFixed(1)}
                        </span>
                      </div>
                      <Slider
                        value={[parameters.colorMultiplier]}
                        min={0.1}
                        max={3}
                        step={0.1}
                        onValueChange={(value) =>
                          handleParameterChange("colorMultiplier", value[0])
                        }
                        className="cursor-pointer"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium">
                          Color Shift
                        </label>
                        <span className="text-sm text-muted-foreground">
                          {parameters.colorShift.toFixed(2)}
                        </span>
                      </div>
                      <Slider
                        value={[parameters.colorShift]}
                        min={0}
                        max={1}
                        step={0.01}
                        onValueChange={(value) =>
                          handleParameterChange("colorShift", value[0])
                        }
                        className="cursor-pointer"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium">
                          Distortion
                        </label>
                        <span className="text-sm text-muted-foreground">
                          {parameters.distortion.toFixed(2)}
                        </span>
                      </div>
                      <Slider
                        value={[parameters.distortion]}
                        min={0}
                        max={1}
                        step={0.01}
                        onValueChange={(value) =>
                          handleParameterChange("distortion", value[0])
                        }
                        className="cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-6">
            <Tabs defaultValue="code" className="flex flex-col">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="code" className="flex items-center gap-1">
                  <Code className="h-4 w-4" />
                  <span>Code</span>
                </TabsTrigger>
                <TabsTrigger value="docs" className="flex items-center gap-1">
                  <FileCode className="h-4 w-4" />
                  <span>Documentation</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="code" className="mt-2">
                <Card className="flex flex-col h-[900px]">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">GLSL Shader</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyShaderCode}
                        className="h-8"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                    <CardDescription>
                      Edit the shader code to see changes in real time
                    </CardDescription>
                  </CardHeader>

                  <div className="px-6 pb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Wand2 className="h-4 w-4 text-primary" />
                        <label className="text-sm font-medium">
                          AI Shader Generation
                        </label>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Describe the shader you want to generate..."
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleAiGenerate();
                            }
                          }}
                          className="flex-1"
                          disabled={isGenerating}
                        />
                        <Button
                          onClick={handleAiGenerate}
                          disabled={isGenerating || !aiPrompt.trim()}
                          size="sm"
                          className="px-3"
                        >
                          {isGenerating ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      {isGenerating && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {generationStep}
                            </span>
                            <span className="text-muted-foreground">
                              {Math.round(generationProgress)}%
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary rounded-full h-2 transition-all duration-300 ease-out"
                              style={{ width: `${generationProgress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <CardContent className="flex-1 p-0">
                    <CodeEditor
                      value={shaderCode}
                      onChange={updateShaderCode}
                      language="glsl"
                      height="100%"
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="docs" className="mt-2">
                <ShaderDocumentation />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
