<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Users extends CI_Controller {

    public function index() {

        $data = $this->User_model->get(array('id >' => 0));

        echo json_encode($data);

    }

    public function create() {

        $decoded_user = json_decode(file_get_contents('php://input'), TRUE);

        $email = $decoded_user['email'];
        $password = md5($decoded_user['password']);
        
        $data = array(
            'email' => $email,
            'password' => $password,
            'permissions' => 0,
            'created' => date('Y-m-d H:i:s'),
            'updated' => date('Y-m-d H:i:s')
        );

        if ($this->User_model->create($data) && $this->User_model->auth($email, $password)) {

            echo json_encode(array('id' => $this->session->userdata('id'), 'email' => $email));

        } else {
            header('HTTP', TRUE, 400);
        }

    }

    public function get() {

        if ($this->User_model->is_authed()) {

            $id = $this->session->userdata('id');

            $data = $this->User_model->get(array('id' => $id));

            echo json_encode($data);

        } else {

            header('HTTP', TRUE, 401);
            echo '/get unauthorized';

        }

    }

    public function update() {

        if ($this->User_model->is_authed()) {

            $decoded_user = json_decode(file_get_contents('php://input'), TRUE);

            $email = $decoded_user['email'];
            $password = md5($decoded_user['password']);
            
            $data = array(
                'email' => $email,
                'password' => $password,
                'created' => date('Y-m-d H:i:s'),
                'updated' => date('Y-m-d H:i:s')
            );

            if ($this->User_model->update($data)) {
                // RETRUN SOMETHING HERE
            } else {
                header('HTTP', TRUE, 401);
            }

        } else {

            header('HTTP', TRUE, 501);
            echo '/update unauthorized';

        }

    }

    public function auth() {

        $decoded_user = json_decode(file_get_contents('php://input'), TRUE);

        $email = $decoded_user['email'];
        $password = md5($decoded_user['password']);

        if ($cookie = $this->User_model->auth($email, $password)) {

            echo json_encode($cookie);

        } else {

            header('HTTP', TRUE, 400);
            echo 'fail';

        }

    }

    public function unauth() {
        $this->session->unset_userdata('id');
        $this->session->unset_userdata('email');
        $this->session->unset_userdata('logged_in');
    }

}