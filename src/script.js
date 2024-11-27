document.addEventListener("DOMContentLoaded", () => {
  const totalIncome = document.getElementById("total-income");
  const totalExpense = document.getElementById("total-expense");
  const netBalance = document.getElementById("net-balance");
  const entryList = document.getElementById("entry-list");
  const description = document.getElementById("description");
  const amount = document.getElementById("amount");
  const type = document.getElementById("type"); // Dropdown or radio for income/expense
  const addEntry = document.getElementById("add-entry");
  const resetFields = document.getElementById("reset-fields");

  // Retrieve or initialize entries
  let entries = JSON.parse(localStorage.getItem("entries")) || [];

  // Function to calculate total income, expense, and net balance
  const calculateSummary = () => {
    const income = entries
      .filter((e) => e.type === "income")
      .reduce((acc, e) => acc + e.amount, 0);
    const expense = entries
      .filter((e) => e.type === "expense")
      .reduce((acc, e) => acc + e.amount, 0);
    totalIncome.textContent = income.toFixed(2);
    totalExpense.textContent = expense.toFixed(2);
    netBalance.textContent = (income - expense).toFixed(2);
  };

  // Save entries to localStorage
  const saveToLocalStorage = () => {
    localStorage.setItem("entries", JSON.stringify(entries));
  };

  // Render entries based on filter
  const renderEntries = (filter = "all") => {
    entryList.innerHTML = "";
    const filteredEntries =
      filter === "all" ? entries : entries.filter((e) => e.type === filter);

    filteredEntries.forEach((entry, index) => {
      const li = document.createElement("li");
      li.classList.add(
        "flex",
        "justify-between",
        "items-center",
        "p-3",
        "rounded",
        "mb-2"
      );
      li.innerHTML = `
        <span>${entry.description} - &#x20B9;
${entry.amount.toFixed(2)} (${entry.type})</span>
        <div class="flex gap-4">
          <button class="edit-btn bg-blue-500 text-white px-2 py-1 rounded" onclick="editEntry(${index})">Edit</button>
          <button class="delete-btn bg-red-500 text-white px-2 py-1 rounded" onclick="deleteEntry(${index})">Delete</button>
        </div>
      `;
      entryList.appendChild(li);
    });
  };

  // Add new entry
  const addNewEntry = () => {
    const desc = description.value.trim();
    const amt = parseFloat(amount.value);
    const entryType = type.value; // 'income' or 'expense'

    if (!desc || isNaN(amt) || amt <= 0 || !entryType) {
      return alert("Please provide valid details.");
    }

    entries.push({ description: desc, amount: amt, type: entryType });
    saveToLocalStorage();
    calculateSummary();
    renderEntries();
    resetFormFields();
  };

  // Reset form fields
  const resetFormFields = () => {
    description.value = "";
    amount.value = "";
    type.value = ""; // Reset dropdown or radio selection
  };

  // Edit an entry
  window.editEntry = (index) => {
    const entry = entries[index];
    description.value = entry.description;
    amount.value = entry.amount;
    type.value = entry.type;
    deleteEntry(index); // Remove the entry temporarily to avoid duplication
  };

  // Delete an entry
  window.deleteEntry = (index) => {
    entries.splice(index, 1);
    saveToLocalStorage();
    calculateSummary();
    renderEntries();
  };

  // Filter entries by type
  document.querySelectorAll('[name="filter"]').forEach((radio) => {
    radio.addEventListener("change", (e) => renderEntries(e.target.value));
  });

  // Event listeners for adding and resetting
  addEntry.addEventListener("click", addNewEntry);
  resetFields.addEventListener("click", resetFormFields);

  // Initialize app
  calculateSummary();
  renderEntries();
});
