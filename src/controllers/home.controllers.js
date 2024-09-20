
export const inicio = async (req, res) => {
    // Obtener las cookies del encabezado de la solicitud
    const cookies = req.headers.cookie;

    // Extraer la cookie `userId`
    let userId;
    if (cookies) {
        const cookiesArray = cookies.split('; ');
        const userIdCookie = cookiesArray.find(cookie => cookie.startsWith('userId='));
        if (userIdCookie) {
            userId = userIdCookie.split('=')[1];
        }
    }

    // Si no hay userId, redirigir al login
    if (!userId) {
        return res.redirect("/login");
    }

    try {
        // Hacer fetch a la API con el userId
        const response = await fetch(`http://localhost:3000/chats/${userId}`);
        const chatsData = await response.json();

        // Pasar los datos obtenidos a la vista
        res.render("views.inicio.ejs", { chats: chatsData });
    } catch (error) {
        console.error("Error fetching chats:", error);
        res.status(500).send("Error al obtener los chats");
    }
};

export const login = (req, res) => {
    res.render("views.login.ejs");
};
