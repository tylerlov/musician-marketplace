import React from 'react'
import { useEffect,useState } from 'react'
import {useParams}  from 'react-router-dom'
import {collection, getDocs, query, where, orderBy, limit, startAfter} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast}  from 'react-toastify'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'

function Category() {
    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)
    const [lastFetchedListing, setLastFetchedListing] = useState(null)

    const params = useParams()

    useEffect(() => {
        const fetchListings = async () => { 
            try{
                //Get reference
                const listingsRef = collection(db, 'listings')

                //Create a query
                const q = query(listingsRef, where('type', '==', params.categoryName), orderBy('timestamp', 'desc'), limit(10))

                //Execute query
                const querySnap = await getDocs(q)
               
                const lastVisible = querySnap.docs[querySnap.docs.length - 1]
                setLastFetchedListing(lastVisible)

                const listings = []
                //Loop through query results - particualr to firebase docs
                querySnap.forEach((doc) => {
                    return listings.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })

                setListings(listings)
                setLoading(false)

            }catch(error){
                toast.error('Error fetching listings')
            }
        }
        fetchListings()
    // Think about what this dependency array is for
    }, [params.categoryName])

    const onFetchMoreListings = async () => { 
        try{
            //Get reference
            const listingsRef = collection(db, 'listings')

            //Create a query
            const q = query(listingsRef, where('type', '==', params.categoryName), startAfter(lastFetchedListing), orderBy('timestamp', 'desc'), limit(10))

            //Execute query
            const querySnap = await getDocs(q)
           
            const lastVisible = querySnap.docs[querySnap.docs.length - 1]
            setLastFetchedListing(lastVisible)

            const listings = []
            //Loop through query results - particualr to firebase docs
            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })

            //keep previous loaded listings and append new ones
            setListings((prevState) => [...prevState, ...listings])
            setLoading(false)

        }catch(error){
            toast.error('Error fetching more listings')
        }
    }

return (
    <div className="category">
        <header>
            <p className="pageHeader">
                {params.categoryName === 'rent' ? 'Places for rent' : 'Places for sale'}
            </p>
        </header>

        {loading ? 
            (<Spinner /> )
            : listings && listings.length > 0 ? 
                ( <>
                    <main>
                        <ul className="categoryListings">
                            {listings.map((listing) => (
                                <ListingItem key={listing.id} listing={listing.data} id={listing.id} />
                            ))}
                        </ul>
                    </main>
                    <br />
                    {lastFetchedListing && (
                        <p className="loadMore" onClick={onFetchMoreListings}>
                            Load more
                        </p>
                    )}


                </> ) 
                : (<p>No listings for {params.categoryName}</p>)
        }
    </div>  
)
}

export default Category