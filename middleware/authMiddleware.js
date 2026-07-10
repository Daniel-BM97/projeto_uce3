import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "segredo";

export function autenticarToken(request, response, next) {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        return response.status(401).json({ message: "Token não informado" });
    }

    const [tipo, token] = authHeader.split(" ");

    if (tipo !== "Bearer" || !token) {
        return response.status(401).json({
            message: "Formato de token inválido. Use: Authorization: Bearer <token>",
        });
    }

    try {
        request.usuario = jwt.verify(token, JWT_SECRET);
        next();
    } catch {
        return response.status(401).json({ message: "Token inválido ou expirado" });
    }
}

export { JWT_SECRET };
