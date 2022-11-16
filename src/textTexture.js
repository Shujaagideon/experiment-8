import * as THREE from 'three';


export class TextTexture{
    constructor(deviceSize) {
        this.worble = deviceSize;
        this.size = 64;
        this.radius = this.size * 0.1;
        this.width = this.height = this.size;
        
        this.initTexture();
        this.texture = new THREE.Texture(this.canvas);
    }
      // Initialize our canvas
    initTexture() {
        this.canvas = document.createElement("canvas");
        this.canvas.id = "textTexture";
        this.canvas.width = this.worble.width;
        this.canvas.height = this.worble.height;
        this.ctx = this.canvas.getContext("2d");
        this.clear();
    }
    clear() {
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.font = "100px Acme";
        this.ctx.fillStyle = "White";
        this.ctx.textAlign = "center";
        this.ctx.fillText("Thank You.", this.canvas.width/2, this.canvas.height/2.5);
    }
    update(){
        this.texture.needsUpdate = true;
    }
}