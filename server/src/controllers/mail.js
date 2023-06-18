import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true,
    auth: {
        user: 'sqlcrowd@yandex.by',
        pass: 'qjarnacotatyvjmd',
    }
});


export async function mySendMail(nickname, email, newPassword, userId, userCreateAt) {

    transporter.sendMail({
        from: 'sqlcrowd@yandex.by',
        to: email,
        subject: 'Регистрация SQLCrowd',
        text: 'Подтверждение электронной почты',
        html: `
    <!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Подтверждение электронной почты</title>
  <style>
    body {
      font-family: 'Montserrat', sans-serif;
      font-size: 16px;
      line-height: 1.5;
      color: #333;
      background-color: #f5f5f5;
    }
    h1, h2, h3, h4, h5, h6 {
      font-weight: bold;
      margin-top: 0;
    }
    a {
      color: #007bff;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #fff;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0px 0px 20px rgba(0,0,0,0.1);
    }
    .code-input {
      font-size: 16px;
      padding: 5px 10px;
      border-radius: 5px;
      border: 2px solid #ccc;
      width: 100%;
      box-sizing: border-box;
    }
    .copy-button {
      font-size: 12px;
      color: #999;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Спасибо за регистрацию в SQLCrowd</h1>
    <p>В системе вы с №:<strong>${userId}</strong></p>
    <p>Время регистрации: <strong>${userCreateAt}</strong></p>
    <p>Ваш никнейм: <strong>${nickname}</strong></p>
    <p>Ваш email: <strong>${email}</strong></p>
    <p><strong>В качестве логина вы можете использовать или никнейм или email</strong></p>
    <div style="position: relative;">
      <input type="text" value="${newPassword}" id="code-input" class="code-input" readonly>
      <div id="copy-button" class="copy-button">Это ваш пароль. Используйте его для входа</div>
    </div>
    <p>Следите за нами в социальных сетях:</p>
    <div style="display: flex; justify-content: center; align-items: center;">
      <a href="https://vk.com/sqlcrowd" style="margin-right: 20px;"><img src="https://cdn-icons-png.flaticon.com/512/39/39699.png" alt="ВКонтакте" style="height: 30px;"></a>
      <a href="https://github.com/tkachouS01/SQLCrowd" style="margin-right: 20px;"><img src="https://assets.stickpng.com/images/629b7adc7c5cd817694c3231.png" alt="GitHub" style="height: 30px;"></a>
      </div>
  </div>
</body>
</html>
  `

    }, (error, info) => {
        if (error) {
            return false;
        } else {
            return true;
        }
    });
}