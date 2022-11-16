import * as THREE from 'three'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import home from './forest_house.glb';
import lamp from './lamp.glb';
import bridge from './wooden_rope_bridge.glb';
import bgimg from './bgimg.png';
import fgimg from './fgimg.png';
import moon from './moon.png';

import vertex from './shaders/vertex.glsl'
import fragment from './shaders/fragment.glsl'
import * as dat from 'dat.gui'
// import datGuiImage from 'dat.gui.image'
// datGuiImage(dat)
import gsap from 'gsap'

window.THREE = THREE;

import { TimelineMax } from 'gsap'
import { OrthographicCamera } from 'three'
import PostProcessing from './postprocessing';
import { Fog } from './fog';
import { TextTexture } from './textTexture';
let OrbitControls = require('three-orbit-controls')(THREE);

// const createInputEvents = require('simple-input-events')
// const event = createInputEvents(window);

const shaders = [];

export default class Template {
    constructor(selector) {
        this.images =[];

        // getting the heights of the containing windows
        this.container = selector;
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;

        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor('#134', 1);
        this.renderer.physicallyCorrectLights = true;
        this.renderer.outputEncoding = THREE.sRGBEncoding;

        this.supportsDepthTextureExtension = !!this.renderer.extensions.get(
            "WEBGL_depth_texture"
        );

        this.pixelRatio = this.renderer.getPixelRatio();

        this.renderTarget = new THREE.WebGLRenderTarget(
            this.width * this.pixelRatio,
            this.height * this.pixelRatio
        );
        this.renderTarget.texture.minFilter = THREE.NearestFilter;
        this.renderTarget.texture.magFilter = THREE.NearestFilter;
        this.renderTarget.texture.generateMipmaps = false;
        this.renderTarget.stencilBuffer = false;
        
        if (this.supportsDepthTextureExtension === true) {
            this.renderTarget.depthTexture = new THREE.DepthTexture();
            this.renderTarget.depthTexture.type = THREE.UnsignedShortType;
            this.renderTarget.depthTexture.minFilter = THREE.NearestFilter;
            this.renderTarget.depthTexture.maxFilter = THREE.NearestFilter;
        }

        this.container.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(
            70, this.width / this.height,
            0.001,
            1000
        );
        this.camera.position.set(0, -1.3, 0);
        this.camera.lookAt(0,-2,0);


        this.packageManager = new THREE.LoadingManager();

        this.packageManager.onProgress = (url, itemsLoaded, itemsTotal) => {
            document.querySelector('#loadPercentage').innerHTML = `${itemsLoaded / itemsTotal * 100 | 0}%`;
        };

        this.packageManager.onLoad = (()=>{
            let tl = gsap.timeline();
            tl.to('#loader',{
                opacity: 0,
                duration: 0.4,
                display: 'none'
            })
            tl.from(this.camera.position,{
                z: 9,
                duration: 10,
                ease: 'Power.easeOut',
                delay: -0.2,
            })
            tl.to(this.camera.position,{
                y: 9,
                duration: 10,
                ease: 'Power.easeOut',
                delay: -6
            })
        })

        this.loader = new GLTFLoader(this.packageManager);

        
        this.time = 0;

        this.light = new THREE.AmbientLight('#fff', 2.5);
        this.scene.add(this.light);
        
        this.fog = new Fog()
        this.scene.fog = new THREE.FogExp2('#245', 0.023);

        this.paused = false; 
        this.materials = [];
        this.meshes = [];

        this.bgimg = new THREE.TextureLoader().load(bgimg);
        this.bgimg.encoding = THREE.sRGBEncoding;

        this.fgimg = new THREE.TextureLoader().load(fgimg);
        this.fgimg.encoding = THREE.sRGBEncoding;

        this.moonImg = new THREE.TextureLoader().load(moon);
        this.moonImg.encoding = THREE.sRGBEncoding;

        this.postprocessing = new PostProcessing(this.scene,this.renderer,this.camera,{width: this.width, height: this.height});
        

        this.textTexture = new TextTexture({height: this.height, width: this.width});
        this.setupResize();
        this.tabEvents();
        this.addObjects();
        this.init();
        this.resize();
        this.render();
        // this.settings();
    }

    ModifyShader_(s){
        console.log(s)
        shaders.push(s);
        s.uniforms.fogTime = {value: 0.0};
    }
    settings() {
        let that = this;
        this.settings = {
            time: 0,
        };
        this.gui = new dat.GUI();
        this.gui.add(this.settings, 'time', 0, 100, 0.01);
        this.gui.addImage(this.settings, 'texturePath').onChange((image) => {
            body.append(image);
        });
    }

    setupResize() {
        window.addEventListener('resize', this.resize.bind(this));
    }

    resize() {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;

        this.imageAspect = 853 / 1280;
        let a1; let a2;
        if (this.height / this.width > this.imageAspect) {
            a1 = (this.width / this.height) * this.imageAspect;
            a2 = 1;
        } else {
            a2 = (this.height / this.width) * this.imageAspect;
            a1 = 1;
        }
        this.material.uniforms.resolution.value.x = this.width;
        this.material.uniforms.resolution.value.y = this.height;
        this.material.uniforms.resolution.value.z = a1;
        this.material.uniforms.resolution.value.w = a2;

        // const dist = this.camera.position.z;
        // const height = 1;
        // this.camera.fov = 2 * (180 / Math.PI) * Math.atan(height / (2 * dist));

        // if (this.width / this.height > 1) {
        //     this.mesh ? this.mesh.scale.x = this.camera.aspect: null;
        //     // this.plane.scale.y = this.camera.aspect;
        // } else {
        //     this.mesh ? this.mesh.scale.y = 1 / this.camera.aspect: null;
        // }

        this.camera.updateProjectionMatrix();
    }

    addObjects() {
        let that = this;
        this.material = new THREE.ShaderMaterial({
            extensions: {
                derivatives: '#extension GL_OES_standard_derivatives : enable'
            },
            defines: {
                DEPTH_PACKING: this.supportsDepthTextureExtension === true ? 0 : 1,
                ORTHOGRAPHIC_CAMERA: 0
            },
            side: THREE.DoubleSide,
            uniforms: {
                time: {
                    value: 0
                },
                threshold: {
                    value: 0.5
                },
                tDudv: {
                    value: null
                },
                tDepth: {
                    value: null
                },
                map: {
                    value: null
                },
                cameraNear: {
                    value: this.camera.near
                },
                cameraFar: {
                    value: this.camera.near
                },
                resolution: {
                    value: new THREE.Vector2(this.width*this.pixelRatio,this.width*this.pixelRatio)
                },
                foamColor: {
                    value: new THREE.Color('#123')
                },
                waterColor: {
                    value: new THREE.Color('#134')
                }
            },
            // wireframe: true,
            // transparent: true,
            vertexShader: vertex,
            fragmentShader: fragment
        });

        this.loader.load(home, gltf=>{
            gltf.scene.scale.multiplyScalar(25);
            gltf.scene.position.y = -2
            gltf.scene.position.x = 0.2
            // gltf.scene.position.z = 15
            gltf.scene.rotation.y = Math.PI/2
            // gltf.scene.rotation.x = Math.PI/2
            gltf.scene.traverse(gltf=>{
                if(gltf.material){
                    // gltf.material.frastumCulling = false;
                    gltf.material.onBeforeCompile = this.ModifyShader_;
                }
            })
            this.scene.add(gltf.scene);
        })

        this.loader.load(lamp, gltf=>{
            // gltf.scene.scale.multiplyScalar(5);
            let radius = 3;

            gltf.scene.traverse(gltf=>{
                if(gltf.material){
                    gltf.material.fog = false;
                    gltf.material.onBeforeCompile = this.ModifyShader_;
                }
            })
            this.lamps = new THREE.Object3D();

            for (let i = 0; i < 15; i++) {
                let model = gltf.scene.clone();
                let x = Math.cos(2 * Math.PI * i/15)* radius;
                let y = Math.sin(2 * Math.PI * i/15)* radius;
                
                // =cos(2πi)
                // =sin(2πi)
                model.position.y = y
                model.position.x = x;
                model.rotation.x = -Math.PI/2

                
                this.lamps.add(model);
            }

            for (let i = 0; i < 15; i++) {
                let model = gltf.scene.clone();
                let x = Math.cos(2 * Math.PI * i/15)* radius + 10;
                let y = Math.sin(2 * Math.PI * i/15)* radius;
                
                // =cos(2πi)
                // =sin(2πi)
                model.position.y = y
                model.position.x = x;
                model.rotation.x = -Math.PI/2

                
                this.lamps.add(model);
            }

            for (let i = 0; i < 8; i++) {
                let model = gltf.scene.clone();
                
                // =cos(2πi)
                // =sin(2πi)
                model.position.y = i - 4
                model.position.x = -8
                model.rotation.x = -Math.PI/2

                
                this.lamps.add(model);
            }

            // gltf.scene.position.x = 38
            this.lamps.position.y = -1
            this.lamps.rotation.x = Math.PI/2
            this.scene.add(this.lamps);
        })

        this.loader.load(bridge, gltf=>{
            gltf.scene.scale.multiplyScalar(0.5);
            gltf.scene.scale.y = 0.38;
            gltf.scene.scale.x = 0.4;
            gltf.scene.position.y = -2
            // gltf.scene.position.x = 38
            gltf.scene.position.z = 5.4
            // gltf.scene.rotation.y = Math.PI/2
            // gltf.scene.rotation.x = Math.PI/2
            gltf.scene.traverse(gltf=>{
                if(gltf.material){
                    // gltf.material.frastumCulling = false;
                    gltf.material.onBeforeCompile = this.ModifyShader_;
                }
            })
            this.scene.add(gltf.scene);
        })

        let dudvMap = new THREE.TextureLoader().load(
            "https://i.imgur.com/hOIsXiZ.png"
        );
        dudvMap.wrapS = dudvMap.wrapT = THREE.RepeatWrapping;

        this.waterGeom = new THREE.PlaneGeometry(100, 80, 80, 80);
        this.waterMaterial = this.material;

        this.water = new THREE.Mesh(this.waterGeom, this.waterMaterial);

        this.waterMaterial.uniforms.tDudv.value = dudvMap;
        this.waterMaterial.uniforms.tDepth.value =
            this.supportsDepthTextureExtension === true
            ? this.renderTarget.depthTexture
            : this.renderTarget.texture;
        this.water.rotation.x = -Math.PI/2
        this.water.position.y = -2
        this.scene.add(this.water);

        this.fg = new THREE.Mesh(
            new THREE.PlaneGeometry(200, 35),
            new THREE.MeshBasicMaterial({
                map: this.fgimg,
                transparent: true,
                color: '#445'
            })
        )
        this.fg.position.z = -40;
        this.fg.position.y = 5;
        this.scene.add(this.fg)
        
        this.bg = new THREE.Mesh(
            new THREE.PlaneGeometry(350, 105),
            new THREE.MeshBasicMaterial({
                map: this.bgimg,
                transparent: true,
                color: '#445'
            })
        )
        this.bg.position.z = -70;
        this.bg.position.y = 35;
        this.scene.add(this.bg)

        this.moon = new THREE.Mesh(
            new THREE.PlaneGeometry(20, 20),
            new THREE.MeshBasicMaterial({
                map: this.moonImg,
                transparent: true,
                color: '#aaa'
            })
        )
        this.moon.position.z = -30;
        this.moon.position.y = 20;
        this.scene.add(this.moon)
    }

    async init() {
        const {generateCausticCanvasTexture} = await import("./waterTexture.js");
        this.material.uniforms.map.value = generateCausticCanvasTexture(0.0000005);
    }

    tabEvents() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stop()
            } else {
                this.play();
            }
        });
    }
    stop() {
        this.paused = true;
    }

    play() {
        this.paused = false;
    }

    render() {
        if (this.paused) return;
        this.camera.lookAt(0,-2,0)
        this.time += 0.05;
        for (let s of shaders) {
            s.uniforms.fogTime.value = this.time;
        }
        this.material.uniforms.time.value = this.time;
        requestAnimationFrame(this.render.bind(this));
        // this.renderer.render(this.scene, this.camera);
        this.postprocessing.render();
    }
}

new Template(document.getElementById('container'));