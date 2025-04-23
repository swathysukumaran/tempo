import express from 'express';
import axios from 'axios';

export const lookupPlace=async(req:express.Request,res:express.Response)=>{
    const {placeName}=req.body;
    const apiKey=process.env.GOOGLE_API_KEY;

    try{
        const searchRes=await axios.get("https://maps.googleapis.com/maps/api/place/findplacefromtext/json", {
      params: {
        input: placeName,
        inputtype: "textquery",
        fields: "place_id",
        key: apiKey,
      },
    });
    const placeId = searchRes.data?.candidates?.[0]?.place_id;
    if (!placeId){
        res.status(404).json({ error: "Place not found" });
        return;
    } 

    // 2. Get details
    const detailsRes = await axios.get("https://maps.googleapis.com/maps/api/place/details/json", {
      params: {
        place_id: placeId,
        fields: "name,geometry,photos",
        key: apiKey,
      },
    });
    const place=detailsRes.data.result;
    let photoUrl=null;
    const ref = place?.photos?.[0]?.photo_reference;
    if (ref) {
      photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${ref}&key=${apiKey}`;
    }
    res.json({
      name: place.name,
      lat: place.geometry?.location.lat,
      lng: place.geometry?.location.lng,
      photoUrl,
    });
    }
    catch (err) {
    console.error("Lookup failed:", err);
    res.status(500).json({ error: "Google Place lookup failed" });
  }
}
