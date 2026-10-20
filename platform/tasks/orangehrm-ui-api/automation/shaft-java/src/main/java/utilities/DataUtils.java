package utilities;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

/**
 * Environment settings, read the same way as the My Bookings framework (DataUtils.get), with one
 * difference: an environment variable of the same name wins over Environment.properties.
 * Credentials (QA_USERNAME, QA_PASSWORD) exist ONLY as environment variables - they are never
 * written to Environment.properties, logs or reports.
 */
public class DataUtils {

    private static final Properties properties = new Properties();

    static {
        try (FileInputStream fileInputStream = new FileInputStream("src/test/resources/Environment.properties")) {
            properties.load(fileInputStream);
        } catch (IOException e) {
            throw new IllegalStateException("[CONFIGURATION] Cannot read src/test/resources/Environment.properties", e);
        }
    }

    /** Environment variable first, then Environment.properties; null when neither defines the key. */
    public static String get(String key) {
        String value = System.getenv(key);
        if (value != null && !value.isBlank()) {
            return value.trim();
        }
        String property = properties.getProperty(key);
        return property == null ? null : property.trim();
    }

    /** Like get(), but fails fast naming the missing key - never its value. */
    public static String getRequired(String key) {
        String value = get(key);
        if (value == null || value.isEmpty()) {
            throw new IllegalStateException("[CONFIGURATION] Missing required environment variable: " + key
                    + ". Set it in the shell or the IDE run configuration; it is never stored in the project.");
        }
        return value;
    }
}
