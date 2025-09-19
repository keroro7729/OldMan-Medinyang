package oldman.medinyang.dto.chat;

import java.time.LocalDateTime;
import lombok.Data;
import oldman.medinyang.domain.Chat;

@Data
public class ChatDto {

    private final String content;
    private final String response;
    private final LocalDateTime createdAt;

    public ChatDto(Chat chat) {
        this.content = chat.getContent();
        this.response = chat.getResponse();
        this.createdAt = chat.getCreatedAt();
    }
}
