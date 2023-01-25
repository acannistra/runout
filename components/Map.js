import * as React from 'react';
import dynamic from 'next/dynamic';
import Map, { GeolocateControl, Source, Layer, NavigationControl } from 'react-map-gl';
import * as turf from "@turf/turf";
import { v4 as uuidv4 } from 'uuid';


import "mapbox-gl/dist/mapbox-gl.css";

function toDegrees(angle) {
    return angle * (180 / Math.PI);
}

const MAPBOX_TOKEN = 'pk.eyJ1IjoiYWNhbm5pc3RyYSIsImEiOiJjbGQ1OXNvbDgwaDFqM3ZyeGNwcmZ6b3dhIn0.1dAZytAellWvM8e6yIZ80Q';

const randomColor = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

const emptyFeatureCollection = {
    type: "FeatureCollection",
    features: [
    ]
}

const emptyLinestringFeature = {
    type: "Feature",
    geometry: {
        type: "LineString",
        coordinates: []
    }
}


const addLineToGeoJSON = (start, end, color, id, angle, geojson) => {
    var fc = [
        ...geojson.features,
        {
            type: "Feature",
            geometry: {
                type: "LineString",
                coordinates: [
                    start.point, end.point
                ]
            },
            properties: {
                'color': color,
                'id': id,
                'alpha': angle,
                'start-ele': start.elevation,
                'end-ele': end.elevation
            }
        }
    ]
    return fc
}

const slopeAngleSource = {
    id: "usgs-slope",
    type: "raster",
    tiles: [
        //'https://gaiavectortilerendering.global.ssl.fastly.net/slope-avy-v2/{z}/{x}/{y}.png'
        "https://elevation.nationalmap.gov/arcgis/rest/services/3DEPElevation/ImageServer/exportImage?bbox={bbox-epsg-3857}&bboxSR=102100&imageSR=102100&format=jpgpng&renderingRule=%7B%22rasterFunction%22%3A%22Slope+Map%22%7D&f=image"
    ],
    tilesize: 512,
    minzoom: 10
}

const slopeAngleLayer = {
    id: 'usgs-slope-layer',
    type: 'raster',
    source: 'usgs-slope',
    paint: {
        "raster-opacity": 0.35
    },
    beforeId: "building"
}

const savedLineLayer = {
    id: '_savedline_layer',
    type: 'line',
    source: '_savedline',
    paint: {
        "line-color": ['get', 'color'],
        "line-width": 5
    }
}

const savedLineSource = {
    id: "_savedline",
    type: "geojson",
    data: emptyFeatureCollection
}

const savedLineLabelLayer = {
    id: "_savedline_label",
    source: "_savedline",
    type: "symbol",
    "layout": {
        "text-field": [
            'number-format',
            ['get', 'alpha'],
            { 'max-fraction-digits': 2, 'unit': 'degree', 'unitDisplay': 'narrow' }
        ],
        "symbol-placement": "line-center",
        "text-font": ["Roboto Condensed"],
        "text-size": 18,
        "text-justify": "center",
        "symbol-spacing": 1000,
        "text-anchor": "bottom"
    },
}


const followLineSource = {
    id: '_trackline',
    type: 'geojson',
    data: emptyLinestringFeature
}


const followLineLayer = {
    id: '_trackline_layer',
    type: 'line',
    source: '_trackline',
    paint: {
        "line-color": 'red',
        "line-width": 5

    }
}

const followLineLabelLayer = {
    id: "_trackline_label",
    type: "symbol",
    "layout": {
        "text-field": [
            'number-format',
            ['get', 'alpha'],
            { 'max-fraction-digits': 2, 'unit': 'degree', 'unitDisplay': 'narrow' }
        ],
        "symbol-placement": "line-center",
        "text-font": ["Roboto Condensed"],
        "text-size": 18,
        "text-justify": "center",
        "symbol-spacing": 1000,
        "text-anchor": "bottom"
    },
}

export default function RunoutMap({ measurements, setMeasurements }) {

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

    const _followLine = (pt1, pt2) => {
        var thisMap = mapRef.current.getMap();
        var alpha = computeAlpha(pt1, pt2);
        var newData = {
            "type": "Feature",
            "properties": {
                "alpha": alpha
            },
            "geometry": {
                "coordinates": [
                    pt1.point,
                    pt2.point
                ],
                "type": "LineString"
            }
        }
        thisMap.getSource('_trackline').setData(newData);
    }

    const _onMouseMove = (event) => {
        if (clickStatus.clickedOnce) {
            var thisPt = {
                point: [event.lngLat.lng, event.lngLat.lat],
                elevation: mapRef.current.queryTerrainElevation(event.lngLat, { exaggerated: false })
            }
            _followLine(clickStatus.clickedPoint, thisPt)
        }
    }

    const _onClick = clickEvent => {
        var thisPt = {
            point: [clickEvent.lngLat.lng, clickEvent.lngLat.lat],
            elevation: mapRef.current.queryTerrainElevation(clickEvent.lngLat, { exaggerated: false })
        }
        if (clickStatus.clickedOnce) {
            // save line
            var id = uuidv4();
            var color = randomColor();
            var alpha = computeAlpha(clickStatus.clickedPoint, thisPt);
            var thisMap = mapRef.current.getMap()
            var currentSource = thisMap.getSource('_savedline')
            var newGeoJSON = addLineToGeoJSON(clickStatus.clickedPoint, thisPt, color, id, alpha, currentSource._data);

            currentSource.setData({
                'type': "FeatureCollection",
                "features": newGeoJSON
            })
            console.log(mapRef.current.getMap().getSource('_savedline'))
            setClickStatus({
                clickedOnce: false,
                clickedPoint: null
            });[]
            setMeasurements([...measurements, {
                "start": clickStatus.clickedPoint,
                "end": thisPt,
                "id": id,
                "color": color,
                "alpha": alpha,
                "length": turf.distance(clickStatus.clickedPoint.point, thisPt.point)
            }])
            thisMap.getSource('_trackline').setData(emptyLinestringFeature)
        } else {
            setClickStatus({
                clickedOnce: true,
                clickedPoint: thisPt
            });
        }



    }

    React.useEffect(() => {
        if (mapRef.current && measurements.length == 0) {
            mapRef.current.getMap().getSource('_savedline').setData(emptyFeatureCollection)
        }
    }, [measurements]);

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
                hash={true}
                mapStyle="mapbox://styles/mapbox/outdoors-v12"
                onClick={_onClick}
                onMouseMove={_onMouseMove}
                terrain={{ source: 'mapbox-dem', exaggeration: 0 }}
            >
                <GeolocateControl
                    positionOptions={{ enableHighAccuracy: true }}
                    position={'bottom-right'}
                />

                <NavigationControl position={'bottom-right'} />


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

                <Source {...followLineSource}>
                    <Layer {...followLineLayer} />
                    <Layer {...followLineLabelLayer} />
                </Source>

                <Source {...savedLineSource}>
                    <Layer {...savedLineLayer} />
                    <Layer {...savedLineLabelLayer} />
                </Source>



            </Map >
        </div >
    );
};
