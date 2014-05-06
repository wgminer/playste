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

    // public function is_admin() {
        
    //     if ($this->session->userdata('logged_in')) {

    //         $name = $this->session->userdata($name);

    //         if ($this->Crud_model->get(array('name' => 'admin'))) {

    //             return true;

    //         } else {

    //             return false;

    //         }
        
    //     } else {
        
    //         return false;
        
    //     }
    // }

}