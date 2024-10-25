from django.db import models

class Rule(models.Model):
    name = models.CharField(max_length=100)
    condition = models.TextField()
    action = models.TextField()

    def __str__(self):
        return self.name