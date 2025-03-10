import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Loader from "../components/Loader";

const UploadImage = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [hasResult, setHasResult] = useState(false);

  const [imageOriginal, setImageOriginal] = useState(null);
  const [imageModified, setImageModified] = useState(false);
  const [uploadModified, setUploadModified] = useState(false);

    const computeHash = async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    };


  const sentToHyleModified = async () => {
    // simulate an API call

    if (imageModified) {
        console.log(imageModified)
        const response = await fetch(imageModified);
        console.log(response)
        const blob = await response.blob();
        console.log(blob)
        const hash = await computeHash(blob);
        console.log("Hash of the original image:", hash);
    }
    setLoading(true);
    setTimeout(() => {
      if (loading) {
        setResult(true);
        setHasResult(true);
        setLoading(false);
      } else {
        setLoading(false);
      }
    }, 2000);
  } 
//6a7e1d72ec23accbcaa8e671fa936a04c6af2204ea1b018da1b274a25a80df8a
  const sentToHyleOriginal = async() => {
      if (imageOriginal) {
        console.log(imageOriginal)
        const response = await fetch(imageOriginal);
        console.log(response)
        const blob = await response.blob();
        console.log(blob)
        const hash = await computeHash(blob);
        console.log("Hash of the original image:", hash);
    }
    // simulate an API call
    setLoading(true);
    setTimeout(() => {
        if (loading) {
            setResult(true);
            setHasResult(true);
            setLoading(false);
        } else {
            setLoading(false)
        }
    }, 2000);
  }





  const handleUploadOriginal = async (file) => {
    console.log(file)
    if (!file) return;
    setResult(null);
    setImageOriginal(URL.createObjectURL(file));
  };

  const handleUploadModified = async (file) => {
    if (!file) return;
    setResult(null);
    setImageModified(URL.createObjectURL(file));
  }


  const onDropOriginal = useCallback((acceptedFiles) => {
    handleUploadOriginal(acceptedFiles[0]);
  }, []);

  const onDropModified = useCallback((acceptedFiles) => {
    handleUploadModified(acceptedFiles[0]);
  }, []);

  const { getRootProps : getRootPropsOriginal, getInputProps : getInputPropsOriginal} = useDropzone({
    onDrop: onDropOriginal,
    accept: "image/*",
  });
  const { getRootProps : getRootPropsModified, getInputProps : getInputPropsModified} = useDropzone({
    onDrop : onDropModified,
    accept: "image/*",
  });


  const handlePaste = (event) => {
    const items = event.clipboardData.items;
    if (uploadModified) return;
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
        <h2 className="text-2xl font-bold mb-4 text-center">Upload or Copy an Image</h2>
        <div className="flex items-center justify-center gap-5 bg-slate-200 px-2 py-2 rounded-full m-auto mb-5">
            <div onClick={() => setUploadModified(false)} className={!uploadModified ? "rounded-full bg-slate-800 text-white py-1 px-4" : "py-1 px-4"}>Original Image</div>
            <div onClick={() => setUploadModified(true)} className={uploadModified ? "rounded-full bg-slate-800 text-white py-1 px-4" : "py-1 px-4"}>Modified Image</div>
        </div>
        <div className="flex items-center justify-center" style={{ gap: "10px"}}>
        <div
          {...getRootPropsOriginal()}
          className="border-dashed border-2 border-gray-400 p-4 rounded-lg flex flex-col items-center justify-center"
          style={{ width: uploadModified ? "400px" : "810px", height: "300px" }}
        >
          <input {...getInputPropsOriginal()} />
          {imageOriginal ? (
            <div className="flex flex-col items-center">
              <img src={imageOriginal} alt="Uploaded" className="w-full h-auto mb-2" />
            </div>
          ) : (
            <p>Drag & drop an image here, or click to select one</p>
          )}
        </div>
        { uploadModified && (
            <div {...getRootPropsModified()} 
                className="border-dashed border-2 border-gray-400 p-4 rounded-lg flex flex-col items-center justify-center" 
                style={{ width: "400px", height: "300px" }}
            >

            <input {...getInputPropsModified()} />
                {imageModified ? (
                    <div className="flex flex-col items-center">
                    <img src={imageModified} alt="Uploaded" className="w-full h-auto mb-2" />
                    </div>
                ) : (
                    <p>Drag & drop an image here, or click to select one</p>
                )}
            </div>
        )}
        </div>
        <div className="flex items-center justify-center" style={{ gap: "10px"}}>
            <button
            onClick={() => {
                setResult(null);
                setImageOriginal(null);
            }}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg cursor-pointer"
            style={{ backgroundColor: imageOriginal ? "rgb(255, 0, 0)" : "rgb(200, 200, 200)", cursor: imageOriginal ? "pointer" : "not-allowed", width : uploadModified ? "400px" : "810px" }}
            >
            Remove file
            </button>
            { uploadModified && (

                <button
                onClick={() => {
                    setResult(null);
                    setImageModified(null);
                }}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg cursor-pointer"
                style={{ backgroundColor: imageModified ? "rgb(255, 0, 0)" : "rgb(200, 200, 200)", cursor: imageModified ? "pointer" : "not-allowed", width : "400px" }}
                >
            Remove file
            </button>
            )}
        </div>

        <button
          onClick={() => {
            if (uploadModified) {sentToHyleModified();} else {sentToHyleOriginal();}
          }}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer"
          style={{ backgroundColor: ((uploadModified && (imageOriginal && imageModified)) || !uploadModified && (imageOriginal)) ? "rgb(0, 0, 255)" : "rgb(200, 200, 200)", cursor: imageOriginal ? "pointer" : "not-allowed" }}
        >
          Upload the image{uploadModified? "s" : ""} to Hyle
        </button>


        {loading && (
          <Loader/>
        )}

        {hasResult && (
          <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}>
            <div className="bg-white py-5 px-10 rounded-lg flex flex-col">
              <p className="text-lg">{result ? "Image is valid" : "Image is not valid"}</p>
              <button
                onClick={() => setHasResult(false)}
                className={`mt-4 text-white px-4 py-2 rounded-lg cursor-pointer ${result ? "bg-green-500" : "bg-red-500"}`}
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

export default UploadImage;