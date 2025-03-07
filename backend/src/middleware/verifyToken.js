import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.JWT_SECRET; // Asumiendo que tienes un archivo de configuración

// Middleware para verificar si el token JWT es válido
const verifyToken = (req, res, next) => {
    // Obtener el token desde las cookies (suponiendo que usamos cookies HttpOnly)
    const token = req.cookies.token;    

    if (!token) {
        return res
            .status(401)
            .json({ error: "No token provided, please login" });
    }

    // Verificar el token
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Invalid or expired token" });
        }

        // Si el token es válido, se pasa la información decodificada al siguiente middleware
        req.activeUser = decoded; // Almacenamos la info del usuario decodificada para usarla en rutas protegidas
        next(); // Llamamos a next() para pasar a la siguiente función (ruta, controlador)
    });
};

export default verifyToken;
