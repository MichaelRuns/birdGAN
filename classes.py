import pytorch_lightning as pl
import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import datasets, transforms
from torch.utils.data import DataLoader
import matplotlib.pyplot as plt
import random
import string
import os
import base64

class BirdDataModule(pl.LightningDataModule):
  def __init__(self, data_dir='./data/train', batch_size=32, num_workers=20):
    super().__init__()
    self.data_dir = data_dir
    self.batch_size = batch_size
    self.num_workers = num_workers
    random_transforms = [transforms.ColorJitter(), transforms.RandomRotation(degrees=20)]
    self.transform = transforms.Compose([transforms.Resize(64),
                                transforms.CenterCrop(64),
                                transforms.RandomHorizontalFlip(p=0.5),
                                transforms.RandomApply(random_transforms, p=0.2),
                                transforms.ToTensor(),
                                transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))])
  def setup(self, stage=None):
        Images = datasets.ImageFolder(self.data_dir, transform=self.transform)
        self.train_loader = DataLoader(Images, batch_size=self.batch_size, num_workers=self.num_workers, shuffle=True)

  def train_dataloader(self):
    return self.train_loader

class Discriminator(nn.Module):
  def __init__(self):
    super().__init__()
    self.model = nn.Sequential(
                nn.Conv2d(3, 64, 4, stride=2, padding=1, bias=False),
                nn.LeakyReLU(negative_slope=0.2, inplace=True),
                nn.Conv2d(64, 128, 4, stride=2, padding=1, bias=False),
                nn.BatchNorm2d(128),
                nn.LeakyReLU(negative_slope=0.2, inplace=True),
                nn.Conv2d(128, 256, 4, stride=2, padding=1, bias=False),
                nn.BatchNorm2d(256),
                nn.LeakyReLU(negative_slope=0.2, inplace=True),
                nn.Conv2d(256, 512, 4, stride=2, padding=1, bias=False),
                nn.BatchNorm2d(512),
                nn.LeakyReLU(negative_slope=0.2, inplace=True),
                nn.Conv2d(512, 1, 4, stride=1, padding=0, bias=False),
                nn.Sigmoid()
                )

  def forward(self, x):
    return self.model(x).view(-1, 1)
  
class Generator(nn.Module):
  def __init__(self, latent_dim=100):
    super().__init__()
    self.model = nn.Sequential(
                nn.ConvTranspose2d(latent_dim, 512, 4, stride=1, padding=0, bias=False),
                nn.BatchNorm2d(512),
                nn.ReLU(True),
                nn.ConvTranspose2d(512, 256, 4, stride=2, padding=1, bias=False),
                nn.BatchNorm2d(256),
                nn.ReLU(True),
                nn.ConvTranspose2d(256, 128, 4, stride=2, padding=1, bias=False),
                nn.BatchNorm2d(128),
                nn.ReLU(True),
                nn.ConvTranspose2d(128, 64, 4, stride=2, padding=1, bias=False),
                nn.BatchNorm2d(64),
                nn.ReLU(True),
                nn.ConvTranspose2d(64, 3, 4, stride=2, padding=1, bias=False),
                nn.Tanh()
                )

  def forward(self, x):
    return self.model(x)

class GAN(pl.LightningModule):
  def __init__(self, latent_dim = 100, lr=0.0002):
    super().__init__()
    self.save_hyperparameters()
    self.generator = Generator(self.hparams.latent_dim)
    self.discriminator = Discriminator()
    self.validation_z = torch.randn(6, self.hparams.latent_dim, 1, 1)
    self.automatic_optimization = False

  def forward(self, z):
      gen_res = self.generator(z)
      return gen_res

  def adversarial_loss(self, y_hat, y):
      return F.binary_cross_entropy(y_hat, y)

  def training_step(self, batch, batch_idx):
      real_images, label = batch
      z = torch.randn(real_images.shape[0], self.hparams.latent_dim, 1, 1)
      z = z.type_as(real_images)
      opt_g, opt_d = self.optimizers()
      #train discriminator
      self.toggle_optimizer(opt_d)
      opt_d.zero_grad()
      y_hat_real = self.discriminator(real_images)
      y_real = torch.ones(real_images.size(0),1)
      y_real = y_real.type_as(real_images)
      real_loss = self.adversarial_loss(y_hat_real, y_real)
      y_hat_fake = self.discriminator(self(z).detach())
      y_fake = torch.zeros(real_images.size(0), 1)
      y_fake = y_fake.type_as(y_hat_fake)
      fake_loss = self.adversarial_loss(y_hat_fake, y_fake)
      d_loss = (real_loss + fake_loss)/2
      self.manual_backward(d_loss)
      opt_d.step()
      self.untoggle_optimizer(opt_d)
      #end train discriminator
      #train generator
      self.toggle_optimizer(opt_g)
      opt_g.zero_grad()
      fake_images = self(z)
      y_hat = self.discriminator(fake_images)
      y = torch.ones(real_images.size(0),1)
      y = y.type_as(real_images)
      g_loss = self.adversarial_loss(y_hat, y)
      self.manual_backward(g_loss)
      opt_g.step()
      self.untoggle_optimizer(opt_g)
      #end train generator
      log_dict = {"d_loss": d_loss, "g_loss": g_loss}
      return {"loss": d_loss + g_loss, "progress_bar": log_dict, "log": log_dict}


  def configure_optimizers(self):
      lr = self.hparams.lr
      opt_g = torch.optim.Adam(self.generator.parameters(), lr=lr)
      opt_d = torch.optim.Adam(self.discriminator.parameters(), lr=lr)
      return [opt_g, opt_d], []
  
  def create_griddy(self, rows=6, cols=6):
     # display a lot of images
    z = torch.randn(rows * cols, self.hparams.latent_dim, 1, 1, device=torch.device("cuda" if torch.cuda.is_available() else "cpu")).type_as(self.generator.model[0].weight)
    samples = self(z).cpu()
    samples = samples.detach().numpy().transpose(0, 2, 3, 1)
    fig = plt.figure(figsize=(rows, cols))
    for i in range(rows * cols):
        plt.subplot(rows, cols, i + 1)
        plt.imshow(samples[i])
        plt.xticks([])
        plt.yticks([])
        plt.axis('off')
    plt.savefig('./temp.png')
    filename = './temp.png'
    with open(filename, "rb") as image_file:
        encoded_image = base64.b64encode(image_file.read()).decode('utf-8')
        os.remove(filename)  # Remove the file after encoding
        return encoded_image
       
  def generate_sample(self, time_names=False, return_image=False):
      z = torch.randn(1, self.hparams.latent_dim, 1, 1, device=torch.device("cuda" if torch.cuda.is_available() else "cpu")).type_as(self.generator.model[0].weight)
      sample_image = self(z).cpu()
      print('epoch ', self.current_epoch)
      img = sample_image.detach().numpy().transpose(0, 2, 3, 1)
      plt.imshow(img[0])
      plt.xticks([])
      plt.yticks([])
      plt.axis('off')
      filename = None
      if time_names:
        #generate random name
        characters = string.ascii_letters + string.digits
        random_string = ''.join(random.choice(characters) for _ in range(5))
        if not os.path.exists("./samples"):
          os.mkdir("./samples")
        filename = f'./samples/{random_string}.png'
        plt.savefig(filename)
      else:
        filename = './outputs/epoch_{self.current_epoch}.png'
        plt.savefig(filename)
      if return_image:
            # Read the saved image and convert it to a base64-encoded string
            with open(filename, "rb") as image_file:
                encoded_image = base64.b64encode(image_file.read()).decode('utf-8')
            os.remove(filename)  # Remove the file after encoding

            return encoded_image

  def on_train_epoch_end(self):
    self.generate_sample()