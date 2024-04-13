// Creating Map Object
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
});

// Adding tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Storing API endpoint of the earthquake data
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

// Grab the data with d3 and create a markers
d3.json(link).then(function(data) {
    createMarkers(data.features);
});

