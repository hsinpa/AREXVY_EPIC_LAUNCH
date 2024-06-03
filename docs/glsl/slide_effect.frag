precision mediump float;
  
uniform sampler2D texture;
uniform sampler2D noiseTex;
uniform float time;
uniform float speed;
uniform float strength;
uniform float scale;

varying vec2 v_uv;

void main () {
    float t = (time) * speed;
    vec2 uv = v_uv;
    // vec2 uv = (v_uv - 0.5) * scale + 0.5;

    // if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0 ) {
    //     gl_FragColor = vec4(0,0,0,0);

    //     return;
    // }

    vec4 noiseOffset = texture2D(noiseTex, vec2(uv.x + t,  uv.y + sin(t) * 0.25));
    float normalizeOffset = ( ((noiseOffset.x * 2.0) - 1.0)) * strength;
    vec4 finalColor = texture2D(texture, vec2(uv.x + normalizeOffset * 0.5, uv.y + (normalizeOffset)));

    float _length = length(finalColor);
    float dynamicPower = _length * sin(t) * strength * 5.0;
    
    finalColor.z = (dynamicPower * 0.9)  + (normalizeOffset + finalColor.z) * ( _length);
    finalColor.y = (dynamicPower * 0.6)  + (normalizeOffset + finalColor.y) * (_length);
    finalColor.x = (dynamicPower * 0.4)  + (normalizeOffset + finalColor.x) * (_length);


    gl_FragColor = finalColor;
    //vec4(length, 0.0 , 0.0 , 1.0);
}