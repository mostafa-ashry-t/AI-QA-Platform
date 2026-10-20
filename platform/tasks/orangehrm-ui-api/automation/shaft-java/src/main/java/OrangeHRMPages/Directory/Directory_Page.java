package OrangeHRMPages.Directory;

import com.shaft.driver.SHAFT;
import org.openqa.selenium.By;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Page object for the OrangeHRM Directory page (/web/index.php/directory/viewDirectory).
 *
 * After Search or Reset the old cards stay on screen until the new results arrive, so
 * clickSearch() and clickReset() wait until the results header changes and shows a record count.
 */
public class Directory_Page {

    private static final Duration TIMEOUT = Duration.ofSeconds(30);
    private static final String DIRECTORY_PATH = "/web/index.php/directory/viewDirectory";
    private static final Pattern RECORD_COUNT = Pattern.compile("\\((\\d+)\\) Records? Found");

    private final SHAFT.GUI.WebDriver driver;
    private final WebDriverWait wait;

    // Search form
    private final By Txt_EmployeeName = By.xpath("//label[normalize-space()='Employee Name']/ancestor::div[.//input][1]//input");
    private final By Ddl_JobTitle = By.xpath("//label[normalize-space()='Job Title']/ancestor::div[.//div[contains(@class,'oxd-select-text-input')]][1]//div[contains(@class,'oxd-select-text-input')]");
    private final By Ddl_Location = By.xpath("//label[normalize-space()='Location']/ancestor::div[.//div[contains(@class,'oxd-select-text-input')]][1]//div[contains(@class,'oxd-select-text-input')]");
    private final By Btn_Search = By.xpath("//form//button[@type='submit']");
    private final By Btn_Reset = By.xpath("//form//button[@type='reset']");

    // Results
    private final By Txt_ResultsHeader = By.xpath("//span[contains(@class,'oxd-text--span')][contains(normalize-space(),'Found')]");
    private final By Tbl_Cards = By.xpath("//div[contains(@class,'orangehrm-container')]//div[contains(concat(' ',normalize-space(@class),' '),' orangehrm-directory-card ')]");
    private final By Tbl_FirstCard = By.xpath("(//div[contains(@class,'orangehrm-container')]//div[contains(concat(' ',normalize-space(@class),' '),' orangehrm-directory-card ')])[1]");

    // Inside one card: subtitle = job title; descriptions = sub-unit, then location
    private final By Txt_CardJobTitle = By.xpath(".//p[contains(@class,'orangehrm-directory-card-subtitle')]");
    private final By Txt_CardDescriptions = By.xpath(".//p[contains(@class,'orangehrm-directory-card-description')]");

    public Directory_Page(SHAFT.GUI.WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver.getDriver(), TIMEOUT);
        this.wait.ignoring(StaleElementReferenceException.class);
    }

    public static String urlFor(String baseUrl) {
        return baseUrl + DIRECTORY_PATH;
    }

    // ==================== Waits ====================

    public Directory_Page waitUntilLoaded() {
        wait.until(ExpectedConditions.urlContains(DIRECTORY_PATH));
        wait.until(ExpectedConditions.visibilityOfElementLocated(Btn_Search));
        return this;
    }

    public Directory_Page waitUntilResultsDisplayed() {
        wait.until(ExpectedConditions.visibilityOfElementLocated(Tbl_Cards));
        wait.until(ExpectedConditions.textMatches(Txt_ResultsHeader, RECORD_COUNT));
        return this;
    }

    // ==================== Actions ====================

    public Directory_Page selectJobTitle(String jobTitle) {
        selectOption(Ddl_JobTitle, jobTitle);
        return this;
    }

    public Directory_Page selectLocation(String location) {
        selectOption(Ddl_Location, location);
        return this;
    }

    public Directory_Page clickSearch() {
        clickAndWaitForNewResults(Btn_Search);
        return this;
    }

    public Directory_Page clickReset() {
        clickAndWaitForNewResults(Btn_Reset);
        return this;
    }

    /** Opens the employee details panel (EmployeeDetails_Page) on the same page. */
    public Directory_Page clickFirstEmployeeCard() {
        driver.element().click(Tbl_FirstCard);
        return this;
    }

    // ==================== Getters ====================

    public String getResultsHeader() {
        return driver.element().get().text(Txt_ResultsHeader).trim();
    }

    /** n from "(n) Records Found" or "(1) Record Found"; -1 when the header shows no count. */
    public int getRecordCount() {
        Matcher matcher = RECORD_COUNT.matcher(getResultsHeader());
        return matcher.find() ? Integer.parseInt(matcher.group(1)) : -1;
    }

    public String getEmployeeName() {
        return driver.element().get().domProperty(Txt_EmployeeName, "value");
    }

    public String getSelectedJobTitle() {
        return driver.element().get().text(Ddl_JobTitle).trim();
    }

    public String getSelectedLocation() {
        return driver.element().get().text(Ddl_Location).trim();
    }

    /** DATA-012: the job title and location of the first displayed card that shows both; null if none does. */
    public JobTitleAndLocation getFirstCardWithJobTitleAndLocation() {
        for (WebElement card : driver.getDriver().findElements(Tbl_Cards)) {
            String jobTitle = card.findElement(Txt_CardJobTitle).getText().trim();
            List<WebElement> descriptions = card.findElements(Txt_CardDescriptions);
            String location = descriptions.size() > 1 ? descriptions.get(1).getText().trim() : "";
            if (!jobTitle.isEmpty() && !location.isEmpty()) {
                return new JobTitleAndLocation(jobTitle, location);
            }
        }
        return null;
    }

    public record JobTitleAndLocation(String jobTitle, String location) {
    }

    // ==================== Internals ====================

    private void selectOption(By dropdown, String optionText) {
        String quote = optionText.contains("'") ? "\"" : "'";
        By option = By.xpath("//div[@role='listbox']//div[@role='option'][normalize-space()=" + quote + optionText + quote + "]");
        driver.element().click(dropdown);
        // The list opens with a short animation; clicking before it is visible does not select anything.
        wait.until(ExpectedConditions.visibilityOfElementLocated(option));
        driver.element().click(option);
        wait.until(ExpectedConditions.textToBe(dropdown, optionText));
    }

    private void clickAndWaitForNewResults(By button) {
        String headerBefore = getResultsHeader();
        driver.element().click(button);
        wait.until(d -> !d.findElement(Txt_ResultsHeader).getText().trim().equals(headerBefore));
        waitUntilResultsDisplayed();
    }
}
