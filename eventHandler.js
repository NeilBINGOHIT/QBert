var x = 0;
var y = 0;
var z = 0;

var keysdown = {};

// keydown handler
$(document).keydown(function(e) {

    // Do we already know it's down?
    if (keysdown[e.keyCode]) {
        // Ignore it
        return;
    }

    // Remember it's down
    keysdown[e.keyCode] = true;

    // Do our thing
    if (x >= 0 && z >= 0 && y >= -12) {
        switch (e.keyCode) {
            case 37: // Left cursor key, step left-top

                if (x - 2 >= 0) {
                    x -= 2;
                    y += 2;
                }
                break;

            case 39: // Right cursor key, step right-bottom

                if (y - 2 >= -12) {
                    x += 2;
                    y -= 2;
                }
                break;

            case 38: // Up cursor key, step right-top

                if (z - 2 >= 0) {
                    y += 2;
                    z -= 2;
                }
                break;

            case 40: // Down cursor key, step left-bottom

                if (y - 2 >= -12) {
                    y -= 2;
                    z += 2;
                }
                break;
        };
    }

    
    // colors = [
    //     [1.0, 0.0, 0.0, 1.0], // Front face
    //     [1.0, 1.0, 0.0, 1.0], // Back face
    //     [1.0, 1.0, 1.0, 1.0], // Top face
    //     [1.0, 0.5, 0.5, 1.0], // Bottom face
    //     [0.0, 0.0, 1.0, 1.0], // Right face
    //     [1.0, 0.0, 1.0, 1.0] // Left face
    // ];
    // var unpackedColors = [];
    // for (var i in colors) {
    //     var color = colors[i];
    //     for (var j = 0; j < 4; j++) {
    //         unpackedColors = unpackedColors.concat(color);
    //     }
    // }
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpackedColors), gl.STATIC_DRAW);
    


});

// keyup handler
$(document).keyup(function(e) {
    // Remove this key from the map
    delete keysdown[e.keyCode];
});