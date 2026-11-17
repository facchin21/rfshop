package org.example.rfshop.User.Infrastructure.Controller;

import org.example.rfshop.User.Application.CurrentAccount.CurrentAccount;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/me")
public class MeController {

    private final CurrentAccount currentAccount;

    public MeController(CurrentAccount currentAccount) {
        this.currentAccount = currentAccount;
    }

    @GetMapping
    public ResponseEntity<?> me() {
        return new ResponseEntity<>(currentAccount.me(), HttpStatus.OK);
    }

    @GetMapping("/bookings")
    public ResponseEntity<?> bookings() {
        return new ResponseEntity<>(currentAccount.bookings(), HttpStatus.OK);
    }

    @GetMapping("/barber-shops")
    public ResponseEntity<?> shops() {
        return new ResponseEntity<>(currentAccount.shops(), HttpStatus.OK);
    }
}
