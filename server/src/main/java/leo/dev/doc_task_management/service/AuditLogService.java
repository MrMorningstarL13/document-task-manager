package leo.dev.doc_task_management.service;

import leo.dev.doc_task_management.dto.response.AuditLogResponse;
import leo.dev.doc_task_management.entity.AuditLog;
import leo.dev.doc_task_management.entity.User;
import leo.dev.doc_task_management.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import leo.dev.doc_task_management.dto.response.PageResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public void log(User user, String action, String entityType, Long entityId, String details, String ipAddress) {
        AuditLog auditLog = AuditLog.builder()
                .user(user)
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .details(details)
                .ipAddress(ipAddress)
                .createdAt(LocalDateTime.now())
                .build();
        auditLogRepository.save(auditLog);
    }

    public PageResponse<AuditLogResponse> getLogsWithFilters(String action, String search, Pageable pageable) {
        Page<AuditLogResponse> page = auditLogRepository.findWithFilters(action, search, pageable)
                .map(AuditLogResponse::fromEntity);
        return PageResponse.of(page);
    }

    public PageResponse<AuditLogResponse> getLogsByUser(Long userId, Pageable pageable) {
        Page<AuditLogResponse> page = auditLogRepository.findAllByUserId(userId, pageable)
                .map(AuditLogResponse::fromEntity);
        return PageResponse.of(page);
    }

    public java.util.List<String> getDistinctActions() {
        return auditLogRepository.findDistinctActions();
    }
}
