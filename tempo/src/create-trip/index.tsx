import React, { useEffect, useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { Input } from "../components/ui/input";
import { SelectBudgetOptions, SelectTravelersList } from "@/constants/options";
import { Button } from "@/components/ui/button";
type Option = {
  label: string;
  value: string;
};
type FormData = {
  [key: string]: string | number | boolean;
};
function CreateTrip() {
  const [place, setPlace] = useState<Option | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  const handleInputChange = (
    name: string,
    value: string | number | boolean
  ) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  useEffect(() => {
    console.log(formData);
  }, [formData]);
  return (
    <div className="sm:px-10 md:px-32 lg:px-56xl:px-10 px-5 mt-10">
      <h2 className="font-bold text-3xl">
        Tell us your travel preferences 🏕️🌴
      </h2>
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
            selectProps={{
              value: place,
              onChange: (v) => {
                setPlace(v);
                handleInputChange("location", v ? v.value : "");
              },
              placeholder: "Search for a destination...",
              styles: {
                control: (provided) => ({
                  ...provided,
                  padding: "2px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }),
              },
            }}
          />
        </div>
        <div>
          <h2 className="text-xl my-3 font-medium">
            How many days are you planning your trip?
          </h2>
          <Input
            placeholder={"EX.3"}
            type="number"
            onChange={(e) => handleInputChange("noOfDays", e.target.value)}
          />
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">What is Your Budget?</h2>
          <div className="grid grid-cols-3 gap-5 mt-5">
            {SelectBudgetOptions.map((item, index) => (
              <div
                key={index}
                onClick={() => handleInputChange("budget", item.title)}
                className={`p-4 border curosor-pointer rounded-lg hover:shadow-lg $(formData.budget === item.title &&'shadow-lg border-black')`}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">
            Who do you plan on traveling with on your next adventure?
          </h2>
          <div className="grid grid-cols-3 gap-5 mt-5">
            {SelectTravelersList.map((item, index) => (
              <div
                key={index}
                onClick={() => handleInputChange("traveler", item.people)}
                className={`p-4 border curosor-pointer rounded-lg hover:shadow-lg $(formData.traveler === item.people &&'shadow-lg border-black')`}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="my-10 justify-end flex">
        <Button>Generate Trip</Button>
      </div>
    </div>
  );
}

export default CreateTrip;
