
import REGL, {Regl} from 'regl';
import { Clamp } from '../UtilityMethod';
const reglPromise = import('regl');

abstract class WebglCanvas {
    protected _canvasDom : HTMLCanvasElement;
    protected _context : WebGLRenderingContext;
    protected _webglDom : HTMLCanvasElement;
    protected _reglContext : Regl;

    protected screenHeight : number;
    protected screenWidth : number;

    public IsProgramValid : boolean = false;

    public get aspect_ratio() : number {
        return window.innerHeight / window.innerWidth;
    }

    constructor( webglQuery : string) {
        this._webglDom = document.querySelector(webglQuery);
        this._context = this._webglDom.getContext("webgl");

        this.RegisterDomEvent();    
        this.SetCanvasSize();
    }

    protected RegisterDomEvent() {
        window.addEventListener('resize', () => {
            this.SetCanvasSize();
        });
    }

    protected async CreatREGLCanvas(webglDom : HTMLCanvasElement) {
        let regl = await reglPromise;

        return regl.default(webglDom);
    }

    protected SetCanvasSize() {
        this.SetCanvasToSceenSize(this._webglDom);

        this.screenHeight = window.innerHeight;
        this.screenWidth = window.innerWidth ;

        console.log("Browser Aspect ratio " + (window.innerHeight / window.innerWidth));
    }

    public SetCanvasToSceenSize(canvas : HTMLCanvasElement) {
        canvas.width = window.innerWidth * window.devicePixelRatio;
        canvas.height = (window.innerHeight) * window.devicePixelRatio;
    }
}

export default WebglCanvas;