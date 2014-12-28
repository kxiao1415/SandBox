$(document).ready(function(){

    var map;
    var markers = [];
    var infoBox =[];
    var photos = [];
    var infoBoxOps = {
        disableAutoPan: false,
        maxWidth: 0,
        pixelOffset: new google.maps.Size(-325, 0),
        zIndex: null,
        boxStyle: {
            width: "650px",
        },
        closeBoxMargin: "10px 2px 2px 2px",
        closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
        infoBoxClearance: new google.maps.Size(1, 1),
        isHidden: false,
        pane: "floatPane",
        enableEventPropagation: false,
    };

    var defaultMarker ='/static/siteImage/marker2.png';
    var centerPos=new google.maps.LatLng(36.642815,-87.7517476);
    var zoomLevel=3;

    function addCSSRule(sheet, selector, rules, index) {
        if ("insertRule" in sheet) {
            sheet.insertRule(selector + "{" + rules + "}", index);
        }
        else if ("addRule" in sheet) {
            sheet.addRule(selector, rules, index);
        }
    }

    function addMarker(location) {
        //make sure to assign the function to a variable when calling the function
        var marker = new google.maps.Marker({
            position: location,
            map: map,
            icon: defaultMarker,
            optimized: false,
            animation: google.maps.Animation.DROP
        });

        markers.push(marker);

        return marker;
    }

    function clearMarkers(){
        for (var i = 0; i < markers.length; i++){
            markers[i].setMap(null);
        }

        markers = [];
    }


    function fitMarkers(markers){
        var bounds = new google.maps.LatLngBounds();
            for(var i = 0;i<markers.length;i++) {
                 bounds.extend(markers[i].getPosition());
            }
        map.fitBounds(bounds);
    }

    function addPhoto(location,icon) {
        //make sure to assign the function to a variable when calling the
        var markerIcon={
            url:icon,
            scaledSize: new google.maps.Size(100,100)
        };

        var marker = new google.maps.Marker({
            position: location,
            map: map,
            icon: markerIcon,
            url: 'http://www.google.com/',
            optimized: false,
            animation: google.maps.Animation.DROP
        });

        photos.push(marker);

        return marker;
    }

    function attachPhotoEvent(marker,countryName, stateName, cityName, parentfileuuid){
        google.maps.event.addListener(marker, 'click', function() {
            Shadowbox.open({
                content:'/galleria/country=' + countryName + '&state=' + stateName + '&city=' + cityName + '&parentfileuuid=' + parentfileuuid + '&show=0' + '/',
                player: 'iframe',
                type: 'iframe'
            });
        });
    }

    function clearPhotos(){
        for (var i = 0; i < photos.length; i++){
            photos[i].setMap(null);
        }

        photos = [];
    }


    function attachPhotoInfoBox(marker, description){
        if(description === ''){
            description = 'No Description';
        }

        var info=[]
        google.maps.event.addListener(marker, 'mouseover', function() {

            if (info[0]==null || info[0].getMap() == null){

                clearInfoBox();

                var boxText = document.createElement("div");

                boxText.style.cssText = "\
                    margin-top: 8px; \
                    background: black; \
                    background-color: rgba(0, 0, 0, 0.5);\
                    padding: 5px; \
                    color:#F1F1F1; \
                    font-family: 'Gruppo', cursive; \
                    font-size: 15px\
                ";

                boxText.innerHTML = '<p>' + description + '</p>';
                infoBoxOps.content=boxText;
                var ib = new InfoBox(infoBoxOps);
                ib.open(map, this);
                infoBox.push(ib);
                info[0]=ib;

                return ib;
            }
        });
    }

    function attachInfoBox(marker,geoLocation){
        var info=[]
        google.maps.event.addListener(marker, 'mouseover', function() {
            /*info[0].getMap() checks to see is the info[0] was closed but not deleted
              redraw the infoBox is info[] is null or info[0] was closed*/

            if (info[0]==null || info[0].getMap() == null){

                //check to see if markers are photos.  Do nothing to photos.
                if(markers.length !=0) {
                    marker.setIcon(defaultMarker);

                    for(var i = 0;i<markers.length;i++){
                        if(markers[i]!=marker){
                            markers[i].setIcon('/static/siteImage/marker2invert.png');
                        }
                    }
                }

                clearInfoBox();

                var boxText = document.createElement("div");
                boxText.style.cssText = "\
                    margin-top: 8px; \
                    background: black; \
                    background-color: rgba(0, 0, 0, 0.5);\
                    padding: 5px; \
                    color:#F1F1F1; \
                    font-family: 'Gruppo', cursive; \
                    font-size: 15px \
                ";

                var boxTextInnerHTML = "<div class='scrollbar'><div class='handle'><div class='mousearea'></div></div></div><div id='frame'><ul class='slidee'>";

                $.ajax({
                    url: '/itinerary/ajax/country=' + geoLocation[0] + '&state=' + geoLocation[1] + '&city=' + geoLocation[2] + '/',
                    type: 'get',
                    dataType:'json',
                    success: function(json) {

                        var galleriaUrl = '/galleria/country=' + geoLocation[0] + '&state=' + geoLocation[1] + '&city=' + geoLocation[2]+ '&parentfileuuid=' + '&show=';

                        if(json.length !==0){
                            for(var i = 0; i<json.length; i++){
                                boxTextInnerHTML += "<li><a class='sbox' href='"+ galleriaUrl + i + "'><img class='slyImage' src='" + json[i]['file'] + "' height='100' width = '120' ></a></li>";
                            }
                        } else{
                            boxTextInnerHTML +="<li>No Photo Here!</li>";
                        }

                        boxText.innerHTML = boxTextInnerHTML + "</ul></div><div class='controls'><button class='btn_prev'><i class='icon-chevron-left'></i> prev</button><button class='btn_next'>next <i class='icon-chevron-right'></i></button></div>";

                        infoBoxOps.content = boxText;

                        var ib = new InfoBox(infoBoxOps);
                        ib.open(map, marker);
                        infoBox.push(ib);
                        info[0]=ib;

                        google.maps.event.addListener(ib, 'domready', function() {

                            Shadowbox.setup('.sbox')

                            /*sly scroll options*/
                            var ops={

                                horizontal: 1,
                                itemNav: 'forceCentered',
                                smart: 1,
                                activateOn: 'click',
                                scrollBy: 1,
                                swingSpeed: .8,
                                scrollBar: $('.scrollbar'),
                                speed: 800,
                                startAt: 0,
                                next: $('.btn_next'),
                                prev: $('.btn_prev')
                            };

                            jQuery(function ($) {
                              $('#frame').sly(ops);
                            });
                        });

                        return ib;
                    }
                });
            }

        });
    }

    function clearInfoBox(){
        for (var i = 0; i < infoBox.length; i++){
            infoBox[i].close();
        }
        infoBox = [];
    }

    function attachInfoWindow(marker){
        var info=[]
        google.maps.event.addListener(marker, 'mouseover', function() {

            if (info[0]!=null){
                info[0].close();
            }

            var clickMe = '<div class="scrollFix">click me!</div>';
            var infoWindow = new google.maps.InfoWindow({
                content: clickMe
            });

            infoWindow.open(map,this);

            info[0]=infoWindow;

            setTimeout(function() {
                infoWindow.close()
            }, 900);
        });
    }

    function LogoControl(controlDiv, map) {

        controlDiv.style.padding = '5px';

        var controlUI = document.createElement('div');
        controlUI.style.backgroundImage ="url('/static/siteImage/mapHome3.png')";
        controlUI.style.width = '64px';
        controlUI.style.height = '64px';
        controlUI.style.cursor = 'pointer';
        controlUI.title = 'Click to set the map to Home';
        controlDiv.appendChild(controlUI);

        google.maps.event.addDomListener(controlUI, 'click', function() {
            homePage();
        });
    }

    function homePage(){

        removeAll();

        $('.sbox').remove();

        for (var i = 0; i < countries.length; i++) {
            marker = addMarker(new google.maps.LatLng(countries[i]['lat'],countries[i]['lng']));
            attachCountryMarkerEvent(marker,countries[i]['country']);
        }

        map.setCenter(centerPos);
        map.setZoom(zoomLevel);
    }

    function attachCountryMarkerEvent(marker,countryName) {

        attachInfoWindow(marker);

        attachInfoBox(marker,[countryName,'','']);

        google.maps.event.addListener(marker, 'click', function(){clickOnCountryMarker(countryName);});
    }

    function attachStateMarkerEvent(marker,countryName,stateName) {

        attachInfoWindow(marker);

        attachInfoBox(marker,[countryName, stateName,'']);

        google.maps.event.addListener(marker, 'click', function() {clickOnStateMarker(countryName,stateName);});
    }

    function attachCityMarkerEvent(marker,countryName,stateName,cityName) {
        attachInfoWindow(marker);
        attachInfoBox(marker,[countryName, stateName, cityName]);

        google.maps.event.addListener(marker, 'click', function() {clickOnCityMarker(countryName, stateName, cityName);});

    }

    function removeAll(){
        clearPhotos();
        clearMarkers();
        clearInfoBox();
    }

    function clickOnCountryMarker(countryName){
        removeAll();

        for (var i = 0; i < states.length; i++) {
            if (states[i]['country'] == countryName) {
                marker = addMarker(new google.maps.LatLng(states[i]['lat'],states[i]['lng']));
                attachStateMarkerEvent(marker,countryName, states[i]['state']);
            }
        }

        fitMarkers(markers);
    }

    function clickOnStateMarker(countryName, stateName){
        removeAll();

        for (var i = 0; i < cities.length; i++) {
            if (cities[i]['state'] == stateName && cities[i]['country'] == countryName) {
                marker = addMarker(new google.maps.LatLng(cities[i]['lat'],cities[i]['lng']));
                attachCityMarkerEvent(marker,countryName, stateName,cities[i]['city']);
            }
        }

        fitMarkers(markers);
    }

    function clickOnCityMarker(countryName, stateName, cityName){
        removeAll();

        /*$("#info").stop(true).animate({'width': ['hide','easeOutBack']},200,function(){
            $('.sbox').remove();
            $('<img />').attr({
                src:'/static/siteImage/play.png'
                }).appendTo($('<a />').attr({
                    href:'/galleria/country=' + countryName + '&state=' + stateName + '&city=' + cityName,
                    class: 'sbox'
            }).appendTo('#info'))

            Shadowbox.setup('.sbox')

            $("#info").animate({'width':['show','easeOutBack']});
        });*/

        clearMarkers();

        $.ajax({
            url: '/itinerary/ajax/country=' + countryName + '&state=' + stateName + '&city=' + cityName + '/',
            type: 'get',
            dataType:'json',
            success: function(json) {

                clearInfoBox();

                for(var i = 0; i<json.length; i++){
                    //the default value of lat and lng for a photo is -999, but don't drop pins for these photos
                    if(json[i]['lat'] !== -999){
                        //photo is just marker with image
                        photo = addPhoto(new google.maps.LatLng(json[i]['lat'],json[i]['lng']),'/static/siteImage/redFrame2.png#'+i);
                        addCSSRule(document.styleSheets[0],
                                    'img[src="' + '/static/siteImage/redFrame2.png#'+ i + '"]',
                                    //to change the background image size, add "background-size: ?px ?px"
                                    'background:url(' + json[i]['file']+ ') -5% 23% no-repeat');
                        attachPhotoInfoBox(photo,json[i]['description']);
                        attachInfoWindow(photo);
                        attachPhotoEvent(photo, countryName, stateName, cityName, json[i]['parentfileuuid']);

                    }
                }

                fitMarkers(photos);
            }
        });
    }

    function initialize() {

        var styles = googleMapStyle;

        var mapOptions = {
            center: centerPos,
            zoom: zoomLevel,
            panControl: false,
            zoomControlOptions:{
                style: google.maps.ZoomControlStyle.SMALL,
                position: google.maps.ControlPosition.RIGHT_TOP
            },
        };

        map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions );

        homePage();

        var logoControlDiv = document.createElement('div');
        var logoControl = new LogoControl(logoControlDiv, map);

        logoControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(logoControlDiv);

        var styledMap = new google.maps.StyledMapType( styles, {name: "Styled Map"} );
        map.mapTypes.set('map_style', styledMap);
        map.setMapTypeId('map_style');

    }

    google.maps.event.addDomListener(window, 'load', initialize);

    /*** collapsible tree***/

    var margin = {top: 20, right: 120, bottom: 20, left: 120},
        width = 700 - margin.right - margin.left,
        height = 600 - margin.top - margin.bottom;

    var i = 0,
        duration = 750,
        root;

    var tree = d3.layout.tree()
        .size([height, width]);

    //change the link path
    function elbow(d, i) {
      return "M" + d.source.y + "," + d.source.x + "H" + ((d.target.y-d.source.y)/4+d.source.y) + "V" + d.target.x + "H" + d.target.y;
    }

    var svg = d3.select("#tree-container").append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class", "graph-svg-component")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    d3.select(self.frameElement).style("height", "500px");

    function update(source) {

      // Compute the new tree layout.
      var nodes = tree.nodes(root).reverse(),
          links = tree.links(nodes);

      // Normalize for fixed-depth.
      nodes.forEach(function(d) { d.y = d.depth * 140; });

      // Update the nodes…
      var node = svg.selectAll("g.node")
          .data(nodes, function(d) { return d.id || (d.id = ++i); });

      // Enter any new nodes at the parent's previous position.
      var nodeEnter = node.enter().append("g")
          .attr("class", "node")
          .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
          .on("click", click);

      nodeEnter.append("circle")
          .attr("r", 1e-6)
          .style("fill", function(d) { return d._children ? "#3182bd" : "#fff"; });

      nodeEnter.append("text")
          .attr("x", function(d) { return d.children || d._children ? -13 : 13; })
          .attr("dy", ".35em")
          .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
          .text(function(d) { return d.name; })
          .style("fill-opacity", 1e-6);


      // Transition nodes to their new position.
      var nodeUpdate = node.transition()
          .duration(duration)
          .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

      nodeUpdate.select("circle")
          .attr("r", 10)
          .style("fill", function(d) { return d._children ? "#3182bd" : "#fff"; });

      nodeUpdate.select("text")
          .style("fill-opacity", 1);

      // Transition exiting nodes to the parent's new position.
      var nodeExit = node.exit().transition()
          .duration(duration)
          .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
          .remove();

      nodeExit.select("circle")
          .attr("r", 1e-6);

      nodeExit.select("text")
          .style("fill-opacity", 1e-6);

      // Update the links…
      var link = svg.selectAll("path.link")
          .data(links, function(d) { return d.target.id; });

      // Enter any new links at the parent's previous position.
      link.enter().insert("path", "g")
          .attr("class", "link")
          .attr("d", elbow);

      // Transition links to their new position.
      link.transition()
          .duration(duration)
          .attr("d", elbow);

      // Transition exiting nodes to the parent's new position.
      link.exit().transition()
          .duration(duration)
          .attr("d", elbow)
          .remove();

      // Stash the old positions for transition.
      nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    //Map action when toggling a node
   function pinMap(d){
        if(d.entity == 'root'){
            homePage();
        } else if(d.entity =='country'){
            clickOnCountryMarker(d.name);
        } else if (d.entity == 'state'){
            clickOnStateMarker(d.parent.name, d.name);
        } else {
            clickOnCityMarker(d.parent.parent.name, d.parent.name, d.name);
        }
   }

    // Toggle children on click.
    function click(d) {

            closeSiblings(d);

        if (d.children) {
            if (d.entity=='root'){
                removeAll();
                map.setZoom(zoomLevel-1);
            } else {
                pinMap(d.parent);
            }

            moveChildren(d);

        } else {
            pinMap(d);
            d.children = d._children;
            d._children = null;
        }
        update(d);
    }

    function closeSiblings(d) {
        if (!d.parent) return; // root case
        d.parent.children.forEach(function(d1) {
            if (d1 == d || !d1.children) return;
            moveChildren(d1);
        });
    }

    //close the node and the children
    function moveChildren(d) {
        tree.nodes(d).forEach(function(n) {
            if(n.children){
                n._children = n.children;
                n.children = null;
            }
        });
    }

    root = treeData;
    root.x0 = height / 2;
    root.y0 = 0;

    moveChildren(root);

    root.children = root._children;
    root._children = null;

    update(root);

    $(".slidebar").click(function(){ $('.graph-svg-component').animate({width: 'toggle'},650,'easeOutBack');

                                     if($(this).attr('id') =='show'){
                                        $(this).animate({marginLeft: '-675px'},650,'easeOutBack');
                                        $(this).attr('id','hide');
                                        $(this).html('&nbsp;>>');
                                     }
                                     else {
                                        $(this).animate({marginLeft: '0px'},650,'easeOutBack');
                                        $(this).attr('id','show');
                                        $(this).html('&nbsp;<<');
                                     }
    });
});