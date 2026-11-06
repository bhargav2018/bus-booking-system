from django.http import HttpResponse
from django.contrib.auth import authenticate
from django.db import transaction
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.authtoken.models import Token
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import transaction, IntegrityError

from .serializers import (Userregister,BusSerializer,Bookingserializer)
from .models import bus, seat, Trip, TripSeat, booking

def project(request):
    return HttpResponse("project mapped")


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = Userregister(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response({"token": token.key},status=status.HTTP_201_CREATED)

        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username,password=password)
        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            return Response({"token": token.key,"user_id": user.id,"username": user.username,},status=status.HTTP_200_OK)

        return Response({"error": "Invalid credentials."},status=status.HTTP_401_UNAUTHORIZED)


class Buslist(generics.ListCreateAPIView):
    queryset = bus.objects.all()
    serializer_class = BusSerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]

        return [IsAdminUser()]


class BusdetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = bus.objects.all()
    serializer_class = BusSerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]

        return [IsAdminUser()]



class Bookingview(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        trip_seat_id = request.data.get("trip_seat")

        if not trip_seat_id:
            return Response({"error": "Trip seat ID is required."},status=status.HTTP_400_BAD_REQUEST)

        try:
            selected_trip_seat = (TripSeat.objects.select_for_update()
                .select_related("trip", "seat", "trip__bus")
                .get(id=trip_seat_id))
        except (TripSeat.DoesNotExist, ValueError, TypeError):
            return Response({"error": "Invalid trip seat ID."},status=status.HTTP_400_BAD_REQUEST)

        if not selected_trip_seat.trip.is_active:
            return Response({"error": "This trip is not available."},status=status.HTTP_400_BAD_REQUEST)
        if selected_trip_seat.is_booked:
            return Response({"error": "This seat is already booked."},status=status.HTTP_400_BAD_REQUEST)
        existing_booking = booking.objects.filter(trip_seat=selected_trip_seat,status="BOOKED").exists()
        if existing_booking:
            return Response({"error": "This seat is already booked."},status=status.HTTP_400_BAD_REQUEST)

        try:
            selected_trip_seat.is_booked = True
            selected_trip_seat.save(update_fields=["is_booked"])

            new_booking = booking.objects.create(user=request.user,bus=selected_trip_seat.trip.bus,
                                                 seat=selected_trip_seat.seat,trip_seat=selected_trip_seat)

        except IntegrityError:
            return Response({"error": "This seat has already been booked."},status=status.HTTP_409_CONFLICT)

        serializer = Bookingserializer(new_booking)

        return Response(serializer.data,status=status.HTTP_201_CREATED)



class CancelBookingview(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request, booking_id):
        try:
            selected_booking = (booking.objects.select_for_update()
                                .select_related("trip_seat")
                                .get(id=booking_id,user=request.user))
            
        except booking.DoesNotExist:
            return Response({"error": "Booking not found."},status=status.HTTP_404_NOT_FOUND)
        
        if selected_booking.status == "CANCELLED":
            return Response({"error": "This booking is already cancelled."},status=status.HTTP_400_BAD_REQUEST)
        
        trip_seat = selected_booking.trip_seat

        if trip_seat:
            trip_seat = TripSeat.objects.select_for_update().get(id=trip_seat.id)

            trip_seat.is_booked = False
            trip_seat.save(update_fields=["is_booked"])
        selected_booking.status = "CANCELLED"
        selected_booking.save(update_fields=["status"])

        return Response({"message": "Booking cancelled successfully."},status=status.HTTP_200_OK)


class Userbookingview(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        if request.user.id != user_id:
            return Response({"error": "You cannot view another user's bookings."},status=status.HTTP_403_FORBIDDEN)
        
        user_bookings = booking.objects.filter(user=request.user).order_by("-booking_time")
        serializer = Bookingserializer(user_bookings,many=True)

        return Response(serializer.data)
