import { useState } from "react";
import { Input } from "../components/ui/input";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
type Option = {
  label: string;
  value: string;
};
function CreateTrip() {
  const [place, setPlace] = useState<Option | null>(null);
  return (
    <div className="sm:px-10 md:px-32 lg:px-56xl:px-10 px-5 mt-10">
      <h2 className="font-bold text-3xl">Tell us your travel preferences</h2>
      <p className="mt-3 text-gray-500 text-xl">
        Just provide some basic information, and our trip planner will generate
        a customized itinerary based on your preferences.
      </p>

      <div className="mt-20 flex flex-col gap-10">
        <div>
          <h2 className="text-xl my-3 font-medium">
            What is destination of choice?
          </h2>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
            selectProps={{
              value: place,
              onChange: (v) => {
                setPlace(v);
                console.log(v);
              },
            }}
          />
        </div>
        <div>
          <h2 className="text-xl my-3 font-medium">
            What is destination of choice?
          </h2>
          <Input placeholder={"EX.3"} type="number" />
        </div>
      </div>
    </div>
  );
}

export default CreateTrip;
