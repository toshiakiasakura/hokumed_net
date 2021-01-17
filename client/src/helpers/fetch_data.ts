import React, { useEffect, useState } from 'react'

import { Class_Year } from '../entity/study.entity'
import { User } from '../entity/user.entity'
import { AdminService } from '../services/admin.service'
import { MatchIDType, State, Form } from '../helpers/types.helper'

/**
 * Custom fething data hooks, summarized into one class.
 */
export function FetchMultiClassYears(){
  const [state, setState] = useState<
      State['Multi']['Class_Year']
      >( {contents:[], status:200, msg:''})

  useEffect(()=> {
    AdminService.getMultipleObjects<Class_Year>('year', setState)
  },[setState])
  return {state, setState}
}

export function FetchOneClassYear(id:number){
  const [state, setState] = useState< State['One']['Class_Year']>
    ( {content:new Class_Year(), status:200, msg:''})

  useEffect(()=> {
    AdminService.getOneObject<Class_Year>(`year/${id}`, setState)
  },[setState])

  return {state, setState}
}

export function FetchMultiUsers(){
  /**
   * Many arguments are for filtering function.
   */
  const [state, setState] = useState<
        State['Admin']['User']
      >( {contents:[], status:200, msg:'', 
      filtered:[], fil_year:NaN, fil_name:'', 
      fil_state:'', fil_mail:''})

  useEffect(()=> {
    AdminService.getMultipleObjects<User>('user', setState)
    .then( _ => {
      setState((prev:any) => ({ ...prev, filtered:prev.contents }))
    })
  },[setState])
  return {state, setState}
}

export function FetchOneUser(id:number){
  const [state, setState] = useState<State['One']['User']>
    ({content:new User(), status:200, msg:''})
  useEffect(()=> {
    AdminService.getOneObject<User>(`user/${id}`, setState)
    },[setState])

  return {state, setState}
}