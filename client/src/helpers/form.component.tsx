
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