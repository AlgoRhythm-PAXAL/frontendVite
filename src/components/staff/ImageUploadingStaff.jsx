import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const ImageUploadingStaff = () => {
  const [file, setFile] = useState(null);
  const [image, setImage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (validateFile(file)) {
      setFile(file);
      previewFiles(file);
    }
  };

  const validateFile = (file) => {
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/jfif"];
    if (!validTypes.includes(file.type)) {
      setError("Invalid file type. Supported formats: PNG, JPEG, JPG, JFIF");
      toast.error("Invalid file type", {
        description: "Supported formats: PNG, JPEG, JPG, JFIF",
      });
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File size too large (max 10MB)");
      toast.error("File too large", {
        description: "Maximum file size is 10MB",
      });
      return false;
    }
    setError("");
    return true;
  };

  const previewFiles = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (validateFile(file)) {
      setFile(file);
      previewFiles(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file first");
      toast.error("No file selected", {
        description: "Please select a file to upload",
      });
      return;
    }

    setIsUploading(true);
    try {
      const result = await axios.post(
        `${backendURL}/staff/profile/upload`,
        { image },
        { withCredentials: true }
      );
      setError(""); // Clear previous errors
      // Add success feedback here
      toast.success("Upload successful!", {
        description: "Profile picture has been updated",
        action: {
          label: "View",
          onClick: () => window.open(result.data.profilePicLink, "_blank"),
        },
      });
      setTimeout(() => {
        window.location.reload();
      }, 900);
    } catch (err) {
      console.error(err);
      setError("Upload failed. Please try again.");
      toast.error("Upload failed", {
        description: err.response?.data?.message || "Please try again later",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-fit py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Profile Picture Upload
        </h2>

        <form onSubmit={handleSubmit}>
          <div
            className={`border-2 border-dashed rounded-lg p-8 mb-6 text-center transition-colors
                                ${
                                  isDragging
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-300 hover:border-blue-400"
                                }
                                ${error ? "border-red-500 bg-red-50" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center">
              <svg
                className="w-12 h-12 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>

              <label className="cursor-pointer">
                <span className="text-blue-600 font-medium hover:text-blue-500">
                  Click to browse
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleChange}
                  accept="image/png,image/jpeg,image/jpg,image/jfif"
                />
              </label>
              <p className="text-sm text-gray-500 mt-2">
                or drag and drop your photo here
              </p>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm mb-4 text-center">{error}</div>
          )}

          {image && (
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <img
                  src={image}
                  alt="Preview"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <span className="text-white text-sm">Preview</span>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isUploading || !file}
            className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors
                                ${
                                  isUploading || !file
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                                }
                                flex items-center justify-center`}
          >
            {isUploading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Uploading...
              </>
            ) : (
              "Upload Photo"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ImageUploadingStaff;
