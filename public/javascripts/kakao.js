const mapContainer = document.getElementById("map"),
  mapOption = {
    center: new kakao.maps.LatLng(37.566826, 126.9786567),
    level: 8,
  };

const geoData = JSON.parse(JSON.stringify(data));
const areas = [];
const colors = {
  DEFAULT: "#ff0000",
  CLICK: "#84f97a",
  CLICK_HOVER: "#c27c3d",
};

geoData.features.forEach((unit, index) => {
  let coordinates = [];
  let name = "";
  coordinates = unit.geometry.coordinates;
  name = unit.properties.EMD_KOR_NM;

  const ob = new Object();
  ob.name = name;
  ob.path = [];

  if (unit.geometry.type !== "MultiPolygon") {
    coordinates[0].forEach((coordinate) => {
      ob.path.push(new kakao.maps.LatLng(coordinate[1], coordinate[0]));
    });
  } else {
    coordinates.forEach((coordinate) => {
      const geo = [];
      coordinate[0].forEach((item) => {
        geo.push(new kakao.maps.LatLng(item[1], item[0]));
      });
      ob.path.push(geo);
    });
  }

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
    strokeColor: "none",
    strokeOpacity: 0.001,
    fillColor: colors.DEFAULT,
    fillOpacity: 0.0001,
  });

  polygon.isClick = false;

  kakao.maps.event.addListener(polygon, "mouseover", (mouseEvent) => {
    if (polygon.isClick) {
      polygon.setOptions({ fillOpacity: 0.6, fillColor: colors.CLICK_HOVER });
    } else {
      polygon.setOptions({ fillOpacity: 0.6 });
    }

    customOverlay.setContent('<div class="area">' + area.name + "</div>");
    customOverlay.setPosition(mouseEvent.latLng);
    customOverlay.setMap(map);
  });

  kakao.maps.event.addListener(polygon, "mousemove", (mouseEvent) => {
    customOverlay.setPosition(mouseEvent.latLng);
  });

  kakao.maps.event.addListener(polygon, "mouseout", () => {
    if (polygon.isClick) {
      polygon.setOptions({
        fillOpacity: 0.6,
        fillColor: colors.CLICK,
        strokeColor: colors.CLICK,
      });
    } else {
      polygon.setOptions({ fillOpacity: 0.0001 });
    }
    customOverlay.setMap(null);
  });

  kakao.maps.event.addListener(polygon, "click", (mouseEvent) => {
    if (polygon.isClick) {
      polygon.setOptions({
        strokeColor: "none",
        strokeOpacity: 0.001,
        fillColor: colors.DEFAULT,
        fillOpacity: 0.0001,
      });
      polygon.isClick = false;
    } else {
      polygon.setOptions({
        fillOpacity: 0.6,
        fillColor: colors.CLICK,
        strokeColor: colors.CLICK,
      });
      polygon.isClick = true;
    }
  });
}
