// Creating Map Object
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
});

// Adding tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Storing API endpoint of the earthquake data
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Define function to select marker color based on depth
function chooseColor(depth) {
    if (depth >= -10 && depth <= 10) {
        return "#98ee00";
    } else if (depth > 10 && depth <= 30) {
        return "#d4ee00";
    } else if (depth > 30 && depth <= 50) {
        return "#eecc00";
    } else if (depth > 50 && depth <= 70) {
        return "#ee9c00";
    } else if (depth > 70 && depth <= 90) {
        return "#ea822c";
    } else if (depth > 90) {
        return "#ea2c2c";
    } else {
        return "black";
    }
}

// Define function to select marker size based on magnitude
function chooseSize(magnitude) {
    if (magnitude === 0) {
        return magnitude * 1;
    }
    return magnitude * 5;
}

// Create a function to format markers
function formatCircleMarker(feature, latlng) {
    return {
        radius: chooseSize(feature.properties.mag),
        fillColor: chooseColor(feature.geometry.coordinates[2]),
        color: "black", // Changed border color to black
        fillOpacity: 0.8, // Adjusted fill opacity
        opacity: 0.5
    };
}

// Grab the data with fetch and create markers
fetch(link)
    .then(response => response.json())
    .then(data => {
        let earthquakes = data.features;

        // Create a marker for each earthquake
        earthquakes.forEach(earthquake => {
            let latlng = [earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]];

            // Create a circle marker with a radius based on the magnitude
            let marker = L.circleMarker(latlng, formatCircleMarker(earthquake, latlng));

            // Add a popup with additional information
            marker.bindPopup(`
                <strong>${earthquake.properties.place}</strong><br>
                Magnitude: ${earthquake.properties.mag}<br>
                Depth: ${earthquake.geometry.coordinates[2]} km
            `);

            // Add the marker to the map
            myMap.addLayer(marker);
        });

        // Set up map legend to show depth colors
        let legend = L.control({ position: "bottomright" });

        legend.onAdd = function () {
            let div = L.DomUtil.create("div", "info legend");
            let depthRanges = [-10, 10, 30, 50, 70, 90];
            let colors = ['#98ee00', '#d4ee00', '#eecc00', '#ee9c00', '#ea822c', '#ea2c2c'];
        
            // loop through each range and create label with color
            for (let i = 0; i < depthRanges.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + colors[i] + '; width: 30px; height: 20px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; margin-right: 5px;">' + depthRanges[i] + '</i> ' +
                    depthRanges[i] + (depthRanges[i + 1] ? '&ndash;' + depthRanges[i + 1] + ' km<br>' : '+ km');
            }
        
            return div;
        };

        // Add the legend to the map
        legend.addTo(myMap);
    });
