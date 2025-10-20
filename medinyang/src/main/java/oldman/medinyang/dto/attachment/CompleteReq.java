package oldman.medinyang.dto.attachment;

import jakarta.validation.constraints.NotNull;

public record CompleteReq(@NotNull Long attachmentId) {}