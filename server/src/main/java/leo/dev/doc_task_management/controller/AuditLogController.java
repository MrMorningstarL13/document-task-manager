package leo.dev.doc_task_management.controller;

import leo.dev.doc_task_management.dto.response.AuditLogResponse;
import leo.dev.doc_task_management.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import leo.dev.doc_task_management.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/audit-logs")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<PageResponse<AuditLogResponse>> getAllLogs(
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String search,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(auditLogService.getLogsWithFilters(action, search, pageable));
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<PageResponse<AuditLogResponse>> getLogsByUser(
            @PathVariable Long userId,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(auditLogService.getLogsByUser(userId, pageable));
    }

    @GetMapping("/actions")
    public ResponseEntity<java.util.List<String>> getDistinctActions() {
        return ResponseEntity.ok(auditLogService.getDistinctActions());
    }
}