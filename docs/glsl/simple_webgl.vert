attribute vec4 a_Position;

// all shaders have a main function
void main() {

    // gl_Position is a special variable a vertex shader
    // is responsible for setting
    gl_Position = a_Position;
    gl_PointSize =10.0;
}