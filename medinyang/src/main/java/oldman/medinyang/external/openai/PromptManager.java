package oldman.medinyang.external.openai;

import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import oldman.medinyang.external.openai.dto.ChatCompletionRequest.Message;
import org.springframework.core.io.ClassPathResource;

public class PromptManager {

    private static final String MEDINYANG_CHAT_PROMPT = "medinyang_chat.prompt";
    private static final String MEDINYANG_CHAT_EXAMPLE_PROMPT = "medinyang_chat_example.prompt";

    public static final List<Message> MEDINYANG_CHAT_BASE_PROMPT = buildBasePrompt(
        MEDINYANG_CHAT_PROMPT, MEDINYANG_CHAT_EXAMPLE_PROMPT);

    private static final String MEDINYANG_OCR_PROMPT = "medinyang_ocr.prompt";
    private static final String MEDINYANG_OCR_EXAMPLE_PROMPT = "medinyang_ocr_example.prompt";

    public static final List<Message> MEDINYANG_OCR_BASE_PROMPT = buildBasePrompt(
        MEDINYANG_OCR_PROMPT, MEDINYANG_OCR_EXAMPLE_PROMPT);

    private static List<Message> buildBasePrompt(String systemPromptFileName,
        String examplePromptFileName) {
        List<Message> message = new ArrayList<>();
        try {
            ClassPathResource systemPath = new ClassPathResource("prompts/" + systemPromptFileName);
            String system = Files.readString(systemPath.getFile().toPath());
            message.add(systemMessage(system));

            ClassPathResource examplePath = new ClassPathResource(
                "prompts/" + examplePromptFileName);
            List<String> examples = Files.readString(examplePath.getFile().toPath()).lines()
                .toList();
            boolean isUser = true;
            for (String example : examples) {
                if (example.isBlank()) {
                    continue;
                } else if (isUser) {
                    message.add(userMessage(example));
                } else {
                    message.add(assistantMessage(example));
                }
                isUser = !isUser;
            }

            return message;
        } catch (IOException e) {
            throw new RuntimeException("프롬프트 파일 로딩에 실패했습니다.", e);
        }
    }

    private static Message systemMessage(String content) {
        return Message.builder()
            .role("system")
            .content(content)
            .build();
    }

    private static Message userMessage(String content) {
        return Message.builder()
            .role("user")
            .content(content)
            .build();
    }

    private static Message assistantMessage(String content) {
        return Message.builder()
            .role("assistant")
            .content(content)
            .build();
    }
}
