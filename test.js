var gl;

function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {}
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}


function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}


var shaderProgram;

function initShaders() {
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}


var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();

function mvPushMatrix() {
    var copy = mat4.create();
    mat4.set(mvMatrix, copy);
    mvMatrixStack.push(copy);
}

function mvPopMatrix() {
    if (mvMatrixStack.length == 0) {
        throw "Invalid popMatrix!";
    }
    mvMatrix = mvMatrixStack.pop();
}


function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}


function degToRad(degrees) {
    return degrees * Math.PI / 180;
}


// var pyramidVertexPositionBuffer;
// var pyramidVertexColorBuffer;
var cubeVertexPositionBuffer = [];
var cubeVertexColorBuffer = [];
var cubeVertexIndexBuffer = [];

function initBuffers() {
    pyramidVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pyramidVertexPositionBuffer);
    var vertices = [
        // Front face
        0.0, 1.0, 0.0, -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,

        // Right face
        0.0, 1.0, 0.0,
        1.0, -1.0, 1.0,
        1.0, -1.0, -1.0,

        // Back face
        0.0, 1.0, 0.0,
        1.0, -1.0, -1.0, -1.0, -1.0, -1.0,

        // Left face
        0.0, 1.0, 0.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    console.log("offset: " + 4 * vertices.length);

    pyramidVertexPositionBuffer.itemSize = 3;
    pyramidVertexPositionBuffer.numItems = 12;

    pyramidVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pyramidVertexColorBuffer);
    var colors = [
        // Front face
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,

        // Right face
        1.0, 0.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 1.0, 0.0, 1.0,

        // Back face
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,

        // Left face
        1.0, 0.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 1.0, 0.0, 1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    pyramidVertexColorBuffer.itemSize = 4;
    pyramidVertexColorBuffer.numItems = 12;



    // creature buffers
    creatureVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, creatureVertexPositionBuffer);
    var vertices = [
        // Front face
        0.0, 1.0, 0.0, -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,
        // Right face
        0.0, 1.0, 0.0,
        1.0, -1.0, 1.0,
        1.0, -1.0, -1.0,
        // Back face
        0.0, 1.0, 0.0,
        1.0, -1.0, -1.0, -1.0, -1.0, -1.0,
        // Left face
        0.0, 1.0, 0.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    creatureVertexPositionBuffer.itemSize = 3;
    creatureVertexPositionBuffer.numItems = 12;

    creatureVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, creatureVertexColorBuffer);
    var colors = [
        // Front face
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        // Right face
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        // Back face
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        // Left face
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    creatureVertexColorBuffer.itemSize = 4;
    creatureVertexColorBuffer.numItems = 12;


    //board buffer
    for (var i = 0; i < 28; i++) {
        cubeVertexPositionBuffer[i] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer[i]);
        var vertices = [
            // Front face
            -1.0, -1.0, 1.0,
            1.0, -1.0, 1.0,
            1.0, 1.0, 1.0, -1.0, 1.0, 1.0,

            // Back face
            -1.0, -1.0, -1.0, -1.0, 1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, -1.0, -1.0,

            // Top face
            -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, -1.0,

            // Bottom face
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0, 1.0, -1.0, -1.0, 1.0,

            // Right face
            1.0, -1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, 1.0, 1.0,
            1.0, -1.0, 1.0,

            // Left face
            -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        // console.log("offset: " + 4 * vertices.length);
        cubeVertexPositionBuffer[i].itemSize = 3;
        cubeVertexPositionBuffer[i].numItems = 24;



        cubeVertexColorBuffer[i] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer[i]);
        var colors = [
            [0.449, 0.68, 0.617, 1.0], // Front face
            [1.0, 1.0, 0.0, 1.0], // Back face
            [0.289, 0.219, 0.930, 1.0], // Top face
            [1.0, 0.5, 0.5, 1.0], // Bottom face
            [0.219, 0.258, 0.258, 1.0], // Right face
            [1.0, 0.0, 1.0, 1.0] // Left face
        ];
        var unpackedColors = [];
        for (var j in colors) {
            var color = colors[j];
            for (var k = 0; k < 4; k++) {
                unpackedColors = unpackedColors.concat(color);
            }
        }
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpackedColors), gl.DYNAMIC_DRAW);
        // console.log("offset: " + 4 * unpackedColors.length);
        cubeVertexColorBuffer[i].itemSize = 4;
        cubeVertexColorBuffer[i].numItems = 24;



        cubeVertexIndexBuffer[i] = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer[i]);
        var cubeVertexIndices = [
            0, 1, 2, 0, 2, 3, // Front face
            4, 5, 6, 4, 6, 7, // Back face
            8, 9, 10, 8, 10, 11, // Top face
            12, 13, 14, 12, 14, 15, // Bottom face
            16, 17, 18, 16, 18, 19, // Right face
            20, 21, 22, 20, 22, 23 // Left face
        ];
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
        cubeVertexIndexBuffer[i].itemSize = 1;
        cubeVertexIndexBuffer[i].numItems = 36;
    };


}


var x = 0;
var y = 0;
var z = 0;

var score = 0;

function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    mat4.ortho(-15 * gl.viewportWidth / gl.viewportHeight, 15 * gl.viewportWidth / gl.viewportHeight, -15, 15, 0.1, 100.0, pMatrix);
    mat4.identity(mvMatrix);
    mat4.lookAt([8, 8, 8], [0, 0, 0], [0, 1, 0], mvMatrix);


    //QBert 
    mvPushMatrix();

    mat4.translate(mvMatrix, [0, 14, 0]);
    mat4.translate(mvMatrix, [x, y, z]);
    gl.bindBuffer(gl.ARRAY_BUFFER, pyramidVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, pyramidVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, pyramidVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, pyramidVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLES, 0, pyramidVertexPositionBuffer.numItems);

    mvPopMatrix();


    //Creature
 //    mvPushMatrix();
 //    mat4.translate(mvMatrix, [0, 14, 0]);
 //    // mat4.translate(mvMatrix, [c1x, c1y, c1z]);

 //    // mat4.translate(mvMatrix, [0.0, 0.0, z]);
 //    // mat4.translate(mvMatrix, [0.0, y, 0.0]);
 //    // mat4.translate(mvMatrix, [x, 0.0, 0.0]);

 //    // console.log("x = " + x);
 //    // console.log("y = " + y);
 //    // console.log("z = " + z);

 //    gl.bindBuffer(gl.ARRAY_BUFFER, creatureVertexPositionBuffer);
 //    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, creatureVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
 //    gl.bindBuffer(gl.ARRAY_BUFFER, creatureVertexColorBuffer);
 //    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, creatureVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
 //    setMatrixUniforms();
 //    gl.drawArrays(gl.TRIANGLES, 0, creatureVertexPositionBuffer.numItems);
	// mvPopMatrix();


    var stepOnColors = [
        [0.449, 0.68, 0.617, 1.0], // Front face
        [1.0, 1.0, 0.0, 1.0], // Back face
        [0.871, 0.875, 0.027, 1.0], // Top face
        [1.0, 0.5, 0.5, 1.0], // Bottom face
        [0.219, 0.258, 0.258, 1.0], // Right face
        [1.0, 0.0, 1.0, 1.0] // Left face
    ];

    var newUnpackedColors = [];
    for (var i in stepOnColors) {
        var color = stepOnColors[i];
        for (var j = 0; j < 4; j++) {
            newUnpackedColors = newUnpackedColors.concat(color);
        }
    }
    var cubeIndex = 0;
    for (var CubeX = 0; CubeX < 13; CubeX += 2) {
        for (var CubeY = 0; CubeY < 13; CubeY += 2) {
            for (var CubeZ = 0; CubeZ < 13; CubeZ += 2) {
                if (CubeX + Math.abs(CubeY) + CubeZ === 12) {
                    // for (var i = 0; i < 3; i++) {
                    mvPushMatrix();

                    mat4.translate(mvMatrix, [CubeX, CubeY, CubeZ]);

                    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer[cubeIndex]);
                    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer[cubeIndex].itemSize, gl.FLOAT, false, 0, 0);
                    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer[cubeIndex]);
                    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cubeVertexColorBuffer[cubeIndex].itemSize, gl.FLOAT, false, 0, 0);

                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer[cubeIndex]);
                    setMatrixUniforms();
                    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer[cubeIndex].numItems, gl.UNSIGNED_SHORT, 0);

                    mvPopMatrix();

                    cubeIndex++;
                };
                if (x === CubeX && Math.abs(y) === (12 - CubeY) && z === CubeZ) {
                    // gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(newUnpackedColors));
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(newUnpackedColors), gl.DYNAMIC_DRAW);

                    score += 10;
                }

            }

        }
    }
};



function tick() {
    // handleKeys();
    drawScene();
    // setTimeout(creatureOne(), 1000);
    requestAnimFrame(tick);
}


function webGLStart() {
    var canvas = document.getElementById("qbertCanvas");

    initGL(canvas);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    initShaders();
    initBuffers();



    // document.onkeydown = handleKeyDown;
    // document.onkeyup = handleKeyUp;

    tick();
}