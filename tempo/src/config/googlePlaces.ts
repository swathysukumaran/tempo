import { API_URL } from "./api";

export const googlePlaceLookup = async (
  placeName: string
): Promise<{
  name: string;
  lat: number;
  lng: number;
  photoUrl: string;
} | null> => {
  
  try{
    const res=await fetch(`${API_URL}/lookup-place`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      credentials:"include",
      body:JSON.stringify({placeName}),
    });

    if(!res.ok){
      console.error("Place lookup failed",await res.text());
      return null;
    }
     return await res.json();
  }catch(err){
    console.error("Lookup failed",err);
    return null;
  }

};
