from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone
# Create your models here.

class CustomUserManager(BaseUserManager):
  def create_user(self, username, email, password=None, **extra_fields):
    if not username:
      raise ValueError('The username must be set')
    
    if not email:
      raise ValueError('the email field must be fill')
    
    email = self.normalize_email(email)
    user = self.model(email=email, username= username, **extra_fields)
    user.set_password(password)

    user.save(using=self._db)

    return user
  

  def create_superuser(self, username, email, password=None, **extra_fields):
    extra_fields.setdefault('is_staff', True)
    extra_fields.setdefault('is_superuser', True)
    extra_fields.setdefault('is_active', True)
    return self.create_user(username, email, password, **extra_fields)
  

class Profile(AbstractBaseUser, PermissionsMixin):
  email = models.EmailField(unique=True)
  username = models.CharField(max_length=120) 
  first_name = models.CharField(max_length=60, null=True, blank=True)
  last_name = models.CharField(max_length=60, null=True, blank=True)
  birthday = models.DateField(null=True, blank=True)
  gender = models.CharField(max_length=10, choices=[('M', 'Male'), ('F', 'Female')], null=True, blank=True)

  is_active = models.BooleanField(default=True)
  is_superuser = models.BooleanField(default=False)
  is_staff = models.BooleanField(default=False)

  date_joined = models.DateTimeField(default=timezone.now)
  last_login = models.DateTimeField(blank=True, null=True)

  objects = CustomUserManager()

  USERNAME_FIELD = 'email'
  REQUIRED_FIELDS = ['username']

  def __str__(self):
    return self.username