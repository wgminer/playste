<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Favorites extends CI_Controller {

    public function index() {

        if ($this->User_model->is_authed()) {

            if (isset($_GET['order'])) {
                
                $order = $_GET['order'];

            } else {

                $order = 'DESC';

            }

            if (isset($_GET['offset'])) {
                
                $offset = $_GET['offset'];

            } else {

                $offset = 0;

            }

            $user_id = $this->session->userdata('id');

            if ($data = $this->Favorite_model->get($user_id, $offset, $order)) {

                echo json_encode($data);

            } else {
                header('HTTP', TRUE, 404);
            }

        } else {
            header('HTTP', TRUE, 401);
        }

    }

    public function create() {

        if ($this->User_model->is_authed()) {

            $decoded_channel = json_decode(file_get_contents('php://input'), TRUE);

            $trak_id = $decoded_channel['trak_id'];
            $user_id = $this->session->userdata('id');

            $data = array(
                'trak_id' => $trak_id,
                'user_id' => $user_id,
                'created' => date('Y-m-d H:i:s'),
            );

            if ($id = $this->Favorite_model->create($data)) {
                echo json_encode($id);
            } else {
                header('HTTP', TRUE, 404);
            }

        } else {
            header('HTTP', TRUE, 401);
        }

    }

    public function delete($trak_id) {

        if ($this->User_model->is_authed()) {

            $user_id = $this->session->userdata('id');

            if ($this->Favorite_model->delete(array('user_id' => $user_id, 'trak_id' => $trak_id))) {
                echo json_encode('removed');
            } else {
                header('HTTP', TRUE, 404);
            }

        } else {
            header('HTTP', TRUE, 401);
        }

    }

}