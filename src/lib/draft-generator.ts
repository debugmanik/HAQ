import { IssueCategory } from "./store";

export function generateRTIDraft(
  category: IssueCategory,
  answers: Record<string, string>,
  intakeText: string
): string {
  let template = category.rtiTemplate;
  
  // Format dates
  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  // Safe date formatter helper
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "___________________";
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    } catch {
      return dateStr;
    }
  };

  const replacements: Record<string, string> = {
    "[FULL_NAME]": answers["fullName"] || "___________________",
    "[FULL_ADDRESS]": answers["fullAddress"] || "___________________",
    "[STATE]": answers["state"] || "___________________",
    "[DISTRICT]": answers["district"] || "___________________",
    "[CURRENT_DATE]": today,
    "[PAYMENT_METHOD]": answers["paymentMethod"] || "Indian Postal Order (IPO)",
    "[PAYMENT_REF]": answers["paymentRef"] || "IPO No. XXXXXX",
    
    // Road Category specific
    "[LOCATION]": answers["location"] || answers["district"] || "specified location",
    "[MUNICIPALITY_OR_PWD]": answers["municipality"] || "Municipal Corporation / Public Works Department",
    
    // Ration category specific
    "[RATION_CARD_NO]": answers["rationCardNo"] || "Not Provided",
    "[FPS_SHOP_NO]": answers["fpsShopNo"] || "Not Provided",
    "[ISSUE_TYPE]": answers["issueType"] || "Non-delivery of food grains",
    "[MONTHS_YEARS]": "the last 3 months",
    
    // Water category specific
    "[PROBLEM_TYPE]": answers["problemType"] || answers["desiredOutcome"] || "Contaminated water supply",
    "[FINANCIAL_YEARS]": "2024-25 and 2025-26",
    
    // Certificate category specific
    "[SERVICE_NAME]": answers["serviceName"] || "Caste/Income Certificate",
    "[APPLICATION_NO]": answers["applicationNo"] || "Not Provided",
    "[SUBMISSION_DATE]": formatDate(answers["submissionDate"]),
      
    // Encroachment category specific
    "[DESCRIPTION_OF_ENCROACHMENT]": answers["descriptionOfEncroachment"] || intakeText || "Unauthorized obstruction on public space",

    // Scholarship specific
    "[SCHEME_NAME]": answers["schemeName"] || "Scholarship Scheme",
    "[INSTITUTION]": answers["institution"] || "Educational Institution",

    // Landlord specific
    "[LANDLORD_NAME]": answers["landlordName"] || "Landlord Name",
    "[DEPOSIT_AMOUNT]": answers["depositAmount"] || "50000",
    "[PROPERTY_ADDRESS]": answers["propertyAddress"] || "Rented Property Address",
    "[VACATE_DATE]": formatDate(answers["vacateDate"]),

    // Defective Product specific
    "[COMPANY_NAME]": answers["companyName"] || "Company / Brand Name",
    "[PRODUCT_NAME]": answers["productName"] || "Product Model",
    "[INVOICE_NO]": answers["invoiceNo"] || "Invoice/Bill Number",
    "[PURCHASE_DATE]": formatDate(answers["purchaseDate"]),
    "[AMOUNT_PAID]": answers["amountPaid"] || "0",

    // Welfare specific
    "[DESIRED_OUTCOME]": answers["desiredOutcome"] || "Clarification of eligibility status",

    // Custom Category specific
    "[CUSTOM_TITLE]": category.title || "___________________",
    "[CUSTOM_GRIEVANCE]": answers["customGrievance"] || intakeText || "___________________",
    "[DEPARTMENT_NAME]": answers["departmentName"] || answers["district"] || "Concerned Department"
  };

  // Replace each placeholder in the template
  Object.entries(replacements).forEach(([key, val]) => {
    // Escape regex characters
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escapedKey, "g");
    template = template.replace(regex, val);
  });

  return template;
}
