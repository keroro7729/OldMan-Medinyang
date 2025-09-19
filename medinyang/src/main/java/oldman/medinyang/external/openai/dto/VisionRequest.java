package oldman.medinyang.external.openai.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.ArrayList;
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
        private List<Content> content = new ArrayList<>();

        public InputItem() {}
        public InputItem(ChatCompletionRequest.Message message) {
            this.role = message.getRole();
            Content content = new Content();
            content.setType("input_text");
            content.setText(message.getContent());
            this.content.add(content);
        }

        public void addContent(Content content) {
            this.content.add(content);
        }
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

