import Head from 'next/head'
import Image from 'next/image'
import RunoutMap from 'runout/components/Map';
import Panel from 'runout/components/Panel';


export default function Home() {
  return (
    <>
      <Head>
        <title>α: Measure Alpha Angles</title>
        <meta name="description" content="Measure alpha angles for avalanche runout estimation." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>



      <div className="static">
        <RunoutMap></RunoutMap>
        <div className="absolute max-w-sm top-7 right-7 bg-white px-4 pt-4 pb-4 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg ">
          <Panel />
        </div>
      </div>


    </>
  )
}
