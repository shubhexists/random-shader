export const defaultShaders = {
  circles: `void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
  vec2 uv = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;
  
  float d = length(uv);
  
  vec3 col = vec3(1.0, 2.0, 3.0);
  
  d = sin(d*iScale + iTime)/8.;
  d = abs(d);
  
  d = iIntensity / d;
  
  col *= d * iColorMultiplier;
  
  fragColor = vec4(col, 1.0);
}`,

  grid: `void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
  vec2 uv = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;
  
  uv = fract(uv * iScale) - 0.5;
  
  float d = length(uv);
  
  vec3 col = vec3(0.1, 0.3, 0.5);
  
  d = sin(d*8. + iTime)/8.;
  d = abs(d);
  
  d = iIntensity / d;
  
  col = mix(col, vec3(1.0, 0.8, 0.2), d * iColorMultiplier);
  
  fragColor = vec4(col, 1.0);
}`,

  waves: `void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
  vec2 uv = fragCoord / iResolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= iResolution.x / iResolution.y;
  
  float wave = sin(uv.x * iScale + iTime) * cos(uv.y * iScale + iTime);
  wave = abs(wave);
  
  float glow = iIntensity / wave;
  
  vec3 col = vec3(0.2, 0.5, 0.8) * glow * iColorMultiplier;
  
  fragColor = vec4(col, 1.0);
}`,

  fractal: `void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
  vec2 uv = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;
  
  vec2 z = uv * iScale / 10.0;
  vec2 c = z;
  float intensity = 0.0;
  
  for (int i = 0; i < 100; i++) {
    z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c + vec2(sin(iTime * 0.1), cos(iTime * 0.1)) * 0.4;
    if (length(z) > 2.0) break;
    intensity += 1.0;
  }
  
  float color = intensity / 100.0;
  color = pow(color, 0.5) * iColorMultiplier;
  
  vec3 col = vec3(color * 0.5, color, color * 1.5);
  
  fragColor = vec4(col, 1.0);
}`,

  fire: `void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
  vec2 uv = fragCoord / iResolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= iResolution.x / iResolution.y;

  vec2 p = vec2(uv.x, uv.y + 0.5);

  float noise = 0.0;
  for (int i = 1; i < 6; i++) {
    float fi = float(i);
    noise += (sin(p.x*fi*iScale + iTime*fi*0.5) + sin(p.y*fi*iScale + iTime*fi*0.5 + iDistortion)) / fi;
  }

  float y = 1.0 - p.y * 2.0;
  y = max(0.0, y);

  float intensity = y * (0.2 + noise * 0.1) * iIntensity * 50.0;

  vec3 col = vec3(1.5, 0.5, 0.0) * intensity * iColorMultiplier;
  col = mix(col, vec3(1.0, 0.5, 0.0), intensity * 0.5 + iColorShift);

  fragColor = vec4(col, 1.0);
}`,

  plasma: `void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
  vec2 uv = fragCoord / iResolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= iResolution.x / iResolution.y;
  
  float v1 = sin((uv.x * iScale + iTime));
  float v2 = sin((uv.y * iScale + iTime));
  float v3 = sin((uv.x + uv.y) * iScale + iDistortion * 3.0);
  float v4 = sin(sqrt(uv.x * uv.x + uv.y * uv.y) * iScale);
  
  float plasma = (v1 + v2 + v3 + v4) / 4.0;
  
  vec3 col;
  col.r = sin(plasma * 3.14159 + iColorShift * 6.28) * 0.5 + 0.5;
  col.g = sin(plasma * 3.14159 + 2.094 + iColorShift * 6.28) * 0.5 + 0.5;
  col.b = sin(plasma * 3.14159 + 4.188 + iColorShift * 6.28) * 0.5 + 0.5;
  
  col *= iColorMultiplier;
  
  fragColor = vec4(col, 1.0);
}`,

  vortex: `void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
  vec2 uv = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;
  
  float angle = atan(uv.y, uv.x);
  float radius = length(uv);
  
  float spiral = angle + radius * iScale + iTime;
  
  float pattern = sin(spiral * 10.0) * 0.5 + 0.5;
  pattern = pow(pattern, 1.0 + iDistortion * 5.0);
  
  float mask = smoothstep(0.0, 0.1, 1.0 - radius);
  pattern *= mask;
  
  vec3 col1 = vec3(0.2, 0.5, 0.9);
  vec3 col2 = vec3(0.9, 0.2, 0.5);
  vec3 col = mix(col1, col2, iColorShift);
  
  col *= pattern * iIntensity * 50.0 * iColorMultiplier;
  
  fragColor = vec4(col, 1.0);
}`,

  stars: `float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
  vec2 uv = fragCoord / iResolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= iResolution.x / iResolution.y;

  vec3 col = vec3(0.0, 0.02, 0.05);

  for (int i = 0; i < 3; i++) {
    float depth = float(i) * 0.2 + 0.1;
    float scale = mix(iScale, iScale * 2.0, depth);
    vec2 p = fract(uv * scale) - 0.5;
    float brightness = hash(floor(uv * scale) + float(i));
    float star = iIntensity * 50.0 / length(p) * brightness * brightness;
    star *= smoothstep(1.0, 0.0, length(p) * 20.0);
    star *= sin(iTime * brightness * 5.0 + float(i)) * 0.5 + 0.5;
    vec3 starColor = mix(vec3(1.0, 1.0, 1.0), vec3(0.8, 0.9, 1.0), brightness);
    col += star * starColor * depth * iColorMultiplier;
  }

  // Nebula
  vec2 p = uv;
  float noise = 0.0;
  for (int i = 1; i < 5; i++) {
    float fi = float(i);
    p = p * 1.5 + iTime * 0.01 * fi;
    noise += (sin(p.x + p.y * 2.0) + sin(p.y + iDistortion)) / fi;
  }

  vec3 nebulaColor = mix(
    vec3(0.1, 0.2, 0.5),
    vec3(0.5, 0.2, 0.5),
    iColorShift
  );

  col += abs(noise) * 0.1 * nebulaColor;

  fragColor = vec4(col, 1.0);
}`,

  liquid: `void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
  vec2 uv = fragCoord / iResolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= iResolution.x / iResolution.y;
  
  // Distorsión de onda líquida
  float time = iTime * 0.5;
  for (int i = 1; i < 5; i++) {
    float fi = float(i);
    uv.x += 0.02 * sin(uv.y * iScale / fi + time * fi) * iDistortion;
    uv.y += 0.02 * sin(uv.x * iScale / fi + time * fi * 0.8) * iDistortion;
  }
  
  // Patrón de color
  float r = length(uv) * 0.5;
  float angle = atan(uv.y, uv.x);
  
  float intensity = 0.5 + 0.5 * sin(r * iScale - time * 2.0);
  intensity = pow(intensity, 1.0 + iDistortion);
  
  // Colores
  vec3 col1 = vec3(0.0, 0.5, 0.8);
  vec3 col2 = vec3(0.0, 0.2, 0.5);
  vec3 col = mix(col1, col2, intensity + iColorShift);
  
  // Brillo
  float glow = iIntensity * 10.0 * (0.5 + 0.5 * sin(r * 10.0 + angle * 5.0 + time));
  col += glow * vec3(0.0, 0.2, 0.4);
  
  col *= iColorMultiplier;
  
  fragColor = vec4(col, 1.0);
}`,

  kaleidoscope: `void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
  vec2 uv = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;

  // Rotación
  float angle = iTime * 0.2;
  mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
  uv = rot * uv;

  // Efecto caleidoscopio
  float segments = floor(iScale);
  float segmentAngle = 3.14159 * 2.0 / segments;
  float a = atan(uv.y, uv.x);
  a = mod(a, segmentAngle * 2.0);
  a = abs(a - segmentAngle);

  float d = length(uv);
  vec2 p = vec2(cos(a), sin(a)) * d;

  // Distorsión
  p += sin(p * 10.0 + iTime) * iDistortion;

  // Patrón
  float pattern = 0.0;
  for (int i = 0; i < 3; i++) {
    float fi = float(i) + 1.0;
    vec2 q = p * fi + iTime * 0.1 * fi;
    pattern += sin(q.x * 5.0) * sin(q.y * 5.0) / fi;
  }

  // Color
  vec3 col = vec3(0.5 + 0.5 * sin(pattern * 10.0 + iColorShift),
                  0.5 + 0.5 * sin(pattern * 10.0 + 2.0 + iColorShift),
                  0.5 + 0.5 * sin(pattern * 10.0 + 4.0 + iColorShift));

  // Brillo
  float glow = iIntensity / (abs(pattern) * 0.1 + 0.01);
  col *= glow * iColorMultiplier;

  fragColor = vec4(col, 1.0);
}`,
}
