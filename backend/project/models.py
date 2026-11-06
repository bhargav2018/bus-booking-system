from django.db import models
from django.contrib.auth.models import User

class bus(models.Model):
    bus_name = models.CharField(max_length=50)
    bus_no = models.CharField(max_length=20, unique=True)
    origin = models.CharField(max_length=50)
    destination = models.CharField(max_length=50)
    no_of_seats = models.PositiveBigIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    start_time = models.TimeField()
    reach_time = models.TimeField()
    features = models.TextField()

    def __str__(self):
        return f"{self.bus_name} {self.bus_no} {self.origin} {self.destination}"


class seat(models.Model):
    bus = models.ForeignKey(bus,on_delete=models.CASCADE,related_name="seat")
    seat_number = models.CharField(max_length=10)
    isbooked = models.BooleanField(default=False)

    class Meta:
        constraints = [models.UniqueConstraint(fields=["bus", "seat_number"],name="unique_seat_number_per_bus")]

    def __str__(self):
        return f"{self.bus} {self.seat_number}"


class Trip(models.Model):
    bus = models.ForeignKey(bus,on_delete=models.CASCADE,related_name="trips")
    travel_date = models.DateField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["travel_date"]
        constraints = [models.UniqueConstraint(fields=["bus", "travel_date"],name="unique_bus_trip_date")]

    def __str__(self):
        return f"{self.bus.bus_name} - {self.travel_date}"


class TripSeat(models.Model):
    trip = models.ForeignKey(Trip,on_delete=models.CASCADE,related_name="trip_seats")
    seat = models.ForeignKey(seat,on_delete=models.CASCADE,related_name="trip_seats")
    is_booked = models.BooleanField(default=False)

    class Meta:
        constraints = [models.UniqueConstraint(fields=["trip", "seat"],name="unique_seat_per_trip")]

    def __str__(self):
        return f"{self.trip} - {self.seat.seat_number}"


class booking(models.Model):
    STATUS_CHOICES = [("BOOKED", "Booked"),("CANCELLED", "Cancelled"),]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    bus = models.ForeignKey(bus, on_delete=models.CASCADE)
    seat = models.ForeignKey(seat, on_delete=models.CASCADE)
    trip_seat = models.ForeignKey(TripSeat,on_delete=models.PROTECT,null=True,blank=True,related_name="bookings")
    booking_time = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10,choices=STATUS_CHOICES,default="BOOKED")

    def __str__(self):
        return (f"{self.user.username} - "f"{self.bus.bus_name} - "f"{self.seat.seat_number}")