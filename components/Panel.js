import * as React from 'react';

export default function Panel() {
    return (
        <div>
            <h1 className="text-lg font-bold">Measure Alpha Angles</h1>
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
                <h2>Measurements</h2>
                <div className="grid divide-y-2 my-2">
                    <div className="grid grid-cols-3 divide-x py-2">
                        <div className='text-sm text-center'>#</div>
                        <div className='text-sm text-center'>Angle</div>
                        <div className='text-sm text-center'>Link</div>
                    </div>
                    <div className="grid grid-cols-3 divide-x py-2">
                        <div className='col-span-3 text-center text-slate-500 italic text-xs'>
                            Measurements created on the map will appear here.
                        </div>
                    </div>

                </div>



            </div>
        </div >
    )
};