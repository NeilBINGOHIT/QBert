var c1x = 4;
var c1y = -4;
var c1z = 0;
var c2x = 12;
var c2y = -12;
var c2z = 0;
var c3x = 0;
var c3y = -12;
var c3z = 12;
var rand = {};
rand.get = function(begin, end) {
    return Math.floor(Math.random() * (end - begin)) + begin;
}

function creatureOne() {
    return function() {
        if (c1x >= 0 && c1z >= 0 && c1y >= -12) {

            var random = rand.get(1, 5);
            // console.log(random);
            switch (random) {
                case 1: // Left cursor key, step left-top

                    if (c1x - 2 >= 0) {
                        c1x -= 2;
                        c1y += 2;
                    }
                    break;

                case 2: // Right cursor key, step right-bottom

                    if (c1y - 2 >= -12) {
                        c1x += 2;
                        c1y -= 2;
                    }
                    break;

                case 3: // Up cursor key, step right-top

                    if (c1z - 2 >= 0) {
                        c1y += 2;
                        c1z -= 2;
                    }
                    break;

                case 4: // Down cursor key, step left-bottom

                    if (c1y - 2 >= -12) {
                        c1y -= 2;
                        c1z += 2;
                    }
                    break;
            }
        }
    }
}

function creatureTwo() {
    return function() {
        if (c1x >= 0 && c1z >= 0 && c1y >= -12) {

            var random = rand.get(1, 5);
            // console.log(random);
            switch (random) {
                case 1: // Left cursor key, step left-top

                    if (c2x - 2 >= 0) {
                        c2x -= 2;
                        c2y += 2;
                    }
                    break;

                case 2: // Right cursor key, step right-bottom

                    if (c2y - 2 >= -12) {
                        c2x += 2;
                        c2y -= 2;
                    }
                    break;

                case 3: // Up cursor key, step right-top

                    if (c2z - 2 >= 0) {
                        c2y += 2;
                        c2z -= 2;
                    }
                    break;

                case 4: // Down cursor key, step left-bottom

                    if (c2y - 2 >= -12) {
                        c2y -= 2;
                        c2z += 2;
                    }
                    break;
            }
        }
    }
}

function creatureThree() {
    return function() {
        if (c3x >= 0 && c3z >= 0 && c3y >= -12) {
            
            var random = rand.get(1, 5);
            // console.log(random);
            switch (random) {
                case 1: // Left cursor key, step left-top

                    if (c3x - 2 >= 0) {
                        c3x -= 2;
                        c3y += 2;
                    } 
                    break;

                case 2: // Right cursor key, step right-bottom

                    if (c3y - 2 >= -12) {
                        c3x += 2;
                        c3y -= 2;
                    }
                    break;

                case 3: // Up cursor key, step right-top

                    if (c3z - 2 >= 0) {
                        c3y += 2;
                        c3z -= 2;
                    }
                    break;

                case 4: // Down cursor key, step left-bottom

                    if (c3y - 2 >= -12) {
                        c3y -= 2;
                        c3z += 2;
                    }
                    break;
            }
        }

        // console.log(c3x);
        // console.log(c3y);
        // console.log(c3z);
    }
}