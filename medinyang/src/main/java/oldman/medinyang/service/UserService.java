package oldman.medinyang.service;

import lombok.RequiredArgsConstructor;
import oldman.medinyang.domain.User;
import oldman.medinyang.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public boolean isNewEmail(String email){
        return userRepository.findByEmail(email).isEmpty();
    }

    @Transactional
    public User upsertByEmail (String email){
        return userRepository.findByEmail(email)
                .orElseGet(()-> userRepository.save(new User(email)));
    }

    public User getByEmail(String email){
        return userRepository.findByEmail(email)
                .orElseThrow(()-> new IllegalStateException("User not found: " + email));
    }
}
