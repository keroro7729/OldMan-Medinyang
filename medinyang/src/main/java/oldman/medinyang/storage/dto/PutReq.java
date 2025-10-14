package oldman.medinyang.storage.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record PutReq(
        @NotBlank String contentType,
        @NotBlank String originalName,
        @Positive long size
) {}
