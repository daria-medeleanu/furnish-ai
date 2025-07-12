# This project uses the Stable Diffusion 2 Inpainting model:
# https://huggingface.co/stabilityai/stable-diffusion-2-inpainting
# Rombach, R., Blattmann, A., Lorenz, D., Esser, P., & Ommer, B. (2022).
# High-Resolution Image Synthesis with Latent Diffusion Models. arXiv:2112.10752.

from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import FileResponse
import uvicorn
import threading
import base64
import io
import gradio as gr
import torch
from diffusers import StableDiffusionInpaintPipeline
import numpy as np
from PIL import Image, ImageOps
import gc
import tempfile
import os


MODEL_ID = "stabilityai/stable-diffusion-2-inpainting" 
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"


pipeline = None

def load_pipeline():
    """Load and cache the inpainting pipeline"""
    global pipeline
    
    if pipeline is not None:
        return pipeline
    
    try:
        print(f"Loading model: {MODEL_ID}")
        print(f"Using device: {DEVICE}")
        
        pipe = StableDiffusionInpaintPipeline.from_pretrained(
            MODEL_ID,
            torch_dtype=torch.float16 if DEVICE == "cuda" else torch.float32,
            safety_checker=None,
            requires_safety_checker=False,
            use_safetensors=True
        )
        
        print("Model loaded successfully")
        
        pipe = pipe.to(DEVICE)
        print(f"Model moved to {DEVICE}")
        
        if DEVICE == "cuda":
            try:
                pipe.enable_attention_slicing()
                pipe.enable_memory_efficient_attention()
                print("Memory optimizations enabled")
            except Exception as opt_error:
                print(f"Memory optimization warning: {opt_error}")
        
        pipeline = pipe
        print("Pipeline cached successfully")
        return pipe
    except Exception as e:
        error_details = f"Error loading pipeline: {str(e)}"
        print(error_details)
        print(f"Model ID attempted: {MODEL_ID}")
        print(f"Device: {DEVICE}")
        print(f"CUDA available: {torch.cuda.is_available()}")
        if torch.cuda.is_available():
            print(f"CUDA device count: {torch.cuda.device_count()}")
            print(f"Current CUDA device: {torch.cuda.current_device()}")
        return None

def resize_image(image, max_size=768):
    """Resize image while maintaining aspect ratio"""
    if image is None:
        return None
    
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    width, height = image.size
    if width > height:
        if width > max_size:
            height = int(height * max_size / width)
            width = max_size
    else:
        if height > max_size:
            width = int(width * max_size / height)
            height = max_size
    
    width = (width // 8) * 8
    height = (height // 8) * 8
    
    return image.resize((width, height), Image.Resampling.LANCZOS)

def process_mask(mask_image, original_image):
    if mask_image is None:
        return None
    
    mask = mask_image.resize(original_image.size, Image.Resampling.LANCZOS)
    
    if mask.mode != 'L':
        mask = mask.convert('L')
    
    mask_array = np.array(mask)
    mask_array = np.where(mask_array > 127, 255, 0).astype(np.uint8)
    
    return Image.fromarray(mask_array, mode='L')

def inpaint_image(
    original_image,
    mask_image, 
    prompt,
    negative_prompt="",
    num_inference_steps=25,
    guidance_scale=7.5,
    seed=-1
):
    """Inpaint image using the masked areas"""
    
    print(f"Inpaint function called with prompt: {prompt}")
    
    if original_image is None:
        return None, "Error: Please upload an original image"
    
    if mask_image is None:
        return None, "Error: Please provide a mask image"
    
    if not prompt or prompt.strip() == "":
        return None, "Error: Please provide a description for the new background"
    
    pipe = load_pipeline()
    if pipe is None:
        return None, "Error: Could not load the model pipeline. Check the console for details."
    
    try:
        print("Starting image processing...")
        
        image = resize_image(original_image)
        if image is None:
            return None, "Error: Could not process the original image"
        
        print(f"Original image resized to: {image.size}")
        
        blurred_mask = pipeline.mask_processor.blur(mask_image, blur_factor=33)

        mask = process_mask(blurred_mask, image)
        if mask is None:
            return None, "Error: Could not process the mask image"
        
        print(f"Mask processed successfully: {mask.size}")
        
        if seed == -1:
            seed = np.random.randint(0, 2**32 - 1)
        
        print(f"Using seed: {seed}")
        
        generator = torch.Generator(device=DEVICE).manual_seed(seed)
        
        print("Starting inpainting generation...")
        
        with torch.autocast(DEVICE):
            result = pipe(
                prompt=prompt,
                image=image,
                mask_image=mask,
                negative_prompt=negative_prompt,
                num_inference_steps=num_inference_steps,
                guidance_scale=guidance_scale,
                generator=generator,
                height=image.size[1],
                width=image.size[0]
            )
        
        output_image = result.images[0]
        print("Inpainting completed successfully!")
        
        if DEVICE == "cuda":
            torch.cuda.empty_cache()
            gc.collect()

        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp_file:
            output_path = tmp_file.name
            output_image.save(output_path)

        return output_path, f"Inpainting completed successfully! Seed: {seed}"
        
        
    except Exception as e:
        error_msg = f"Error during inpainting: {str(e)}"
        print(f"Inpainting error details: {error_msg}")
        print(f"Error type: {type(e).__name__}")
        return None, error_msg

def create_interface():
    """Create the Gradio interface using gr.Interface for API access"""
    
    inputs = [
        gr.Image(label="Original Image (with your objects)", type="pil"),
        gr.Image(label="Mask Image (white = replace, black = keep)", type="pil"),
        gr.Textbox(label="Background Description", 
                  placeholder="modern minimalist living room with concrete walls and large windows...", 
                  lines=3),
        gr.Textbox(label="Negative Prompt", 
                  placeholder="What you don't want in the background...", 
                  lines=2, 
                  value="blurry, bad quality, distorted, ugly, cluttered, messy, poor lighting, low resolution, busy background"),
        gr.Slider(minimum=10, maximum=50, step=1, value=25, label="Inference Steps"),
        gr.Slider(minimum=1.0, maximum=20.0, step=0.5, value=7.5, label="Guidance Scale"),
        gr.Number(label="Seed (-1 for random)", value=-1, precision=0)
    ]
    
    outputs = [
        gr.File(label="Result"),
        gr.Textbox(label="Status", interactive=False)
    ]
    
    demo = gr.Interface(
        fn=inpaint_image,
        inputs=inputs,
        outputs=outputs,
        title="🏠 Interior Design Background Replacer",
        description="""
        Upload your image with objects, mask the background you want to replace, and generate stunning interior designs!
        Perfect for product photography and furniture visualization.
        
        **How to use:**
        1. Upload your original image containing the objects you want to keep
        2. Upload a separate mask image where:
           - WHITE areas = background to replace
           - BLACK areas = objects to keep
        3. You can create masks using any image editor (Paint, Photoshop, GIMP, etc.)
        """,
        examples=[
            [None, None, "modern minimalist living room with white walls, large windows, natural lighting, clean design"],
            [None, None, "luxurious penthouse interior with marble floors, city skyline view, contemporary furniture"],
            [None, None, "industrial loft with exposed brick walls, concrete floors, metal beams, warm lighting"],
        ],
        api_name="inpaint_image"  
    )
    
    return demo
    
app = FastAPI()

@app.post("/api/inpaint")
async def api_inpaint(
    original_image: UploadFile = File(...),
    mask_image: UploadFile = File(...),
    prompt: str = Form(...),
    negative_prompt: str = Form(""),
    num_inference_steps: int = Form(25),
    guidance_scale: float = Form(7.5),
    seed: int = Form(-1)
):
    try:
        
        original_content = await original_image.read()
        mask_content = await mask_image.read()
        
        original_pil = Image.open(io.BytesIO(original_content))
        mask_pil = Image.open(io.BytesIO(mask_content))
        
        result_path, status = inpaint_image(
            original_pil,
            mask_pil,
            prompt,
            negative_prompt,
            num_inference_steps,
            guidance_scale,
            seed
        )
        
        if result_path is None:
            raise HTTPException(status_code=500, detail=status)
        
        return FileResponse(
            result_path, 
            media_type="image/png",
            filename="inpainted_result.png"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def run_fastapi():
    uvicorn.run(app, host="0.0.0.0", port=8000)

if __name__ == "__main__":
    fastapi_thread = threading.Thread(target=run_fastapi, daemon=True)
    fastapi_thread.start()
    
    demo = create_interface()
    demo.queue()
    demo.launch(
        server_name="0.0.0.0",
        server_port=7860,
        share=False,
        debug=False,
        show_error=True
    )

