const useUploadFunction = () => {

  const handleImageUploads = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dpohyk2ad/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );
    const data = await response.json();
    return data.url
  }

  return { handleImageUploads }
}

export default useUploadFunction

