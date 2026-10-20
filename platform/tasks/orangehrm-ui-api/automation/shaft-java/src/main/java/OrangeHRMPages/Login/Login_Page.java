package OrangeHRMPages.Login;

import com.shaft.driver.SHAFT;
import org.openqa.selenium.By;

/**
 * Page object for the OrangeHRM login page. Opening a protected page without a session
 * redirects here. Credentials are typed with typeSecure, so SHAFT masks them in the report.
 */
public class Login_Page {

    private final SHAFT.GUI.WebDriver driver;

    // Text Fields
    private final By Txt_Username = By.name("username");
    private final By Txt_Password = By.name("password");

    // Buttons
    private final By Btn_Login = By.xpath("//form//button[@type='submit']");

    public Login_Page(SHAFT.GUI.WebDriver driver) {
        this.driver = driver;
    }

    /** Opens a protected URL and checks that the application redirects to the login page. */
    public Login_Page navigateToLoginPage(String protectedUrl) {
        driver.browser().navigateToURL(protectedUrl, "/auth/login");
        return this;
    }

    public Login_Page enterUsername(String username) {
        driver.element().typeSecure(Txt_Username, username);
        return this;
    }

    public Login_Page enterPassword(String password) {
        driver.element().typeSecure(Txt_Password, password);
        return this;
    }

    public Login_Page clickLoginButton() {
        driver.element().click(Btn_Login);
        return this;
    }
}
