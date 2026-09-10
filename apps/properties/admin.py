from django.contrib import admin
from .models import Property, PropertyImage

# Register your models here.


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ('title', 'property_type', 'listing_type', 'price', 'city', 'is_available', 'created_at')
    list_filter = ('property_type', 'listing_type', 'is_available', 'city')
    search_fields = ('title', 'description', 'address', 'city')
    prepopulated_fields = {'slug': ('title',)}  # Automatically populate the slug field based on the title

@admin.register(PropertyImage)
class PropertyImageAdmin(admin.ModelAdmin):
    list_display = ('property', 'image')
    search_fields = ('property__title',)