import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import StaleElementReferenceException, TimeoutException

QUIZ_URL = "http://127.0.0.1:5500/index.html" 

try:
    print(" Automation Starting...")
    driver = webdriver.Chrome()
    driver.maximize_window()
    driver.get(QUIZ_URL)
    
    wait = WebDriverWait(driver, 15)
    
    
    print(f" Page Loaded: {driver.title}")
    
    wait.until(EC.element_to_be_clickable((By.ID, "category")))
    Select(driver.find_element(By.ID, "category")).select_by_value("technical")
    Select(driver.find_element(By.ID, "difficulty")).select_by_value("easy")
    
    driver.find_element(By.CLASS_NAME, "start-btn").click()
    print(" Quiz Started")
    
    
    last_question_text = ""

    
    for i in range(3): 
        print(f"\n--- Round {i+1} ---")
        
        
        if driver.find_element(By.ID, "landing-page").is_displayed():
            print("ERROR: Page Reload detected! Landing page is visible again.")
            break

        try:
            
            def text_has_changed(driver):
                try:
                    element = driver.find_element(By.ID, "question-text")
                    return element.is_displayed() and element.text != "" and element.text != last_question_text
                except:
                    return False

            wait.until(text_has_changed)
            
            
            q_element = driver.find_element(By.ID, "question-text")
            current_text = q_element.text
            last_question_text = current_text
            print(f"Question Loaded: {current_text}")
            
            
            time.sleep(0.5)
            options = wait.until(EC.presence_of_all_elements_located((By.CLASS_NAME, "option-btn")))
            
            if len(options) > 0:
                for attempt in range(3):
                    try:
                        fresh_opts = driver.find_elements(By.CLASS_NAME, "option-btn")
                        if fresh_opts:
                            fresh_opts[0].click()
                            print(" Option Clicked")
                            break
                    except StaleElementReferenceException:
                        time.sleep(0.5)
            else:
                print(" Options not found")

        except TimeoutException:
            print(" Timeout: Naya question load nahi hua.")
            
            if driver.find_element(By.ID, "landing-page").is_displayed():
                print(" Reason: Page crashed back to Landing Page.")
            break

    
    print("\nWaiting for Result Page...")
    try:
        wait.until(EC.visibility_of_element_located((By.ID, "animated-score")))
        time.sleep(3)
        final_score = driver.find_element(By.ID, "animated-score").text
        print(f" TEST SUCCESS: Final Score is {final_score}")
        driver.save_screenshot("Step3_Result_Final.png")
    except Exception as e:
        print(f" Result not found: {e}")

except Exception as e:
    print(f" Critical Error: {e}")

finally:
    driver.quit()
    print(" Browser Closed")


