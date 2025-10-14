package oldman.medinyang.storage;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import oldman.medinyang.storage.dto.GetReq;
import oldman.medinyang.storage.dto.GetRes;
import oldman.medinyang.storage.dto.PutReq;
import oldman.medinyang.storage.dto.PutRes;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/storage")
public class S3Controller {

    private final PresignService presignService;

    @PostMapping("/presign/put")
    public PutRes presignPut(@RequestBody @Valid PutReq req) {
        String key = KeyBuilder.buildKey(req.originalName());
        var url = presignService.presignPut(key, req.contentType());
        return new PutRes(url.toString(), key);
    }

    @PostMapping("/presign/get")
    public GetRes presignGet(@RequestBody @Valid GetReq req) {
        String disposition = Boolean.TRUE.equals(req.inline()) ? "inline" : null;

        var url = presignService.presignGet(
                req.key(),
                req.expiresSec(),
                req.contentType(),
                disposition
        );

        return new GetRes(url.toString(),req.key());
    }
}
