
/**
 * One row desgine of a form is decorated with this function. 
 * @param props.title Title of the form.
 */
export function FormGroupContainer(props:{title:string, children:any}){
  return(
    <div className="form__group">
      <div className="col--sm-4">
        <label className="form__label">
           {props.title}
        </label>
      </div>
      <div className="col--sm-8">
        {props.children}
      </div>
    </div>
  )
}


/**
 * Construct one item of simple input form using react-hook-form.
 * @param props.register just pass react-hook-form method.
 * @param props.errors just pass react-hook-form method.
 * @param props.reg_json this json contents are passed to register.
 */
export function FormRow(
  props:
    {
      // default value for optional arguments. condition will be good choice.
      type?: string,
      title: string,
      name: string,
      id: string,
      placeholder: string,
      register: any,
      errors: any,
      reg_json: any
    }
){
  return(
    <div className="form__group">
      <div className="col--sm-2">
        <label className="form__label" htmlFor={props.id}>
          {props.title}
        </label>
      </div>
      <div className="col--sm-10 tooltip tooltip--secondary">
        <input
          className="form__control"
          type={props.type || "text"}
          name={props.name}
          id={props.id}
          placeholder={props.placeholder}
          ref={props.register(props.reg_json)}
        />
        {props.errors[props.name] && props.errors[props.name].message}
      </div>
    </div>
  )
}

/**
 * Save button. Use with react-hook form. 
 * Pushed behavior is set in form tag. 
 */
export function SaveButton(props:{formState:any}){
    return(
        <button 
        type="submit"
        className="btn btn--primary"
        disabled={!props.formState.isValid}
        >
        保存
        </button>
    )
}

/**
 * Class year block of input form.
 */
export const ClassYearBlock = (props:{register:any, name:string}) => {
  let content = [<option id="signupYearDefault" value="default"> 期を選択</option>]
  for( var i = 94; i < 110; i++){
    content.push( <option id={"signupYear"+i} value={i}> {i}期 </option> )
  }
  return(
    <div className="form__group">
      <div className="col--sm-4">
        <label className="form__label">
           期を選択
        </label>
      </div>
      <div className="col--sm-8">
        <select
          className="form__control"
          name={props.name}
          ref={props.register({
            validate: (v:string) =>{
              return( !isNaN(parseInt(v)) || "入力必須項目です")
            }
          })}
        >
          {content}
        </select>
      </div>
    </div>
  )
}

export function LearnYearBlock(
    props:{errors:any, register:any, name:string}
  ){
  let content = [
    <option id={'learnYearDefault'} value='default'>
      学習年を選択
    </option>
  ]
  for( let i = 1; i <=6; i++){
    content.push(
      <option id={"learnYear" + i} value={i}>
        {i}年
      </option>
    )
  }
  return(
    <FormGroupContainer title="学習年">
        <select
          className="form__control"
          name={props.name}
          placeholder="学習年を選択"
          ref={props.register({
            validate: (v:string) => {
              return( !isNaN(parseInt(v))　|| "入力必須項目です" )
            }
          })}
        >
          {content}
        </select>
    </FormGroupContainer>
  )
} 

export function TermBlock(
    props:{errors:any, register:any, name:string}
  ){
  return(
    <FormGroupContainer title="学習期">
        <select
          className="form__control"
          name={props.name}
          placeholder="学習年を選択"
          ref={props.register({
            validate: (v:string) => {
              return( ["pre","post"].includes(v)　|| "入力必須項目です" )
            }
          })}
        >
          <option id={'learnTermDefault'} value='default'>
            学習期を選択
          </option>
          <option id={'learnTermPre'} value='pre'>
            前期
          </option>
          <option id={'learnTermPost'} value='post'>
            後期
          </option>
        </select>
    </FormGroupContainer>
  )
} 