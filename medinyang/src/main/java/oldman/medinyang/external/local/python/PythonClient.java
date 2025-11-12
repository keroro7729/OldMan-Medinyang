package oldman.medinyang.external.local.python;

import oldman.medinyang.external.local.python.dto.PythonAnswerReq;
import oldman.medinyang.external.local.python.dto.PythonAnswerRes;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.http.client.ClientHttpRequestFactoryBuilder;
import org.springframework.boot.http.client.ClientHttpRequestFactorySettings;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

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
        try{
            return http.post()
                    .uri("/ask")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(req)
                    .retrieve()
                    .onStatus(HttpStatusCode::is4xxClientError, (request, response) -> {
                        throw new PythonApiException(response.getStatusCode(), response.getBody().toString());
                    })
                    .onStatus(HttpStatusCode::is5xxServerError, (request, response) -> {
                        throw new PythonApiException(response.getStatusCode(), response.getBody().toString());
                    })
                    .body(PythonAnswerRes.class);
        } catch(ResourceAccessException e){
            // connect/read timeout, connection refused 등
            throw new PythonApiException("Upstream timeout/connect error", e, true);
        } catch (RestClientException e){
            // 기타 RestClient 계열
            throw new PythonApiException("Upstream client error", e, false);
        }

    }
}
