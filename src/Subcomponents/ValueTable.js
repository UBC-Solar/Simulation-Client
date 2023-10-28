import React, { Component } from 'react';
import { Row, Col, Button, Container, Table } from 'react-bootstrap';

class ValueTable extends Component {
  
  updateValues = () => {
    this.props.sendMostRecentMessage();
    console.log('Update Values button pressed!');
  }

  render() {
    const { currentValues, expectedValues } = this.props;

    return (
      <Container>
        <Row>
          <Col>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Value</th>
                  <th>Current</th>
                  <th>Expected</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(currentValues).map(key => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{Math.round(currentValues[key] * 1000) / 1000}</td> {/* Round to 4 decimal places */}
                    <td>{expectedValues[key]}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button onClick={this.updateValues}>Update Values</Button>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default ValueTable;