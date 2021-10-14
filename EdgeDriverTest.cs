using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium;
using OpenQA.Selenium.Edge;
using OpenQA.Selenium.Interactions;
using System.Threading;

namespace EdgeDriverTest1
{
    [TestClass]
    public class EdgeDriverTest
    {
        private const string edgeDriverDirectory = @"C:\";
        private EdgeDriver browser;

        [TestInitialize]
        public void EdgeDriverInitialize()
        {
            browser = new EdgeDriver(edgeDriverDirectory);
        }

        [TestMethod]
        public void PublishOneNote()
        {
            browser.Url = "https://rikhardhonkanen.github.io/Inl-ming3/";
            var searchbar = browser.FindElement(By.ClassName("searchbar"));
            searchbar.SendKeys("Eggs");
            searchbar.Submit();

            var note = browser.FindElement(By.ClassName("note")).Text;

            Assert.AreEqual(note, "Eggs");
        }

        [TestMethod]
        public void CheckNote()
        {
            browser.Url = "https://rikhardhonkanen.github.io/Inl-ming3/";
            var searchbar = browser.FindElement(By.ClassName("searchbar"));
            searchbar.SendKeys("Eggs");
            searchbar.Submit();
            
            var checkbox = browser.FindElement(By.Id("checkbox"));
            checkbox.Click();

            var itemsLeft = browser.FindElement(By.Id("items-left")).Text;
            Assert.AreEqual(itemsLeft, "0 items left");
        }

        [TestMethod]
        public void PublishThreeNotesAndCheckOne()
        {
            browser.Url = "https://rikhardhonkanen.github.io/Inl-ming3/";
            var searchbar = browser.FindElement(By.ClassName("searchbar"));
            searchbar.SendKeys("Eggs");
            searchbar.Submit();

            searchbar.SendKeys("Bread");
            searchbar.Submit();

            searchbar.SendKeys("Ceasium 137");
            searchbar.Submit();

            var checkbox = browser.FindElement(By.Id("checkbox"));
            checkbox.Click();

            var itemsLeft = browser.FindElement(By.Id("items-left")).Text;
            Assert.AreEqual(itemsLeft, "2 items left");
        }

        [TestMethod] 
        public void EditNote()
        {
            browser.Url = "https://rikhardhonkanen.github.io/Inl-ming3/";
            var searchbar = browser.FindElement(By.ClassName("searchbar"));
            searchbar.SendKeys("Eggs");
            searchbar.Submit();

            Actions actions = new Actions(browser);
            var note = browser.FindElement(By.ClassName("note"));
            actions.DoubleClick(note).Perform();

            var editNote = browser.FindElement(By.ClassName("note"));

            editNote.SendKeys(Keys.Control + "a");
            editNote.SendKeys(Keys.Delete);
            editNote.SendKeys("Bread");
            editNote.SendKeys(Keys.Return);

            var newNote = browser.FindElement(By.ClassName("note")).Text;

            Assert.AreEqual(newNote, "Bread");
        }

        [TestMethod] 
        public void CheckURL()
        {
            browser.Url = "https://rikhardhonkanen.github.io/Inl-ming3/";

            var searchbar = browser.FindElement(By.ClassName("searchbar"));
            searchbar.SendKeys("Eggs");
            searchbar.Submit();

            var activeButton = browser.FindElement(By.Id("show-active"));
            activeButton.Click();

            var newUrl = browser.Url.ToString();

            Assert.AreEqual(newUrl, "https://rikhardhonkanen.github.io/Inl-ming3/#active");
        }

        [TestMethod]
        public void RemoveNote()
        {
            browser.Url = "https://rikhardhonkanen.github.io/Inl-ming3/";

            var searchbar = browser.FindElement(By.ClassName("searchbar"));
            searchbar.SendKeys("Eggs");
            searchbar.Submit();
            searchbar.SendKeys("Bread");
            searchbar.Submit();

            Actions actions = new Actions(browser);
            var note = browser.FindElement(By.ClassName("note"));
            actions.MoveToElement(note);

            var erase = browser.FindElement(By.Id("remove-list-item"));
            actions.MoveToElement(erase);

            actions.Click().Build().Perform();

            var itemsLeft = browser.FindElement(By.Id("items-left")).Text;
            Assert.AreEqual(itemsLeft, "1 item left");
        }

        [TestCleanup]
        public void EdgeDriverCleanup()
        {
            browser.Quit();
        }
    }
}
