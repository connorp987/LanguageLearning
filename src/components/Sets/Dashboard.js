import { useState, useEffect } from "react"
import useAuth from "./useAuth"
import Player from "./Player"
import TrackSearchResult from "./TrackSearchResult"
import { Container, Row, Form, ListGroup } from "react-bootstrap"
import SpotifyWebApi from "spotify-web-api-node"
import axios from "axios"
import Draft from "./draft"
import { Steps, Button, message, Table, Input, Popconfirm, Space } from 'antd';
import { FlashcardArray } from "react-quizlet-flashcard";
import { Opencontainersinitiative } from "styled-icons/simple-icons"
import firebase from 'firebase/compat/app'

const { Step } = Steps;


const spotifyApi = new SpotifyWebApi({
  clientId: "cb541a417f8b4516990ae7f2aa994ec0",
})

export default function Dashboard({ code }, props) {
  const accessToken = useAuth(code)
  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [playingTrack, setPlayingTrack] = useState()
  const [lyrics, setLyrics] = useState("")
  const [selectedPhrases, setSelectedPhrases] = useState([])
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true)
  const [translatedText, setTranslatedText] = useState([])
  const [data, setData] = useState([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const columns = [
    {
      title: 'Original Text',
      dataIndex: 'front',
      key: 'front',
      render: text => <a>{text}</a>,
    },
    {
      title: 'Translated Text',
      dataIndex: 'back',
      key: 'back',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        data.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => remove(record.key)}>
            <a>Delete</a>
          </Popconfirm>
        ) : null
      ),
    },
  ];


  const steps = [
    {
      title: 'first'
    },
    {
      title: 'second'
    },
    {
      title: 'last'
    },
  ];

  function handleDelete(key) {
    const dataSource = [...data];
    setData(dataSource.filter((item) => item.key !== key))
  };

  function chooseTrack(track) {
    setPlayingTrack(track)
    setSearch("")
    setLyrics("")
  }

  useEffect(() => {
    if (!playingTrack) return

    axios
      .get("http://localhost:4000/lyrics", {
        params: {
          track: playingTrack.title,
          artist: playingTrack.artist,
        },
      })
      .then(res => {
        setLyrics(res.data.lyrics)
      })
  }, [playingTrack])

  useEffect(() => {
    if (!accessToken) return
    spotifyApi.setAccessToken(accessToken)
  }, [accessToken])

  useEffect(() => {
    if (!search) return setSearchResults([])
    if (!accessToken) return

    let cancel = false
    spotifyApi.searchTracks(search).then(res => {
      if (cancel) return
      setSearchResults(
        res.body.tracks.items.map(track => {
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => {
              if (image.height < smallest.height) return image
              return smallest
            },
            track.album.images[0]
          )

          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url,
          }
        })
      )
    })

    return () => (cancel = true)
  }, [search, accessToken])

  useEffect(() => {
    if (current !== 1) return
    if (selectedPhrases.length === 0) return
    axios
      .get("http://localhost:4000/getTranslation", {
        params: {
          text: selectedPhrases,
          target: 'en',
        },
      })
      .then(res => {
        setTranslatedText(res.data)
        setLoading(false)
      })
  }, [current])

  useEffect(() => {
    if (!loading) return
    translatedText.map((temp, i) => {
      setData((datasData) => [...datasData, {
        key: `'${i}'`,
        front: selectedPhrases[i],
        back: temp
      }])
    })
  }, [translatedText])

  function addPhrase(selectedText) {
    setSelectedPhrases([...selectedPhrases, selectedText])
    setLoading(true)
    setData([])
    console.log(selectedText)
  }

  function remove(index) {
    const dataSource = [...data];
    setData(dataSource.filter((item) => item.key !== index))
    const temp = [...selectedPhrases]
    temp.splice(index, 1)
    setSelectedPhrases(temp)
  }



  const next = () => {
    setCurrent(current + 1);
  }

  const prev = () => {
    setCurrent(current - 1);
  }

  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  function onCreate () {
    axios.post('http://localhost:4000/createNewSet', {
      headers: { "Access-Control-Allow-Origin": "*" },
      userUID: firebase.auth().currentUser.uid,
      title: title,
      description, description
    })
      .then(function (response) {
        console.log(response);
        props.history.push("/")
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  //todo: add a step 2. This step should actually translate selected cards from step one. Can add loading while translation service is running.
  return (
    <>
      <Steps style={{ width: '90%', marginLeft: '5%', marginRight: '5%' }} current={current} onChange={(current) => { setCurrent(current) }}>
        <Step title="Choose a Song" description="Search a song and add cards to be translated." />
        <Step title="View Translations" description="View and delete translations." />
        <Step title="Finalize" description="Create the title and description." />
      </Steps>
      <Container className="d-flex flex-column" style={{ height: "80vh" }}>
        {
          steps[current].title === "first" && (
            <Row className="d-flex m-4">
              <Form.Control
                type="search"
                placeholder="Search Songs/Artists"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <div className="flex-grow-1 my-2">
                {searchResults.map(track => (
                  <TrackSearchResult
                    track={track}
                    key={track.uri}
                    chooseTrack={chooseTrack}
                  />
                ))}
                {searchResults.length === 0 && (
                  <div className="text-center" style={{ whiteSpace: "pre" }}>
                    <Draft addPhrase={addPhrase} playingTrack={playingTrack} song={lyrics} />
                  </div>
                )}
              </div>

              <ListGroup className="m-4" as="ol" numbered>
                {selectedPhrases.map((text, i) => {
                  return <ListGroup.Item
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                    key={text + i}
                  >
                    <div className="ms-2 me-auto">
                      {text}
                    </div>
                    <Button onClick={() => {
                      remove(i)
                    }}>Delete</Button>
                  </ListGroup.Item>

                })}
              </ListGroup>
            </Row>
          )}

        {
          steps[current].title === "second" && (
            (loading) ? (<h1 className="m-4">Please select one or more phrases before coming to this step.</h1>) : (
              <Row>
                <Table columns={columns} dataSource={data} />
              </Row>)
          )
        }

        {
          //todo: step 3 will be finalize step. Should be very similar to create. Choose a title and description.
          steps[current].title === "last" && (
            (data.length === 0 ? (<h1 className="m-4">Please go to translate phase before coming to this step.</h1>) : (
              <Row>
                <Form>
                  <Form.Control
                    type="search"
                    placeholder="Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                  />
                  <Form.Control
                    type="search"
                    placeholder="Description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                  <Button onClick={()=>{onCreate()}}>Submit</Button>
                </Form>

              </Row>

            )))
        }
        <Row>
          <div className="steps-action">
            {current < steps.length - 1 && (
              <Button type="primary" onClick={() => next()}>
                Next
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button type="primary" onClick={() => message.success('Processing complete!')}>
                Done
              </Button>
            )}
            {current > 0 && (
              <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                Previous
              </Button>
            )}
          </div>
        </Row>
        <Row className="flex-d m-4">
          <div>
            <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
          </div>
        </Row>
      </Container>
    </>
  )
}
