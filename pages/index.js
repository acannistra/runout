import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google';
import styles from 'runout/styles/Home.module.css';
import RunoutMap from 'runout/components/Map';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>α: Measure Alpha Angles</title>
        <meta name="description" content="Measure alpha angles for avalanche runout estimation." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <RunoutMap></RunoutMap>

    </>
  )
}
