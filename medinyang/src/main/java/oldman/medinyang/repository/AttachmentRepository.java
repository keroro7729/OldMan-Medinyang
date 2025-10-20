package oldman.medinyang.repository;

import oldman.medinyang.domain.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AttachmentRepository extends JpaRepository<Attachment, Long> {
    Optional<Attachment> findByIdAndUserId(Long id, Long userId);

}
