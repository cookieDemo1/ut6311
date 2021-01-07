import {h} from 'preact'
const Loading = (props) => {
  return (
      <div className="loading-mask">
        <div className="loading-spinner">
          <svg viewBox="25 25 50 50" className="circular">
            <circle cx="50" cy="50" r="20" fill="none" className="path" />
          </svg>
        </div>
      </div>
  )
}

export default Loading