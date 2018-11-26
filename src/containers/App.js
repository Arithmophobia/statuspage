import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchStatusIfNeeded, expireStatus } from '../actions'
import Status from '../components/Status'

class App extends Component {
  constructor(props) {
    super(props)
    this.handleRefreshClick = this.handleRefreshClick.bind(this)
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchStatusIfNeeded('Azure'))
    dispatch(fetchStatusIfNeeded('DataDog'))
    this.interval = setInterval(() => {
      dispatch(expireStatus('Azure'))
      dispatch(expireStatus('DataDog'))
      dispatch(fetchStatusIfNeeded('Azure'))
      dispatch(fetchStatusIfNeeded('DataDog'))
    }, 600000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleRefreshClick(serviceProvider, event) {
    event.preventDefault()
    const { dispatch } = this.props
    dispatch(expireStatus(serviceProvider))
    dispatch(fetchStatusIfNeeded(serviceProvider))
  }

  render() {
    const { statuses } = this.props
    const serviceProviders = Object.keys(statuses)
    const statusList = serviceProviders.map((key) =>
      <Status key={key}
        handleRefresh={this.handleRefreshClick.bind(this, key)}
        serviceProvider={key}
        status={statuses[key]} />)

    return (
      <div>
        <div>{statusList}</div>
      </div>
    )
  }
}

App.propTypes = {
  statuses: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
  const { statusesByServiceProvider: statuses } = state
  return {
    statuses,
  }
}

export default connect(mapStateToProps)(App)