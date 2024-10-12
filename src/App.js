import {Component} from 'react'

import Loader from 'react-loader-spinner'

import ProjectCard from './components/ProjectCard'

import './App.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

class App extends Component {
  state = {
    activeCategory: categoriesList[0].id,
    apiState: 'INITIAL',
    projectsList: [],
  }

  componentDidMount() {
    this.callAPI()
  }

  callAPI = async () => {
    this.setState({apiState: 'PROGRESS'})
    const {activeCategory} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${activeCategory}`
    const response = await fetch(url)
    const data = await response.json()
    if (response.ok === true) {
      const updated = data.projects.map(each => ({
        id: each.id,
        imageUrl: each.image_url,
        name: each.name,
      }))
      this.setState({apiState: 'SUCCESS', projectsList: updated})
    } else {
      this.setState({apiState: 'FAILURE'})
    }
  }

  changeCategory = event => {
    this.setState({activeCategory: event.target.value}, this.callAPI)
  }

  renderCorrectView = () => {
    const {apiState} = this.state
    switch (apiState) {
      case 'PROGRESS':
        return this.renderProgressView()
      case 'SUCCESS':
        return this.renderSuccessView()
      case 'FAILURE':
        return this.renderFailureView()
      default:
        return null
    }
  }

  renderProgressView = () => (
    <div data-testid="loader">
      <Loader type="TailSpin" color="#00BFFF" height={50} width={50} />
    </div>
  )

  renderSuccessView = () => {
    const {projectsList} = this.state
    return (
      <ul className="ul-container">
        {projectsList.map(each => (
          <li key={each.id}>
            <ProjectCard details={each} key={each.id} />
          </li>
        ))}
      </ul>
    )
  }

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" onClick={this.retryAgain}>
        Retry
      </button>
    </div>
  )

  retryAgain = () => {
    this.callAPI()
  }

  render() {
    const {activeCategory} = this.state

    return (
      <div>
        <div>
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
          />
        </div>
        <select onChange={this.changeCategory} value={activeCategory}>
          {categoriesList.map(each => (
            <option value={each.id} key={each.id}>
              {each.displayText}
            </option>
          ))}
        </select>
        {this.renderCorrectView()}
      </div>
    )
  }
}

export default App
