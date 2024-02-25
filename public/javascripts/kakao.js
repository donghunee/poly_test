const mapContainer = document.getElementById("map"),
  mapOption = {
    center: new kakao.maps.LatLng(37.566826, 126.9786567),
    level: 8,
  };

const geoData = JSON.parse(JSON.stringify(data));

const areas = [];

const colors = {
  DEFAULT: "#ff0000",
  CLICK: "#461FBB",
  CLICK_HOVER: "#6b1996",
};

const opacity = {
  DEFAULT: 0.0001,
  HOVER: 0.5,
  CLICK: 0.7,
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
const sigPolyArr = [];

map.setCursor("default");

areas.forEach((area) => displayArea(area, "default"));

function displayArea(area, type) {
  const polygon = new kakao.maps.Polygon({
    map: map,
    path: area.path,
    strokeColor: "none",
    fillColor: colors.DEFAULT,
    fillOpacity: opacity.DEFAULT,
    zIndex: 1,
  });

  polygon.isClick = false;

  kakao.maps.event.addListener(polygon, "mouseover", (mouseEvent) => {
    if (polygon.isClick) {
      polygon.setOptions({
        fillOpacity: opacity.HOVER,
        fillColor: colors.CLICK_HOVER,
        strokeColor: colors.CLICK_HOVER,
        strokeWeight: 3,
        strokeOpacity: 1,
        zIndex: 9,
      });
    } else {
      polygon.setOptions({
        fillOpacity: opacity.HOVER,
        strokeColor: colors.DEFAULT,
        strokeWeight: 3,
        strokeOpacity: 1,
        zIndex: 9,
      });
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
        fillOpacity: opacity.CLICK,
        fillColor: colors.CLICK,
        strokeColor: colors.CLICK,
        zIndex: 1,
      });
    } else {
      polygon.setOptions({
        fillOpacity: opacity.DEFAULT,
        strokeOpacity: 0,
        zIndex: 1,
      });
    }
    customOverlay.setMap(null);
  });

  kakao.maps.event.addListener(polygon, "click", () => {
    if (polygon.isClick) {
      polygon.setOptions({
        strokeColor: "none",
        strokeOpacity: 0.001,
        fillColor: colors.DEFAULT,
        fillOpacity: opacity.DEFAULT,
      });
      polygon.isClick = false;
    } else {
      polygon.setOptions({
        fillOpacity: opacity.CLICK,
        fillColor: colors.CLICK,
        strokeColor: colors.CLICK,
        strokeWeight: 3,
        strokeOpacity: 1,
      });
      polygon.isClick = true;
    }
  });
}

// kakao.maps.event.addListener(map, "zoom_changed", () => {
//   const level = map.getLevel();
//   if (level <= 7) {
//     sigPolyArr.forEach((poly) => poly.setMap(null));
//   } else {
//     console.log("11");
//     sigPolyArr.forEach((poly) => poly.setMap(map));
//   }
// });
