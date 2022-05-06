/// <reference path="typings/gl-matrix/gl-matrix.d.ts" />
'use strict';

function create3DContext(width:number, height:number, appendToDocument:Boolean) {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('width', width+'px');
  canvas.setAttribute('height', height+'px');
  document.body.appendChild(canvas);

  const gl = canvas.getContext('webgl');
  return {canvas, gl};  
}

function createShaderProgram(gl, vshader:string, fshader:string, uniforms:Array<string>, attributes:Array<string>) {
  const vs = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vs, document.getElementById(vshader).textContent);
  gl.compileShader(vs);

  const fs = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fs, document.getElementById(fshader).textContent);
  gl.compileShader(fs);

  const program:any = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  
  uniforms.forEach((uniform)=> {
    program[uniform] = gl.getUniformLocation(program, uniform);
  });

  attributes.forEach((attribute)=> {
    let name:string;
    if (attribute[0] === "*") {
      name = attribute.substr(1);
    } else {
      name = attribute;
    }
    program[name] = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(program[name]);
  });
  
  
  program.uPMatrix = gl.getUniformLocation(program, "uPMatrix");
  program.aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
  gl.enableVertexAttribArray(program.aVertexPosition);

  return program;
}

function loadTextureHandler(image, cubeTexture) {
  gl.bindTexture(gl.TEXTURE_2D, cubeTexture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.bindTexture(gl.TEXTURE_2D, null);
}

function loadTexture(gl, src) {
  let texture = gl.createTexture();
  let image = new Image();
  image.onload = loadTextureHandler.bind(null, image, texture);
  image.src = src;
  
  return texture;
}

class Cube {
  static vertices() {
    return new Float32Array([
      // front
      -1.0, -1.0,  1.0,
      1.0, -1.0,  1.0,
      1.0,  1.0,  1.0,
      -1.0,  1.0,  1.0,
      
      // back
      -1.0, -1.0, -1.0,
      -1.0,  1.0, -1.0,
      1.0,  1.0, -1.0,
      1.0, -1.0, -1.0,
      
      // top
      -1.0,  1.0, -1.0,
      -1.0,  1.0,  1.0,
      1.0,  1.0,  1.0,
      1.0,  1.0, -1.0,
      
      // bottom
      -1.0, -1.0, -1.0,
      1.0, -1.0, -1.0,
      1.0, -1.0,  1.0,
      -1.0, -1.0,  1.0,
      
      // right
      1.0, -1.0, -1.0,
      1.0,  1.0, -1.0,
      1.0,  1.0,  1.0,
      1.0, -1.0,  1.0,
      
      // left
      -1.0, -1.0, -1.0,
      -1.0, -1.0,  1.0,
      -1.0,  1.0,  1.0,
      -1.0,  1.0, -1.0
    ]);
  }
  
  static vertexIndices() {
    return new Uint16Array([
      0,  1,  2,      0,  2,  3,    // front
      4,  5,  6,      4,  6,  7,    // back
      8,  9,  10,     8,  10, 11,   // top
      12, 13, 14,     12, 14, 15,   // bottom
      16, 17, 18,     16, 18, 19,   // right
      20, 21, 22,     20, 22, 23    // left
    ]);
  }

  static textureCoordinates() {
    return new Float32Array([
      // Front
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      // Back
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      // Top
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      // Bottom
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      // Right
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      // Left
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0
    ]);
  }
}