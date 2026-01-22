# Quiz Automation Flow Explanation

This document explains the complete automation flow implemented using Selenium and Python for the dynamic quiz application.

1. Browser Launch  
The automation script initializes the browser using Selenium WebDriver.

2. Application Launch  
The quiz application URL is opened and page title and URL are verified.

3. Quiz Start  
The automation clicks on the start quiz button and validates that the first question is displayed.

4. Question Handling  
Each question is read dynamically, predefined answers are selected, and navigation is performed.

5. Quiz Submission  
After answering all questions, the quiz is submitted automatically.

6. Result Verification  
The result page is validated by checking correct/incorrect answers and final score.

7. Screenshot & Logging  
Screenshots are captured at every major step and logs are generated for debugging.

8. Browser Termination  
The browser is closed safely after completion.
