import WebGLCanvas from '../WebGL/WebglCanvas'
import REGL, {Regl} from 'regl';
import WebglUtility, {GetVideoTex, GetWebcamTex} from '../WebGL/WebglUtility';
import {CreateREGLCommandObj } from './GlitchREGL';
import {DoDelayAction, GetImagePromise} from '../UtilityMethod';
import { Files } from './ThreeBtnStatic';
import { Create_TWGL_Engine } from '../WebGL/twgl_helper';

class GlitchEffect extends WebGLCanvas {
    //#region Parameters
    reglCanvas : Regl;

    webglUtility : WebglUtility;
    reglDrawCommand : REGL.DrawCommand;
    reglFrame : REGL.Cancellable;

    width = 1024;
    height = 750;

    imagePosX = 0.5;
    imagePosY = 0.5;

    _audioDom: HTMLAudioElement;

    _videoDom: HTMLVideoElement;
    _webcamDom: HTMLVideoElement;
    _videoTexture: REGL.Texture2D;
    _webcamTexture: REGL.Texture2D;

    _videoRestartFlag: boolean;
    _imageDetectFlag: boolean;
    _vertexFilePath: string;
    _fragmentFilePath: string;
    _start_btn_dom: HTMLButtonElement;


    constructor(webgl_dom: string, vertexFilePath : string, fragmentFilePath : string) {
        super(webgl_dom);
        this._imageDetectFlag = false;
        this.webglUtility = new WebglUtility();
        this._vertexFilePath = vertexFilePath;
        this._fragmentFilePath = fragmentFilePath;
    }

    reset() {
        
    }

    async on_image_detected() {
        if (this._imageDetectFlag) return;

        this._start_btn_dom = document.querySelector('#video_start_btn');

        console.log('on_image_detected');
        this._imageDetectFlag = true;
        this.SetCanvasSize();
        
        this._start_btn_dom.style.display = 'block';

        this._start_btn_dom.addEventListener('click', async () => {
            this._start_btn_dom.style.display = 'none';

            let main_video : HTMLVideoElement = document.querySelector('#video');
            let aframe_video : HTMLVideoElement = document.querySelector('#arjs-video');
    
            await this.InitProcess(this._vertexFilePath, this._fragmentFilePath);
            main_video.style.display = 'block';
            aframe_video.remove();    
        });
    }

    async InitProcess(vertexFilePath : string, fragmentFilePath : string) {
        await this.SetupWebglPipeline(vertexFilePath, fragmentFilePath);

        this.DrawREGLCavnas(this.reglCanvas, this.reglDrawCommand);
    }

    async SetupWebglPipeline(vertexFilePath : string, fragmentFilePath : string) {
        this.reglCanvas  = await this.CreatREGLCanvas (this._webglDom);
        let glslSetting = await this.webglUtility.PrepareREGLShader(vertexFilePath, fragmentFilePath);
                        //Create_TWGL_Engine(this._context, glslSetting.vertex_shader, glslSetting.fragment_shader);
        //Audio
        // this._audioDom = new Audio(Files.Audio);

        //Texture
        this._videoDom = await GetVideoTex(Files.Video, this.screenWidth, this.screenHeight);
        this._webcamDom = await GetWebcamTex();

        this._videoDom.play();

        this._videoRestartFlag = false;

        this._videoDom.addEventListener("ended", (event) => {
            this._videoDom.currentTime = 0;
            this._videoDom.play();
            this._videoRestartFlag = true;
          });


        // this._videoDom.addEventListener("playing", (event) => {
        //     if (this._videoRestartFlag) {
        //         this._audioDom.currentTime = 0;
        //         this._audioDom.play();
        //         this._videoRestartFlag = false;
        //     }
        // });

        // this._videoDom.addEventListener("pause", (event) => {
        //     console.log("pause");
        //     this._audioDom.pause();
        // });

        // this._videoDom.addEventListener("timeupdate", (event) => {
        //     let diff = Math.abs(this._audioDom.currentTime - this._videoDom.currentTime);

        //     if (this._audioDom.paused && diff > 0.5) {
        //        this._audioDom.currentTime = this._audioDom.currentTime = this._videoDom.currentTime;
        //        this._audioDom.play();                
        //     }
        // });

        await DoDelayAction(200);
        if (this._webcamDom == null)
            this._webcamTexture = this.reglCanvas.texture();
         else 
            this._webcamTexture = this.reglCanvas.texture(this._webcamDom);

        //this._videoTexture = this.reglCanvas.texture(this._videoDom);        

        this.reglDrawCommand  = await CreateREGLCommandObj(this.reglCanvas, glslSetting.vertex_shader, glslSetting.fragment_shader,
            this.aspect_ratio, this._webcamTexture, this._webcamTexture);
    }

    DrawREGLCavnas(regl : Regl, drawCommand : REGL.DrawCommand) {
        let self = this;


        this.reglFrame = regl.frame(function (context) {  
            //Frame Loop
            regl.clear({
                color: [0, 0, 0, 1],
                depth: 1
            });

            self._webcamTexture.subimage(self._webcamDom);
            // self._videoTexture.subimage(self._videoDom);

            drawCommand({});
        });
    }

    SetCanvasSize() {
        super.SetCanvasSize();
    }
}

export default GlitchEffect;