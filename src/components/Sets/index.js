import React, {useState} from 'react'
import { FlashcardArray } from "react-quizlet-flashcard";
import { Table, Input } from 'antd';

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


export default function Sets({ match }) {
  const id = match.params.id;
  const [tempStringOne, setTempStringOne] = useState('')
  const [tempStringTwo, setTempStringTwo] = useState('')
  const [cards, setCards] = useState([{
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
  }])

  function handleKeyDown(e) {
    if (e.key === 'Tab') {
      if (e.target.dataset.key == "firstBox") {
        setTempStringOne(e.target.value)
      }
      if (e.target.dataset.key == "secondBox") {
        setTempStringTwo(e.target.value)
      }
      console.log(tempStringOne, tempStringTwo)
      if (tempStringOne != '' && tempStringTwo != '') {
        setCards(cards => [...cards, {
          id: cards.length+1,
          front: tempStringOne,
          back: tempStringTwo
        }]);
        
      }
      
      console.log('do validate',cards);
      console.log(e.target.value);
    }
  }

  return (
    <div>
      <div style={{ marginLeft: '30%' }}>
        <FlashcardArray cards={cards} />
      </div>

      {cards[id - 1].front}
      <Table pagination={false} columns={columns} dataSource={cards} />

      <div style={{marginLeft: "25%"}}>
        <label>Enter a new term:</label>
        <Input data-key="firstBox" style={{ width: "8%" }} type="text" onKeyDown={handleKeyDown} />
        <Input data-key="secondBox" style={{ width: "8%" }} type="text" onKeyDown={handleKeyDown} />
      </div>

    </div>
  )
}