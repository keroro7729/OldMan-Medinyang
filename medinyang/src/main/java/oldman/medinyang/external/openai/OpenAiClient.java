package oldman.medinyang.external.openai;

import java.util.List;
import oldman.medinyang.domain.Chat;
import oldman.medinyang.external.openai.dto.ChatCompletionRequest;
import oldman.medinyang.external.openai.dto.VisionRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class OpenAiClient {

    private static final String CHAT_COMPLETION_URL = "/v1/chat/completions";
    private static final String RESPONSES_URL = "/v1/responses";
    private final RestClient chatClient;
    private final RestClient responsesClient;
    private final OpenAiResponseParser parser;

    public OpenAiClient(
        @Value("${openai.clients.apikey}") String apiKey,
        @Value("${openai.clients.baseurl}") String baseUrl,
        OpenAiResponseParser parser
    ) {
        this.chatClient = RestClient.builder()
            .baseUrl(baseUrl)
            .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .build();
        this.responsesClient = RestClient.builder()
            .baseUrl(baseUrl)
            .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .build();
        this.parser = parser;
    }

    public String getMedinyangResponse(String userEntry, List<Chat> context) {
        ChatCompletionRequest request = OpenAiRequestBuilder.buildMedinyangChatRequest(userEntry, context);

        String rawResponse = chatClient.post()
            .uri(CHAT_COMPLETION_URL)
            .body(request)
            .retrieve()
            .body(String.class);

        return parser.parseChatResponse(rawResponse);
    }

    public String getMedinyangOcrResponse(String imageUrl) {
        VisionRequest request = OpenAiRequestBuilder.buildMedinyangOcrRequest(imageUrl);

        String rawResponse = responsesClient.post()
            .uri(RESPONSES_URL)
            .body(request)
            .retrieve()
            .body(String.class);

        return parser.parseOcrResponse(rawResponse);
    }
}
