import * as React from "react";
import { createRoot, Root } from "react-dom/client";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import SignaturePadComponent from "./SignaturePadComponent";

export class SignaturePad implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _container: HTMLDivElement | undefined;
    private _context: ComponentFramework.Context<IInputs> | undefined;
    private _notifyOutputChanged: (() => void) | undefined;
    private _value: string = "";
    private _root: Root | null = null;

    constructor() {
        console.log("✅ SignaturePad constructor invoked");
    }

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
        console.log("✅ SignaturePad init invoked");
        this._context = context;
        this._notifyOutputChanged = notifyOutputChanged;
        this._container = container;

        this._container.classList.add("customControl", "SignaturePadControl", "SignaturePad", "SignaturePadControl.SignaturePad");
        this._container.style.display = "flex";
        this._container.style.justifyContent = "center";
        this._container.style.alignItems = "center";
        this._container.style.overflow = "hidden";

        this._root = createRoot(this._container);
        this.updateView(context);
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        console.log("✅ SignaturePad updateView invoked");
    
        this._context = context;
        const newValue = context.parameters.value.raw || "";
        
        // ✅ Preserve the previous signature before resizing
        if (this._value !== newValue) {
            console.log("🔄 Updating stored signature value...");
            this._value = newValue;
        }
    
        // ✅ Fetch width/height from Power Apps properties
        let width = context.parameters.width.raw || 500;
        let height = context.parameters.height.raw || 300;
    
        // ✅ Ensure `.control-container` size is applied
        const controlContainer = this._container?.closest(".control-container") as HTMLElement;
        width = controlContainer?.clientWidth || width;
        height = controlContainer?.clientHeight || height;
    
        console.log(`📏 Final Applied Dimensions: ${width}x${height}`);
    
        if (this._container) {
            this._container.style.width = `${width}px`;
            this._container.style.height = `${height}px`;
        }
    
        this.render(width, height);
    }
    
    

    private render(width: number, height: number): void {
        console.log("✅ SignaturePad render invoked with size:", width, height);

        if (this._root) {
            this._root.render(
                <React.StrictMode>
                    <SignaturePadComponent
                        value={this._value}
                        onChange={(newValue) => {
                            console.log("✅ Signature updated:", newValue);
                            this._value = newValue;
                            this._notifyOutputChanged?.();
                        }}
                        width={width}
                        height={height}
                    />
                </React.StrictMode>
            );
        }
    }

    public getOutputs(): IOutputs {
        return { value: this._value };
    }

    public destroy(): void {
        this._root?.unmount();
    }
}
