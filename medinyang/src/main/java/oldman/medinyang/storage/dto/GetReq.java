package oldman.medinyang.storage.dto;

import jakarta.validation.constraints.NotBlank;

public record GetReq(
        @NotBlank String key,
        Integer expiresSec,
        String contentType,
        Boolean inline
) {}