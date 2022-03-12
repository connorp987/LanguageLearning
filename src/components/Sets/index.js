import React, { Component } from 'react'
import { useLocation, Link } from "react-router-dom";
import { FlashcardArray } from "react-quizlet-flashcard";
import { Table, Input, Button } from 'antd';
import { withAuthorization } from '../Session';
import axios from 'axios'

class Sets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardData: {},
      pageID: this.props.match.params.id
    };
  }

  componentDidMount() {
    axios.get('http://localhost:4000/getSet', {
      crossdomain: true,
      //headers: { "Access-Control-Allow-Origin": "*" },
      params: {
        userUID: this.props.firebase.auth.currentUser.uid,
        firebaseId: this.state.pageID
      }
    })
      .then((response) => {
        console.log(response.data)
        this.setState({ cardData: response.data })
      })
    //}
  }
  render() {

    return (
      <div>test</div>
    )
  }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Sets);

/*
<div style={{ marginLeft: '30%' }}>
        <FlashcardArray cards={cards} />
      </div>

      {cards[id - 1].front}
      <Table pagination={false} columns={columns} dataSource={cards} />

      <div style={{ marginLeft: "25%" }}>
        <label>Enter a new term:</label>
        <Input data-key="firstBox" style={{ width: "8%" }} type="text" onChange={handleChange} onKeyDown={handleKeyDown} />
        <Input data-key="secondBox" style={{ width: "8%" }} type="text" onChange={handleChange} onKeyDown={handleKeyDown} />
        <Button onClick={() => {
          setCards(cards => [...cards, {
            id: cards.length + 1,
            front: tempStringOne,
            back: tempStringTwo
          }])
        }
        } >Add new word</Button>
      </div>
*/