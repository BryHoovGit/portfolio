mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/outdoors-v11', // style URL
    center: photo.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(photo.geometry.coordinates)
    .addTo(map)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<br>
                <h5>${photo.title}</h5>
                <p>${photo.location}</p>`
            )
    )
    .addTo(map)