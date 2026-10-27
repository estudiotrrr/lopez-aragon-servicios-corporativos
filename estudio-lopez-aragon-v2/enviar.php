<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

// 1. Correo que recibirá las consultas
$destinatario = 'tomas@juridicolopezaragon.com'; 

// 2. Sanitización de campos
$nombre   = htmlspecialchars(trim($_POST['nombre'] ?? ''));
$empresa  = htmlspecialchars(trim($_POST['empresa'] ?? ''));
$email    = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$interes  = htmlspecialchars(trim($_POST['interes'] ?? ''));
$mensaje  = htmlspecialchars(trim($_POST['mensaje'] ?? ''));

if (empty($nombre) || empty($email) || empty($mensaje) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Por favor complete todos los campos obligatorios.']);
    exit;
}

// 3. Asunto y cuerpo del mensaje
$asunto = "Nueva Consulta Web - " . $nombre . " (" . $empresa . ")";

$cuerpo = "Has recibido una nueva consulta desde la web de López Aragón:\n\n";
$cuerpo .= "Nombre y Apellido: " . $nombre . "\n";
$cuerpo .= "Empresa / Razón Social: " . $empresa . "\n";
$cuerpo .= "Email de contacto: " . $email . "\n";
$cuerpo .= "Área de Interés: " . $interes . "\n\n";
$cuerpo .= "Mensaje:\n" . $mensaje . "\n\n";
$cuerpo .= "--------------------------------------------------\n";
$cuerpo .= "Enviado el " . date('d/m/Y H:i:s') . "\n";

// 4. Cabeceras del correo (garantizan que al darle 'Responder' le responda al cliente)
$headers = "From: Web López Aragón <no-reply@lacorporativo.com>\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// 5. Envío mediante el servidor de correo de Hostinger
if (@mail($destinatario, $asunto, $cuerpo, $headers)) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'No se pudo despachar el correo desde el servidor.']);
}