package com.cpp.placement.service.impl;

import com.cpp.placement.dto.response.ContactResponse;
import com.cpp.placement.dto.response.MessageResponse;
import com.cpp.placement.entity.Message;
import com.cpp.placement.entity.User;
import com.cpp.placement.exception.ResourceNotFoundException;
import com.cpp.placement.repository.MessageRepository;
import com.cpp.placement.repository.UserRepository;
import com.cpp.placement.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public MessageResponse send(Long senderId, Long receiverId, String content) {
        if (!userRepository.existsById(receiverId)) {
            throw new ResourceNotFoundException("Recipient not found");
        }
        Message message = Message.builder()
                .senderId(senderId)
                .receiverId(receiverId)
                .content(content)
                .build();
        return toResponse(messageRepository.save(message));
    }

    @Override
    @Transactional
    public List<MessageResponse> getThread(Long userId, Long otherUserId) {
        List<Message> thread = messageRepository.findThread(userId, otherUserId);
        // Mark messages sent to the current viewer as read
        thread.stream()
                .filter(m -> m.getReceiverId().equals(userId) && !m.isRead())
                .forEach(m -> {
                    m.setRead(true);
                    messageRepository.save(m);
                });
        return thread.stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContactResponse> getContacts(Long userId) {
        List<Long> contactIds = messageRepository.findContactIds(userId);
        return contactIds.stream()
                .map(id -> userRepository.findById(id).orElse(null))
                .filter(java.util.Objects::nonNull)
                .map(u -> new ContactResponse(
                        u.getId(),
                        u.getFullName(),
                        u.getRole(),
                        countUnreadFrom(u.getId(), userId)))
                .toList();
    }

    private long countUnreadFrom(Long contactId, Long userId) {
        return messageRepository.findThread(userId, contactId).stream()
                .filter(m -> m.getSenderId().equals(contactId) && m.getReceiverId().equals(userId) && !m.isRead())
                .count();
    }

    private MessageResponse toResponse(Message message) {
        return new MessageResponse(
                message.getId(),
                message.getSenderId(),
                message.getReceiverId(),
                message.getContent(),
                message.isRead(),
                message.getSentAt()
        );
    }
}
