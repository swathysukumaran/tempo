import defaultActivityImage from "@/assets/default-activity.jpg";

export const googlePlacePhotos=async(placeName:string):Promise<string | null>=>{
    const mapDiv = document.createElement('div');
    const placesService = new google.maps.places.PlacesService(new google.maps.Map(mapDiv));
    try{
        const request={
            query:placeName,
            fields:['photos','name']
        };

        return new Promise<string | null>((resolve)=>{
            placesService.findPlaceFromQuery(request,(results,status)=>{
                if(status===google.maps.places.PlacesServiceStatus.OK && results && results[0]?.photos){
                    const photoUrl=results[0].photos[0].getUrl();
                    resolve(photoUrl);
                }else{
                    resolve(defaultActivityImage);
                }
            });
        });
    }catch(error){
        console.error('Error fetching place photos:',error);
        return defaultActivityImage;
    }
}
