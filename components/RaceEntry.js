import { contractAddresses, abi } from "../constants"
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"

export default function RaceEntry() {
    const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    // These get re-rendered every time due to our connect button!
    const chainId = parseInt(chainIdHex)
    // console.log(`ChainId is ${chainId}`)
    const raceAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    // State hooks
    // https://stackoverflow.com/questions/58252454/react-hooks-using-usestate-vs-just-variables
    const [entryFee, setEntryFee] = useState("0")
    const [numberOfRacers, setNumberOfRacers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")

    const dispatch = useNotification()

    const {
        runContractFunction: enterRace,
        data: enterTxResponse,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raceAddress,
        functionName: "enterRace",
        msgValue: entryFee,
        params: {},
    })

    /* View Functions */

    const { runContractFunction: getEntryFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raceAddress, // specify the networkId
        functionName: "getEntryFee",
        params: {},
    })

    const { runContractFunction: getNumberOfRacers } = useWeb3Contract({
        abi: abi,
        contractAddress: raceAddress,
        functionName: "getNumberOfRacers",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raceAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    async function updateUIValues() {
        // Another way we could make a contract call:
        // const options = { abi, contractAddress: raffleAddress }
        // const fee = await Moralis.executeFunction({
        //     functionName: "getEntranceFee",
        //     ...options,
        // })
        const entryFeeFromCall = (await getEntryFee()).toString()
        const numberOfRacersFromCall = (await getNumberOfRacers()).toString()
        const recentWinnerFromCall = await getRecentWinner()
        setEntryFee(entryFeeFromCall)
        setNumberOfRacers(numberOfRacersFromCall)
        setRecentWinner(recentWinnerFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])
    // no list means it'll update everytime anything changes or happens
    // empty list means it'll run once after the initial rendering
    // and dependencies mean it'll run whenever those things in the list change

    // An example filter for listening for events, we will learn more on this next Front end lesson
    // const filter = {
    //     address: raffleAddress,
    //     topics: [
    //         // the name of the event, parnetheses containing the data type of each event, no spaces
    //         utils.id("RaffleEnter(address)"),
    //     ],
    // }

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        })
    }

    // Probably could add some error handling
    const handleSuccess = async (tx) => {
        await tx.wait(1)
        updateUIValues()
        handleNewNotification(tx)
    }

    return (
        <div className="p-5">
            <h1 className="py-4 px-4 font-bold text-3xl"><em> Car Race Contest </em></h1>
            {raceAddress ? (
                <>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        onClick={async () =>
                            await enterRace({
                                // onComplete:
                                // onError:
                                //onSuccess checks to see if the transaction was successfully sent to metamask
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            "Enter Race"
                        )}
                    </button>

                    <div><h3 className="py-4 px-4 font-medium text-lg"> Entry Fee: {ethers.utils.formatUnits(entryFee, "ether")} ETH </h3></div>
                    <div><h3 className="py-4 px-4 font-medium text-lg"> The current number of racers is: {numberOfRacers} </h3></div>
                    <div><h3 className="py-4 px-4 font-medium text-lg"> The most previous winner was: {recentWinner} </h3></div>
                </>
            ) : (
                <div> <h1 className="py-4 px-4 font-bold text-3xl text-red-600">  <em> Please connect to a supported chain(localhost) for this contest entry. Users are welcome to participate in
                    this contest from any part of the Globe as long as they have what it takes to rule the streets with the wheels, people come and go but Racing stays! </em></h1>
                    <div> <p className="py-4 px-4 font-bold text-3xl text-red-600"> <em> YOUR FANS ARE WAITING!</em> </p> </div>

                    </div>

                   
            )}

        </div>
    )
}

