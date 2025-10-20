package oldman.medinyang.service;

import lombok.RequiredArgsConstructor;
import oldman.medinyang.domain.Attachment;
import oldman.medinyang.dto.attachment.GetLinkRes;
import oldman.medinyang.dto.attachment.PutInitRes;
import oldman.medinyang.repository.AttachmentRepository;
import oldman.medinyang.storage.KeyBuilder;
import oldman.medinyang.storage.PresignService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import software.amazon.awssdk.services.s3.S3Client;

import java.net.URL;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AttachmentService {
    private final AttachmentRepository repo;
    private final PresignService presignService;
    private final S3Client s3;

    @Value("${app.storage.bucket}") String bucket;

    /** 업로드 시작: presign 발급 + DB에 PRESIGNED 생성*/
    @Transactional
    public PutInitRes issuePut(Long userId, String originalName, String contentType){
        String key = KeyBuilder.buildKey(originalName);
        URL uploadUrl = presignService.presignPut(key, contentType);

        Attachment at = Attachment.create()
                .userId(userId)
                .key(key)
                .contentType(contentType)
                .originalName(originalName)
                .build();
        repo.save(at);

        return new PutInitRes(at.getId(), at.getKey(), uploadUrl.toString(), Map.of("Content-Type", contentType));
    }

    /** 업로드 확정: S3 HeadObject 확인 -> 상태 UPLOADED*/
    @Transactional
    public void complete (Long userId, Long attachmentId){
        Attachment at = repo.findByIdAndUserId(attachmentId, userId)
                .orElseThrow(() -> new IllegalArgumentException("attachment not found"));

        if(at.getStatus() != Attachment.Status.PRESIGNED){
            return; // 이미 확정/만료면 무시
        }

        var head = s3.headObject(b -> b.bucket(bucket).key(at.getKey())); // 없을 시 예외 터짐
        at.markUploaded(head.eTag());
    }

    /** 조회: 소유사/상태 확인 -> presigned GET 발급*/
    @Transactional(readOnly = true)
    public GetLinkRes issueGet(Long userId, Long attachmentId, boolean inline, String contentType){
        Attachment at = repo.findByIdAndUserId(attachmentId, userId)
                .orElseThrow(()-> new IllegalArgumentException("attachment not found"));
        if(at.getStatus() != Attachment.Status.UPLOADED){
            throw new IllegalStateException("not uploaded yet");
        }
        String disposition = inline ? "inline" : null;
        URL downloadedUrl = presignService.presignGet(at.getKey(),contentType, disposition);

        return new GetLinkRes(at.getId(), at.getKey(), downloadedUrl.toString());
    }
}
