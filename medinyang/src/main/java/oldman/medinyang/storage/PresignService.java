package oldman.medinyang.storage;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.net.URL;
import java.time.Duration;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PresignService {
    private final S3Presigner s3Presigner;

    @Value("${app.storage.bucket}")
    private String bucket;

    @Value("${app.upload.presignExpirySec:300}")
    private int expirySec; // 기본 300초(5분)

    public URL presignPut(String key, String contentType){
        var put = PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .contentType(contentType)
                .build();

        var pre = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofSeconds(expirySec))
                .putObjectRequest(put)
                .build();

        return s3Presigner.presignPutObject(pre).url();
    }

    public URL presignGet(
            String key,
            Integer expirySec,
            String responseContentType,
            String responseContentDispostion
    ){
        int ttl = (expirySec != null ? expirySec : this.expirySec);

        var get = GetObjectRequest.builder()
                .bucket(bucket)
                .key(key);

        if(responseContentType != null && !responseContentType.isBlank()) {
            get.responseContentType(responseContentType);
        }
        if(responseContentDispostion != null & !responseContentDispostion.isBlank()){
            get.responseContentDisposition(responseContentDispostion);
        }

        var pre = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofSeconds(ttl))
                .getObjectRequest(get.build())
                .build();

        return s3Presigner.presignGetObject(pre).url();
    }
}
