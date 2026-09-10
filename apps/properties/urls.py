from django.urls import path
from .views import (
    PropertyListView,
    PropertyCreateView, 
    PropertyUpdateView,
    PropertyDetailView,
    PropertyImageUploadView,
    PropertyDeleteView,
    MyPropertiesListView
)

urlpatterns = [
    path('', PropertyListView.as_view(), name='property-list'),
    path("my-properties/", MyPropertiesListView.as_view(), name="my-properties"),   # put fixed path before dynamic paths to avoid conflicts
    path('create/', PropertyCreateView.as_view(), name="property-create"),
    path('<slug:slug>/update/', PropertyUpdateView.as_view(), name="property-update"),
    path('<slug:slug>/', PropertyDetailView.as_view(), name='property-detail'),
    path("<slug:slug>/upload-image/", PropertyImageUploadView.as_view(), name="property-image-upload"),
    path('<slug:slug>/delete/', PropertyDeleteView.as_view(), name='property-delete'),
]