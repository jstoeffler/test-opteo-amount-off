import { GoogleAdsApi, toMicros } from "google-ads-api";
require("dotenv").config();

const client = new GoogleAdsApi({
  client_id: process.env.GOOGLE_ADS_CLIENT_ID || "",
  client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET || "",
  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN || "",
});

const customer = client.Customer({
  customer_id:
    (process.env.GOOGLE_ADS_CUSTOMER_ACCOUNT_ID || "").split("-").join("") ||
    "",
  refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN || "",
  login_customer_id: (process.env.GOOGLE_ADS_MANAGER_ACCOUNT_ID || "")
    .split("-")
    .join(""),
});

const run = async () => {
  try {
    console.log("Creating promotion asset with percent off...");
    const result1 = await customer.assets.create([
      {
        final_urls: ["https://opteo.com/"],
        promotion_asset: {
          promotion_target: "your order",
          occasion: "NEW_YEARS",
          language_code: "EN",
          percent_off: toMicros(0.2),
        },
      },
    ]);
    console.log(result1);
    console.log("Updating promotion asset with currency...");
    const resourceName = result1.results[0].resource_name;
    const result2 = await customer.assets.update([
      {
        resource_name: resourceName,
        promotion_asset: {
          money_amount_off: {
            currency_code: "USD",
            amount_micros: toMicros(10),
          },
          percent_off: 0,
        },
      },
    ]);
    console.log(result2);
    console.log("Updating promotion asset with percent off...");
    const result3 = await customer.assets.update([
      {
        resource_name: resourceName,
        promotion_asset: {
          percent_off: toMicros(0.2),
          money_amount_off: null,
          // Setting money_amount_off to null or undefined leads to errors[0].error_code.asset_error == "PROMOTION_CANNOT_SET_PERCENT_OFF_AND_MONEY_AMOUNT_OFF"
          // Setting it to {currency_code: "USD",amount_micros:0} leads to errors[0].error_code.range_error == "TOO_LOW"
        },
      },
    ]);
    console.log(result3);
  } catch (e) {
    console.error(JSON.stringify(e, null, 2));
  }
};

run().then(() => {
  console.log("done");
});
