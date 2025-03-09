import "../style/loader.css"


const Loader = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}>
            <div className="bg-white py-5 px-32 rounded-lg z-50 overflow-hidden flex flex-col justify-center items-center gap-24" style={{ backgroundColor: "#e8e8e8" }}>
              <p className="mb-4 w-full text-center text-2xl">Checking image...</p>
              <div className="loader">
                <div className="box box0">
                  <div></div>
                </div>
                <div className="box box1">
                  <div></div>
                </div>
                <div className="box box2">
                  <div></div>
                </div>
                <div className="box box3">
                  <div></div>
                </div>
                <div className="box box4">
                  <div></div>
                </div>
                <div className="box box5">
                  <div></div>
                </div>
                <div className="box box6">
                  <div></div>
                </div>
                <div className="box box7">
                  <div></div>
                </div>
                <div className="ground">
                  <div></div>
                </div>
              </div>
              <button
                onClick={() => {window.location.reload();}}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
    )
}

export default Loader