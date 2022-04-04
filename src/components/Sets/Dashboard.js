import { useState, useEffect } from "react"
import useAuth from "./useAuth"
import Player from "./Player"
import TrackSearchResult from "./TrackSearchResult"
import { Button, Container, Form, ListGroup } from "react-bootstrap"
import SpotifyWebApi from "spotify-web-api-node"
import axios from "axios"
import Draft from "./draft"

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

  function addPhrase(selectedText) {
    setSelectedPhrases([...selectedPhrases, selectedText])
    console.log(selectedText)
  }

  function remove(index) {
    const temp = [...selectedPhrases]
    temp.splice(index, 1)
    setSelectedPhrases(temp)
  }

  return (
    <Container className="d-flex flex-column" style={{ height: "100vh" }}>
      <Form.Control
        type="search"
        placeholder="Search Songs/Artists"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
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

      <ListGroup className="d-flex align-items-center flex-grow-1 m-4" as="ol" numbered>
        {selectedPhrases.map((text, i) => {
          return <ListGroup.Item
            as="li"
            className="d-flex justify-content-between align-items-start"
            style={{ width: '500px' }}
            key={text + i}
          >
            <div className="text-left">
              {text}
            </div>
            <Button onClick={()=>{
              remove(i)
            }}>Delete</Button>
          </ListGroup.Item>

        })}
      </ListGroup>
      <div>
        <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
      </div>
    </Container>
  )
}
