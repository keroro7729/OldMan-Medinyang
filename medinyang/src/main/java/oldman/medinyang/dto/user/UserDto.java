package oldman.medinyang.dto.user;

import lombok.Getter;

@Getter
public class UserDto {
    private final Long userId;
    private final String email;
    public UserDto(Long userId, String email) {
        this.userId = userId;
        this.email = email;
    }
}