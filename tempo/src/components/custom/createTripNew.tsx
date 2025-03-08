import React, { useRef, useState } from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, MapPin, Mic } from "lucide-react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { toast } from "sonner";
import { API_URL } from "@/config/api";
import { useNavigate } from "react-router-dom";
import TripLoadingAnimation from "./TripLoadingAnimation";
// Define the steps
const steps = ["destination", "details", "preferences"];

type TripFormData = {
  destination: { label: string; value: string } | null;
  timeframe: string;
  travelers?: string;
  preferences: string;
  budget?: "budget" | "moderate" | "luxury";
};

function CreateTripNew() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<TripFormData>({
    destination: null,
    timeframe: "",
    travelers: "",
    preferences: "",
    budget: undefined,
  });

  const currentStep = steps[currentStepIndex];
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptionLoading, setTranscriptionLoading] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  const navigate = useNavigate();
  const goToNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const updateFormData = (updates: Partial<TripFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };
  const handleSubmit = async () => {
    console.log("Generating trip with data:", formData);
    const tripData = {
      location: formData.destination,
      timeframe: formData.timeframe,
      travelers: formData.travelers,
      preferences: formData.preferences,
      budget: formData.budget,
    };
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/ai/create-trip`, {
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
      navigate(`/trip-details/${trip.tripId}`);
    } catch (error) {
      toast("Something went wrong");
      setIsLoading(false);
      console.log(error);
    }
  };
  if (isLoading) {
    return <TripLoadingAnimation />;
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case "destination":
        return (
          <div className="space-y-8">
            <div className="space-y-3 text-center">
              <h2 className="text-h2 font-medium text-gray-800">
                Where would you like to go?
              </h2>
              <p className="text-body text-gray-500">
                Let's start planning your perfect trip
              </p>
            </div>

            <div className="w-full max-w-xl mx-auto">
              <GooglePlacesAutocomplete
                selectProps={{
                  value: formData.destination,
                  onChange: (value) => updateFormData({ destination: value }),
                  placeholder: " Search for a destination...",
                  styles: {
                    control: (provided) => ({
                      ...provided,
                      padding: "8px",
                      borderRadius: "8px",
                      border: "1px solid #6B7280",
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

            <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 max-w-xl mx-auto">
              <div className="flex items-center space-x-2 mb-3">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="font-medium text-gray-700">
                  Popular destinations
                </span>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  "Tokyo, Japan",
                  "Paris, France",
                  "Bali, Indonesia",
                  "New York, USA",
                  "Rome, Italy",
                ].map((place) => (
                  <button
                    key={place}
                    className={`px-3 py-1.5 text-small rounded-md transition-colors ${
                      formData.destination?.label === place
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "bg-white text-gray-700 border border-gray-100 hover:border-primary/20 hover:text-primary"
                    }`}
                    onClick={() =>
                      updateFormData({
                        destination: { label: place, value: place },
                      })
                    }
                  >
                    {place}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case "details":
        return (
          <div className="space-y-8">
            <div className="space-y-3 text-center">
              <h2 className="text-h2 font-medium text-gray-800">
                Tell us about your trip to {formData.destination?.label}
              </h2>
              <p className="text-body text-gray-500">
                We'll use this to create your perfect itinerary
              </p>
            </div>

            <div className="max-w-xl mx-auto space-y-6">
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                <label className="block text-body text-gray-700 mb-2">
                  When and how long are you planning to travel?
                </label>
                <textarea
                  placeholder="E.g., About a week in July, 10 days in winter, Long weekend in spring, Not sure yet"
                  value={formData.timeframe}
                  onChange={(e) =>
                    updateFormData({ timeframe: e.target.value })
                  }
                  className="w-full min-h-[100px] p-3 rounded-md border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                <label className="block text-body text-gray-700 mb-2">
                  Who will be traveling? (optional)
                </label>
                <input
                  type="text"
                  placeholder="E.g., Solo, couple, family with kids"
                  value={formData.travelers || ""}
                  onChange={(e) =>
                    updateFormData({ travelers: e.target.value })
                  }
                  className="w-full p-2 rounded-md border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>
        );

      case "preferences":
        return (
          <div className="space-y-8">
            <div className="space-y-3 text-center">
              <h2 className="text-h2 font-medium text-gray-800">
                Tell us about your travel preferences
              </h2>
              <p className="text-body text-gray-500">
                This helps us create a personalized itinerary
              </p>
            </div>

            <div className="max-w-xl mx-auto space-y-6">
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                <label className="block text-body text-gray-700 mb-2">
                  Describe how you want to experience this trip
                </label>
                <textarea
                  placeholder="Consider including:
• Activities you enjoy
• Places you must visit
• Things you want to avoid
• Accommodation preferences
• Budget expectations
• Travel pace and style"
                  value={formData.preferences}
                  onChange={(e) =>
                    updateFormData({ preferences: e.target.value })
                  }
                  className="w-full min-h-[200px] p-3 rounded-md border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className="absolute bottom-3 right-3 p-2 rounded-full bg-primary text-white"
                >
                  <Mic className="h-5 w-5" />
                </button>
                {transcriptionLoading && (
                  <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center">
                    <p className="text-white">Transcribing...</p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <label className="block text-body text-gray-700">
                  What's your budget range?
                </label>
                <div className="flex gap-3">
                  {["budget", "moderate", "luxury"].map((budgetOption) => (
                    <button
                      key={budgetOption}
                      className={`flex-1 p-3 rounded-md capitalize text-small ${
                        formData.budget === budgetOption
                          ? "bg-primary text-white"
                          : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                      }`}
                      onClick={() =>
                        updateFormData({
                          budget: budgetOption as
                            | "budget"
                            | "moderate"
                            | "luxury",
                        })
                      }
                    >
                      {budgetOption}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case "destination":
        return !!formData.destination;
      case "details":
      case "preferences":
        return true;
      default:
        return true;
    }
  };

  const startRecording = async () => {
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
              transcribeAudio(base64Audio);
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

  const transcribeAudio = async (base64Audio: string) => {
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
      updateFormData({
        preferences: `${formData.preferences}\n\n${data.transcription}`.trim(),
      });

      toast("Transcription successful");
    } catch (error) {
      toast("Transcription failed");
      console.error("Transcription error:", error);
    } finally {
      setTranscriptionLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="bg-white border-b p-4 text-center">
        <h1 className="text-h1 font-bold">Plan Your Trip</h1>
        <div className="text-small text-gray-500">
          Step {currentStepIndex + 1} of {steps.length}
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className=" mx-auto">{renderStepContent()}</div>
      </main>

      <footer className="bg-white border-t p-4 flex justify-between">
        <Button
          variant="outline"
          onClick={goToPreviousStep}
          disabled={currentStepIndex === 0}
          className="text-gray-800 hover:bg-gray-100 disabled:opacity-50"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {currentStepIndex === steps.length - 1 ? (
          <Button
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary-dark text-white"
          >
            Generate My Itinerary
          </Button>
        ) : (
          <Button
            onClick={goToNextStep}
            disabled={!canProceed()}
            className="text-white bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </footer>
    </div>
  );
}

export default CreateTripNew;
