import React from "react";

const Globe: React.FC = () => {
  return (
    <>
      <style>
        {`
          @keyframes earthRotate {
            0% { background-position: 0 0; }
            100% { background-position: 800px 0; } /* Increased for larger globe */
          }
          @keyframes twinkling { 0%,100% { opacity:0.1; } 50% { opacity:1; } }
          @keyframes twinkling-slow { 0%,100% { opacity:0.1; } 50% { opacity:1; } }
          @keyframes twinkling-long { 0%,100% { opacity:0.1; } 50% { opacity:1; } }
          @keyframes twinkling-fast { 0%,100% { opacity:0.1; } 50% { opacity:1; } }
        `}
      </style>
      <div className="flex flex-col items-center justify-start h-screen pt-32">
        <h1 className="text-white font-bold text-7xl mb-8">Earth</h1>
        <div
          className="relative w-[400px] h-[400px] rounded-full overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.2),-10px_0_15px_#c3f4ff_inset,20px_2px_35px_#000_inset,-30px_-5px_40px_#c3f4ff99_inset,300px_0_50px_#00000066_inset,200px_0_45px_#000000aa_inset]"
          style={{
            backgroundImage: "url('https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/globe.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "left",
            animation: "earthRotate 40s linear infinite", // Slowed down animation slightly for larger size
          }}
        >
          {/* Stars */}
          <div
            className="absolute left-[-50px] top-[50px] w-1 h-1 bg-white rounded-full"
            style={{ animation: "twinkling 3s infinite" }}
          />
          <div
            className="absolute left-[100px] top-[-30px] w-1 h-1 bg-white rounded-full"
            style={{ animation: "twinkling-slow 2s infinite" }}
          />
          <div
            className="absolute left-[420px] top-[150px] w-1.5 h-1.5 bg-white rounded-full"
            style={{ animation: "twinkling-long 4s infinite" }}
          />
          <div
            className="absolute left-[200px] top-[430px] w-1 h-1 bg-white rounded-full"
            style={{ animation: "twinkling 3s infinite" }}
          />
          <div
            className="absolute left-[50px] top-[350px] w-1 h-1 bg-white rounded-full"
            style={{ animation: "twinkling-fast 1.5s infinite" }}
          />
          <div
            className="absolute left-[350px] top-[-20px] w-1.5 h-1.5 bg-white rounded-full"
            style={{ animation: "twinkling-long 4s infinite" }}
          />
          <div
            className="absolute left-[450px] top-[80px] w-1 h-1 bg-white rounded-full"
            style={{ animation: "twinkling-slow 2s infinite" }}
          />
        </div>
      </div>
    </>
  );
};

export default Globe;