import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { CheckCircle, MapPin, Mic, Sparkles, Wand2 } from "lucide-react";

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
      console.log("Generated trip:", trip);
      navigate(`/confirm`, {
        state: { tripData: trip.fields },
      });
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
    <div
      className={
        "min-h-screen bg-[url('/primary_bg.jpg')] bg-cover bg-center flex flex-col font-sans"
      }
    >
      {/* Dark Overlay for Contrast (covers everything behind the form/header) */}
      <div className="absolute inset-0 bg-gray-900/60 z-0"></div>
      {/* Main Content Wrapper - everything else goes inside this */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
        <header className="w-full max-w-4xl py-6 md:py-8 mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-lg">
            Every Journey,{" "}
            <span className="text-amber-400">Uniquely Yours.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mt-2 font-light">
            Powered by AI. Speak your dream trip. Get a plan.
          </p>
        </header>

        <main className="w-full max-w-xl px-4">
          <form
            onSubmit={handleSubmit}
            className="g-white rounded-3xl p-6 md:p-10 space-y-6 md:space-y-8 border-4 border-indigo-500 shadow-2xl transition duration-500 hover:shadow-4xl"
          >
            <div className="space-y-3 relative">
              <label
                htmlFor="destination-search"
                className="block text-xl font-bold text-gray-700 flex items-center"
              >
                <MapPin className="h-5 w-5 mr-2 text-indigo-500" />{" "}
                {/* Icon added */}
                Select your destination
              </label>
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
            <div className="space-y-3 relative">
              <label
                htmlFor="priorities"
                className="block text-xl font-bold text-gray-700 flex items-center"
              >
                <Sparkles className="h-5 w-5 mr-2 text-amber-500" />{" "}
                {/* Icon added */}
                Tell us your travel style and details
              </label>

              <div className="flex items-start gap-4">
                {" "}
                {/* Use flex to align textarea and mic button */}
                <textarea
                  id="priorities"
                  name="priorities"
                  rows={6} // Increased rows for more "blabber" space
                  required
                  placeholder="E.g., 'A two-week honeymoon in October. We love history, need luxurious but private stays, and our budget is $10k.' (Use the mic for a faster input!)"
                  value={formData.tripDetails}
                  onChange={(e) =>
                    updateFormData({ tripDetails: e.target.value })
                  }
                  className="flex-1 rounded-2xl border-2 border-gray-300 shadow-inner p-5 text-base md:text-lg 
                             focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 ease-in-out resize-none"
                />
                <div className="flex flex-col items-center justify-start h-full pt-1">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (isRecording) {
                        stopRecording();
                      } else {
                        startRecording("timeframe");
                      }
                    }}
                    className={`p-4 rounded-full text-white shadow-xl hover:shadow-2xl active:shadow-none focus:outline-none focus:ring-4 transition duration-200 relative
                                ${
                                  isRecording
                                    ? "bg-red-600 ring-red-300"
                                    : "bg-emerald-500 ring-emerald-300 hover:bg-emerald-600"
                                }`} // Conditional styling for recording
                    aria-label={
                      isRecording ? "Stop recording" : "Start voice input"
                    }
                    disabled={transcriptionLoading}
                  >
                    {isRecording && (
                      <span className="absolute inset-0 inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
                    )}
                    <Mic className="h-6 w-6 relative z-10" />
                  </button>
                  {isRecording && (
                    <p className="text-xs text-red-500 mt-2 font-medium animate-pulse">
                      STOP & TRANSCRIBE
                    </p>
                  )}
                </div>
              </div>
              <div className="pt-4">
              <Button
                type="submit"
                className="w-full flex items-center justify-center space-x-3 px-4 py-4 text-xl font-bold rounded-2xl shadow-xl 
                           text-white bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 
                           transition duration-200 ease-in-out transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-indigo-300"
                disabled={!formData.destination || formData.tripDetails.length < 5 || transcriptionLoading}
              >
                <Wand2 className="h-6 w-6" />
                <span>Generate My Custom Plan</span>
              </Button>
            </div>
            
          </form>
          <div className="md:max-w-[50%] mx-auto space-y-12 mt-6">
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
      </div>

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
