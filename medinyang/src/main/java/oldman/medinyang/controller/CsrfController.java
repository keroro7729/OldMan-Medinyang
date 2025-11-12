package oldman.medinyang.controller;

import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
class CsrfController {
    @GetMapping("/api/csrf-token")
    public Map<String, String> token(CsrfToken t) {
        return Map.of("token", t.getToken());
    }
}
