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
    _ending_content_div: HTMLDivElement;
    _redirect_url_btn: HTMLButtonElement;
    _restart_btn: HTMLButtonElement;
    _job_title_icon: HTMLImageElement;
    _scan_icon: HTMLImageElement;

    constructor(webgl_dom: string, vertexFilePath : string, fragmentFilePath : string) {
        super(webgl_dom);
        this._imageDetectFlag = false;
        this.webglUtility = new WebglUtility();
        this._vertexFilePath = vertexFilePath;
        this._fragmentFilePath = fragmentFilePath;
    }

    reset() {
        this._videoDom.currentTime = 0;
        this._videoDom.play();
        this._videoRestartFlag = true;
        this._ending_content_div.style.display = 'none';
        this._videoDom.style.display = 'block';

        setTimeout(() => {
            this._job_title_icon.style.display = 'block';
            this._job_title_icon.classList.add('fadeInAnim');
        }, 11100);
    }

    async on_image_detected() {
        if (this._imageDetectFlag) return;

        this._scan_icon = document.querySelector('.scan_icon');
        this._start_btn_dom = document.querySelector('#video_start_btn');
        this._ending_content_div = document.querySelector('.ending_content');
        this._redirect_url_btn = document.querySelector('#outer_link');
        this._restart_btn = document.querySelector('#restart_btn');
        this._job_title_icon = document.querySelector('.job_title_icon');

        console.log('on_image_detected');
        this._imageDetectFlag = true;
        this.SetCanvasSize();
        
        this._start_btn_dom.style.display = 'block';
        this._scan_icon.style.display = 'none';

        this._start_btn_dom.addEventListener('click', async () => {
            this._start_btn_dom.style.display = 'none';

            setTimeout(() => {
                this._job_title_icon.style.display = 'block';
                this._job_title_icon.classList.add('fadeInAnim');
            }, 11100);
  

            console.log('click');
            let main_video : HTMLVideoElement = document.querySelector('#video');
            let aframe_video : HTMLVideoElement = document.querySelector('#arjs-video');
    
            await this.InitProcess(this._vertexFilePath, this._fragmentFilePath);
            main_video.style.display = 'block';
            aframe_video.remove();    
        });

        this._restart_btn.addEventListener('click', () => {
            this.reset();
        })
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
            // this._videoDom.currentTime = 0;
            // this._videoDom.play();
            // this._videoRestartFlag = true;
            this._ending_content_div.style.display = 'flex';

            this._job_title_icon.style.display = 'none';
            this._job_title_icon.classList.remove('fadeInAnim');

            this._videoDom.style.display = 'none';
        });

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