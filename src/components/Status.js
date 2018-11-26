import React from 'react'
import RefreshIcon from '@material-ui/icons/Refresh';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const OkOrBadIcon = ({ status }) => {
  const gStyle = {
    color: 'lightgreen'
  }
  const bStyle = {
    color: 'red'
  }
  return (status === 'OK') ? < SentimentSatisfiedIcon style={gStyle} /> :
    < SentimentVeryDissatisfiedIcon style={bStyle} />
}

const ServiceStatuses = ({ items }) => {
  const smallTableStyle = {
    width: '25%'
  }

  if (items === undefined || items.length === 0) {
    return null
  }
  if (!items[0].locations) {
    return (
      <Table style={smallTableStyle}>
        <TableBody>
          {items.map((item) =>
            <TableRow key={item.name}>
              <TableCell component="th" scope="row">
                {item.name}
              </TableCell>
              <TableCell component="th" scope="row">
                <OkOrBadIcon status={item.status} />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    )
  } else {
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            {items[0].locations.map((location) =>
              <TableCell key={location.name}>
                {location.name}
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) =>
            <TableRow key={item.name}>
              <TableCell>
                {item.name}
              </TableCell>
              {item.locations.map((location) =>
                <TableCell key={location.name}>
                  <OkOrBadIcon status={location.status} />
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    )
  }
}

const Status = ({ handleRefresh, serviceProvider, status }) => {
  // styles should be moved to css..
  const paperStyle = {
    paddingTop: '2%',
    paddingBottom: '2%',
    fontFamily: "Roboto, Helvetica, Arial, sans-serif"
  }
  const headerStyle = {
    color: 'chartreuse',
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'center',
    fontSize: '40px',
    fontWeight: 900
  }
  const updateStyle = {
    textAlign: 'center',
    paddingTop: '2vh'
  }
  const buttonStyle = {
    boxShadow: 'none',
    backgroundColor: 'white'
  }

  if (serviceProvider === null || status === null) {
    return null
  }
  const { lastUpdated, items } = status
  const updatedInfo = lastUpdated ? <span>
    Last updated at {new Date(lastUpdated).toLocaleTimeString()}.{' '}
  </span> : null;

  return (
    <div style={paperStyle}>
      <Paper >
        <div style={headerStyle}>
          {serviceProvider}
          <Button style={buttonStyle}
            variant="fab"
            mini={true}
            aria-label="Refresh"
            onClick={handleRefresh}>
            <RefreshIcon />
          </Button> </div>
        <div style={updateStyle}>{updatedInfo}</div>
        <ServiceStatuses items={items} />
      </Paper>
    </div>
  )
}

export default Status