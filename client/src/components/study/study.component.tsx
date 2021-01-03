import { Route, Switch, Link, Redirect} from 'react-router-dom'
import { NotFound } from '../404.component'
import Cookies from 'universal-cookie'

import { StudyToggleMenus } from './study-toggle.component'

function StudyTop(){
  return(
    <div>
      <h1> 資料トップ </h1>
      <p>
        左のメニューから教科を選んでください．
      </p>
    </div>
  )
}

function Study(){
  console.log("Try to access study page.  ")
  return(
    <div className="topfix container v-spacer row">
      <StudyToggleMenus /> 
      <div className="col--sm-12 col--md-9 col--xs-12 pull-right">
        <Switch>
          <Route exact path='/study' component={StudyTop} />
        </Switch>
      </div>
    </div>
  )
}
export { Study }
