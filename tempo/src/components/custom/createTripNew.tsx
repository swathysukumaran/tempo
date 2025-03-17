import React, { useRef, useState } from "react";
import { Button } from "../ui/button";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  CalendarDays,
  Infinity as InfinityIcon,
  CalendarRange,
  CheckCircle,
} from "lucide-react";

import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { toast } from "sonner";
import { API_URL } from "@/config/api";
import { useNavigate } from "react-router-dom";
import TripLoadingAnimation from "./TripLoadingAnimation";
import micAnimation from "../../assets/mic.json";
import Lottie from "lottie-react";
const apiKey = import.meta.env.VITE_GOOGLE_PLACE_API_KEY || "";
// Define the steps
const steps = [
  "destination",
  "timeframe",
  "preferences",
  "budget",
  "travelers",
];

type TripFormData = {
  destination: { label: string; value: string } | null;
  timeframe: string;
  travelers?: string;
  preferences: string;
  budget?: string;
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
  const commonPreferences = ["Relaxing", "Adventurous", "Cultural", "Foodie"];
  const commonTravelers = [
    "Solo",
    "Family with kids",
    "Couple",
    "Group of friends",
  ];
  const handleCommonPreferenceClick = (preference: string) => {
    updateFormData({
      preferences: `${formData.preferences}\n\n${preference}`.trim(),
    });
  };
  const handleCommonTravelerClick = (traveler: string) => {
    updateFormData({
      travelers: `${formData.travelers}\n\n${traveler}`.trim(),
    });
  };
  interface QuickOption {
    label: string;
    value: string;
    icon: JSX.Element;
  }

  const handleQuickSelect = (value: string) => {
    updateFormData({ timeframe: value });
  };

  const quickOptions: QuickOption[] = [
    {
      label: "Weekend Getaway",
      value: "3 days",
      icon: <CalendarDays className="h-4 w-4" />,
    },
    {
      label: "One Week",
      value: "7 days",
      icon: <CalendarRange className="h-4 w-4" />,
    },
    {
      label: "Two Weeks",
      value: "14 days",
      icon: <CalendarRange className="h-4 w-4" />,
    },
    {
      label: "Flexible",
      value: "Not sure yet",
      icon: <InfinityIcon className="h-4 w-4" />,
    },
  ];
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
    console.log("Form data updated:", formData);
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
            </div>

            <div className="w-full max-w-xl mx-auto">
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

      case "timeframe":
        return (
          <div className="space-y-8">
            <div className="max-w-[50%] mx-auto space-y-6">
              <h2 className="block text-h2 text-gray-700 mb-2">
                What dates are you thinking of, and how long will you be away?
              </h2>
              {isRecording && (
                <div className="mb-2 text-sm flex items-center">
                  <span className=" text-lg animate-pulse mr-1">⏺️</span>{" "}
                  {/* Recording symbol */}
                  <p className="text-gray-600">
                    Recording <span className="ml-1 animate-pulse">...</span>
                  </p>
                  <p className="ml-2 text-gray-500">
                    Press mic again to transcribe
                  </p>
                </div>
              )}
              <div className="flex  items-center gap-2 mt-2">
                <textarea
                  placeholder="E.g., June 15-22, 2024;  5 days around Christmas;    A week in late spring"
                  value={formData.timeframe}
                  onChange={(e) =>
                    updateFormData({ timeframe: e.target.value })
                  }
                  className="w-full min-h-[100px] p-3 rounded-md border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
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
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {quickOptions.map((option) => (
                  <button
                    key={option.label}
                    className={`flex items-center px-3 py-1.5 text-small rounded-md transition-colors ${
                      formData.timeframe === option.value
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "bg-white text-gray-700 border border-gray-100 hover:border-primary/20 hover:text-primary"
                    }`}
                    onClick={() => handleQuickSelect(option.value)}
                  >
                    {option.icon && <span className="mr-2">{option.icon}</span>}
                    {option.label}
                  </button>
                ))}
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
        );

      case "preferences":
        return (
          <div className="space-y-8">
            <div className="space-y-3 text-center">
              <h2 className="text-h2 font-medium text-gray-800">
                Tell us about your travel preferences
              </h2>
              <p className="text-body text-gray-500">
                Share your vision for the perfect trip.
              </p>
            </div>

            <div className="max-w-xl mx-auto space-y-6">
              <div className=" p-5 rounded-lg  relative">
                <label className="block text-body text-gray-600 mb-2">
                  Write a detailed description of what it looks and feels like.
                </label>
                {isRecording && (
                  <div className="mb-2 text-sm flex items-center">
                    <span className=" text-lg animate-pulse mr-1">⏺️</span>{" "}
                    {/* Recording symbol */}
                    <p className="text-gray-600">
                      Recording <span className="ml-1 animate-pulse">...</span>
                    </p>
                    <p className="ml-2 text-gray-500">
                      Press mic again to transcribe
                    </p>
                  </div>
                )}
                <div className="flex  items-center gap-2 mt-2">
                  <textarea
                    placeholder="Imagine your ideal trip:
• What is the main purpose of the trip?
• What activities excite you?
• Which landmarks are a must-see?
• What's your preferred travel pace?"
                    value={formData.preferences}
                    onChange={(e) =>
                      updateFormData({ preferences: e.target.value })
                    }
                    className="w-full min-h-[200px] p-3 rounded-md border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (isRecording) {
                        stopRecording();
                      } else {
                        startRecording("preferences");
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
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {commonPreferences.map((preference) => (
                    <button
                      key={preference}
                      onClick={() => handleCommonPreferenceClick(preference)}
                      className="bg-gray-200 rounded-full px-3 py-1 text-sm"
                    >
                      {preference}
                    </button>
                  ))}
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
          </div>
        );
      case "budget":
        return (
          <div className="space-y-8">
            <div className="space-y-3 text-center">
              <h2 className="text-h2 font-medium text-gray-800">
                What's your budget for this trip?
              </h2>
              <p className="text-body text-gray-500">
                Help us plan within your comfort zone.
              </p>
            </div>

            <div className="max-w-[50%] mx-auto space-y-6">
              <div className="p-5 rounded-lg relative">
                <label className="block text-body text-gray-600 mb-2">
                  Describe your budget expectations or constraints for this
                  journey.
                </label>

                {isRecording && (
                  <div className="mb-2 text-sm flex items-center">
                    <span className="text-lg animate-pulse mr-1">⏺️</span>
                    <p className="text-gray-600">
                      Recording <span className="ml-1 animate-pulse">...</span>
                    </p>
                    <p className="ml-2 text-gray-500">
                      Press mic again to transcribe
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-2 mt-2">
                  <textarea
                    placeholder="Examples:
• Around $2,000 for the entire week
• Mid-range accommodations but willing to splurge on experiences
• Luxury accommodations with a budget of $5,000-$7,000"
                    value={formData.budget || ""}
                    onChange={(e) => updateFormData({ budget: e.target.value })}
                    className="w-full min-h-[150px] p-3 rounded-md border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (isRecording) {
                        stopRecording();
                      } else {
                        startRecording("budget");
                      }
                    }}
                    className="p-1 h-fit rounded-full bg-primary text-white transition-transform transform hover:scale-105"
                  >
                    {isRecording ? (
                      <Lottie
                        animationData={micAnimation}
                        style={{ height: 36, width: 36 }}
                        loop={true}
                        autoplay={true}
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
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">
                    Or select a general range:
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {[
                      "Budget-friendly",
                      "Mid-range",
                      "Luxury",
                      "Open to splurge on experiences",
                    ].map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          const currentText = formData.budget || "";
                          const newText = currentText
                            ? `${currentText}, ${option.toLowerCase()}`
                            : option;
                          updateFormData({ budget: newText });
                        }}
                        className="bg-gray-200 hover:bg-gray-300 rounded-full px-3 py-1 text-sm transition-colors"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {transcriptionLoading && (
                  <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center rounded-lg">
                    <div className="flex items-center space-x-2">
                      <p className="text-white">Transcribing...</p>
                      <CheckCircle className="h-6 w-6 text-white animate-spin-slow" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case "travelers":
        return (
          <div className="space-y-8">
            <div className="space-y-3 text-center">
              <div className="max-w-[50%] mx-auto space-y-6">
                <div className=" p-5 rounded-lg">
                  <h2 className="text-h2 font-medium text-gray-800 mb-4">
                    Who's traveling with you? Any special needs? (optional)
                  </h2>
                  <div className="flex  items-center gap-2 mt-2">
                    <input
                      type="text"
                      placeholder="E.g., Solo, couple, family with kids"
                      value={formData.travelers || ""}
                      onChange={(e) =>
                        updateFormData({ travelers: e.target.value })
                      }
                      className="w-[90%] p-2 rounded-md border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (isRecording) {
                          stopRecording();
                        } else {
                          startRecording("travelers");
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
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {commonTravelers.map((traveler) => (
                      <button
                        key={traveler}
                        onClick={() => handleCommonTravelerClick(traveler)}
                        className="bg-gray-200 rounded-full px-3 py-1 text-sm"
                      >
                        {traveler}
                      </button>
                    ))}
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
        case "preferences":
          updateFormData({
            preferences: formData.preferences
              ? `${formData.preferences} ${data.transcription}`
              : data.transcription,
          });
          break;

        case "travelers":
          updateFormData({
            travelers: formData.travelers
              ? `${formData.travelers} ${data.transcription}`
              : data.transcription,
          });
          break;
        case "timeframe":
          updateFormData({
            timeframe: formData.timeframe
              ? `${formData.timeframe} ${data.transcription}`
              : data.transcription,
          });
          break;
        case "budget":
          updateFormData({
            budget: formData.budget
              ? `${formData.budget} ${data.transcription}`
              : data.transcription,
          });
          break;

        // Add additional cases for other form fields
        // case 'otherField':
        //   updateFormData({ otherField: data.text });
        //   break;

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
      <header className="bg-white border-b p-4 text-center">
        <h1 className="text-h1 font-semibold text-gray-800">
          Every trip, uniquely yours. Powered by AI.
        </h1>
        <p className="text-gray-600 mt-2">
          We handle the details, you create the memories.
        </p>

        {/* Progress Indicator */}
        <div className="mt-2 w-[70%] mx-auto">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary bg-primary/20">
                  Step {currentStepIndex + 1} of {steps.length}
                </span>
              </div>
            </div>
            <div className="flex h-2 mb-4 overflow-hidden text-xs bg-gray-200 rounded-full">
              <div
                style={{
                  width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
                }}
                className="flex flex-col justify-center whitespace-nowrap text-center text-white transition-all duration-500 bg-primary"
              ></div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 overflow-y-auto pb-2">
        <div className=" mx-auto">{renderStepContent()}</div>
      </main>

      <footer className="bg-white border-t p-4 flex justify-between fixed bottom-0 left-0 right-0 z-10">
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
            Create Trip ✨
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
