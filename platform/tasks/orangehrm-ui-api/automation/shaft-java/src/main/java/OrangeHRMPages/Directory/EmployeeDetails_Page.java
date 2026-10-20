package OrangeHRMPages.Directory;

import com.shaft.driver.SHAFT;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

/** Page object for the employee details panel that opens on the right of the Directory page. */
public class EmployeeDetails_Page {

    private static final Duration TIMEOUT = Duration.ofSeconds(30);

    private final SHAFT.GUI.WebDriver driver;
    private final WebDriverWait wait;

    private final By Pnl_EmployeeDetails = By.xpath("//div[contains(@class,'orangehrm-corporate-directory-sidebar')]");
    private final By Btn_Close = By.xpath("//div[contains(@class,'orangehrm-corporate-directory-sidebar')]//i[contains(@class,'bi-arrow-right')]");

    public EmployeeDetails_Page(SHAFT.GUI.WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver.getDriver(), TIMEOUT);
    }

    public EmployeeDetails_Page waitUntilOpened() {
        wait.until(ExpectedConditions.visibilityOfElementLocated(Pnl_EmployeeDetails));
        return this;
    }

    public EmployeeDetails_Page clickCloseIcon() {
        driver.element().click(Btn_Close);
        wait.until(ExpectedConditions.invisibilityOfElementLocated(Pnl_EmployeeDetails));
        return this;
    }
}
