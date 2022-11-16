import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'; 
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'; 
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

import rimVert from './shaders/rim/vertex.glsl';
import rimFrag from './shaders/rim/fragment.glsl';

{/* <script type="text/javascript" src="../libs/shaders/HorizontalBlurShader.js"></script>
<script type="text/javascript" src="../libs/shaders/VerticalBlurShader.js"></script> */}

import subtractVert from './shaders/blendModes/darken/subtractVert.glsl'
import subtractFrag from './shaders/blendModes/darken/subtractFrag.glsl'

import multiplyVert from './shaders/blendModes/darken/multiplyVert.glsl'
import multiplyFrag from './shaders/blendModes/darken/multiplyFrag.glsl'

import colorBurnVert from './shaders/blendModes/darken/colorBurnVert.glsl'
import colorBurnFrag from './shaders/blendModes/darken/colorBurnFrag.glsl'

import addVert from './shaders/blendModes/lighten/addVert.glsl'
import addFrag from './shaders/blendModes/lighten/addFrag.glsl'

import screenVert from './shaders/blendModes/lighten/screenVert.glsl'
import screenFrag from './shaders/blendModes/lighten/screenFrag.glsl'

import colorDodgeVert from './shaders/blendModes/lighten/colorDodgeVert.glsl'
import colorDodgeFrag from './shaders/blendModes/lighten/colorDodgeFrag.glsl'

import sharpVert from './shaders/sharpness/sharpVert.glsl'
import sharpFrag from './shaders/sharpness/sharpFrag.glsl'

import bloomVert from './shaders/bloom/bloomVert.glsl'
import bloomFrag from './shaders/bloom/bloomFrag.glsl'


export default class PostProcessing{
    constructor(scene, renderer, camera, size){
        this.scene = scene;
        this.renderer = renderer;
        this.camera = camera;
        this.size = size;
        // this.customPassMaterial = 

        this.renderTarget = new THREE.WebGLRenderTarget(this.size.width, this.size.height,{
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
            encoding: THREE.sRGBEncoding,
            samples: 4,
        })

        this.effectComposer = new EffectComposer(this.renderer, this.renderTarget);
        this.effectComposer.setSize(this.size.width, this.size.height);

        this.renderPass = new RenderPass(this.scene, this.camera);
        this.effectComposer.addPass(this.renderPass);

        this.customPasses();
    }

    darkenBlendmodes(){
        this.subtract = {
            uniforms:{
                tDiffuse: {value : null},
                factor: {value : 0.6},
            },
            vertexShader : subtractVert,
            fragmentShader : subtractFrag,
        }

        this.multiply = {
            uniforms:{
                tDiffuse: {value : null},
                factor: {value : 0.9},
            },
            vertexShader : multiplyVert,
            fragmentShader : multiplyFrag,
        }

        this.colorBurn = {
            uniforms:{
                tDiffuse: {value : null},
                factor: {value : 0.9},
            },
            vertexShader : colorBurnVert,
            fragmentShader : colorBurnFrag,
        }

        this.subtractPass = new ShaderPass(this.subtract);
        this.multiplyPass = new ShaderPass(this.multiply);
        this.colorBurnPass = new ShaderPass(this.colorBurn);
        this.effectComposer.addPass(this.subtractPass);
        // this.effectComposer.addPass(this.multiplyPass);
        // this.effectComposer.addPass(this.colorBurnPass);
    }

    lightenBlendmodes(){
        this.add = {
            uniforms:{
                tDiffuse: {value : null},
                factor: {value : 0.6},
            },
            vertexShader : addVert,
            fragmentShader : addFrag,
        }

        this.screen = {
            uniforms:{
                tDiffuse: {value : null},
                factor: {value : 0.3},
            },
            vertexShader : screenVert,
            fragmentShader : screenFrag,
        }

        this.colorDodge = {
            uniforms:{
                tDiffuse: {value : null},
                factor: {value : 0.3},
            },
            vertexShader : colorDodgeVert,
            fragmentShader : colorDodgeFrag,
        }

        this.addPass = new ShaderPass(this.add);
        this.screenPass = new ShaderPass(this.screen);
        this.colorDodgePass = new ShaderPass(this.colorDodge);
        this.effectComposer.addPass(this.colorDodgePass);
        this.effectComposer.addPass(this.screenPass);
        this.effectComposer.addPass(this.addPass);
    }

    sharpness(){
        this.sharp = {
            uniforms:{
                tDiffuse: {value : null},
                factor: {value : 1.5},
                v: { value: 1.0 / 1024.0 }
            },
            vertexShader : sharpVert,
            fragmentShader : sharpFrag,
        }

        this.sharpPass = new ShaderPass(this.sharp);
        this.effectComposer.addPass(this.sharpPass);
    }

    blooming(){
        this.bloom = {
            uniforms:{
                tDiffuse: {value : null},
                factor: {value : 0.9},
                v: { value: 1.0 / 1024 }
            },
            vertexShader : bloomVert,
            fragmentShader : bloomFrag,
        }

        this.unrealBloomPass = new UnrealBloomPass();
        this.unrealBloomPass.strength = 1.8;
        this.unrealBloomPass.radius = 1;
        this.unrealBloomPass.threshold = 0.6;

        // this.bloomPass = new ShaderPass(this.bloom);
        // this.effectComposer.addPass(this.bloomPass);
        this.effectComposer.addPass(this.unrealBloomPass);
    }

    ssr(options){
        // this.ssrEffect = new SSREffect(scene, camera, options?)
    }

    customPasses(){
        this.rim = {
            uniforms:{
                tDiffuse: {value : null},
            },
            vertexShader : rimVert,
            fragmentShader : rimFrag,
        }
        this.rimPass = new ShaderPass(this.rim);
        // this.effectComposer.addPass(this.rimPass);
        this.lightenBlendmodes();
        this.blooming();
        this.darkenBlendmodes();
        this.sharpness();
    }

    resize(){
        this.effectComposer.setSize(this.size.width, this.size.height);
    }

    render(){
        this.effectComposer.render();
    }
}