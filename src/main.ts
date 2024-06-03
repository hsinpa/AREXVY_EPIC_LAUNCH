import './stylesheet/style.scss';
import GlitchEffect from "./Hsinpa/ThreeBtn/GlitchEffect";


window.addEventListener("load", function(event) {
    console.log("HJI");

    const canvas_query = "#canvas_id";
    const vert_path = "./glsl/simple_texture.vert";
    const frag_path = "./glsl/glitch_effect.frag";

    let glitchEffect = new GlitchEffect(canvas_query, vert_path, frag_path);
    // create_video("./texture/04.mp4");
});