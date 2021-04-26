import React from 'react'

const Horizontal = () =>{
  return(
    <hr style={{border:"0",borderTop:"2px solid #a9a9a9"}}　/>
  )
}

const DonationPage = () => {
  const style1 = {
    border: '#a9a9a9 solid 1px', 
    borderLeft: '#080808 solid 10px', 
    padding: '5px', 
    background: '#fff', 
    fontSize: '100%'
  }
  const style2 = {
    //textAlign:"center",
    background: "#f0f8ff", 
    border: "1px #191970 solid",
    boxShadow: "0 3px 4px 0 #ddd",
    color: "#8b0000",
    fontSize: "120%",
    padding: "15px"
  }
  const font80 = {fontSize: "80%"}
  const font120 = {fontSize: "120%"}
  return (
    <div className="topfix">
      <div className="container">
        <div className="col--sm-10 col--sm-offset-1">
        <h1>「北医ネット」運営維持のための寄付のお願い
        </h1>
          <p>
            <div style={{textAlign:"right"}}>「北医ネット」管理会　拝　<br />（最終更新：2021年4月26日）
            </div>
          </p>
          <p>
            <div style={{textAlign:"left"}}>「北医ネット」をご利用されてきた卒業生の皆様へ
            </div>
          </p>
          <p>
            <br />この度はお忙しいところ、本ページへご来訪いただきまして誠にありがとうございます。
          </p>
          <p>「北医ネット」は先代サイト（hokui.net）を含めると2012年から運用を開始して以来、
            北大医学部医学科の学生に過去問はじめ学習資料を提供してまいりました。<br />
            ですが、これらの活動も決して簡単に行ってきたものではなく、
            先代サイトの管理人の方々が多くの時間的・金銭的なコストを費やしてきたものでした。
            特に、金銭的コストについては<b><span style={{color:"ff0000"}}>とある管理人の方が推定額10万円以上を立て替えたまま、
            返済することができず数年が経過してしまった</span></b>というのが現状です。
          </p>
          <p>さて、この度2021年度より新体制にて北医ネット（
            <a href="hokumed.net"><span style={{color:"000000"}}
            >
              hokumed.net
            </span></a>）
            が本格的に運用開始しました。そこで、今後の運営に関わりまして、以下の様に金銭的な体制の強化を図ることといたしました。
            <br />
          </p>
          <div style={style1} >
            <ul>
              <b>
                <li>先代サイトの運営のための諸費用を立て替えていただいた管理人への返済を開始する</li>
                <li>今後の「北医ネット」を継続して運営するためにかかる諸経費を確保する</li>
                <li>管理人らのサイトの運営管理にかかる時間的コストに対し、相応の対価を与えることで資料やサービスの提供を盤石に整える</li>
              </b>
            </ul>
          </div>
          <br />
          <div style={font120}>
            <b>つきましては、北医ネットをこれまで利用された卒業生の皆様に、活動維持のための募金をお願いしております。</b>
          </div>
            <br />
              詳しい要項や募金方法につきましては、以下をご覧ください。
            <br />
            <br />
          <div style={style2}>
              皆様がご利用された北医ネットを後輩らが引き続き利用していくには、皆様一人ひとりのご協力が不可欠です。<br />
              大変恐縮ですが、ご協力のほどよろしくお願い申し上げます。
          </div>
        <br /><br /><br />
        <Horizontal />
        <h2 style={{textAlign:"center"}}>募金　概要</h2>
        <h3>寄付金の使用用途</h3>
        <div style={style1}>
          <ol>
            <li>サーバーレンタル費やドメイン取得費など、現在および今後の北医ネットのWebサービスの提供または維持管理に必要な諸経費</li>
            <li>前身のサイトであるhokui.netにおけるWebサービスの提供または維持管理に必要な諸経費のうち、先代管理人の方が立て替えた諸経費の返済</li>
            <li>確実に体制を整える上で協力を要し、各学年の管理人が費やす時間的コストに対して支払う費用</li>
            <li>上記1.および2.また募金額の引き出しに要する手数料</li>
            <li>そのほか、管理会の合議において、活動にあたって必要であると認められた支出</li>
          </ol>
        </div>
        <div style={font80}>
          ※上記は、「北海道大学『北医ネット管理会』金銭取扱い規則」に則って記載しています。
        </div><br />
          <h3>募金目標金額</h3>
          <span style={{fontSize: "160%"}}>目標：¥147,000/年</span><br />
            [内訳]
          <ul>
            <li>
              上記寄付金の使用用途1.（以下、同様の表記を単に上記1.と記す）に記した費用：約¥10,000円/年
            </li>
            <li>
              上記2.について、¥15,000/年 × 9年（2012年〜2020年）＝¥135,000（※注1）
            </li>
            <li>
              上記4.にかかる手数料¥23,000：引き落とし手数料¥22,000程度（集金額の15%）＋ 振込手数料総計¥1,000程度
            </li>
            <li>
              上記3.にかかる、管理人に対し払われる費用：¥4,000（特別な役職についている場合は¥6,000）/人・年 × 10人〜15人（2〜6年生にそれぞれ2〜3人程度）= ¥50,000程度（※注2）
            </li>
            <li>
              緊急的に金銭を要する活動を行う場合に、あるいは今後何らかの事情で突如募金活動が停止となった場合における
              当面の活動予備資金として、サーバー管理代2年分：¥10,000 × 2 ＝ ¥20,000
            </li>
          </ul>
          <div style={font80}>
            ※注1：3年程度での分割返済とする予定のため、¥135,000 ÷ 3年 ＝ ¥45,000/年と計算
            <br />
            ※注2：その他の上記に要する出費を優先し、必要に応じてこれらの支払金は減額される旨は
            「北海道大学『北医ネット管理会』金銭取扱い規則」にて定めている。
            また、ここで示した¥5,000/¥7,000はあくまで個人に支給されうる上限額であり、
            資金状況によっては管理人らに本件の支払いがなされない場合もあり得る。
          </div>
          <br />
          <Horizontal />
          <div style={{
            background: "#191970", border: "1px solid #191970", paddingLeft: "20px"
            }}> 
            <span style={{color: "white", fontSize: "180%"}}>
              <b>
                募金方法
              </b>
            </span>
          </div> 
          <div style={{border: "1px solid #191970", fontSize: "100%", padding: "10px"}}> 
            <ol>
              <li>
                ページ下部の「北医ネットへの寄付」と書かれた欄にある<b>『サポート』</b>をクリックして下さい。
              </li>
              <li>
                募金金額を設定し、下部の「この価格に決定」をクリックしてください。
                一口¥1,000を推奨しておりますが、金額の設定は任意です。<br />
                また、募金用途などにコメントがございましたらコメント欄にご記入ください。
              </li>
              <li>
                次の画面が表示されますので、「会員登録をしないで決済」を選択してください
              </li>
              <li>
                必要事項を記入し、下部の「支払う」をクリックしてください
              </li>
              <li>
                支払いが完了しましたら、codoc運営より「サポート記事をサポートしました」といった旨の自動メールが送付されます。
                そのメールの受信をもって、支払い完了となります。
              </li>
            </ol> 
          </div>
          <div style={font80}>※募金には以下のいずれかのご利用が必要です。<br />
            クレジットカード（VISA, mastercard, AMERICAN EXPRESS, JCB, Diners Club, DISCOVER）, 
            Apple Pay, Google Pay. 
          </div>
          <br /><br /><br />
          <div style={{textAlign:"center", fontSize: "120%"}}>
            お忙しいところ最後までご覧いただき、誠にありがとうございました。
          </div>
          {/*codoc script */}
          <div id="codoc-entry-nYi6ltt4Fg" className="codoc-entries" data-without-body="1" data-support-message="北医ネットへの寄付"></div>
        </div>
      </div>
    </div>
  )
}

export {DonationPage}