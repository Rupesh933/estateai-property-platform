from django.db import models
from django.conf import settings

from django.utils.text import slugify


class Property(models.Model):
    PROPERTY_TYPE_CHOICES = [
        ('apartment', 'Apartment'),
        ('house', 'House'),
        ('villa', 'Villa'),
        ('plot', 'Plot'),
        ('commercial', 'Commercial'),
    ]

    LISTING_TYPE_CHOICES = [
        ('sale', 'For Sale'),
        ('rent', 'For Rent'),
    ]

    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField()
    property_type = models.CharField(max_length=20, choices=PROPERTY_TYPE_CHOICES)
    listing_type = models.CharField(max_length=10, choices=LISTING_TYPE_CHOICES)

    price = models.DecimalField(max_digits=12, decimal_places=2)
    area_sqft = models.PositiveIntegerField()
    bedrooms = models.PositiveIntegerField(default=0)
    bathrooms = models.PositiveIntegerField(default=0)

    city = models.CharField(max_length=100)
    address = models.CharField(max_length=255)

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='properties'
    )

    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        """
        Automatically generate the slug from the title before saving.
        Example: "Beautiful House" → "beautiful-house"
        
        IMPORTANT:
        slug has unique=True, so duplicate titles can cause a
        "UNIQUE constraint failed" error.
        For production, generate a unique slug if duplicate titles are allowed.

            if not self.slug:
                self.slug = slugify(self.title)

            super().save(*args, **kwargs)
        """
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1

            while Property.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1

            self.slug = slug

        super().save(*args, **kwargs)


class PropertyImage(models.Model):
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name='images'
    )
    image = models.ImageField(upload_to='property_images/')

    def __str__(self):
        return f"Image for {self.property.title}"
