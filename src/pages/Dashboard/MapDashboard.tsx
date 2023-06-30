import { useLoadScript, GoogleMap, MarkerF } from "@react-google-maps/api"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useLocation } from "react-router"
import CardFormUser from "../../components/cards/user/CardFormUser";
import { PropsTableUser, UserTableUser } from "../../components/table/TableUser";
import { Chauffeur } from "../../Models";


type TypeStateLocation = { user: UserTableUser, title: PropsTableUser } | null;



export default function MapDashboard() {

    const location = useLocation();

    const [stateLocation, setStateLocation] = useState<TypeStateLocation>(null);
    
    const [coordonnees, setCoordonnees]= useState({lat:0, lng:0})

    const successCurrentPosition = useCallback((position: GeolocationPosition) => {
        let cred = position.coords;
        setCoordonnees({ lat: cred.latitude, lng: cred.longitude });

    }, [])

    const errorCurrentPosition = useCallback((err: GeolocationPositionError) => {
        alert("Impossible d'obtenir votre position code_Error: " + err.code + " Error_Message: " + err.message);

    }, [])

    useEffect(() => {

        if(location.state){
            
            let objectUser  = JSON.parse(location.state.userString as string)
            let title = location.state.title;
            if(title === "chauffeurs"){
                let newUser = Object.assign(new Chauffeur(Chauffeur.clearDataChauffeur), objectUser) as Chauffeur ;
                console.log('newUser', newUser)
                setStateLocation({user: newUser, title: title});

            }

        }

        console.log("location.state =>", location);

        var idCurrentPosition:number;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(successCurrentPosition, errorCurrentPosition);

            idCurrentPosition = navigator.geolocation.watchPosition(successCurrentPosition, errorCurrentPosition);

        } else {
            alert("Vous devez fournir une autorisation pour acceder à votre position")
        }


        return ()=>{
            if (navigator.geolocation){
                navigator.geolocation.clearWatch(idCurrentPosition)
            }
            
        }

    }, [errorCurrentPosition, successCurrentPosition, location]);


    const center = useMemo(() => ({ lat: 3.7176426750652882, lng: 11.455234485898542 }),[]);

    const {isLoaded} = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_KEY_MAP as string,

    })
    if( !isLoaded){
        return (
            <div>
                Chargement du MAP...
            </div>
        )
    }
    return (
        <div className=" d-flex gap-2 justify-content-center w-100 flex-wrap align-items-center p-1"  >
            {
                stateLocation!=null? <div className=" w-100 d-flex justify-content-center align-items-center" >
                    <CardFormUser title={stateLocation.title} user={stateLocation.user} modal={false}  />
                </div>:null
            }
            <div style={{  height:"80vh", minWidth:"80vw"}} className=" p-2 bg-white shadow-sm"  >
                <GoogleMap zoom={14} center={coordonnees.lat ? coordonnees : center} mapContainerStyle={{ width: '100%', height: '100%' }} mapTypeId={google.maps.MapTypeId.ROADMAP}  >
                    <MarkerF visible={true} position={coordonnees.lat ? coordonnees : center} zIndex={99} title={stateLocation?.user.compte.nom?.toUpperCase() as string} label={stateLocation?.user.compte.nom?.toUpperCase()}  />
                </GoogleMap>
            </div>
        </div>
    )
    // console.log(location)
    // return (
    //     <div className=" d-flex justify-content-center align-items-center" >
    //         {"existe"? "existe": "Rien a l'interieur"}
    //     </div>
    // )
}
