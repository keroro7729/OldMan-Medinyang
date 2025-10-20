package oldman.medinyang.controller;

import oldman.medinyang.annotation.CurrentUser;
import oldman.medinyang.dto.user.UserDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {
    @GetMapping("/me")
    public UserDto me(@CurrentUser UserDto user){
        return user;
    }
}
