import { useState } from "react";
import db from "../assets/db.json";

const ImageComparaison = ({ beforeImage, afterImage }) => {
  const [superpose, setSuperpose] = useState(false);
  const [opacity, setOpacity] = useState(0.5);

  const give_path_image = (hash) => {
    const image_name = db[hash];
    if (!image_name) {
      return "./images/not_found.png";
    }
    return "./images/" + image_name;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-5">
      <div className="flex items-center justify-center gap-5 bg-slate-200 px-2 py-2 rounded-full m-auto mb-5">
        <div
          onClick={() => setSuperpose(false)}
          className={!superpose ? "rounded-full bg-slate-800 text-white py-1 px-4" : "py-1 px-4"}
        >
          Cote à Cote
        </div>
        <div
          onClick={() => setSuperpose(true)}
          className={superpose ? "rounded-full bg-slate-800 text-white py-1 px-4" : "py-1 px-4"}
        >
          Superposed
        </div>
      </div>
      {superpose ? (
        <div className="flex flex-col items-center gap-3 relative max-w-sm">
          <div className="flex gap-3 relative w-full">
            <img src={give_path_image(beforeImage)} alt="before" className="w-full" />
            <img
              src={give_path_image(afterImage)}
              alt="after"
              className="w-full absolute z-10"
              style={{ opacity: opacity }}
            />
          </div>
          <div className="flex items-center gap-2 mt-4">
            <label htmlFor="opacity" className="text-sm">Opacity of the modified image:</label>
            <input
              type="range"
              id="opacity"
              name="opacity"
              min="0"
              max="1"
              step="0.01"
              value={opacity}
              onChange={(e) => setOpacity(e.target.value)}
              className="w-64"
            />
            <div className="text-sm">{opacity}</div>
          </div>
        </div>
      ) : (
        <div className="flex gap-3 p-5 max-w-md">
            <div className="w-1/2 flex flex-col items-center gap-2 text-lg">
                <img src={give_path_image(beforeImage)} alt="before" className="w-full" />
                <div>Before</div>
            </div>
            <div className="w-1/2 flex flex-col items-center gap-2 text-lg">
                <img src={give_path_image(afterImage)} alt="after" className="w-full" />
                <div>After</div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ImageComparaison;