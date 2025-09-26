const fetch = global.fetch;

(async () => {
  const BREVO_API_KEY = "your-real-api-key-here"; // your new key
  const LIST_ID = your-list-id-here; // your contact list ID

  const body = {
    email: "erikas@example.com",
    listIds: [LIST_ID],
    updateEnabled: true
  };

  console.log("Sending body:", body);

  const response = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY,
      "Content-Type": "application/json",
      "accept": "application/json"
    },
    body: JSON.stringify(body)
  });

  const text = await response.text();  // get raw text first
  console.log("Brevo raw response:", text);

  let data;
  try {
    data = JSON.parse(text);  // parse if JSON exists
  } catch {
    data = text;  // keep as raw text if parsing fails
  }

  console.log("Parsed data:", data);
})();









