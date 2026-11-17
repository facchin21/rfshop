package org.example.rfshop.BarberShop.Infrastructure.Mapper;

import org.example.rfshop.BarberShop.Domain.Dto.Request.CreateBarberShopDto;
import org.example.rfshop.BarberShop.Domain.Dto.Response.BarberShopResponseDto;
import org.example.rfshop.BarberShop.Infrastructure.Model.BarberShop;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BarberShopMapper {

    BarberShop toEntity(CreateBarberShopDto createBarberShopDto);

    @Mapping(target = "ownerId", source = "owner.id")
    BarberShopResponseDto toDto(BarberShop barberShop);

}
