<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Users extends CI_Controller {

    public function create() {

        $decoded_user = json_decode(file_get_contents('php://input'), TRUE);

        $name = $decoded_user['name'];
        $email = $decoded_user['email'];
        $password = md5($decoded_user['password']);
        $time = date('Y-m-d H:i:s');
        
        $data = array(
            'name' => $name,
            'email' => $email,
            'password' => $password,
            'created' => $time,
            'updated' => $time
        );

        if ($this->CRUD_model->create('users', $data)) {

            $this->User_model->auth($email, $password);

            echo json_encode(array('id' => $this->session->userdata('id'), 'email' => $email));

        } else {
            header('HTTP', TRUE, 400);
        }

    }

    public function get() {

        if ($this->User_model->is_authed()) {

            $id = $this->session->userdata('id');

            $data = $this->CRUD_model->get('users', array('id' => $id));

            echo json_encode($data);

        } else {

            // Unauthorized
            header('HTTP', TRUE, 401);

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

            if ($this->CRUD_model->update('users', $data)) {
                // RETRUN SOMETHING HERE
            } else {
                header('HTTP', TRUE, 401);
            }

        } else {

            // Unauthorized
            header('HTTP', TRUE, 401);

        }

    }

    public function auth() {

        $decoded_user = json_decode(file_get_contents('php://input'), TRUE);

        $name = $decoded_user['name'];
        $password = md5($decoded_user['password']);

        if ($cookie = $this->User_model->auth($name, $password)) {

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