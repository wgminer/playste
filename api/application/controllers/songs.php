<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Songs extends CI_Controller {

    public function index() {

        $songs = $this->CRUD_model->get('songs', array('id <' => '100'));

        echo json_encode($songs);

    }

    public function get($hash) {

        $data['info'] = $this->CRUD_model->get('playlists', array('hash' => $hash));
        $data['songs'] = $this->CRUD_model->get('songs', array('playlistId' => $data['info']->id));

        echo json_encode($data);

    }


}