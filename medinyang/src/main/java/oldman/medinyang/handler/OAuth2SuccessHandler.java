package oldman.medinyang.handler;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {


    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User principal = (OAuth2User) authentication.getPrincipal();

        String email = (String) principal.getAttribute("email");
        Long userId = ((Number) principal.getAttribute("userId")).longValue();


        HttpSession session = request.getSession(true);
        session.setAttribute("userId", userId);
        session.setAttribute("userEmail", email);

        response.sendRedirect("/"); // 추후 필요한 경로로 변경

    }

}
