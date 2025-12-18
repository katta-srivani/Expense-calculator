const descInput = document.getElementById("descInput");
const incomeInput = document.getElementById("incomeinput");
const expenseInput = document.getElementById("expenseinput");
const addBtn = document.querySelector("#con button");
const entriesList = document.getElementById("entriesList");
const resetBtn = document.getElementById("resetBtn");
const filters = document.querySelectorAll('input[name="filter"]');

let entries = JSON.parse(localStorage.getItem("entries")) || [];
let currentFilter = "all";
let editIndex = null;   // ✅ NEW

displayData();

/* ADD */
addBtn.addEventListener("click", () => {
    const desc = descInput.value.trim();
    const income = Number(incomeInput.value);
    const expense = Number(expenseInput.value);

    if (!desc) {
        alert("Please enter description");
        return;
    }

    if ((income > 0 && expense > 0) || (income <= 0 && expense <= 0)) {
        alert("Enter either income or expense (greater than zero)");
        return;
    }

    const entryData = {
        desc,
        type: income > 0 ? "income" : "expense",
        amount: income > 0 ? income : expense
    };

    if (editIndex !== null) {
        // ✅ TRUE UPDATE
        entries[editIndex] = entryData;
        editIndex = null;
        addBtn.textContent = "Add Entry";
    } else {
        // CREATE
        entries.push(entryData);
    }

    localStorage.setItem("entries", JSON.stringify(entries));
    clearInputs();
    displayData();
});

/* FILTER */
filters.forEach(radio => {
    radio.addEventListener("change", () => {
        currentFilter = radio.value;
        displayData();
    });
});

/* DISPLAY DATA */
function displayData() {
    entriesList.innerHTML = "";

    let totalIncome = 0;
    let totalExpense = 0;

    entries.forEach((entry, index) => {
        if (entry.type === "income") totalIncome += entry.amount;
        if (entry.type === "expense") totalExpense += entry.amount;

        if (currentFilter !== "all" && entry.type !== currentFilter) return;

        const div = document.createElement("div");
        div.className = entry.type;

        div.innerHTML = `
            <span>${entry.desc} - ₹${entry.amount}</span>
            <div>
                <button onclick="editEntry(${index})">Edit</button>
                <button onclick="deleteEntry(${index})">Delete</button>
            </div>
        `;

        entriesList.appendChild(div);
    });

    document.getElementById("totalIncome").textContent = totalIncome;
    document.getElementById("totalExpense").textContent = totalExpense;
    document.getElementById("netBalance").textContent = totalIncome - totalExpense;
}

/* DELETE ENTRY */
function deleteEntry(index) {
    entries.splice(index, 1);
    localStorage.setItem("entries", JSON.stringify(entries));
    displayData();
}

/* EDIT ENTRY  */
function editEntry(index) {
    const entry = entries[index];

    descInput.value = entry.desc;

    if (entry.type === "income") {
        incomeInput.value = entry.amount;
        expenseInput.value = "";
    } else {
        expenseInput.value = entry.amount;
        incomeInput.value = "";
    }

    editIndex = index;                  // ✅ STORE INDEX
    addBtn.textContent = "Update Entry";
}

/* RESET INPUTS */
resetBtn.addEventListener("click", clearInputs);

function clearInputs() {
    descInput.value = "";
    incomeInput.value = "";
    expenseInput.value = "";
    editIndex = null;
    addBtn.textContent = "Add Entry";
}
