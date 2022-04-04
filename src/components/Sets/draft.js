import React, { useEffect, useState } from "react";

import { FormatBold } from "@styled-icons/material/FormatBold";
import { FormatItalic } from "@styled-icons/material/FormatItalic";
import { FormatUnderlined } from "@styled-icons/material/FormatUnderlined";
import { Link } from 'react-router-dom'

import {
  Editor,
  EditorState,
  getVisibleSelectionRect,
  RichUtils,
  ContentState
} from "draft-js";

import { useToggleLayer } from "react-laag";

function Style({ Icon, selected, onClick, style }) {
  return (
    <div
      onClick={onClick}
      style={{
        cursor: "pointer",
        padding: 4,
        backgroundColor: selected ? "rgba(255,255,255, 0.15)" : "transparent",
        borderRadius: 2,
        ...style
      }}
    >
      Add a Card
    </div>
  );
}

export default function Draft(props) {
  const [editorState, setEditorState] = React.useState(
    EditorState.createWithContent(
      ContentState.createFromText(props.song)
    )
  );

  const editor = React.useRef(null);

  const [element, toggleLayerProps] = useToggleLayer(
    ({ isOpen, layerProps }) =>
      isOpen && (
        <div
          ref={layerProps.ref}
          style={{
            ...layerProps.style,
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            borderRadius: 4,
            color: "white",
            display: "flex",
            padding: 4
          }}
          onMouseDown={evt => evt.preventDefault()}
        >
          <Style
            Icon={FormatUnderlined}
            style={{ marginLeft: 2 }}
            onClick={() => {
              props.addPhrase(getCurrentTextSelection(editorState))
            }}
            selected={editorState.getCurrentInlineStyle().has("UNDERLINE")}
          />
        </div>
      ),
    { placement: { triggerOffset: 4 } }
  );

  const getCurrentTextSelection = editorState => {
    const selectionState = editorState.getSelection();
    const anchorKey = selectionState.getAnchorKey();
    const currentContent = editorState.getCurrentContent();
    const currentContentBlock = currentContent.getBlockForKey(anchorKey);
    const start = selectionState.getStartOffset();
    const end = selectionState.getEndOffset();
    const selectedText = currentContentBlock.getText().slice(start, end);

    return selectedText;
  };

  function focusEditor() {
    editor.current.focus();
  }

  React.useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      focusEditor();
    }

    return () => { isMounted = false };
  }, []);

  React.useEffect(() => {
    //console.log(props.song)
    setEditorState(EditorState.createWithContent(
      ContentState.createFromText(props.song)
    ))

  }, [props.song])

  React.useEffect(() => {
    const isCollapsed = editorState.getSelection().isCollapsed();

    if (!editorState.getSelection().getHasFocus()) {
      toggleLayerProps.close();
      return;
    }

    if (isCollapsed) {
      toggleLayerProps.close();
    } else {
      toggleLayerProps.open({
        clientRect: () => getVisibleSelectionRect(window),
        target: document.body
      });
    }
  }, [
    editorState.getSelection().isCollapsed(),
    editorState.getSelection().getHasFocus()
  ]);

  return (
    <>
      <h1 style={{ margin: "auto", maxWidth: 500 }}>
        {props.playingTrack ? props.playingTrack.title : null}
      </h1>
      <div
        onClick={focusEditor}
        style={{
          maxWidth: 500,
          margin: "16px auto",
          minHeight: 300,
          backgroundColor: "white",
          padding: 12
        }}
      >
        {element}
        <Editor
          ref={editor}
          editorState={editorState}
          onChange={editorState => setEditorState(editorState)}
          handleKeyCommand={(command, editorState) => {
            const newState = RichUtils.handleKeyCommand(editorState, command);
            if (newState) {
              setEditorState(newState);
              return "handled";
            }
            return "not-handled";
          }}
        />

      </div>
    </>
  );
}
