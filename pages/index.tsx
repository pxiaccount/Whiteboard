import { useEffect, useRef, useState } from "react";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false)
  const [color, setColor] = useState("#000")
  const [size, setSize] = useState(5)

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = 'black'

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas()

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = (e: MouseEvent) => {
      if (!isDrawing) return;
      ctx.strokeStyle = isErasing ? "white" : color; // Switch to white for erasing
      ctx.lineWidth = size; // Make the eraser bigger
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(e.clientX, e.clientY);
    };

    const start = () => {
      setIsDrawing(true);
      ctx.beginPath();
    };

    const end = () => {
      setIsDrawing(false);
    };

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mouseup", end);
    canvas.addEventListener("mousemove", draw);

    return () => {
      canvas.removeEventListener("mousedown", start);
      canvas.removeEventListener("mouseup", end);
      canvas.removeEventListener("mousemove", draw);
    };
  }, [isDrawing]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.width;
  }

  return (
    <>
      <div className="border rounded-3xl px-4" style={{ position: "absolute", top: "2%", left: "50%", transform: "translate(-50%, -50%)" }}>
        <input id="colorChooser" type="color" onChange={(e) => setColor(e.target.value)} value={color} className={`w-6 p-1 rounded-xl mx-2`} />
        |
        <button onClick={() => setIsErasing(!isErasing)} className=" mx-2">{isErasing ? "Pen" : "Eraser"}</button>
        |
        <button onClick={clearCanvas} className=" mx-2">Clear</button>
        |
        <span> Size: </span>
        <input type="number" className="w-12 text-center border-gray-500 border-1 rounded-xl" value={size} onChange={(e) => setSize(Number(e.target.value))} />
      </div >
      <canvas
        ref={canvasRef}
        style={{ border: "1px solid #ccc", backgroundColor: "#fff" }}
      />
    </>
  );
}
