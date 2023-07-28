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