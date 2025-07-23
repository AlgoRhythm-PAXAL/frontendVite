import ProfilePicture from './ImageUpload/ProfilePicture';

/**
 * Test component to debug ProfilePicture rendering
 * Add this to your admin route temporarily to test
 */
const ProfilePictureTest = () => {
  const testCases = [
    {
      name: "Default avatar from backend",
      publicId: "avatar_1743610267755.jpg"
    },
    {
      name: "Null/undefined publicId",
      publicId: null
    },
    {
      name: "Empty string publicId",
      publicId: ""
    },
    {
      name: "Test custom avatar",
      publicId: "sample_avatar"
    }
  ];

  console.log("Environment variables in test:");
  console.log("  VITE_CLOUD_NAME:", import.meta.env.VITE_CLOUD_NAME);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Profile Picture Debug Test</h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Environment Check</h2>
        <div className="space-y-2 text-sm">
          <div><strong>VITE_BACKEND_URL:</strong> {import.meta.env.VITE_BACKEND_URL || "❌ Not set"}</div>
          <div><strong>VITE_CLOUD_NAME:</strong> {import.meta.env.VITE_CLOUD_NAME || "❌ Not set"}</div>
          <div><strong>Mode:</strong> {import.meta.env.MODE}</div>
        </div>
      </div>

      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">ProfilePicture Component Tests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testCases.map((testCase, index) => (
            <div key={index} className="text-center">
              <h3 className="font-medium mb-2">{testCase.name}</h3>
              <div className="mb-2">
                <ProfilePicture publicId={testCase.publicId} width="64" />
              </div>
              <div className="text-xs text-gray-600">
                publicId: {testCase.publicId ? `"${testCase.publicId}"` : "null"}
              </div>
              {testCase.publicId && import.meta.env.VITE_CLOUD_NAME && (
                <div className="mt-2">
                  <a 
                    href={`https://res.cloudinary.com/${import.meta.env.VITE_CLOUD_NAME}/image/upload/c_fill,g_face,w_64,h_64,q_auto,f_auto/${testCase.publicId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 underline"
                  >
                    Test URL
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Manual URL Test</h2>
        <div className="space-y-2">
          <p className="text-sm">Copy and paste this URL in a new tab to test the default avatar:</p>
          <code className="block p-2 bg-gray-100 rounded text-xs break-all">
            https://res.cloudinary.com/{import.meta.env.VITE_CLOUD_NAME}/image/upload/c_fill,g_face,w_100,h_100,q_auto,f_auto/avatar_1743610267755.jpg
          </code>
          <p className="text-xs text-gray-600">
            If this shows an image, your Cloudinary setup is working.
            If not, check your VITE_CLOUD_NAME or the image exists in your Cloudinary account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureTest;
