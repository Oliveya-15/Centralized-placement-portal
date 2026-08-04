package com.cpp.placement.controller;

import com.cpp.placement.dto.request.MessageRequest;
import com.cpp.placement.dto.response.ContactResponse;
import com.cpp.placement.dto.response.MessageResponse;
import com.cpp.placement.security.CustomUserDetails;
import com.cpp.placement.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<MessageResponse> send(@AuthenticationPrincipal CustomUserDetails user,
                                                 @Valid @RequestBody MessageRequest request) {
        return ResponseEntity.ok(messageService.send(user.getId(), request.receiverId(), request.content()));
    }

    @GetMapping("/thread/{otherUserId}")
    public ResponseEntity<List<MessageResponse>> thread(@AuthenticationPrincipal CustomUserDetails user,
                                                          @PathVariable Long otherUserId) {
        return ResponseEntity.ok(messageService.getThread(user.getId(), otherUserId));
    }

    @GetMapping("/contacts")
    public ResponseEntity<List<ContactResponse>> contacts(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(messageService.getContacts(user.getId()));
    }
}
