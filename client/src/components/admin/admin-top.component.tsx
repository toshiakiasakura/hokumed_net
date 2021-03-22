const TopItem = (props:{href:string, col1:string, col2:string})=>{
  return(
    <tr>
      <th>
        <a href={props.href}>
          {props.col1}
        </a>
      </th>
      <td>
        {props.col2}
      </td>
    </tr>
  )
}

export const Top = () => {
  return(
  <table  className="table table--bordered">
    <tr>
      <th> <a href="/admin/user" > ユーザー </a>
      </th>
      <td>
        <strong>
        取得 ， 管理人の認証(approve) ，削除，管理人の管理
        </strong>
        をすることが出来ます．
      </td>
    </tr>
    <TopItem href="/admin/year" col1="学年" col2="93期以降から作成可能です．" />
    <TopItem href="/admin/subject" col1="教科"
      col2={'英語名には半角英数字と「_(アンダーバー)」のみ設定できます． '+
      '教科のページのURLに使われるので慎重に設定しましょう．' }/>
    <TopItem href="/admin/semester" col1="学期" col2="各学年のセメスター(前期・後期)ごとの履修科目のマップです．" />
    <TopItem href="/admin/notification" col1="お知らせ" col2="お知らせの編集が出来ます．" />
    <TopItem href="https://www.notion.so/063d625a87594218b6e558d49947ede3" col1="管理会ページ" col2="Notionの管理会用のページです．別サイトに動きます．" />
  </table>
  )
}
