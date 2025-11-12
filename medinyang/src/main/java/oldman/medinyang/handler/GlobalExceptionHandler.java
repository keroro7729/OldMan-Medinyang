package oldman.medinyang.handler;

import jakarta.servlet.http.HttpServletRequest;
import oldman.medinyang.external.local.python.PythonApiException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.net.URI;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler  extends ResponseEntityExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // 외부(Python) 연동 실패 → 502/504
    @ExceptionHandler(PythonApiException.class)
    public ResponseEntity<ProblemDetail> handlePython(PythonApiException ex, HttpServletRequest req){
        HttpStatus status = ex.isTimeoutOrConnect() ? HttpStatus.GATEWAY_TIMEOUT : HttpStatus.BAD_GATEWAY;

        ProblemDetail pd = createProblemDetail(status, "Python API error", "Upstream dependency failed", req);
        if(ex.upstreamStatus() != null){
            pd.setProperty("upstreamStatus", ex.upstreamStatus().value());
        }

        // upstreamBody는 응답에 싣지 않고 로그로만
        log.warn("UPSTREAM {} uri={} upstreamStatus={} msg={}",
                status.value(),
                req.getRequestURI(),
                ex.upstreamStatus() == null ? null : ex.upstreamStatus().value(),
                ex.getMessage()
        );

        return ResponseEntity.status(status).body(pd);

    }

    private ProblemDetail createProblemDetail(HttpStatus status, String title, String detail,
                                              HttpServletRequest req) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(status, detail);
        pd.setTitle(title);
        pd.setInstance(URI.create(req.getRequestURI()));
        return pd;
    }
}
