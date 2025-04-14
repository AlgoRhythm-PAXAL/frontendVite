const ProfilePicture = ({ publicId, width }) => {
  const cloudName = import.meta.env.VITE_CLOUD_NAME;

  // Handle missing publicId or cloudName
  if (!publicId || !cloudName) {
    return (
      <div className="w-32 h-32  rounded-full bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">No Image</span>
      </div>
    );
  }

  // Generate image URL with Cloudinary transformations
  const imageUrl = `https://res.cloudinary.com/${cloudName}/image/upload/` +
    `c_fill,g_face,w_${width},h_${width},q_auto,f_auto/${publicId}`;

  // Generate responsive srcSet
  const srcSet = [100, 200, 300, 400]
    .map(size => 
      `https://res.cloudinary.com/${cloudName}/image/upload/` +
      `c_fill,g_face,w_${size},h_${size},q_auto,f_auto/${publicId} ${size}w`
    )
    .join(', ');

  return (
    <img
      src={imageUrl}
      srcSet={srcSet}
      sizes="(max-width: 640px) 100px, (max-width: 1024px) 200px, 300px"
      alt="Profile"
      className="w-32 h-32 rounded-full object-cover border-2 border-white shadow-lg"
      loading="lazy"
      style={{
        width: `${width}px`,
        height: `${width}px`,
        minWidth: `${width}px`,
        minHeight: `${width}px`
      }}
    />
  );
};

export default ProfilePicture;