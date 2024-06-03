import REGL, {Regl} from 'regl';

export function CreateREGLCommandObj(regl : Regl, vertex : string, fragment : string, browser_aspect_ratio: number,
    webcamTex : REGL.Texture2D, videoTex : REGL.Texture2D) {
        
        console.log((webcamTex.height / webcamTex.width) / browser_aspect_ratio);
    return regl({
        frag: fragment,

        vert: vertex,

        blend : {
            enable: true,
            func: {
              srcRGB: 'src alpha',
              srcAlpha: 1,
              dstRGB: 'src alpha',
              dstAlpha: 0
            },
            equation: {
              rgb: 'add',
              alpha: 'add'
            },
            color: [0, 0, 0, 0]
        },
        attributes: {
            a_position: [
                [-1, -1],
                [-1, 1],
                [1, 1],

                [-1, -1],
                [1, 1],
                [1, -1],
                ]
        },

        uniforms: {
            webcamTex : webcamTex,
            videoTex : videoTex,
            video_aspect_ratio : (videoTex.height / videoTex.width) / browser_aspect_ratio,
            webcam_aspect_ratio : (webcamTex.height / webcamTex.width) / browser_aspect_ratio,
        },

        count: 6
    });
}