import REGL, {Regl} from 'regl';
import {GLSLDataSet} from './WebglType';
import {Dictionary} from 'typescript-collections';
import {GetImagePromise} from '../UtilityMethod';

class WebglUtility {

    textureCache : Dictionary<string, HTMLImageElement>;

    constructor() {
        this.textureCache = new Dictionary();
    }


    async PrepareREGLShader(vertFilePath: string, fragFilePath: string) {
        let VertPros = fetch(vertFilePath, {method: 'GET', credentials: 'include'});
        let FragPros = fetch(fragFilePath, {method: 'GET', credentials: 'include'});
    
        return Promise.all([VertPros, FragPros ])
        .then( responses =>
            Promise.all(
                [responses[0].text(), responses[1].text()]
            )
        ).then((values) => {
            let gLSLDataSet : GLSLDataSet = {
                vertex_shader : values[0],
                fragment_shader : values[1],
            };

            return gLSLDataSet; 
        });
    }

    async GetImage(path : string) : Promise<HTMLImageElement> {

        if (this.textureCache.containsKey(path)) {
            return this.textureCache.getValue(path);
        }

        let texture = await GetImagePromise(path);
        this.textureCache.setValue(path, texture);

        return texture;         
    }

}

export default WebglUtility;

export function GetVideoTex(url: string, camera_width: number, camera_height: number) : Promise<HTMLVideoElement> {
    const video : HTMLVideoElement = document.querySelector("#video");
    
    video.playsInline = true;
    video.crossOrigin = "anonymous";
    video.muted = false;

    return new Promise((resolve, reject) => {
        video.addEventListener ("canplaythrough",(event) => {
            // video.play();
            resolve(video);
        }, true);
        
        //video.src = url;
        video.load();
    });
}

export function GetWebcamTex() : Promise<HTMLVideoElement> {  
    let video : HTMLVideoElement = document.querySelector("#webcam");
        video.muted = true;
        video.playsInline = true;

    return new Promise((resolve, reject) => {
        navigator.mediaDevices.getUserMedia({ video: {
            facingMode: 'environment'
        }, audio: false })
        .then(function(stream) {

            video.srcObject = stream;

            video.addEventListener(
                "playing",
            () => {
                resolve(video);
            },
            true
            );

            video.play();
        })
        .catch(function(err) {
            console.log("An error occured! " + err);
            resolve(null);
        });
    });
}