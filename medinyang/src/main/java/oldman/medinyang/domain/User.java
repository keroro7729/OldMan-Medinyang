package oldman.medinyang.domain;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "users", indexes = @Index(name = "uk_users_email", columnList = "email", unique = true))
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    protected User() {}
    public User(String email) { this.email = email; }

    public Long getUserId() { return id; }
    public String getEmail() { return email; }

}
