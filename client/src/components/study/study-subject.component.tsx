import { Component } from 'react'
import { Switch, Link, Route } from 'react-router-dom'
import { Document_File } from '../../entity/Document_File'

export class SubjectRouter extends Component<{match:{params:{id:number}}}, {documents: Document_File | undefined, status: number | undefined}> {
	constructor(props: any) {
		super(props)
		this.state = {
			documents: undefined,
			status: undefined
		}
	}

	componentDidMount() {
		/** TODO: Create Backend API to Get Documents Related to Subject enTitle(this.props.match.params.id)
		this.setState(
			state: {
				
			}
		)
		*/ 
	}

	render() {
		if (this.state.documents === undefined || this.state.status === undefined)

		return (
			<div>
				SenntakubotannTshukuru
				<h1 className="caption">{this.props.match.params.id}</h1>
				<Switch>
					<Route path='/study/:id/exam' component={() => <SubjectExam />} />
					<Route path='/study/:id/quiz' component={SubjectQuiz} />
					<Route path='/study/:id/summery' component={SubjectSummary} />
					<Route path='/study/:id/personal' component={SubjectPersonal} />
				</Switch>
			</div>
		)
	}	
}

const SubjectExam = () => {
	return (
		// TODO: Make Exam Page
		<div>Exam</div>
	)
}

const SubjectQuiz = (documents: Document_File[]) => {
	return (
		// TODO: Make Quiz Page
		<div>Quiz</div>
	)
}

const SubjectSummary = (documents: Document_File[]) => {
	return (
		// TODO: Make Summary Page
		<div>Summery</div>
	)
}

const SubjectPersonal = (documents: Document_File[]) => {
	return (
		// TODO: Make Personal Page
		<div>Personal</div>
	)
}