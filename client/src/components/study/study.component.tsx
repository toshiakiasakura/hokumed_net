import { Route, Switch, Link, Redirect} from 'react-router-dom'
import Cookies from 'universal-cookie'

import { StudyToggleMenus } from './study-toggle.component'
import { StudySubjectBoard } from './study-subject.component'
import { StudyNew } from './study-new.component'

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
  return(
    <div className="topfix container v-spacer row">
      <StudyToggleMenus /> 
      <div className="col--sm-12 col--md-9 col--xs-12 pull-right">
        <Switch>
          <Route exact path='/study' component={StudyTop} />
          <Route 
            path='/study/:title_en/:kind/new' 
            component={ StudySubjectBoard } 
          />
          <Route 
            path='/study/:title_en/:kind' 
            component={ StudySubjectBoard } 
          />
        </Switch>
      </div>
    </div>
  )
}
export { Study }
