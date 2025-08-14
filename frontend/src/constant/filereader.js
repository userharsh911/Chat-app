function base64ImageConvert(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // converts to base64 (with mime type)
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

export default base64ImageConvert;