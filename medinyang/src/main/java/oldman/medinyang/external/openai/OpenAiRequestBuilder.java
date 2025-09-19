package oldman.medinyang.external.openai;


import static oldman.medinyang.external.openai.PromptManager.MEDINYANG_CHAT_BASE_PROMPT;

import java.util.ArrayList;
import java.util.List;
import lombok.Data;
import oldman.medinyang.domain.Chat;
import oldman.medinyang.external.openai.dto.ChatCompletionRequest;
import oldman.medinyang.external.openai.dto.VisionRequest;
import oldman.medinyang.external.openai.dto.VisionRequest.Content;
import oldman.medinyang.external.openai.dto.VisionRequest.InputItem;

public class OpenAiRequestBuilder {

    private static final String MODEL = "gpt-4o-mini";
    private static final double TEMPERATURE = 0.7;
    private static final int MAX_TOKEN = 500;

    public static ChatCompletionRequest buildMedinyangChatRequest(String userEntry, List<Chat> context) {
        ChatCompletionRequest request = new ChatCompletionRequest();
        request.setModel(MODEL);

        List<ChatCompletionRequest.Message> message = new ArrayList<>(MEDINYANG_CHAT_BASE_PROMPT);
        context.forEach(c -> {
            message.add(userMessage(c.getContent()));
            message.add(assistantMessage(c.getResponse()));
        });
        message.add(userMessage(userEntry));
        request.setMessages(message);

        request.setTemperature(TEMPERATURE);
        request.setMax_tokens(MAX_TOKEN);

        return request;
    }

    public static VisionRequest buildMedinyangOcrRequest(String imageUrl) {
        VisionRequest request = new VisionRequest();
        request.setModel(MODEL);
        request.setInput(buildInputItem(imageUrl));
        System.out.println(request);
        return request;
    }

    private static List<VisionRequest.InputItem> buildInputItem(String imageUrl) {
        VisionRequest.Content content = new Content();
        content.setType("input_image");
        content.setImage_url(imageUrl);
        //content.setDetail("auto");

        InputItem inputItem = new InputItem();
        inputItem.setRole("user");
        inputItem.setContent(List.of(content));
        return List.of(inputItem);
    }

    private static ChatCompletionRequest.Message userMessage(String content) {
        return ChatCompletionRequest.Message.builder()
            .role("user")
            .content(content)
            .build();
    }

    private static ChatCompletionRequest.Message assistantMessage(String content) {
        return ChatCompletionRequest.Message.builder()
            .role("assistant")
            .content(content)
            .build();
    }
}
