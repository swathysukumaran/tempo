import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { CheckCircle } from "lucide-react";

import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { toast } from "sonner";
import { API_URL } from "@/config/api";
import { useNavigate } from "react-router-dom";
import TripLoadingAnimation from "./TripLoadingAnimation";
import micAnimation from "../../assets/mic.json";
import Lottie from "lottie-react";
const apiKey = import.meta.env.VITE_GOOGLE_PLACE_API_KEY || "";

type TripFormData = {
  destination: { label: string; value: string } | null;
  tripDetails: string;
};

function CreateTripNew() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<TripFormData>({
    destination: null,
    tripDetails: "",
  });

  const [isRecording, setIsRecording] = useState(false);
  const [transcriptionLoading, setTranscriptionLoading] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  const navigate = useNavigate();

  const updateFormData = (updates: Partial<TripFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    console.log("Form data updated:", formData);
  };
  const handleSubmit = async () => {
    console.log("Extracting details from:", formData);
    const tripData = {
      destination: formData.destination,
      prompt: formData.tripDetails,
    };
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/ai/extract`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(tripData),
      });
      if (!response.ok) throw new Error("Failed to generate trip");
      const trip = await response.json();
      console.log(trip);
      navigate(`/trip/${trip.tripId}`);
    } catch (error) {
      toast("Something went wrong");
      setIsLoading(false);
      console.log(error);
    }
  };

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

  if (isLoading) {
    return <TripLoadingAnimation />;
  }

  const startRecording = async (callingStep: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: { ideal: 2, min: 2 },
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false,
        },
      });
      const chunks: Blob[] = []; // Store chunks as array of Blobs

      mediaRecorder.current = new MediaRecorder(stream, {
        mimeType: "audio/webm", // Specify mime type explicitly
        audioBitsPerSecond: 128000,
      });

      mediaRecorder.current.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        // Combine all chunks
        const audioBlob = new Blob(chunks, { type: "audio/webm" });

        console.log("Total blob size:", audioBlob.size);

        // Ensure blob is not empty
        if (audioBlob.size > 0) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Audio = (reader.result as string).split(",")[1];
            console.log("Base64 audio length:", base64Audio.length);

            if (base64Audio && base64Audio.length > 0) {
              transcribeAudio(base64Audio, callingStep);
            } else {
              toast("No audio data captured");
            }
          };
          reader.readAsDataURL(audioBlob);
        } else {
          toast("No audio recorded");
        }

        // Clean up stream tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      toast("Failed to access microphone");
      console.error("Recording error:", error);
    }
  };
  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      // Type assertion to tell TypeScript that current is definitely a MediaRecorder
      (mediaRecorder.current as MediaRecorder).stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (base64Audio: string, callingStep: string) => {
    setTranscriptionLoading(true);
    try {
      // Break large audio files into smaller chunks
      const maxChunkSize = 10 * 1024 * 1024; // 10MB chunks
      const chunks = [];

      for (let i = 0; i < base64Audio.length; i += maxChunkSize) {
        chunks.push(base64Audio.slice(i, i + maxChunkSize));
      }

      const response = await fetch(`${API_URL}/transcribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          audio: chunks[0],
          mimeType: "audio/webm", // Specify mime type
          totalChunks: chunks.length,
          currentChunk: 0,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        throw new Error(`Transcription failed: ${errorText}`);
      }

      const data = await response.json();
      console.log("response", response);
      console.log("Transcription data:", data);
      console.log("Transcription:", data.transcription);
      if (!data.transcription || data.transcription.trim() === "") {
        toast("No speech detected");
        return;
      }
      switch (callingStep) {
        case "timeframe":
          updateFormData({
            tripDetails: formData.tripDetails
              ? `${formData.tripDetails} ${data.transcription}`
              : data.transcription,
          });
          break;

        default:
          console.error(`Unknown calling step: ${callingStep}`);
      }
    } catch (error) {
      toast("Transcription failed");
      console.error("Transcription error:", error);
    } finally {
      setTranscriptionLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="bg-primary border-b p-4 text-center">
        <h1 className="text-h1 font-semibold text-white">
          Every trip, uniquely yours. Powered by AI.
        </h1>
        <p className="text-white mt-2">Speak your trip. Get a plan.</p>
      </header>

      <main className="flex-1 p-4  overflow-y-auto pb-24 md:pb-16">
        <div className="md:max-w-[50%] mx-auto space-y-12 mt-6">
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-medium text-gray-800">
              Select your destination
            </h2>

            <GooglePlacesAutocomplete
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
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-medium text-gray-800 mt-10">
              Tell us when you’re going and what matters most.
            </h2>

            <div className="flex  items-center gap-2 mt-2">
              <textarea
                placeholder="E.g., June 15-22, 2024;  5 days around Christmas;    A week in late spring"
                value={formData.tripDetails}
                onChange={(e) =>
                  updateFormData({ tripDetails: e.target.value })
                }
                className="w-full min-h-[100px] p-3 rounded-md border border-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <div className="flex flex-col items-center justify-center">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (isRecording) {
                      stopRecording();
                    } else {
                      startRecording("timeframe");
                    }
                  }}
                  className=" p-1 h-fit rounded-full bg-primary text-white transition-transform transform hover:scale-105"
                >
                  {isRecording ? (
                    <Lottie
                      animationData={micAnimation}
                      style={{ height: 36, width: 36 }}
                      loop={true}
                      autoplay={true} // Use autoplay instead of play
                    />
                  ) : (
                    <Lottie
                      animationData={micAnimation}
                      style={{ height: 36, width: 36 }}
                      loop={false}
                      autoplay={false}
                    />
                  )}
                </button>
                {isRecording && (
                  <div className="mb-2 text-sm flex flex-col items-center">
                    <p className="ml-2 text-red-500">
                      Press mic again to transcribe
                    </p>
                  </div>
                )}
              </div>
            </div>

            {transcriptionLoading && (
              <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center">
                <div className="flex items-center space-x-2">
                  <p className="text-white">Transcribing...</p>
                  <CheckCircle className="h-6 w-6 text-white animate-spin-slow" />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className=" p-5 flex sm:flex-row left-0 right-0 fixed bottom-5  bg-none md:bg-none  w-full z-50 gap-4 align-bottom justify-end">
        <Button
          onClick={handleSubmit}
          className="bg-primary w-max hover:bg-primary-dark text-white text-lg p-6"
        >
          Submit ✨
        </Button>
      </footer>
    </div>
  );
}

export default CreateTripNew;
