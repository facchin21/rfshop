package org.example.rfshop.User.Infrastructure.Controller;

import org.example.rfshop.User.Infrastructure.Repository.RoleRepository;
import org.example.rfshop.User.domain.Dto.Response.RoleResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/roles")
public class RoleController {

    private final RoleRepository roleRepository;

    public RoleController(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @GetMapping
    public ResponseEntity<List<RoleResponseDto>> list() {
        List<RoleResponseDto> roles = roleRepository.findAll().stream()
                .map(role -> new RoleResponseDto(role.getId(), role.getName()))
                .toList();
        return new ResponseEntity<>(roles, HttpStatus.OK);
    }
}
