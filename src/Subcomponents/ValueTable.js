import React, { Component } from 'react';
import {Row, Col, Button, Container, Table} from 'react-bootstrap';

class ValueTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentValues: props.currentValues,
      expectedValues: props.expectedValues
    };
  }

  updateValues = () => {
    this.props.sendMostRecentMessage();
    console.log('Update Values button pressed!');

    this.setState({
      currentValues: {...this.state.currentValues},
      expectedValues: {...this.state.expectedValues}
    });
  }

  render() {
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
                {Object.keys(this.state.currentValues).map(key => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{this.state.currentValues[key]}</td>
                    <td>{this.state.expectedValues[key]}</td>
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