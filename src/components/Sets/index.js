import React, { Component } from 'react'
import { FlashcardArray } from "react-quizlet-flashcard";
import { Table, Input, Button } from 'antd';
import { withAuthorization } from '../Session';
import axios from 'axios'

class Sets extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)

    this.state = {
      cardData: {},
      pageID: this.props.match.params.id,
      tempStringOne: '',
      tempStringTwo: '',
      cards: [{
        id: 1,
        front: "What is the capital of <u>Alaska</u>?",
        back: "Juneau",
        frontChild: <div>Hello there</div>,
        backChild: <p>This is a back child</p>
      },
      {
        id: 2,
        front: "What is the capital of California?",
        back: "Sacramento",
      },
      {
        id: 3,
        front: "What is the capital of New York?",
        back: "Albany",
      },
      {
        id: 4,
        front: "What is the capital of Florida?",
        back: "Tallahassee",
      },
      {
        id: 5,
        front: "What is the capital of Texas?",
        back: "Austin",
      },
      {
        id: 6,
        front: "What is the capital of New Mexico?",
        back: "Santa Fe",
      },
      {
        id: 7,
        front: "What is the capital of Arizona?",
        back: "Phoenix",
      }]
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

  handleChange(e) {
    if (e.target.dataset.key === "firstBox") {
      this.setState({tempStringOne: e.target.value})
    }
    if (e.target.dataset.key === "secondBox") {
      this.setState({tempStringTwo: e.target.value})
    }
  }

  handleKeyDown(e) {
    if (e.key === 'Tab') {
      if (e.target.dataset.key === "firstBox") {
        this.setState({ tempStringOne: e.target.value })
      }
      if (e.target.dataset.key === "secondBox") {
        this.setState({ tempStringTwo: e.target.value })
      }
      if (this.state.tempStringOne !== '' && this.state.tempStringTwo !== '') {

        this.setState(cards => {
          return {
            cards: [
              ...this.state.cards,
              {
                id: cards.length + 1,
                front: this.state.tempStringOne,
                back: this.state.tempStringTwo
              }
            ]
          }
        })

      }

      //console.log('do validate', this.state.cards);
      //console.log(e.target.value);
    }
  }
  render() {

    const columns = [
      {
        title: 'Front',
        dataIndex: 'front',
        key: 'front',
        //render: text => <a>{text}</a>,
      },
      {
        title: 'Back',
        dataIndex: 'back',
        key: 'back',
      }
    ];
    return (
      <div>
        <div style={{ marginLeft: '30%' }}>
          <FlashcardArray cards={this.state.cards} />
        </div>

        
        <Table pagination={false} columns={columns} dataSource={this.state.cards} />

        <div style={{ marginLeft: "25%" }}>
          <label>Enter a new term:</label>
          <Input data-key="firstBox" style={{ width: "8%" }} type="text" onChange={this.handleChange} onKeyDown={this.handleKeyDown} />
          <Input data-key="secondBox" style={{ width: "8%" }} type="text" onChange={this.handleChange} onKeyDown={this.handleKeyDown} />
          <Button onClick={() => {
            this.setState(cards => {
              return {
                cards: [
                  ...this.state.cards,
                  {
                    id: cards.length + 1,
                    front: this.state.tempStringOne,
                    back: this.state.tempStringTwo
                  }
                ]
              }
            })
          }
          } >Add new word</Button>
        </div>

      </div>
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