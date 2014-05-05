<?php

class User_model extends CI_Model {

    public function auth($name, $password) {

        $this->db->where('name', $name);
        $this->db->where('password', $password);

        $query = $this->db->get('users');

        if ($query->num_rows() == 1) {

            $row = $query->row();

            $cookie = array(
                'id' => $row->id,
                'name' => $row->name,
                'logged_in' => true
            );

            $this->session->set_userdata($cookie);

            return $cookie;

        } else {

            return false;

        }

    }

    public function is_authed() {
        
        if ($this->session->userdata('logged_in')) {

            return true;
        
        } else {
        
            return false;
        
        }
    }

    public function is_admin() {
        
        if ($this->session->userdata('logged_in')) {

            $id = $this->session->userdata('id');

            if ($this->User_model->get(array('id' => $id, 'permissions' => 1))) {

                return true;

            } else {

                return false;

            }
        
        } else {
        
            return false;
        
        }
    }

}