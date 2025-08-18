export const sendPost = () => {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = "https://caas.fabrinet.co.th/default.php";
  // form.target = "hidden_iframe"; // ส่งไป iframe
  form.style.display = "none";

  const inputs = [
    { name: "app_name", value: "@CRUD" },
    // { name: "session_ticket", value: "Logout" },
  ];

  inputs.forEach(({ name, value }) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};
