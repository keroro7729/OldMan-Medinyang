package oldman.medinyang.domain;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

@Entity
@Table(name = "attachments")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
@Getter
public class Attachment {

    public enum Status { PRESIGNED, UPLOADED, EXPIRED }

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name= "user_id", nullable = false) private Long userId;
    @Column(name = "s3_key", nullable = false, length = 512) private String key;
    @Column(name = "content_type", nullable = false) private String contentType;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 16)
    private Status status;

    // 확정 후 세팅
    @Setter(AccessLevel.PRIVATE)
    @Column(name = "etag")
    private String etag;

    @Setter(AccessLevel.PRIVATE)
    @Column(name = "original_name")
    private String originalName;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private Instant updatedAt;


    @Builder(builderMethodName = "create")
    private Attachment(Long userId, String key, String contentType, String originalName) {
        this.userId = userId;
        this.key = key;
        this.contentType = contentType;
        this.originalName = originalName;
        this.status = Status.PRESIGNED;
    }

    public void markUploaded(String etag){
        if(this.status != Status.PRESIGNED){
            throw new IllegalStateException("이미 업로드 확정되었거나 만료딘 첨부입니다.");
        }
        this.status = Status.UPLOADED;
        this.etag = etag;
    }

    public void expire() {
        if (this.status == Status.UPLOADED) {
            throw new IllegalStateException("이미 업로드된 첨부는 만료 처리할 수 없습니다.");
        }
        this.status = Status.EXPIRED;
    }
}
