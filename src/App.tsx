import "./styles.css";
import Map, { Source, Layer } from "react-map-gl";
import maplibregl, { Style } from "maplibre-gl";
import { clusterLayer, unclusteredPointLayer } from "./layers";
import { useEffect, useState } from "react";

const geoJSON: any = {
  type: "FeatureCollection",
  crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
  features: [
    {
      type: "Feature",
      properties: {
        id: 3,
        name: "Van Woustraat"
      },
      geometry: { type: "Point", coordinates: [4.901, 52.3554, 0.0] }
    },
    {
      type: "Feature",
      properties: {
        id: 4,
        name: "Huidenstraat"
      },
      geometry: { type: "Point", coordinates: [4.8855, 52.3689, 0] }
    },
    {
      type: "Feature",
      properties: {
        id: 8,
        name: "Wycker Brugstraat"
      },
      geometry: { type: "Point", coordinates: [5.6976, 50.8493, 0] }
    }
  ]
};

const STYLE: Style = {
  version: 8,
  sources: {
    "raster-tiles": {
      type: "raster",
      tiles: [
        "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
      ],
      tileSize: 256
    }
  },
  layers: [
    {
      id: "osm-tiles",
      type: "raster",
      source: "raster-tiles",
      minzoom: 0,
      maxzoom: 19
    }
  ]
};

export default function App() {
  const [storeGeo, setStoreGeo] = useState<any>(geoJSON);

  useEffect(() => {
    fetch("https://api.aceandtate.com/api/locations/full")
      .then((res) => res.json())
      .then((res) => {
        const locations = res?.map((location) => ({
          type: "Feature",
          properties: {
            id: location.id,
            street: location.street
          },
          geometry: {
            type: "Point",
            coordinates: [location.longitude, location.latitude, 0]
          }
        }));

        setStoreGeo({
          type: "FeatureCollection",
          crs: {
            type: "name",
            properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" }
          },
          features: locations
        });
      });
  }, []);

  return (
    <Map
      mapLib={maplibregl}
      style={{ width: "100vw", height: "100vh" }}
      mapStyle={STYLE}
      initialViewState={{
        latitude: 50.8493,
        longitude: 5.6976,
        zoom: 5
      }}
    >
      <Source
        id="stores"
        type="geojson"
        data={storeGeo}
        cluster={true}
        clusterMaxZoom={14}
        clusterRadius={50}
      >
        <Layer {...clusterLayer} />
        {/* <Layer {...clusterCountLayer} /> */}
        <Layer {...unclusteredPointLayer} />
      </Source>
    </Map>
  );
}
