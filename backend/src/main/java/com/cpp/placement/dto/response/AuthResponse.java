package com.cpp.placement.dto.response;

import com.cpp.placement.entity.Role;

public record AuthResponse(
        String token,
        Long userId,
        String fullName,
        String email,
        Role role
) {
}
