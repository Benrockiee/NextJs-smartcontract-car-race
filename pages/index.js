import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
// import ManualHeader from "../components/ManualHeader"
import Header from "../components/Header"
import RaceEntry from "../components/RaceEntry"

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Smart Contract Car Race</title>
                <meta name="description" content="Smart Contract Car Race" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <RaceEntry />
            {/*header / connect button / nav bar */}
        </div>
    )
}
