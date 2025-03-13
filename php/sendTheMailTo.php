<?php
//Import PHPMailer classes into the global namespace
//These must be at the top of your script, not inside a function
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

//Load Composer's autoloader
require '../vendor/autoload.php';

//Create an instance; passing `true` enables exceptions
$mail = new PHPMailer(true);
if (isset($_POST['g-recaptcha-response'])) {
    $captcha = $_POST['g-recaptcha-response'];
}

#$fp=fopen("STMTLOG", "w");
#fprintf($fp,"%d:Here\n",__LINE__);

if (isset($captcha)) {
    $secretKey = "6Lcn8b8eAAAAAMhSpZi8u_fDhnI1HfTXnCfOs9-T";
    $ip = $_SERVER['REMOTE_ADDR'];
    $response = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=" . $secretKey . "&response=" . $captcha . "&remoteip=" . $ip);
    $responseKeys = json_decode($response, true);
    if (intval($responseKeys["success"]) !== 1) {
        echo '<h2>Congrats, you are a robot!</h2>';
        http_response_code(403);
    } else {
        try {
            //Server settings
            // $mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
            $mail->isSMTP();                                            //Send using SMTP
            $mail->Host       = 'tribble-software.com';                     //Set the SMTP server to send through
            $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
            $mail->Username   = 'aujuscontact@tribble-software.com';                     //SMTP username
            $mail->Password   = '8i^p]a&GQVIL';                               //SMTP password
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
            $mail->Port       = 465;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`
            //Recipients
            $mail->setFrom('aujuscontact@tribble-software.com', 'Message from Aujus-cle.com');
            $mail->addAddress('aujuscle@gmail.com', 'Jakob Kelly');          //Add a recipient
            $mail->addReplyTo($_POST['email'], 'Reply from Au Jus');

            $body = "<h1>$_POST[name] has sent you a message from your website.</h1>" . "\n\n" .
                "<p>Here is the message:\n\n" .
                "$_POST[message]</p>" .
                "<p>You can contact $_POST[name] at $_POST[email] or $_POST[phone]</p>";
            //Content
            $mail->isHTML(true);                                  //Set email format to HTML
            $mail->Subject = 'Here is the subject';
            $mail->Body    = $body;
            $mail->AltBody = strip_tags($body);
            if ($mail->send()) {
                echo ("success");
                http_response_code(200);
            }
        } catch (Exception $e) {
            echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
            header('HTTP/1.1 500 Internal Server Error: ' . $mail->ErrorInfo);
        }
    }
}
