import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hokumed.net@gmail.com',
    pass: process.env.HOKUI_PW
  }
})


function signupVerificationMail(
    to_mail: string,
    family: string,
    given: string,
    token: string
  ){
  const mailOptions = {
    from: 'hokumed.net@gmail.com',
    to: to_mail,
    subject: "北医ネットへようこそ！",
    text: `${family} ${given} さん\n\n` +
    '北大医学科生専用ポータルサイト，"北医ネット"へようこそ．' +
    '当サイトは，学生全員の協力で成り立っているサイトです．その目的は，日々の勉強の　'+
    '負担を軽減し学生生活をより充実したものにすることにあります．使用に当たっては，' +
    '以下の事を必ずお守りください．\n\n' +
    '・当サイトの存在を学生以外に口外しない．\n' +
    '・当サイトの資料を学生以外の目に晒さない．\n\n' +
    '上記が守られない場合，会員登録を取り消す場合があります．また，不適当だと判断される' +
    '資料は管理者が削除する可能性があります．同意して北医ネットを使用する場合，以下の' +
    '以下のURLからクリックしてください．管理者チームで学部在籍を確認次第，北医ネット' +
    'がご利用いただけます．\n\n' +
    `http://ik1-419-41929.vs.sakura.ne.jp/api/user/activation/${token}`
    // TO DO: replace with the domain.
  }
  console.log(process.env.HOKUI_PW)
  transporter.sendMail(mailOptions, (err, info)=>{
    if(err){
      console.log(err)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
}

export { signupVerificationMail }
