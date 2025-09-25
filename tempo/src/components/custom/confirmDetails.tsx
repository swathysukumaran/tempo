// import { useRef, useState } from "react";
import { Button } from "../ui/button";
// import { CheckCircle } from "lucide-react";

// import GooglePlacesAutocomplete from "react-google-places-autocomplete";
// import { toast } from "sonner";
// import { API_URL } from "@/config/api";
// import { useNavigate } from "react-router-dom";
// import TripLoadingAnimation from "./TripLoadingAnimation";
// import micAnimation from "../../assets/mic.json";
// import Lottie from "lottie-react";
// const apiKey = import.meta.env.VITE_GOOGLE_PLACE_API_KEY || "";

function ConfirmDetails() {
  // const [isLoading, setIsLoading] = useState(false);

  // const navigate = useNavigate();

  //

  // const handleSubmit = async () => {
  //   console.log("Generating trip with data:", formData);
  //   const tripData = {
  //     location: formData.destination,
  //     tripDetails: formData.tripDetails,
  //   };
  //   try {
  //     setIsLoading(true);
  //     const response = await fetch(`${API_URL}/ai/create-trip`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       credentials: "include",
  //       body: JSON.stringify(tripData),
  //     });
  //     if (!response.ok) throw new Error("Failed to generate trip");
  //     const trip = await response.json();
  //     console.log(trip);
  //     navigate(`/trip/${trip.tripId}`);
  //   } catch (error) {
  //     toast("Something went wrong");
  //     setIsLoading(false);
  //     console.log(error);
  //   }
  // };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="bg-primary border-b p-4 text-center">
        <h1 className="text-h1 font-semibold text-white">Confirm</h1>
        <p className="text-white mt-2">Speak your trip. Get a plan.</p>
      </header>

      <main className="flex-1 p-4  overflow-y-auto pb-24 md:pb-16">
        <div className="md:max-w-[50%] mx-auto space-y-12 mt-6">
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-medium text-gray-800">
              Select your destination
            </h2>

            {/* <GooglePlacesAutocomplete
              apiKey={apiKey}
              selectProps={{
                value: formData.destination,
                onChange: (value) => updateFormData({ destination: value }),
                placeholder: " Search for a destination...",
                styles: {
                  control: (provided) => ({
                    ...provided,
                    padding: "8px",
                    width: "92%",
                    borderRadius: "8px",
                    border: "1px solid #111827",
                    boxShadow: "none",
                    transition: "all 150ms ease",

                    "&:hover": {
                      borderColor: "#0F766E",
                    },
                    "&:focus-within": {
                      borderColor: "#0D9488",
                      boxShadow: "0 0 0 2px rgba(13, 148, 136, 0.3)",
                    },
                  }),
                  placeholder: (provided) => ({
                    ...provided,
                    color: "#374151",
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isFocused ? "#F3F4F6" : "white",
                    color: "#1F2937",
                    "&:hover": {
                      backgroundColor: "#F3F4F6",
                    },
                  }),
                },
              }}
            /> */}
          </div>
        </div>
      </main>

      <footer className=" p-5 flex sm:flex-row left-0 right-0 fixed bottom-5  bg-none md:bg-none  w-full z-50 gap-4 align-bottom justify-end">
        <Button
          // onClick={handleSubmit}
          className="bg-primary w-max hover:bg-primary-dark text-white text-lg p-6"
        >
          Submit ✨
        </Button>
      </footer>
    </div>
  );
}

export default ConfirmDetails;
