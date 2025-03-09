import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import ImageComparaison from "../components/ImageComparaison";
import Loader from "../components/Loader";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

const AddUser = () => {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [publisher, setPublisher] = useState("");
  const [newUser, setNewUser] = useState("");
  const [valid, setValid] = useState(false);
  
  const computeHash = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };


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

      const success = {blockchain : res.data.is_original || res2.data.is_edited, c2pa : false}
    return success
  };

  const addUserToImage = async () => {
    if (!image) {
        toast.error("Please upload an image first")
        return
    };
    if (!valid) {
        toast.error("Image not in the blockchain, please upload a valid image")
        return
    }
    if (!publisher) {
        toast.error("Please enter your user public key")
        return
    }
    setLoading(true);
    const response = await fetch(image);
    const blob = await response.blob();
    const hash = await computeHash(blob);
    // Fake API call simulation
      const res = await axios.post("http://localhost:3030/add_publisher", {
          original_image_hash: hash,
          original_image_signature: "",
          publisher_pk: publisher,
      })
      if (res.data == "Nothing added...") {
          toast.error("the user was not granted permissions")
      } else {
          toast.success("The user has been granted rights to modify the image")
      }
      setLoading(false)

  }

  const handleUpload = async (file) => {
    if (!file) return;
    const result = await verifyImageInBlockChainOrC2PA(file)
    if (result.blockchain) {
        toast.success("Image already in the blockchain, enter the user public key you want to add")
    } else {
        toast.error("Image not in the blockchain, please upload a valid image")
    }
    setImage(URL.createObjectURL(file));
    setValid(result.blockchain)
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
        <h2 className="text-2xl font-bold mb-4">Add Editing Writes to an Image</h2>
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
            setImage(null);
            }}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg cursor-pointer"
            style={{ backgroundColor: image ? "rgb(255, 0, 0)" : "rgb(200, 200, 200)", cursor: image ? "pointer" : "not-allowed" }}
            >
            Remove file
            </button>

            <input 
            type="text" 
            className="border border-gray-300 rounded-lg px-4 py-2 mt-4" 
            placeholder="Enter your user image signature"
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
            />

            <input 
            type="text" 
            className="border border-gray-300 rounded-lg px-4 py-2 mt-4" 
            placeholder="Enter the new user Public Key"
            value={newUser}
            onChange={(e) => setNewUser(e.target.value)}
            />

            <button
            onClick={() => {
            addUserToImage();
          }}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer"
          style={{ backgroundColor: (image != null && newUser != "" && publisher != "") ? "rgb(0, 0, 255)" : "rgb(200, 200, 200)", cursor: (image != null && newUser != "" && publisher != "") ? "pointer" : "not-allowed" }}
        >
          Grant permissions
        </button>
        {loading && (
          <Loader/>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddUser;