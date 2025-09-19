package oldman.medinyang.external.openai.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class VisionResponse {
    private List<Output> output;

    @Data
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Output {
        private List<Content> content;
    }

    @Data
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Content {
        private String type;   // "output_text" 등
        private String text;   // 실제 텍스트
    }
}

