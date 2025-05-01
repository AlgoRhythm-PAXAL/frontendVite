import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import InquiryReplyInfo from "../../components/staff/InquiryReplyInfo";

const ViewOneRepliedInquiry = () => {
  const { inquiryId } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  const handleInquiryLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <InquiryReplyInfo
        inquiryId={inquiryId}
        onInquiryLoad={handleInquiryLoad}
      />
  
      {isLoaded && (
        <div className="mt-6 mr-9 flex justify-end space-x-3 border-t border-gray-100 pt-6">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 border border-gray-300 rounded-lg font-medium 
                     text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 
                     focus:ring-Primary focus:ring-offset-2 transition-colors
                     shadow-sm hover:shadow-md"
          >
            Back to List
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewOneRepliedInquiry;
