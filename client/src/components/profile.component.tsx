import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { 
  Route, Switch, Redirect, Link, useHistory 
} from 'react-router-dom'
import moment from 'moment'

import { UserService } from '../services/user.service'
import { AuthService } from '../services/auth.service'
import { User } from '../entity/user.entity'
import { FetchValidation, Loading, TransitionButton } from '../helpers/utils.component'
import { 
  FormRow, ClassYearBlock, DateBlock, ProfileSubmitButton
} from '../helpers/form.component' 
import { UserBody } from './admin/admin-user.component'
import { State, Form } from '../helpers/types.helper'

/**
 * Unique id for user is sent via cookie.
 */
function Profile(){
  const [state, setState] = useState<State['One']['User']>
    ({content:new User(), status:200, msg:''})

  useEffect(()=> {
    UserService.getProfileBoard(setState)
    },[setState])

  console.log('profile componenct access.')
  let user= state.content
  return(
    <FetchValidation status={state.status}>
      {user === undefined || user.id === undefined 
      ? <Loading />
      : 
        <div className="topfix">
          <div className="container">
            <ul className="list-inline">
              <li>
                <h1>プロフィール </h1>
              </li>
              <li>
                <TransitionButton title='編集' url='/profile/edit'/> 
              </li>
              <table className="table table--bordered no-mb">
                <UserBody user={user} />
              </table>
            </ul>
          </div>
        </div>
      }
    </FetchValidation >
  )
}


function EditForm(props:{user:User}){
  let user = props.user
  let birthday = new Date(user.birthday)
  
  const history = useHistory()
  const { 
    register, handleSubmit, errors, formState, control, watch 
    } = useForm<Form['Profile']>({
      mode:'onBlur',
      defaultValues:{
        family_name:user.family_name,
        given_name: user.given_name,
        handle_name: user.handle_name,
        email: user.email,
        email_mobile: user.email_mobile,
        birth_year: String(birthday.getFullYear()),
        birth_month: String(birthday.getMonth()+1),
        birth_day: String(birthday.getDate()),
        class_year: user.class_year
      }
    })
  
  const handleEdit = (data:Form['Profile']) => {
    //date validation.
    const date_str = `${data.birth_year}-${data.birth_month}-${data.birth_day}`
    const date_bool = moment(date_str, 'YYYY-M-D',true).isValid()
    if (!date_bool){
      alert("日付を正しく選択してください．")
      return
    }
    data.birthday = new Date(date_str)
    UserService.editProfile(data)
      .then((res) =>{
        alert(res.data.msg)
        history.push('/profile')
      })

  }

        
                            
  const require_str = "入力必須項目です．"
  const require_json = {required: require_str}
  return(
    <form
      className="form row"
      role="form"
      name="signup"
      onSubmit={handleSubmit(handleEdit)}
    >
        <div className="panel">
          <div className="panel__body">
            <FormRow
              title="苗字"
              name="family_name"
              id="editFamilyName"
              placeholder="苗字"
              errors={errors} register={register}
              reg_json={require_json}
              disabled={true}
            />
            <FormRow
              title="名前"
              name="given_name"
              id="editGivenName"
              placeholder="名前"
              errors={errors} register={register}
              reg_json={require_json}
              disabled={true}
            />
            <FormRow
              title= "ニックネーム"
              name="handle_name"
              id="editHandleName"
              placeholder="ニックネーム"
              errors={errors} register={register}
              reg_json={{
                required:require_str,
                validate:  AuthService.checkHandle
              }}
            />
            <FormRow
              title="ELMSメール"
              type="email"
              name="email"
              id="editEmail"
              placeholder="example@eis.hokudai.ac.jp"
              errors={errors} register={register}
              reg_json={{
                required: require_str,
              }}
              disabled={true}
            />
            <DateBlock register={register}/>
            <FormRow
              title="携帯メール (空欄可)"
              type="email"
              name=""
              id="signupBobileEmail"
              placeholder="example@gmail.com"
              errors={errors} register={register}
              reg_json={{}}
            />
            <ClassYearBlock 
              register={register} 
              name='class_year'
              disabled={true}
            />
            <ProfileSubmitButton formState={formState} title="編集"/>
          </div>
        </div>
    </form>
  )
}


function ProfileEdit(){
  const [state, setState] = useState<State['One']['User']>
    ({content:new User(), status:200, msg:''})

  useEffect(()=> {
    UserService.getProfileBoard(setState)
    },[setState])


  console.log('profile componenct access.')
  let user= state.content
  return(
    <FetchValidation status={state.status}>
      {user === undefined || user.id === undefined 
      ? <Loading />
      : 
        <div className="topfix container">
          <h1> プロフィールの編集　</h1>
          <a href="javascript;:"> 
            <Link to="/profile"> プロフィールに戻る</Link>
          </a>
          <p>
            <br />
            ELMSメール，期を変更希望の方は &nbsp;
            <a href="mailto:hokumed.net@gmail.com">hokumed.net@gmail.com</a>
             &nbsp; までご連絡ください．
          </p>
          <EditForm user={user}/>

        </div>
        }
    </FetchValidation >
  )
}

function ProfilePages(){
  return(
    <Switch>
      <Route exact path='/profile' component={ Profile } />
      <Route exact path='/profile/edit' component={ ProfileEdit }/> 
      <Route component={ () => <Redirect to='/error'/>}/> 
    </Switch>
  )
}
export { ProfilePages }
