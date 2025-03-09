import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import ImageComparaison from "../components/ImageComparaison";
import Loader from "../components/Loader";


const CheckPage = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(3);
  const [hasResult, setHasResult] = useState(true);
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [modifiedChain, setModifiedChain] = useState(["62b4964017388f90b890b354de7e85e4358813ae99ca893dd979466ccdbc5ae8", "731c9caac92ef88b58572b1dd94f823f11e562c51c9c7548a0b782c4bb6bc74e"]);
  const [publisher, setPublisher] = useState("");
  
  const computeHash = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };

  const handleUpload = async (file) => {
    if (!file) return;

    setResult(-1);
    setImage(URL.createObjectURL(file));
    setImageName(file.name);
  };

  const verityImage = async () => {
    if (!image) return;
    setLoading(true);
    setResult(-1);

    const response = await fetch(image);
    const blob = await response.blob();
    const hash = await computeHash(blob);
    console.log("Hash of the original image:", hash);
    // Fake API call simulation
    setTimeout(() => {
        const isValid = Math.random() > 0.5; // Replace this with actual hash verification logic
        setResult(isValid ? 1 : 2);
        setHasResult(true);
        setLoading(false);
    }, 2000);
  };

  const onDrop = useCallback((acceptedFiles) => {
    handleUpload(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  const handlePaste = (event) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        handleUpload(file);
        break;
      }
    }
  };

  useEffect(() => {
    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col justify-center">
        <h2 className="text-2xl font-bold mb-4">Upload or Copy an Image</h2>
        <div
          {...getRootProps()}
          className="border-dashed border-2 border-gray-400 p-4 rounded-lg flex flex-col items-center justify-center"
          style={{ width: "500px", height: "300px" }}
        >
          <input {...getInputProps()} />
          {image ? (
            <div className="flex flex-col items-center w-full h-full">
              <img src={image} alt="Uploaded" className="mb-2 h-full w-auto" />
            </div>
          ) : (
            <p>Drag & drop an image here, or click to select one</p>
          )}
        </div>
        <button
          onClick={() => {
            setResult(null);
            setImage(null);
            setImageName(null);
            }}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg cursor-pointer"
            style={{ backgroundColor: image ? "rgb(255, 0, 0)" : "rgb(200, 200, 200)", cursor: image ? "pointer" : "not-allowed" }}
            >
            Remove file
            </button>

            <input 
            type="text" 
            className="border border-gray-300 rounded-lg px-4 py-2 mt-4" 
            placeholder="Enter the user Public Key"
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
            />

            <button
            onClick={() => {
            verityImage();
          }}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer"
          style={{ backgroundColor: image ? "rgb(0, 0, 255)" : "rgb(200, 200, 200)", cursor: image ? "pointer" : "not-allowed" }}
        >
          Verity the image
        </button>
        {loading && (
          <Loader/>
        )}

        {hasResult && (
          <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}>
            <div className="bg-white py-5 px-10 rounded-lg flex flex-col items-center justify-center">

              {/* Result 1 mean it is a valid image */}
              {result == 1 && (
                <p className="text-lg">{result ? "Image is valid" : "Image is not valid"}</p>
              )}

              {/* Result 2 mean we don't have the image in the blockchain */}
              {result == 2 && (
                <p className="text-lg">This image was not authenticated by Hyle</p>
              )}

              {/* Result 3 mean the image is valid, but has been modified */}
              {result == 3 && (
                <div className="flex flex-col items-center justify-center w-full h-full gap-5">
                  <p className="text-2xl font-bold text-center w-full">Image has been modified</p> 
                  <ImageComparaison beforeImage={modifiedChain[0]} afterImage={modifiedChain[1]} />
                </div>
              )}
              <button
                onClick={() => setHasResult(false)}
                className={`mt-4 text-white px-4 max-w-2xl py-2 w-96 rounded-lg cursor-pointer ${(result != 2) ? "bg-green-500" : "bg-red-500"}`}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckPage;