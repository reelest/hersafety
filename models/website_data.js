import { Item, Model } from "./lib/model";

export class WebsiteData extends Item {
  currentSession = "2022/2023";
  description =
    "This should contain a description of the entire website in 100 to 300 words.";
  address = "University of Benin, Benin-City, Edo State";
  phone1Label = "Contact Number";
  phone1 = "+2348157004401";
  phone2Label = "";
  phone2 = "";
  email = "rowendduke36@gmail.com";
  linkedInURL = "";
  facebookURL = "";
  twitterURL = "";
}

export const WebsiteDataModel = new Model("website_data", WebsiteData);
