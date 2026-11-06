from django.contrib import admin
from .models import bus, seat, Trip, TripSeat, booking

@admin.register(bus)
class BusAdmin(admin.ModelAdmin):
    list_display = ("bus_name", "bus_no", "origin", "destination","no_of_seats", "price", "start_time", "reach_time")
    search_fields = ("bus_name", "bus_no", "origin", "destination")
    list_filter = ("origin", "destination")

@admin.register(seat)
class SeatAdmin(admin.ModelAdmin):
    list_display = ("seat_number", "bus", "isbooked")
    search_fields = ("seat_number", "bus__bus_name")
    list_filter = ("isbooked", "bus")

@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ("id", "bus", "travel_date", "is_active", "created_at")
    search_fields = ("bus__bus_name", "bus__bus_no")
    list_filter = ("travel_date", "is_active")
    date_hierarchy = "travel_date"
    readonly_fields = ("created_at",)


@admin.register(TripSeat)
class TripSeatAdmin(admin.ModelAdmin):
    list_display = ("id", "trip", "seat", "is_booked")
    search_fields = ("trip__bus__bus_name", "seat__seat_number")
    list_filter = ("is_booked",)


@admin.register(booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "bus", "seat","booking_time", "status")
    search_fields = ("user__username", "bus__bus_name","seat__seat_number")
    list_filter = ("status", "booking_time", "bus")
    readonly_fields = ("booking_time",)
    list_per_page = 20
