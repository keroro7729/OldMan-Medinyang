package oldman.medinyang.external.local.python;

import org.springframework.http.HttpStatusCode;

public class PythonApiException extends RuntimeException{
    private final HttpStatusCode upstreamStatus; // FastAPI가 HTTP 4xx/5xx를 돌려준 경우에 채워짐
    private final String upstreamBody; // 업스트림의 에러 본문 원무
    private final boolean timeoutOrConnect; // 전송 계층(타임아웃/연결) 오류인지

    // 업스트림이 HTTP 오류를 준 경우 (4xx, 5xx)
    public PythonApiException(HttpStatusCode upstreamStatus, String upstreamBody){
        super("Upstream error: " + upstreamStatus.value());
        this.upstreamStatus = upstreamStatus;
        this.upstreamBody = upstreamBody;
        this.timeoutOrConnect = false;
    }

    // 전송 계층 오류(타임아웃/연결/기타 RestClient 내부 에러) 래핑용
    public PythonApiException(String message, Throwable cause, boolean timeoutOrConnect){
        super(message, cause);
        this.upstreamStatus = null;
        this.upstreamBody = null;
        this.timeoutOrConnect = timeoutOrConnect;
    }

    public HttpStatusCode upstreamStatus(){return upstreamStatus; }
    public String upstreamBody() {return upstreamBody;}
    public boolean isTimeoutOrConnect(){ return timeoutOrConnect;}
}
