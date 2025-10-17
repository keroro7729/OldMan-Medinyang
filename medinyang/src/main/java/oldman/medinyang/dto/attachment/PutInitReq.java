package oldman.medinyang.dto.attachment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

import java.util.Map;

public record PutInitReq(@NotBlank String originalName,
                         @NotBlank String contentType) {}