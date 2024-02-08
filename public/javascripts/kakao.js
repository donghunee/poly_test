const mapContainer = document.getElementById("map"),
  mapOption = {
    center: new kakao.maps.LatLng(37.566826, 126.9786567),
    level: 8,
  };

const geoData = JSON.parse(JSON.stringify(data));
const areas = [];

geoData.features.forEach((unit, index) => {
  let coordinates = [];
  let name = "";
  coordinates = unit.geometry.coordinates;
  name = unit.properties.temp;

  const ob = new Object();
  ob.name = name;
  ob.path = [];

  coordinates[0][0].forEach((coordinate) => {
    ob.path.push(new kakao.maps.LatLng(coordinate[1], coordinate[0]));
  });
  areas.push(ob);
});

const map = new kakao.maps.Map(mapContainer, mapOption),
  customOverlay = new kakao.maps.CustomOverlay({}),
  infowindow = new kakao.maps.InfoWindow({ removable: true });

areas.forEach((area) => displayArea(area));

function displayArea(area) {
  const polygon = new kakao.maps.Polygon({
    map: map,
    path: area.path,
    strokeWeight: 2,
    strokeColor: "#ff0000",
    strokeOpacity: 0.4,
    fillColor: "#ff0000",
    fillOpacity: 0.0001,
  });

  kakao.maps.event.addListener(polygon, "mouseover", (mouseEvent) => {
    polygon.setOptions({ fillOpacity: 0.6 });

    customOverlay.setContent('<div class="area">' + area.name + "</div>");

    customOverlay.setPosition(mouseEvent.latLng);
    customOverlay.setMap(map);
  });

  kakao.maps.event.addListener(polygon, "mousemove", (mouseEvent) => {
    customOverlay.setPosition(mouseEvent.latLng);
  });

  kakao.maps.event.addListener(polygon, "mouseout", () => {
    polygon.setOptions({ fillOpacity: 0.0001 });
    customOverlay.setMap(null);
  });

  kakao.maps.event.addListener(polygon, "click", (mouseEvent) => {});
}
