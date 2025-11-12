package oldman.medinyang.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CustomOidcUserService extends OidcUserService {
    private final UserService userService;

    @Override
    public OidcUser loadUser(OidcUserRequest req) throws OAuth2AuthenticationException{
        OidcUser user = super.loadUser(req);
        String email = user.getEmail();

        if (email == null) throw new OAuth2AuthenticationException("email missing");

        Long userId = userService.upsertByEmail(email).getUserId();

        Map<String, Object> claims = new HashMap<>(user.getClaims());
        claims.put("userId", userId);

        return new DefaultOidcUser(user.getAuthorities(), user.getIdToken(), new OidcUserInfo(claims));
    }
}
