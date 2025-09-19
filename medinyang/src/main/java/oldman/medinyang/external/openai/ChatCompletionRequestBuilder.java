package oldman.medinyang.external.openai;


import static oldman.medinyang.external.openai.PromptManager.MEDINYANG_CHAT_BASE_PROMPT;

import java.util.ArrayList;
import java.util.List;
import oldman.medinyang.domain.Chat;
import oldman.medinyang.external.openai.dto.ChatCompletionRequest;

public class ChatCompletionRequestBuilder {

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
