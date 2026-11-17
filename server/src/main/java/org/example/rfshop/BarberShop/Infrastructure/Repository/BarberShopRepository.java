package org.example.rfshop.BarberShop.Infrastructure.Repository;

import org.example.rfshop.BarberShop.Infrastructure.Model.BarberShop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BarberShopRepository extends JpaRepository<BarberShop,Long> {
    List<BarberShop> findByOwner_Email(String email);
}
