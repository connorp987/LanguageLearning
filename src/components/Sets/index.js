import React from 'react'
import { FlashcardArray } from "react-quizlet-flashcard";

export default function Sets({match}) {
    const id = match.params.id;
    const cards = [
        {
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
        },
      ];

    return (
        <div>
            <FlashcardArray cards={cards} />
            {cards[id-1].front}
        </div>
    )
}