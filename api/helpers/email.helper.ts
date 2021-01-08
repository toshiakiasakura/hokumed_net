import nodemailer from 'nodemailer'
import express from 'express'

const API_URL = 'http://hokumed.net'
const API_MAIL = 'hokumed.net@gmail.com'
const SIGNATURE = '\n\n----------------\n' +
'北医ネット (hokumed.net)\n' + 
`お問い合わせ先: ${API_MAIL}\n` +
`サイトURL: ${API_URL}\n` + 
'注: 旧北医ネット(hokui.net)からの移行サイトです．\n' + 
'---------------'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: API_MAIL,
    pass: process.env.HOKUI_PW
  }
})

type Options = {from: string, to: string, subject: string, text: string}

const sendMail = (options:Options) => {
    transporter.sendMail(options, (err, info)=>{
      if(err){
        console.log(err)
      } else {
        console.log('Email sent: ' + info.response)
      }
    })

}

class EmailSender{

  static signupVerificationMail(
      to_mail: string,
      family: string,
      given: string,
      userID: number,
      token: string

    ){
    const mailOptions = {
      from: API_MAIL,
      to: to_mail,
      subject: "北医ネットへようこそ！",
      text: `${family} ${given} さん\n\n` +
      '北大医学科生専用ポータルサイト，"北医ネット"へようこそ．' +
      '当サイトは，学生全員の協力で成り立っているサイトです．その目的は，日々の勉強の'+
      '負担を軽減し学生生活をより充実したものにすることにあります．使用に当たっては，' +
      '以下の事を必ずお守りください．\n\n' +
      '・当サイトの存在を学生以外に口外しない．\n' +
      '・当サイトの資料を学生以外の目に晒さない．\n\n' +
      '上記が守られない場合，会員登録を取り消す場合があります．また，不適当だと判断される' +
      '資料は管理者が削除する可能性があります．' + '上記の内容の詳細は，サイト内の利用規約でいつでもご確認いただけます．\n\n' + '上記内容に同意して北医ネットを使用する場合，' +
      '以下のURLをクリックしてください．クリックをもって上記内容に同意したものとします．\n' + '管理者チームで学部在籍を確認次第，北医ネット' +
      'をご利用いただけます．\n\n' +
      `${API_URL}/api/auth/activation/${userID}/${token}` + 
      SIGNATURE
    }
    console.log(process.env.HOKUI_PW)
    sendMail(mailOptions)
  }

  static approvalNotification(
    to_mail: string,
    family: string,
    given: string,
  ){
    const mailOptions = {
      from: API_MAIL,
      to: to_mail,
      subject: '北医ネットへようこそ!',
      text: `${family} ${given} さん\n\n` +
      '北医ネットのユーザー登録が承認されました．\n' + 'ログイン後，サイト内のSTUDYから教科の検索で「利用規約」を検索し、改めて利用規約を確認してください．' + '以下のURLからログインすることができます．\n\n'+
      `北医ネットを使って，有意義な学生生活を送りましょう．\n\n${API_URL}` +
      SIGNATURE
    }
    transporter.sendMail(mailOptions, (err, info)=>{
      if(err){
        console.log(err)
      } else {
        console.log('Email sent: ' + info.response)
      }
    })

    const adminMailOptions = {
      from: API_MAIL,
      to: API_MAIL,
      subject: `承認確認メール: ${family} ${given} さん`,
      text: `${family} ${given} さんを管理者画面から承認しました．` +
      `${to_mail}に承認メールを送信しました．`  +
      'もし，このユーザーにメールが届いて居ない場合は，受信設定を確認してみてください．' + 
      SIGNATURE
    }
    sendMail(adminMailOptions)
  }

  static resetPasswordVerificationMail(
    to_mail: string,
    userID: number,
    token: string
  ){
    const mailOptions = {
      from: API_MAIL,
      to: to_mail,
      subject: '北医ネット．パスワードの変更．',
      text: 'パスワードの変更を受け付けました． ' +
      '下記のurlをクリックするとパスワードの再設定が完了します．\n'  +
      'リンクを押すまでは変更がなされないため注意してください．\n\n' +
      'このメールに心当たりがない場合は，下記のurlは絶対にクリックせずに無視してください．\n' + 
      'なにか不明な点があれば，hokumed.net@gmail.comへご連絡ください．\n\n'+
      `${API_URL}/api/auth/verify-reset-password/${userID}/${token}` +
      SIGNATURE
    }
    sendMail(mailOptions)
  }
}

export { EmailSender }
