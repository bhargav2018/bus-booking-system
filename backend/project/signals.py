from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import bus, seat, Trip, TripSeat


@receiver(post_save, sender=bus)
def create_seats(sender, instance, created, **kwargs):
    if created:
        seats_to_create = [seat(bus=instance,seat_number=f"S{i}")
            for i in range(1, instance.no_of_seats + 1)]
        seat.objects.bulk_create(seats_to_create)


@receiver(post_save, sender=Trip)
def create_trip_seats(sender, instance, created, **kwargs):
    if created:
        bus_seats = seat.objects.filter(bus=instance.bus)
        trip_seats = [TripSeat(trip=instance,seat=bus_seat)
            for bus_seat in bus_seats]
        TripSeat.objects.bulk_create(trip_seats,ignore_conflicts=True)
