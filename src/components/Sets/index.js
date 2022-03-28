import React, { Component } from 'react'
import { FlashcardArray } from "react-quizlet-flashcard";
import { Table, Input, Button } from 'antd';
import { withAuthorization } from '../Session';
import axios from 'axios'
import Draft from './draft'

class Sets extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.addNewCard = this.addNewCard.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.addDraftCard = this.addDraftCard.bind(this)

    this.state = {
      cardData: {},
      pageID: this.props.match.params.id,
      tempStringOne: '',
      tempStringTwo: '',
      cards: [],
      songText: [],
      songString: ''
    };
  }

  componentDidMount() {
    this._isMounted = true;

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
        if (this._isMounted) {
          this.setState({ cardData: response.data, cards: response.data.cards })
        }
        if (!this.state.cards.length) {
          //empty
          console.log('test')
        } else {
          //not empty

        }
      })
    //todo: Need to save this to db so its not called every time. Also need to implement translation with /getsong.
    // and only save that translation once to db, unless its updated.
    axios.get('http://localhost:4000/getSong', {
      crossdomain: true,
    })
      .then((response) => {
        console.log(response.data[0])

        let text = response.data[0].split('\n').map(str => <p>{str}</p>);
        console.log(text)

        this.setState({ songText: text, songString: response.data[0] })
      })
    //}
  }

  handleChange(e) {
    if (e.target.dataset.key === "firstBox") {
      this.setState({ tempStringOne: e.target.value })
    }
    if (e.target.dataset.key === "secondBox") {
      this.setState({ tempStringTwo: e.target.value })
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

  addNewCard() {
    console.log(this.state.cardData)
    let tempCard
    if (this.state.cards === undefined) {
      tempCard = {
        cards: [
          {
            id: 1,
            front: this.state.tempStringOne,
            back: this.state.tempStringTwo
          }
        ]
      }
    } else {
      tempCard = {
        cards: [
          ...this.state.cards,
          {
            id: this.state.cards.length + 1,
            front: this.state.tempStringOne,
            back: this.state.tempStringTwo
          }
        ]
      }
    }


    this.setState(tempCard)

    axios.post('http://localhost:4000/addNewCard', {
      headers: { "Access-Control-Allow-Origin": "*" },
      userUID: this.props.firebase.auth.currentUser.uid,
      firebaseId: this.state.pageID,
      cardData: tempCard
    })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });

  }

  addDraftCard(selectedText) {
    console.log(selectedText)
  }

  handleMouseUp() {
    console.log(`Selected text: ${window.getSelection().toString()}`);
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
        <Draft addCard={this.addDraftCard} song={this.state.songString} />


        <div style={{ marginLeft: '30%' }}>

        </div>


        <Table pagination={false} columns={columns} dataSource={this.state.cards} />

        <div style={{ marginLeft: "25%" }}>
          <label>Enter a new term:</label>
          <Input data-key="firstBox" style={{ width: "8%" }} type="text" onChange={this.handleChange} onKeyDown={this.handleKeyDown} />
          <Input data-key="secondBox" style={{ width: "8%" }} type="text" onChange={this.handleChange} onKeyDown={this.handleKeyDown} />
          <Button onClick={this.addNewCard} >Add new word</Button>
        </div>

      </div>
    )
  }
}
//<div onMouseUp={this.handleMouseUp}><p>{this.state.songText}</p></div>

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Sets);