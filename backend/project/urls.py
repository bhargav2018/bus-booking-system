from django.urls import path
from . views import RegisterView,LoginView,Buslist,\
BusdetailView,Bookingview,Userbookingview
from .views import CancelBookingview
urlpatterns=[
    path('register/',RegisterView.as_view(),name='registerurl'),
    path('login/',LoginView.as_view(),name='loginurl'),
    path('Buslist/',Buslist.as_view(),name='buslisturl'),
    path('busdetail/<int:pk>/',BusdetailView.as_view(),name='busdetailurl'),
    path('Bookingview/',Bookingview.as_view(),name='bookingviewurl'),
    path('Userbookingview/<int:user_id>/',Userbookingview.as_view(),name='Userbookingviewurl'),
    path("CancelBookingview/<int:booking_id>/",CancelBookingview.as_view(),name="cancelbookingurl")
]