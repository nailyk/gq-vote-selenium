#!/usr/bin/ruby

require "selenium-webdriver"

$adblock_extension_path = File.expand_path("./extensions/AdBlock_v3.22.1.crx")  # we use adblock to avoid google ads/iframe popups
$gq_url_vote = 'https://www.gq.com/story/most-stylish-man-of-2017-round-of-16-voting'

def setup
  options = Selenium::WebDriver::Chrome::Options.new
  options.add_argument('--headless')
  options.add_argument('--disable-gpu')
  @driver = Selenium::WebDriver.for :chrome, options: options,
    :desired_capabilities => Selenium::WebDriver::Remote::Capabilities.chrome({
      "pageLoadStrategy" => "none",
      'chromeOptions' => {
        'prefs' => { 'profile.managed_default_content_settings.images': 2 },
        'extensions' => [
          Base64.strict_encode64(File.open($adblock_extension_path, 'rb').read)
        ]
      }
    })    
end

def wait_for(seconds)
  Selenium::WebDriver::Wait.new(timeout: seconds).until { yield }
end

def run
  setup
  return vote
end


def vote 
  @driver.navigate.to $gq_url_vote

  iframe = wait_for(10) { @driver.find_element(:xpath,"//*[@id=\"react-app\"]/div[2]/article/div[1]/div/div[1]/div[2]/div/div[2]/div[11]/div/iframe") }
  @driver.switch_to.frame iframe
  
  checkKanye = wait_for(10) { @driver.find_elements(:xpath,"//input[contains(@class, 'pds-radiobutton')]").last }
  @driver.action.move_to(checkKanye).perform # in chrome headless => need this for selection of checkKanye to work properly
  checkKanye.click

  wait_for(10) { checkKanye.selected? }  
  
  submitVote = wait_for(10) { @driver.find_element(:xpath,"//div[contains(@class, 'pds-votebutton-outer')]/a") }
  submitVote.click

  voteResult = wait_for(10) { @driver.find_elements(:xpath,"//div[contains(@class, 'pds-answer-feedback-bar')]").last }
  @driver.action.move_to(voteResult).perform
  @driver.save_screenshot('result.png')
  score = voteResult.attribute("style")  
  return /\d+(\.\d+)?%/.match(score)[0]
end

puts "Current score for Kanye : " + run
@driver.quit  
