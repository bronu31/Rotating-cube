/// <reference path="typings/gl-matrix/gl-matrix.d.ts" />
/// <reference path="common.ts" />
'use strict';

let {canvas, gl} = create3DContext(600, 400, true);

const program = createShaderProgram(gl, 'shader-vs', 'shader-fs', 
  ['uMVMatrix', 'uPMatrix', 'uSampler'], ['*aVertexPosition', '*aTextureCoord']
);

const bCubeVertices = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, bCubeVertices);
gl.bufferData(gl.ARRAY_BUFFER, Cube.vertices(), gl.STATIC_DRAW);

const bCubeVerticesI = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bCubeVerticesI);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Cube.vertexIndices(), gl.STATIC_DRAW);

const cubeTexture = loadTexture(gl, 'texture.jpg');

const bCubeTextureCoordinates = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, bCubeTextureCoordinates);
gl.vertexAttribPointer(program.aTextureCoord, 2, gl.FLOAT, false, 0, 0);//?

const mvMatrix:any = mat4.create();
const pMatrix:any = mat4.create();
mat4.perspective(pMatrix, 45, canvas.width / canvas.height, 0.1, 100.0);
mat4.identity(mvMatrix);
mat4.translate(mvMatrix, mvMatrix, [0.0, 0.0, -7.0]);

function init() {
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
}

function render() {
  mat4.rotateX(mvMatrix, mvMatrix, 0.01);
  mat4.rotateY(mvMatrix, mvMatrix, 0.015);
  mat4.rotateZ(mvMatrix, mvMatrix, 0.01);
  
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(program);
  gl.uniformMatrix4fv(program.uMVMatrix, false, mvMatrix);
  gl.uniformMatrix4fv(program.uPMatrix, false, pMatrix);
 
  gl.bindBuffer(gl.ARRAY_BUFFER, bCubeVertices);
  gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, bCubeTextureCoordinates);

  gl.bindTexture(gl.TEXTURE_2D, cubeTexture);

  gl.uniform1i(program.uSampler, 0);

  gl.bufferData(gl.ARRAY_BUFFER, Cube.textureCoordinates(), gl.STATIC_DRAW);

  gl.activeTexture(gl.TEXTURE0);
  
  
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bCubeVerticesI);
  gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
  
  requestAnimationFrame(render);
}

init();
render();


