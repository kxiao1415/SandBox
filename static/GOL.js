$(document).ready(function(){
    var gridSize = 15;
    var inactiveColor = "#333333";
    var activeColor = "white";
    var alive;
    var saveWorld = true;

    var canvas = document.getElementById('GameOfLife');

    // get the "2d" context
    var context = canvas.getContext('2d');

    // change fill style to orange
    context.fillStyle = inactiveColor;

    // create squares in a loop
    for(var x = 0; x < canvas.width; x += 15){
        for(var y = 0; y < canvas.height; y += 15){
            context.fillRect(x, y, 14, 14);
        }
    }

    //initiate the matrix 0
    function initiate(matrix, m, n) {
        for(var i = 0; i < m; i++) {
            matrix.push([]);
            for(var j = 0; j < n; j++) {
                matrix[i].push(0);
            }
        }
    }

    //clear the world
    function clear(aWorld) {
        var height = aWorld.map.length;
        var width = aWorld.map[0].length;

        for(var i = 0; i < height; i++) {
            for(var j = 0; j < width; j++){
                aWorld.map[i][j] = 0;
            }
        }

        aWorld.generation = 0;
    }

    var w = canvas.width/gridSize;
    var h = canvas.height/gridSize;

    //definite world object
    function world(height, width){
        this.map=[];
        initiate(this.map, height, width);
        this.generation = 0;
    }

    var myWorld = new world(h, w);
    var copyWorld = new world(h,w);


    function neighborSum(map, i, j) {
        var sum = 0;

        function isLive(x, y) {
            return map[x] && map[x][y];
        }

        if (isLive(i-1, j-1)) sum++;
        if (isLive(i-1, j)) sum++;
        if (isLive(i-1, j+1)) sum++;
        if (isLive(i, j+1)) sum++;
        if (isLive(i+1, j+1)) sum++;
        if (isLive(i+1, j)) sum++;
        if (isLive(i+1, j-1)) sum++;
        if (isLive(i, j-1)) sum++;

        return sum;
    }

    function nextGeneration(map) {
        var sum = 0;
        var m = map.length;
        var n = map[0].length;
        //clone a map
        var mapCopy = [];
        for(var i = 0; i < m; i++) {
            mapCopy.push([]);
            for(var j = 0; j < n; j++) {
                mapCopy[i].push(map[i][j]);
            }
        }

        for(var i = 0; i < m; i++) {
            for(var j = 0; j < n; j++){
                sum = neighborSum(map, i, j);
                if (map[i][j] == 1) {
                    if (sum > 3 || sum < 2) {
                        mapCopy[i][j] = 0;
                    }
                } else {
                    if (sum == 3) {
                        mapCopy[i][j] = 1;
                    }
                }
            }
        }

        return mapCopy;
    }

    function liveOn(world) {
        var next = nextGeneration(world.map);
        draw(next);
        return next;
    }

    function fill(s, gx, gy) {
        context.fillStyle = s;
        context.fillRect(gx * gridSize, gy * gridSize, gridSize-1, gridSize-1);
    }

    function draw(world) {
        var m = world.map.length;
        var n = world.map[0].length;

        for(var i = 0; i < m; i++){
            for(var j = 0; j < n; j++){
                if (world.map[i][j] == 0){
                   fill(inactiveColor, j, i);
                } else {
                    fill(activeColor, j, i);
                }
            }
        }

        $('#age').html('&nbsp;' + world.generation);
    }

    $(canvas).click(function(e) {

        var mx = e.offsetX;
        var my = e.offsetY;

        var gx = ~~(mx / gridSize);
        var gy = ~~(my / gridSize);

        if (gx < 0 || gx >= w || gy < 0 || gy >= h) {
            return;
        }

        if(copyWorld.map[gy][gx] == 0) {
            copyWorld.map[gy][gx] = 1;
            fill(activeColor, gx, gy);
        } else {
            copyWorld.map[gy][gx] = 0;
            fill(inactiveColor, gx, gy);
        }
    });

    //setTimeout in a loop
    function liveOn() {
        (function myLoop() {
            alive = setTimeout(function () {
                copyWorld.map = nextGeneration(copyWorld.map);
                copyWorld.generation += 1;
                draw(copyWorld);
                if(true) myLoop();
            }, 100)
        })();
    }

    $('#start').click(function(){
        if (saveWorld){
            for(var i = 0; i < h; i++) {
                for(var j = 0; j < w; j++){
                    myWorld.map[i][j] = copyWorld.map[i][j];
                }
            }
        }

        saveWorld = false;
        liveOn();
        document.getElementById("start").disabled = true;
        document.getElementById("start").style.opacity = .3;

        document.getElementById("next").disabled = true;
        document.getElementById("next").style.opacity = .3;
    });

    $('#pause').click(function(){
        clearTimeout(alive);
        document.getElementById("start").disabled = false;
        document.getElementById("start").style.opacity = 1;

        document.getElementById("next").disabled = false;
        document.getElementById("next").style.opacity = 1;
    });

    $('#reset').click(function(){
        clearTimeout(alive);

        //reset copyWorld to myWorld
        for(var i = 0; i < h; i++) {
            for(var j = 0; j < w; j++){
                copyWorld.map[i][j] = myWorld.map[i][j];
            }
        }
        copyWorld.generation = 0;

        draw(copyWorld);
        document.getElementById("start").disabled = false;
        document.getElementById("start").style.opacity = 1;

        document.getElementById("next").disabled = false;
        document.getElementById("next").style.opacity = 1;
    });

    $('#next').click(function(){
        copyWorld.map = nextGeneration(copyWorld.map);
        copyWorld.generation += 1;
        draw(copyWorld);
    });

    $('#clear').click(function(){
        saveWorld = true;

        clearTimeout(alive);
        clear(myWorld);
        clear(copyWorld);
        draw(copyWorld);

        document.getElementById("start").disabled = false;
        document.getElementById("start").style.opacity = 1;

        document.getElementById("next").disabled = false;
        document.getElementById("next").style.opacity = 1;

    });

    $('#export').click(function(){
        var csvRows = [];

        csvRows.push(['Generation:', copyWorld.generation].join(','));
        for(var i=0,l=myWorld.map.length; i<l; ++i){
            csvRows.push(myWorld.map[i].join(','));
        }
        var csvString = csvRows.join("\r\n");

        var a = document.getElementById("export");
        a.href     = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csvString);
        a.target   = '_blank';
        a.download = 'myFile.csv';
        document.body.appendChild(a);
    });

});
