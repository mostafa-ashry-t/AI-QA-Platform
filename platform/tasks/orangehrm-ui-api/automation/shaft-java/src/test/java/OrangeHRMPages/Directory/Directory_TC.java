package OrangeHRMPages.Directory;

import Drive_Factory.CommonMethod;
import OrangeHRMPages.Login.Login_Page;
import com.shaft.driver.SHAFT;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import org.testng.asserts.SoftAssert;
import utilities.DataUtils;

/** OrangeHRM - Directory: combined Job Title + Location filter, employee details, and Reset (TC-054). */
public class Directory_TC {

    private SHAFT.GUI.WebDriver driver;
    private SHAFT.TestData.JSON testData;
    private Directory_Page directoryPage;

    /** Precondition and step 1: a fresh browser opens the Directory URL, is redirected to login, and logs in. */
    @BeforeClass
    public void beforeClass() {
        testData = new SHAFT.TestData.JSON("OrangeHRMDirectory.json");

        CommonMethod.setupDriver(DataUtils.get("QA_BROWSER"));
        driver = CommonMethod.getDriver();
        driver.browser().setWindowSize(1920, 1080);

        new Login_Page(driver)
                .navigateToLoginPage(Directory_Page.urlFor(DataUtils.get("QA_BASE_URL")))
                .enterUsername(DataUtils.getRequired("QA_USERNAME"))
                .enterPassword(DataUtils.getRequired("QA_PASSWORD"))
                .clickLoginButton();

        directoryPage = new Directory_Page(driver).waitUntilLoaded();
    }

    @AfterClass(alwaysRun = true)
    public void tearDown() {
        CommonMethod.quitDriver();
    }

    @Test(priority = 1)
    public void TC054_verifyThatResetRestoresDefaultsAfterCombinedFilterAndEmployeeDetails() {
        // DATA-012: a Job Title + Location pair read from a displayed card
        int unfilteredCount = directoryPage.waitUntilResultsDisplayed().getRecordCount();
        Directory_Page.JobTitleAndLocation data = directoryPage.getFirstCardWithJobTitleAndLocation();
        Assert.assertNotNull(data, "[TEST DATA] DATA-012: no displayed card shows both a job title and a location");

        // Step 2: select the Job Title and the Location, then Search
        directoryPage.selectJobTitle(data.jobTitle())
                     .selectLocation(data.location())
                     .clickSearch();

        // Step 3: note the filtered record count k
        int k = directoryPage.getRecordCount();
        Assert.assertTrue(k < unfilteredCount,
                "[TEST DATA] DATA-012: the pair must return fewer records than the unfiltered list ("
                        + k + " vs " + unfilteredCount + ")");

        // Step 4: open the first employee's details, then close them
        directoryPage.clickFirstEmployeeCard();
        new EmployeeDetails_Page(driver)
                .waitUntilOpened()
                .clickCloseIcon();

        // Steps 5 and 6: Reset, then read the results
        directoryPage.clickReset();
        int n = directoryPage.getRecordCount();

        SoftAssert softAssert = new SoftAssert();
        softAssert.assertEquals(
                directoryPage.getEmployeeName(),
                "",
                "Employee Name should be empty after Reset");
        softAssert.assertEquals(
                directoryPage.getSelectedJobTitle(),
                testData.getTestData("expected.defaultOption"),
                "Job Title should display \"-- Select --\" after Reset");
        softAssert.assertEquals(
                directoryPage.getSelectedLocation(),
                testData.getTestData("expected.defaultOption"),
                "Location should display \"-- Select --\" after Reset");
        softAssert.assertTrue(
                directoryPage.getResultsHeader().matches(testData.getTestData("expected.resultsHeaderPattern")),
                "The results header should read \"(N) Records Found\". Actual: " + directoryPage.getResultsHeader());
        softAssert.assertTrue(
                n > k,
                "N after Reset should be greater than k. N = " + n + ", k = " + k);
        softAssert.assertAll();
    }
}
