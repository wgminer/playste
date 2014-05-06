<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class PlaylistUsers extends CI_Controller {

    public function add($playlistId) {

    }

    public function get($userId) {

        $playlists = $this->Playlist_model->getPlaylists(array('userId' => $userId));

        // $array = [];

        // foreach ($userPlaylists as $userPlaylist) {
        // 	array_push($array, $userPlaylist->playlistId);
        // }

        // $playlists = $this->CRUD_model->getArray('playlists', 'id', $array);


        echo json_encode($playlists);

    }



    public function remove($playlistId) {


    }



}