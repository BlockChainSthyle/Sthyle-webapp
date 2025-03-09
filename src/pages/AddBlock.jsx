import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Loader from "../components/Loader";
import { toast, ToastContainer } from "react-toastify";
import axios from 'axios'

const AddBlock = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [hasResult, setHasResult] = useState(false);

  const [imageOriginal, setImageOriginal] = useState(null);
  const [imageModified, setImageModified] = useState(false);
  const [uploadModified, setUploadModified] = useState(false);
  const [publisher, setPublisher] = useState("");
  const [signature, setSignature] = useState("");

  const [error, setError] = useState("");



  const verifyImageInBlockChainOrC2PA = async (file) => {
    if (!file) return;
    setLoading(true);
    const image = URL.createObjectURL(file)
    const response = await fetch(image);
    const blob = await response.blob();
    const hash = await computeHash(blob);
    // Fake API call simulation
    console.log(hash)
    const res = await axios.post("http://localhost:3030/verify_original_image", {
      image_hash : hash
    })
    const res2 = await axios.post("http://localhost:3030/verify_edit_image", {
      edit_image_hash : hash
    })
    setLoading(false);
    console.log(res.data)
    const success = {blockchain : res.data.is_original || res2.data.is_edited, c2pa : true}
    return success
  };

    const computeHash = async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    };


  const sentToHyleModified = async () => {
    // simulate an API call
    setLoading(true);
    let hash_modified= ""
    let hash_original= ""
    if (imageModified) {
      const response = await fetch(imageModified);
      const blob = await response.blob();
      hash_modified = await computeHash(blob);
    }
    if (imageOriginal) {
      const response = await fetch(imageOriginal);
      const blob = await response.blob()
      hash_original = await computeHash(blob)
    }
    if (hash_modified == "" | hash_original == "") {
      toast.error("Please upload the images")
      return
    }
    const res = await axios.post("http://localhost:3030/register_edit", {
      original_image_hash: hash_original,
      edited_image_hash: hash_modified,
      original_edit_signature: signature,
    })
    if (res.data == "The modification has been inserted in the blockchain") {
      toast.success("The modification has been inserted in the blockchain!")
    } else if (res.data.includes("Edit registered successfully")) {
      toast.success("The modification has been inserted in the blockchain!")
    } else {
      toast.error("The edit has been refused by the blockchain")
    }
    setLoading(false)
  } 
//6a7e1d72ec23accbcaa8e671fa936a04c6af2204ea1b018da1b274a25a80df8a
  const sentToHyleOriginal = async() => {
      let hash = ""
      if (imageOriginal) {
        const response = await fetch(imageOriginal);
        const blob = await response.blob();
        hash = await computeHash(blob);
    }
      console.log(hash)
      if (hash == "") {
        toast.error("please upload a valid image")
        return
      }
    // simulate an API call
    setLoading(true);
      const res = await axios.post("http://localhost:3030/register_image", {
          image_hash: hash,
          image_signature: "",
          owner_pk: publisher,
      })
      console.log(res.data)
      setResult(res.data != "Nothing added...")
      setHasResult(true);
      setLoading(false);
  }





  const handleUploadOriginal = async (file) => {
    if (!file) return;
    setError("");
    const result = await verifyImageInBlockChainOrC2PA(file);
    console.log(result)
    if (uploadModified) {
      if (result.blockchain) {
        setImageOriginal(URL.createObjectURL(file));
        toast.success("Image is the blockchain");
      } else {
        setError("Image not found in the blockchain and not authenticated, please provide the image before the modification");
        toast.error("Image not found in the blockchain and not authenticated, please provide the image before the modification");
        setImageModified(URL.createObjectURL(file));
      }
    } else {
      if (result.c2pa && !result.blockchain) {
        setImageOriginal(URL.createObjectURL(file));
        toast.success("Image is authenticated but is not in blockchain");
      } else if (result.blockchain) {
        setImageOriginal(URL.createObjectURL(file));
        toast.error("Image is already in the blockchain, please provide the modified image");
        setUploadModified(true);
      } else if (!result.blockchain && !result.c2pa) {
        setImageModified(URL.createObjectURL(file));
        toast.error("Image is not authenticated and not in the blockchain, please provide the original image");
        setUploadModified(true);
      }
    }
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
        <h2 className="text-2xl font-bold mb-4 text-center">Upload an Authentic (C2PA) Image or a Modified Version</h2>
        <div className="flex items-center justify-center gap-5 bg-slate-200 px-2 py-2 rounded-full m-auto mb-5">
          <div onClick={() => setUploadModified(false)}
               className={!uploadModified ? "rounded-full bg-slate-800 text-white py-1 px-4" : "py-1 px-4"}>Original
            Image
          </div>
          <div onClick={() => setUploadModified(true)}
               className={uploadModified ? "rounded-full bg-slate-800 text-white py-1 px-4" : "py-1 px-4"}>Modified
            Image
          </div>
        </div>
        <div className="flex items-center justify-center" style={{gap: "10px"}}>
          <div
              {...getRootPropsOriginal()}
              className="border-dashed border-2 border-gray-400 p-4 rounded-lg flex flex-col items-center justify-center"
              style={{width: uploadModified ? "400px" : "810px", height: "300px"}}
          >
            <input {...getInputPropsOriginal()} />
            {imageOriginal ? (
                <div className="flex flex-col items-center h-full">
                  <img src={imageOriginal} alt="Uploaded" className="h-full mb-2"/>
                </div>
            ) : (
                <p>Drag & drop an image here, or click to select one</p>
            )}
          </div>
          {uploadModified && (
              <div {...getRootPropsModified()}
                   className="border-dashed border-2 border-gray-400 p-4 rounded-lg flex flex-col items-center justify-center"
                   style={{width: "400px", height: "300px"}}
              >

                <input {...getInputPropsModified()} />
                {imageModified ? (
                    <div className="flex flex-col items-center">
                      <img src={imageModified} alt="Uploaded" className="w-full mb-2"/>
                    </div>
                ) : (
                    <p>Drag & drop an image here, or click to select one</p>
                )}
              </div>
          )}
        </div>

        {error != "" && (
            <div className="mt-4 text-red-700 px-4 py-2 rounded-lg cursor-pointer">
              {error}
            </div>
        )}

        <div className="flex items-center justify-center" style={{gap: "10px"}}>
          <button
              onClick={() => {
                setResult(null);
                setImageOriginal(null);
              }}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg cursor-pointer"
              style={{
                backgroundColor: imageOriginal ? "rgb(255, 0, 0)" : "rgb(200, 200, 200)",
                cursor: imageOriginal ? "pointer" : "not-allowed",
                width: uploadModified ? "400px" : "810px"
              }}
          >
            Remove file
          </button>
          {uploadModified && (

              <button
                  onClick={() => {
                    setResult(null);
                    setImageModified(null);
                  }}
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg cursor-pointer"
                  style={{
                    backgroundColor: imageModified ? "rgb(255, 0, 0)" : "rgb(200, 200, 200)",
                    cursor: imageModified ? "pointer" : "not-allowed",
                    width: "400px"
                  }}
              >
                Remove file
              </button>
          )}
        </div>
        <input
            type="text"
            className="border border-gray-300 rounded-lg px-4 py-2 mt-4"
            placeholder="Enter the user signature"
            onChange={(e) => setSignature(e.target.value)}
            value={signature}
        />
        <input
            type="text"
            className="border border-gray-300 rounded-lg px-4 py-2 mt-4"
            placeholder="Enter the user Public Key"
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
        />


        <button
            onClick={() => {
              if (uploadModified) {
                sentToHyleModified();
              } else {
                sentToHyleOriginal();
              }
            }}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer"
            style={{
              backgroundColor: ((uploadModified && (imageOriginal && imageModified)) || !uploadModified && (imageOriginal)) ? "rgb(0, 0, 255)" : "rgb(200, 200, 200)",
              cursor: imageOriginal ? "pointer" : "not-allowed"
            }}
        >
          Upload the image{uploadModified ? "s" : ""} to Hyle
        </button>


        {loading && (
            <Loader/>
        )}

        {hasResult && (
            <div className="fixed inset-0 flex items-center justify-center"
                 style={{backgroundColor: "rgba(0, 0, 0, 0.9)"}}>
              <div className="bg-white py-5 px-10 rounded-lg flex flex-col">
                <p className="text-lg">{result ? "Successfully added" : "Your image was refused"}</p>
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
      <ToastContainer/>
    </div>
  );
};

export default AddBlock;