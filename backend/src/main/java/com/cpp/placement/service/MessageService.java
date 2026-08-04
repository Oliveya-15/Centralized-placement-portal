package com.cpp.placement.service;

import com.cpp.placement.dto.response.ContactResponse;
import com.cpp.placement.dto.response.MessageResponse;

import java.util.List;

public interface MessageService {
    MessageResponse send(Long senderId, Long receiverId, String content);
    List<MessageResponse> getThread(Long userId, Long otherUserId);
    List<ContactResponse> getContacts(Long userId);
}
