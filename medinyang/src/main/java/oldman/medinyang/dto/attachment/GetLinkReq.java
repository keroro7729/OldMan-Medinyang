package oldman.medinyang.dto.attachment;

import jakarta.validation.constraints.NotNull;

public record GetLinkReq(
        @NotNull Long attachmentId,
        Boolean inline,
        String contentType
) {}