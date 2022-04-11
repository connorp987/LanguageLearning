import { useState, useEffect } from "react"
import useAuth from "./useAuth"
import Player from "./Player"
import TrackSearchResult from "./TrackSearchResult"
import { Container, Row, Form, ListGroup } from "react-bootstrap"
import SpotifyWebApi from "spotify-web-api-node"
import axios from "axios"
import Draft from "./draft"
import { Steps, Button, message, Table, Input, Popconfirm, Space } from 'antd';
import { TempCold } from "styled-icons/remix-fill"

const { Step } = Steps;


const spotifyApi = new SpotifyWebApi({
  clientId: "cb541a417f8b4516990ae7f2aa994ec0",
})

export default function Dashboard({ code }) {
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

  const columns = [
    {
      title: 'Original Text',
      dataIndex: 'original',
      key: 'original',
      render: text => <a>{text}</a>,
    },
    {
      title: 'Translated Text',
      dataIndex: 'translated',
      key: 'translated',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        data.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
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

  useEffect(()=> {
    if (current !== 1) return
    axios
      .get("http://localhost:4000/getTranslation", {
        params: {
          text: selectedPhrases,
          target: 'en',
        },
      })
      .then(res => {
        console.log(res)
        setTranslatedText(res.data)
        setLoading(false)
      })
  }, [current])

  useEffect(()=> {
    translatedText.map((temp, i) => {
      console.log(temp, selectedPhrases[i])
      setData((datasData) => [...datasData, {
        key: `'${i}'`,
        original: selectedPhrases[i],
        translated: temp
      }])
    })
  }, [translatedText])

  function addPhrase(selectedText) {
    setSelectedPhrases([...selectedPhrases, selectedText])
    console.log(selectedText)
  }

  function remove(index) {
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

  //todo: add a step 2. This step should actually translate selected cards from step one. Can add loading while translation service is running.
  return (
    <>
      <Steps style={{ width: '90%', marginLeft: '5%', marginRight: '5%' }} current={current} onChange={(current) => { setCurrent(current) }}>
        <Step title="Choose a Song" description="Search a song and add cards to be translated." />
        <Step title="Step 2" description="This is a description." />
        <Step title="Step 3" description="This is a description." />
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
            (loading) ? (<div>loading</div>) : (
            <Row>
              <Table columns={columns} dataSource={data} />
            </Row>)
            
          )}

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
