import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InquiryInfo from "../../components/staff/InquiryInfo";
import axios from "axios";

const ReplyToInquiry = () => {
  const { inquiryId } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const [reply, setReply] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
   
    console.log("Replying to inquiry:", inquiryId, reply);
    try {

      const response = await axios.post(
        `http://localhost:8000/staff/inquiry-management/reply-to-inquiry/${inquiryId}`,
        {reply},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
console.log("response", response.status);
      if (response.status === 200 || response.status === 201) {
        setReply("");
        alert("Reply submitted successfully!");
        navigate(-1);
      }
    } catch (error) {
      console.error("Failed to submit reply:", error);
      setError(
        error.response?.data?.message ||
          "Failed to submit reply. Please try again."
      );
      alert("Failed to submit reply. Please try again.");
    } 
  };

  const handleInquiryLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <InquiryInfo inquiryId={inquiryId} onInquiryLoad={handleInquiryLoad} />

      {isLoaded && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Type a Reply
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <textarea
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-Primary focus:border-transparent transition-all"
                rows={6}
                placeholder="Write your response here..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="submit"
                className="px-5 py-2.5 bg-Primary text-white rounded-lg font-medium hover:bg-PrimaryDark focus:outline-none focus:ring-2 focus:ring-Primary focus:ring-offset-2 transition-colors"
                 
                
              >
                Send Reply
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ReplyToInquiry;
