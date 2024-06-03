precision mediump float;
  
uniform sampler2D texture;
uniform sampler2D noiseTex;
uniform sampler2D distortTex;

uniform float time;
uniform float speed;
uniform float strength;
uniform float scale;
uniform float sea_level;

uniform vec4 thinOceanColor;
uniform vec4 thickOceanColor;
uniform vec4 oceanColor;

varying vec2 v_uv;

#define M_PI 3.1415926535897932384626433832795


float GetRandNumber(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float ToGrayScale(vec4 color) {
    return(color.r * 0.299 + color.g * 0.587 + color.b * 0.114);
}

float Normalize(float val, float min, float max) {
    return (val - min) / (max - min);
}

bool IsWithinSeaLevel(vec2 uv, float t, float offset, float amplititude, float phase, float seaLevel) {
    float waveHeight = (sin(t + (uv.x * phase) + offset) * amplititude) + seaLevel;
    return uv.y < waveHeight;
}

void main () {
    float t = (time) *speed;
    
    float islandFloatingOffset = sin(t) * 0.01 * strength;
    vec4 finalColor = texture2D( texture, vec2(v_uv.x + (islandFloatingOffset * 0.1), v_uv.y + islandFloatingOffset));
    vec4 distColor = texture2D( distortTex, vec2(v_uv.x , v_uv.y));
    vec4 noiseColor = texture2D( noiseTex, vec2(v_uv.x + (t * 0.1) + distColor.x , v_uv.y + distColor.x));

    float seaLevel = sea_level;

    float amplititude = 0.05 * scale;
    float phase = 30.0 * scale;
    float offset = (M_PI);

    float firstSeaLevel = cos(t) * 0.01 + seaLevel;
    bool firstLayerWave = IsWithinSeaLevel(v_uv, t, 0.0, amplititude, phase, firstSeaLevel);
    if (firstLayerWave) {
        finalColor = thinOceanColor;
    }

    float secondSeaLevel = cos(t) * 0.03 + seaLevel - 0.05;
    bool secondLayerWave = IsWithinSeaLevel(v_uv, t, offset, amplititude, phase, secondSeaLevel);
    if (secondLayerWave) {
        finalColor = thickOceanColor;
    }

    float lastSeaLevel = cos(t) * 0.02 + seaLevel - 0.1;
    bool lastLayerWave = IsWithinSeaLevel(v_uv, t, 0.0, amplititude, phase, lastSeaLevel);
    if (lastLayerWave) {
        
        vec4 stripeColor = vec4(0.454, 0.55, 0.745, 1.0);

        finalColor = mix(oceanColor, stripeColor, 1.0 - noiseColor.x);
    }


    gl_FragColor = finalColor;
}