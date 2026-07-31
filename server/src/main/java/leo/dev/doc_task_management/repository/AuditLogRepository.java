package leo.dev.doc_task_management.repository;

import leo.dev.doc_task_management.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    @Query("SELECT a FROM AuditLog a WHERE " +
           "(:action IS NULL OR :action = 'ALL' OR a.action = :action) AND " +
           "(:search IS NULL OR :search = '' OR " +
           "LOWER(a.user.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(a.user.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(a.user.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(a.action) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(a.details) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<AuditLog> findWithFilters(@Param("action") String action, @Param("search") String search, Pageable pageable);

    Page<AuditLog> findAllByUserId(Long userId, Pageable pageable);

    @Query("SELECT DISTINCT a.action FROM AuditLog a WHERE a.action IS NOT NULL")
    java.util.List<String> findDistinctActions();
}
