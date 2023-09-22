/**
 * Created by : Sukaran Golani
 */
import Header from "../components/Header"
import Profile from "./Profile"

function HomePage(){

    return(
        <>        
        {localStorage.getItem("userId") && localStorage.getItem("userCategory")=== "customer"?<Profile/>:""}
        </>
    )

}

export default HomePage