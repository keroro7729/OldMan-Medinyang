package oldman.medinyang.external.local.python;

import oldman.medinyang.external.local.python.dto.PythonAnswerReq;
import oldman.medinyang.external.local.python.dto.PythonAnswerRes;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.http.client.ClientHttpRequestFactoryBuilder;
import org.springframework.boot.http.client.ClientHttpRequestFactorySettings;
import org.springframework.http.MediaType;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.time.Duration;

@Component
public class PythonClient {
    private final RestClient http;

    public PythonClient(RestClient.Builder builder, @Value("${python.base-url}") String baseUrl){
        //클래스패스 기준 가장 적합한 빌더 탐지 (HttpComponents → Jetty → Reactor → JDK → Simple)
        ClientHttpRequestFactoryBuilder<?> factoryBuilder = ClientHttpRequestFactoryBuilder.detect();

        //타임아웃 등 설정 객체 생성
        ClientHttpRequestFactorySettings settings =
                ClientHttpRequestFactorySettings.defaults()
                        .withConnectTimeout(Duration.ofSeconds(3))
                        .withReadTimeout(Duration.ofSeconds(15));

        //설정을 적용해 팩토리 생성
        ClientHttpRequestFactory requestFactory = factoryBuilder.build(settings);

        //RestClient에 주입
        this.http = builder
                .baseUrl(baseUrl)
                .requestFactory(requestFactory)
                .defaultHeader("X-Service", "medinyang-backend")
                .build();
    }

    public PythonAnswerRes ask(PythonAnswerReq req){
        return http.post()
                .uri("/ask")
                .contentType(MediaType.APPLICATION_JSON)
                .body(req)
                .retrieve()
                .body(PythonAnswerRes.class);
        // TODO : 예외처리
    }
}
