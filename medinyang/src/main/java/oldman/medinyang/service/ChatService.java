package oldman.medinyang.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import oldman.medinyang.domain.Chat;
import oldman.medinyang.dto.chat.ChatDto;
import oldman.medinyang.repository.ChatRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;

    public Page<ChatDto> viewList(Pageable pageable) {
        return chatRepository.findAll(pageable)
            .map(ChatDto::new);
    }

    public ChatDto sendMessage(String userEntry) {
        String reply = "메디냥 응답"; //

        Chat created = chatRepository.save(new Chat(userEntry, reply));
        return new ChatDto(created);
    }
}
