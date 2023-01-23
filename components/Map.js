import * as React from 'react';
import dynamic from 'next/dynamic';
import Map, { GeolocateControl, Source, Layer, NavigationControl } from 'react-map-gl';
import * as turf from "@turf/turf";

import "mapbox-gl/dist/mapbox-gl.css";

function toDegrees(angle) {
    return angle * (180 / Math.PI);
}

const MAPBOX_TOKEN = 'pk.eyJ1IjoiYWNhbm5pc3RyYSIsImEiOiJjbGQ1OXNvbDgwaDFqM3ZyeGNwcmZ6b3dhIn0.1dAZytAellWvM8e6yIZ80Q';

const slopeAngleSource = {
    id: "usgs-slope",
    type: "raster",
    tiles: [
        "https://elevation.nationalmap.gov/arcgis/rest/services/3DEPElevation/ImageServer/exportImage?bbox={bbox-epsg-3857}&bboxSR=102100&imageSR=102100&format=jpgpng&renderingRule=%7B%22rasterFunction%22%3A%22Slope+Map%22%7D&f=image"
    ],
    tilesize: 256,
    minzoom: 10
}

const slopeAngleLayer = {
    id: 'usgs-slope-layer',
    type: 'raster',
    source: 'usgs-slope',
    paint: {
        "raster-opacity": 0.4
    },
    beforeId: "building"
}

export default function RunoutMap() {
    const [viewport, setViewport] = React.useState({
        height: "100%",
        width: "100%"
    });

    const [clickStatus, setClickStatus] = React.useState({
        clickedOnce: false,
        clickedPoint: null
    })

    const mapRef = React.useRef();


    const computeAlpha = (pt1, pt2) => {
        var distance = turf.distance(pt1.point, pt2.point) * 1000;
        var elevation_difference = Math.abs(pt1.elevation - pt2.elevation);
        var alpha = Math.atan(elevation_difference / distance)
        return toDegrees(alpha)
    }

    const _onClick = clickEvent => {
        var thisPt = {
            point: [clickEvent.lngLat.lng, clickEvent.lngLat.lat],
            elevation: mapRef.current.queryTerrainElevation(clickEvent.lngLat)
        }
        if (clickStatus.clickedOnce) {
            console.log("calculate alpha with points", clickStatus.clickedPoint, thisPt);

            console.log(computeAlpha(thisPt, clickStatus.clickedPoint))
            setClickStatus({
                clickedOnce: false,
                clickedPoint: null
            });
        } else {
            setClickStatus({
                clickedOnce: true,
                clickedPoint: thisPt
            });
        }



    }

    return (
        <div style={{
            height: "100vh",
            width: "100vw"
        }}>
            < Map
                ref={mapRef}
                mapboxAccessToken={MAPBOX_TOKEN}
                initialViewState={{
                    longitude: -100,
                    latitude: 40,
                    zoom: 3.5,
                }}
                mapStyle="mapbox://styles/mapbox/outdoors-v12"
                onClick={_onClick}
                terrain={{ source: 'mapbox-dem' }}
            >
                <GeolocateControl
                    positionOptions={{ enableHighAccuracy: true }}
                />

                <NavigationControl />


                <Source
                    id="mapbox-dem"
                    type="raster-dem"
                    url="mapbox://mapbox.mapbox-terrain-dem-v1"
                    tileSize={512}
                    maxzoom={14}
                />

                <Source {...slopeAngleSource}>
                    <Layer {...slopeAngleLayer} />
                </Source>



            </Map >
        </div >
    );
};
