package oldman.medinyang.storage;

import java.time.LocalDate;
import java.util.UUID;

public class KeyBuilder {
    public static String buildKey(String originalName) {
        String ext = originalName.contains(".")
                ? originalName.substring(originalName.lastIndexOf('.')+1).toLowerCase()
                : "bin";
        String base = originalName.replaceAll("\\."+ext+"$","");
        String safe = base.toLowerCase()
                .replaceAll("[^a-z0-9가-힣-_]+","-")
                .replaceAll("-{2,}","-")
                .replaceAll("^-|-$","");
        var d = LocalDate.now();
        return String.format("uploads/%04d/%02d/%02d/%s-%s.%s",
                d.getYear(), d.getMonthValue(), d.getDayOfMonth(),
                UUID.randomUUID(), safe, ext);
    }
}
