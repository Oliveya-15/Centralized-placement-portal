package com.cpp.placement.service.impl;

import com.cpp.placement.dto.request.LoginRequest;
import com.cpp.placement.dto.request.RegisterRequest;
import com.cpp.placement.dto.response.AuthResponse;
import com.cpp.placement.entity.Role;
import com.cpp.placement.entity.StudentProfile;
import com.cpp.placement.entity.User;
import com.cpp.placement.exception.BadRequestException;
import com.cpp.placement.repository.StudentProfileRepository;
import com.cpp.placement.repository.UserRepository;
import com.cpp.placement.security.JwtUtil;
import com.cpp.placement.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("An account with this email already exists");
        }

        User user = User.builder()
                .fullName(request.fullName())
                .email(request.email().toLowerCase())
                .password(passwordEncoder.encode(request.password()))
                .role(request.role())
                .phone(request.phone())
                .build();

        user = userRepository.save(user);

        if (request.role() == Role.STUDENT) {
            // Auto-assign the newly registered student to the first available TPO
            // so the "Direct 1:1 Professor Desk" has somewhere to point on day one.
            List<User> tpos = userRepository.findByRole(Role.TPO);
            Long assignedTpoId = tpos.isEmpty() ? null : tpos.get(0).getId();

            StudentProfile profile = StudentProfile.builder()
                    .user(user)
                    .assignedTpoId(assignedTpoId)
                    .activeBacklogs(0)
                    .build();
            studentProfileRepository.save(profile);
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getId(), user.getFullName(), user.getEmail(), user.getRole());
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email().toLowerCase())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        if (!user.isActive()) {
            throw new BadRequestException("This account has been deactivated");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getId(), user.getFullName(), user.getEmail(), user.getRole());
    }
}
