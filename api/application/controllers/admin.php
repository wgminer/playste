<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Admin extends CI_Controller {

    public function index() {

        $data['title'] = 'Channeltrak';

        if ($this->User_model->is_admin()) {

            redirect('dashboard');

        } else {

            $this->load->view('login', $data);

        }

    }

    public function login() {

        $email = $this->input->post('email');
        $password = md5($this->input->post('password'));
        
        if ($this->User_model->get(array('email' => $email, 'password' => $password, 'permissions' => 1)) && $this->User_model->auth($email, $password)) {

            redirect('dashboard', 'refresh');

        } else {
            redirect('/login', 'refresh');
        }
    }

    public function dashboard() {

        if ($this->User_model->is_admin()) {

            $data['title'] = 'Dashboard';
            $data['channels'] = $this->Channel_model->get(array('id >' => 0));

            $this->load->view('dashboard', $data);

        } else {
            redirect('/', 'refresh');
        }
    }

    public function channel($id) {

        if ($this->User_model->is_admin()) {

            $data['channel'] = $this->Channel_model->get(array('id' => $id));
            $data['traks'] = $this->Trak_model->get_channel_traks($id);
            $data['title'] = $data['channel']->title;

            $this->load->view('channel', $data);

        } else {
            redirect('/', 'refresh');
        }

    }

    public function sign_out() {

        $this->session->unset_userdata('id');
        $this->session->unset_userdata('email');
        $this->session->unset_userdata('logged_in');

        redirect('/', 'refresh');

    }

}