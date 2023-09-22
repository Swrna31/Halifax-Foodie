/**
 * Created by : Tushar Arora
 */
import React from 'react'
import axios from 'axios';
function Visualization() {

  const refreshLoginstatus= async(event)=> {
      


    const url_recipe='https://us-central1-halifaxfoodie-2dc26.cloudfunctions.net/visualization_recipe'
    event.preventDefault();
    axios.get(url_recipe)
        .then((res) => {
            console.log(res);  

        }).catch((error) => {
            console.log(error)
        });


    const url_login='https://us-central1-halifaxfoodie-2dc26.cloudfunctions.net/Visualization_verscion2'
      event.preventDefault();
      axios.get(url_login)
          .then((res) => {
              console.log(res);  
  
          }).catch((error) => {
              console.log(error)
          })        

}


  return (
    <div className='upload'>
    <iframe width="750" height="600" style={{margin: "10px"}}
        src="https://datastudio.google.com/embed/reporting/800d7e31-cf75-4710-8af8-41101da6c29b/page/EAN9C">
    </iframe>
    <iframe width="750" height="600" style={{margin: "10px"}}
    src="https://datastudio.google.com/embed/reporting/36ebe621-c3ef-4b14-93b3-702cc46dc7cc/page/HPN9C">

    </iframe>
    <br></br>
    <button  style={{margin: "10px",padding:"8px", color:"white", background:"blue", borderRadius:"10px" }} onClick={refreshLoginstatus}>Refresh</button>
    {/* <button style={{margin: "10px",padding:"8px", color:"white", background:"blue",borderRadius:"10px"}} onClick={()=> onextract(S3bucket,selected_Recipe_File)}>Extract Recipe</button> */}
    </div>
  )
}

export default Visualization