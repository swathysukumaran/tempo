import defaultActivityImage from "@/assets/default_activity.jpg";

type PlaceLookupResult = {
  photoUrl: string;
  lat: number;
  lng: number;
  name: string;
};

export const googlePlaceLookup = async (
  placeName: string
): Promise<PlaceLookupResult | null> => {
  const mapDiv = document.createElement("div");
  const placesService = new google.maps.places.PlacesService(
    new google.maps.Map(mapDiv)
  );

  const request = {
    query: placeName,
    fields: ["photos", "name", "geometry"],
  };

  return new Promise((resolve) => {
    placesService.findPlaceFromQuery(
      request,
      (results, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          results &&
          results[0]
        ) {
          const place = results[0];
          const photoUrl = place.photos?.[0]?.getUrl() || defaultActivityImage;
          const lat = place.geometry?.location?.lat();
          const lng = place.geometry?.location?.lng();

          if (lat && lng) {
            resolve({
              photoUrl,
              lat,
              lng,
              name: place.name || placeName,
            });
          } else {
            resolve(null);
          }
        } else {
          console.warn("Place lookup failed for:", placeName, status);
          resolve(null);
        }
      }
    );
  });
};
