import * as twgl from 'twgl.js'

export const Create_TWGL_Engine = function(canvasContext: WebGLRenderingContext, vertex_shader: string, fragment_shader: string) {
    let twgl_program = twgl.createProgramInfo(canvasContext, [vertex_shader, fragment_shader]);

    const arrays = {
        position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
      };

    const bufferInfo = twgl.createBufferInfoFromArrays(canvasContext, arrays);
    
}