package oldman.medinyang.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import oldman.medinyang.annotation.CurrentUser;
import oldman.medinyang.dto.attachment.*;
import oldman.medinyang.dto.user.UserDto;
import oldman.medinyang.service.AttachmentService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/attachments")
@RequiredArgsConstructor
public class AttachmentController {
    private final AttachmentService service;

    @PostMapping("/presign/put")
    public PutInitRes presignPut(@CurrentUser UserDto user, @RequestBody @Valid PutInitReq req){
        return service.issuePut(user.getUserId(), req.originalName(), req.contentType());
    }

    @PostMapping("complete")
    public void complete(@CurrentUser UserDto user, @RequestBody @Valid CompleteReq req){
        service.complete(user.getUserId(), req.attachmentId());
    }

    @PostMapping("presign/get")
    public GetLinkRes presignGet(@CurrentUser UserDto user, @RequestBody @Valid GetLinkReq req){
        return service.issueGet(user.getUserId(), req.attachmentId(), req.inline(), req.contentType());
    }
}
