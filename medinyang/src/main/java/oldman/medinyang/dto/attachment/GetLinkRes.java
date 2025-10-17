package oldman.medinyang.dto.attachment;

public record GetLinkRes (
        Long attachmentId,
        String key,
        String downloadUrl) {}