/**
 * Created by : Tushar Arora
 */
import axios from 'axios';

import { doc, setDoc} from "firebase/firestore";

import { db } from '../../firebase';
const Polarityoffeedback = () => {

    
    const polarity= ()=> {
        const restaurantId=localStorage.getItem("userId")
        console.log("restaurantid"+restaurantId)
        let  request={
            restaurantId:restaurantId
        };
        console.log(request)
        const url='https://5xydk75s7zd55lwqkjyqetolv40stmow.lambda-url.us-east-1.on.aws/'
        axios.post(url,request)
            .then((res) => {
                console.log("data of res"+JSON.stringify(res.data));
                const restaurant=res.data
                console.log(restaurant)
                const restaurantdoc = doc(db, "restaurant_polarity", restaurant.restaurantId);
                setDoc(restaurantdoc, {
                  restaurantid: restaurant.restaurantId,
                  polarity:restaurant.polarity
                }) 

            }).catch((error) => {
                console.log(error)
            });

            const url_login='https://us-central1-halifaxfoodie-2dc26.cloudfunctions.net/Polarity_restaurant'
            
            axios.get(url_login)
            .then((res) => {
                console.log(res);  
  
                }).catch((error) => {
                console.log(error)
            })  


           
            


    }
 
    return (<div className='upload'>
    <iframe width="1000" height="800" 
    src="https://datastudio.google.com/embed/reporting/bfe4cbe6-008b-4aa6-8f83-63c858db4f3b/page/LVT9C">
    </iframe><br></br>
    <button style={{margin: "10px",padding:"8px", color:"white", background:"blue", borderRadius:"10px"}} onClick={() => polarity()}> Refresh</button>

</div>);
}

export default Polarityoffeedback;