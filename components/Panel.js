import * as React from 'react';

export default function Panel({ measurements, setMeasurements }) {
    console.log("Measurements [panel]", measurements)

    var measurement_rows = [];
    for (let i = 0; i < measurements.length; i++) {
        let color_class = "w-10 h-10 bg-[" + measurements[i].color.slice(1) + "]"
        measurement_rows.push(
            <div className="grid grid-cols-4 divide-x py-2">
                <div className="text-sm text-center">
                    <div className={"m-auto w-5 h-5"} style={{ 'background-color': measurements[i].color }}></div>
                </div>
                <div className='text-sm text-center'>{new Intl.NumberFormat('en-US', { 'units': "degrees", maximumFractionDigits: 2 }).format(measurements[i].alpha)}</div>
                <div className="text-sm text-center">{parseFloat(measurements[i].start.elevation).toFixed()}m – {parseFloat(measurements[i].end.elevation).toFixed()}m</div>
                <div className="text-sm text-center">{parseFloat(measurements[i].length).toFixed(4)}</div>
            </div >
        )
    }

    const clearMeasurements = () => {
        setMeasurements([]);
    }

    return (
        <div>
            <div>
                <p className="text-xs font-light align-middle float-right py-1">by <a className='underline' href="https://anthonycannistra.com">Tony Cannistra</a></p>
                <h1 className="text-lg font-bold">Measure Alpha Angles</h1>
            </div>
            <div className="text-sm">

                <p className="pt-5 font-light">
                    This utility can help you estimate alpha runout angles for avalanche paths. To use:
                </p>
                <ul className='px-5 pt-2 list-disc font-light'>
                    <li>Click once on a possible avalanche start zone.</li>
                    <li>Move your mouse to possible runout areas. The line will be labeled with the alpha angle.</li>
                    <li>Click again to save the measurement.</li>
                </ul>
            </div>
            <div className="pt-5">
                <div className='grid grid-cols-2 mb-2'>
                    <h2>Measurements</h2>
                    <button onClick={clearMeasurements} className=" h-5 text-white text-xs place-self-end rounded-full px-2 bg-rose-600">Clear</button>
                </div>
                <div className="grid divide-y-2 my-2">
                    <div className="grid grid-cols-4 divide-x py-2">
                        <div className='text-sm text-center'>Color</div>
                        <div className='text-sm text-center'>Angle</div>
                        <div className='text-sm text-center'>Elevation (m)</div>
                        <div className="text-sm text-center">Length (km)</div>
                    </div>
                    {measurements.length === 0 &&
                        <div className="grid grid-cols-3 divide-x py-2">

                            <div className='col-span-3 text-center text-slate-500 italic text-xs'>
                                Measurements created on the map will appear here.
                            </div>
                        </div>
                    }
                    {measurement_rows}

                </div>



            </div>
        </div >
    )
};