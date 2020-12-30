import { Semester } from "../entity/Semester"
import arrow from '../img/arrow.svg'
import { Link } from 'react-router-dom'


export const SemesterToggleMenus = (props: {semesters: Semester[], menusAreShown: boolean[]}) => {
	const semesters = props.semesters.slice()
	const menusAreShown = props.menusAreShown.slice()
	const semesterToggles = semesters.map((semester, index) => <SemesterToggleMenu key={index} semester={semester} menuIsShown={menusAreShown[index]}/>)
	return (
		<div className="col--sm-12 col--md-3 col--xs-12 col--no-gutter">
			<ul>{semesterToggles}</ul>
		</div>
	)
}

const SemesterToggleMenu = (props: {semester: Semester, menuIsShown: boolean}) => {
	const subjects = props.semester.subjects.slice()
	const subjectButtons = subjects.map((subject, index) => {
		return (
			<li key={index}>
				<Link to={`/study/${subject.title_en}`}> {subject.title_ja} </Link>
			</li>
		)
	})
	const term: string = props.semester.learn_term === 'pre' ? '前期' : '後期'
	const semesterToggleTitle = props.semester.learn_year + '年' + term
	return (
		<div className="col--xs-6 col--sm-12">
			<div className="toggle-menu">
				<div className="toggle-menu__toggler">
					<img src={arrow} width={24} height={24}/>
					{semesterToggleTitle}
				</div>

				<div className="toggle-menu__content toggle-menu__content--shown">
					<ul className="">{subjectButtons}</ul>
				</div>
			</div>
		</div>
	)
}
