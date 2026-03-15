export default function getCroppedImg(file, pixelCrop) {
  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.src = url;
      image.onload = () => resolve(image);
      image.onerror = (error) => reject(error);
    });

  return new Promise(async (resolve, reject) => {
    try {
      const url = URL.createObjectURL(file);
      const image = await createImage(url);
      const canvas = document.createElement("canvas");
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      URL.revokeObjectURL(url);

      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error("Canvas is empty"));
        const croppedFile = new File([blob], file.name, { type: file.type });
        resolve(croppedFile);
      }, file.type);
    } catch (err) {
      reject(err);
    }
  });
}