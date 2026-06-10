from django.db import models

# Create your models here.
class Todo(models.Model):
  name = models.CharField(max_length=255)
  slug = models.CharField(max_length=255, unique=True)
  finalized_at = models.DateTimeField(blank=True, null=True, default=None)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
  deleted_at = models.DateTimeField(blank=True, null=True, default=None)

  def __str__(self):
    return self.name
