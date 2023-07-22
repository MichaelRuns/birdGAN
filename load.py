import classes
import torch
import pytorch_lightning as pl
import matplotlib.pyplot as plt
import os

def main():
    model_state = torch.load('models/date_21_07_2023_epochs_150_birdGAN2_latent_dim100_LR0_0011.pt')
    hyperparams = model_state['hparams']
    state_dict = model_state['state_dict']
    model = classes.GAN(lr=hyperparams['lr'], latent_dim=hyperparams['latent_dim'])
    model.load_state_dict(state_dict)
    model.eval()
    if not os.path.exists("./samples"):
        os.mkdir("./samples")
    for i in range(5):
        model.generate_sample(time_names=True)
    
if __name__ == '__main__':
    main()