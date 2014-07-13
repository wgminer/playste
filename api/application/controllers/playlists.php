<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Playlists extends CI_Controller {

    public function test() {
        $hash = $this->Playlist_model->generate_hash();

        echo(json_encode($hash));
    }

    public function create() {

        $current_time = date('Y-m-d H:i:s');

        // Create a new playlist 

        $hash = $this->Playlist_model->generate_hash();

        $new_playlist = array(
            'hash' => $hash,
            'created' => $current_time,
            'updated' => $current_time
        );

        $playlist_id = $this->CRUD_model->create('playlists', $new_playlist);

        // If the user is logged in associate the playlist with them

        if ($this->User_model->is_authed()) {

            $userId = $this->session->userdata('id');

            $association = array(
                'playlistId' => $playlist_id,
                'userId' => $userId,
                'userRole' => 'creator',
                'created' => $current_time
            );

            $this->CRUD_model->create('playlist_users', $association);

        } else {
            $userId = 0; // Anon user
        }

        // Create and associate the songs with new playlist

        $playlist_songs = json_decode(file_get_contents('php://input'), TRUE);

        $index = 0;

        foreach ($playlist_songs as $song) {

            $new_song = array(
                'title' => $song['title'],
                'image' => $song['image'],
                'url' => $song['url'],
                'source' => $song['source'],
                'sourceId' => $song['sourceId'],
                'userId' => $userId,
                'playlistId' => $playlist_id,
                'sortOrder' => $index,
                'created' => $current_time,
                'updated' => $current_time
            );

            $this->CRUD_model->create('songs', $new_song);

            $index++;

        }

        // Return the new hash
        echo $hash;

    }

    public function get($hash) {

        if ($data['info'] = $this->CRUD_model->get('playlists', array('hash' => $hash))) {
            $data['songs'] = $this->CRUD_model->get('songs', array('playlistId' => $data['info']->id));

            if ($associations = $this->CRUD_model->get('playlist_users', array('playlistId' => $data['info']->id))) {
                $data['info']->users = $associations;
            }

            echo json_encode($data);
        } else {
            header('HTTP', TRUE, 404);
        }

    }

    public function update($hash) {

        if ($this->User_model->is_authed()) {

            $playlist = $this->CRUD_model->get('playlists', array('hash' => $hash));
            $playlist_id = $playlist->id; 

            $current_time = date('Y-m-d H:i:s');

            // Update playlist 'updated' 

            $updated_playlist = array(
                'updated' => $current_time
            );

            $this->CRUD_model->update('playlists', array('id' => $playlist_id), $updated_playlist);

            // Create and associate the songs with new playlist

            $playlist = json_decode(file_get_contents('php://input'), TRUE);

            $index = 0;

            foreach ($playlist as $song) {

                // If it's a existing song
                if (isset($song['id'])) {

                    $updated_song = array(
                        'sortOrder' => $index,
                        'updated' => $current_time
                    );

                    $this->CRUD_model->update('songs', array('id' => $song['id']), $updated_song);

                } else {

                    $new_song = array(
                        'title' => $song['title'],
                        'image' => $song['image'],
                        'url' => $song['url'],
                        'source' => $song['source'],
                        'sourceId' => $song['sourceId'],
                        'userId' => $this->session->userdata('id'), // Stub
                        'playlistId' => $playlist_id,
                        'sortOrder' => $index,
                        'created' => $current_time,
                        'updated' => $current_time
                    );

                    $this->CRUD_model->create('songs', $new_song);

                }

                $index++;
                
            }

            echo $hash;

        } else {
            header('HTTP', TRUE, 401);
        }
    }

    public function delete($id) {

        if ($this->User_model->is_authed()) {

            $playlist = $this->Playlist_model->getPlaylists(array('playlists.id' => $id, 'users.name' =>$this->session->userdata('name')));

            if ($playlist->userRole == 'creator') {
                $this->CRUD_model->delete('playlists', array('id' => $id));
                $this->CRUD_model->delete('songs', array('playlistId' => $id));
                $this->CRUD_model->delete('playlist_users', array('playlistId' => $id));
            } else {
                header('HTTP', TRUE, 401);
            }
        } else {
            header('HTTP', TRUE, 401);
        }
    }

    public function purge() {

        // Iterate through all the playlists
        foreach ($playlists as $playlist) {

            // Get the songs for the playlist
            $songs = $this->CRUD_model->get('songs', array('playlistId' => $playlist['id']));

            // Iterate through each song in the playlist
            foreach ($songs as $song) {
                
                // If the playlist wasn't updated at the same time as the song
                if ($song['updated'] != $playlist['updated']) {

                    // DELETE IT!!!
                    $this->CRUD_model->delete('songs', $song['id']);
                } 
            }
        }
    }

}