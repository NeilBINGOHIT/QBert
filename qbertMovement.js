var keysdown = {};

var c = document.getElementById("text");
var ctx = c.getContext("2d");

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

// var level2Colors = [
//     [0.449, 0.68, 0.617, 1.0], // Front face
//     [1.0, 1.0, 0.0, 1.0], // Back face
//     [0.871, 0.875, 0.027, 1.0], // Top face
//     [1.0, 0.5, 0.5, 1.0], // Bottom face
//     [0.449, 0.68, 0.617, 1.0], // Right face
//     [1.0, 0.0, 1.0, 1.0] // Left face
// ];

// var level2UnpackedColors = [];
// for (var i in level2Colors) {
//     var color = level2Colors[i];
//     for (var j = 0; j < 4; j++) {
//         level2UnpackedColors = level2UnpackedColors.concat(color);
//     }
// }

var d1x = -4;
var d1y = 6;
var d1z = 6;
var d2x = 6;
var d2y = 6;
var d2z = -4;

var score = 10;
var lives = 3;
$(document).keydown(function(e) {

    if (keysdown[e.keyCode]) {
        return;
    }

    keysdown[e.keyCode] = true;

    var ccCount = 1;

    for (var i = 0; i < colorChanged.length - 1; i++) {
        if (colorChanged[i] === true) {
            score = 10 * (ccCount);
            ccCount += 1;
        }
        if (ccCount === colorChanged.length) {
            console.log("Level Passed!");
            ctx.clearRect(0, 0, 500, 200);
            ctx.font = "30px Georgia";
            var gradient = ctx.createLinearGradient(0, 0, c.width, 0);
            gradient.addColorStop("0", "magenta");
            gradient.addColorStop("0.5", "blue");
            gradient.addColorStop("1.0", "red");
            ctx.fillStyle = gradient;
            ctx.fillText("You have passed this level!", 10, 90);

        }
    };

    if (x >= 0 && z >= 0 && y >= -12) {

        switch (e.keyCode) {
            case 37: // Left cursor key, step left-top

                if (x - 2 >= 0) {
                    x -= 2;
                    y += 2;
                    if (meetCreature()) {
                        isDead();
                    };
                } else if (x === 0 && y === -6) {
                    x = 0;
                    y = 0;
                    z = 0;
                    console.log("jump to the disk");
                    d1x = 0;
                    d1y = 18;
                    d1z = 0;
                } else {
                    isDead();

                }
                break;

            case 39: // Right cursor key, step right-bottom

                if (y - 2 >= -12) {
                    x += 2;
                    y -= 2;
                    if (meetCreature()) {
                        isDead();
                    };
                } else {
                    isDead();
                }
                break;

            case 38: // Up cursor key, step right-top

                if (z - 2 >= 0) {
                    y += 2;
                    z -= 2;
                    if (meetCreature()) {
                        isDead();
                    };
                } else if (z === 0 && y === -6) {
                    x = 0;
                    y = 0;
                    z = 0;
                    console.log("jump to the disk");
                    d2x = 0;
                    d2y = 16;
                    d2z = 0;
                } else {
                    isDead();
                }
                break;

            case 40: // Down cursor key, step left-bottom

                if (y - 2 >= -12) {
                    y -= 2;
                    z += 2;
                    if (meetCreature()) {
                        isDead();
                    };
                } else {
                    isDead();

                }
                break;
        };

    }



});

function meetCreature() {
    if (c1x === x && c1y === y && c1z === z) {
        return true;
    } else if (c2x === x && c2y === y && c2z === z) {
        return true;
    } else if (c3x === x && c3y === y && c3z === z) {
        return true;
    }
}

function isDead() {

    lives--;
    if (lives < 0) {
        lives++
    };
    if (lives === 0) {
        ctx.clearRect(0, 0, 500, 200);
        ctx.font = "30px Georgia";
        var gradient = ctx.createLinearGradient(0, 0, c.width, 0);
        gradient.addColorStop("0", "magenta");
        gradient.addColorStop("0.5", "blue");
        gradient.addColorStop("1.0", "red");
        ctx.fillStyle = gradient;
        ctx.fillText("Game Over", 10, 90);
    };
}

// keyup handler
$(document).keyup(function(e) {
    // Remove this key from the map
    delete keysdown[e.keyCode];
});