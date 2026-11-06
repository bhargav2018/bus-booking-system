from rest_framework import serializers
from django.contrib.auth.models import User
from .models import bus, seat, Trip, TripSeat, booking

class Userregister(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def create(self, validated_data):
        return User.objects.create_user(username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"])


class SeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = seat
        fields = ["id", "seat_number", "isbooked"]


class TripSeatSerializer(serializers.ModelSerializer):
    seat_number = serializers.CharField(source="seat.seat_number",read_only=True)

    class Meta:
        model = TripSeat
        fields = ["id", "seat", "seat_number", "is_booked"]
        read_only_fields = ["id", "seat_number", "is_booked"]


class TripSerializer(serializers.ModelSerializer):
    trip_seats = TripSeatSerializer(many=True, read_only=True)

    class Meta:
        model = Trip
        fields = ["id","bus","travel_date","is_active","trip_seats","created_at"]
        read_only_fields = ["id", "created_at"]

class BusSerializer(serializers.ModelSerializer):
    seat = SeatSerializer(many=True, read_only=True)
    trips = TripSerializer(many=True, read_only=True)

    class Meta:
        model = bus
        fields = "__all__"


class Bookingserializer(serializers.ModelSerializer):
    bus = serializers.StringRelatedField(read_only=True)
    seat = SeatSerializer(read_only=True)
    user = serializers.StringRelatedField(read_only=True)
    trip_seat = TripSeatSerializer(read_only=True)

    class Meta:
        model = booking
        fields = "__all__"
        read_only_fields = ["user","booking_time","bus","seat","trip_seat"]
