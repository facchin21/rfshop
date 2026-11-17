package org.example.rfshop.Booking.Infrastructure.Mapper;

import org.example.rfshop.Booking.Domain.Request.CreateBookingDto;
import org.example.rfshop.Booking.Domain.Response.BookingResponseDto;
import org.example.rfshop.Booking.Infrastructure.Model.Booking;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BookingMapper {

    Booking toEntity(CreateBookingDto createBookingDto);

    @Mapping(target = "barberShopId", source = "barberShop.id")
    @Mapping(target = "barberShopName", source = "barberShop.name")
    BookingResponseDto toDto(Booking booking);
}
