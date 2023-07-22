from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import torch
import torchvision.transforms as transforms
from PIL import Image
import io
import sys
sys.path.append('..')
import classes

app = FastAPI()

# CORS
origins = ["https://localhost", "https://localhost:3000", "https://localhost:3000/", "*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
device = torch.device('cpu')
model = None

def load_model():
    global model
    model_state = torch.load('../models/date_19_07_2023_epochs_200_birdGAN2_latent_dim100_LR0_0005.pt')
    hyperparams = model_state['hparams']
    state_dict = model_state['state_dict']
    model = classes.GAN(lr=hyperparams['lr'], latent_dim=hyperparams['latent_dim'])
    model.load_state_dict(state_dict)
    model.eval()

@app.on_event("startup")
async def startup_event():
    load_model()

@app.get("/generate")
async def generate_image():
    print("Generating image")
    img = model.generate_sample(time_names=True, return_image=True)
    print("image left the api")
    return {"generated_birds": img}
