CREATE TABLE `users` (
  id
  name
  email
  password
  created
  updated
)

CREATE TABLE `playlists` (
  id
  hash
  created
  updated
)

CREATE TABLE `songs` (
  id
  title
  image
  url
  sourceId
  source
  userId
)

CREATE TABLE `playlistSongs` (
  playlistId
  songId
  userId
  created
)

CREATE TABLE `playlistUsers` (
  playlistId
  userId
  userRole
  created
)