package org.example.rfshop.User.Application.CurrentAccount;

import org.example.rfshop.Auth.Application.ExtractUserEmailFromSecurityContextUseCase.ExtractUserEmailFromSecurityContext;
import org.example.rfshop.BarberShop.Domain.Dto.Response.BarberShopResponseDto;
import org.example.rfshop.BarberShop.Infrastructure.Mapper.BarberShopMapper;
import org.example.rfshop.BarberShop.Infrastructure.Repository.BarberShopRepository;
import org.example.rfshop.Booking.Domain.Response.BookingResponseDto;
import org.example.rfshop.Booking.Infrastructure.Mapper.BookingMapper;
import org.example.rfshop.Booking.Infrastructure.Repository.BookingRepository;
import org.example.rfshop.User.Application.GetUserByEmail.GetUserByEmail;
import org.example.rfshop.User.Infrastructure.Mapper.UserMapper;
import org.example.rfshop.User.domain.Dto.Response.UserResponseDto;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CurrentAccount {

    private final ExtractUserEmailFromSecurityContext extractUserEmail;
    private final GetUserByEmail getUserByEmail;
    private final UserMapper userMapper;
    private final BookingRepository bookingRepository;
    private final BookingMapper bookingMapper;
    private final BarberShopRepository barberShopRepository;
    private final BarberShopMapper barberShopMapper;

    public CurrentAccount(ExtractUserEmailFromSecurityContext extractUserEmail, GetUserByEmail getUserByEmail, UserMapper userMapper, BookingRepository bookingRepository, BookingMapper bookingMapper, BarberShopRepository barberShopRepository, BarberShopMapper barberShopMapper) {
        this.extractUserEmail = extractUserEmail;
        this.getUserByEmail = getUserByEmail;
        this.userMapper = userMapper;
        this.bookingRepository = bookingRepository;
        this.bookingMapper = bookingMapper;
        this.barberShopRepository = barberShopRepository;
        this.barberShopMapper = barberShopMapper;
    }

    @Transactional(readOnly = true)
    public UserResponseDto me() {
        return userMapper.toDto(getUserByEmail.execute(email()));
    }

    @Transactional(readOnly = true)
    public List<BookingResponseDto> bookings() {
        return bookingRepository.findByUserEmail(email()).stream().map(bookingMapper::toDto).toList();
    }

    @Transactional(readOnly = true)
    public List<BarberShopResponseDto> shops() {
        return barberShopRepository.findByOwner_Email(email()).stream().map(barberShopMapper::toDto).toList();
    }

    private String email() {
        return extractUserEmail.execute(SecurityContextHolder.getContext());
    }
}
