package oldman.medinyang.handler;

import lombok.RequiredArgsConstructor;
import oldman.medinyang.annotation.CurrentUser;
import oldman.medinyang.domain.User;
import oldman.medinyang.dto.user.UserDto;
import oldman.medinyang.service.UserService;
import org.springframework.core.MethodParameter;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

@Component
@RequiredArgsConstructor
public class CurrentUserArgumentResolver implements HandlerMethodArgumentResolver {
    private final UserService userService;

    @Override
    public boolean supportsParameter(MethodParameter parameter){
        return parameter.hasParameterAnnotation(CurrentUser.class)
                && parameter.getParameterType().isAssignableFrom(UserDto.class);
    }

    @Override
    public Object resolveArgument(MethodParameter parameter,
                                  ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest,
                                  WebDataBinderFactory binderFactory) throws Exception {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if(auth == null || !auth.isAuthenticated()) {
            throw new AuthenticationCredentialsNotFoundException("Unauthenticated");
        }

        Object principal = auth.getPrincipal();
        String email = null;

        if(principal instanceof OidcUser oidc){
            email = oidc.getEmail(); //OIDC 표준 클레임
        } else if(principal instanceof OAuth2User oauth2){
            email = oauth2.getAttribute("email"); // 구글 UserInfo 속성
        }

        if(email == null){
            throw new AuthenticationCredentialsNotFoundException("Email no found");
        }


        var user = userService.upsertByEmail(email);
        return new UserDto(user.getUserId(), user.getEmail());
    }

}
