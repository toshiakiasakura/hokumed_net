import React, { useEffect, useState } from 'react'
import { Route, Switch, Link, useHistory } from 'react-router-dom'
import { useForm } from 'react-hook-form'

import {
   TableRow, FetchValidation, BackButton, Loading, TransitionButton,
   dateValidation
} from '../../helpers/utils.component'
import { AdminService } from '../../services/admin.service'
import { AuthService } from '../../services/auth.service'
import { MatchIDType, State, Form } from '../../helpers/types.helper'
import { 
  FormRow, ClassYearBlock, DateBlock, ProfileSubmitButton
} from '../../helpers/form.component' 
import { User } from '../../entity/user.entity'


export function UserEditForm(props:{user:User}){
  const history = useHistory()
  let user = props.user
  let birthday = new Date(user.birthday)
  
  const { 
    register, handleSubmit, errors, formState, control, watch 
    } = useForm<Form['Admin_User']>({
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
  
  const handleEdit = (data:Form['Admin_User']) => {
    //date validation.
    let birthday = dateValidation(data.birth_year,data.birth_month, data.birth_day)
    if(!birthday){
      alert("日付を正しく選択してください．")
      return
    } else {
      data.birthday = birthday
    }
    AdminService.editOneObject(`edit/user/${user.id}`, data)
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
          />
          <FormRow
            title="名前"
            name="given_name"
            id="editGivenName"
            placeholder="名前"
            errors={errors} register={register}
            reg_json={require_json}
          />
          <FormRow
            title= "ニックネーム"
            name="handle_name"
            id="editHandleName"
            placeholder="ニックネーム"
            errors={errors} register={register}
            reg_json={{
              required:require_str,
              validate:  (v:string) => AdminService.checkHandle(v,user.id)
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
            name="email_mobile"
            id="signupBobileEmail"
            placeholder="example@gmail.com"
            errors={errors} register={register}
            reg_json={{}}
          />
          <ClassYearBlock register={register} name='class_year'
          />
          <ProfileSubmitButton formState={formState} title="編集"/>
        </div>
      </div>
    </form>
  )
}
