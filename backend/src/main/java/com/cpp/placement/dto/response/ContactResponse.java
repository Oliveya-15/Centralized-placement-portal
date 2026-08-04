package com.cpp.placement.dto.response;

import com.cpp.placement.entity.Role;

public record ContactResponse(
        Long userId,
        String fullName,
        Role role,
        long unreadCount
) {
}
