import { useState } from "react";

const OpenImageVideo = () => {
  const API_URL = import.meta.env.VITE_FLASK_API_URL; // Get Flask API URL from .env
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    // Check file type and decide which API to call
    const fileType = file.type.split("/")[0]; // 'image' or 'video'
    const endpoint = fileType === "image" ? "open_image" : "open_video";

    try {
      await fetch(`${API_URL}/${endpoint}`, {
        method: "POST",
        body: formData,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    setLoading(false);
  };

  return (
    <label className="cursor-pointer bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center transition duration-300 transform hover:scale-105">
      <input
        type="file"
        accept="image/*,video/mp4"
        onChange={handleFileChange}
        className="hidden"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v14"
        />
      </svg>
      {loading ? "Uploading..." : "Upload Image or Video (*.png/.jpeg/.jpg/.mp4)"}
    </label>
  );
};

export default OpenImageVideo;
