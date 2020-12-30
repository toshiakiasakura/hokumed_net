import { Subject } from '../../entity/Subject'
import { Semester } from '../../entity/Semester'
import { SubjectRouter } from './study-subject.component'
import { SemesterToggleMenus } from './study-semesters.component'

import { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
// import { SemesterService } from '../services/semester.services'

// Mock
const mockEnTitles = ['introduction_to_medicine', 'anatomy_histology', 'histology_laboratory', 'medical_english_practice']
const mockSubjects: Subject[] = mockEnTitles.map((title, index) => {
	return { id: index, title_ja: title + "だよ", title_en: title, created_at: new Date(), updated_at: new Date() }
})

const mockLearnYears = [1, 2, 3, 4, 5]
const mockSemesters: Semester[] = mockLearnYears.flatMap((year, index) => {
	const prepos: Semester[] = [
		{ id: index, class_year_id: 98, learn_year: year, learn_term: 'pre', created_at: new Date(), updated_at: new Date(), subjects: mockSubjects },
		{ id: index, class_year_id: 98, learn_year: year, learn_term: 'post', created_at: new Date(), updated_at: new Date(), subjects: mockSubjects },
	]
	return prepos
})

export class Study extends Component<{},{semesters: Semester[] | undefined, status: number | undefined, menusAreShown: boolean[] | undefined}> {
	constructor(props: any) {
		super(props)
		this.state = {
			semesters: undefined,
			status: undefined,
			menusAreShown: undefined
		}
	}

	componentDidMount() {
		// TODO: Create Backend API
		// SemesterService.getSemesters()
		// .then ( res => {
		// 	this.setState({
		// 		semesters: res.data.semesters,
		// 		status: res.data.status
		// 	})
		// })
		// .catch(err => console.log(err))

		// Using Mock
		this.setState({
			semesters: mockSemesters,
			status: 200,
			menusAreShown: Array(mockSemesters.length).fill(false)
		})
		console.log("Comp Did Mount")
	}

	render() {
		const semesters = this.state.semesters
		const status = this.state.status
		const menusAreShown = this.state.menusAreShown?.slice()

		if (semesters === undefined || status === undefined || menusAreShown === undefined) {
			return( <div> 読み込み中 </div> )
		} else if (status === 404 || status === 401) {
			return <Redirect to='/error' />
		} else {
			return (
				<div className="topfix">
					<div className="v-spacer">
						<div className="row">
							<div className="col--sm-12 col--md-9 col--xs-12 pull-right">
								<Switch>
									<Route exact path='/study' component={SearchSubject}/>
									<Route path='/study/:id' component={SubjectRouter}/>
								</Switch>
							</div>
							<SemesterToggleMenus semesters={semesters} menusAreShown={menusAreShown}/>
						</div>
					</div>
				</div>
			)
		}	
 	}
}

const SearchSubject = () => {
	return (
		// TODO: Make Search Page
		<div>Top</div>
	)
}
