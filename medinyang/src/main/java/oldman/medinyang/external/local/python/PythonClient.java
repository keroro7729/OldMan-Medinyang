package oldman.medinyang.external.local.python;

import oldman.medinyang.external.local.python.dto.ChatReq;
import oldman.medinyang.external.local.python.dto.ChatRes;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.time.Duration;

@Component
public class PythonClient {
    private final RestClient http;

    public PythonClient(RestClient.Builder builder, @Value("${python.base-url}") String baseUrl){
        // 1) JDK 구현체로 타임아웃 중앙화
        HttpComponentsClientHttpRequestFactory rf = new HttpComponentsClientHttpRequestFactory();
        rf.setConnectTimeout((int) Duration.ofSeconds(3).toMillis());
        rf.setReadTimeout((int) Duration.ofSeconds(15).toMillis());
        ClientHttpRequestFactory requestFactory = rf;
        // TODO : 타임아웃 중앙화 다시 재정리

        this.http = builder
                .baseUrl(baseUrl)
                .requestFactory(requestFactory)
                .defaultHeader("X-Service", "medinyang-backend")
                .build();
    }

    public ChatRes ask(ChatReq req){
        return http.post()
                .uri("/ask")
                .contentType(MediaType.APPLICATION_JSON)
                .body(req)
                .retrieve()
                .body(ChatRes.class);
        // TODO : 예외처리
    }
}
