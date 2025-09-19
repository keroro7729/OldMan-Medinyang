package oldman.medinyang.service;

import java.util.Collections;
import java.util.List;
import lombok.RequiredArgsConstructor;
import oldman.medinyang.domain.Chat;
import oldman.medinyang.dto.chat.ChatDto;
import oldman.medinyang.external.openai.OpenAiClient;
import oldman.medinyang.repository.ChatRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class ChatService {

    private static final int CONTEXT_SIZE = 5;
    private final ChatRepository chatRepository;
    private final OpenAiClient openAiClient;

    @Transactional(readOnly = true)
    public Page<ChatDto> viewList(Pageable pageable) {
        return chatRepository.findAll(pageable)
            .map(ChatDto::new);
    }

    public ChatDto sendMessage(String userEntry) {
        String reply = openAiClient.getMedinyangResponse(userEntry, getContext());

        Chat created = chatRepository.save(new Chat(userEntry, reply));
        return new ChatDto(created);
    }

    public ChatDto sendImage(String imageUrl) {
        String response = openAiClient.getMedinyangOcrResponse(imageUrl);

        Chat created = chatRepository.save(new Chat(imageUrl, response));
        return new ChatDto(created);
    }

    private List<Chat> getContext() {
        Pageable pageable = PageRequest.of(0, CONTEXT_SIZE, Sort.by(Sort.Direction.DESC, "createdAt"));
        List<Chat> chats = chatRepository.findAll(pageable).getContent();
        Collections.reverse(chats);
        return chats;
    }
}
