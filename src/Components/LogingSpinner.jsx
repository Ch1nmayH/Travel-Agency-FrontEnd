import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";



const LoadingSpinner = () => {
    const [loading] = useState(true);
    
    return (
        <div className="flex justify-center items-center h-screen">
        <ClipLoader color={"#000"} loading={loading}  size={150} />
        </div>
    );
    }

export default LoadingSpinner;