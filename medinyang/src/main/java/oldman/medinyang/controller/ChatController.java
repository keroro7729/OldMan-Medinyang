package oldman.medinyang.controller;

import lombok.RequiredArgsConstructor;
import oldman.medinyang.dto.chat.ChatDto;
import oldman.medinyang.dto.chat.GetAiResponseRequest;
import oldman.medinyang.dto.chat.ParseImageRequest;
import oldman.medinyang.service.ChatService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping
    public ResponseEntity<Page<ChatDto>> viewList(@PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(chatService.viewList(pageable));
    }

    @PostMapping
    public ResponseEntity<ChatDto> getAiResponse(@RequestBody GetAiResponseRequest request) {
        return ResponseEntity.ok(chatService.sendMessage(request.getContent()));
    }

    @PostMapping("/ocr")
    public ResponseEntity<ChatDto> parseImage(@RequestBody ParseImageRequest request) {
        return ResponseEntity.ok(chatService.sendImage(request.getImageUrl()));
    }
}
