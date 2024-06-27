import './stylesheet/style.scss';
import GlitchEffect from "./Hsinpa/ThreeBtn/GlitchEffect";
import { MobileCheck } from './Hsinpa/UtilityMethod';


const canvas_query = "#canvas_id";
const vert_path = "./glsl/simple_texture.vert";
const frag_path = "./glsl/glitch_effect.frag";

let glitchEffect = new GlitchEffect(canvas_query, vert_path, frag_path);

    // create_video("./texture/04.mp4");
window.onload = function() {
    if (!MobileCheck()) {
        let scan_icon: HTMLImageElement = document.querySelector('.scan_icon');
        let alert_message : HTMLDivElement = document.querySelector('.alert_meesage');

        scan_icon.style.display = 'none';
        alert_message.style.display = 'block';
        document.body.style.backgroundColor = 'gray';

        return;
    }
}

declare let window: any;
window._glich_effect = glitchEffect;


window.onfocus = function() {
    if (glitchEffect._videoRestartFlag) {
        const url = new URL(window.location.href);
        url.searchParams.set('reloadTime', Date.now().toString());
        window.location.href = url.toString();        
    }
}
