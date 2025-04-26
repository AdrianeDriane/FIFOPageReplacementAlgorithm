import Dock from "./components/Dock";
import { ConstructionIcon } from "lucide-react";

function Flowchart() {
    return (
      <>
        <div className="h-screen text-4xl w-screen gap-3 text-[#f9fbfa] bg-[#001e2b] flex items-center justify-center">
          <ConstructionIcon size={30}/>
          <h1 className="cfont-cooper">Flowchart Under Construction...</h1>
        </div>
        <Dock/>
      </>
    )
  }
  
  export default Flowchart;