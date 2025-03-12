import * as React from "react";
import SignaturePad from "react-signature-canvas";

interface Props {
    value: string;
    onChange: (value: string) => void;
    width: number;
    height: number;
}

const SignaturePadComponent: React.FC<Props> = ({ value, onChange, width, height }) => {
    const sigPadRef = React.useRef<SignaturePad>(null);
    const [canvasSize, setCanvasSize] = React.useState({ width, height });
    const previousSignature = React.useRef<string | null>(value); // Store previous signature
    const previousCanvasSize = React.useRef({ width, height });

    // ✅ Safe fallback values
    const safeWidth = isNaN(width) || width <= 0 ? 500 : width;
    const safeHeight = isNaN(height) || height <= 0 ? 300 : height;

    // ✅ Handle Signature Restoration & Scaling
    const restoreSignature = () => {
        if (sigPadRef.current && previousSignature.current) {
            const canvas = sigPadRef.current.getCanvas();
            const ctx = canvas.getContext("2d");

            if (ctx) {
                const image = new Image();
                image.src = previousSignature.current;

                image.onload = () => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                };
            }
        }
    };

    // ✅ Update Canvas on Resize
    React.useEffect(() => {
        console.log(`🔄 Resizing SignaturePad to: ${safeWidth}x${safeHeight}`);
        setCanvasSize({ width: safeWidth - 40, height: safeHeight - 40 });
    
        if (sigPadRef.current && previousSignature.current) {
            setTimeout(() => {
                console.log("🔄 Restoring and resizing signature...");
                const canvas = sigPadRef.current?.getCanvas();
                if (!canvas) return; // ✅ Safeguard against null
    
                const ctx = canvas.getContext("2d");
                if (!ctx) return; // ✅ Ensure context exists
    
                const image = new Image();
                image.src = previousSignature.current || "";
                image.onload = () => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height); // ✅ Clear before redrawing
                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height); // ✅ Scale correctly
                };
            }, 100);
        }
    }, [safeWidth, safeHeight]);
    
    
    
    

    const handleClear = () => {
        if (sigPadRef.current) {
            console.log("✅ Signature cleared.");
            sigPadRef.current.clear();
            onChange("");
            previousSignature.current = "";
        }
    };

    const handleSave = () => {
        if (sigPadRef.current) {
            console.log("✅ Saving signature...");
            const canvas = sigPadRef.current?.getCanvas();
            if (!canvas) return; // ✅ Avoid null errors
    
            const scaledSignatureData = canvas.toDataURL("image/png"); // ✅ Always get valid data URL
            console.log("✅ Signature saved:", scaledSignatureData);
    
            onChange(scaledSignatureData);
            previousSignature.current = scaledSignatureData || ""; // ✅ Ensure it's always a string
        }
    };
    
    
    
    
    // const handleSave = () => {
    //     if (sigPadRef.current) {
    //         console.log("✅ Saving signature...");
    //         const canvas = sigPadRef.current.getCanvas();
    
    //         if (canvas) {
    //             // ✅ Trim empty space manually
    //             const trimmedCanvas = document.createElement("canvas");
    //             const ctx = trimmedCanvas.getContext("2d");
    
    //             if (ctx) {
    //                 const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    //                 trimmedCanvas.width = canvas.width;
    //                 trimmedCanvas.height = canvas.height;
    //                 ctx.putImageData(imgData, 0, 0);
    //             }
    
    //             const signatureData = trimmedCanvas.toDataURL("image/png");
    //             console.log("✅ Signature saved:", signatureData);
    
    //             onChange(signatureData);
    //             previousSignature.current = signatureData; // ✅ Store the saved signature
    //         } else {
    //             console.error("🚨 ERROR: Canvas is undefined!");
    //         }
    //     }
    // };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: `${safeWidth}px`,
                height: `${safeHeight}px`,
                padding: "10px",
                boxSizing: "border-box",
                background: "white",
                border: "2px solid #ccc",
                borderRadius: "8px",
                maxWidth: "100%",
                maxHeight: "100%",
                overflow: "hidden"
            }}
        >
            <SignaturePad
                ref={sigPadRef}
                penColor="black"
                canvasProps={{
                    width: canvasSize.width,
                    height: canvasSize.height,
                    className: "sigCanvas",
                    style: {
                        border: "1px solid black",
                        backgroundColor: "white",
                        cursor: "crosshair",
                        maxWidth: "100%",
                        maxHeight: "100%",
                        display: "block"
                    }
                }}
            />
            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                <button onClick={handleSave}>Save</button>
                <button onClick={handleClear}>Clear</button>
            </div>
        </div>
    );
};

export default SignaturePadComponent;
