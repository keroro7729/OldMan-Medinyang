package oldman.medinyang.external.openai;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import oldman.medinyang.external.openai.dto.ChatCompletionResponse;
import oldman.medinyang.external.openai.dto.VisionResponse;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OpenAiResponseParser {

    private final ObjectMapper mapper;

    public String parseChatResponse(String rawResponse) {
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

    public String parseOcrResponse(String rawResponse) {
        try {
            VisionResponse response = mapper.readValue(rawResponse, VisionResponse.class);

            // output 배열 체크
            if (response.getOutput() == null || response.getOutput().isEmpty()) {
                throw new RuntimeException("OpenAI 응답의 output이 비어있습니다.");
            }

            VisionResponse.Output firstOutput = response.getOutput().get(0);

            // content 배열 체크
            if (firstOutput.getContent() == null || firstOutput.getContent().isEmpty()) {
                throw new RuntimeException("OpenAI 응답의 content가 비어있습니다.");
            }

            VisionResponse.Content firstContent = firstOutput.getContent().get(0);

            String text = firstContent.getText();
            if (text == null || text.isBlank()) {
                throw new RuntimeException("OpenAI 응답의 텍스트가 비어있습니다.");
            }

            return text;

        } catch (JsonProcessingException e) {
            throw new RuntimeException("OpenAI 응답을 파싱하지 못했습니다.", e);
        } catch (Exception e) {
            throw new RuntimeException("OpenAI 요청 처리 중 오류 발생", e);
        }
    }
}
