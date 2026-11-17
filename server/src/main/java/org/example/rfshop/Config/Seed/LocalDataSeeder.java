package org.example.rfshop.Config.Seed;

import org.example.rfshop.BarberShop.Infrastructure.Model.BarberShop;
import org.example.rfshop.BarberShop.Infrastructure.Repository.BarberShopRepository;
import org.example.rfshop.Booking.Infrastructure.Model.Booking;
import org.example.rfshop.Booking.Infrastructure.Repository.BookingRepository;
import org.example.rfshop.User.Infrastructure.Model.Role;
import org.example.rfshop.User.Infrastructure.Model.User;
import org.example.rfshop.User.Infrastructure.Repository.RoleRepository;
import org.example.rfshop.User.Infrastructure.Repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.List;

@Component
public class LocalDataSeeder implements CommandLineRunner {

    static final String BARBER_EMAIL = "martin@barber.test";
    static final String USER_EMAIL = "ana@barber.test";
    private static final ZoneId BUENOS_AIRES = ZoneId.of("America/Argentina/Buenos_Aires");
    private static final List<LocalTime> HOURS = List.of(LocalTime.of(11, 0), LocalTime.of(17, 0), LocalTime.of(18, 30));

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final BarberShopRepository barberShopRepository;
    private final BookingRepository bookingRepository;
    private final PasswordEncoder passwordEncoder;

    public LocalDataSeeder(RoleRepository roleRepository, UserRepository userRepository, BarberShopRepository barberShopRepository, BookingRepository bookingRepository, PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.barberShopRepository = barberShopRepository;
        this.bookingRepository = bookingRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        Role userRole = role("USER");
        Role barberRole = role("BARBER");

        User barber = userRepository.findUserByEmail(BARBER_EMAIL).orElseGet(() -> userRepository.save(account(
                BARBER_EMAIL,
                "Martín",
                "López",
                "barber123",
                barberRole
        )));
        User client = userRepository.findUserByEmail(USER_EMAIL).orElseGet(() -> userRepository.save(account(
                USER_EMAIL,
                "Ana",
                "Pérez",
                "usuario123",
                userRole
        )));

        if (!barberShopRepository.findByOwner_Email(BARBER_EMAIL).isEmpty()) {
            return;
        }

        BarberShop shop = new BarberShop();
        shop.setName("Barber Rivadavia");
        shop.setCity("Buenos Aires");
        shop.setStreet("Rivadavia");
        shop.setStreetNumber(2322);
        shop.setPhone("011 4444 2322");
        shop.setChair(2);
        shop.setOwner(barber);
        BarberShop savedShop = barberShopRepository.save(shop);

        LocalDate today = LocalDate.now(BUENOS_AIRES);
        LocalTime now = LocalTime.now(BUENOS_AIRES);
        boolean reserved = false;
        for (int day = 0; day < 4; day++) {
            LocalDate date = today.plusDays(day);
            for (LocalTime hour : HOURS) {
                if (date.equals(today) && !hour.isAfter(now)) {
                    continue;
                }
                Booking booking = new Booking();
                booking.setBookingStart(LocalDateTime.of(date, hour));
                booking.setBookingEnd(LocalDateTime.of(date, hour.plusMinutes(30)));
                booking.setState(false);
                booking.setBarberShop(savedShop);
                if (!reserved && day > 0 && hour.equals(LocalTime.of(17, 0))) {
                    booking.setReserved(true);
                    booking.setUser(client);
                    reserved = true;
                } else {
                    booking.setReserved(false);
                }
                bookingRepository.save(booking);
            }
        }
    }

    private Role role(String name) {
        return roleRepository.findByName(name).orElseGet(() -> {
            Role role = new Role();
            role.setName(name);
            return roleRepository.save(role);
        });
    }

    private User account(String email, String name, String lastName, String password, Role role) {
        User user = new User();
        user.setEmail(email);
        user.setName(name);
        user.setLastName(lastName);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        return user;
    }
}
