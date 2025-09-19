package oldman.medinyang.external.openai.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class VisionRequest {
    private String model;
    private List<InputItem> input;

    @Data
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class InputItem {
        private String role; // "user"
        private List<Content> content;
    }

    @Data
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Content {
        private String type; // enum: INPUT_TEXT, INPUT_IMAGE
        private String text;       // if type == INPUT_TEXT
        private String image_url;   // if type == INPUT_IMAGE
        private String detail; // enum: LOW, HIGH, AUTO (optional)
    }
}

