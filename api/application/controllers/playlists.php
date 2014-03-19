<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Playlists extends CI_Controller {

    public function index() {

        print 'Hello World';
    }

    public function test() {
        $hash = $this->Playlist_model->generate_hash();

        echo(json_encode($hash));
    }

    public function create() {

        // Create a new playlist 

        $hash = $this->Playlist_model->generate_hash();

        $new_playlist = array(
            'hash' => $hash,
            'created' => date('Y-m-d H:i:s'),
            'updated' => date('Y-m-d H:i:s')
        );

        $playlist_id = $this->CRUD_model->create('playlists', $new_playlist);

        // Create and associate the songs with new playlist

        $playlist = json_decode(file_get_contents('php://input'), TRUE);

        foreach ($playlist as $song) {

            $new_song = array(
                'title' => $song['title'],
                'image' => $song['image'],
                'url' => $song['url'],
                'source' => $song['source'],
                'sourceId' => $song['sourceId'],
                'userId' => 1, // Stub
                'playlistId' => $playlist_id,
                'created' => date('Y-m-d H:i:s')
            );

            $this->CRUD_model->create('songs', $new_song);
        }

        echo $hash;

    }

    public function get($hash) {

        $data['playlist'] = $this->CRUD_model->read('playlists', array('hash' => $hash));
        $data['songs'] = $this->CRUD_model->read('songs', array('playlistId' => $data['playlist']->id));

        echo json_encode($data);

    }

    public function update($id) {
        if ($this->User_model->is_admin()) {

            $playlist = $this->CRUD_model->read(array('id' => $id));

            $title = $this->input->post('title');
            $cover_id = $this->input->post('cover_id');

            $data = array(
                'title' => $title,
                'slug' => url_title($title, '-', TRUE),
                'cover_id' => $cover_id,
                'updated' => date('Y-m-d H:i:s')
            );

            if ($this->CRUD_model->update($id, $data)) {
                redirect('admin/playlist/'.$playlist->id);
            }

        }
    }

    public function delete($id) {

        if ($this->User_model->is_admin()) {

            if ($this->CRUD_model->delete($id)) {
                redirect('dashboard', 'refresh');
            }

        }
    }

}