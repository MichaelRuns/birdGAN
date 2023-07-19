import os
import zipfile
import pytorch_lightning as pl
import torch
import classes
import matplotlib.pyplot as plt
import datetime
NUM_EPOCHS = 100
LEARN_RATE = 0.001
BATCH_SIZE = 32
LATENT_DIM = 200
def main():
    if not os.path.exists("./data"):
        set_up_data()
    if not os.path.exists("./outputs"):
        os.mkdir("./outputs")
        os.mkdir("./outputs/real")
    sample_dataset()
    torch.set_float32_matmul_precision('medium')
    dm = classes.BirdDataModule(batch_size=BATCH_SIZE)
    model = classes.GAN(lr=LEARN_RATE)
    trainer = pl.Trainer(max_epochs=NUM_EPOCHS)
    trainer.fit(model, dm)
    model_state = {
    'state_dict': model.state_dict(),
    'hparams': {
        'latent_dim': LATENT_DIM,
        'lr': LEARN_RATE,
        'batch_size': BATCH_SIZE,
        'num_epochs': NUM_EPOCHS,
    }
    }
    current_date = datetime.date.today().strftime("%d_%m_%Y")
    model_name = f"date_{current_date}_epochs_{NUM_EPOCHS}_birdGAN2_latent_dim{LATENT_DIM}.pt"
    torch.save(model_state, f'./models/{model_name}')

    
def set_up_data():
    print("Setting up data...")
    os.mkdir("./data")
    with zipfile.ZipFile("./birds_525.zip", 'r') as zip_ref:
        zip_ref.extractall("./data")
    print("Done!")

def sample_dataset():
    dm = classes.BirdDataModule()
    dm.setup()
    imgs, label = next(iter(dm.train_dataloader()))
    imgs = imgs.numpy().transpose(0, 2, 3, 1)
    for i in range(5):
        plt.imshow(imgs[i])
        plt.xticks([])
        plt.yticks([])
        plt.axis('off')
        plt.savefig(os.path.join('./outputs/real', f'image_{i}.png'))
        plt.close()  # Close the figure to free up memory

    

if __name__ == "__main__":
    main()