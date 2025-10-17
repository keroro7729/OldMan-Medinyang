package oldman.medinyang.dto.attachment;

import java.util.Map;

public record PutInitRes(
        Long attachmentId, String key, String uploadUrl, Map<String,String> requiredHeaders
) {}

