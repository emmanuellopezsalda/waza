async function loginUser(name, phone) {
    try {
        const response = await fetch("http://localhost:3000/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name_: name,
                phone: phone
            })
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
    }
}

const btn = document.querySelector(".submit");
btn.addEventListener("click", async (e) => {
    e.preventDefault();
    const name = document.querySelector("#name").value;
    const phone = document.querySelector("#phone").value;
    const result = await loginUser(name, phone);
    if (result.length > 0) {
        localStorage.setItem('userId', result[0].id);
        window.location.href = "/";
    }
});
