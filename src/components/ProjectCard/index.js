import './index.css'

const ProjectCard = props => {
  const {details} = props
  const {imageUrl, name} = details
  return (
    <div className="card">
      <img src={imageUrl} alt={name} className="image" />
      <p>{name}</p>
    </div>
  )
}

export default ProjectCard
