package oldman.medinyang.external.openai;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import oldman.medinyang.external.openai.dto.ChatCompletionResponse;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ChatCompletionResponseParser {

    private final ObjectMapper mapper;

    public String getMessage(String rawResponse) {
        try {
            ChatCompletionResponse response = mapper.readValue(rawResponse,
                ChatCompletionResponse.class);

            if (response == null
                || response.getChoices() == null
                || response.getChoices().isEmpty()) {
                throw new RuntimeException("OpenAI 응답이 비어있습니다.");
            }
            return response.getChoices().get(0).getMessage().getContent();
        } catch (JsonProcessingException e) {
            throw new RuntimeException("OpenAI 응답을 파싱하지 못했습니다.", e);
        } catch (Exception e) {
            throw new RuntimeException("OpenAI 요청 처리 중 오류 발생", e);
        }
    }
}
