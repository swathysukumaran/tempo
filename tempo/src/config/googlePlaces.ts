import defaultActivityImage from "@/assets/default_activity.jpg";

export const googlePlaceLookup = async (
  placeName: string
): Promise<{
  name: string;
  lat: number;
  lng: number;
  photoUrl: string;
} | null> => {
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

  // Step 1: Find place ID
  const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
    placeName
  )}&inputtype=textquery&fields=place_id&key=${apiKey}`;

  const searchRes = await fetch(searchUrl);
  const searchData = await searchRes.json();

  if (!searchData.candidates || !searchData.candidates[0]?.place_id) {
    console.warn("No place_id found for:", placeName);
    return null;
  }

  const placeId = searchData.candidates[0].place_id;

  // Step 2: Get place details including geometry and photos
  const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,geometry,photos&key=${apiKey}`;
  const detailsRes = await fetch(detailsUrl);
  const detailsData = await detailsRes.json();

  const result = detailsData.result;
  if (!result) return null;

  const lat = result.geometry?.location?.lat;
  const lng = result.geometry?.location?.lng;
  const name = result.name;

  let photoUrl = defaultActivityImage;
  const photoRef = result.photos?.[0]?.photo_reference;
  if (photoRef) {
    photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoRef}&key=${apiKey}`;
  }

  return {
    name,
    lat,
    lng,
    photoUrl,
  };
};
