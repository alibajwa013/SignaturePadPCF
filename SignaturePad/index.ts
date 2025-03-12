import { SignaturePad } from "./control";

// ✅ Force register the control globally
(window as any).PCFControls = (window as any).PCFControls || {};
(window as any).PCFControls.SignaturePadControl = SignaturePad;

// ✅ Explicitly attach it to global scope as well
(window as any).SignaturePadControl = SignaturePad;

export { SignaturePad };
