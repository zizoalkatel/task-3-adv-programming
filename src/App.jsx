
import { useState, useRef, useEffect } from "react";
import { gatherCandidates } from "./lib/gatherCandidates";
import "./App.css";


//task 2
import CandidatePanel from "./components/CandidatePanel";

export default function App() {
  return <CandidatePanel />;
}


//////////////////////////////////////////////////////////////////////////////////////

// //task 1
// function App() {
//   function handleClick() {
//     gatherCandidates({
//       iceServers: [
//         { urls: "stun:stun.l.google.com:19302" }
//       ],
//       onCandidate: c =>
//         console.log(c.type, c.address, c.port),
//       onDone: () => console.log("done")
//     });
//   }

//   return (
//     <button onClick={handleClick}>
//       Gather Candidates
//     </button>
//   );
// }

// export default App;