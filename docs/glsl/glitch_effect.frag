precision mediump float;
  
uniform sampler2D webcamTex;
uniform sampler2D videoTex;
uniform float video_aspect_ratio;
uniform float webcam_aspect_ratio;

varying vec2 v_uv;

float similarity = 0.35;
float smoothness = 0.2;
float spill = 0.1;
vec3 keyColor = vec3(0.01, 1.0, 0.0);

vec2 RGBtoUV(vec3 rgb) {
  return vec2(
    rgb.r * -0.169 + rgb.g * -0.331 + rgb.b *  0.5    + 0.5,
    rgb.r *  0.5   + rgb.g * -0.419 + rgb.b * -0.081  + 0.5
  );
}

bool isGreen(vec4 color){
    return (color.b < 0.8 * color.g) && ( color.r < 0.64 * color.g );
}

void main () {
    vec2 uv = v_uv;
    float remaining = (video_aspect_ratio - 1.0) * 0.5;

    float webcam_asp = 1.0 - (webcam_aspect_ratio - 1.0);

    float webcam_asp_x = (webcam_aspect_ratio >= 1.0) ? 1.0 : webcam_aspect_ratio;
    float webcam_asp_y = (webcam_aspect_ratio >= 1.0) ? (1.0 - (webcam_aspect_ratio - 1.0)) : 1.0;

    vec4 webcam_color = texture2D(webcamTex, vec2(uv.x * webcam_asp_x, 1.0 - uv.y * webcam_asp_y ));

    vec2 video_uv = vec2( (uv.x * video_aspect_ratio) - remaining , (1.0 - uv.y));
    float revert_scale = 1.25;
    float offset = (revert_scale - 1.0) * 0.5;

    video_uv *= revert_scale;
    video_uv -= vec2(offset,offset);
    vec4 video_color = texture2D(videoTex, video_uv);

    float chromaDist = distance(RGBtoUV(video_color.rgb), RGBtoUV(keyColor));

    float baseMask = chromaDist - similarity;
    float fullMask = pow(clamp(baseMask / smoothness, 0., 1.), 1.5);

    float spillVal = pow(clamp(baseMask / spill, 0., 1.), 1.5);
    float desat = clamp(video_color.r * 0.2126 + video_color.g * 0.7152 + video_color.b * 0.0722, 0., 1.);
    
    //video_color.rgb = mix(webcam_color.rgb, video_color.rgb, spillVal);

    video_color.rgb = webcam_color.rgb;
    video_color.a = 1.0;
    //vec4 mixColor = mix(finalColor, noiseColor, alpha);

    // if (video_color.g >= 0.4) {
    //     if (isGreen(video_color)) {
    //         video_color = webcam_color;
    //     }
    // }

    gl_FragColor = video_color;
}