"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Lightbulb, Code, Wand2 } from "lucide-react";

export default function ShaderDocumentation() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Shader Documentation</CardTitle>
          <Wand2 className="h-4 w-4 text-primary" />
        </div>
        <CardDescription>
          Learn about GLSL shaders and how to use them
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto pr-2">
        <Tabs defaultValue="basics">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="basics">Basics</TabsTrigger>
            <TabsTrigger value="functions">Functions</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>

          <TabsContent value="basics">
            <Alert className="mb-4 bg-primary/10 border-primary/20">
              <Info className="h-4 w-4" />
              <AlertTitle>Tip</AlertTitle>
              <AlertDescription>
                Shaders are programs that run on the GPU to render graphics in
                real time.
              </AlertDescription>
            </Alert>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="intro">
                <AccordionTrigger>Introduction to Shaders</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">
                    Shaders are programs that run on the GPU and determine how
                    pixels are rendered. Fragment shaders (also called pixel
                    shaders) calculate the color of each pixel.
                  </p>
                  <p>
                    In our playground, we use GLSL (OpenGL Shading Language) to
                    write fragment shaders that create visual effects, patterns
                    and animations.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="parameters">
                <AccordionTrigger>Input/Output Parameters</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">
                    The main function in our shaders is{" "}
                    <code className="bg-muted px-1 rounded">
                      mainImage(out vec4 fragColor, in vec2 fragCoord)
                    </code>
                    :
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <code className="bg-muted px-1 rounded">fragColor</code>:
                      Output pixel color (RGBA)
                    </li>
                    <li>
                      <code className="bg-muted px-1 rounded">fragCoord</code>:
                      Pixel coordinates (x, y)
                    </li>
                  </ul>
                  <p className="mt-2">
                    Other important inputs are provided as uniforms:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <code className="bg-muted px-1 rounded">iTime</code>:
                      Current time in seconds
                    </li>
                    <li>
                      <code className="bg-muted px-1 rounded">iResolution</code>
                      : Canvas resolution (width, height)
                    </li>
                    <li>
                      <code className="bg-muted px-1 rounded">iIntensity</code>:
                      Visual effect intensity
                    </li>
                    <li>
                      <code className="bg-muted px-1 rounded">iScale</code>:
                      Pattern or effect scale
                    </li>
                    <li>
                      <code className="bg-muted px-1 rounded">
                        iColorMultiplier
                      </code>
                      : Color intensity multiplier
                    </li>
                    <li>
                      <code className="bg-muted px-1 rounded">iColorShift</code>
                      : Color shift for effects
                    </li>
                    <li>
                      <code className="bg-muted px-1 rounded">iDistortion</code>
                      : Applied distortion level
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="coordinates">
                <AccordionTrigger>UV Coordinates</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">
                    UV coordinates are normalized coordinates that range from 0
                    to 1 across the canvas. They are essential for creating
                    resolution-independent effects.
                  </p>
                  <p className="mb-2">
                    To convert from pixel coordinates to UV:
                  </p>
                  <pre className="bg-muted p-2 rounded overflow-x-auto">
                    <code>vec2 uv = fragCoord / iResolution.xy;</code>
                  </pre>
                  <p className="mt-2">
                    To center coordinates (range from -0.5 to 0.5):
                  </p>
                  <pre className="bg-muted p-2 rounded overflow-x-auto">
                    <code>uv = uv - 0.5;</code>
                  </pre>
                  <p className="mt-2">
                    To correct aspect ratio (avoid stretching):
                  </p>
                  <pre className="bg-muted p-2 rounded overflow-x-auto">
                    <code>uv.x *= iResolution.x / iResolution.y;</code>
                  </pre>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="colors">
                <AccordionTrigger>Working with Colors</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">
                    Colors in GLSL are represented as vectors:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <code className="bg-muted px-1 rounded">vec3</code>: RGB
                      color (red, green, blue)
                    </li>
                    <li>
                      <code className="bg-muted px-1 rounded">vec4</code>: RGBA
                      color (red, green, blue, alpha)
                    </li>
                  </ul>
                  <p className="mt-2">Each component ranges from 0.0 to 1.0:</p>
                  <pre className="bg-muted p-2 rounded overflow-x-auto">
                    <code>
                      vec3 red = vec3(1.0, 0.0, 0.0);
                      <br />
                      vec3 green = vec3(0.0, 1.0, 0.0);
                      <br />
                      vec3 blue = vec3(0.0, 0.0, 1.0);
                      <br />
                      vec3 white = vec3(1.0);
                      <br />
                      vec3 gray = vec3(0.5);
                      <br />
                      vec3 black = vec3(0.0);
                    </code>
                  </pre>
                  <p className="mt-2">You can blend colors:</p>
                  <pre className="bg-muted p-2 rounded overflow-x-auto">
                    <code>vec3 purple = mix(red, blue, 0.5);</code>
                  </pre>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="sdf">
                <AccordionTrigger>
                  Signed Distance Functions (SDF)
                </AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">
                    SDFs define the distance from a point to the nearest surface
                    of a shape. They are powerful tools for creating shapes in
                    shaders.
                  </p>
                  <p className="mb-2">Common SDFs:</p>
                  <pre className="bg-muted p-2 rounded overflow-x-auto">
                    <code>
                      // Circle
                      <br />
                      float circleSDF(vec2 p, float r) {"{"}
                      <br />
                      &nbsp;&nbsp;return length(p) - r;
                      <br />
                      {"}"}
                      <br />
                      <br />
                      // Rectangle
                      <br />
                      float rectSDF(vec2 p, vec2 b) {"{"}
                      <br />
                      &nbsp;&nbsp;vec2 d = abs(p) - b;
                      <br />
                      &nbsp;&nbsp;return length(max(d, 0.0)) + min(max(d.x,
                      d.y), 0.0);
                      <br />
                      {"}"}
                      <br />
                    </code>
                  </pre>
                  <p className="mt-2">
                    To render an SDF, use the step or smoothstep function:
                  </p>
                  <pre className="bg-muted p-2 rounded overflow-x-auto">
                    <code>
                      // Hard edge
                      <br />
                      float shape = step(0.0, -circleSDF(uv, 0.25));
                      <br />
                      <br />
                      // Soft edge
                      <br />
                      float shape = smoothstep(0.01, -0.01, circleSDF(uv,
                      0.25));
                    </code>
                  </pre>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          <TabsContent value="functions">
            <Alert className="mb-4 bg-primary/10 border-primary/20">
              <Lightbulb className="h-4 w-4" />
              <AlertTitle>Tip</AlertTitle>
              <AlertDescription>
                Combine different mathematical functions to create complex
                visual effects.
              </AlertDescription>
            </Alert>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="math">
                <AccordionTrigger>Mathematical Functions</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">sin(), cos(), tan()</h4>
                      <p>
                        Trigonometric functions, useful for creating
                        oscillations and waves.
                      </p>
                      <pre className="bg-muted p-2 rounded overflow-x-auto mt-1">
                        <code>float wave = sin(uv.x * 10.0 + iTime);</code>
                      </pre>
                    </div>

                    <div>
                      <h4 className="font-medium">abs()</h4>
                      <p>Returns the absolute value of a number.</p>
                      <pre className="bg-muted p-2 rounded overflow-x-auto mt-1">
                        <code>
                          float symmetricWave = abs(sin(uv.x * 10.0 + iTime));
                        </code>
                      </pre>
                    </div>

                    <div>
                      <h4 className="font-medium">length()</h4>
                      <p>Returns the length (magnitude) of a vector.</p>
                      <pre className="bg-muted p-2 rounded overflow-x-auto mt-1">
                        <code>float distFromCenter = length(uv);</code>
                      </pre>
                    </div>

                    <div>
                      <h4 className="font-medium">fract()</h4>
                      <p>
                        Returns the fractional part of a number (x - floor(x)).
                      </p>
                      <pre className="bg-muted p-2 rounded overflow-x-auto mt-1">
                        <code>vec2 repeatingUV = fract(uv * 4.0);</code>
                      </pre>
                    </div>

                    <div>
                      <h4 className="font-medium">pow()</h4>
                      <p>Raises the base to the power of the exponent.</p>
                      <pre className="bg-muted p-2 rounded overflow-x-auto mt-1">
                        <code>float falloff = pow(distFromCenter, 3.0);</code>
                      </pre>
                    </div>

                    <div>
                      <h4 className="font-medium">exp()</h4>
                      <p>
                        Returns the natural exponentiation of a value (e^x).
                      </p>
                      <pre className="bg-muted p-2 rounded overflow-x-auto mt-1">
                        <code>float glow = exp(-10.0 * distFromCenter);</code>
                      </pre>
                    </div>

                    <div>
                      <h4 className="font-medium">1/x (Reciprocal)</h4>
                      <p>
                        Creates interesting effects when applied to distance
                        fields.
                      </p>
                      <pre className="bg-muted p-2 rounded overflow-x-auto mt-1">
                        <code>float glow = 0.02 / distFromCenter;</code>
                      </pre>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="step">
                <AccordionTrigger>step() and smoothstep()</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">step(edge, x)</h4>
                      <p>
                        Returns 0.0 if x is less than edge, and 1.0 otherwise.
                        Creates hard edges.
                      </p>
                      <pre className="bg-muted p-2 rounded overflow-x-auto mt-1">
                        <code>
                          float circle = step(0.25, length(uv)); // 1.0 outside,
                          0.0 inside
                        </code>
                      </pre>
                    </div>

                    <div>
                      <h4 className="font-medium">
                        smoothstep(edge0, edge1, x)
                      </h4>
                      <p>
                        Smooth transition between 0.0 and 1.0 when x is between
                        edge0 and edge1.
                      </p>
                      <pre className="bg-muted p-2 rounded overflow-x-auto mt-1">
                        <code>
                          float softCircle = smoothstep(0.24, 0.26, length(uv));
                        </code>
                      </pre>
                    </div>

                    <p>
                      These functions are essential for creating shapes with
                      hard or soft edges. They are often used with SDFs to
                      render shapes.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="swizzling">
                <AccordionTrigger>Swizzling</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">
                    Swizzling is a feature that allows you to create new vectors
                    by rearranging or duplicating components from existing
                    vectors.
                  </p>
                  <pre className="bg-muted p-2 rounded overflow-x-auto">
                    <code>
                      vec2 xy = vec2(1.0, 2.0);
                      <br />
                      vec2 yx = xy.yx; // vec2(2.0, 1.0)
                      <br />
                      <br />
                      vec3 rgb = vec3(1.0, 0.5, 0.2);
                      <br />
                      vec3 bgr = rgb.bgr; // vec3(0.2, 0.5, 1.0)
                      <br />
                      <br />
                      vec4 rgba = vec4(1.0, 0.5, 0.2, 1.0);
                      <br />
                      vec2 rg = rgba.rg; // vec2(1.0, 0.5)
                      <br />
                      vec3 gba = rgba.gba; // vec3(0.5, 0.2, 1.0)
                    </code>
                  </pre>
                  <p className="mt-2">You can also duplicate components:</p>
                  <pre className="bg-muted p-2 rounded overflow-x-auto">
                    <code>
                      vec2 xy = vec2(1.0, 2.0);
                      <br />
                      vec3 xxy = xy.xxy; // vec3(1.0, 1.0, 2.0)
                      <br />
                      vec4 xyxy = xy.xyxy; // vec4(1.0, 2.0, 1.0, 2.0)
                    </code>
                  </pre>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="iterations">
                <AccordionTrigger>Iterations and Loops</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">
                    Loops are powerful for creating complex patterns and
                    fractals.
                  </p>
                  <pre className="bg-muted p-2 rounded overflow-x-auto">
                    <code>
                      float pattern = 0.0;
                      <br />
                      vec2 p = uv;
                      <br />
                      <br />
                      for (int i = 0; i {"<"} 5; i++) {"{"}
                      <br />
                      &nbsp;&nbsp;p = fract(p * 2.0) - 0.5;
                      <br />
                      &nbsp;&nbsp;float d = length(p);
                      <br />
                      &nbsp;&nbsp;pattern += exp(-d * 8.0);
                      <br />
                      {"}"}
                      <br />
                      <br />
                      fragColor = vec4(vec3(pattern), 1.0);
                    </code>
                  </pre>
                  <p className="mt-2">
                    Note: Loops in shaders must have a fixed number of
                    iterations for better performance.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          <TabsContent value="examples">
            <Alert className="mb-4 bg-primary/10 border-primary/20">
              <Code className="h-4 w-4" />
              <AlertTitle>Tip</AlertTitle>
              <AlertDescription>
                Experiment by modifying these examples to create your own visual
                effects.
              </AlertDescription>
            </Alert>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Concentric Circles</h3>
                <pre className="bg-muted p-3 rounded overflow-x-auto text-sm">
                  <code>
                    void mainImage( out vec4 fragColor, in vec2 fragCoord ){" "}
                    {"{"}
                    <br />
                    &nbsp;&nbsp;vec2 uv = (fragCoord * 2.0 - iResolution.xy) /
                    iResolution.y;
                    <br />
                    <br />
                    &nbsp;&nbsp;float d = length(uv);
                    <br />
                    <br />
                    &nbsp;&nbsp;vec3 col = vec3(1.0, 2.0, 3.0);
                    <br />
                    <br />
                    &nbsp;&nbsp;d = sin(d*iScale + iTime)/8.;
                    <br />
                    &nbsp;&nbsp;d = abs(d);
                    <br />
                    <br />
                    &nbsp;&nbsp;d = iIntensity / d;
                    <br />
                    <br />
                    &nbsp;&nbsp;col *= d * iColorMultiplier;
                    <br />
                    <br />
                    &nbsp;&nbsp;fragColor = vec4(col, 1.0);
                    <br />
                    {"}"}
                  </code>
                </pre>
                <p className="mt-2 text-muted-foreground">
                  Creates pulsing concentric circles with a glow effect.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Fire Effect</h3>
                <pre className="bg-muted p-3 rounded overflow-x-auto text-sm">
                  <code>
                    void mainImage( out vec4 fragColor, in vec2 fragCoord ){" "}
                    {"{"}
                    <br />
                    &nbsp;&nbsp;vec2 uv = fragCoord / iResolution.xy;
                    <br />
                    &nbsp;&nbsp;uv = uv * 2.0 - 1.0;
                    <br />
                    &nbsp;&nbsp;uv.x *= iResolution.x / iResolution.y;
                    <br />
                    <br />
                    &nbsp;&nbsp;vec2 p = vec2(uv.x, uv.y + 0.5);
                    <br />
                    <br />
                    &nbsp;&nbsp;float noise = 0.0;
                    <br />
                    &nbsp;&nbsp;for (int i = 1; i {"<"} 6; i++) {"{"}
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;float fi = float(i);
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;noise += (sin(p.x*fi*iScale +
                    iTime*fi*0.5) + sin(p.y*fi*iScale + iTime*fi*0.5 +
                    iDistortion)) / fi;
                    <br />
                    &nbsp;&nbsp;{"}"}
                    <br />
                    <br />
                    &nbsp;&nbsp;float y = 1.0 - p.y * 2.0;
                    <br />
                    &nbsp;&nbsp;y = max(0.0, y);
                    <br />
                    <br />
                    &nbsp;&nbsp;float intensity = y * (0.2 + noise * 0.1) *
                    iIntensity * 50.0;
                    <br />
                    <br />
                    &nbsp;&nbsp;vec3 col = vec3(1.5, 0.5, 0.0) * intensity *
                    iColorMultiplier;
                    <br />
                    &nbsp;&nbsp;col = mix(col, vec3(1.0, 0.5, 0.0), intensity *
                    0.5 + iColorShift);
                    <br />
                    <br />
                    &nbsp;&nbsp;fragColor = vec4(col, 1.0);
                    <br />
                    {"}"}
                  </code>
                </pre>
                <p className="mt-2 text-muted-foreground">
                  Creates an animated fire effect with warm colors and organic
                  movement.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Starfield</h3>
                <pre className="bg-muted p-3 rounded overflow-x-auto text-sm">
                  <code>
                    float hash(vec2 p) {"{"}
                    <br />
                    &nbsp;&nbsp;p = fract(p * vec2(123.34, 456.21));
                    <br />
                    &nbsp;&nbsp;p += dot(p, p + 45.32);
                    <br />
                    &nbsp;&nbsp;return fract(p.x * p.y);
                    <br />
                    {"}"}
                    <br />
                    <br />
                    void mainImage( out vec4 fragColor, in vec2 fragCoord ){" "}
                    {"{"}
                    <br />
                    &nbsp;&nbsp;vec2 uv = fragCoord / iResolution.xy;
                    <br />
                    &nbsp;&nbsp;uv = uv * 2.0 - 1.0;
                    <br />
                    &nbsp;&nbsp;uv.x *= iResolution.x / iResolution.y;
                    <br />
                    <br />
                    &nbsp;&nbsp;vec3 col = vec3(0.0, 0.02, 0.05);
                    <br />
                    <br />
                    &nbsp;&nbsp;for (int i = 0; i {"<"} 3; i++) {"{"}
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;float depth = float(i) * 0.2 + 0.1;
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;float scale = mix(iScale, iScale *
                    2.0, depth);
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;vec2 p = fract(uv * scale) - 0.5;
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;float brightness = hash(floor(uv *
                    scale) + float(i));
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;float star = iIntensity * 50.0 /
                    length(p) * brightness * brightness;
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;star *= smoothstep(1.0, 0.0,
                    length(p) * 20.0);
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;star *= sin(iTime * brightness * 5.0
                    + float(i)) * 0.5 + 0.5;
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;vec3 starColor = mix(vec3(1.0, 1.0,
                    1.0), vec3(0.8, 0.9, 1.0), brightness);
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;col += star * starColor * depth *
                    iColorMultiplier;
                    <br />
                    &nbsp;&nbsp;{"}"}
                    <br />
                    <br />
                    &nbsp;&nbsp;// Nebula
                    <br />
                    &nbsp;&nbsp;vec2 p = uv;
                    <br />
                    &nbsp;&nbsp;float noise = 0.0;
                    <br />
                    &nbsp;&nbsp;for (int i = 1; i {"<"} 5; i++) {"{"}
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;float fi = float(i);
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;p = p * 1.5 + iTime * 0.01 * fi;
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;noise += (sin(p.x + p.y * 2.0) +
                    sin(p.y + iDistortion)) / fi;
                    <br />
                    &nbsp;&nbsp;{"}"}
                    <br />
                    <br />
                    &nbsp;&nbsp;vec3 nebulaColor = mix(
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;vec3(0.1, 0.2, 0.5),
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;vec3(0.5, 0.2, 0.5),
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;iColorShift
                    <br />
                    &nbsp;&nbsp;);
                    <br />
                    <br />
                    &nbsp;&nbsp;col += abs(noise) * 0.1 * nebulaColor;
                    <br />
                    <br />
                    &nbsp;&nbsp;fragColor = vec4(col, 1.0);
                    <br />
                    {"}"}
                  </code>
                </pre>
                <p className="mt-2 text-muted-foreground">
                  Creates a starfield with background nebula, perfect for space
                  effects.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Kaleidoscope</h3>
                <pre className="bg-muted p-3 rounded overflow-x-auto text-sm">
                  <code>
                    void mainImage( out vec4 fragColor, in vec2 fragCoord ){" "}
                    {"{"}
                    <br />
                    &nbsp;&nbsp;vec2 uv = (fragCoord * 2.0 - iResolution.xy) /
                    iResolution.y;
                    <br />
                    <br />
                    &nbsp;&nbsp;// Rotation
                    <br />
                    &nbsp;&nbsp;float angle = iTime * 0.2;
                    <br />
                    &nbsp;&nbsp;mat2 rot = mat2(cos(angle), -sin(angle),
                    sin(angle), cos(angle));
                    <br />
                    &nbsp;&nbsp;uv = rot * uv;
                    <br />
                    <br />
                    &nbsp;&nbsp;// Kaleidoscope effect
                    <br />
                    &nbsp;&nbsp;float segments = floor(iScale);
                    <br />
                    &nbsp;&nbsp;float segmentAngle = 3.14159 * 2.0 / segments;
                    <br />
                    &nbsp;&nbsp;float a = atan(uv.y, uv.x);
                    <br />
                    &nbsp;&nbsp;a = mod(a, segmentAngle * 2.0);
                    <br />
                    &nbsp;&nbsp;a = abs(a - segmentAngle);
                    <br />
                    <br />
                    &nbsp;&nbsp;float d = length(uv);
                    <br />
                    &nbsp;&nbsp;vec2 p = vec2(cos(a), sin(a)) * d;
                    <br />
                    <br />
                    &nbsp;&nbsp;// Distortion
                    <br />
                    &nbsp;&nbsp;p += sin(p * 10.0 + iTime) * iDistortion;
                    <br />
                    <br />
                    &nbsp;&nbsp;// Pattern
                    <br />
                    &nbsp;&nbsp;float pattern = 0.0;
                    <br />
                    &nbsp;&nbsp;for (int i = 0; i {"<"} 3; i++) {"{"}
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;float fi = float(i) + 1.0;
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;vec2 q = p * fi + iTime * 0.1 * fi;
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;pattern += sin(q.x * 5.0) * sin(q.y
                    * 5.0) / fi;
                    <br />
                    &nbsp;&nbsp;{"}"}
                    <br />
                    <br />
                    &nbsp;&nbsp;// Color
                    <br />
                    &nbsp;&nbsp;vec3 col = vec3(0.5 + 0.5 * sin(pattern * 10.0 +
                    iColorShift),
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.5
                    + 0.5 * sin(pattern * 10.0 + 2.0 + iColorShift),
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.5
                    + 0.5 * sin(pattern * 10.0 + 4.0 + iColorShift));
                    <br />
                    <br />
                    &nbsp;&nbsp;// Brightness
                    <br />
                    &nbsp;&nbsp;float glow = iIntensity / (abs(pattern) * 0.1 +
                    0.01);
                    <br />
                    &nbsp;&nbsp;col *= glow * iColorMultiplier;
                    <br />
                    <br />
                    &nbsp;&nbsp;fragColor = vec4(col, 1.0);
                    <br />
                    {"}"}
                  </code>
                </pre>
                <p className="mt-2 text-muted-foreground">
                  Create a kaleidoscope effect with symmetrical patterns and
                  changing colors.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
