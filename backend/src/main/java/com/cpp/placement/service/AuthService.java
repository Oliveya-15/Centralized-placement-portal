package com.cpp.placement.service;

import com.cpp.placement.dto.request.LoginRequest;
import com.cpp.placement.dto.request.RegisterRequest;
import com.cpp.placement.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
