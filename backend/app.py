#!/usr/bin/env python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import torch
import os
import sys
sys.path.append('..')
import models

app = FastAPI()
# CORS
port = int(os.environ.get("PORT", 8000))
origins = ["https://localhost", "https://localhost:3000", "https://localhost:3000/", "https://localhost:8000", "https://localhost:8000/", "https://localhost:{port}"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
device = torch.device('cpu')
model = None

def load_model():
    global model
    print("attempting to load model")
    model_state = torch.load('../models/date_19_07_2023_epochs_200_birdGAN2_latent_dim100_LR0_0005.pt')
    hyperparams = model_state['hparams']
    state_dict = model_state['state_dict']
    model = models.GAN(lr=hyperparams['lr'], latent_dim=hyperparams['latent_dim'])
    model.load_state_dict(state_dict)
    model.eval()
    print("Model loaded")

@app.on_event("startup")
async def startup_event():
    load_model()

@app.get("/generate")
async def generate_image():
    if model is None:
        load_model()
    print("Generating image")
    img = model.create_griddy()
    print("image left the api")
    response = JSONResponse(content={"generated_birds": img}, headers={"Access-Control-Allow-Origin": "https://localhost:3000, https://localhost:8000"})
    return response

app.mount("/", StaticFiles(directory=f"../frontend/build", html=True), name="frontend")
if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=port)